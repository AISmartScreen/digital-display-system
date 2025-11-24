"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { SidebarNavigation } from "@/components/sidebar-navigation";
import { TopBar } from "@/components/top-bar";
import { useState } from "react";
import { EditorPanel } from "@/components/customization/editor-panel";
import { LivePreview } from "@/components/customization/live-preview";
import { ActionBar } from "@/components/customization/action-bar";
import { useToast } from "@/hooks/use-toast";

interface DisplayCustomization {
  template: string;
  layout: string;
  prayerTimes: {
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
  iqamahOffsets: {
    fajr: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
  };
  colors: {
    primary: string;
    secondary: string;
    text: string;
    accent: string;
  };
  backgroundType: "solid" | "gradient" | "image" | "slideshow";
  backgroundColor: string;
  backgroundImage: string[];
  slideshowDuration: number;
  announcements: Array<{ text: string; duration: number }>;
  showHijriDate: boolean;
  font: string;
}

interface CustomizePageClientProps {
  displayId: string;
}

export function CustomizePageClient({ displayId }: CustomizePageClientProps) {
  const { toast } = useToast();
  const [customization, setCustomization] = useState<DisplayCustomization>({
    template: "masjid-classic",
    layout: "vertical",
    prayerTimes: {
      fajr: "05:30",
      dhuhr: "12:45",
      asr: "15:45",
      maghrib: "18:30",
      isha: "20:00",
    },
    iqamahOffsets: {
      fajr: 10,
      dhuhr: 10,
      asr: 10,
      maghrib: 5,
      isha: 10,
    },
    colors: {
      primary: "#2E7D32",
      secondary: "#FFF8E1",
      text: "#FFFFFF",
      accent: "#FFD700",
    },
    backgroundType: "solid",
    backgroundColor: "#1A472A",
    backgroundImage: [],
    slideshowDuration: 5,
    announcements: [{ text: "Jumua Khutbah at 1:00 PM", duration: 5 }],
    showHijriDate: true,
    font: "Amiri",
  });

  const [lastSaved, setLastSaved] = useState<string>("Just now");

  const handleSaveDraft = () => {
    setLastSaved("Just now");
    toast({
      title: "Draft saved",
      description: "Your customization has been saved as draft",
    });
  };

  const handlePublish = () => {
    toast({
      title: "Display published",
      description: "Your customization is now live on the display",
    });
  };

  return (
    <ProtectedRoute>
      <SidebarNavigation />
      <TopBar />

      <main className="md:ml-64 pt-16 pb-8 px-4 md:px-8 bg-background">
        <div className="max-w-full mx-auto">
          {/* Split View: Editor + Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Left: Editor Panel */}
            <div className="overflow-y-auto max-h-[calc(100vh-200px)] rounded-lg border border-border bg-card">
              <EditorPanel
                customization={customization}
                setCustomization={setCustomization}
              />
            </div>

            {/* Right: Live Preview */}
            <div className="hidden lg:block">
              <LivePreview
                customization={customization}
                displayId={displayId}
              />
            </div>
          </div>

          {/* Bottom Action Bar */}
          <ActionBar
            onSaveDraft={handleSaveDraft}
            onPublish={handlePublish}
            lastSaved={lastSaved}
            displayId={displayId}
            customization={customization}
          />
        </div>
      </main>
    </ProtectedRoute>
  );
}
