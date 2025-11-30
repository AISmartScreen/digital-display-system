"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2, Upload, X } from "lucide-react";

interface MasjidEditorPanelProps {
  config: any;
  onConfigChange: (config: any) => void;
  displayId?: string;
  environment?: "preview" | "production";
}

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

interface UploadedBlob {
  url: string;
  pathname: string;
  downloadUrl: string;
  id: string;
  environment: string;
  imageId: string;
}

function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-800 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
      >
        <span className="font-semibold text-gray-100">{title}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 py-4 space-y-4 bg-gray-800/30">{children}</div>
      )}
    </div>
  );
}

function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 h-10 rounded cursor-pointer border border-gray-700 bg-gray-800"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
        placeholder="#000000"
      />
    </div>
  );
}

function ImageUploader({
  images,
  onChange,
  maxImages = 10,
  displayId = "1",
  imageType = "background",
  environment = "preview",
}: {
  images: string[];
  onChange: (imgs: string[]) => void;
  maxImages?: number;
  displayId?: string;
  imageType: "logo" | "background" | "slideshow";
  environment?: "preview" | "production";
}) {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [MediaUploadedImages, setMediaUploadedImages] = useState<string[]>([]);
  const [isLoadingProduction, setIsLoadingProduction] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchAllImages = async () => {
      if (!displayId || !imageType) return;

      setIsLoadingProduction(true);
      setIsLoadingPreview(true);

      try {
        const response = await fetch(`/api/media`);
        if (!response.ok) {
          console.error("Failed to fetch images:", await response.text());
          return;
        }

        const allMedia = await response.json();

        // Filter production + preview together
        const combinedImages = allMedia
          .filter(
            (item: any) =>
              (item.environment === "production" ||
                item.environment === "preview") &&
              item.imageId === imageType &&
              item.userId === displayId
          )
          .map((item: any) => item.fileUrl);

        console.log(
          `Loaded ${combinedImages.length} total images (production + preview) for ${imageType}`
        );

        // Set only this state as requested
        setMediaUploadedImages(combinedImages);
      } catch (err) {
        console.error("Error fetching images:", err);
      } finally {
        setIsLoadingProduction(false);
        setIsLoadingPreview(false);
      }
    };

    fetchAllImages();
  }, [displayId, imageType]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // Validate file types
      const validFiles = Array.from(files).filter((file) => {
        if (!file.type.startsWith("image/")) {
          setUploadError(`${file.name} is not an image file`);
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) {
        setIsUploading(false);
        return;
      }

      // Upload to server with all required parameters
      const formData = new FormData();
      validFiles.forEach((file) => formData.append("images", file));
      formData.append("id", displayId || "1");
      formData.append("environment", environment);
      formData.append("imageId", imageType);

      console.log("Uploading to:", environment, "imageType:", imageType);

      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();
      console.log("Upload successful:", data);

      // Update the images
      if (maxImages === 1) {
        onChange(data.urls.slice(0, 1));
      } else {
        const combined = [...images, ...data.urls].slice(0, maxImages);
        onChange(combined);
      }

      // Refresh the uploaded images list for the current environment
      if (displayId && imageType) {
        const imagesResponse = await fetch(`/api/media`);
        if (imagesResponse.ok) {
          const allMedia = await imagesResponse.json();

          // Filter for production images
          const productionFiltered = allMedia
            .filter(
              (item: any) =>
                item.environment === "production" &&
                item.imageId === imageType &&
                item.userId === displayId
            )
            .map((item: any) => item.fileUrl);

          // Filter for preview images
          const previewFiltered = allMedia
            .filter(
              (item: any) =>
                item.environment === "preview" &&
                item.imageId === imageType &&
                item.userId === displayId
            )
            .map((item: any) => item.fileUrl);

          setMediaUploadedImages([...productionFiltered, ...previewFiltered]);

          console.log("Refreshed image lists:", {
            production: productionFiltered.length,
            preview: previewFiltered.length,
          });
        }
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
      } else {
        if (images.length < maxImages) {
          onChange([...images, img]);
        }
      }
    }
  };

  const canUploadMore = images.length < maxImages;

  return (
    <div className="space-y-3">
      {/* Upload Button */}
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
            disabled={isUploading}
            className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-700 rounded-lg hover:border-gray-600 hover:bg-gray-800/30 text-gray-400 hover:text-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
            <p className="text-xs text-gray-500 mt-2 text-center">
              {images.length} / {maxImages} images selected
            </p>
          )}
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-400">{uploadError}</p>
        </div>
      )}

      {/* Currently Selected Images Grid */}
      {images.length > 0 && (
        <div>
          <label className="text-xs text-gray-400 font-medium block mb-2">
            Currently Selected ({images.length})
          </label>
          <div className="grid grid-cols-2 gap-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={img}
                  alt={`Selected ${idx + 1}`}
                  className="w-full h-24 object-cover rounded border border-gray-700"
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

      {/* Images Carousel */}

      <div>
        {/* Images Carousel - Only show if there are images or loading */}
        {(isLoadingProduction || MediaUploadedImages.length > 0) && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-green-400">
                  Media uploaded Images ({MediaUploadedImages.length})
                </span>
              </label>
            </div>

            {isLoadingProduction ? (
              <div className="text-center py-6">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-green-400 border-t-transparent"></div>
                <p className="text-xs text-gray-400 mt-2">
                  Loading media uploaded images...
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                {MediaUploadedImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group cursor-pointer"
                    onClick={() => handleImageClick(img)}
                  >
                    <img
                      src={img}
                      alt={`Production ${idx + 1}`}
                      className={`w-full h-20 object-cover rounded border-2 transition-colors ${
                        images.includes(img)
                          ? "border-green-500"
                          : "border-gray-700 hover:border-green-400"
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
      </div>
    </div>
  );
}

export default function MasjidEditorPanel({
  config,
  onConfigChange,
  displayId,
  environment = "preview",
}: MasjidEditorPanelProps) {
  // Default configuration matching preview page expectations
  const defaultConfig = {
    template: "masjid-classic",
    prayerTimes: {
      fajr: "05:30",
      dhuhr: "12:30",
      asr: "15:45",
      maghrib: "18:00",
      isha: "19:30",
    },
    iqamahOffsets: {
      fajr: 15,
      dhuhr: 10,
      asr: 10,
      maghrib: 5,
      isha: 10,
    },
    colors: {
      primary: "#10b981",
      secondary: "#059669",
      text: "#ffffff",
      accent: "#fbbf24",
    },
    backgroundType: "gradient",
    backgroundColor: "#1e293b",
    backgroundGradient: {
      from: "#1e293b",
      to: "#0f172a",
    },
    backgroundImage: [],
    slideshowDuration: 10,
    announcements: [],
    showHijriDate: true,
    showNextPrayer: true,
    showCurrentTime: true,
    font: "Amiri",
    fontSize: 16,
    logo: "",
    masjidName: "Masjid Al-Noor",
    showWeather: true,
    animationSpeed: "normal",
    layout: "vertical",
  };

  const [customization, setCustomization] = useState(() => {
    if (!config) return defaultConfig;

    const colorTheme = config?.colorTheme ?? null;
    const colors = colorTheme || config?.colors || defaultConfig.colors;

    return {
      ...defaultConfig,
      ...(config || {}),
      colors: {
        ...defaultConfig.colors,
        ...(colors || {}),
      },
      prayerTimes: {
        ...defaultConfig.prayerTimes,
        ...(config?.prayerTimes || {}),
      },
      iqamahOffsets: {
        ...defaultConfig.iqamahOffsets,
        ...(config?.iqamahOffsets || {}),
      },
      backgroundGradient: {
        ...defaultConfig.backgroundGradient,
        ...(config?.backgroundGradient || {}),
      },
    };
  });

  useEffect(() => {
    if (!config) return;

    const colors = config.colorTheme || config.colors || defaultConfig.colors;
    setCustomization((prev) => ({
      ...defaultConfig,
      ...config,
      colors: { ...defaultConfig.colors, ...colors },
      prayerTimes: {
        ...defaultConfig.prayerTimes,
        ...(config.prayerTimes || {}),
      },
      iqamahOffsets: {
        ...defaultConfig.iqamahOffsets,
        ...(config.iqamahOffsets || {}),
      },
      backgroundGradient: {
        ...defaultConfig.backgroundGradient,
        ...(config.backgroundGradient || {}),
      },
    }));
  }, [config]);

  const updateConfig = (updates: any) => {
    const newConfig = { ...customization, ...updates };

    if (updates.colors) {
      newConfig.colorTheme = updates.colors;
    }

    setCustomization(newConfig);
    onConfigChange(newConfig);
  };

  return (
    <div className="space-y-0">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>

      {/* Branding Section */}
      <CollapsibleSection title="Branding" defaultOpen={true}>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 block mb-2">
              Masjid Name
            </label>
            <input
              type="text"
              value={customization.masjidName}
              onChange={(e) => updateConfig({ masjidName: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter masjid name"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300 block mb-2">Logo</label>
            <ImageUploader
              images={customization.logo ? [customization.logo] : []}
              onChange={(imgs) => updateConfig({ logo: imgs[0] || "" })}
              maxImages={1}
              displayId={displayId}
              imageType="logo"
              environment={environment}
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* Layout Section */}
      <CollapsibleSection title="Layout">
        <div className="space-y-2">
          <label className="text-sm text-gray-300">Display Layout</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "vertical", icon: "📏", label: "Vertical" },
              { value: "horizontal", icon: "📐", label: "Horizontal" },
              { value: "centered", icon: "◼️", label: "Centered" },
            ].map((layout) => (
              <button
                key={layout.value}
                onClick={() => updateConfig({ layout: layout.value })}
                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  customization.layout === layout.value
                    ? "border-pink-500 bg-pink-500/20 text-pink-400"
                    : "border-gray-700 text-gray-400 hover:border-gray-600"
                }`}
              >
                <div className="text-xl mb-1">{layout.icon}</div>
                <div className="text-xs">{layout.label}</div>
              </button>
            ))}
          </div>
        </div>
      </CollapsibleSection>

      {/* Prayer Times */}
      <CollapsibleSection title="Prayer Times">
        <div className="space-y-4">
          {Object.entries(customization.prayerTimes).map(([prayer, time]) => (
            <div key={prayer} className="space-y-2">
              <label className="text-sm text-gray-300 capitalize font-medium">
                {prayer}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    type="time"
                    value={time as string}
                    onChange={(e) =>
                      updateConfig({
                        prayerTimes: {
                          ...customization.prayerTimes,
                          [prayer]: e.target.value,
                        },
                      })
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">Adhan</p>
                </div>
                <div>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={
                      customization.iqamahOffsets[
                        prayer as keyof typeof customization.iqamahOffsets
                      ]
                    }
                    onChange={(e) =>
                      updateConfig({
                        iqamahOffsets: {
                          ...customization.iqamahOffsets,
                          [prayer]: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-100 text-center focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    +
                    {
                      customization.iqamahOffsets[
                        prayer as keyof typeof customization.iqamahOffsets
                      ]
                    }{" "}
                    min Iqamah
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Announcements */}
      <CollapsibleSection title="Announcements">
        <div className="space-y-3">
          {customization.announcements.map((announcement: any, idx: number) => (
            <div
              key={idx}
              className="space-y-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700"
            >
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-400">
                  Announcement {idx + 1}
                </label>
                <button
                  onClick={() =>
                    updateConfig({
                      announcements: customization.announcements.filter(
                        (_: any, i: number) => i !== idx
                      ),
                    })
                  }
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <textarea
                value={announcement.text || announcement}
                onChange={(e) => {
                  const updated = [...customization.announcements];
                  updated[idx] =
                    typeof announcement === "string"
                      ? e.target.value
                      : { ...updated[idx], text: e.target.value };
                  updateConfig({ announcements: updated });
                }}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-100 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
                rows={2}
                placeholder="Enter announcement..."
              />
              {typeof announcement === "object" && (
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-400">
                    Duration (seconds):
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="60"
                    value={announcement.duration || 5}
                    onChange={(e) => {
                      const updated = [...customization.announcements];
                      updated[idx] = {
                        ...updated[idx],
                        duration: parseInt(e.target.value) || 5,
                      };
                      updateConfig({ announcements: updated });
                    }}
                    className="w-20 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              )}
            </div>
          ))}
          <button
            onClick={() =>
              updateConfig({
                announcements: [
                  ...customization.announcements,
                  { text: "", duration: 5 },
                ],
              })
            }
            className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-700 rounded-lg hover:border-gray-600 text-gray-400 hover:text-gray-300 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add Announcement</span>
          </button>
        </div>
      </CollapsibleSection>

      {/* Colors & Styling */}
      <CollapsibleSection title="Colors & Styling">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 block mb-2">
              Primary Color
            </label>
            <ColorPicker
              value={customization.colors.primary}
              onChange={(color) =>
                updateConfig({
                  colors: { ...customization.colors, primary: color },
                })
              }
            />
          </div>
          <div>
            <label className="text-sm text-gray-300 block mb-2">
              Secondary Color
            </label>
            <ColorPicker
              value={customization.colors.secondary}
              onChange={(color) =>
                updateConfig({
                  colors: { ...customization.colors, secondary: color },
                })
              }
            />
          </div>
          <div>
            <label className="text-sm text-gray-300 block mb-2">
              Text Color
            </label>
            <ColorPicker
              value={customization.colors.text}
              onChange={(color) =>
                updateConfig({
                  colors: { ...customization.colors, text: color },
                })
              }
            />
          </div>
          <div>
            <label className="text-sm text-gray-300 block mb-2">
              Accent Color
            </label>
            <ColorPicker
              value={customization.colors.accent}
              onChange={(color) =>
                updateConfig({
                  colors: { ...customization.colors, accent: color },
                })
              }
            />
          </div>
          <div className="pt-4 border-t border-gray-800">
            <label className="text-sm text-gray-300 block mb-2">
              Font Family
            </label>
            <select
              value={customization.font}
              onChange={(e) => updateConfig({ font: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="Arial">Arial</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Amiri">Amiri (Arabic)</option>
              <option value="Lato">Lato</option>
              <option value="Inter">Inter</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-300 block mb-2">
              Font Size: {customization.fontSize}px
            </label>
            <input
              type="range"
              min="12"
              max="24"
              value={customization.fontSize}
              onChange={(e) =>
                updateConfig({ fontSize: parseInt(e.target.value) })
              }
              className="w-full accent-pink-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>12px</span>
              <span>24px</span>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-300 block mb-2">
              Animation Speed
            </label>
            <select
              value={customization.animationSpeed}
              onChange={(e) => updateConfig({ animationSpeed: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="slow">Slow</option>
              <option value="normal">Normal</option>
              <option value="fast">Fast</option>
            </select>
          </div>
        </div>
      </CollapsibleSection>

      {/* Background */}
      <CollapsibleSection title="Background">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 block mb-2">
              Background Type
            </label>
            <select
              value={customization.backgroundType}
              onChange={(e) => updateConfig({ backgroundType: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="solid">Solid Color</option>
              <option value="gradient">Gradient</option>
              <option value="image">Single Image</option>
              <option value="slideshow">Image Slideshow</option>
            </select>
          </div>

          {customization.backgroundType === "solid" && (
            <div>
              <label className="text-sm text-gray-300 block mb-2">
                Background Color
              </label>
              <ColorPicker
                value={customization.backgroundColor}
                onChange={(color) => updateConfig({ backgroundColor: color })}
              />
            </div>
          )}

          {customization.backgroundType === "gradient" && (
            <>
              <div>
                <label className="text-sm text-gray-300 block mb-2">
                  Gradient From
                </label>
                <ColorPicker
                  value={customization.backgroundGradient.from}
                  onChange={(color) =>
                    updateConfig({
                      backgroundGradient: {
                        ...customization.backgroundGradient,
                        from: color,
                      },
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 block mb-2">
                  Gradient To
                </label>
                <ColorPicker
                  value={customization.backgroundGradient.to}
                  onChange={(color) =>
                    updateConfig({
                      backgroundGradient: {
                        ...customization.backgroundGradient,
                        to: color,
                      },
                    })
                  }
                />
              </div>
            </>
          )}

          {(customization.backgroundType === "image" ||
            customization.backgroundType === "slideshow") && (
            <>
              <div>
                <label className="text-sm text-gray-300 block mb-2">
                  {customization.backgroundType === "slideshow"
                    ? "Slideshow Images"
                    : "Background Image"}
                </label>
                <ImageUploader
                  images={customization.backgroundImage}
                  onChange={(images) =>
                    updateConfig({ backgroundImage: images })
                  }
                  maxImages={
                    customization.backgroundType === "slideshow" ? 10 : 1
                  }
                  displayId={displayId}
                  imageType={
                    customization.backgroundType === "slideshow"
                      ? "slideshow"
                      : "background"
                  }
                  environment={environment}
                />
              </div>

              {customization.backgroundType === "slideshow" &&
                customization.backgroundImage.length > 1 && (
                  <div>
                    <label className="text-sm text-gray-300 block mb-2">
                      Slideshow Duration: {customization.slideshowDuration}s
                    </label>
                    <input
                      type="range"
                      min="3"
                      max="60"
                      value={customization.slideshowDuration}
                      onChange={(e) =>
                        updateConfig({
                          slideshowDuration: parseInt(e.target.value),
                        })
                      }
                      className="w-full accent-pink-500"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>3s</span>
                      <span>60s</span>
                    </div>
                  </div>
                )}
            </>
          )}
        </div>
      </CollapsibleSection>

      {/* Display Options */}
      <CollapsibleSection title="Display Options">
        <div className="space-y-3">
          {[
            {
              key: "showHijriDate",
              label: "Show Hijri Date",
              desc: "Display Islamic calendar",
            },
          ].map((option) => (
            <label
              key={option.key}
              className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-800/30 rounded transition-colors"
            >
              <div>
                <div className="text-sm text-gray-200">{option.label}</div>
                <div className="text-xs text-gray-400">{option.desc}</div>
              </div>
              <input
                type="checkbox"
                checked={
                  customization[
                    option.key as keyof typeof customization
                  ] as boolean
                }
                onChange={(e) =>
                  updateConfig({ [option.key]: e.target.checked })
                }
                className="w-5 h-5 rounded bg-gray-800 border-gray-700"
              />
            </label>
          ))}
        </div>
      </CollapsibleSection>
    </div>
  );
}
