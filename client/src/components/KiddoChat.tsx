import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AIChatBox, type Message } from "@/components/AIChatBox";
import { MessageSquare, X, Minus, Zap, ShieldCheck, Activity } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function KiddoChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [mode, setMode] = useState<"fast" | "pro">("fast");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "Hello! I'm Kiddo, your intelligent AI assistant. I'm currently in Fast Mode. Switch to Pro Mode for complex tasks like image generation or web search.",
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  const kiddoMutation = trpc.kiddo.chat.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content },
      ]);
      if (data.status === "blocked") {
        toast.warning("Switch to Pro Mode for this task.");
      }
      setIsProcessing(false);
    },
    onError: (error) => {
      console.error("Kiddo chat error:", error);
      toast.error("Failed to get response from Kiddo. Please try again.");
      setIsProcessing(false);
    },
  });

  const handleSendMessage = (content: string) => {
    const newMessages: Message[] = [...messages, { role: "user", content }];
    setMessages(newMessages);
    setIsProcessing(true);
    
    kiddoMutation.mutate({
      messages: newMessages,
      mode: mode,
    });
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 size-14 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 bg-indigo-600 text-white"
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
        className="bg-indigo-700 text-white p-4 rounded-t-lg flex items-center justify-between cursor-pointer"
        onClick={() => isMinimized && setIsMinimized(false)}
      >
        <div className="flex items-center gap-2">
          <div className="size-2 bg-green-400 rounded-full animate-pulse" />
          <span className="font-semibold">Kiddo AI</span>
        </div>
        <div className="flex items-center gap-1">
          {!isMinimized && (
            <div className="flex items-center space-x-2 mr-4 bg-indigo-800/50 px-2 py-1 rounded-full">
              <Label htmlFor="mode-switch" className="text-[10px] uppercase font-bold">
                {mode === "fast" ? "Fast" : "Pro"}
              </Label>
              <Switch
                id="mode-switch"
                checked={mode === "pro"}
                onCheckedChange={(checked) => setMode(checked ? "pro" : "fast")}
                className="scale-75"
              />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-white hover:bg-white/10"
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
            className="size-8 text-white hover:bg-white/10"
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
          isLoading={isProcessing || kiddoMutation.isPending}
          className="rounded-t-none border-t-0 h-full"
          placeholder={`Ask Kiddo anything in ${mode} mode...`}
          emptyStateMessage={`Hello! I'm Kiddo. I'm currently in ${mode} mode. How can I help you today?`}
          suggestedPrompts={[
            "How to apply for a National ID?",
            "What are the steps for passport renewal?",
            "Generate an image of a sunset (Pro Mode)",
            "Search for latest AI news (Pro Mode)",
          ]}
        />
      )}
    </div>
  );
}
