import React, { useState, useEffect } from "react";
import axios from "axios";
import { Send, Loader2, Download, PlusCircle } from "lucide-react";

function RoadmapChat({ loadText = "", reloadList, onNewChat }) {
  const [prompt, setPrompt] = useState("");
  const [roadmap, setRoadmap] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentRoadmapId, setCurrentRoadmapId] = useState(null);

  useEffect(() => {
    if (loadText) {
      setRoadmap(loadText);
    }
  }, [loadText]);

  const sendPrompt = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setRoadmap("");
    setCurrentRoadmapId(null);

    try {
      const res = await axios.post("https://roadmap-generator-backend-vc1n.onrender.com/api/roadmap/generate", {
        prompt,
      });

      if (res.data.success) {
        setRoadmap(res.data.data.content);
        setCurrentRoadmapId(res.data.data._id);
        reloadList();
      }
    } catch (err) {
      setRoadmap(`<p class='text-red-400 font-semibold'>
                    Error generating roadmap. Please check your server.
                  </p>`);
    }

    setLoading(false);
  };

  const handleDownload = () => {
    if (!currentRoadmapId) return;
    window.open(`https://roadmap-generator-backend-vc1n.onrender.com/api/export/${currentRoadmapId}`, "_blank");
  };

  return (
    <div className="w-full text-gray-100">

      {/* New Chat Button */}
      <button
        onClick={() => {
          setPrompt("");
          setRoadmap("");
          setCurrentRoadmapId(null);
          onNewChat();
        }}
        className="mb-4 inline-flex items-center gap-2 px-3 py-2 
                   bg-gray-700 text-gray-200 rounded-lg shadow 
                   hover:bg-gray-600 transition"
      >
        <PlusCircle size={18} />
        New Chat
      </button>

      {/* Input Box */}
      <div className="bg-gray-800 p-5 rounded-2xl shadow-lg border border-gray-700 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">

          <input
            type="text"
            className="flex-1 px-4 py-3 rounded-xl border border-gray-600 
                       bg-gray-700 text-gray-200 placeholder-gray-400
                       focus:ring-2 focus:ring-indigo-600 outline-none shadow-inner"
            placeholder="Enter a topic (Ex: AI Engineer, Full Stack Developer...)"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
          />

          <button
            onClick={sendPrompt}
            disabled={loading || !prompt.trim()}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl 
            text-white font-bold shadow transition-all active:scale-95
            ${
              loading || !prompt.trim()
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                Generating...
              </>
            ) : (
              <>
                Generate <Send className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-48 bg-gray-800
                        rounded-2xl shadow-xl border border-gray-700">
          <Loader2 className="animate-spin h-10 w-10 text-indigo-400" />
          <p className="ml-4 text-gray-300 text-xl">Generating roadmap…</p>
        </div>
      )}

      {/* Output Box */}
      {roadmap && !loading && (
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 
                        border-t-4 border-indigo-500 max-h-[70vh] overflow-y-auto">

          {/* ROADMAP CONTENT (ALWAYS DARK MODE) */}
          <div
            className="prose prose-invert max-w-none leading-relaxed roadmap-output"
            dangerouslySetInnerHTML={{ __html: roadmap }}
          />

          {/* Download Button */}
          {currentRoadmapId && (
            <div className="mt-6 text-right">
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg
                           bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow"
              >
                <Download size={20} />
                Download PDF
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RoadmapChat;
