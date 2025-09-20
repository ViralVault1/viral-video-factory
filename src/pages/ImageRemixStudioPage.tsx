// Generate remix prompt
  const generateRemixPrompt = async () => {
    if (!selectedImage) {
      toast.error('Please select an image to remix');
      return;
    }

    try {
      const promptGenerationPrompt = `Create an optimized image remix prompt based on:
        
        Original image analysis: ${imageAnalysis?.content?.substring(0, 300) || 'Image uploaded'}
        Desired style: ${remixConfig.style}
        Remix type: ${remixConfig.remix_type}
        Intensity: ${remixConfig.intensity}
        Mood: ${remixConfig.mood}
        Color scheme: ${remixConfig.colorScheme}
        Preserve subject: ${remixConfig.preserve_subject ? 'Yes' : 'No'}
        Creative freedom: ${remixConfig.creative_freedom}
        
        Generate a detailed, specific prompt for AI image remix that will:
        1. Preserve important elements if specified
        2. Apply the desired style transformation
        3. Enhance the image according to settings
        4. Create the desired mood and atmosphere
        5. Use appropriate technical terms
        
        Make it optimized for AI image processing.`;

      const result = await promptEnhancer.execute(
        TaskType.CONTENT_STRATEGY,
        promptGenerationPrompt,
        { maxTokens: 500, temperature: 0.8 }
      );

      const enhancedPrompt = extractRemixPrompt(result.content);
      setRemixConfig(prev => ({ ...prev, custom_prompt: enhancedPrompt }));
      toast.success('Remix prompt generated!');
    } catch (error) {
      console.error('Remix prompt generation failed:', error);
    }
  };

  // Process image remix
  const processImageRemix = async () => {
    if (!selectedImage) {
      toast.error('Please select an image to remix');
      return;
    }

    setIsProcessing(true);

    try {
      // Build remix prompt
      const remixPrompt = remixConfig.custom_prompt || buildRemixPrompt();
      
      // Simulate image processing (replace with actual API call)
      const result = await simulateImageRemix(selectedImage, remixPrompt);

      const remixedImage = {
        id: Date.now(),
        originalId: selectedImage.id,
        originalUrl: selectedImage.url,
        url: result.url,
        prompt: remixPrompt,
        style: remixConfig.style,
        remixType: remixConfig.remix_type,
        intensity: remixConfig.intensity,
        mood: remixConfig.mood,
        colorScheme: remixConfig.colorScheme,
        processedAt: new Date(),
        processingTime: result.processingTime,
        liked: false,
        bookmarked: false,
        downloadCount: 0
      };

      setRemixedImages(prev => [remixedImage, ...prev]);
      
      // Add to history
      setRemixHistory(prev => [{
        id: Date.now(),
        originalImage: selectedImage.name,
        style: remixConfig.style,
        remixType: remixConfig.remix_type,
        timestamp: new Date(),
        resultId: remixedImage.id
      }, ...prev.slice(0, 19)]);

      toast.success('Image remix completed!');
    } catch (error) {
      console.error('Image remix failed:', error);
      toast.error('Image remix failed');
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate batch remixes
  const generateBatchRemixes = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    const batchStyles = ['artistic', 'vintage', 'modern', 'abstract', 'photorealistic'];
    const tasks = batchStyles.map((style, index) => ({
      id: `remix_${index}`,
      originalImage: selectedImage,
      style,
      remixType: remixConfig.remix_type,
      intensity: remixConfig.intensity
    }));

    setIsProcessing(true);

    try {
      const results = await Promise.all(
        tasks.map(async (task) => {
          const prompt = buildRemixPrompt(task.style);
          const result = await simulateImageRemix(task.originalImage, prompt);
          return {
            ...task,
            url: result.url,
            prompt,
            processingTime: result.processingTime
          };
        })
      );

      const batchRemixes = results.map((result, index) => ({
        id: Date.now() + index,
        originalId: selectedImage.id,
        originalUrl: selectedImage.url,
        url: result.url,
        prompt: result.prompt,
        style: result.style,
        remixType: result.remixType,
        intensity: result.intensity,
        processedAt: new Date(),
        isBatch: true,
        batchId: Date.now(),
        liked: false,
        bookmarked: false
      }));

      setRemixedImages(prev => [...batchRemixes, ...prev]);
      toast.success(`Generated ${batchRemixes.length} remix variations!`);
    } catch (error) {
      console.error('Batch remix failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Utility functions
  const buildRemixPrompt = (overrideStyle = null) => {
    const style = overrideStyle || remixConfig.style;
    return `Transform this image to ${style} style, ${remixConfig.intensity} intensity, ${remixConfig.mood} mood, ${remixConfig.colorScheme} colors, ${remixConfig.remix_type} transformation${remixConfig.preserve_subject ? ', preserve main subject' : ''}, high quality, detailed`;
  };

  const simulateImageRemix = async (imageData, prompt) => {
    // Simulate processing time
    const processingTime = Math.random() * 3000 + 2000;
    await new Promise(resolve => setTimeout(resolve, processingTime));
    
    // In a real implementation, this would call your image processing API
    return {
      url: `${imageData.url}?remix=${Date.now()}`, // Placeholder - would be actual processed image
      processingTime: Math.round(processingTime)
    };
  };

  const extractStyleSuggestions = (content) => {
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    return lines.slice(0, 8).map((line, index) => ({
      id: index,
      title: line.substring(0, 50),
      description: line.trim(),
      popularity: Math.floor(Math.random() * 100) + 1
    }));
  };

  const parseStyleSuggestions = (content) => {
    const suggestions = [];
    const sections = content.split(/\d+\./).filter(s => s.trim());
    
    sections.slice(0, 8).forEach((section, index) => {
      const lines = section.trim().split('\n');
      suggestions.push({
        id: index,
        title: lines[0]?.trim() || `Style ${index + 1}`,
        description: section.trim(),
        popularity: Math.floor(Math.random() * 100) + 1
      });
    });
    
    return suggestions;
  };

  const extractRemixPrompt = (content) => {
    const lines = content.split('\n');
    const promptLine = lines.find(line => 
      line.toLowerCase().includes('prompt') || 
      line.length > 50
    );
    return promptLine ? promptLine.trim() : content.split('\n')[0];
  };

  const downloadImage = async (imageData) => {
    try {
      const response = await fetch(imageData.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `remixed_${imageData.style}_${imageData.id}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Update download count
      setRemixedImages(prev => 
        prev.map(img => 
          img.id === imageData.id 
            ? { ...img, downloadCount: (img.downloadCount || 0) + 1 }
            : img
        )
      );
      
      toast.success('Image downloaded!');
    } catch (error) {
      toast.error('Download failed');
    }
  };

  const toggleLike = (imageId) => {
    setRemixedImages(prev => 
      prev.map(img => 
        img.id === imageId ? { ...img, liked: !img.liked } : img
      )
    );
  };

  const toggleBookmark = (imageId) => {
    setRemixedImages(prev => 
      prev.map(img => 
        img.id === imageId ? { ...img, bookmarked: !img.bookmarked } : img
      )
    );
  };

  const copyPrompt = (prompt) => {
    navigator.clipboard.writeText(prompt);
    toast.success('Prompt copied to clipboard!');
  };

  // Upload Tab
  const UploadTab = () => (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Image to Remix
        </h3>

        <div className="space-y-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-colors"
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Upload an Image</h4>
            <p className="text-gray-500 mb-4">
              Drag and drop an image here, or click to browse
            </p>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Choose File
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Uploaded Images */}
      {originalImages.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Uploaded Images</h3>
            <div className="text-sm text-gray-500">
              {originalImages.length} images uploaded
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {originalImages.map((image) => (
              <div
                key={image.id}
                onClick={() => setSelectedImage(image)}
                className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage?.id === image.id ? 'border-blue-500' : 'border-transparent'
                }`}
              >
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-48 object-cover"
                />
                
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        analyzeImage(image);
                      }}
                      disabled={imageAnalyzer.isLoading}
                      className="p-2 bg-white text-gray-800 rounded-full hover:bg-gray-100 disabled:opacity-50"
                      title="Analyze Image"
                    >
                      <BarChart3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(image);
                        setActiveTab('remix');
                      }}
                      className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                      title="Start Remix"
                    >
                      <Wand2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="absolute bottom-2 left-2 right-2">
                  <div className="bg-black bg-opacity-70 text-white p-2 rounded text-sm">
                    <p className="font-medium truncate">{image.name}</p>
                    <div className="flex items-center gap-2 text-xs mt-1">
                      <span>{(image.size / 1024).toFixed(0)}KB</span>
                      {image.analyzed && (
                        <span className="px-1 py-0.5 bg-green-500 rounded text-xs">
                          Analyzed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Analysis */}
      {imageAnalysis && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">AI Image Analysis</h3>
            <LLMStatus 
              taskType={TaskType.IMAGE_ANALYSIS}
              provider={imageAnalysis.provider}
            />
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-800">
              {imageAnalysis.content}
            </pre>
          </div>
          
          <div className="flex gap-2 mt-4">
            <button
              onClick={generateStyleSuggestions}
              disabled={styleGenerator.isLoading}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 flex items-center gap-2"
            >
              <Lightbulb className="h-4 w-4" />
              Get Style Suggestions
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Remix Tab
  const RemixTab = () => (
    <div className="space-y-6">
      {!selectedImage && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-yellow-800">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Please upload and select an image first</span>
          </div>
        </div>
      )}

      {/* Remix Configuration */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          Remix Configuration
          {selectedImage && (
            <span className="text-sm text-gray-500 ml-2">for {selectedImage.name}</span>
          )}
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remix Type
              </label>
              <select
                value={remixConfig.remix_type}
                onChange={(e) => setRemixConfig(prev => ({ ...prev, remix_type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                disabled={!selectedImage}
              >
                {remixTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {remixTypes.find(t => t.value === remixConfig.remix_type)?.description}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Style
              </label>
              <select
                value={remixConfig.style}
                onChange={(e) => setRemixConfig(prev => ({ ...prev, style: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                disabled={!selectedImage}
              >
                {styles.map(style => (
                  <option key={style} value={style}>
                    {style.replace('_', ' ').charAt(0).toUpperCase() + style.replace('_', ' ').slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intensity
              </label>
              <select
                value={remixConfig.intensity}
                onChange={(e) => setRemixConfig(prev => ({ ...prev, intensity: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                disabled={!selectedImage}
              >
                {intensities.map(intensity => (
                  <option key={intensity.value} value={intensity.value}>
                    {intensity.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {intensities.find(i => i.value === remixConfig.intensity)?.description}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mood
              </label>
              <select
                value={remixConfig.mood}
                onChange={(e) => setRemixConfig(prev => ({ ...prev, mood: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                disabled={!selectedImage}
              >
                {moods.map(mood => (
                  <option key={mood} value={mood}>
                    {mood.charAt(0).toUpperCase() + mood.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Scheme
              </label>
              <select
                value={remixConfig.colorScheme}
                onChange={(e) => setRemixConfig(prev => ({ ...prev, colorScheme: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                disabled={!selectedImage}
              >
                {colorSchemes.map(scheme => (
                  <option key={scheme} value={scheme}>
                    {scheme.replace('_', ' ').charAt(0).toUpperCase() + scheme.replace('_', ' ').slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Creative Freedom
              </label>
              <select
                value={remixConfig.creative_freedom}
                onChange={(e) => setRemixConfig(prev => ({ ...prev, creative_freedom: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                disabled={!selectedImage}
              >
                {creativeFreedom.map(freedom => (
                  <option key={freedom.value} value={freedom.value}>
                    {freedom.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={remixConfig.preserve_subject}
                onChange={(e) => setRemixConfig(prev => ({ ...prev, preserve_subject: e.target.checked }))}
                className="rounded"
                disabled={!selectedImage}
              />
              <span className="text-sm">Preserve Main Subject</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={remixConfig.enhance_quality}
                onChange={(e) => setRemixConfig(prev => ({ ...prev, enhance_quality: e.target.checked }))}
                className="rounded"
                disabled={!selectedImage}
              />
              <span className="text-sm">Enhance Quality</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Prompt (Optional)
            </label>
            <textarea
              value={remixConfig.custom_prompt}
              onChange={(e) => setRemixConfig(prev => ({ ...prev, custom_prompt: e.target.value }))}
              placeholder="Add specific instructions for the remix..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              disabled={!selectedImage}
            />
            <div className="flex items-center gap-2 mt-2">
              <LLMCostEstimator 
                taskType={TaskType.CONTENT_STRATEGY} 
                inputText={`${remixConfig.style} ${remixConfig.remix_type} ${remixConfig.custom_prompt}`} 
              />
              <button
                onClick={generateRemixPrompt}
                disabled={promptEnhancer.isLoading || !selectedImage}
                className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 text-sm flex items-center gap-1"
              >
                <Bot className="h-3 w-3" />
                AI Enhance
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={processImageRemix}
              disabled={isProcessing || !selectedImage}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
            >
              {isProcessing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4" />
              )}
              Remix Image
            </button>

            <button
              onClick={generateBatchRemixes}
              disabled={isProcessing || !selectedImage}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Batch Remix (5 styles)
            </button>
          </div>
        </div>
      </div>

      {/* Style Suggestions */}
      {stylesuggestions.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">AI Style Suggestions</h3>
            <button
              onClick={() => setStyleSuggestions([])}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {stylesuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  // Apply suggestion to config
                  const words = suggestion.title.toLowerCase().split(' ');
                  const matchedStyle = styles.find(style => 
                    words.some(word => style.includes(word) || word.includes(style))
                  );
                  if (matchedStyle) {
                    setRemixConfig(prev => ({ ...prev, style: matchedStyle }));
                  }
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-sm">{suggestion.title}</h4>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-gray-500">{suggestion.popularity}%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600">
                  {suggestion.description.substring(0, 120)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Original Image Preview */}
      {selectedImage && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Selected Image</h3>
          <div className="flex items-start gap-4">
            <img
              src={selectedImage.url}
              alt={selectedImage.name}
              className="w-32 h-32 object-cover rounded-lg"
            />
            <div>
              <h4 className="font-medium">{selectedImage.name}</h4>
              <div className="text-sm text-gray-600 space-y-1 mt-2">
                <div>Size: {(selectedImage.size / 1024).toFixed(0)}KB</div>
                <div>Uploaded: {selectedImage.uploadedAt.toLocaleString()}</div>
                <div>Status: {selectedImage.analyzed ? 'Analyzed' : 'Ready'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Gallery Tab
  const GalleryTab = () => (
    <div className="space-y-6">
      {remixedImages.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Palette className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Remixed Images Yet</h3>
          <p className="text-gray-500 mb-4">
            Upload an image and create remixes to see them here.
          </p>
          <button
            onClick={() => setActiveTab('upload')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Start Remixing
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Remixed Images</h2>
            <div className="text-sm text-gray-500">
              {remixedImages.length} remixes created
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {remixedImages.map((image) => (
              <div key={image.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden group">
                <div className="relative">
                  <img
                    src={image.url}
                    alt={`${image.style} remix`}
                    className="w-full h-48 object-cover"
                  />
                  
                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => downloadImage(image)}
                        className="p-2 bg-white text-gray-800 rounded-full hover:bg-gray-100"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => copyPrompt(image.prompt)}
                        className="p-2 bg-white text-gray-800 rounded-full hover:bg-gray-100"
                        title="Copy Prompt"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => toggleLike(image.id)}
                      className={`p-1 rounded-full ${image.liked ? 'bg-red-500 text-white' : 'bg-white text-gray-600'}`}
                    >
                      <Heart className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => toggleBookmark(image.id)}
                      className={`p-1 rounded-full ${image.bookmarked ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
                    >
                      <Bookmark className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Batch indicator */}
                  {image.isBatch && (
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-purple-500 text-white text-xs rounded-full">
                        Batch
                      </span>
                    </div>
                  )}
                </div>

                {/* Image Info */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Palette className="h-4 w-4 text-purple-500" />
                    <span className="font-medium text-sm">{image.style.replace('_', ' ')}</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {image.remixType.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>Intensity: {image.intensity}</div>
                    <div>Mood: {image.mood}</div>
                    <div>Created: {image.processedAt.toLocaleTimeString()}</div>
                    {image.downloadCount > 0 && (
                      <div>{image.downloadCount} downloads</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  // History Tab
  const HistoryTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Remix History
        </h3>
        
        {remixHistory.length > 0 ? (
          <div className="space-y-3">
            {remixHistory.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{entry.originalImage}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Style: {entry.style}</span>
                    <span>Type: {entry.remixType.replace('_', ' ')}</span>
                    <span>{entry.timestamp.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const resultImage = remixedImages.find(img => img.id === entry.resultId);
                      if (resultImage) {
                        // Scroll to result in gallery
                        setActiveTab('gallery');
                      }
                    }}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  >
                    View Result
                  </button>
                  <button
                    onClick={() => {
                      const resultImage = remixedImages.find(img => img.id === entry.resultId);
                      if (resultImage) {
                        // Apply same settings
                        setRemixConfig(prev => ({
                          ...prev,
                          style: resultImage.style,
                          remixType: resultImage.remixType,
                          intensity: resultImage.intensity,
                          mood: resultImage.mood
                        }));
                        setActiveTab('remix');
                      }
                    }}
                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                  >
                    Reuse Settings
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No History Yet</h3>
            <p className="text-gray-500">
              Your remix history will appear here once you start creating remixes.
            </p>
          </div>
        )}
      </div>

      {/* Statistics */}
      {remixedImages.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Remix Statistics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{remixedImages.length}</div>
              <div className="text-sm text-gray-600">Total Remixes</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {new Set(remixedImages.map(img => img.style)).size}
              </div>
              <div className="text-sm text-gray-600">Styles Explored</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {remixedImages.reduce((sum, img) => sum + (img.downloadCount || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Downloads</div>
            </div>
          </div>

          {/* Popular Styles */}
          <div className="mt-6">
            <h4 className="font-medium mb-3">Most Used Styles</h4>
            <div className="space-y-2">
              {Object.entries(
                remixedImages.reduce((acc, img) => {
                  acc[img.style] = (acc[img.style] || 0) + 1;
                  return acc;
                }, {})
              )
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([style, count]) => (
                  <div key={style} className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {style.replace('_', ' ').charAt(0).toUpperCase() + style.replace('_', ' ').slice(1)}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(count / remixedImages.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Image Remix Studio</h1>
                <p className="text-gray-600">Transform and enhance images with intelligent AI-powered remixing</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right text-sm">
                <div className="text-gray-500">Images Uploaded</div>
                <div className="font-semibold text-gray-900">{originalImages.length}</div>
              </div>
              <div className="text-right text-sm">
                <div className="text-gray-500">Remixes Created</div>
                <div className="font-semibold text-gray-900">{remixedImages.length}</div>
              </div>
              <div className="text-right text-sm">
                <div className="text-gray-500">AI Status</div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-green-600">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="flex space-x-1 p-1">
            {[
              { id: 'upload', label: 'Upload & Analyze', icon: Upload },
              { id: 'remix', label: 'AI Remix', icon: Wand2 },
              { id: 'gallery', label: 'Gallery', icon: Image },
              { id: 'history', label: 'History', icon: Clock }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'upload' && <UploadTab />}
        {activeTab === 'remix' && <RemixTab />}
        {activeTab === 'gallery' && <GalleryTab />}
        {activeTab === 'history' && <HistoryTab />}
      </div>
    </div>
  );
};

export default ImageRemixStudioPage;// src/pages/ImageRemixStudioPage.js (Upgraded with LLM Router)
// Replace your existing ImageRemixStudioPage with this upgraded version

import React, { useState, useEffect, useRef } from 'react';
import { 
  Image, 
  Wand2, 
  Sparkles, 
  RefreshCw,
  Upload,
  Download,
  Copy,
  Eye,
  EyeOff,
  Zap,
  Palette,
  Camera,
  Layers,
  RotateCcw,
  Maximize2,
  Crop,
  Filter,
  Adjust,
  Blend,
  PaintBucket,
  Brush,
  Eraser,
  Move,
  Type,
  Circle,
  Square,
  Triangle,
  Star,
  Heart,
  Settings,
  BarChart3,
  TrendingUp,
  Target,
  CheckCircle,
  AlertCircle,
  Plus,
  X,
  Share2,
  Bookmark,
  Clock,
  Bot,
  Lightbulb
} from 'lucide-react';
import { useLLM, useBatchLLM } from '../hooks/useLLM';
import { TaskType } from '../services/llmRouter';
import LLMStatus, { LLMCostEstimator } from '../components/LLMStatus';
import { apiService } from '../services/apiService';
import toast from 'react-hot-toast';

const ImageRemixStudioPage = () => {
  // LLM Hooks for different remix tasks
  const promptEnhancer = useLLM(TaskType.CONTENT_STRATEGY);
  const imageAnalyzer = useLLM(TaskType.IMAGE_ANALYSIS);
  const styleGenerator = useLLM(TaskType.CONTENT_STRATEGY);
  const batchProcessor = useBatchLLM();

  // UI State
  const [activeTab, setActiveTab] = useState('upload');
  const [originalImages, setOriginalImages] = useState([]);
  const [remixedImages, setRemixedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  // Remix Configuration
  const [remixConfig, setRemixConfig] = useState({
    style: 'artistic',
    intensity: 'medium',
    colorScheme: 'vibrant',
    mood: 'creative',
    artistic_style: 'digital_art',
    remix_type: 'style_transfer',
    preserve_subject: true,
    enhance_quality: true,
    custom_prompt: '',
    blend_ratio: 0.7,
    creative_freedom: 'medium'
  });

  // Analysis State
  const [imageAnalysis, setImageAnalysis] = useState(null);
  const [stylesuggestions, setStyleSuggestions] = useState([]);
  const [remixHistory, setRemixHistory] = useState([]);

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const styles = [
    'artistic', 'photorealistic', 'cartoon', 'anime', 'sketch', 'oil_painting',
    'watercolor', 'digital_art', 'vintage', 'modern', 'minimalist', 'abstract',
    'cyberpunk', 'steampunk', 'gothic', 'renaissance', 'impressionist', 'pop_art'
  ];

  const intensities = [
    { value: 'subtle', label: 'Subtle (20%)', description: 'Light touch, preserve original' },
    { value: 'medium', label: 'Medium (50%)', description: 'Balanced transformation' },
    { value: 'strong', label: 'Strong (80%)', description: 'Dramatic change' },
    { value: 'extreme', label: 'Extreme (100%)', description: 'Complete transformation' }
  ];

  const remixTypes = [
    { value: 'style_transfer', label: 'Style Transfer', description: 'Apply artistic style to image' },
    { value: 'content_aware', label: 'Content Aware', description: 'Smart object manipulation' },
    { value: 'mood_change', label: 'Mood Change', description: 'Alter emotional tone' },
    { value: 'era_transform', label: 'Era Transform', description: 'Change time period/era' },
    { value: 'genre_remix', label: 'Genre Remix', description: 'Switch artistic genre' },
    { value: 'color_remix', label: 'Color Remix', description: 'Advanced color manipulation' },
    { value: 'composition', label: 'Composition', description: 'Restructure layout' },
    { value: 'fusion', label: 'Fusion', description: 'Blend multiple concepts' }
  ];

  const moods = [
    'creative', 'dramatic', 'peaceful', 'energetic', 'mysterious', 'vintage',
    'futuristic', 'romantic', 'dark', 'bright', 'warm', 'cool', 'professional', 'playful'
  ];

  const colorSchemes = [
    'vibrant', 'muted', 'monochrome', 'warm', 'cool', 'pastel',
    'high_contrast', 'earth_tones', 'neon', 'sepia', 'black_white', 'complementary'
  ];

  const creativeFreedom = [
    { value: 'low', label: 'Low', description: 'Stay close to original' },
    { value: 'medium', label: 'Medium', description: 'Balanced creativity' },
    { value: 'high', label: 'High', description: 'Maximum creativity' }
  ];

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = {
        id: Date.now(),
        file,
        url: e.target.result,
        name: file.name,
        size: file.size,
        uploadedAt: new Date(),
        analyzed: false
      };

      setOriginalImages(prev => [imageData, ...prev]);
      setSelectedImage(imageData);
      setUploadedFile(file);
      toast.success('Image uploaded successfully!');
    };

    reader.readAsDataURL(file);
  };

  // Analyze uploaded image with AI
  const analyzeImage = async (imageData) => {
    if (!imageData) return;

    try {
      const analysisPrompt = `Analyze this image for creative remix possibilities:
        
        Please provide:
        1. Subject and composition analysis
        2. Current style and artistic elements
        3. Color palette and mood assessment
        4. Suitable remix styles and transformations
        5. Creative enhancement opportunities
        6. Potential artistic directions
        7. Technical quality assessment
        8. Recommended preservation areas
        
        Focus on creative potential and transformation possibilities.`;

      const result = await imageAnalyzer.analyzeImage(imageData.url, 'creative remix analysis');

      const analysis = {
        imageId: imageData.id,
        content: result.content,
        provider: result.provider,
        timestamp: new Date(),
        suggestions: extractStyleSuggestions(result.content)
      };

      setImageAnalysis(analysis);
      
      // Mark image as analyzed
      setOriginalImages(prev => 
        prev.map(img => 
          img.id === imageData.id ? { ...img, analyzed: true, analysis } : img
        )
      );

      toast.success('Image analysis completed!');
    } catch (error) {
      console.error('Image analysis failed:', error);
    }
  };

  // Generate style suggestions
  const generateStyleSuggestions = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    try {
      const suggestionsPrompt = `Based on the uploaded image, generate 8 creative remix style suggestions:
        
        Image context: ${imageAnalysis?.content?.substring(0, 200) || 'User uploaded image'}
        Current remix type: ${remixConfig.remix_type}
        
        For each suggestion, provide:
        1. Style name and description
        2. Transformation approach
        3. Expected visual outcome
        4. Artistic inspiration
        5. Technical considerations
        
        Focus on diverse, creative, and achievable transformations.
        Make suggestions specific and inspiring.`;

      const result = await styleGenerator.execute(
        TaskType.CONTENT_STRATEGY,
        suggestionsPrompt,
        { maxTokens: 1500, temperature: 0.9 }
      );

      const suggestions = parseStyleSuggestions(result.content);
      setStyleSuggestions(suggestions);
      toast.success('Style suggestions generated!');
    } catch (error) {
      console.error('Style suggestions failed:', error);
    }
  };

  // Generate remix prompt
  const generateRemixPrompt = async () => {
    if (!selectedImage) {
