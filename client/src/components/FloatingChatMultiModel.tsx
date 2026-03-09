import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AIChatBox, type Message } from "@/components/AIChatBox";
import { MessageSquare, X, Minus, Settings, ChevronDown } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function FloatingChatMultiModel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content:
        "You are a helpful AI assistant for the eGov.bd portal. You can help users find services, explain government processes, and answer questions. You can also generate images, search the web, and help with coding. You have access to multiple AI models to provide the best service.",
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedModel, setSelectedModel] = useState({
    provider: "groq" as const,
    model: "llama3-8b-8192",
    name: "Llama 3 8B (Fast)",
  });

  const { data: availableModels } = trpc.multiModel.getAvailableModels.useQuery();

  const multiModelMutation = trpc.multiModel.chat.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.content },
        ]);
      } else {
        toast.error(data.content || "Failed to get response from model");
      }
      setIsProcessing(false);
    },
    onError: (error) => {
      console.error("Multi-model chat error:", error);
      toast.error("Failed to get response from AI. Please try again.");
      setIsProcessing(false);
    },
  });

  const handleSendMessage = (content: string) => {
    const newMessages: Message[] = [...messages, { role: "user", content }];
    setMessages(newMessages);
    setIsProcessing(true);
    
    multiModelMutation.mutate({
      messages: newMessages,
      config: {
        provider: selectedModel.provider,
        model: selectedModel.model,
      },
    });
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
          {/* Model Selector */}
          {!isMinimized && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-primary-foreground hover:bg-primary-foreground/10 flex items-center gap-1"
                >
                  {selectedModel.name}
                  <ChevronDown className="size-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Select AI Model</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {availableModels && Object.entries(availableModels).map(([provider, models]) => (
                  <div key={provider}>
                    <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground px-2 py-1">
                      {provider}
                    </DropdownMenuLabel>
                    {models.map((model: any) => (
                      <DropdownMenuItem
                        key={model.id}
                        onClick={() => setSelectedModel({ provider: provider as any, model: model.id, name: model.name })}
                        className="text-xs"
                      >
                        {model.name}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
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
          isLoading={isProcessing || multiModelMutation.isPending}
          className="rounded-t-none border-t-0 h-full"
          placeholder={`Ask ${selectedModel.name} anything...`}
          emptyStateMessage={`Hello! I'm your eGov AI assistant powered by ${selectedModel.name}. How can I help you today?`}
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
