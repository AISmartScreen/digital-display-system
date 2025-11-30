"use client";

import { useState } from "react";
import { DisplaysPageCard } from "@/components/displays/display-page-card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data
const mockDisplays = [
  {
    id: "1",
    name: "Main Hall Display",
    templateType: "masjid",
    displayUrl: "/displays/1/live",
    status: "active" as const,
    location: "Masjid Al-Noor - Main Prayer Hall",
    resolution: "1920x1080",
    lastActive: "2 mins ago",
    thumbnail:
      "https://images.unsplash.com/photo-1591154669695-5f2a8d20c089?w=400",
  },
  {
    id: "2",
    name: "Reception Area",
    templateType: "hospital",
    displayUrl: "/displays/2/live",
    status: "active" as const,
    location: "City Hospital - Main Lobby",
    resolution: "3840x2160",
    lastActive: "5 mins ago",
    thumbnail:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400",
  },
  {
    id: "3",
    name: "Menu Board",
    templateType: "restaurant",
    displayUrl: "/displays/3/live",
    status: "active" as const,
    location: "Tasty Bites Restaurant",
    resolution: "1920x1080",
    lastActive: "1 min ago",
    thumbnail:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
  },
  {
    id: "4",
    name: "Store Front Display",
    templateType: "retail",
    displayUrl: "/displays/4/live",
    status: "inactive" as const,
    location: "Fashion Hub - Mall Entrance",
    resolution: "1920x1080",
    lastActive: "2 hours ago",
    thumbnail:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
  },
  {
    id: "5",
    name: "Conference Room Display",
    templateType: "corporate",
    displayUrl: "/displays/5/live",
    status: "active" as const,
    location: "TechCorp HQ - Floor 3",
    resolution: "3840x2160",
    lastActive: "10 mins ago",
    thumbnail:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400",
  },
  {
    id: "6",
    name: "Prayer Times Board",
    templateType: "masjid",
    displayUrl: "/displays/6/live",
    status: "active" as const,
    location: "Masjid Al-Rahman - Entrance",
    resolution: "1920x1080",
    lastActive: "4 mins ago",
    thumbnail:
      "https://images.unsplash.com/photo-1591154669695-5f2a8d20c089?w=400",
  },
];

export default function DisplaysPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [filterTemplate, setFilterTemplate] = useState<string>("all");

  const handleEdit = (id: string) => {
    window.location.href = `/displays/${id}/edit`;
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this display?")) {
      console.log("Delete display:", id);
    }
  };

  const handlePreview = (id: string) => {
    window.location.href = `/displays/${id}/live`;
  };

  const filteredDisplays = mockDisplays.filter((display) => {
    const matchesSearch =
      display.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      display.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || display.status === filterStatus;
    const matchesTemplate =
      filterTemplate === "all" || display.templateType === filterTemplate;
    return matchesSearch && matchesStatus && matchesTemplate;
  });

  return (
    <div className="flex flex-col gap-6 p-6 sm:p-8 min-h-screen bg-gray-950">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            All Displays
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            Manage all your digital signage screens
          </p>
        </div>
        <Button className="bg-pink-300 text-gray-900 hover:bg-pink-400 w-full sm:w-auto">
          <Plus size={18} className="mr-2" />
          Add New Display
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            type="text"
            placeholder="Search displays or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={filterStatus}
            onValueChange={(value: any) => setFilterStatus(value)}
          >
            <SelectTrigger className="w-[140px] bg-gray-900 border-gray-800 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-800">
              <SelectItem value="all" className="text-white">
                All Status
              </SelectItem>
              <SelectItem value="active" className="text-white">
                Active
              </SelectItem>
              <SelectItem value="inactive" className="text-white">
                Inactive
              </SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterTemplate} onValueChange={setFilterTemplate}>
            <SelectTrigger className="w-[140px] bg-gray-900 border-gray-800 text-white">
              <SelectValue placeholder="Template" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-800">
              <SelectItem value="all" className="text-white">
                All Templates
              </SelectItem>
              <SelectItem value="masjid" className="text-white">
                Masjid
              </SelectItem>
              <SelectItem value="hospital" className="text-white">
                Hospital
              </SelectItem>
              <SelectItem value="restaurant" className="text-white">
                Restaurant
              </SelectItem>
              <SelectItem value="retail" className="text-white">
                Retail
              </SelectItem>
              <SelectItem value="corporate" className="text-white">
                Corporate
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-gray-400 text-sm">
        Showing {filteredDisplays.length} of {mockDisplays.length} displays
      </p>

      {/* Displays Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDisplays.map((display) => (
          <DisplaysPageCard
            key={display.id}
            {...display}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPreview={handlePreview}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredDisplays.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Search size={32} className="text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No displays found
          </h3>
          <p className="text-gray-400 mb-6">
            Try adjusting your search or filters
          </p>
          <Button
            onClick={() => {
              setSearchQuery("");
              setFilterStatus("all");
              setFilterTemplate("all");
            }}
            variant="outline"
            className="bg-gray-900 border-gray-800 text-white hover:bg-gray-800"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
