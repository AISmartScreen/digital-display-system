// app/displays/[id]/live/page.tsx
"use client";

import { use, useEffect, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { MasjidTemplate } from "@/components/templates/masjid-template";
import { HospitalTemplate } from "@/components/templates/hospital-template";
import { CorporateTemplate } from "@/components/templates/corporate-template";
import type React from "react";

interface LivePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function LivePage({ params }: LivePageProps) {
  const { id } = use(params);
  const [customization, setCustomization] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1);

  // Fetch config from database
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/displays/${id}/config`);

        if (!response.ok) {
          throw new Error("Failed to fetch display configuration");
        }

        const result = await response.json();

        if (!result.success || !result.data) {
          throw new Error("Invalid configuration data");
        }

        const config = result.data.config;

        // Normalize color configuration - prioritize colorTheme over colors
        if (config.colorTheme) {
          config.colors = config.colorTheme;
        } else if (!config.colors) {
          // Fallback to default colors if neither exists
          config.colors = {
            primary: "#10b981",
            secondary: "#059669",
            text: "#ffffff",
            accent: "#fbbf24",
          };
        }

        setCustomization(config);
      } catch (err) {
        console.error("Error fetching config:", err);
        setError(err instanceof Error ? err.message : "Failed to load display");
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();

    // Optional: Set up polling to check for config updates every 30 seconds
    const interval = setInterval(fetchConfig, 30000);

    return () => clearInterval(interval);
  }, [id]);

  // Perfect scaling with correct 16:9 landscape preview
  useEffect(() => {
    const updateScale = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const targetWidth = 1920;
      const targetHeight = 1080;

      const scaleX = viewportWidth / targetWidth;
      const scaleY = viewportHeight / targetHeight;

      setScale(Math.min(scaleX, scaleY));
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-pink-400" />
          <p className="text-white text-lg">Loading display...</p>
        </div>
      </div>
    );
  }

  if (error || !customization) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-4 max-w-md px-6">
          <AlertCircle className="w-16 h-16 mx-auto text-red-400" />
          <h2 className="text-white text-2xl font-bold">
            Error Loading Display
          </h2>
          <p className="text-gray-400">{error || "Configuration not found"}</p>
        </div>
      </div>
    );
  }

  const getBackgroundStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      backgroundSize: "cover",
      backgroundPosition: "center",
    };

    if (customization.backgroundType === "solid") {
      return { ...baseStyle, backgroundColor: customization.backgroundColor };
    }

    if (
      customization.backgroundType === "image" &&
      customization.backgroundImage?.[0]
    ) {
      return {
        ...baseStyle,
        backgroundImage: `url(${customization.backgroundImage[0]})`,
      };
    }

    if (
      customization.backgroundType === "slideshow" &&
      customization.backgroundImage?.length > 0
    ) {
      return {
        ...baseStyle,
        backgroundImage: `url(${customization.backgroundImage[0]})`,
      };
    }

    return { ...baseStyle, backgroundColor: "#000" };
  };

  const renderTemplate = () => {
    switch (customization.template) {
      case "masjid-classic":
        return (
          <MasjidTemplate
            customization={customization}
            backgroundStyle={getBackgroundStyle()}
          />
        );
      case "hospital-modern":
        return (
          <HospitalTemplate
            customization={customization}
            backgroundStyle={getBackgroundStyle()}
          />
        );
      case "corporate-dashboard":
        return (
          <CorporateTemplate
            customization={customization}
            backgroundStyle={getBackgroundStyle()}
          />
        );
      default:
        return (
          <div className="text-white text-2xl">
            Unknown template: {customization.template}
          </div>
        );
    }
  };

  return (
    <div className="h-screen flex items-center justify-center overflow-hidden">
      {/* Maintain perfect 16:9 landscape aspect ratio */}
      <div
        className="relative"
        style={{
          width: "100vw",
          height: "56.25vw", // 16:9 = 9/16 = 0.5625
          maxHeight: "100vh",
          maxWidth: "177.78vh", // 16:9 = 16/9 = 1.7778
        }}
      >
        {/* 1920×1080 content scaled properly */}
        <div
          style={{
            width: 1920,
            height: 1080,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${scale})`,
            transformOrigin: "center center",
            color: "white",
          }}
        >
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
}
