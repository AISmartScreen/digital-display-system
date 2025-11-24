"use client";

import type React from "react";
import { useEffect, useState } from "react";

interface DisplayCustomization {
  template: string;
  layout: string;
  prayerTimes: any;
  iqamahOffsets: any;
  colors: any;
  backgroundType: string;
  backgroundColor: string;
  backgroundImage: string[];
  slideshowDuration: number;
  announcements: any[];
  showHijriDate: boolean;
  font: string;
}

interface LivePreviewProps {
  customization: DisplayCustomization;
  displayId: string;
}

export function LivePreview({ customization, displayId }: LivePreviewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [iframeKey, setIframeKey] = useState(0);

  // Update iframe when customization changes
  useEffect(() => {
    // Debounce iframe reload to avoid too many refreshes
    const timeout = setTimeout(() => {
      setIframeKey((prev) => prev + 1);
    }, 500);

    return () => clearTimeout(timeout);
  }, [customization]);

  useEffect(() => {
    if (
      customization.backgroundType === "slideshow" &&
      customization.backgroundImage.length > 1
    ) {
      const interval = setInterval(() => {
        setCurrentSlide(
          (prev) => (prev + 1) % customization.backgroundImage.length
        );
      }, customization.slideshowDuration * 1000);
      return () => clearInterval(interval);
    }
  }, [
    customization.backgroundType,
    customization.backgroundImage,
    customization.slideshowDuration,
  ]);

  // Construct preview URL with customization parameters
  const getPreviewUrl = () => {
    const baseUrl = `/displays/${displayId}/preview`;
    const params = new URLSearchParams({
      config: JSON.stringify(customization),
      isLivePreview: "true", // Add flag to indicate this is live preview mode
    });
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <div className="sticky top-20 rounded-lg overflow-hidden border-2 border-primary/50 shadow-xl bg-black">
      <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <iframe
            key={iframeKey}
            src={getPreviewUrl()}
            className="w-full h-full border-0"
            title="Live Display Preview"
            sandbox="allow-scripts allow-same-origin"
            style={{
              transform: "scale(1)",
              transformOrigin: "top left",
            }}
          />
        </div>

        {/* Top overlay badges */}
        <div className="absolute top-0 left-0 right-0 flex items-start justify-between p-4 pointer-events-none z-50">
          <div className="bg-black/70 text-white px-3 py-1.5 rounded-md text-xs font-mono backdrop-blur-sm border border-white/20">
            <span className="opacity-70">Layout:</span>{" "}
            <span className="font-bold capitalize">
              {customization.layout || "vertical"}
            </span>
          </div>
        </div>

        {/* Bottom overlay badge */}
        <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1.5 rounded-md text-xs font-mono backdrop-blur-sm border border-white/20 pointer-events-none z-50">
          <span className="opacity-70">Template:</span>{" "}
          <span className="font-bold">
            {customization.template === "masjid-classic" && "Classic Masjid"}
            {customization.template === "hospital-modern" && "Modern Hospital"}
            {customization.template === "corporate-dashboard" &&
              "Corporate Dashboard"}
          </span>
        </div>
      </div>

      {/* Bottom info bar */}
      <div className="bg-card border-t border-border px-4 py-3 text-xs text-muted-foreground flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="font-medium">Live Preview</span>
          </span>
          <span className="opacity-60">📺 1920×1080</span>
        </div>
        <div className="flex items-center gap-4">
          {customization.backgroundType === "slideshow" &&
            customization.backgroundImage.length > 1 && (
              <span className="flex items-center gap-2">
                <span className="opacity-60">Slideshow:</span>
                <span className="font-medium">
                  {currentSlide + 1} / {customization.backgroundImage.length}
                </span>
                <span className="opacity-60">
                  ({customization.slideshowDuration}s)
                </span>
              </span>
            )}
          {customization.backgroundType === "solid" && (
            <span className="flex items-center gap-2">
              <span className="opacity-60">Background:</span>
              <div
                className="w-4 h-4 rounded border border-border"
                style={{ backgroundColor: customization.backgroundColor }}
              />
            </span>
          )}
          {customization.backgroundType === "image" &&
            customization.backgroundImage.length > 0 && (
              <span className="opacity-60">🖼️ Single Image</span>
            )}
        </div>
      </div>
    </div>
  );
}
