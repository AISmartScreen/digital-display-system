"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Copy, Download, ImageIcon, Video } from "lucide-react";
import Image from "next/image";

interface MediaItem {
  id: string;
  fileName: string;
  fileType: "image" | "video";
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
}

interface MediaGalleryProps {
  items: MediaItem[];
  onDelete: (id: string) => void;
  isDeleting?: string | null;
}

export function MediaGallery({
  items,
  onDelete,
  isDeleting = null,
}: MediaGalleryProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  if (items.length === 0) {
    return (
      <Card className="bg-slate-800 border-slate-700 p-8 text-center">
        <p className="text-slate-400">No media files uploaded yet</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card
          key={item.id}
          className="bg-slate-800 border-slate-700 overflow-hidden hover:border-slate-600 transition-colors"
        >
          {/* Preview */}
          <div className="bg-slate-900 aspect-video flex items-center justify-center overflow-hidden">
            {item.fileType === "image" ? (
              <img
                src={item.fileUrl || "/placeholder.svg"}
                alt={item.fileName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                <Video className="w-8 h-8" />
                <p className="text-xs">Video</p>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-4 space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {item.fileType === "image" ? (
                  <ImageIcon className="w-4 h-4 text-slate-500" />
                ) : (
                  <Video className="w-4 h-4 text-slate-500" />
                )}
                <p className="text-sm font-semibold text-slate-50 truncate">
                  {item.fileName}
                </p>
              </div>
              <p className="text-xs text-slate-400">
                {formatFileSize(item.fileSize)} ·{" "}
                {new Date(item.uploadedAt).toLocaleDateString()}
              </p>
            </div>

            {/* URL */}
            <div className="bg-slate-700/50 rounded p-2 font-mono text-xs text-slate-300 truncate">
              {item.fileUrl}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleCopyUrl(item.fileUrl, item.id)}
                className="flex-1 text-xs text-slate-400 hover:text-slate-50 hover:bg-slate-700"
              >
                <Copy className="w-3 h-3 mr-1" />
                {copiedId === item.id ? "Copied" : "Copy"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => window.open(item.fileUrl, "_blank")}
                className="flex-1 text-xs text-slate-400 hover:text-slate-50 hover:bg-slate-700"
              >
                <Download className="w-3 h-3 mr-1" />
                View
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(item.id)}
                disabled={isDeleting === item.id}
                className="flex-1 text-xs text-red-400 hover:text-red-500 hover:bg-red-500/10"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
