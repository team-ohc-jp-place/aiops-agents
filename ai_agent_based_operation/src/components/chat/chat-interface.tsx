"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { useChat } from "@/hooks/use-chat"

interface Message {
  role: "user" | "assistant"
  content: string
  sender?: string
}

export function ChatInterface() {
  const { messages, sendMessage, isLoading } = useChat()

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, i) => (
            <ChatMessage key={i} message={message} />
          ))}
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <ChatInput
          onSend={sendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}