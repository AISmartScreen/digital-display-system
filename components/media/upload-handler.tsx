"use client";

import { useState } from "react";
import { UploadZone } from "@/components/media/upload-zone";

interface UploadedBlob {
  url: string;
  pathname: string;
  downloadUrl: string;
  id: string;
  environment: string;
  imageId: string;
}

interface UploadHandlerProps {
  id: string;
  environment: "preview" | "production";
  imageId: string;
  onUploadComplete?: (blobs: UploadedBlob[]) => void;
  onUploadError?: (error: string) => void;
}

export function UploadHandler({
  id,
  environment,
  imageId,
  onUploadComplete,
  onUploadError,
}: UploadHandlerProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (files: File[]) => {
    setIsUploading(true);

    try {
      const formData = new FormData();

      // Add files
      files.forEach((file) => {
        formData.append("files", file);
      });

      // Add criteria
      formData.append("id", id);
      formData.append("environment", environment);
      formData.append("imageId", imageId);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();

      if (onUploadComplete) {
        onUploadComplete(data.blobs);
      }

      console.log("Upload successful:", data.blobs);
    } catch (error) {
      console.error("Upload error:", error);

      if (onUploadError) {
        onUploadError(error instanceof Error ? error.message : "Upload failed");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <UploadZone
      onFileSelect={handleFileSelect}
      isUploading={isUploading}
      id={id}
      environment={environment}
      imageId={imageId}
    />
  );
}
