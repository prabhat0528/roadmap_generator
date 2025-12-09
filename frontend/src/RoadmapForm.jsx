import React, { useState } from "react";
import { generateRoadmap } from "./api";
import RoadmapTimeline from "./RoadmapTimeline";

export default function RoadmapForm({ onGenerated }) {
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [roadmapText, setRoadmapText] = useState("");

  const handleGenerate = async () => {
    if (!topic || !duration) {
      alert("Please enter topic and duration.");
      return;
    }
    setLoading(true);

    try {
      const res = await generateRoadmap({ topic, duration });
      setRoadmapText(res.data.roadmapText);

      if (onGenerated) onGenerated(res.data.roadmapText); 
    } catch (err) {
      console.error(err);
      alert("Failed to generate roadmap.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <input
          style={{ flex: 1 }}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter topic (e.g., MERN Stack)"
        />

        <input
          style={{ width: "180px" }}
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Duration (e.g., 2 months)"
        />

        <button onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {roadmapText && (
        <div>
          <h3>Generated Roadmap</h3>
          <pre style={{ whiteSpace: "pre-wrap", maxHeight: 300, overflow: "auto" }}>
            {roadmapText}
          </pre>

          <h3>Timeline View</h3>
          <RoadmapTimeline roadmapText={roadmapText} />
        </div>
      )}
    </div>
  );
}
