"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export default function OpenAiChatButton() {
  const openChat = () => {
    window.dispatchEvent(new Event("skillbridge:open-ai-chat"));
  };

  return (
    <Button size="lg" className="gap-2 w-fit" onClick={openChat} type="button">
      <MessageCircle className="h-4 w-4" />
      Try AI Chat Now
    </Button>
  );
}