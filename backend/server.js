import dotenv from "dotenv";
dotenv.config(); // Must be at the very top
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js"; // Use your config file
import roadmapRoutes from "./routes/roadmapRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js"; // Import the PDF routes

const app = express();

// Connect Database
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/roadmap", roadmapRoutes);
app.use("/api", pdfRoutes); // Mount PDF routes (e.g., /api/export/:id)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));