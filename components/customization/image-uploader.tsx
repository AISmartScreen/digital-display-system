"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { Upload, X } from "lucide-react"
import { useState, useRef } from "react"

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
}

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          onChange([...images, e.target.result as string])
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
    <div className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <p className="font-medium text-foreground">Drag and drop images here</p>
        <p className="text-sm text-muted-foreground">or click to select files</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((image, index) => (
            <Card key={index} className="relative overflow-hidden group">
              <img src={image || "/placeholder.svg"} alt={`Upload ${index}`} className="w-full h-24 object-cover" />
              <button
                onClick={() => onChange(images.filter((_, i) => i !== index))}
                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
