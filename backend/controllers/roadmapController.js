import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";
import Roadmap from "../models/RoadmapModel.js";
import { marked } from "marked";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateRoadmap(req, res) {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, error: "Prompt is required" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const cleanPrompt = `
      Create a clean, well-structured learning roadmap for: "${prompt}".

      Rules:
      - Do NOT use *, #, or markdown symbols.
      - Use clean headings, subheadings and bullet lists.
      - Use neat spacing.
      - Output must be plain text only.
    `;

    const result = await model.generateContent(cleanPrompt);
    const response = await result.response;
    const textOutput = response.text();

    // Convert clean text → HTML
    const htmlContent = marked.parse(textOutput);

    const saved = await Roadmap.create({
      topic: prompt,
      content: htmlContent,
    });

    res.json({ success: true, data: saved });

  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ success: false, error: "Failed to generate roadmap" });
  }
}

export async function getRoadmaps(req, res) {
  try {
    const { topic } = req.query; // Extract the 'topic' from the URL query parameters
    let filter = {};

    if (topic && topic.trim() !== "") {
      // Use a case-insensitive regular expression for flexible searching
      // This will match any roadmap where the topic field CONTAINS the requested topic.
      // If you need an exact match, use: filter = { topic: topic.trim() };
      filter = { topic: { $regex: new RegExp(topic.trim(), 'i') } };
    }

    // Apply the filter to the Mongoose query
    const all = await Roadmap.find(filter).sort({ createdAt: -1 }).lean();

    res.json({ success: true, data: all });
  } catch (error) {
    console.error("Database error:", error); // Log the error on the server side
    res.status(500).json({ success: false, error: "Failed to fetch roadmaps" });
  }
}