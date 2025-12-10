"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface FullScreenAdProps {
  title?: string;
  caption?: string;
  imageUrl: string;
  accentColor: string;
  primaryColor: string;
  secondaryColor: string;
  duration: number;
  showTimer?: boolean;
  showScheduleInfo?: boolean;
  scheduleInfo?: {
    timeRange: { start: string; end: string };
    frequency: number;
    daysOfWeek?: number[];
  };
  onClose?: () => void;
  onDurationEnd?: () => void;
}

export const FullScreenAd: React.FC<FullScreenAdProps> = ({
  title,
  caption,
  imageUrl,
  accentColor,
  primaryColor,
  secondaryColor,
  duration,
  showTimer = true,
  showScheduleInfo = true,
  scheduleInfo,
  onClose,
  onDurationEnd,
}) => {
  const [remainingTime, setRemainingTime] = useState(duration);

  useEffect(() => {
    setRemainingTime(duration);
  }, [duration]);

  // Handle countdown
  useEffect(() => {
    if (remainingTime <= 0) return;

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        const newTime = prev - 1000;
        return newTime <= 0 ? 0 : newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingTime]);

  // Handle ad close when timer reaches zero
  useEffect(() => {
    if (remainingTime === 0) {
      if (onDurationEnd) onDurationEnd();
      if (onClose) onClose();
    }
  }, [remainingTime, onClose, onDurationEnd]);

  // Format days of week
  const formatDaysOfWeek = (days: number[] = []) => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    if (days.length === 7) return "Every day";
    if (
      days.length === 5 &&
      days.includes(1) &&
      days.includes(2) &&
      days.includes(3) &&
      days.includes(4) &&
      days.includes(5)
    )
      return "Weekdays";
    if (days.length === 2 && days.includes(0) && days.includes(6))
      return "Weekends";

    return days.map((day) => dayNames[day]).join(", ");
  };

  return (
    <div className="absolute inset-0 z-[10000] flex items-center justify-center">
      <style>
        {`
          @keyframes fadeInScale {
            0% {
              opacity: 0;
              transform: scale(0.95);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes adGlowPulse {
            0%, 100% {
              box-shadow: 
                0 0 40px ${accentColor}60,
                0 0 80px ${accentColor}40,
                0 0 120px ${accentColor}20,
                inset 0 0 40px ${accentColor}30;
            }
            50% {
              box-shadow: 
                0 0 60px ${accentColor}80,
                0 0 120px ${accentColor}60,
                0 0 180px ${accentColor}40,
                inset 0 0 60px ${accentColor}50;
            }
          }

          @keyframes shimmer {
            0% {
              background-position: -200% center;
            }
            100% {
              background-position: 200% center;
            }
          }

          @keyframes timerPulse {
            0%, 100% {
              transform: scale(1);
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            }
            50% {
              transform: scale(1.05);
              box-shadow: 0 6px 30px rgba(0, 0, 0, 0.7);
            }
          }

          @keyframes slideInFromBottom {
            0% {
              transform: translateY(50px);
              opacity: 0;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }

          @keyframes fadeInUp {
            0% {
              transform: translateY(30px);
              opacity: 0;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }

          @keyframes progressBar {
            0% {
              width: 100%;
            }
            100% {
              width: 0%;
            }
          }

          @keyframes adPulse {
            0%, 100% {
              background-color: ${accentColor};
              box-shadow: 0 0 10px ${accentColor};
            }
            50% {
              background-color: ${primaryColor};
              box-shadow: 0 0 20px ${primaryColor};
            }
          }
        `}
      </style>

      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-80" />

      {/* Main ad container with border and glow - FULLSCREEN */}
      <div
        className="absolute inset-0 m-0"
        style={{
          border: `12px solid ${accentColor}`,
          animation:
            "fadeInScale 0.8s ease-out, adGlowPulse 3s ease-in-out infinite",
          boxShadow: `0 0 60px ${accentColor}40`,
        }}
      >
        {/* Shimmer overlay effect */}
        <div
          className="absolute inset-0 z-10 pointer-events-none opacity-20"
          style={{
            background: `linear-gradient(
              90deg,
              transparent 0%,
              ${accentColor}50 50%,
              transparent 100%
            )`,
            backgroundSize: "200% 100%",
            animation: "shimmer 6s infinite linear",
          }}
        />

        {/* Main image - fullscreen background */}
        <div className="absolute inset-0">
          <img
            src={imageUrl}
            alt={title || "Advertisement"}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
        </div>

        {/* Corner decorative elements */}
        <div
          className="absolute top-0 left-0 w-20 h-20"
          style={{
            background: `linear-gradient(135deg, ${accentColor}60 0%, transparent 100%)`,
          }}
        />
        <div
          className="absolute top-0 right-0 w-20 h-20"
          style={{
            background: `linear-gradient(225deg, ${accentColor}60 0%, transparent 100%)`,
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-20 h-20"
          style={{
            background: `linear-gradient(45deg, ${accentColor}60 0%, transparent 100%)`,
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-20 h-20"
          style={{
            background: `linear-gradient(315deg, ${accentColor}60 0%, transparent 100%)`,
          }}
        />

        {/* Progress bar at top */}
        {showTimer && (
          <div className="absolute top-0 left-0 right-0 h-2 bg-black/50">
            <div
              className="h-full rounded-r-full transition-all duration-300"
              style={{
                backgroundColor: accentColor,
                animation: `progressBar ${duration / 1000}s linear forwards`,
                boxShadow: `0 0 10px ${accentColor}`,
              }}
            />
          </div>
        )}
      </div>

      {/* Top right: Timer and close button */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-4">
        {showTimer && remainingTime > 0 && (
          <div
            className="px-6 py-3 rounded-full z-20 backdrop-blur-md"
            style={{
              background: `linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 100%)`,
              border: `2px solid ${accentColor}`,
              animation: "timerPulse 2s ease-in-out infinite",
              boxShadow: `0 0 20px ${accentColor}40`,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full animate-pulse"
                style={{
                  backgroundColor: accentColor,
                  animation: "adPulse 1.5s ease-in-out infinite",
                }}
              />
              <span
                className="text-2xl font-black font-mono tracking-wider"
                style={{
                  color: "white",
                  textShadow: `0 0 10px ${accentColor}`,
                }}
              >
                {Math.ceil(remainingTime / 1000)}s
              </span>
            </div>
          </div>
        )}

        {/* Close button */}
        <button
          onClick={() => {
            if (onClose) onClose();
          }}
          className="group w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 hover:scale-110"
          style={{
            background: `linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)`,
            border: `2px solid ${accentColor}60`,
            boxShadow: `0 0 20px ${accentColor}30`,
          }}
        >
          <X
            className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90"
            style={{ color: accentColor }}
          />
          <span className="sr-only">Close advertisement</span>
        </button>
      </div>
    </div>
  );
};
