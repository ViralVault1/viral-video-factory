                await new Promise((resolve, reject) => {
                    video.onloadeddata = resolve;
                    video.onerror = (e) => reject(new Error(`Failed to load video element: ${JSON.stringify(e)}`));
                });
                return video;
            })
        );
        
        return await new Promise((resolve, reject) => {
            recorder.onstop = () => {
                audioContext.close();
                videoElements.forEach(v => v && URL.revokeObjectURL(v.src));
                const completeBlob = new Blob(chunks, { type: 'video/webm' });
                resolve(completeBlob);
            };
            recorder.onerror = (e) => reject(new Error(`MediaRecorder error: ${e}`));
            
            const sceneDurations = scenes.map(s => estimateSceneDuration(s.script));
            const sceneEndTimes = sceneDurations.reduce((acc, duration) => {
                const lastEndTime = acc.length > 0 ? acc[acc.length - 1] : 0;
                acc.push(lastEndTime + duration);
                return acc;
            }, [] as number[]);

            let sceneIndex = 0;
            let animationFrameId: number;

            const renderLoop = async () => {
                try {
                    const currentTime = audioContext.currentTime;
                    if (currentTime >= voiceoverBuffer.duration) {
                        if (recorder.state === 'recording') recorder.stop();
                        cancelAnimationFrame(animationFrameId);
                        return;
                    }

                    if (sceneIndex < sceneEndTimes.length - 1 && currentTime > sceneEndTimes[sceneIndex]) {
                        videoElements[sceneIndex]?.pause();
                        sceneIndex++;
                        const nextVideo = videoElements[sceneIndex];
                        if (nextVideo) {
                            nextVideo.currentTime = 0;
                            await nextVideo.play().catch(reject);
                        }
                    }
                    
                    onProgress(`Rendering scene ${sceneIndex + 1} of ${scenes.length}...`);
                    const currentVideo = videoElements[sceneIndex];

                    if (currentVideo && !currentVideo.paused) {
                        const scale = Math.max(canvas.width / currentVideo.videoWidth, canvas.height / currentVideo.videoHeight);
                        const x = (canvas.width / 2) - (currentVideo.videoWidth / 2) * scale;
                        const y = (canvas.height / 2) - (currentVideo.videoHeight / 2) * scale;
                        ctx.drawImage(currentVideo, x, y, currentVideo.videoWidth * scale, currentVideo.videoHeight * scale);
                    } else {
                        ctx.fillStyle = 'black';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                    }

                    if (isGuest) {
                        ctx.font = '24px sans-serif';
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                        ctx.textAlign = 'left';
                        ctx.fillText('Made with Viral Video Factory', 20, canvas.height - 20);
                    }

                    animationFrameId = requestAnimationFrame(renderLoop);
                } catch (renderError) {
                    reject(new Error("A rendering error occurred in the animation loop."));
                }
            };

            recorder.start();
            voiceoverSource.start(0);
            musicSource?.start(0);
            
            if (videoElements[0]) videoElements[0].play().catch(reject);
            animationFrameId = requestAnimationFrame(renderLoop);
        });
    } catch (error) {
