import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM, Message } from "./_core/llm";

/**
 * AI Router to handle multiple AI models and services.
 * This router will be the central point for all AI-related requests.
 */
export const aiRouter = router({
  /**
   * General chat endpoint that can route to different models.
   * Currently uses the built-in invokeLLM which defaults to gemini-2.5-flash.
   * In the future, this can be expanded to support Groq, HuggingFace, etc.
   */
  chat: publicProcedure
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
      const { messages, model } = input;

      // Map the input messages to the format expected by invokeLLM
      const llmMessages: Message[] = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      try {
        const result = await invokeLLM({
          messages: llmMessages,
          // Note: Currently invokeLLM has a hardcoded model, 
          // but we're passing it here for future extensibility.
        });

        const choice = result.choices[0];
        if (!choice || !choice.message) {
          throw new Error("No response from AI model");
        }

        // Handle both string and array content
        const content = typeof choice.message.content === "string" 
          ? choice.message.content 
          : JSON.stringify(choice.message.content);

        return {
          content,
          model: result.model,
        };
      } catch (error) {
        console.error("AI Chat Error:", error);
        throw new Error("Failed to get response from AI. Please try again later.");
      }
    }),
});
