"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, Loader2, CheckCircle2 } from "lucide-react";

interface LivePreviewProps {
  displayData: {
    id?: string;
    name?: string;
    displayName?: string;
    template?: string;
    templateType?: string;
    config: Record<string, any>;
  };
  className?: string;
  onSave?: (success: boolean) => void;
}

export function LivePreview({
  displayData,
  className = "",
  onSave,
}: LivePreviewProps) {
  const [iframeKey, setIframeKey] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

  // Update iframe when displayData changes (debounced for performance)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIframeKey((prev) => prev + 1);
    }, 300);

    return () => clearTimeout(timeout);
  }, [displayData]);

  // Construct preview URL with config (using base64 compression)
  const getPreviewUrl = () => {
    // Map templateType to full template name
    const fullTemplateName =
      displayData.templateType === "masjid"
        ? "masjid-classic"
        : displayData.templateType === "hospital"
        ? "hospital-modern"
        : displayData.templateType === "corporate"
        ? "corporate-dashboard"
        : displayData.templateType === "restaurant"
        ? "restaurant-modern"
        : displayData.templateType === "retail"
        ? "retail-modern"
        : displayData.config.template || "masjid-classic";

    // Prepare the config with template name
    const configWithTemplate = {
      ...displayData.config,
      template: fullTemplateName,
    };

    // ✅ CHANGE: Use base64 encoding to compress the config
    const configString = JSON.stringify(configWithTemplate);
    const encoded = btoa(unescape(encodeURIComponent(configString)));

    // Build the preview URL with encoded config
    const baseUrl = `/displays/${displayData.id}/preview`;
    const params = new URLSearchParams({
      config: encoded, // Send as base64
      encoded: "true", // Flag to indicate it's encoded
    });
    return `${baseUrl}?${params.toString()}`;
  };

  // Save config to Supabase
  const handleSave = async () => {
    if (!displayData.id) {
      console.error("No display ID provided");
      return;
    }

    setIsSaving(true);
    setSaveStatus("idle");

    try {
      // Map templateType to full template name
      const fullTemplateName =
        displayData.templateType === "masjid"
          ? "masjid-classic"
          : displayData.templateType === "hospital"
          ? "hospital-modern"
          : displayData.templateType === "restaurant"
          ? "restaurant-modern"
          : displayData.templateType === "retail"
          ? "retail-modern"
          : displayData.templateType === "corporate"
          ? "corporate-dashboard"
          : displayData.config.template || "masjid-classic";

      const configToSave = {
        ...displayData.config,
        template: fullTemplateName,
      };

      // Get the appropriate name based on template type
      const getDisplayName = () => {
        switch (displayData.templateType) {
          case "masjid":
            return displayData.config.masjidName;
          case "hospital":
            return displayData.config.hospitalName;
          case "restaurant":
            return displayData.config.restaurantName;
          case "retail":
            return displayData.config.shopName;
          case "corporate":
            return displayData.config.companyName;
          default:
            return displayData.name || displayData.displayName;
        }
      };

      const response = await fetch(`/api/displays/${displayData.id}/config`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: getDisplayName() || displayData.name || displayData.displayName,
          config: configToSave,
          templateType: displayData.templateType,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save configuration");
      }

      setSaveStatus("success");
      onSave?.(true);

      // Reset success status after 3 seconds
      setTimeout(() => {
        setSaveStatus("idle");
      }, 3000);
    } catch (error) {
      console.error("Error saving config:", error);
      setSaveStatus("error");
      onSave?.(false);

      // Reset error status after 3 seconds
      setTimeout(() => {
        setSaveStatus("idle");
      }, 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Preview Container */}
      <div className="relative bg-slate-900 rounded-lg overflow-hidden border-2 border-slate-700 shadow-xl">
        {/* 16:9 Aspect Ratio Container */}
        <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
          <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
            <iframe
              key={iframeKey}
              src={getPreviewUrl()}
              className="w-full h-full border-0"
              title="Live Display Preview"
              sandbox="allow-scripts allow-same-origin"
              style={{
                transform: "scale(1)",
                transformOrigin: "top left",
                display: "block",
              }}
            />
          </div>
        </div>
      </div>

      {/* Save Button with Status */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-pink-300 hover:bg-pink-400 text-gray-900 flex-1"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : saveStatus === "success" ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Configuration
            </>
          )}
        </Button>

        {saveStatus === "error" && (
          <span className="text-xs text-red-400">
            Failed to save. Please try again.
          </span>
        )}
      </div>
    </div>
  );
}
