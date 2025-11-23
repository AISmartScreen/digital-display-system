"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { getPrayerInfo, getHijriDate } from "@/lib/islamic-calculations"

interface MasjidCustomization {
  template: string
  prayerTimes: {
    fajr: string
    dhuhr: string
    asr: string
    maghrib: string
    isha: string
  }
  iqamahOffsets: {
    fajr: number
    dhuhr: number
    asr: number
    maghrib: number
    isha: number
  }
  colors: {
    primary: string
    secondary: string
    text: string
    accent: string
  }
  announcements: Array<{ text: string; duration: number }>
  showHijriDate: boolean
  font: string
}

interface MasjidTemplateProps {
  customization: MasjidCustomization
  backgroundStyle: React.CSSProperties
}

export function MasjidTemplate({ customization, backgroundStyle }: MasjidTemplateProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [nextPrayer, setNextPrayer] = useState("")
  const [timeUntilNextPrayer, setTimeUntilNextPrayer] = useState("")
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)

      const { next, timeUntil } = getPrayerInfo(customization.prayerTimes, now)
      setNextPrayer(next)
      setTimeUntilNextPrayer(timeUntil)
    }, 1000)

    return () => clearInterval(timer)
  }, [customization.prayerTimes])

  useEffect(() => {
    if (customization.announcements.length === 0) return

    const interval = setInterval(
      () => {
        setCurrentAnnouncement((prev) => (prev + 1) % customization.announcements.length)
      },
      (customization.announcements[currentAnnouncement]?.duration || 5) * 1000,
    )

    return () => clearInterval(interval)
  }, [customization.announcements, currentAnnouncement])

  const hijriDate = customization.showHijriDate ? getHijriDate() : null

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const isAM = hour < 12
    const displayHour = hour % 12 || 12
    return `${displayHour.toString().padStart(2, "0")}:${minutes} ${isAM ? "AM" : "PM"}`
  }

  const textStyle = {
    color: customization.colors.text,
    fontFamily: customization.font,
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
  }

  const prayers = [
    { name: "Fajr", time: customization.prayerTimes.fajr, offset: customization.iqamahOffsets.fajr },
    { name: "Dhuhr", time: customization.prayerTimes.dhuhr, offset: customization.iqamahOffsets.dhuhr },
    { name: "Asr", time: customization.prayerTimes.asr, offset: customization.iqamahOffsets.asr },
    { name: "Maghrib", time: customization.prayerTimes.maghrib, offset: customization.iqamahOffsets.maghrib },
    { name: "Isha", time: customization.prayerTimes.isha, offset: customization.iqamahOffsets.isha },
  ]

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: backgroundStyle.backgroundImage,
        backgroundColor: backgroundStyle.backgroundColor,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Decorative overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>

      {/* Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-16 py-12">
        {/* Header Section */}
        <div className="text-center mb-8">
          {hijriDate && customization.showHijriDate && (
            <div className="text-2xl mb-4" style={textStyle}>
              📅 {hijriDate}
            </div>
          )}
          <div className="text-5xl font-bold mb-2" style={textStyle}>
            PRAYER TIMES
          </div>
          <div className="text-xl opacity-80" style={textStyle}>
            {currentTime.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </div>
        </div>

        {/* Prayer Times Grid */}
        <div className="grid grid-cols-5 gap-6 mb-12 w-full max-w-6xl">
          {prayers.map((prayer, index) => (
            <div key={index} className="text-center">
              <div className="text-sm uppercase opacity-70 mb-2" style={textStyle}>
                {prayer.name}
              </div>
              <div className="text-4xl font-bold mb-1" style={textStyle}>
                {formatTime(prayer.time)}
              </div>
              <div className="text-xs opacity-60" style={textStyle}>
                Iqamah: +{prayer.offset}m
              </div>
            </div>
          ))}
        </div>

        {/* Next Prayer & Countdown */}
        <div className="text-center mb-8">
          <div className="text-2xl mb-2" style={textStyle}>
            Next Prayer: <span className="font-bold">{nextPrayer}</span>
          </div>
          <div className="text-5xl font-bold font-mono" style={textStyle}>
            {timeUntilNextPrayer}
          </div>
        </div>

        {/* Announcements */}
        {customization.announcements.length > 0 && (
          <div
            className="px-8 py-4 rounded-lg text-2xl text-center animate-pulse"
            style={{
              backgroundColor: customization.colors.primary,
              color: customization.colors.secondary,
              textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
            }}
          >
            📢 {customization.announcements[currentAnnouncement].text}
          </div>
        )}

        {/* Current Time */}
        <div className="absolute bottom-6 right-8 text-lg opacity-60" style={textStyle}>
          {currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </div>
      </div>
    </div>
  )
}
