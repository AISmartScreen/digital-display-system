"use client";

import { useState } from "react";
import { UploadZone } from "@/components/media/upload-zone";

interface UploadedBlob {
  url: string;
  pathname: string;
  downloadUrl: string;
  userId: string;
  displayId: string;
  type: string;
}

interface UploadHandlerProps {
  userId: string;
  displayId: string;
  type: string;
  onUploadComplete?: (blobs: UploadedBlob[]) => void;
  onUploadError?: (error: string) => void;
}

export function UploadHandler({
  userId,
  displayId,
  type,
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
      formData.append("userId", userId);
      formData.append("displayId", displayId);
      formData.append("type", type);

      const response = await fetch("/api/media/upload", {
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
      userId={userId}
      displayId={displayId}
      type={type}
    />
  );
}
