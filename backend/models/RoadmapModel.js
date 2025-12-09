import mongoose from "mongoose";

const roadmapSchema = new mongoose.Schema({
  topic: { type: String, required: true }, // Added this to store the user's prompt
  content: { type: String, required: true }, // Renamed 'text' to 'content' for clarity
  createdAt: { type: Date, default: Date.now }
});

const Roadmap = mongoose.model("Roadmap", roadmapSchema);

export default Roadmap;