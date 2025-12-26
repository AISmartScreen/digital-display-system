"use client";

import Image from "next/image";
import { Edit2, Eye, Trash2 } from "lucide-react";
import { useState } from "react";

interface DisplayCardProps {
  id: string;
  name: string;
  templateType: string;
  displayUrl: string;
  status: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPreview: (id: string) => void;
}

export function DisplayCard({
  id,
  name,
  templateType,
  displayUrl,
  status,
  onEdit,
  onDelete,
  onPreview,
}: DisplayCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(displayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPreviewImage = (type: string) => {
    const previewImages: Record<string, string> = {
      masjid: "/mosque-background.jpg",
      hospital: "/hospital-background.jpg",
      restaurant: "/restaurant-background.jpg",
      retail: "/retail-background.jpg",
    };
    return previewImages[type] || previewImages.restaurant;
  };

  const getBackgroundGradient = (type: string) => {
    const gradients: Record<string, string> = {
      masjid: "from-amber-900/40 via-orange-900/30 to-transparent",
      hospital: "from-red-900/40 via-pink-900/30 to-transparent",
      restaurant: "from-blue-900/40 via-cyan-900/30 to-transparent",
    };
    return gradients[type] || gradients.restaurant;
  };

  const getStatusColor = (st: string) => {
    return st === "active" ? "text-green-400" : "text-gray-500";
  };

  return (
    <div
      className="relative rounded-2xl sm:rounded-3xl overflow-hidden group"
      style={{ aspectRatio: "4/3" }}
    >
      <Image
        src={getPreviewImage(templateType) || "/placeholder.svg"}
        alt={name}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />

      <div
        className={`absolute inset-0 bg-gradient-to-t ${getBackgroundGradient(
          templateType
        )}`}
      />

      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white">
              {name}
            </h3>
            <p className={`text-xs uppercase mt-1 ${getStatusColor(status)}`}>
              {status}
            </p>
          </div>
          <span className="text-xs sm:text-sm text-gray-400 capitalize bg-black/30 px-3 py-1 rounded-full">
            {templateType}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onPreview(id)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-blue-600/30 hover:bg-blue-700 text-white transition-all"
          >
            <Eye size={14} />
            <span className="hidden sm:inline">Live</span>
          </button>
          <button
            onClick={() => onEdit(id)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-orange-600/30 hover:bg-orange-700 text-white transition-all"
          >
            <Edit2 size={14} />
            <span className="hidden sm:inline">Edit</span>
          </button>
          <button
            onClick={() => onDelete(id)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-red-600/30 hover:bg-red-700 text-white transition-all"
          >
            <Trash2 size={14} />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
