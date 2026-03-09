import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { ENV } from "./_core/env";

/**
 * Service Router handles specialized services like image generation, web search, etc.
 * Each service can use different free APIs and is designed to be called from the AI chat.
 */

/**
 * Image Generation Service using Hugging Face Inference API (Free Tier)
 * Models: stabilityai/stable-diffusion-2, runwayml/stable-diffusion-v1-5
 */
async function generateImage(prompt: string): Promise<string> {
  const hfToken = process.env.HUGGING_FACE_API_KEY;
  if (!hfToken) {
    throw new Error("HUGGING_FACE_API_KEY is not configured");
  }

  const response = await fetch(
    "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2",
    {
      headers: { Authorization: `Bearer ${hfToken}` },
      method: "POST",
      body: JSON.stringify({ inputs: prompt }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Image generation failed: ${error}`);
  }

  const blob = await response.blob();
  const buffer = await blob.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  return `data:image/png;base64,${base64}`;
}

/**
 * Web Search Service using Perplexity API (Free Tier)
 * Provides real-time web search results
 */
async function searchWeb(query: string): Promise<string> {
  const perplexityKey = process.env.PERPLEXITY_API_KEY;
  if (!perplexityKey) {
    throw new Error("PERPLEXITY_API_KEY is not configured");
  }

  const response = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${perplexityKey}`,
    },
    body: JSON.stringify({
      model: "pplx-7b-online",
      messages: [
        {
          role: "user",
          content: query,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Web search failed: ${error}`);
  }

  const data = await response.json() as { choices: Array<{ message: { content: string } }> };
  return data.choices[0]?.message?.content || "No results found";
}

/**
 * Code Generation Service using DeepSeek Coder (Free API)
 * Specialized for programming tasks
 */
async function generateCode(prompt: string, language: string = "python"): Promise<string> {
  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  if (!deepseekKey) {
    throw new Error("DEEPSEEK_API_KEY is not configured");
  }

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${deepseekKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-coder",
      messages: [
        {
          role: "system",
          content: `You are an expert ${language} programmer. Provide clean, well-documented code.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Code generation failed: ${error}`);
  }

  const data = await response.json() as { choices: Array<{ message: { content: string } }> };
  return data.choices[0]?.message?.content || "Failed to generate code";
}

/**
 * Intent Detection - Determines what service to use based on user input
 */
function detectIntent(message: string): "image" | "search" | "code" | "chat" {
  const lowerMessage = message.toLowerCase();

  // Image generation keywords
  if (
    lowerMessage.includes("generate image") ||
    lowerMessage.includes("create image") ||
    lowerMessage.includes("draw") ||
    lowerMessage.includes("picture") ||
    lowerMessage.includes("image of")
  ) {
    return "image";
  }

  // Web search keywords
  if (
    lowerMessage.includes("search") ||
    lowerMessage.includes("find") ||
    lowerMessage.includes("what is") ||
    lowerMessage.includes("tell me about") ||
    lowerMessage.includes("latest") ||
    lowerMessage.includes("current")
  ) {
    return "search";
  }

  // Code generation keywords
  if (
    lowerMessage.includes("code") ||
    lowerMessage.includes("write") ||
    lowerMessage.includes("function") ||
    lowerMessage.includes("script") ||
    lowerMessage.includes("program")
  ) {
    return "code";
  }

  return "chat";
}

export const serviceRouter = router({
  /**
   * Generate an image based on a text prompt
   */
  generateImage: publicProcedure
    .input(z.object({ prompt: z.string().min(1) }))
    .mutation(async ({ input }) => {
      try {
        const imageBase64 = await generateImage(input.prompt);
        return {
          success: true,
          image: imageBase64,
          message: "Image generated successfully",
        };
      } catch (error) {
        console.error("Image generation error:", error);
        return {
          success: false,
          message: "Failed to generate image. Please try again.",
        };
      }
    }),

  /**
   * Search the web for information
   */
  searchWeb: publicProcedure
    .input(z.object({ query: z.string().min(1) }))
    .mutation(async ({ input }) => {
      try {
        const results = await searchWeb(input.query);
        return {
          success: true,
          results,
        };
      } catch (error) {
        console.error("Web search error:", error);
        return {
          success: false,
          results: "Failed to search. Please try again.",
        };
      }
    }),

  /**
   * Generate code based on a prompt
   */
  generateCode: publicProcedure
    .input(
      z.object({
        prompt: z.string().min(1),
        language: z.string().default("python"),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const code = await generateCode(input.prompt, input.language);
        return {
          success: true,
          code,
        };
      } catch (error) {
        console.error("Code generation error:", error);
        return {
          success: false,
          code: "Failed to generate code. Please try again.",
        };
      }
    }),

  /**
   * Detect the intent of a user message
   */
  detectIntent: publicProcedure
    .input(z.object({ message: z.string().min(1) }))
    .query(({ input }) => {
      const intent = detectIntent(input.message);
      return { intent };
    }),
});
