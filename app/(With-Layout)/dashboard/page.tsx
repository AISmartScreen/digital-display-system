"use client";

import { DisplayList } from "@/components/displays/display-list";
import { useState } from "react";
import type { Room } from "@/src/components/header/RoomSelector";
import { RoomSelector } from "@/src/components/header/RoomSelector";
import DisplayStats from "@/components/dashboard/kpi";

export default function DashboardPage() {
  const [selectedRoom, setSelectedRoom] = useState<Room>("Living Room");

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

      {/* Stats Cards - Now fetching from Supabase */}
      <DisplayStats />

      {/* Display List */}
      <DisplayList />
    </div>
  );
}
