import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM, Message } from "./_core/llm";

/**
 * Enhanced AI Router with service integration capability.
 * This router intelligently routes requests to different services based on user intent.
 */

interface ServiceCall {
  type: "image" | "search" | "code" | "chat";
  prompt?: string;
  query?: string;
  language?: string;
}

/**
 * Analyze user message to determine if it requires a service call
 */
function analyzeForServiceCall(message: string): ServiceCall | null {
  const lowerMessage = message.toLowerCase();

  // Image generation
  if (
    lowerMessage.includes("generate image") ||
    lowerMessage.includes("create image") ||
    lowerMessage.includes("draw") ||
    lowerMessage.includes("picture of") ||
    lowerMessage.includes("image of")
  ) {
    const prompt = message
      .replace(/generate image of /i, "")
      .replace(/create image of /i, "")
      .replace(/draw /i, "")
      .replace(/picture of /i, "")
      .replace(/image of /i, "");
    return { type: "image", prompt: prompt.trim() };
  }

  // Web search
  if (
    lowerMessage.includes("search for") ||
    lowerMessage.includes("find information") ||
    lowerMessage.includes("what is") ||
    lowerMessage.includes("tell me about") ||
    lowerMessage.includes("latest news") ||
    lowerMessage.includes("current")
  ) {
    const query = message
      .replace(/search for /i, "")
      .replace(/find information about /i, "")
      .replace(/what is /i, "")
      .replace(/tell me about /i, "")
      .replace(/latest news about /i, "")
      .replace(/current /i, "");
    return { type: "search", query: query.trim() };
  }

  // Code generation
  if (
    lowerMessage.includes("write code") ||
    lowerMessage.includes("generate code") ||
    lowerMessage.includes("create function") ||
    lowerMessage.includes("python script") ||
    lowerMessage.includes("javascript code")
  ) {
    const prompt = message
      .replace(/write code for /i, "")
      .replace(/generate code for /i, "")
      .replace(/create function /i, "")
      .replace(/python script /i, "")
      .replace(/javascript code /i, "");
    return { type: "code", prompt: prompt.trim() };
  }

  return null;
}

export const aiRouterEnhanced = router({
  /**
   * Smart chat endpoint that can route to services or general AI
   */
  smartChat: publicProcedure
    .input(
      z.object({
        messages: z.array(
          z.object({
            role: z.enum(["system", "user", "assistant"]),
            content: z.string(),
          })
        ),
        model: z.string().optional().default("gemini-2.5-flash"),
      })
    )
    .mutation(async ({ input }) => {
      const { messages } = input;
      const lastUserMessage = messages
        .slice()
        .reverse()
        .find((m) => m.role === "user");

      if (!lastUserMessage) {
        throw new Error("No user message found");
      }

      // Check if this requires a service call
      const serviceCall = analyzeForServiceCall(lastUserMessage.content);

      if (serviceCall) {
        // Return service call instruction for the client to handle
        return {
          type: "service_call",
          service: serviceCall.type,
          data: serviceCall,
          message: `I'll help you with that. Let me ${serviceCall.type === "image" ? "generate an image" : serviceCall.type === "search" ? "search for information" : "write code"} for you.`,
        };
      }

      // Otherwise, use the general AI chat
      const llmMessages: Message[] = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      try {
        const result = await invokeLLM({
          messages: llmMessages,
        });

        const choice = result.choices[0];
        if (!choice || !choice.message) {
          throw new Error("No response from AI model");
        }

        const content =
          typeof choice.message.content === "string"
            ? choice.message.content
            : JSON.stringify(choice.message.content);

        return {
          type: "chat",
          content,
          model: result.model,
        };
      } catch (error) {
        console.error("AI Chat Error:", error);
        throw new Error("Failed to get response from AI. Please try again later.");
      }
    }),

  /**
   * Get suggestions based on current context
   */
  getSuggestions: publicProcedure
    .input(
      z.object({
        context: z.string().optional(),
      })
    )
    .query(({ input }) => {
      const suggestions = [
        "Generate an image of a sunset",
        "Search for latest AI news",
        "Write a Python function",
        "Tell me about government services",
        "How do I apply for a National ID?",
      ];

      return { suggestions };
    }),
});
