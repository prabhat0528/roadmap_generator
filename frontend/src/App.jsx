// App.jsx (Always Dark Mode)

import React, { useState, useEffect } from "react";
import RoadmapChat from "./RoadmapChat";
import RoadmapList from "./RoadmapList";
import { Menu, X } from "lucide-react";
import "./App.css"; // IMPORTANT

export default function App() {
  const [selectedRoadmap, setSelectedRoadmap] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* 🚀 Always enable dark mode on first load */
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const reloadList = () => setRefreshKey((p) => p + 1);
  const startNewChat = () => setSelectedRoadmap("");

  return (
    <div className="min-h-screen flex bg-gray-900">

      {/* MOBILE HEADER */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-gray-800 shadow md:hidden p-4 flex justify-between">
        <button onClick={() => setSidebarOpen(true)}>
          <Menu className="text-gray-100" size={28} />
        </button>

        <h1 className="font-bold text-indigo-300">Roadmap Generator</h1>
      </div>

      {/* SIDEBAR */}
      <aside
        className={`fixed md:static inset-y-0 left-0 w-72 bg-gray-800 border-r border-gray-700 
                    shadow-xl transform transition-transform duration-300
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="p-4 flex justify-between md:block">
          <h2 className="text-xl font-bold text-indigo-300">📚 Saved Roadmaps</h2>

          <button className="md:hidden p-2" onClick={() => setSidebarOpen(false)}>
            <X className="text-gray-300" size={26} />
          </button>
        </div>

        <div className="h-[calc(100vh-70px)] overflow-y-auto p-4">
          <RoadmapList onSelect={setSelectedRoadmap} key={refreshKey} />
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 mt-16 md:mt-0 overflow-y-auto text-gray-100">

        <h1 className="hidden md:block text-4xl font-extrabold text-indigo-300 mb-6">
          🚀 Roadmap Generator
        </h1>

        <RoadmapChat
          loadText={selectedRoadmap}
          reloadList={reloadList}
          onNewChat={startNewChat}
        />
      </main>
    </div>
  );
}
