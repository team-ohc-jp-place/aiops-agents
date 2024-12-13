"use client"

import { useSystemStatus } from "@/hooks/use-system-status"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function SystemStatus() {
  const { status } = useSystemStatus()

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">System Status</h2>

      {Object.entries(status).map(([device, stats]) => (
        <Card key={device} className="p-4">
          <h3 className="font-medium">{device}</h3>
          <div className="mt-2 space-y-2">
            <div className="flex justify-between">
              <span>CPU:</span>
              <Badge variant={stats.cpu > 80 ? "destructive" : "default"}>
                {stats.cpu}%
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Memory:</span>
              <Badge variant={stats.memory > 80 ? "destructive" : "default"}>
                {stats.memory}%
              </Badge>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}