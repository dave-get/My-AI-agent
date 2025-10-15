import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tool } from "@langchain/core/tools";
import z from "zod";
import dotenv from "dotenv";
import { aboutMeTool } from "./tools/aboutme.js";

dotenv.config();

const model = new ChatGoogleGenerativeAI({
  model: "models/gemini-2.5-flash",
  apiKey: process.env.GOOGLE_API_KEY!,
});

export const agent = createReactAgent({
  llm: model,
  tools: [aboutMeTool],
}) as any;
