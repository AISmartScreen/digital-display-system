"use client"

import { Button } from "@/components/ui/button"
import { Save, Send, RotateCcw, Eye } from "lucide-react"
import { useState } from "react"

interface ActionBarProps {
  onSaveDraft: () => void
  onPublish: () => void
  lastSaved: string
  displayId: string
  customization?: any
}

export function ActionBar({ onSaveDraft, onPublish, lastSaved, displayId, customization }: ActionBarProps) {
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)

  const openFullPreview = () => {
    if (!customization) return

    setIsPreviewLoading(true)
    try {
      const configString = encodeURIComponent(JSON.stringify(customization))
      const previewUrl = `/displays/${displayId}/preview?config=${configString}`

      // Open in new window with fullscreen dimensions
      const width = 1920
      const height = 1080
      const left = Math.max(0, (screen.width - width) / 2)
      const top = Math.max(0, (screen.height - height) / 2)

      window.open(
        previewUrl,
        "display-preview",
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,fullscreen=no`,
      )
    } catch (error) {
      console.error("Error opening preview:", error)
    } finally {
      setIsPreviewLoading(false)
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-card border-t border-border px-4 md:px-8 py-4">
      <div className="max-w-full mx-auto flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">Last saved: {lastSaved}</p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Button variant="outline" onClick={onSaveDraft} className="gap-2 bg-transparent">
            <RotateCcw className="w-4 h-4" />
            Reset to Default
          </Button>

          <Button
            variant="outline"
            onClick={openFullPreview}
            disabled={isPreviewLoading}
            className="gap-2 bg-transparent"
          >
            <Eye className="w-4 h-4" />
            {isPreviewLoading ? "Opening..." : "Full Preview"}
          </Button>

          <Button variant="outline" onClick={onSaveDraft} className="gap-2 bg-transparent">
            <Save className="w-4 h-4" />
            Save Draft
          </Button>

          <Button onClick={onPublish} className="gap-2">
            <Send className="w-4 h-4" />
            Publish
          </Button>
        </div>
      </div>
    </div>
  )
}
