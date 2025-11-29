"use client";

import { useState, useEffect } from "react";
import { DisplayCard } from "../dashboard/display-card";
import { CreateDisplayDialog } from "./create-display-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function DisplayList() {
  const [displays, setDisplays] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
        name: "Reception Area",
        templateType: "hospital",
        displayUrl: "https://display.example.com/reception-456",
        status: "active",
      },
      {
        id: "3",
        name: "Meeting Rooms",
        templateType: "corporate",
        displayUrl: "https://display.example.com/meetings-789",
        status: "active",
      },
    ];
    setDisplays(mockDisplays);
    setIsLoading(false);
  }, []);

  const handleAddDisplay = (newDisplay: any) => {
    setDisplays([...displays, newDisplay]);
  };

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

  if (isLoading) {
    return <div className="text-gray-400">Loading displays...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Displays</h2>
          <p className="text-gray-400 text-sm mt-1">
            Create and manage your display screens
          </p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-4 py-2 sm:px-6 sm:py-3 flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Create Display</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {displays.length === 0 ? (
        <div className="text-center py-16 bg-gray-900/50 rounded-2xl border border-gray-800">
          <p className="text-gray-400 text-lg font-semibold mb-2">
            No displays yet
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Create your first display to get started
          </p>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-4 py-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Display
          </Button>
        </div>
      ) : (
        /* Updated grid to use smart home spacing and responsiveness */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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

      <CreateDisplayDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={handleAddDisplay}
      />
    </div>
  );
}
