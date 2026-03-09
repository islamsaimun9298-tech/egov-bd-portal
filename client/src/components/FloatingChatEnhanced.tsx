import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AIChatBox, type Message } from "@/components/AIChatBox";
import { MessageSquare, X, Minus, Loader2, Image as ImageIcon } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export function FloatingChatEnhanced() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content:
        "You are a helpful AI assistant for the eGov.bd portal. You can help users find services, explain government processes, and answer questions. You can also generate images, search the web, and help with coding. When a user asks for an image, web search, or code, I'll handle it intelligently.",
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  const chatMutation = trpc.ai.smartChat.useMutation({
    onSuccess: (data) => {
      if (data.type === "service_call") {
        // Handle service call
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.message },
        ]);

        // Call the appropriate service
        if (data.service === "image" && data.data.prompt) {
          handleImageGeneration(data.data.prompt);
        } else if (data.service === "search" && data.data.query) {
          handleWebSearch(data.data.query);
        } else if (data.service === "code" && data.data.prompt) {
          handleCodeGeneration(data.data.prompt);
        }
      } else {
        // Regular chat response
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.content },
        ]);
      }
      setIsProcessing(false);
    },
    onError: (error) => {
      console.error("Chat error:", error);
      toast.error("Failed to get response from AI. Please try again.");
      setIsProcessing(false);
    },
  });

  const imageGenMutation = trpc.services.generateImage.useMutation({
    onSuccess: (data) => {
      if (data.success && data.image) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `![Generated Image](${data.image})\n\n${data.message}`,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.message || "Failed to generate image" },
        ]);
      }
      setIsProcessing(false);
    },
    onError: (error) => {
      console.error("Image generation error:", error);
      toast.error("Failed to generate image. Please try again.");
      setIsProcessing(false);
    },
  });

  const webSearchMutation = trpc.services.searchWeb.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `**Search Results:**\n\n${data.results}` },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.results || "Failed to search" },
        ]);
      }
      setIsProcessing(false);
    },
    onError: (error) => {
      console.error("Web search error:", error);
      toast.error("Failed to search. Please try again.");
      setIsProcessing(false);
    },
  });

  const codeGenMutation = trpc.services.generateCode.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `\`\`\`\n${data.code}\n\`\`\`` },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.code || "Failed to generate code" },
        ]);
      }
      setIsProcessing(false);
    },
    onError: (error) => {
      console.error("Code generation error:", error);
      toast.error("Failed to generate code. Please try again.");
      setIsProcessing(false);
    },
  });

  const handleImageGeneration = (prompt: string) => {
    setIsProcessing(true);
    imageGenMutation.mutate({ prompt });
  };

  const handleWebSearch = (query: string) => {
    setIsProcessing(true);
    webSearchMutation.mutate({ query });
  };

  const handleCodeGeneration = (prompt: string) => {
    setIsProcessing(true);
    codeGenMutation.mutate({ prompt, language: "python" });
  };

  const handleSendMessage = (content: string) => {
    const newMessages: Message[] = [...messages, { role: "user", content }];
    setMessages(newMessages);
    setIsProcessing(true);
    chatMutation.mutate({ messages: newMessages });
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 size-14 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 bg-primary text-primary-foreground"
        size="icon"
      >
        <MessageSquare className="size-6" />
      </Button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex flex-col shadow-2xl transition-all duration-300 ease-in-out ${
        isMinimized ? "h-14 w-64" : "h-[600px] w-[400px] max-w-[calc(100vw-48px)]"
      }`}
    >
      {/* Header */}
      <div
        className="bg-primary text-primary-foreground p-4 rounded-t-lg flex items-center justify-between cursor-pointer"
        onClick={() => isMinimized && setIsMinimized(false)}
      >
        <div className="flex items-center gap-2">
          <div className="size-2 bg-green-400 rounded-full animate-pulse" />
          <span className="font-semibold">eGov AI Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-primary-foreground hover:bg-primary-foreground/10"
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
          >
            <Minus className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-primary-foreground hover:bg-primary-foreground/10"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>

      {/* Chat Body */}
      {!isMinimized && (
        <AIChatBox
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isProcessing || chatMutation.isPending}
          className="rounded-t-none border-t-0 h-full"
          placeholder="Ask me anything... (Try: 'Generate an image', 'Search for...', 'Write code')"
          emptyStateMessage="Hello! I'm your eGov AI assistant. I can help with services, answer questions, generate images, search the web, and write code!"
          suggestedPrompts={[
            "How to apply for a National ID?",
            "Generate an image of Bangladesh",
            "Search for passport renewal process",
            "Write a Python function",
          ]}
        />
      )}
    </div>
  );
}
