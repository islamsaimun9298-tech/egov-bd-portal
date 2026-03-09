import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";

/**
 * Multi-Model Router handles requests to various AI providers.
 * Supports Groq, Gemini, HuggingFace, and OpenRouter.
 */

const MessageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string(),
});

const ModelConfigSchema = z.object({
  provider: z.enum(["groq", "gemini", "huggingface", "openrouter"]),
  model: z.string(),
  apiKey: z.string().optional(),
});

/**
 * Call Groq API
 */
async function callGroq(messages: any[], model: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not configured");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${error}`);
  }

  const data = await response.json() as any;
  return data.choices[0]?.message?.content || "No response from Groq";
}

/**
 * Call OpenRouter API
 */
async function callOpenRouter(messages: any[], model: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not configured");

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://egov.bd", // Optional
      "X-Title": "eGov AI Assistant", // Optional
    },
    body: JSON.stringify({
      model,
      messages,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${error}`);
  }

  const data = await response.json() as any;
  return data.choices[0]?.message?.content || "No response from OpenRouter";
}

/**
 * Call Hugging Face Chat API
 */
async function callHuggingFaceChat(messages: any[], model: string): Promise<string> {
  const apiKey = process.env.HUGGING_FACE_API_KEY;
  if (!apiKey) throw new Error("HUGGING_FACE_API_KEY is not configured");

  const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      inputs: messages[messages.length - 1].content,
      parameters: { max_new_tokens: 500 },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Hugging Face API error: ${error}`);
  }

  const data = await response.json() as any;
  return Array.isArray(data) ? data[0]?.generated_text : data.generated_text || "No response from Hugging Face";
}

export const multiModelRouter = router({
  /**
   * Chat with a specific model from a specific provider
   */
  chat: publicProcedure
    .input(
      z.object({
        messages: z.array(MessageSchema),
        config: ModelConfigSchema,
      })
    )
    .mutation(async ({ input }) => {
      const { messages, config } = input;

      try {
        let content = "";
        switch (config.provider) {
          case "groq":
            content = await callGroq(messages, config.model);
            break;
          case "openrouter":
            content = await callOpenRouter(messages, config.model);
            break;
          case "huggingface":
            content = await callHuggingFaceChat(messages, config.model);
            break;
          case "gemini":
            // Fallback to existing Gemini implementation or call directly
            content = "Gemini integration is handled by the core LLM service.";
            break;
          default:
            throw new Error("Unsupported provider");
        }

        return {
          success: true,
          content,
          provider: config.provider,
          model: config.model,
        };
      } catch (error: any) {
        console.error(`Multi-model chat error (${config.provider}):`, error);
        return {
          success: false,
          content: `Error: ${error.message}`,
          provider: config.provider,
          model: config.model,
        };
      }
    }),

  /**
   * Get available models for each provider
   */
  getAvailableModels: publicProcedure.query(() => {
    return {
      groq: [
        { id: "llama3-8b-8192", name: "Llama 3 8B (Fast)" },
        { id: "llama3-70b-8192", name: "Llama 3 70B (Powerful)" },
        { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B" },
      ],
      gemini: [
        { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
        { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
      ],
      openrouter: [
        { id: "openai/gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
        { id: "anthropic/claude-3-haiku", name: "Claude 3 Haiku" },
        { id: "google/gemini-pro-1.5", name: "Gemini Pro 1.5" },
      ],
      huggingface: [
        { id: "mistralai/Mistral-7B-Instruct-v0.2", name: "Mistral 7B" },
        { id: "meta-llama/Llama-2-7b-chat-hf", name: "Llama 2 7B" },
      ],
    };
  }),
});
