import React, { useState, useEffect } from "react";

interface Video {
  id: string;
  title: string;
  videoUrl?: string;
  thumbnail?: string;
  status: "processing" | "completed" | "failed";
  createdAt: string;
}

export default function VideoGeneratorPage() {
  const [ideaInput, setIdeaInput] = useState("");
  const [generatedIdeas, setGeneratedIdeas] = useState<string[]>([]);
  const [isFindingIdeas, setIsFindingIdeas] = useState(false);

  const [script, setScript] = useState("");
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);

  const [visualPrompt, setVisualPrompt] = useState("");
  const [voice, setVoice] = useState("female");
  const [music, setMusic] = useState("cinematic");
  const [soundEffects, setSoundEffects] = useState(false);
  const [presetStyle, setPresetStyle] = useState("realistic");

  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generatedVideos, setGeneratedVideos] = useState<Video[]>([]);

  // Load stored videos on mount
  useEffect(() => {
    const stored = localStorage.getItem("videos");
    if (stored) setGeneratedVideos(JSON.parse(stored));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("videos", JSON.stringify(generatedVideos));
  }, [generatedVideos]);

  // ✅ 1. Find Video Ideas
  const handleFindIdeas = async () => {
    if (!ideaInput.trim()) return alert("Please enter a topic.");
    setIsFindingIdeas(true);

    try {
      const res = await fetch("https://hook.eu2.make.com/YOUR_FIND_IDEAS_WEBHOOK", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: ideaInput }),
      });

      if (!res.ok) throw new Error("Failed to fetch ideas");
      const data = await res.json();
      setGeneratedIdeas(data.ideas || ["Engaging Hook for TikTok", "Top 3 Tips Video"]);
    } catch (err) {
      console.error(err);
      alert("Error fetching ideas.");
    } finally {
      setIsFindingIdeas(false);
    }
  };

  // ✅ 2. Generate or Rewrite Script
  const handleGenerateScript = async (idea: string) => {
    setIsGeneratingScript(true);
    try {
      const res = await fetch("https://hook.eu2.make.com/YOUR_SCRIPT_GENERATION_WEBHOOK", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });

      if (!res.ok) throw new Error("Script generation failed");
      const data = await res.json();
      setScript(data.script || `Intro line for "${idea}"...`);
    } catch (err) {
      alert("Error generating script.");
    } finally {
      setIsGeneratingScript(false);
    }
  };

  // ✅ 3. Generate Video (calls your Make.com fal.ai workflow)
  const handleGenerateVideo = async () => {
    if (!script.trim()) return alert("Please write or generate a script first.");

    setIsGeneratingVideo(true);
    const payload = {
      script,
      visualPrompt: visualPrompt || `${presetStyle} style video scene`,
      voice,
      music,
      soundEffects,
      presetStyle,
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch("https://hook.eu2.make.com/oavuuxz6nq8u6lkl1e83vez7yhgdxdyy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Video generation failed (${res.status})`);
      const data = await res.json();

      const newVideo: Video = {
        id: `vid_${Date.now()}`,
        title: data.title || "New AI Video",
        videoUrl: data.videoUrl || "",
        thumbnail: data.thumbnail || "",
        status: "processing",
        createdAt: new Date().toISOString(),
      };

      setGeneratedVideos((prev) => [newVideo, ...prev]);
      alert("✅ Video generation started! Check progress in Make.com.");
    } catch (err) {
      console.error(err);
      alert("Error triggering video generation.");
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🎬 AI Video Generator Dashboard</h1>

      {/* --- IDEA FINDER --- */}
      <section className="mb-8 bg-gray-50 p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-2">Find Video Ideas</h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter topic or niche (e.g. Home Renovation)"
            value={ideaInput}
            onChange={(e) => setIdeaInput(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2"
          />
          <button
            onClick={handleFindIdeas}
            disabled={isFindingIdeas}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {isFindingIdeas ? "Finding..." : "Find Ideas"}
          </button>
        </div>

        {generatedIdeas.length > 0 && (
          <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {generatedIdeas.map((idea, i) => (
              <li
                key={i}
                onClick={() => handleGenerateScript(idea)}
                className="cursor-pointer border p-3 rounded-lg hover:bg-blue-50 transition"
                title="Click to generate script"
              >
                💡 {idea}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* --- SCRIPT EDITOR --- */}
      <section className="mb-8 bg-gray-50 p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-2">Edit or Generate Script</h2>
        <textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder="Enter or generate your video script..."
          className="w-full border rounded-lg p-3 min-h-[150px]"
        />
        <div className="flex justify-end mt-3">
          <button
            onClick={handleGenerateVideo}
            disabled={isGeneratingVideo}
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
          >
            {isGeneratingVideo ? "Generating..." : "🎥 Generate Video"}
          </button>
        </div>
      </section>

      {/* --- VIDEO CONTROLS --- */}
      <section className="mb-8 bg-gray-50 p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-3">Visual & Audio Settings</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 font-medium">Voice</label>
            <select
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="robotic">Robotic</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Music</label>
            <select
              value={music}
              onChange={(e) => setMusic(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="cinematic">Cinematic</option>
              <option value="lofi">Lofi</option>
              <option value="epic">Epic</option>
              <option value="pop">Pop</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Preset Style</label>
            <select
              value={presetStyle}
              onChange={(e) => setPresetStyle(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="realistic">Realistic</option>
              <option value="anime">Anime</option>
              <option value="cinematic">Cinematic</option>
              <option value="surreal">Surreal</option>
            </select>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <input
            type="checkbox"
            checked={soundEffects}
            onChange={() => setSoundEffects(!soundEffects)}
          />
          <label>Include Sound Effects</label>
        </div>
      </section>

      {/* --- GENERATED VIDEOS --- */}
      <section className="bg-gray-50 p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-3">Generated Videos</h2>
        {generatedVideos.length === 0 ? (
          <p className="text-gray-500">No videos yet. Generate one above 👆</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedVideos.map((vid) => (
              <div key={vid.id} className="border rounded-lg p-3 bg-white shadow-sm">
                <h3 className="font-medium">{vid.title}</h3>
                <p className="text-sm text-gray-500">{new Date(vid.createdAt).toLocaleString()}</p>
                {vid.videoUrl ? (
                  <video controls className="w-full mt-2 rounded-lg">
                    <source src={vid.videoUrl} type="video/mp4" />
                  </video>
                ) : (
                  <p className="mt-2 text-gray-400 italic">Processing...</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
