"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DisplayCard } from "./display-card";
import { Plus, LogOut, Settings, BarChart3, Zap } from "lucide-react";
import DisplayStats from "@/components/dashboard/kpi";

// Mock data
const mockDisplays = [
  {
    id: "1",
    name: "Main Hall Display",
    templateType: "masjid",
    displayUrl: "https://display.example.com/main-hall-123",
    status: "active",
  },
  {
    id: "2",
    name: "Emergency Department",
    templateType: "hospital",
    displayUrl: "https://display.example.com/emerg-dept-456",
    status: "active",
  },
  {
    id: "3",
    name: "Lobby Screen",
    templateType: "corporate",
    displayUrl: "https://display.example.com/lobby-789",
    status: "inactive",
  },
];

export function ClientDashboard() {
  const [displays, setDisplays] = useState(mockDisplays);
  const [selectedDisplay, setSelectedDisplay] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    window.location.href = `/displays/${id}/edit`;
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this display?")) {
      setDisplays(displays.filter((d) => d.id !== id));
    }
  };

  const handlePreview = (id: string) => {
    window.location.href = `/displays/${id}/live`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-50">ScreenSync</h1>
            <p className="text-slate-400 text-sm">
              Manage your digital displays
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-slate-50"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-red-400"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <DisplayStats />

        {/* Displays Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-50">Your Displays</h2>
              <p className="text-slate-400 text-sm mt-1">
                Create and manage your display screens
              </p>
            </div>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Display
            </Button>
          </div>

          {displays.length === 0 ? (
            <Card className="bg-slate-800 border-slate-700 text-center py-12">
              <div className="text-slate-400">
                <p className="text-lg font-semibold mb-2">No displays yet</p>
                <p className="text-sm mb-4">
                  Create your first display to get started
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displays.map((display) => (
                <DisplayCard
                  key={display.id}
                  {...display}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onPreview={handlePreview}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
