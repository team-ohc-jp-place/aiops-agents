import { NextResponse } from "next/server"
import { processAgentMessage } from "@/lib/agents"

export async function POST(req: Request) {
  const { messages } = await req.json()

  try {
    const response = await processAgentMessage(messages)
    return NextResponse.json(response)
  } catch (error) {
    console.error('Agent processing error:', error)
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    )
  }
}