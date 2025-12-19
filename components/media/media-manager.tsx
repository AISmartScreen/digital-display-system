"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  HardDrive,
  Settings,
  Copy,
  Download,
  Trash2,
  ImageIcon,
  Video,
  Loader2,
  Upload,
  X,
  Filter,
} from "lucide-react";
import Image from "next/image";

interface MediaItem {
  id: string;
  fileName: string;
  fileType: "image" | "video";
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
  userId: string;
  displayId: string;
  type: string;
}

interface UploadCriteria {
  userId: string;
  displayId: string;
  type: string;
}

interface AuthUser {
  id: string;
  email: string;
  role: "admin" | "client";
  businessName?: string;
}

// Upload Zone Component
interface UploadZoneProps {
  onFileSelect: (files: File[]) => void;
  isUploading: boolean;
  userId: string;
  displayId: string;
  type: string;
}

function UploadZone({
  onFileSelect,
  isUploading,
  userId,
  displayId,
  type,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    onFileSelect(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      onFileSelect(files);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
        isDragging
          ? "border-pink-500 bg-pink-500/10"
          : "border-slate-700 bg-slate-800"
      } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
    >
      {isUploading ? (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
          <p className="text-slate-300">Uploading files...</p>
        </div>
      ) : (
        <>
          <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-300 mb-2">
            Drag and drop files here, or click to browse
          </p>
          <p className="text-slate-500 text-sm mb-4">
            Supports images and videos
          </p>
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileInput}
            className="hidden"
            id="file-input"
          />
          <Button
            onClick={() => document.getElementById("file-input")?.click()}
            className="bg-pink-500 hover:bg-pink-600"
          >
            Select Files
          </Button>
        </>
      )}
    </div>
  );
}

// Confirm Modal Component
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={!isLoading ? onClose : undefined}
      />
      <div className="relative bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
        <h3 className="text-lg font-semibold text-slate-50 mb-2">{title}</h3>
        <p className="text-slate-400 text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button
            onClick={onClose}
            disabled={isLoading}
            variant="ghost"
            className="bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-50"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Media Gallery Component
interface MediaGalleryProps {
  items: MediaItem[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
  isDeleting?: string | null;
}

function MediaGallery({
  items,
  onDelete,
  onClearAll,
  isDeleting = null,
}: MediaGalleryProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Filter states
  const [selectedId, setSelectedId] = useState<string>("all");
  const [selectedDisplayId, setSelectedDisplayId] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedFileType, setSelectedFileType] = useState<string>("all");
  const [selectedDateRange, setSelectedDateRange] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      onDelete(itemToDelete);
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const handleClearAllClick = () => {
    setShowClearModal(true);
  };

  const handleConfirmClearAll = () => {
    onClearAll();
    setShowClearModal(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  // Get unique values for filters
  const uniqueIds = Array.from(new Set(items.map((item) => item.id))).sort();
  const uniqueDisplayIds = Array.from(
    new Set(items.map((item) => item.displayId))
  ).sort();
  const uniqueTypes = Array.from(
    new Set(items.map((item) => item.type))
  ).sort();

  // Filter items based on selected filters
  const filteredItems = items.filter((item) => {
    if (selectedId !== "all" && item.id !== selectedId) return false;
    if (selectedDisplayId !== "all" && item.displayId !== selectedDisplayId)
      return false;
    if (selectedType !== "all" && item.type !== selectedType) return false;
    if (selectedFileType !== "all" && item.fileType !== selectedFileType)
      return false;

    if (selectedDateRange !== "all") {
      const uploadDate = new Date(item.uploadedAt);
      const now = new Date();
      const daysDiff = Math.floor(
        (now.getTime() - uploadDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (selectedDateRange === "today" && daysDiff > 0) return false;
      if (selectedDateRange === "week" && daysDiff > 7) return false;
      if (selectedDateRange === "month" && daysDiff > 30) return false;
      if (selectedDateRange === "3months" && daysDiff > 90) return false;
    }

    return true;
  });

  // Clear all filters
  const clearFilters = () => {
    setSelectedId("all");
    setSelectedDisplayId("all");
    setSelectedType("all");
    setSelectedFileType("all");
    setSelectedDateRange("all");
  };

  const hasActiveFilters =
    selectedId !== "all" ||
    selectedDisplayId !== "all" ||
    selectedType !== "all" ||
    selectedFileType !== "all" ||
    selectedDateRange !== "all";

  if (items.length === 0) {
    return (
      <Card className="bg-slate-800 border-slate-700 p-8 text-center">
        <p className="text-slate-400">No media files uploaded yet</p>
      </Card>
    );
  }

  return (
    <>
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setItemToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete File"
        message="Are you sure you want to delete this file? This action cannot be undone."
        isLoading={isDeleting === itemToDelete}
      />

      <ConfirmModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleConfirmClearAll}
        title="Clear All Files"
        message={`Are you sure you want to delete all ${items.length} file(s)? This action cannot be undone.`}
        isLoading={isDeleting === "clear-all"}
      />

      {/* Filter Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            size="sm"
            className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
            {hasActiveFilters && (
              <span className="ml-2 bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </Button>

          {hasActiveFilters && (
            <Button
              onClick={clearFilters}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>

        {showFilters && (
          <Card className="bg-slate-800 border-slate-700 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* ID Filter */}
              <div>
                <label className="text-xs text-slate-400 mb-2 block font-medium">
                  File ID
                </label>
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200 text-sm focus:outline-none focus:border-pink-500"
                >
                  <option value="all">All Files</option>
                  {uniqueIds.map((id) => (
                    <option key={id} value={id}>
                      {id.length > 30 ? `...${id.slice(-27)}` : id}
                    </option>
                  ))}
                </select>
              </div>

              {/* Display ID Filter */}
              <div>
                <label className="text-xs text-slate-400 mb-2 block font-medium">
                  Display ID
                </label>
                <select
                  value={selectedDisplayId}
                  onChange={(e) => setSelectedDisplayId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200 text-sm focus:outline-none focus:border-pink-500"
                >
                  <option value="all">All Displays</option>
                  {uniqueDisplayIds.map((displayId) => (
                    <option key={displayId} value={displayId}>
                      {displayId}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="text-xs text-slate-400 mb-2 block font-medium">
                  Content Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200 text-sm focus:outline-none focus:border-pink-500"
                >
                  <option value="all">All Types</option>
                  {uniqueTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* File Type Filter */}
              <div>
                <label className="text-xs text-slate-400 mb-2 block font-medium">
                  File Format
                </label>
                <select
                  value={selectedFileType}
                  onChange={(e) => setSelectedFileType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200 text-sm focus:outline-none focus:border-pink-500"
                >
                  <option value="all">All Formats</option>
                  <option value="image">Images Only</option>
                  <option value="video">Videos Only</option>
                </select>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="text-xs text-slate-400 mb-2 block font-medium">
                  Upload Date
                </label>
                <select
                  value={selectedDateRange}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200 text-sm focus:outline-none focus:border-pink-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="3months">Last 3 Months</option>
                </select>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-50">
          {hasActiveFilters ? (
            <>
              Filtered Results ({filteredItems.length} of {items.length})
            </>
          ) : (
            <>Your Files ({items.length})</>
          )}
        </h2>
        {items.length > 0 && (
          <Button
            onClick={handleClearAllClick}
            variant="ghost"
            size="sm"
            className="bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {filteredItems.length === 0 ? (
        <Card className="bg-slate-800 border-slate-700 p-8 text-center">
          <p className="text-slate-400">No files match the selected filters</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="bg-slate-800 border-slate-700 overflow-hidden hover:border-slate-600 transition-colors relative"
            >
              {isDeleting === item.id && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                    <p className="text-sm text-slate-300">Deleting...</p>
                  </div>
                </div>
              )}

              <div className="bg-slate-900 aspect-video flex items-center justify-center overflow-hidden">
                {item.fileType === "image" ? (
                  <Image
                    src={item.fileUrl}
                    alt={item.fileName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                    <Video className="w-8 h-8" />
                    <p className="text-xs">Video</p>
                  </div>
                )}
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {item.fileType === "image" ? (
                      <ImageIcon className="w-4 h-4 text-slate-500" />
                    ) : (
                      <Video className="w-4 h-4 text-slate-500" />
                    )}
                    <p className="text-sm font-semibold text-slate-50 truncate">
                      {item.fileName}
                    </p>
                  </div>
                  <p className="text-xs text-slate-400">
                    {formatFileSize(item.fileSize)} ·{" "}
                    {new Date(item.uploadedAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Display: {item.displayId} · Type: {item.type}
                  </p>
                </div>

                <div className="bg-slate-700/50 rounded p-2 font-mono text-xs text-slate-300 truncate">
                  {item.fileUrl}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopyUrl(item.fileUrl, item.id)}
                    className="flex-1 text-xs text-slate-400 hover:text-slate-50 hover:bg-slate-700"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    {copiedId === item.id ? "Copied" : "Copy"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(item.fileUrl, "_blank")}
                    className="flex-1 text-xs text-slate-400 hover:text-slate-50 hover:bg-slate-700"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteClick(item.id)}
                    disabled={isDeleting === item.id}
                    className="flex-1 text-xs text-red-400 hover:text-red-500 hover:bg-red-500/10 disabled:opacity-50"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

// Media Manager Component
export function MediaManager() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showCriteriaForm, setShowCriteriaForm] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Dynamic dropdown options from existing media
  const [availableDisplayIds, setAvailableDisplayIds] = useState<string[]>([
    "default",
  ]);
  const [availableTypes, setAvailableTypes] = useState<string[]>([
    "background",
  ]);

  // Upload criteria state
  const [uploadCriteria, setUploadCriteria] = useState<UploadCriteria>({
    userId: "",
    displayId: "default",
    type: "background",
  });

  // Fetch current user on mount
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Update userId when currentUser is loaded
  useEffect(() => {
    if (currentUser) {
      setUploadCriteria((prev) => ({
        ...prev,
        userId: currentUser.id,
      }));
      fetchMedia();
    }
  }, [currentUser]);

  // Extract unique displayIds and types from mediaItems
  useEffect(() => {
    if (mediaItems.length > 0) {
      // Extract unique displayIds
      const uniqueDisplayIds = Array.from(
        new Set(mediaItems.map((item) => item.displayId))
      ).sort();

      // Extract unique types
      const uniqueTypes = Array.from(
        new Set(mediaItems.map((item) => item.type))
      ).sort();

      // Always include 'default' and 'background' as options
      const displayIdsWithDefault = uniqueDisplayIds.includes("default")
        ? uniqueDisplayIds
        : ["default", ...uniqueDisplayIds];

      const typesWithDefault = uniqueTypes.includes("background")
        ? uniqueTypes
        : ["background", ...uniqueTypes];

      setAvailableDisplayIds(displayIdsWithDefault);
      setAvailableTypes(typesWithDefault);
    }
  }, [mediaItems]);

  const fetchCurrentUser = async () => {
    setIsLoadingUser(true);

    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        console.log("User data received:", data);
        setCurrentUser(data.user);
      } else {
        console.log("Auth check failed");
        window.location.href = "/login";
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setError("Failed to load user information");
      window.location.href = "/login";
    } finally {
      setIsLoadingUser(false);
    }
  };

  const fetchMedia = async () => {
    if (!currentUser) return;

    setIsLoadingMedia(true);
    try {
      // Pass userId as query parameter for server-side filtering
      const response = await fetch(
        `/api/media?userId=${encodeURIComponent(currentUser.id)}`
      );
      const data = await response.json();

      console.log("Fetched user media:", data.length, "items");

      setMediaItems(data);
    } catch (err) {
      console.error("Failed to fetch media:", err);
      setError("Failed to load media files");
    } finally {
      setIsLoadingMedia(false);
    }
  };

  const handleFileSelect = async (files: File[]) => {
    if (!currentUser) {
      setError("You must be logged in to upload files");
      return;
    }

    setIsUploading(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      formData.append("userId", currentUser.id);
      formData.append("displayId", uploadCriteria.displayId);
      formData.append("type", uploadCriteria.type);

      const response = await fetch("/api/media/uploadMedia", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();

      setMessage(`Successfully uploaded ${files.length} file(s)`);
      setTimeout(() => setMessage(""), 3000);

      // Refresh media list to get updated files
      fetchMedia();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to upload files. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    setError("");

    try {
      const response = await fetch(`/api/media/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setMediaItems(mediaItems.filter((item) => item.id !== id));
      setMessage("File deleted successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setError("Failed to delete file");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleClearAll = async () => {
    setIsDeleting("clear-all");
    setError("");

    try {
      const deletePromises = mediaItems.map((item) =>
        fetch(`/api/media/${encodeURIComponent(item.id)}`, {
          method: "DELETE",
        })
      );

      await Promise.all(deletePromises);

      setMediaItems([]);
      setMessage("All files deleted successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setError("Failed to delete all files");
    } finally {
      setIsDeleting(null);
    }
  };

  const totalSize = mediaItems.reduce((sum, item) => sum + item.fileSize, 0);
  const maxSize = 5 * 1024 * 1024 * 1024;

  // Get user initials
  const getInitials = (name: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-slate-400 animate-spin" />
          <p className="text-slate-400">Loading user information...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Card className="bg-slate-800 border-slate-700 p-8 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-50 text-center mb-2">
            Authentication Required
          </h2>
          <p className="text-slate-400 text-center mb-6">
            Please log in to access the media library.
          </p>
          <Button
            onClick={() => (window.location.href = "/login")}
            className="w-full bg-pink-500 hover:bg-pink-600"
          >
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-50">
                Media Library
              </h1>
              <p className="text-slate-400 text-sm">
                Upload and manage images and videos for your displays
              </p>
            </div>
            <div className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                {currentUser.businessName
                  ? getInitials(currentUser.businessName)
                  : getInitials(currentUser.email)}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-50">
                  {currentUser.businessName || currentUser.email}
                </p>
                <p className="text-xs text-slate-400 capitalize">
                  {currentUser.role.replace("_", " ")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Card className="bg-slate-800 border-slate-700 p-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HardDrive className="w-5 h-5 text-pink-500" />
              <div>
                <p className="text-sm text-slate-400">Storage Used</p>
                <p className="text-lg font-semibold text-slate-50">
                  {(totalSize / (1024 * 1024)).toFixed(2)} MB /{" "}
                  {(maxSize / (1024 * 1024 * 1024)).toFixed(0)} GB
                </p>
              </div>
            </div>
            <div className="w-32 bg-slate-700 rounded-full h-2">
              <div
                className="bg-pink-500 h-2 rounded-full transition-all"
                style={{
                  width: `${Math.min((totalSize / maxSize) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        </Card>

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {message && (
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
            <AlertCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            <p className="text-green-500 text-sm">{message}</p>
          </div>
        )}

        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-50">
              Upload New Files
            </h2>
            <Button
              onClick={() => setShowCriteriaForm(!showCriteriaForm)}
              variant="outline"
              size="sm"
              className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
            >
              <Settings className="w-4 h-4 mr-2" />
              Upload Settings
            </Button>
          </div>

          {showCriteriaForm && (
            <Card className="bg-slate-800 border-slate-700 p-4 mb-4">
              <h3 className="text-sm font-semibold text-slate-50 mb-3">
                Upload Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* User ID - Read Only */}
                <div>
                  <label className="text-xs text-slate-400 mb-2 block font-medium">
                    User ID (Auto-assigned)
                  </label>
                  <input
                    type="text"
                    value={currentUser.id}
                    disabled
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-400 text-sm cursor-not-allowed"
                  />
                </div>

                {/* Display ID - Dropdown */}
                <div>
                  <label className="text-xs text-slate-400 mb-2 block font-medium">
                    Display ID
                  </label>
                  <select
                    value={uploadCriteria.displayId}
                    onChange={(e) =>
                      setUploadCriteria({
                        ...uploadCriteria,
                        displayId: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200 text-sm focus:outline-none focus:border-pink-500"
                  >
                    {availableDisplayIds.map((displayId) => (
                      <option key={displayId} value={displayId}>
                        {displayId}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">
                    Select which display this media is for
                  </p>
                </div>

                {/* Type - Dropdown */}
                <div>
                  <label className="text-xs text-slate-400 mb-2 block font-medium">
                    Content Type
                  </label>
                  <select
                    value={uploadCriteria.type}
                    onChange={(e) =>
                      setUploadCriteria({
                        ...uploadCriteria,
                        type: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-200 text-sm focus:outline-none focus:border-pink-500"
                  >
                    {availableTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">
                    Categorize your media content
                  </p>
                </div>
              </div>
            </Card>
          )}

          <UploadZone
            onFileSelect={handleFileSelect}
            isUploading={isUploading}
            userId={currentUser.id}
            displayId={uploadCriteria.displayId}
            type={uploadCriteria.type}
          />
        </div>

        <div>
          {isLoadingMedia ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                <p className="text-slate-400">Loading your media files...</p>
              </div>
            </div>
          ) : (
            <MediaGallery
              items={mediaItems}
              onDelete={handleDelete}
              onClearAll={handleClearAll}
              isDeleting={isDeleting}
            />
          )}
        </div>
      </main>
    </div>
  );
}
