// PrayerInstructions.tsx
import React from "react";

interface PrayerInstructionsProps {
  imageUrl: string;
  accentColor: string;
  duration: number;
  onClose?: () => void;
}

export const PrayerInstructions: React.FC<PrayerInstructionsProps> = ({
  imageUrl,
  accentColor,
  duration,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Fullscreen semi-transparent background */}
      <div className="absolute inset-0 bg-black/90" />

      {/* Container that takes 90% of screen */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative"
          style={{
            width: "90vw",
            height: "90vh",
            borderRadius: "1.5rem",
            border: `8px solid ${accentColor}`,
            boxShadow: `0 0 50px ${accentColor}80`,
            overflow: "hidden",
            animation:
              "fadeInScale 0.8s ease-out, glowPulse 3s ease-in-out infinite",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white", // White only inside the border
          }}
        >
          {/* Image that fills 100% of the 90% container */}
          <img
            src={imageUrl}
            alt="Prayer Instructions"
            className="w-full h-full object-contain"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          />

          {/* Optional: Countdown timer in corner */}
          {duration > 0 && (
            <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-full">
              <span className="text-2xl font-bold font-mono">
                {Math.ceil(duration / 1000)}s
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
