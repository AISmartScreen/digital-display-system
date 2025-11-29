"use client";

import { DisplayList } from "@/components/displays/display-list";
import { useState } from "react";
import type { Room } from "@/src/components/header/RoomSelector";
import { RoomSelector } from "@/src/components/header/RoomSelector";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, ImageIcon, HelpCircle } from "lucide-react";
import Link from "next/link";

const weatherData = {
  temperature: 16,
  windSpeed: 30,
  windSpeedChange: 6,
  pressure: 720,
  pressureChange: -20,
  rainChance: 60,
};

export default function DashboardPage() {
  const [selectedRoom, setSelectedRoom] = useState<Room>("Living Room");
  const stats = [
    { label: "Total Displays", value: 3 },
    { label: "Active", value: 2 },
    { label: "Media Files", value: 12 },
    { label: "Storage Used", value: "2.4 GB" },
  ];

  return (
    <div className="flex flex-col gap-8 p-6 sm:p-8 min-h-screen bg-gray-950">
      {/* Header Section */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Your Displays
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            Manage and create digital display screens
          </p>
        </div>

        <RoomSelector
          selectedRoom={selectedRoom}
          onRoomChange={setSelectedRoom}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
          >
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <p className="text-3xl font-bold text-white mt-3">{stat.value}</p>
          </div>
        ))}
      </div>

      <DisplayList />
    </div>
  );
}
