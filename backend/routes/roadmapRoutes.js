import express from "express";
import { generateRoadmap, getRoadmaps } from "../controllers/roadmapController.js";

const router = express.Router();

router.post("/generate", generateRoadmap);
router.get("/all", getRoadmaps);

export default router;
