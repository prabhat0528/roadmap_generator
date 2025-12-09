Backend -> FIlename: config/db.js -> import mongoose from "mongoose";



const connectDB = async () => {

  try {

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

  } catch (err) {

    console.error("MongoDB Error: ", err);

    process.exit(1);

  }

};



export default connectDB;

 filename: controllers/roadmapcontroller.js -> // 1. Ensure you install this: npm install @google/generative-ai

import { GoogleGenerativeAI } from "@google/generative-ai";

import Roadmap from "../models/RoadmapModel.js";



// Initialize the client

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);



// Generate new roadmap

export async function generateRoadmap(req, res) {

  try {

    const { prompt } = req.body;



    // 2. Validate input to prevent API crashes

    if (!prompt) {

      return res.status(400).json({ 

        success: false, 

        error: "Prompt is required" 

      });

    }



    // 3. Use a valid model version (1.5-flash is current best for speed)

    const model = genAI.getGenerativeModel({ 

      model: "gemini-1.5-flash" 

    });



    // Optional: Add system instructions to ensure the output is actually a roadmap

    // const model = genAI.getGenerativeModel({ 

    //   model: "gemini-1.5-flash",

    //   systemInstruction: "You are a career coach. Generate a step-by-step learning roadmap."

    // });



    const result = await model.generateContent(prompt);

    const response = await result.response;

    const text = response.text();



    const saved = await Roadmap.create({

      text,

      createdAt: new Date()

    });



    res.json({ success: true, data: saved });



  } catch (error) {

    console.error("Gemini Error:", error);

    

    // Check if it's a specific API key issue

    if (error.message?.includes('API key')) {

        return res.status(401).json({ success: false, error: "Invalid API configuration" });

    }



    res.status(500).json({ success: false, error: "Failed to generate roadmap" });

  }

}



// Get all saved roadmaps

export async function getRoadmaps(req, res) {

  try {

    // 4. Added lean() for better performance if you only need JSON reading

    const all = await Roadmap.find().sort({ createdAt: -1 }).lean();

    res.json({ success: true, data: all });

  } catch (error) {

    console.error("Get Roadmaps Error:", error);

    res.status(500).json({ success: false, error: "Failed to fetch roadmaps" });

  }

}  Filename: models/roadmapModel.js -> import mongoose from "mongoose";



const roadmapSchema = new mongoose.Schema({

  text: { type: String, required: true },

  createdAt: { type: Date, default: Date.now }

});



const Roadmap = mongoose.model("Roadmap", roadmapSchema);



export default Roadmap;

filename: routes/pdfRoutes.js -> import express from "express";

import PDFDocument from "pdfkit";

import Roadmap from "../models/Roadmap.js";



const router = express.Router();



router.get("/export/:id", async (req, res) => {

  try {

    const roadmap = await Roadmap.findById(req.params.id);

    if (!roadmap) return res.status(404).json({ error: "Not found" });



    const doc = new PDFDocument();



    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(

      "Content-Disposition",

      `attachment; filename=${roadmap.topic}.pdf`

    );



    doc.pipe(res);



    doc.fontSize(20).text(`Roadmap: ${roadmap.topic}`, { underline: true });

    doc.moveDown();



    doc.fontSize(14).text(`Duration: ${roadmap.duration}`);

    doc.moveDown();



    doc.fontSize(12).text(roadmap.roadmapText);



    doc.end();

    

  } catch (error) {

    console.error(error);

    res.status(500).json({ error: "PDF export failed" });

  }

});



export default router;

Filename: routes/roadmapRoutes.js -> import express from "express";

import { generateRoadmap, getRoadmaps } from "../controllers/roadmapController.js";



const router = express.Router();



router.post("/generate", generateRoadmap);

router.get("/all", getRoadmaps);



export default router;

 Filename: .env -> GEMINI_API_KEY=AIzaSyAI8BBHypkXZXuqh1QYjh6jSXwUPBFNG5E

MONGO_URI=mongodb+srv://yuvrajsinghrajpoot521_db_user:Yuvrajsingh17@cluster0.jyfej7x.mongodb.net/?appName=Cluster0

PORT=5000  Filename: server.js -> import dotenv from "dotenv";

dotenv.config();

import express from "express";

import cors from "cors";

import mongoose from "mongoose";

import roadmapRoutes from "./routes/roadmapRoutes.js";



const app = express();



app.use(cors());

app.use(express.json());



// MongoDB Connect

mongoose

  .connect(process.env.MONGO_URI)

  .then(() => console.log("MongoDB Connected"))

  .catch((err) => console.error("MongoDB Error:", err));



app.use("/api/roadmap", roadmapRoutes);



app.listen(process.env.PORT, () =>

  console.log(`🚀 Server running on port ${process.env.PORT}`)

);

so this backend part now frontend part   Filename: api.js -> import axios from "axios";



const API = "http://localhost:5000/api/roadmap";



export const generateRoadmap = (prompt) =>

  axios.post(`${API}/generate`, { prompt });



export const getRoadmaps = () =>

  axios.get(`${API}/all`);

Filename: App.jsx -> import React, { useState } from "react";

import RoadmapChat from "./RoadmapChat";

import RoadmapList from "./RoadmapList";

import "./App.css";



export default function App() {

  const [selectedRoadmap, setSelectedRoadmap] = useState("");



  return (

    <div className="app-container">

      <aside className="sidebar">

        <h2>📚 Saved Roadmaps</h2>

        <RoadmapList onSelect={setSelectedRoadmap} />

      </aside>



      <main className="chat-section">

        <h1>🚀 Roadmap Generator (Chatbot)</h1>

        <RoadmapChat loadText={selectedRoadmap} />

      </main>

    </div>

  );

}

Filename: App.css -> .app-container {

  display: flex;

  height: 100vh;

  background: #121212;

  color: white;

  font-family: Arial;

}



.sidebar {

  width: 25%;

  padding: 20px;

  background: #1c1c1c;

  border-right: 1px solid #333;

  overflow-y: auto;

}



.chat-section {

  flex: 1;

  padding: 20px;

}



.chat-container {

  display: flex;

  flex-direction: column;

  height: 85vh;

}



.messages-box {

  flex: 1;

  overflow-y: auto;

  padding: 15px;

  background: #181818;

  border-radius: 10px;

}



.msg {

  margin-bottom: 12px;

  padding: 12px;

  border-radius: 8px;

  white-space: pre-wrap;

}



.msg.user {

  background: #0078ff;

  align-self: flex-end;

}



.msg.assistant {

  background: #333;

  align-self: flex-start;

}



.input-box {

  display: flex;

  margin-top: 10px;

}



input {

  flex: 1;

  padding: 12px;

  border-radius: 8px;

  border: none;

  outline: none;

}



button {

  padding: 12px 20px;

  background: #0078ff;

  border: none;

  color: white;

  border-radius: 8px;

  margin-left: 10px;

  cursor: pointer;

}



.roadmap-list {

  margin-top: 20px;

}



.roadmap-item {

  padding: 12px;

  background: #282828;

  border-radius: 8px;

  cursor: pointer;

  margin-bottom: 10px;

}



.roadmap-item:hover {

  background: #333;

}

Filename: RoadmapChat.jsx -> import React, { useState, useEffect } from "react";

import { generateRoadmap } from "./api";



export default function RoadmapChat({ loadText }) {

  const [messages, setMessages] = useState([

    {

      role: "assistant",

      text: "👋 Hi! I'm your Roadmap Assistant.\n\nAsk something like:\n➡ 'Create a MERN roadmap for 2 months'"

    }

  ]);



  const [input, setInput] = useState("");



  useEffect(() => {

    if (loadText) {

      setMessages(prev => [...prev, { role: "assistant", text: loadText }]);

    }

  }, [loadText]);



  const sendMessage = async () => {

    if (!input.trim()) return;



    const userMessage = { role: "user", text: input };

    setMessages(prev => [...prev, userMessage]);



    setInput("");



    try {

      const res = await generateRoadmap(input);

      const aiText = res.data.data.text;



      const aiMessage = { role: "assistant", text: aiText };

      setMessages(prev => [...prev, aiMessage]);



    } catch (err) {

      setMessages(prev => [

        ...prev,

        { role: "assistant", text: "❌ Error generating roadmap." }

      ]);

    }

  };



  return (

    <div className="chat-container">

      <div className="messages-box">

        {messages.map((msg, i) => (

          <div key={i} className={`msg ${msg.role}`}>

            {msg.text}

          </div>

        ))}

      </div>



      <div className="input-box">

        <input

          value={input}

          onChange={(e) => setInput(e.target.value)}

          placeholder="Type your prompt..."

        />

        <button onClick={sendMessage}>Send</button>

      </div>

    </div>

  );

}

Filename: RoadmapForm.jsx -> import React, { useState } from "react";

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

Filename: RoadmapList.jsx -> import React, { useEffect, useState } from "react";

import { getRoadmaps } from "./api";



export default function RoadmapList({ onSelect }) {

  const [list, setList] = useState([]);



  useEffect(() => {

    loadRoadmaps();

  }, []);



  const loadRoadmaps = async () => {

    try {

      const res = await getRoadmaps();

      setList(res.data.data);

    } catch (err) {

      console.error("Failed to load roadmaps");

    }

  };



  return (

    <div className="roadmap-list">

      {list.length === 0 ? (

        <p>No roadmaps saved yet.</p>

      ) : (

        list.map(item => (

          <div

            key={item._id}

            className="roadmap-item"

            onClick={() => onSelect(item.text)}

          >

            <b>Roadmap</b>

            <p>{item.text.substring(0, 40)}...</p>

          </div>

        ))

      )}

    </div>

  );

}

Filename: -> RoadmapTimeline -> import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";

import "react-vertical-timeline-component/style.min.css";



export default function RoadmapTimeline({ roadmapText }) {

  if (!roadmapText) return null;



  // Split text by "Week" or dash for steps

  const steps = roadmapText.split(/Week|week|DAY|Day|-/).filter(s => s.trim() !== "");



  return (

    <VerticalTimeline>

      {steps.map((step, index) => (

        <VerticalTimelineElement

          key={index}

          date={`Step ${index + 1}`}

          iconStyle={{ background: "#007bff", color: "#fff" }}

        >

          <h3 className="vertical-timeline-element-title">Milestone {index + 1}</h3>

          <p>{step.trim()}</p>

        </VerticalTimelineElement>

      ))}

    </VerticalTimeline>

  );

}