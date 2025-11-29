"use client";

import { useState, useEffect } from "react";
import { DisplayCard } from "../dashboard/display-card";
import { CreateDisplayDialog } from "./create-display-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

export function DisplayList() {
  const [displays, setDisplays] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch displays from API
    const mockDisplays = [
      {
        id: "1",
        name: "Main Hall Display",
        templateType: "masjid",
        displayUrl: "https://display.example.com/main-hall-123",
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
    return <div className="text-slate-400">Loading displays...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-50">Your Displays</h2>
          <p className="text-slate-400 text-sm mt-1">
            Create and manage your display screens
          </p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
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
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Display
            </Button>
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

      <CreateDisplayDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={handleAddDisplay}
      />
    </div>
  );
}
