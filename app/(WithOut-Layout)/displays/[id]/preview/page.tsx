// app/(WithOut-Layout)/displays/[id]/preview/page.tsx

"use client";

import type React from "react";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { MasjidTemplate } from "@/components/templates/masjid-template";
import { HospitalTemplate } from "@/components/templates/hospital-template";
import RestaurantTemplate from "@/components/templates/restaurant-template";
import { CorporateTemplate } from "@/components/templates/corporate-template";
import RetailTemplate from "@/components/templates/retail-template";

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const configString = searchParams.get("config");
  const isEncoded = searchParams.get("encoded") === "true";
  const [customization, setCustomization] = useState<any>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (configString) {
      try {
        let decoded;
        
        // ✅ CHANGE: Check if config is base64 encoded
        if (isEncoded) {
          // Decode from base64
          const decodedString = decodeURIComponent(escape(atob(configString)));
          decoded = JSON.parse(decodedString);
        } else {
          // Original method (backward compatibility)
          decoded = JSON.parse(decodeURIComponent(configString));
        }

        // Normalize color configuration - prioritize colorTheme over colors
        // colorTheme is the source of truth for actual display colors
        if (decoded.colorTheme) {
          decoded.colors = decoded.colorTheme;
        } else if (!decoded.colors) {
          // Fallback to default colors if neither exists
          decoded.colors = {
            primary: "#10b981",
            secondary: "#059669",
            text: "#ffffff",
            accent: "#fbbf24",
          };
        }

        setCustomization(decoded);
      } catch (e) {
        console.error("Error parsing config:", e);
      }
    }
  }, [configString, isEncoded]);

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

  if (!customization) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center text-white">
        Loading...
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
            displayId={customization.displayId}
            displayName={customization.displayName}
            templateType={customization.templateType}
            customization={customization}
            backgroundStyle={getBackgroundStyle()}
          />
        );
      case "restaurant-modern":
        return (
          <RestaurantTemplate
            displayId={customization.displayId}
            displayName={customization.displayName}
            templateType={customization.templateType}
            customization={customization}
            backgroundStyle={getBackgroundStyle()}
          />
        );
      case "retail-modern":
        return (
          <RetailTemplate
            displayId={customization.displayId}
            displayName={customization.displayName}
            templateType={customization.templateType}
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

// changed a bit
