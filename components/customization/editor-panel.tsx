"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { ColorPicker } from "@/components/customization/color-picker"
import { TimePicker } from "@/components/customization/time-picker"
import { ImageUploader } from "@/components/customization/image-uploader"
import { AnnouncementEditor } from "@/components/customization/announcement-editor"

interface DisplayCustomization {
  template: string
  layout: string
  prayerTimes: any
  iqamahOffsets: any
  colors: any
  backgroundType: "solid" | "gradient" | "image" | "slideshow"
  backgroundColor: string
  backgroundImage: string[]
  slideshowDuration: number
  announcements: Array<{ text: string; duration: number }>
  showHijriDate: boolean
  font: string
}

interface EditorPanelProps {
  customization: DisplayCustomization
  setCustomization: (custom: DisplayCustomization) => void
}

interface CollapsibleSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

function CollapsibleSection({ title, children, defaultOpen = true }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-secondary/50 transition-colors"
      >
        <span className="font-semibold text-foreground">{title}</span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {isOpen && <div className="px-4 py-4 space-y-4 bg-secondary/30">{children}</div>}
    </div>
  )
}

export function EditorPanel({ customization, setCustomization }: EditorPanelProps) {
  return (
    <div>
      {/* Template Selector */}
      <CollapsibleSection title="Template" defaultOpen={true}>
        <Select
          value={customization.template}
          onValueChange={(value) => setCustomization({ ...customization, template: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="masjid-classic">Classic Masjid</SelectItem>
            <SelectItem value="hospital-modern">Modern Hospital</SelectItem>
            <SelectItem value="corporate-dashboard">Professional Dashboard</SelectItem>
          </SelectContent>
        </Select>
      </CollapsibleSection>

      {/* Layout Section */}
      <CollapsibleSection title="Layout">
        <div className="grid grid-cols-3 gap-2">
          {["vertical", "horizontal", "centered"].map((layout) => (
            <button
              key={layout}
              onClick={() => setCustomization({ ...customization, layout })}
              className={`p-3 rounded-lg border-2 text-xs font-medium capitalize transition-all ${
                customization.layout === layout
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              {layout === "vertical" ? "📏" : layout === "horizontal" ? "📐" : "◼️"}
              <div>{layout}</div>
            </button>
          ))}
        </div>
      </CollapsibleSection>

      {/* Content Section - Masjid Template */}
      {customization.template === "masjid-classic" && (
        <CollapsibleSection title="Prayer Times">
          <div className="space-y-3">
            {Object.entries(customization.prayerTimes).map(([prayer, time]) => (
              <div key={prayer}>
                <label className="block text-xs font-medium text-muted-foreground mb-1 capitalize">{prayer} Time</label>
                <TimePicker
                  value={time as string}
                  onChange={(newTime) =>
                    setCustomization({
                      ...customization,
                      prayerTimes: { ...customization.prayerTimes, [prayer]: newTime },
                    })
                  }
                />
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <h4 className="text-sm font-semibold text-foreground mb-3">Iqamah Offsets (minutes)</h4>
            <div className="space-y-3">
              {Object.entries(customization.iqamahOffsets).map(([prayer, offset]) => (
                <div key={prayer}>
                  <label className="block text-xs font-medium text-muted-foreground mb-1 capitalize">{prayer}</label>
                  <Input
                    type="number"
                    min="0"
                    max="60"
                    value={offset}
                    onChange={(e) =>
                      setCustomization({
                        ...customization,
                        iqamahOffsets: {
                          ...customization.iqamahOffsets,
                          [prayer]: Number.parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={customization.showHijriDate}
                onChange={(e) =>
                  setCustomization({
                    ...customization,
                    showHijriDate: e.target.checked,
                  })
                }
                className="rounded"
              />
              <span className="text-sm font-medium text-foreground">Show Hijri Date</span>
            </label>
          </div>

          <AnnouncementEditor
            announcements={customization.announcements}
            onChange={(announcements) => setCustomization({ ...customization, announcements })}
          />
        </CollapsibleSection>
      )}

      {/* Styling Section */}
      <CollapsibleSection title="Styling">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">Primary Color</label>
            <ColorPicker
              value={customization.colors.primary}
              onChange={(color) =>
                setCustomization({
                  ...customization,
                  colors: { ...customization.colors, primary: color },
                })
              }
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">Secondary Color</label>
            <ColorPicker
              value={customization.colors.secondary}
              onChange={(color) =>
                setCustomization({
                  ...customization,
                  colors: { ...customization.colors, secondary: color },
                })
              }
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">Text Color</label>
            <ColorPicker
              value={customization.colors.text}
              onChange={(color) =>
                setCustomization({
                  ...customization,
                  colors: { ...customization.colors, text: color },
                })
              }
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">Font Family</label>
            <Select value={customization.font} onValueChange={(font) => setCustomization({ ...customization, font })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Helvetica">Helvetica</SelectItem>
                <SelectItem value="Georgia">Georgia</SelectItem>
                <SelectItem value="Courier New">Courier New</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CollapsibleSection>

      {/* Background Section */}
      <CollapsibleSection title="Background">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">Background Type</label>
            <Select
              value={customization.backgroundType}
              onValueChange={(type: any) => setCustomization({ ...customization, backgroundType: type })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">Solid Color</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="slideshow">Slideshow</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {customization.backgroundType === "solid" && (
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">Color</label>
              <ColorPicker
                value={customization.backgroundColor}
                onChange={(color) => setCustomization({ ...customization, backgroundColor: color })}
              />
            </div>
          )}

          {(customization.backgroundType === "image" || customization.backgroundType === "slideshow") && (
            <>
              <ImageUploader
                images={customization.backgroundImage}
                onChange={(images) => setCustomization({ ...customization, backgroundImage: images })}
              />

              {customization.backgroundType === "slideshow" && (
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-2">
                    Slideshow Duration: {customization.slideshowDuration}s
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="60"
                    value={customization.slideshowDuration}
                    onChange={(e) =>
                      setCustomization({
                        ...customization,
                        slideshowDuration: Number.parseInt(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </CollapsibleSection>
    </div>
  )
}
