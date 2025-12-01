"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface UploadZoneProps {
  onFileSelect: (files: File[]) => void;
  isUploading?: boolean;
  id: string;

  environment: "preview" | "production";
  imageId: string;
}

export function UploadZone({
  onFileSelect,
  isUploading = false,
  id,
  environment,
  imageId,
}: UploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = Array.from(e.dataTransfer.files).filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
    );

    if (files.length > 0) {
      onFileSelect(files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFileSelect(Array.from(e.target.files));
    }
  };

  return (
    <div className="space-y-4">
      {/* Criteria Display */}
      <div className="flex gap-2 text-sm">
        <span className="px-3 py-1 bg-slate-700 text-slate-200 rounded-full">
          ID: {id}
        </span>
        <span
          className={`px-3 py-1 rounded-full ${
            environment === "production"
              ? "bg-green-500/20 text-green-400"
              : "bg-blue-500/20 text-blue-400"
          }`}
        >
          {environment}
        </span>
        <span className="px-3 py-1 bg-slate-700 text-slate-200 rounded-full">
          Image ID: {imageId}
        </span>
      </div>

      {/* Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragActive
            ? "border-orange-500 bg-orange-500/10"
            : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleChange}
          className="hidden"
          disabled={isUploading}
        />

        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-50 mb-2">
          Upload Images or Videos
        </h3>
        <p className="text-slate-400 text-sm mb-4">
          Drag and drop files here or click to select
        </p>
        <Button
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          {isUploading ? "Uploading..." : "Select Files"}
        </Button>
      </div>
    </div>
  );
}
