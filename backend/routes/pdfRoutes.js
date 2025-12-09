import express from "express";
import PDFDocument from "pdfkit";
import Roadmap from "../models/RoadmapModel.js"; // Fixed import path (Case sensitive!)

const router = express.Router();

router.get("/export/:id", async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);
    if (!roadmap) return res.status(404).json({ error: "Not found" });

    const doc = new PDFDocument();

    // Set headers so the browser knows it's a PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="roadmap-${Date.now()}.pdf"`
    );

    doc.pipe(res);

    // Title
    doc.fontSize(20).text(`Roadmap: ${roadmap.topic}`, { underline: true });
    doc.moveDown();

    // Content
    doc.fontSize(12).text(roadmap.content, {
      align: 'left',
      lineGap: 2
    });

    doc.end();
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "PDF export failed" });
  }
});

export default router;