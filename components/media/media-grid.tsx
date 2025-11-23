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

interface MediaGridProps {
  files: MediaFile[]
  onDelete: (id: string) => void
}

export function MediaGrid({ files, onDelete }: MediaGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {files.map((file) => (
        <Card key={file.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
          {/* Thumbnail */}
          <div className="relative h-40 bg-secondary overflow-hidden">
            {file.type === "image" ? (
              <img src={file.url || "/placeholder.svg"} alt={file.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎥</div>
                  <p className="text-xs text-muted-foreground">Video</p>
                </div>
              </div>
            )}
            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button size="sm" variant="outline" className="text-white hover:text-white gap-1 bg-transparent">
                <Copy className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="text-white hover:text-white gap-1 bg-transparent">
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

          {/* Info */}
          <div className="p-4">
            <p className="font-medium text-foreground truncate mb-1">{file.name}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{file.size} MB</span>
              <span>{file.uploadedDate}</span>
            </div>
            {file.dimensions && <p className="text-xs text-muted-foreground mt-2">{file.dimensions}</p>}
          </div>
        </Card>
      ))}
    </div>
  )
}
