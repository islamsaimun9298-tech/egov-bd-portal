import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AIChatBox, type Message } from "@/components/AIChatBox";
import { MessageSquare, X, Minus } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "system", 
      content: "You are a helpful AI assistant for the eGov.bd portal. You can help users find services, explain government processes, and answer questions about National ID, Passports, Taxes, and more. You have access to multiple AI models to provide the best service." 
    },
  ]);

  const chatMutation = trpc.ai.chat.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content },
      ]);
    },
    onError: (error) => {
      console.error("Chat error:", error);
      toast.error("Failed to get response from AI. Please try again.");
    },
  });

  const handleSendMessage = (content: string) => {
    const newMessages: Message[] = [...messages, { role: "user", content }];
    setMessages(newMessages);
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
      <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex items-center justify-between cursor-pointer"
           onClick={() => isMinimized && setIsMinimized(false)}>
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
          isLoading={chatMutation.isPending}
          className="rounded-t-none border-t-0 h-full"
          placeholder="Ask me anything about government services..."
          emptyStateMessage="Hello! I'm your eGov AI assistant. How can I help you today?"
          suggestedPrompts={[
            "How to apply for a National ID?",
            "What are the steps for passport renewal?",
            "How do I file my taxes online?",
            "Find health services near me",
          ]}
        />
      )}
    </div>
  );
}
