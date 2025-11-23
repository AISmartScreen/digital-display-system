"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Trash2, Copy } from "lucide-react"

interface MediaFile {
  id: string
  name: string
  type: "image" | "video"
  size: number
  uploadedDate: string
  url: string
  dimensions?: string
}

interface MediaListProps {
  files: MediaFile[]
  onDelete: (id: string) => void
}

export function MediaList({ files, onDelete }: MediaListProps) {
  return (
    <Card className="divide-y divide-border">
      {files.map((file) => (
        <div
          key={file.id}
          className="p-4 hover:bg-secondary/30 transition-colors flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Thumbnail */}
            <div className="w-12 h-12 rounded bg-secondary flex items-center justify-center flex-shrink-0">
              {file.type === "image" ? (
                <img
                  src={file.url || "/placeholder.svg"}
                  alt={file.name}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <span className="text-lg">🎥</span>
              )}
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {file.size} MB • {file.uploadedDate}
                {file.dimensions && ` • ${file.dimensions}`}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-shrink-0">
            <Button size="sm" variant="outline" className="gap-1 bg-transparent">
              <Copy className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" className="gap-1 bg-transparent">
              <Download className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-destructive hover:text-destructive gap-1 bg-transparent"
              onClick={() => onDelete(file.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </Card>
  )
}
