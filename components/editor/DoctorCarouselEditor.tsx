"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Plus,
  Upload,
  Calendar,
  Clock,
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
  Search,
  SortAsc,
  Eye,
  EyeOff,
  Check,
  X,
} from "lucide-react";
import { ImageUploader } from "./ImageUploader";
import CollapsibleSection from "./CollapsibleSection";

interface DoctorCarouselEditorProps {
  config: any;
  onConfigChange: (config: any) => void;
  displayId: string;
  userId?: string;
  environment?: "preview" | "production";
  layoutConfig?: "Advanced" | "Authentic";
}

export function DoctorCarouselEditor({
  config,
  onConfigChange,
  displayId,
  userId,
  environment = "preview",
  layoutConfig = "Advanced",
}: DoctorCarouselEditorProps) {
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(
    userId
  );
  const [uploadingDoctorIndex, setUploadingDoctorIndex] = useState<
    number | null
  >(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDisabled, setShowDisabled] = useState(true);

  // Separate enabled and disabled doctors
  const doctors = config.doctors || [];
  const disabledDoctors = config.disabledDoctors || [];
  const allDoctors = [...doctors, ...disabledDoctors];
  const slideSpeed = config.slideSpeed || 20;
  const doctorRotationSpeed = config.doctorRotationSpeed || 6000;

  // Filter doctors based on search
  const filteredDoctors = allDoctors.filter((doctor: any) => {
    const matchesSearch =
      doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.qualifications?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVisibility = showDisabled || doctor.enabled !== false;

    return matchesSearch && matchesVisibility;
  });

  // Count enabled doctors
  const enabledCount = doctors.length;
  const totalCount = allDoctors.length;

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

  // Handle basic field updates
  const handleFieldChange = (field: string, value: any) => {
    onConfigChange({ ...config, [field]: value });
  };

  // Doctor Management
  const handleAddDoctor = () => {
    const newDoctor = {
      id: `doctor-${Date.now()}`,
      name: "",
      specialty: "",
      qualifications: "",
      consultationDays: "",
      consultationTime: "",
      image: "",
      available: "",
      enabled: true,
    };

    onConfigChange({
      ...config,
      doctors: [...doctors, newDoctor],
    });
  };

  const handleUpdateDoctor = (idx: number, field: string, value: any) => {
    const doctor = allDoctors[idx];
    const isEnabled = doctor.enabled !== false;

    if (isEnabled) {
      const doctorIndex = doctors.findIndex((d: any) => d.id === doctor.id);
      const updated = [...doctors];
      updated[doctorIndex] = { ...updated[doctorIndex], [field]: value };
      onConfigChange({ ...config, doctors: updated });
    } else {
      const doctorIndex = disabledDoctors.findIndex(
        (d: any) => d.id === doctor.id
      );
      const updated = [...disabledDoctors];
      updated[doctorIndex] = { ...updated[doctorIndex], [field]: value };
      onConfigChange({ ...config, disabledDoctors: updated });
    }
  };

  const handleRemoveDoctor = (idx: number) => {
    const doctor = allDoctors[idx];
    const isEnabled = doctor.enabled !== false;

    if (isEnabled) {
      const updated = doctors.filter((d: any) => d.id !== doctor.id);
      onConfigChange({ ...config, doctors: updated });
    } else {
      const updated = disabledDoctors.filter((d: any) => d.id !== doctor.id);
      onConfigChange({ ...config, disabledDoctors: updated });
    }
  };

  // Toggle doctor enabled/disabled
  const handleToggleDoctorEnabled = (idx: number) => {
    const doctor = allDoctors[idx];
    const isCurrentlyEnabled = doctor.enabled !== false;

    if (isCurrentlyEnabled) {
      const updatedDoctor = { ...doctor, enabled: false };
      const updatedDoctors = doctors.filter((d: any) => d.id !== doctor.id);
      const updatedDisabledDoctors = [...disabledDoctors, updatedDoctor];

      onConfigChange({
        ...config,
        doctors: updatedDoctors,
        disabledDoctors: updatedDisabledDoctors,
      });
    } else {
      const updatedDoctor = { ...doctor, enabled: true };
      const updatedDisabledDoctors = disabledDoctors.filter(
        (d: any) => d.id !== doctor.id
      );
      const updatedDoctors = [...doctors, updatedDoctor];

      onConfigChange({
        ...config,
        doctors: updatedDoctors,
        disabledDoctors: updatedDisabledDoctors,
      });
    }
  };

  // Bulk Actions
  const handleEnableAll = () => {
    const allEnabled = [
      ...doctors,
      ...disabledDoctors.map((d: any) => ({ ...d, enabled: true })),
    ];
    onConfigChange({
      ...config,
      doctors: allEnabled,
      disabledDoctors: [],
    });
  };

  const handleDisableAll = () => {
    const allDisabled = [
      ...doctors.map((d: any) => ({ ...d, enabled: false })),
      ...disabledDoctors,
    ];
    onConfigChange({
      ...config,
      doctors: [],
      disabledDoctors: allDisabled,
    });
  };

  // Sort doctors
  const handleSortDoctors = (sortBy: "name" | "specialty") => {
    const sortedEnabled = [...doctors].sort((a, b) => {
      const aValue = (a[sortBy] || "").toLowerCase();
      const bValue = (b[sortBy] || "").toLowerCase();
      return aValue.localeCompare(bValue);
    });

    const sortedDisabled = [...disabledDoctors].sort((a, b) => {
      const aValue = (a[sortBy] || "").toLowerCase();
      const bValue = (b[sortBy] || "").toLowerCase();
      return aValue.localeCompare(bValue);
    });

    onConfigChange({
      ...config,
      doctors: sortedEnabled,
      disabledDoctors: sortedDisabled,
    });
  };

  // Reordering Functions
  const moveDoctor = (fromIdx: number, toIdx: number) => {
    const doctor = allDoctors[fromIdx];
    const targetDoctor = allDoctors[toIdx];
    const isEnabled = doctor.enabled !== false;
    const targetIsEnabled = targetDoctor.enabled !== false;

    // Can only reorder within the same status (enabled with enabled, disabled with disabled)
    if (isEnabled !== targetIsEnabled) {
      return; // Don't allow moving between enabled and disabled
    }

    if (isEnabled) {
      // Reorder within enabled doctors array
      const fromIndex = doctors.findIndex((d: any) => d.id === doctor.id);
      const toIndex = doctors.findIndex((d: any) => d.id === targetDoctor.id);

      const updated = [...doctors];
      const [removed] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, removed);

      onConfigChange({ ...config, doctors: updated });
    } else {
      // Reorder within disabled doctors array
      const fromIndex = disabledDoctors.findIndex(
        (d: any) => d.id === doctor.id
      );
      const toIndex = disabledDoctors.findIndex(
        (d: any) => d.id === targetDoctor.id
      );

      const updated = [...disabledDoctors];
      const [removed] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, removed);

      onConfigChange({ ...config, disabledDoctors: updated });
    }
  };

  const moveDoctorUp = (idx: number) => {
    if (idx === 0) return;

    const doctor = allDoctors[idx];
    const prevDoctor = allDoctors[idx - 1];
    const isEnabled = doctor.enabled !== false;
    const prevIsEnabled = prevDoctor.enabled !== false;

    // Only move if both doctors have the same status
    if (isEnabled === prevIsEnabled) {
      moveDoctor(idx, idx - 1);
    }
  };

  const moveDoctorDown = (idx: number) => {
    if (idx >= allDoctors.length - 1) return;

    const doctor = allDoctors[idx];
    const nextDoctor = allDoctors[idx + 1];
    const isEnabled = doctor.enabled !== false;
    const nextIsEnabled = nextDoctor.enabled !== false;

    // Only move if both doctors have the same status
    if (isEnabled === nextIsEnabled) {
      moveDoctor(idx, idx + 1);
    }
  };

  const moveDoctorToTop = (idx: number) => {
    const doctor = allDoctors[idx];
    const isEnabled = doctor.enabled !== false;

    if (isEnabled) {
      // Move to top of enabled doctors array
      const currentIndex = doctors.findIndex((d: any) => d.id === doctor.id);
      if (currentIndex === 0) return; // Already at top

      const updated = [...doctors];
      const [removed] = updated.splice(currentIndex, 1);
      updated.unshift(removed);

      onConfigChange({ ...config, doctors: updated });
    } else {
      // Move to top of disabled doctors array
      const currentIndex = disabledDoctors.findIndex(
        (d: any) => d.id === doctor.id
      );
      if (currentIndex === 0) return; // Already at top

      const updated = [...disabledDoctors];
      const [removed] = updated.splice(currentIndex, 1);
      updated.unshift(removed);

      onConfigChange({ ...config, disabledDoctors: updated });
    }
  };

  const moveDoctorToBottom = (idx: number) => {
    const doctor = allDoctors[idx];
    const isEnabled = doctor.enabled !== false;

    if (isEnabled) {
      // Move to bottom of enabled doctors array
      const currentIndex = doctors.findIndex((d: any) => d.id === doctor.id);
      if (currentIndex === doctors.length - 1) return; // Already at bottom

      const updated = [...doctors];
      const [removed] = updated.splice(currentIndex, 1);
      updated.push(removed);

      onConfigChange({ ...config, doctors: updated });
    } else {
      // Move to bottom of disabled doctors array
      const currentIndex = disabledDoctors.findIndex(
        (d: any) => d.id === doctor.id
      );
      if (currentIndex === disabledDoctors.length - 1) return; // Already at bottom

      const updated = [...disabledDoctors];
      const [removed] = updated.splice(currentIndex, 1);
      updated.push(removed);

      onConfigChange({ ...config, disabledDoctors: updated });
    }
  };

  // Handle doctor image upload
  const handleDoctorImageUpload = (idx: number, imageUrl: string) => {
    handleUpdateDoctor(idx, "image", imageUrl);
    setUploadingDoctorIndex(null);
  };

  return (
    <CollapsibleSection title="👨‍⚕️ Featured Doctors (Carousel)">
      <div className="space-y-3">
        {/* Header with Controls */}
        <div className="space-y-3">
          {/* Stats and Main Actions */}
          <div className="flex justify-between items-center">
            <div className="text-xs text-slate-400">
              <span className="font-medium text-slate-300">{enabledCount}</span>{" "}
              of{" "}
              <span className="font-medium text-slate-300">{totalCount}</span>{" "}
              doctors enabled
            </div>
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

          {/* Search and Filter Bar */}
          {totalCount > 0 && (
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-slate-500" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search doctors by name, specialty..."
                  className="pl-7 bg-slate-700 border-slate-600 text-slate-50 h-8 text-xs"
                />
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowDisabled(!showDisabled)}
                className={`border-slate-600 h-8 text-xs ${
                  showDisabled ? "bg-slate-700" : "bg-transparent"
                }`}
              >
                {showDisabled ? (
                  <Eye className="w-3 h-3 mr-1" />
                ) : (
                  <EyeOff className="w-3 h-3 mr-1" />
                )}
                {showDisabled ? "Hide" : "Show"} Disabled
              </Button>
            </div>
          )}

          {/* Bulk Actions */}
          {totalCount > 0 && (
            <div className="flex flex-wrap gap-2 p-2 bg-slate-700/30 rounded border border-slate-600">
              <span className="text-xs text-slate-400 self-center">
                Bulk Actions:
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleEnableAll}
                className="h-6 text-xs text-green-400 hover:bg-green-500/10"
              >
                <Check className="w-3 h-3 mr-1" />
                Enable All
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDisableAll}
                className="h-6 text-xs text-slate-400 hover:bg-slate-700"
              >
                <X className="w-3 h-3 mr-1" />
                Disable All
              </Button>
              <div className="h-4 w-px bg-slate-600 self-center mx-1" />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleSortDoctors("name")}
                className="h-6 text-xs text-blue-400 hover:bg-blue-500/10"
              >
                <SortAsc className="w-3 h-3 mr-1" />
                Sort by Name
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleSortDoctors("specialty")}
                className="h-6 text-xs text-blue-400 hover:bg-blue-500/10"
              >
                <SortAsc className="w-3 h-3 mr-1" />
                Sort by Specialty
              </Button>
            </div>
          )}
        </div>

        {/* Carousel Speed Controls */}
        <div className="space-y-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600">
          <h4 className="text-xs font-semibold text-slate-300 mb-2">
            Carousel Speed Settings
          </h4>

          {/* Carousel Scroll Speed (for Authentic layout) */}
          {layoutConfig === "Authentic" && (
            <div>
              <label className="text-xs text-slate-400 mb-1 block flex items-center justify-between">
                <span>Carousel Scroll Speed</span>
                <span className="text-slate-500">{slideSpeed}</span>
              </label>
              <input
                type="range"
                min="5"
                max="50"
                value={slideSpeed}
                onChange={(e) =>
                  handleFieldChange("slideSpeed", parseInt(e.target.value))
                }
                className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Slow (5)</span>
                <span>Fast (50)</span>
              </div>
            </div>
          )}

          {/* Doctor Rotation Speed (for Advanced layout) */}
          {layoutConfig === "Advanced" && (
            <div>
              <label className="text-xs text-slate-400 mb-1 block flex items-center justify-between">
                <span>Doctor Rotation Speed</span>
                <span className="text-slate-500">
                  {doctorRotationSpeed / 1000}s
                </span>
              </label>
              <input
                type="range"
                min="2000"
                max="15000"
                step="500"
                value={doctorRotationSpeed}
                onChange={(e) =>
                  handleFieldChange(
                    "doctorRotationSpeed",
                    parseInt(e.target.value)
                  )
                }
                className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>1</span>
                <span>10</span>
              </div>
              {/* {enabledCount > 0 && (
                <p className="text-xs text-slate-500 mt-1">
                  Full cycle: {(doctorRotationSpeed * enabledCount) / 1000}s for{" "}
                  {enabledCount} enabled doctor
                  {enabledCount !== 1 ? "s" : ""}
                </p>
              )} */}
            </div>
          )}

          {enabledCount === 0 && totalCount > 0 && (
            <p className="text-xs text-amber-400 bg-amber-500/10 p-2 rounded">
              ⚠️ No doctors are currently enabled. Enable at least one doctor to
              see them in the carousel.
            </p>
          )}
        </div>

        {/* Doctor Cards */}
        <div className="space-y-2">
          {filteredDoctors.map((doctor: any, displayIdx: number) => {
            const actualIdx = allDoctors.findIndex(
              (d: any) => d.id === doctor.id
            );

            // Check if we need to show a separator (transition from enabled to disabled)
            const prevDoctor =
              displayIdx > 0 ? filteredDoctors[displayIdx - 1] : null;
            const showSeparator =
              prevDoctor &&
              (prevDoctor.enabled !== false) !== (doctor.enabled !== false);

            return (
              <React.Fragment key={doctor.id}>
                {/* Group Separator */}
                {showSeparator && (
                  <div className="flex items-center gap-3 py-2">
                    <div className="flex-1 h-px bg-slate-600"></div>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Disabled Doctors
                    </span>
                    <div className="flex-1 h-px bg-slate-600"></div>
                  </div>
                )}

                <div
                  className={`p-4 rounded-lg space-y-4 border transition-all ${
                    doctor.enabled === false
                      ? "bg-slate-800/30 border-slate-700 opacity-60"
                      : "bg-slate-700/50 border-slate-600"
                  }`}
                >
                  {/* Header with Controls */}
                  <div className="flex items-start justify-between gap-2">
                    {/* Left: Status */}
                    <div className="flex items-center gap-3 flex-1">
                      {/* Enable/Disable Toggle */}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={doctor.enabled !== false}
                          onChange={() => handleToggleDoctorEnabled(actualIdx)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>

                      {/* Doctor Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-slate-300">
                            {doctor.enabled !== false
                              ? `Active #${
                                  doctors.findIndex(
                                    (d: any) => d.id === doctor.id
                                  ) + 1
                                } of ${enabledCount}`
                              : `Disabled #${
                                  disabledDoctors.findIndex(
                                    (d: any) => d.id === doctor.id
                                  ) + 1
                                } of ${disabledDoctors.length}`}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              doctor.enabled === false
                                ? "bg-slate-600 text-slate-400"
                                : "bg-green-600 text-white"
                            }`}
                          >
                            {doctor.enabled === false ? "Disabled" : "Active"}
                          </span>
                        </div>
                        {doctor.name && (
                          <p className="text-xs text-slate-400 mt-0.5">
                            {doctor.name}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Reorder Controls and Delete */}
                    <div className="flex items-center gap-1">
                      {/* Move to Top/Bottom */}
                      <div className="flex flex-col gap-0.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => moveDoctorToTop(actualIdx)}
                          disabled={
                            (doctor.enabled !== false &&
                              doctors.findIndex(
                                (d: any) => d.id === doctor.id
                              ) === 0) ||
                            (doctor.enabled === false &&
                              disabledDoctors.findIndex(
                                (d: any) => d.id === doctor.id
                              ) === 0)
                          }
                          className="h-5 w-5 p-0 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 disabled:opacity-30"
                          title="Move to top of group"
                        >
                          <ChevronsUp className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => moveDoctorToBottom(actualIdx)}
                          disabled={
                            (doctor.enabled !== false &&
                              doctors.findIndex(
                                (d: any) => d.id === doctor.id
                              ) ===
                                doctors.length - 1) ||
                            (doctor.enabled === false &&
                              disabledDoctors.findIndex(
                                (d: any) => d.id === doctor.id
                              ) ===
                                disabledDoctors.length - 1)
                          }
                          className="h-5 w-5 p-0 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 disabled:opacity-30"
                          title="Move to bottom of group"
                        >
                          <ChevronsDown className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Move Up/Down */}
                      <div className="flex flex-col gap-0.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => moveDoctorUp(actualIdx)}
                          disabled={
                            actualIdx === 0 ||
                            (actualIdx > 0 &&
                              (allDoctors[actualIdx].enabled !== false) !==
                                (allDoctors[actualIdx - 1].enabled !== false))
                          }
                          className="h-5 w-5 p-0 text-slate-400 hover:text-green-400 hover:bg-green-500/10 disabled:opacity-30"
                          title="Move up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => moveDoctorDown(actualIdx)}
                          disabled={
                            actualIdx === allDoctors.length - 1 ||
                            (actualIdx < allDoctors.length - 1 &&
                              (allDoctors[actualIdx].enabled !== false) !==
                                (allDoctors[actualIdx + 1].enabled !== false))
                          }
                          className="h-5 w-5 p-0 text-slate-400 hover:text-green-400 hover:bg-green-500/10 disabled:opacity-30"
                          title="Move down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Delete Button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveDoctor(actualIdx)}
                        className="h-10 w-8 p-0 text-red-400 hover:bg-red-500/10"
                        title="Delete doctor"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="flex gap-4">
                    {/* Doctor Profile Picture */}
                    <div className="flex-shrink-0">
                      <div className="relative group">
                        <div
                          className="w-24 h-24 rounded-full border-2 border-slate-600 flex items-center justify-center cursor-pointer bg-slate-700/50 overflow-hidden"
                          onClick={() =>
                            setUploadingDoctorIndex(
                              uploadingDoctorIndex === actualIdx
                                ? null
                                : actualIdx
                            )
                          }
                        >
                          {doctor.image ? (
                            <img
                              src={doctor.image}
                              alt={doctor.name || `Doctor ${actualIdx + 1}`}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-slate-400">
                              <Upload className="w-8 h-8 mb-1" />
                              <span className="text-xs">Upload</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                              {doctor.image ? "Change" : "Upload"}
                            </span>
                          </div>
                        </div>

                        {/* Image Uploader */}
                        {uploadingDoctorIndex === actualIdx && (
                          <div className="absolute left-0 mt-2 z-10 bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-3 w-64">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-slate-300 font-medium">
                                Doctor Profile Picture
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setUploadingDoctorIndex(null)}
                                className="h-5 px-2 text-xs text-slate-400 hover:text-slate-300"
                              >
                                ✕
                              </Button>
                            </div>
                            <ImageUploader
                              images={doctor.image ? [doctor.image] : []}
                              onChange={(imgs) =>
                                handleDoctorImageUpload(
                                  actualIdx,
                                  imgs[0] || ""
                                )
                              }
                              maxImages={1}
                              userId={currentUserId}
                              displayId={displayId}
                              imageType="doctors"
                              environment={environment}
                              customFolder={`doctors/${
                                doctor.id || `doctor-${actualIdx}`
                              }`}
                            />
                            <p className="text-xs text-slate-500 mt-2">
                              Recommended: Square image (1:1 ratio)
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Doctor Details Form */}
                    <div className="flex-1 space-y-3">
                      {/* Doctor Name */}
                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">
                          Doctor's Name
                        </label>
                        <Input
                          value={doctor.name}
                          onChange={(e) =>
                            handleUpdateDoctor(
                              actualIdx,
                              "name",
                              e.target.value
                            )
                          }
                          placeholder="Dr. John Smith"
                          className="bg-slate-700 border-slate-600 text-slate-50"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-slate-400 mb-1 block">
                            Speciality
                          </label>
                          <Input
                            value={doctor.specialty}
                            onChange={(e) =>
                              handleUpdateDoctor(
                                actualIdx,
                                "specialty",
                                e.target.value
                              )
                            }
                            placeholder="Cardiology"
                            className="bg-slate-700 border-slate-600 text-slate-50 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 mb-1 block">
                            Qualifications
                          </label>
                          <Input
                            value={doctor.qualifications || ""}
                            onChange={(e) =>
                              handleUpdateDoctor(
                                actualIdx,
                                "qualifications",
                                e.target.value
                              )
                            }
                            placeholder="MD, PhD, FRCP"
                            className="bg-slate-700 border-slate-600 text-slate-50 text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-slate-400 mb-1 block flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Consultation Days
                          </label>
                          <Input
                            value={doctor.consultationDays || ""}
                            onChange={(e) =>
                              handleUpdateDoctor(
                                actualIdx,
                                "consultationDays",
                                e.target.value
                              )
                            }
                            placeholder="Mon, Wed, Fri"
                            className="bg-slate-700 border-slate-600 text-slate-50 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-slate-400 mb-1 block flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Consultation Time
                          </label>
                          <Input
                            value={doctor.consultationTime || ""}
                            onChange={(e) =>
                              handleUpdateDoctor(
                                actualIdx,
                                "consultationTime",
                                e.target.value
                              )
                            }
                            placeholder="9:00 AM - 5:00 PM"
                            className="bg-slate-700 border-slate-600 text-slate-50 text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">
                          Additional Information
                        </label>
                        <Input
                          value={doctor.available || ""}
                          onChange={(e) =>
                            handleUpdateDoctor(
                              actualIdx,
                              "available",
                              e.target.value
                            )
                          }
                          placeholder="Languages spoken, special certifications, etc."
                          className="bg-slate-700 border-slate-600 text-slate-50 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Configuration Summary */}
                  <div className="p-2 bg-slate-800/50 rounded text-xs text-slate-400">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <div>
                        <span className="text-slate-500">ID:</span>
                        <span className="ml-1 font-mono text-[10px]">
                          {doctor.id}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Image:</span>
                        <span className="ml-1">
                          {doctor.image ? "✓ Set" : "✗ None"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Fields:</span>
                        <span className="ml-1">
                          {
                            [
                              doctor.name,
                              doctor.specialty,
                              doctor.qualifications,
                              doctor.consultationDays,
                              doctor.consultationTime,
                            ].filter(Boolean).length
                          }
                          /5
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Status:</span>
                        <span
                          className={`ml-1 font-medium ${
                            doctor.enabled === false
                              ? "text-slate-500"
                              : "text-green-400"
                          }`}
                        >
                          {doctor.enabled === false ? "disabled" : "active"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Empty State */}
        {totalCount === 0 && (
          <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-700 rounded-lg">
            <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-3">
              <Plus className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-sm mb-2">No doctors added yet</p>
            <p className="text-xs text-slate-500">
              Click "Add Doctor" to create a new doctor profile
            </p>
          </div>
        )}

        {/* No Search Results */}
        {totalCount > 0 && filteredDoctors.length === 0 && (
          <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-700 rounded-lg">
            <Search className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm mb-2">No doctors match your search</p>
            <p className="text-xs text-slate-500">
              Try different keywords or clear the search
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSearchTerm("")}
              className="mt-3 border-slate-600 text-slate-300 h-7 bg-transparent hover:bg-slate-700"
            >
              Clear Search
            </Button>
          </div>
        )}

        {/* Tips Section */}
        {totalCount > 0 && (
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <h4 className="text-xs font-semibold text-blue-400 mb-2">
              💡 Quick Tips
            </h4>
            <ul className="text-xs text-blue-300/80 space-y-1">
              <li>
                • <strong>Arrow Buttons:</strong> Use up/down arrows to move
                within enabled or disabled groups
              </li>
              <li>
                • <strong>Quick Move:</strong> Double chevrons move doctors to
                top/bottom of their group
              </li>
              <li>
                • <strong>Groups:</strong> Active and disabled doctors are
                reordered separately to maintain config structure
              </li>
              <li>
                • <strong>Toggle Status:</strong> Click the switch to
                enable/disable doctors
              </li>
              <li>
                • <strong>Bulk Actions:</strong> Use the toolbar to
                enable/disable or sort multiple doctors
              </li>
              <li>
                • <strong>Search:</strong> Filter doctors by name, specialty, or
                qualifications
              </li>
            </ul>
          </div>
        )}
      </div>
    </CollapsibleSection>
  );
}

export default DoctorCarouselEditor;
