import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ListX,
  Frown,
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronUp
} from "lucide-react";

function RoadmapList({ filterTopic = "", onSelect }) {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchRoadmaps(filterTopic);
  }, [filterTopic]);

  const fetchRoadmaps = async (topic) => {
    setLoading(true);
    setError(null);
    setRoadmaps([]);

    try {
      const url = `https://roadmap-generator-backend-vc1n.onrender.com/api/roadmap/all?topic=${encodeURIComponent(
        topic.trim()
      )}`;
      const { data } = await axios.get(url);

      if (data.success) {
        setRoadmaps(data.data);
      } else {
        setError(data.error || "Failed to fetch roadmaps.");
      }
    } catch (err) {
      setError("Network or server error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const toggleContent = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-4 text-gray-100">

      {/* Loading */}
      {loading && (
        <div className="flex flex-col justify-center items-center gap-3 py-6">
          <Loader2 className="animate-spin h-7 w-7 text-indigo-400" />
          <p className="text-gray-300">Loading roadmaps...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-5 bg-red-900 border border-red-600 rounded-xl text-center">
          <Frown className="h-8 w-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {/* No Roadmaps */}
      {!loading && !error && roadmaps.length === 0 && (
        <div className="p-6 bg-gray-800 border border-gray-700 rounded-xl text-center">
          <ListX className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-gray-300 font-semibold">
            No saved roadmaps found.
          </p>
        </div>
      )}

      {/* Roadmap Items */}
      {roadmaps.map((item) => {
        const isExpanded = expandedId === item._id;

        return (
          <div
            key={item._id}
            className="bg-gray-800 border-l-4 border-indigo-400 rounded-2xl shadow hover:shadow-xl transition-all"
          >
            {/* Header */}
            <button
              onClick={() => {
                toggleContent(item._id);
                onSelect(item.content);
              }}
              className="w-full p-5 flex items-center justify-between text-left
                         hover:bg-gray-700 rounded-t-2xl"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="text-purple-300" />
                <h2 className="font-bold text-indigo-300">{item.topic}</h2>
              </div>

              {isExpanded ? (
                <ChevronUp className="text-indigo-300" />
              ) : (
                <ChevronDown className="text-indigo-300" />
              )}
            </button>

            {/* Content */}
            <div
              className={`transition-all duration-500 overflow-hidden
                ${isExpanded ? "max-h-[600px] py-4 opacity-100" : "max-h-0 py-0 opacity-0"}
                px-5`}
            >
              <p className="text-sm text-gray-400 mb-2">
                Created: {new Date(item.createdAt).toLocaleDateString()}
              </p>

              {/* Always dark-mode readable */}
              <div
                className="prose prose-invert max-w-none text-sm roadmap-output"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default RoadmapList;
