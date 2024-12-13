import { ChatInterface } from "@/components/chat/chat-interface"
import { SystemStatus } from "@/components/monitoring/system-status"

export default function Home() {
  return (
    <div className="flex h-screen">
      {/* サイドバー: システム状態モニタリング */}
      <div className="w-80 border-r bg-muted p-4">
        <SystemStatus />
      </div>

      {/* メインコンテンツ: チャットインターフェース */}
      <div className="flex-1">
        <ChatInterface />
      </div>
    </div>
  )
}