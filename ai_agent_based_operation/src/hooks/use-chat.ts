import { useState } from 'react'

interface Message {
  role: "user" | "assistant"
  content: string
  sender?: string
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (content: string) => {
    setIsLoading(true)

    try {
      const newMessages = [...messages, { role: "user", content }]

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      setMessages([...newMessages, ...data.messages])
    } catch (error) {
      console.error('Chat error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return { messages, sendMessage, isLoading }
}