"use client"

import type React from "react"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { MasjidTemplate } from "@/components/templates/masjid-template"
import { HospitalTemplate } from "@/components/templates/hospital-template"
import { CorporateTemplate } from "@/components/templates/corporate-template"

export default function PreviewPage() {
  const searchParams = useSearchParams()
  const configString = searchParams.get("config")
  const [customization, setCustomization] = useState<any>(null)

  useEffect(() => {
    if (configString) {
      try {
        const decoded = JSON.parse(decodeURIComponent(configString))
        setCustomization(decoded)
      } catch (e) {
        console.error("Error parsing config:", e)
      }
    }
  }, [configString])

  if (!customization) {
    return <div className="w-screen h-screen bg-black flex items-center justify-center text-white">Loading...</div>
  }

  const getBackgroundStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      backgroundSize: "cover",
      backgroundPosition: "center",
    }

    if (customization.backgroundType === "solid") {
      return { ...baseStyle, backgroundColor: customization.backgroundColor }
    }

    if (customization.backgroundType === "image" && customization.backgroundImage?.[0]) {
      return { ...baseStyle, backgroundImage: `url(${customization.backgroundImage[0]})` }
    }

    if (customization.backgroundType === "slideshow" && customization.backgroundImage?.length > 0) {
      return { ...baseStyle, backgroundImage: `url(${customization.backgroundImage[0]})` }
    }

    return { ...baseStyle, backgroundColor: "#000" }
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
        return <div className="text-white text-2xl">Unknown template: {customization.template}</div>
    }
  }

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Full display screen without browser chrome */}
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="relative w-full h-full">
          {renderTemplate()}

          {/* PREVIEW MODE Badge */}
          <div className="absolute top-8 right-8 bg-black/70 text-white px-4 py-2 rounded text-sm font-mono z-50 pointer-events-none">
            PREVIEW MODE
          </div>
        </div>
      </div>
    </div>
  )
}
