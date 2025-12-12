// components/VideoUploader.tsx
import React, { useState, useRef } from "react";
import { Upload, Video as VideoIcon, X, Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoUploaderProps {
  videoUrl: string;
  onChange: (url: string) => void;
  userId?: string;
  displayId?: string;
  environment?: "preview" | "production";
}

export function VideoUploader({
  videoUrl,
  onChange,
  userId,
  displayId = "1",
  environment = "preview",
}: VideoUploaderProps) {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!userId) {
      setUploadError("User ID is required for upload");
      return;
    }

    if (!displayId) {
      setUploadError("Display ID is required for upload");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const file = files[0];

      // Validate video file
      if (!file.type.startsWith("video/")) {
        throw new Error("Please select a video file (MP4, WebM, etc.)");
      }

      // Check file size (max 100MB for videos)
      if (file.size > 100 * 1024 * 1024) {
        throw new Error("Video file is too large (maximum 100MB)");
      }

      // Get video duration
      const videoElement = document.createElement("video");
      videoElement.preload = "metadata";

      await new Promise<void>((resolve, reject) => {
        videoElement.onloadedmetadata = () => {
          window.URL.revokeObjectURL(videoElement.src);
          if (videoElement.duration > 300) {
            // 5 minutes
            reject(new Error("Video is too long (maximum 5 minutes)"));
          } else {
            resolve();
          }
        };

        videoElement.onerror = () => {
          reject(new Error("Could not load video file"));
        };

        videoElement.src = URL.createObjectURL(file);
      });

      // Upload video
      await uploadVideo(file);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const uploadVideo = async (file: File) => {
    const formData = new FormData();
    formData.append("files", file); // Note: Using "files" instead of "file"
    formData.append("userId", userId!);
    formData.append("displayId", displayId);
    formData.append("type", "advertisement");
    formData.append("environment", environment);

    const response = await fetch("/api/media/uploadMedia", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Video upload failed");
    }

    const data = await response.json();
    if (data.urls && data.urls.length > 0) {
      onChange(data.urls[0]);
    } else {
      throw new Error("No URL returned from upload");
    }
  };

  const handleRemoveVideo = () => {
    onChange("");
    setPreviewUrl(null);
  };

  const handlePreview = () => {
    if (videoUrl) {
      setPreviewUrl(videoUrl);
    }
  };

  const supportedFormats = ".mp4,.webm,.ogg,.mov,.avi,.m4v";

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept={supportedFormats}
        onChange={handleFileSelect}
        className="hidden"
      />

      {videoUrl ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <VideoIcon className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-slate-300 truncate">
                {videoUrl.split("/").pop() || "Uploaded video"}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handlePreview}
                className="h-7 text-xs bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
              >
                <Play className="w-3 h-3 mr-1" />
                Preview
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleRemoveVideo}
                className="h-7 text-xs"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
            <video
              src={videoUrl}
              className="w-full h-full object-cover"
              controls={false}
              muted
              onMouseEnter={(e) => {
                const video = e.currentTarget as HTMLVideoElement;
                video.play().catch(console.error);
              }}
              onMouseLeave={(e) => {
                const video = e.currentTarget as HTMLVideoElement;
                video.pause();
                video.currentTime = 0;
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="p-3 bg-black/50 rounded-full hover:bg-black/70 transition-colors">
                <Play className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500">Hover to preview video</p>
        </div>
      ) : (
        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || !userId}
            className="w-full border-blue-500/50 hover:border-blue-400 hover:bg-blue-500/10 text-blue-400 h-20 flex flex-col items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Uploading video...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <div className="text-center">
                  <div className="font-medium">Upload Video</div>
                  <div className="text-xs font-normal text-blue-300/70">
                    Click to select a video file
                  </div>
                </div>
              </>
            )}
          </Button>
          <div className="text-xs text-slate-500 text-center space-y-1">
            <p>Supported formats: MP4, WebM, OGG, MOV, AVI, M4V</p>
            <p>Maximum size: 100MB • Maximum duration: 5 minutes</p>
          </div>
        </div>
      )}

      {uploadError && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-400">{uploadError}</p>
        </div>
      )}

      {/* Video Preview Modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">Video Preview</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPreviewUrl(null)}
                className="h-8 w-8 p-0 hover:bg-slate-800"
              >
                <X className="w-4 h-4 text-slate-300" />
              </Button>
            </div>
            <div className="p-2">
              <video
                src={previewUrl}
                className="w-full rounded-lg"
                controls
                autoPlay
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
