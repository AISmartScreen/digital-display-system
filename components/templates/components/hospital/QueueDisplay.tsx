import React, { useState, useEffect } from "react";
import { Users, Clock, TrendingUp, Bell } from "lucide-react";

interface QueueItem {
  tokenNumber: string;
  category: string;
  status: "waiting" | "calling" | "serving" | "completed";
  waitTime: number; // in minutes
  counter?: string;
}

interface QueueDisplayProps {
  queueData?: QueueItem[];
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  autoRotate?: boolean;
  rotationSpeed?: number;
}

export default function QueueDisplay({
  queueData,
  primaryColor = "#06b6d4",
  secondaryColor = "#14b8a6",
  accentColor = "#f59e0b",
  autoRotate = true,
  rotationSpeed = 5000,
}: QueueDisplayProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [highlightedToken, setHighlightedToken] = useState(0);

  // Mock queue data if none provided
  const defaultQueueData: QueueItem[] = [
    {
      tokenNumber: "A045",
      category: "General Consultation",
      status: "calling",
      waitTime: 0,
      counter: "Counter 3",
    },
    {
      tokenNumber: "B023",
      category: "Emergency",
      status: "serving",
      waitTime: 0,
      counter: "Counter 1",
    },
    {
      tokenNumber: "A046",
      category: "General Consultation",
      status: "waiting",
      waitTime: 5,
    },
    {
      tokenNumber: "C012",
      category: "Laboratory",
      status: "waiting",
      waitTime: 8,
    },
    {
      tokenNumber: "A047",
      category: "General Consultation",
      status: "waiting",
      waitTime: 12,
    },
    {
      tokenNumber: "D008",
      category: "Pharmacy",
      status: "waiting",
      waitTime: 15,
    },
  ];

  const queue = queueData || defaultQueueData;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setHighlightedToken((prev) => (prev + 1) % queue.length);
    }, rotationSpeed);
    return () => clearInterval(interval);
  }, [autoRotate, rotationSpeed, queue.length]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "calling":
        return "#f59e0b";
      case "serving":
        return "#10b981";
      case "completed":
        return "#6b7280";
      default:
        return primaryColor;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "calling":
        return "NOW CALLING";
      case "serving":
        return "IN SERVICE";
      case "completed":
        return "COMPLETED";
      default:
        return "WAITING";
    }
  };

  const callingTokens = queue.filter((item) => item.status === "calling");
  const servingTokens = queue.filter((item) => item.status === "serving");
  const waitingTokens = queue.filter((item) => item.status === "waiting");

  const averageWaitTime = Math.round(
    waitingTokens.reduce((sum, item) => sum + item.waitTime, 0) /
      waitingTokens.length || 0
  );

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/20 shadow-2xl h-full flex flex-col">
      {/* Now Calling Section - Prominent Display */}
      {callingTokens.length > 0 && (
        <div
          className="px-8 py-8 border-b-2 border-amber-500/50"
          style={{
            background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}10)`,
          }}
        >
          <div className="flex items-center justify-center gap-4 mb-4 hidden">
            <Bell className="w-8 h-8 text-amber-400 animate-bounce" />
            <h3 className="text-3xl font-bold text-amber-400 animate-pulse">
              NOW CALLING
            </h3>
            <Bell className="w-8 h-8 text-amber-400 animate-bounce" />
          </div>

          <div className="">
            {callingTokens.map((token, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-amber-500 shadow-2xl animate-pulse"
              >
                <div className="text-center">
                  <div className="text-7xl font-black text-white mb-2">
                    {token.tokenNumber}
                  </div>
                  <div
                    className="text-xl font-bold mb-2"
                    style={{ color: accentColor }}
                  >
                    {token.category}
                  </div>
                  {token.counter && (
                    <div className="text-2xl font-bold text-white bg-amber-500/30 rounded-lg py-2">
                      {token.counter}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
