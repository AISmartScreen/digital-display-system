"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Upload, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HospitalEditorProps {
  config: any;
  onConfigChange: (config: any) => void;
  displayId: string;
  displayName: string;
  templateType: string;
  userId?: string;
  environment?: "preview" | "production";
}

// Image Uploader Component
function ImageUploader({
  images,
  onChange,
  maxImages = 10,
  userId,
  displayId = "1",
  imageType = "background",
  environment = "preview",
}: {
  images: string[];
  onChange: (imgs: string[]) => void;
  maxImages?: number;
  userId?: string;
  displayId?: string;
  imageType: "logo" | "background" | "slideshow";
  environment?: "preview" | "production";
}) {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [mediaUploadedImages, setMediaUploadedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchImages = async () => {
      if (!userId || !displayId || !imageType) return;

      setIsLoading(true);
      try {
        const response = await fetch(`/api/media`);
        if (!response.ok) {
          console.error("Failed to fetch images:", await response.text());
          return;
        }

        const allMedia = await response.json();
        const filteredImages = allMedia
          .filter(
            (item: any) => item.userId === userId && item.type === imageType
          )
          .map((item: any) => item.fileUrl);

        setMediaUploadedImages(filteredImages);
      } catch (err) {
        console.error("Error fetching images:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [userId, displayId, imageType]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!userId) {
      setUploadError("User ID is required for upload");
      return;
    }

    if (!displayId) {
      setUploadError("Display ID is required for upload");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const validFiles = Array.from(files).filter((file) => {
        if (!file.type.startsWith("image/")) {
          setUploadError(`${file.name} is not an image file`);
          return false;
        }
        if (file.size > 10 * 1024 * 1024) {
          setUploadError(`${file.name} is too large (max 10MB)`);
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) {
        setIsUploading(false);
        return;
      }

      const formData = new FormData();
      validFiles.forEach((file) => formData.append("images", file));
      formData.append("userId", userId);
      formData.append("displayId", displayId);
      formData.append("type", imageType);

      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();

      if (maxImages === 1) {
        onChange(data.urls.slice(0, 1));
      } else {
        const combined = [...images, ...data.urls].slice(0, maxImages);
        onChange(combined);
      }

      // Refresh media library
      const imagesResponse = await fetch(`/api/media`);
      if (imagesResponse.ok) {
        const allMedia = await imagesResponse.json();
        const newImages = allMedia
          .filter(
            (item: any) =>
              item.userId === userId &&
              item.displayId === displayId &&
              item.type === imageType
          )
          .map((item: any) => item.fileUrl);
        setMediaUploadedImages(newImages);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleImageClick = (img: string) => {
    if (!images.includes(img)) {
      if (maxImages === 1) {
        onChange([img]);
      } else if (images.length < maxImages) {
        onChange([...images, img]);
      }
    }
  };

  const canUploadMore = images.length < maxImages;

  return (
    <div className="space-y-3">
      {canUploadMore && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={maxImages > 1}
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || !userId || !displayId}
            className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-600 rounded-lg hover:border-slate-500 hover:bg-slate-700/30 text-slate-400 hover:text-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-5 h-5" />
            <span className="text-sm font-medium">
              {isUploading
                ? "Uploading..."
                : `Upload ${
                    imageType === "logo"
                      ? "Logo"
                      : imageType === "background"
                      ? "Background"
                      : "Images"
                  }`}
            </span>
          </button>
          {maxImages > 1 && (
            <p className="text-xs text-slate-500 mt-2 text-center">
              {images.length} / {maxImages} images selected
            </p>
          )}
        </div>
      )}

      {uploadError && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-400">{uploadError}</p>
        </div>
      )}

      {images.length > 0 && (
        <div>
          <label className="text-xs text-slate-400 font-medium block mb-2">
            Currently Selected ({images.length})
          </label>
          <div className="grid grid-cols-2 gap-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={img}
                  alt={`Selected ${idx + 1}`}
                  className="w-full h-24 object-cover rounded border border-slate-600"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {(isLoading || mediaUploadedImages.length > 0) && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-green-400">
                Media Library ({mediaUploadedImages.length})
              </span>
            </label>
          </div>

          {isLoading ? (
            <div className="text-center py-6">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-green-400 border-t-transparent"></div>
              <p className="text-xs text-slate-400 mt-2">
                Loading media library...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
              {mediaUploadedImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative group cursor-pointer"
                  onClick={() => handleImageClick(img)}
                >
                  <img
                    src={img}
                    alt={`Media ${idx + 1}`}
                    className={`w-full h-20 object-cover rounded border-2 transition-colors ${
                      images.includes(img)
                        ? "border-green-500"
                        : "border-slate-600 hover:border-green-400"
                    }`}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {images.includes(img) ? "✓ Selected" : "Click to use"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e293b;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </div>
  );
}

export function HospitalEditor({
  displayId,
  displayName,
  templateType,
  config,
  onConfigChange,
  userId,
  environment = "preview",
}: HospitalEditorProps) {
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(
    userId
  );

  // Helper to convert datetime-local value to ISO string (preserving local time)
  const localToISO = (localDatetimeString: string) => {
    // Input format: "2025-12-04T11:00"
    // We want to store this as the actual time, not convert to UTC
    const [date, time] = localDatetimeString.split("T");
    const [year, month, day] = date.split("-");
    const [hours, minutes] = time.split(":");

    // Create date in local timezone
    const localDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes)
    );

    return localDate.toISOString();
  };

  // Helper to convert ISO string to datetime-local value
  const isoToLocal = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    // Get local date/time components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Helper to format time for input (HH:MM format)
  const formatTimeForInput = (date?: Date | string) => {
    if (!date) return "09:00";
    const d = typeof date === "string" ? new Date(date) : date;
    if (isNaN(d.getTime())) return "09:00";
    const h = d.getHours().toString().padStart(2, "0");
    const m = d.getMinutes().toString().padStart(2, "0");
    return `${h}:${m}`;
  };

  // Helper to format time for display (12-hour with AM/PM)
  const formatTimeForDisplay = (date?: Date | string) => {
    if (!date) return "9:00 AM";
    const d = typeof date === "string" ? new Date(date) : date;
    if (isNaN(d.getTime())) return "9:00 AM";
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, "0");
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  // Fetch user ID if not provided
  useEffect(() => {
    const fetchUserId = async () => {
      if (userId) {
        setCurrentUserId(userId);
        return;
      }

      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user?.id) {
            setCurrentUserId(data.user.id);
          }
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, [userId]);

  // Extract config values with defaults
  const hospitalName = config.hospitalName || "MediTech Hospital";
  const tagline = config.tagline || "Excellence in Healthcare Since 1995";
  const hospitalLogo = config.hospitalLogo || "";
  const backgroundImage = config.backgroundImage || "";
  const primaryColor = config.primaryColor || "#06b6d4";
  const secondaryColor = config.secondaryColor || "#14b8a6";
  const accentColor = config.accentColor || "#f59e0b";
  const tickerMessage =
    config.tickerMessage ||
    "⚕️ Quality Healthcare • Compassionate Service • Advanced Technology";
  const tickerRightMessage =
    config.tickerRightMessage || "Your Health, Our Priority";
  const doctorRotationSpeed = config.doctorRotationSpeed || 6000;
  const departmentInfo = config.departmentInfo || "Emergency Department";
  const emergencyContact = config.emergencyContact || "911";
  const doctorSchedules = config.doctorSchedules || [];
  const doctors = config.doctors || [];
  const appointments = config.appointments || [];
  const leftComponent = config.leftComponent || "doctors";
  const rightComponent = config.rightComponent || "appointments";
  const enableSlideshow = config.enableSlideshow || false;
  const slideshowSpeed = config.slideshowSpeed || 10000;

  // Handle basic field updates
  const handleFieldChange = (field: string, value: any) => {
    onConfigChange({ ...config, [field]: value });
  };

  // Doctor Schedule Management
  const handleAddSchedule = () => {
    const defaultDate = new Date();
    defaultDate.setHours(9, 0, 0, 0); // Default to 9:00 AM

    onConfigChange({
      ...config,
      doctorSchedules: [
        ...doctorSchedules,
        {
          name: "",
          specialty: "",
          room: "",
          appointmentDate: defaultDate.toISOString(),
        },
      ],
    });
  };

  const handleUpdateSchedule = (idx: number, field: string, value: any) => {
    const updated = [...doctorSchedules];

    if (field === "time") {
      // Handle time input (HH:MM format)
      const [hours, minutes] = value.split(":").map(Number);
      const date = updated[idx].appointmentDate
        ? new Date(updated[idx].appointmentDate)
        : new Date();
      date.setHours(hours, minutes, 0, 0);
      updated[idx] = {
        ...updated[idx],
        appointmentDate: date.toISOString(),
      };
    } else {
      updated[idx] = { ...updated[idx], [field]: value };
    }

    onConfigChange({ ...config, doctorSchedules: updated });
  };

  const handleRemoveSchedule = (idx: number) => {
    const updated = doctorSchedules.filter((_: any, i: number) => i !== idx);
    onConfigChange({ ...config, doctorSchedules: updated });
  };

  // Featured Doctors Management (for carousel)
  const handleAddDoctor = () => {
    onConfigChange({
      ...config,
      doctors: [
        ...doctors,
        {
          name: "",
          specialty: "",
          experience: "",
          image:
            "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop",
          available: "",
        },
      ],
    });
  };

  const handleUpdateDoctor = (idx: number, field: string, value: any) => {
    const updated = [...doctors];
    updated[idx] = { ...updated[idx], [field]: value };
    onConfigChange({ ...config, doctors: updated });
  };

  const handleRemoveDoctor = (idx: number) => {
    const updated = doctors.filter((_: any, i: number) => i !== idx);
    onConfigChange({ ...config, doctors: updated });
  };

  // Appointment Management
  const handleAddAppointment = () => {
    const defaultDate = new Date(Date.now() + 60 * 60000); // 1 hour from now

    onConfigChange({
      ...config,
      appointments: [
        ...appointments,
        {
          id: `apt-${Date.now()}`,
          patientName: "",
          doctorName: "",
          specialty: "",
          room: "",
          appointmentDate: defaultDate.toISOString(),
          priority: "normal",
        },
      ],
    });
  };

  const handleUpdateAppointment = (idx: number, field: string, value: any) => {
    const updated = [...appointments];
    updated[idx] = { ...updated[idx], [field]: value };
    onConfigChange({ ...config, appointments: updated });
  };

  const handleRemoveAppointment = (idx: number) => {
    const updated = appointments.filter((_: any, i: number) => i !== idx);
    onConfigChange({ ...config, appointments: updated });
  };

  return (
    <div className="space-y-8">
      {/* Layout Configuration */}
      <div>
        <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <span className="text-lg">🎛️</span> Layout Configuration
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">
              Left Panel Component
            </label>
            <Select
              value={leftComponent}
              onValueChange={(val) => handleFieldChange("leftComponent", val)}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="doctors">👨‍⚕️ Featured Doctors</SelectItem>
                <SelectItem value="appointments">📅 Appointments</SelectItem>
                <SelectItem value="schedules">🗓️ Doctor Schedules</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">
              Right Panel Component
            </label>
            <Select
              value={rightComponent}
              onValueChange={(val) => handleFieldChange("rightComponent", val)}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="doctors">👨‍⚕️ Featured Doctors</SelectItem>
                <SelectItem value="appointments">📅 Appointments</SelectItem>
                <SelectItem value="schedules">🗓️ Doctor Schedules</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 p-3 bg-slate-700/50 rounded-lg">
            <input
              type="checkbox"
              checked={enableSlideshow}
              onChange={(e) =>
                handleFieldChange("enableSlideshow", e.target.checked)
              }
              className="w-4 h-4"
            />
            <label className="text-sm text-slate-300">
              Enable Slideshow (Auto-rotate components)
            </label>
          </div>
          {enableSlideshow && (
            <div>
              <label className="text-xs text-slate-400 mb-1 block">
                Slideshow Speed (milliseconds)
              </label>
              <Input
                type="number"
                value={slideshowSpeed}
                onChange={(e) =>
                  handleFieldChange("slideshowSpeed", parseInt(e.target.value))
                }
                min="5000"
                max="60000"
                step="1000"
                className="bg-slate-700 border-slate-600 text-slate-50"
              />
              <p className="text-xs text-slate-500 mt-1">
                Current: {slideshowSpeed / 1000} seconds per component
              </p>
            </div>
          )}
        </div>
      </div>

      <hr className="border-slate-700" />

      {/* Hospital Branding */}
      <div>
        <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <span className="text-lg">🏥</span> Hospital Branding
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">
              Hospital Name
            </label>
            <Input
              value={hospitalName}
              onChange={(e) =>
                handleFieldChange("hospitalName", e.target.value)
              }
              placeholder="MediTech Hospital"
              className="bg-slate-700 border-slate-600 text-slate-50"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Tagline</label>
            <Input
              value={tagline}
              onChange={(e) => handleFieldChange("tagline", e.target.value)}
              placeholder="Excellence in Healthcare Since 1995"
              className="bg-slate-700 border-slate-600 text-slate-50"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">
              Hospital Logo
            </label>
            <ImageUploader
              images={hospitalLogo ? [hospitalLogo] : []}
              onChange={(imgs) =>
                handleFieldChange("hospitalLogo", imgs[0] || "")
              }
              maxImages={1}
              userId={currentUserId}
              displayId={displayId}
              imageType="logo"
              environment={environment}
            />
          </div>
        </div>
      </div>

      <hr className="border-slate-700" />

      {/* Colors & Styling */}
      <div>
        <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <span className="text-lg">🎨</span> Colors & Styling
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">
              Primary Color
            </label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={primaryColor}
                onChange={(e) =>
                  handleFieldChange("primaryColor", e.target.value)
                }
                className="w-16 h-10 p-1 bg-slate-700 border-slate-600"
              />
              <Input
                value={primaryColor}
                onChange={(e) =>
                  handleFieldChange("primaryColor", e.target.value)
                }
                className="flex-1 bg-slate-700 border-slate-600 text-slate-50 text-xs"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">
              Secondary Color
            </label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={secondaryColor}
                onChange={(e) =>
                  handleFieldChange("secondaryColor", e.target.value)
                }
                className="w-16 h-10 p-1 bg-slate-700 border-slate-600"
              />
              <Input
                value={secondaryColor}
                onChange={(e) =>
                  handleFieldChange("secondaryColor", e.target.value)
                }
                className="flex-1 bg-slate-700 border-slate-600 text-slate-50 text-xs"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">
              Accent Color
            </label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={accentColor}
                onChange={(e) =>
                  handleFieldChange("accentColor", e.target.value)
                }
                className="w-16 h-10 p-1 bg-slate-700 border-slate-600"
              />
              <Input
                value={accentColor}
                onChange={(e) =>
                  handleFieldChange("accentColor", e.target.value)
                }
                className="flex-1 bg-slate-700 border-slate-600 text-slate-50 text-xs"
              />
            </div>
          </div>
        </div>
        <div className="mt-3">
          <label className="text-xs text-slate-400 mb-1 block">
            Background Image
          </label>
          <ImageUploader
            images={backgroundImage ? [backgroundImage] : []}
            onChange={(imgs) =>
              handleFieldChange("backgroundImage", imgs[0] || "")
            }
            maxImages={1}
            userId={currentUserId}
            displayId={displayId}
            imageType="background"
            environment={environment}
          />
        </div>
      </div>

      <hr className="border-slate-700" />

      {/* Contact Information */}
      <div>
        <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <span className="text-lg">📞</span> Contact Information
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">
              Emergency Contact
            </label>
            <Input
              value={emergencyContact}
              onChange={(e) =>
                handleFieldChange("emergencyContact", e.target.value)
              }
              placeholder="911"
              className="bg-slate-700 border-slate-600 text-slate-50"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">
              Department
            </label>
            <Input
              value={departmentInfo}
              onChange={(e) =>
                handleFieldChange("departmentInfo", e.target.value)
              }
              placeholder="Emergency Department"
              className="bg-slate-700 border-slate-600 text-slate-50"
            />
          </div>
        </div>
      </div>

      <hr className="border-slate-700" />

      {/* Ticker Messages */}
      <div>
        <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <span className="text-lg">📰</span> Ticker Messages
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">
              Left Ticker Message
            </label>
            <Input
              value={tickerMessage}
              onChange={(e) =>
                handleFieldChange("tickerMessage", e.target.value)
              }
              placeholder="⚕️ Quality Healthcare • Compassionate Service"
              className="bg-slate-700 border-slate-600 text-slate-50"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">
              Right Ticker Message
            </label>
            <Input
              value={tickerRightMessage}
              onChange={(e) =>
                handleFieldChange("tickerRightMessage", e.target.value)
              }
              placeholder="Your Health, Our Priority"
              className="bg-slate-700 border-slate-600 text-slate-50"
            />
          </div>
        </div>
      </div>

      <hr className="border-slate-700" />

      {/* Featured Doctors (Carousel) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <span className="text-lg">👨‍⚕️</span> Featured Doctors (Carousel)
          </h3>
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddDoctor}
            className="border-slate-600 text-slate-300 h-7 bg-transparent hover:bg-slate-700"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Doctor
          </Button>
        </div>
        <div className="space-y-3">
          {doctors.map((doctor: any, idx: number) => (
            <div key={idx} className="bg-slate-700/50 p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">
                  Doctor #{idx + 1}
                </span>
              </div>
              <Input
                value={doctor.name}
                onChange={(e) =>
                  handleUpdateDoctor(idx, "name", e.target.value)
                }
                placeholder="Dr. Name"
                className="bg-slate-700 border-slate-600 text-slate-50 text-sm"
              />
              <Input
                value={doctor.specialty}
                onChange={(e) =>
                  handleUpdateDoctor(idx, "specialty", e.target.value)
                }
                placeholder="Specialty (e.g., Cardiology)"
                className="bg-slate-700 border-slate-600 text-slate-50 text-sm"
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={doctor.experience}
                  onChange={(e) =>
                    handleUpdateDoctor(idx, "experience", e.target.value)
                  }
                  placeholder="Experience (e.g., 15+ Years)"
                  className="bg-slate-700 border-slate-600 text-slate-50 text-sm"
                />
                <Input
                  value={doctor.available}
                  onChange={(e) =>
                    handleUpdateDoctor(idx, "available", e.target.value)
                  }
                  placeholder="Availability"
                  className="bg-slate-700 border-slate-600 text-slate-50 text-sm"
                />
              </div>
              <Input
                value={doctor.image}
                onChange={(e) =>
                  handleUpdateDoctor(idx, "image", e.target.value)
                }
                placeholder="Image URL"
                className="bg-slate-700 border-slate-600 text-slate-50 text-sm"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleRemoveDoctor(idx)}
                className="w-full text-red-400 hover:bg-red-500/10 text-sm"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Remove Doctor
              </Button>
            </div>
          ))}
          {doctors.length === 0 && (
            <div className="text-center py-6 text-slate-500 text-sm">
              No featured doctors added yet. Click "Add Doctor" to start.
            </div>
          )}
        </div>
        <div className="mt-3">
          <label className="text-xs text-slate-400 mb-1 block">
            Carousel Rotation Speed (milliseconds)
          </label>
          <Input
            type="number"
            value={doctorRotationSpeed}
            onChange={(e) =>
              handleFieldChange("doctorRotationSpeed", parseInt(e.target.value))
            }
            min="2000"
            max="20000"
            step="1000"
            className="bg-slate-700 border-slate-600 text-slate-50"
          />
          <p className="text-xs text-slate-500 mt-1">
            Current: {doctorRotationSpeed / 1000} seconds per doctor
          </p>
        </div>
      </div>

      <hr className="border-slate-700" />

      {/* Appointments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <span className="text-lg">📅</span> Appointments
          </h3>
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddAppointment}
            className="border-slate-600 text-slate-300 h-7 bg-transparent hover:bg-slate-700"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Appointment
          </Button>
        </div>
        <div className="space-y-3">
          {appointments.map((appointment: any, idx: number) => (
            <div key={idx} className="bg-slate-700/50 p-3 rounded space-y-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400">
                  Appointment #{idx + 1}
                </span>
              </div>
              <Input
                value={appointment.patientName}
                onChange={(e) =>
                  handleUpdateAppointment(idx, "patientName", e.target.value)
                }
                placeholder="Patient Name"
                className="bg-slate-700 border-slate-600 text-slate-50 text-sm"
              />
              <Input
                value={appointment.doctorName}
                onChange={(e) =>
                  handleUpdateAppointment(idx, "doctorName", e.target.value)
                }
                placeholder="Doctor Name"
                className="bg-slate-700 border-slate-600 text-slate-50 text-sm"
              />
              <Input
                value={appointment.specialty}
                onChange={(e) =>
                  handleUpdateAppointment(idx, "specialty", e.target.value)
                }
                placeholder="Specialty"
                className="bg-slate-700 border-slate-600 text-slate-50 text-sm"
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">
                    Date & Time
                  </label>
                  <Input
                    type="datetime-local"
                    value={isoToLocal(appointment.appointmentDate)}
                    onChange={(e) => {
                      handleUpdateAppointment(
                        idx,
                        "appointmentDate",
                        localToISO(e.target.value)
                      );
                    }}
                    className="bg-slate-700 border-slate-600 text-slate-50 text-sm"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Display: {formatTimeForDisplay(appointment.appointmentDate)}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">
                    Room Number
                  </label>
                  <Input
                    value={appointment.room}
                    onChange={(e) =>
                      handleUpdateAppointment(idx, "room", e.target.value)
                    }
                    placeholder="Room #"
                    className="bg-slate-700 border-slate-600 text-slate-50 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">
                  Priority
                </label>
                <Select
                  value={appointment.priority || "normal"}
                  onValueChange={(val) =>
                    handleUpdateAppointment(idx, "priority", val)
                  }
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-50 text-sm h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleRemoveAppointment(idx)}
                className="w-full text-red-400 hover:bg-red-500/10 text-sm"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Remove Appointment
              </Button>
            </div>
          ))}
          {appointments.length === 0 && (
            <div className="text-center py-6 text-slate-500 text-sm">
              No appointments added yet. Click "Add Appointment" to start.
            </div>
          )}
        </div>
      </div>

      <hr className="border-slate-700" />

      {/* Doctor Schedules (Right Panel) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <span className="text-lg">📅</span> Today's Doctor Schedules
          </h3>
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddSchedule}
            className="border-slate-600 text-slate-300 h-7 bg-transparent hover:bg-slate-700"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Schedule
          </Button>
        </div>
        <div className="space-y-3">
          {doctorSchedules.map((schedule: any, idx: number) => (
            <div key={idx} className="bg-slate-700/50 p-3 rounded space-y-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400">
                  Schedule #{idx + 1}
                </span>
              </div>
              <Input
                value={schedule.name}
                onChange={(e) =>
                  handleUpdateSchedule(idx, "name", e.target.value)
                }
                placeholder="Doctor Name"
                className="bg-slate-700 border-slate-600 text-slate-50 text-sm"
              />
              <Input
                value={schedule.specialty}
                onChange={(e) =>
                  handleUpdateSchedule(idx, "specialty", e.target.value)
                }
                placeholder="Specialty"
                className="bg-slate-700 border-slate-600 text-slate-50 text-sm"
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">
                    Time
                  </label>
                  <Input
                    type="time"
                    value={formatTimeForInput(schedule.appointmentDate)}
                    onChange={(e) =>
                      handleUpdateSchedule(idx, "time", e.target.value)
                    }
                    className="bg-slate-700 border-slate-600 text-slate-50 text-sm"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Display: {formatTimeForDisplay(schedule.appointmentDate)}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">
                    Room
                  </label>
                  <Input
                    value={schedule.room}
                    onChange={(e) =>
                      handleUpdateSchedule(idx, "room", e.target.value)
                    }
                    placeholder="Room #"
                    className="bg-slate-700 border-slate-600 text-slate-50 text-sm"
                  />
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleRemoveSchedule(idx)}
                className="w-full text-red-400 hover:bg-red-500/10 text-sm"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Remove Schedule
              </Button>
            </div>
          ))}
          {doctorSchedules.length === 0 && (
            <div className="text-center py-6 text-slate-500 text-sm">
              No schedules added yet. Click "Add Schedule" to start.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
