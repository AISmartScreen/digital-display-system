"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { MasjidTemplate } from "@/components/templates/masjid-template"
import { HospitalTemplate } from "@/components/templates/hospital-template"
import { CorporateTemplate } from "@/components/templates/corporate-template"

interface DisplayCustomization {
  template: string
  prayerTimes: any
  iqamahOffsets: any
  colors: any
  backgroundType: string
  backgroundColor: string
  backgroundImage: string[]
  slideshowDuration: number
  announcements: any[]
  showHijriDate: boolean
  font: string
}

interface LivePreviewProps {
  customization: DisplayCustomization
}

export function LivePreview({ customization }: LivePreviewProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (customization.backgroundType === "slideshow" && customization.backgroundImage.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % customization.backgroundImage.length)
      }, customization.slideshowDuration * 1000)
      return () => clearInterval(interval)
    }
  }, [customization.backgroundType, customization.backgroundImage, customization.slideshowDuration])

  const getBackgroundStyle = () => {
    const baseStyle: React.CSSProperties = {
      backgroundSize: "cover",
      backgroundPosition: "center",
    }

    if (customization.backgroundType === "solid") {
      return { ...baseStyle, backgroundColor: customization.backgroundColor }
    }

    if (customization.backgroundType === "image" && customization.backgroundImage[0]) {
      return { ...baseStyle, backgroundImage: `url(${customization.backgroundImage[0]})` }
    }

    if (customization.backgroundType === "slideshow" && customization.backgroundImage.length > 0) {
      return { ...baseStyle, backgroundImage: `url(${customization.backgroundImage[currentSlide]})` }
    }

    return baseStyle
  }

  const renderTemplate = () => {
    switch (customization.template) {
      case "masjid-classic":
        return <MasjidTemplate customization={customization} backgroundStyle={getBackgroundStyle()} />
      case "hospital-modern":
        return <HospitalTemplate customization={customization} backgroundStyle={getBackgroundStyle()} />
      case "corporate-dashboard":
        return <CorporateTemplate customization={customization} backgroundStyle={getBackgroundStyle()} />
      default:
        return <div>Unknown template</div>
    }
  }

  return (
    <div className="sticky top-20 rounded-lg overflow-hidden border-2 border-primary/50 shadow-xl">
      {/* Preview Container - 16:9 aspect ratio */}
      <div className="relative w-full bg-black" style={{ aspectRatio: "16 / 9" }}>
        <div
          className="w-full h-full flex items-center justify-center relative overflow-hidden"
          style={getBackgroundStyle()}
        >
          {/* PREVIEW MODE watermark */}
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-xs font-mono z-10">
            PREVIEW MODE
          </div>

          {/* Content */}
          {renderTemplate()}
        </div>
      </div>

      {/* Info Bar */}
      <div className="bg-card border-t border-border p-3 text-sm text-muted-foreground flex items-center justify-between">
        <span>📺 1920x1080 Resolution</span>
        {customization.backgroundType === "slideshow" && customization.backgroundImage.length > 0 && (
          <span>
            Slide {currentSlide + 1} of {customization.backgroundImage.length}
          </span>
        )}
      </div>
    </div>
  )
}
