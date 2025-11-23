"use client"

import { Card } from "@/components/ui/card"

interface StorageIndicatorProps {
  used: number
  total: number
}

export function StorageIndicator({ used, total }: StorageIndicatorProps) {
  const percentage = (used / total) * 100
  const remaining = total - used

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Storage Usage</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {used.toFixed(1)} GB of {total} GB used
          </p>
        </div>
        <p className="text-sm font-medium text-accent">{remaining.toFixed(1)} GB available</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent transition-all"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {percentage > 80 && (
        <p className="text-xs text-destructive mt-2">
          You're using over 80% of your storage. Consider upgrading or deleting unused files.
        </p>
      )}
    </Card>
  )
}
