import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

async function testGemini() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent("Say hello, this is a test message!");
    console.log("✅ Gemini Response:");
    console.log(result.response.text());
  } catch (err) {
    console.error("❌ Error testing Gemini API:", err.message);
  }
}

testGemini();
