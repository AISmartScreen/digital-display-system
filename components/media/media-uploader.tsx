"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"

interface MediaUploaderProps {
  onUpload: (file: any) => void
  onClose: () => void
}

export function MediaUploader({ onUpload, onClose }: MediaUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const isImage = file.type.startsWith("image/")
        const isVideo = file.type.startsWith("video/")

        if (isImage || isVideo) {
          const size = (file.size / (1024 * 1024)).toFixed(2)
          const newFile = {
            name: file.name,
            type: isImage ? "image" : "video",
            size: Number.parseFloat(size),
            url: e.target?.result as string,
          }

          setUploadedFiles((prev) => [...prev, newFile])
          onUpload(newFile)
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  return (
    <div className="space-y-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
        <p className="font-medium text-foreground mb-1">Drag and drop your files here</p>
        <p className="text-sm text-muted-foreground">Supports: JPG, PNG, MP4, WebM (Max 100MB)</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">Uploaded Files</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {file.type === "image" ? "🖼️" : "🎥"} {file.size} MB
                  </p>
                </div>
                <button
                  onClick={() => setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
          Cancel
        </Button>
        <Button onClick={onClose} disabled={uploadedFiles.length === 0} className="flex-1">
          Done ({uploadedFiles.length})
        </Button>
      </div>
    </div>
  )
}
