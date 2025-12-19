"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Upload, Calendar, Clock } from "lucide-react";
import { ImageUploader } from "./ImageUploader";
import CollapsibleSection from "./CollapsibleSection";
import Image from "next/image";

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

  // Separate enabled and disabled doctors
  const doctors = config.doctors || [];
  const disabledDoctors = config.disabledDoctors || [];
  const allDoctors = [...doctors, ...disabledDoctors];
  const slideSpeed = config.slideSpeed || 20;
  const doctorRotationSpeed = config.doctorRotationSpeed || 6000;

  // Count enabled doctors (doctors array only has enabled ones)
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
      // Move from doctors to disabledDoctors
      const updatedDoctor = { ...doctor, enabled: false };
      const updatedDoctors = doctors.filter((d: any) => d.id !== doctor.id);
      const updatedDisabledDoctors = [...disabledDoctors, updatedDoctor];

      onConfigChange({
        ...config,
        doctors: updatedDoctors,
        disabledDoctors: updatedDisabledDoctors,
      });
    } else {
      // Move from disabledDoctors to doctors
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

  // Handle doctor image upload
  const handleDoctorImageUpload = (idx: number, imageUrl: string) => {
    handleUpdateDoctor(idx, "image", imageUrl);
    setUploadingDoctorIndex(null); // Close the uploader
  };

  return (
    <CollapsibleSection title="👨‍⚕️ Featured Doctors (Carousel)">
      <div className="space-y-3">
        {/* Header with Add Doctor and Stats */}
        <div className="flex justify-between items-center mb-2">
          <div className="text-xs text-slate-400">
            <span className="font-medium text-slate-300">{enabledCount}</span>{" "}
            of <span className="font-medium text-slate-300">{totalCount}</span>{" "}
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

        {/* Carousel Speed Controls - Always Visible */}
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
                max="10000"
                step="1000"
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
                <span>2s</span>
                <span>10s</span>
              </div>
              {enabledCount > 0 && (
                <p className="text-xs text-slate-500 mt-1">
                  Full cycle: {(doctorRotationSpeed * enabledCount) / 1000}s for{" "}
                  {enabledCount} enabled doctor
                  {enabledCount !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          )}

          {enabledCount === 0 && totalCount > 0 && (
            <p className="text-xs text-amber-400 bg-amber-500/10 p-2 rounded">
              ⚠️ No doctors are currently enabled. Enable at least one doctor to
              see them in the carousel.
            </p>
          )}

          {/* Config Structure Info */}
          <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded">
            <p className="text-xs text-blue-400">
              <strong>Config Structure:</strong> Active doctors → config.doctors
              | Disabled doctors → config.disabledDoctors
            </p>
          </div>
        </div>

        {/* Doctor Cards */}
        {allDoctors.map((doctor: any, idx: number) => (
          <div
            key={doctor.id}
            className={`p-4 rounded-lg space-y-4 border transition-all ${
              doctor.enabled === false
                ? "bg-slate-800/30 border-slate-700 opacity-60"
                : "bg-slate-700/50 border-slate-600"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Enable/Disable Toggle */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={doctor.enabled !== false}
                    onChange={() => handleToggleDoctorEnabled(idx)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-300">
                      Doctor #{idx + 1}
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
                  {doctor.enabled === false && (
                    <span className="text-xs text-slate-500">
                      (Stored in config.disabledDoctors)
                    </span>
                  )}
                  {doctor.enabled !== false && (
                    <span className="text-xs text-green-500/70">
                      (Stored in config.doctors)
                    </span>
                  )}
                </div>
              </div>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleRemoveDoctor(idx)}
                className="text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>

            <div className="flex gap-4">
              {/* Doctor Profile Picture Upload Area */}
              <div className="flex-shrink-0">
                <div className="relative group">
                  <div
                    className="w-24 h-24 rounded-full border-2 border-slate-600 flex items-center justify-center cursor-pointer bg-slate-700/50 overflow-hidden"
                    onClick={() =>
                      setUploadingDoctorIndex(
                        uploadingDoctorIndex === idx ? null : idx
                      )
                    }
                  >
                    {doctor.image ? (
                      <Image
                        src={doctor.image}
                        alt={doctor.name || `Doctor ${idx + 1}`}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <Upload className="w-8 h-8 mb-1" />
                        <span className="text-xs">Upload Profile</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {doctor.image ? "Change" : "Upload"}
                      </span>
                    </div>
                  </div>

                  {/* Image Uploader for this specific doctor */}
                  {uploadingDoctorIndex === idx && (
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
                          handleDoctorImageUpload(idx, imgs[0] || "")
                        }
                        maxImages={1}
                        userId={currentUserId}
                        displayId={displayId}
                        imageType="doctors"
                        environment={environment}
                        customFolder={`doctors/${doctor.id || `doctor-${idx}`}`}
                      />
                      <p className="text-xs text-slate-500 mt-2">
                        Recommended: Square image (1:1 ratio)
                      </p>
                    </div>
                  )}
                </div>

                {/* Image URL Display (hidden but in config) */}
                {doctor.image && (
                  <div className="mt-2">
                    <p className="text-xs text-slate-500 truncate">
                      Image URL saved
                    </p>
                  </div>
                )}
              </div>

              {/* Doctor Details Form */}
              <div className="flex-1 space-y-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">
                    Doctor's Name
                  </label>
                  <Input
                    value={doctor.name}
                    onChange={(e) =>
                      handleUpdateDoctor(idx, "name", e.target.value)
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
                        handleUpdateDoctor(idx, "specialty", e.target.value)
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
                          idx,
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
                          idx,
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
                          idx,
                          "consultationTime",
                          e.target.value
                        )
                      }
                      placeholder="9:00 AM - 5:00 PM"
                      className="bg-slate-700 border-slate-600 text-slate-50 text-sm"
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">
                    Additional Information
                  </label>
                  <Input
                    value={doctor.available || ""}
                    onChange={(e) =>
                      handleUpdateDoctor(idx, "available", e.target.value)
                    }
                    placeholder="Languages spoken, special certifications, etc."
                    className="bg-slate-700 border-slate-600 text-slate-50 text-sm"
                  />
                </div>

                {/* Hidden fields that store image data in config */}
                <div className="hidden">
                  <input
                    type="hidden"
                    name={`doctor-${idx}-image-url`}
                    value={doctor.image || ""}
                  />
                  <input
                    type="hidden"
                    name={`doctor-${idx}-id`}
                    value={doctor.id || `doctor-${idx}`}
                  />
                  <input
                    type="hidden"
                    name={`doctor-${idx}-enabled`}
                    value={doctor.enabled !== false ? "true" : "false"}
                  />
                </div>
              </div>
            </div>

            {/* Configuration Summary */}
            <div className="p-2 bg-slate-800/50 rounded text-xs text-slate-400">
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <span className="text-slate-500">ID:</span>
                  <span className="ml-1 font-mono text-[10px]">
                    {doctor.id}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Image:</span>
                  <span className="ml-1">
                    {doctor.image ? "✓ Uploaded" : "✗ Not set"}
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
                    /5 filled
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Config:</span>
                  <span
                    className={`ml-1 font-medium ${
                      doctor.enabled === false
                        ? "text-slate-500"
                        : "text-green-400"
                    }`}
                  >
                    {doctor.enabled === false ? "disabled" : "doctors"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

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
      </div>
    </CollapsibleSection>
  );
}

export default DoctorCarouselEditor;
