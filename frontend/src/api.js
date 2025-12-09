import axios from "axios";

const API = "http://localhost:5000/api/roadmap";

export const generateRoadmap = (prompt) =>
  axios.post(`${API}/generate`, { prompt });

export const getRoadmaps = () =>
  axios.get(`${API}/all`);
