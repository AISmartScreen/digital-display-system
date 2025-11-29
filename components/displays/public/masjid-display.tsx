"use client"

import { useEffect, useState } from "react"

interface MasjidDisplayProps {
  config: any
}

export function MasjidDisplay({ config }: MasjidDisplayProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [hijriDate, setHijriDate] = useState("")

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const prayerTimes = config.prayerTimes || {
    fajr: "05:30",
    dhuhr: "12:30",
    asr: "15:45",
    maghrib: "18:00",
    isha: "19:30",
  }

  const primaryColor = config.colorTheme?.primary || "#f97316"

  const prayers = [
    { name: "Fajr", time: prayerTimes.fajr, emoji: "🌅" },
    { name: "Dhuhr", time: prayerTimes.dhuhr, emoji: "☀️" },
    { name: "Asr", time: prayerTimes.asr, emoji: "🌤️" },
    { name: "Maghrib", time: prayerTimes.maghrib, emoji: "🌆" },
    { name: "Isha", time: prayerTimes.isha, emoji: "🌙" },
  ]

  const getNextPrayer = () => {
    const now = currentTime
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
    const nextPrayer = prayers.find((p) => p.time > timeStr)
    return nextPrayer || prayers[0]
  }

  return (
    <div
      className="w-full h-screen flex flex-col justify-between items-center text-white p-12"
      style={{
        backgroundColor: "#0f172a",
        backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.95)), url('/mosque-background.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Top Section */}
      <div className="w-full text-center space-y-4">
        <h1 className="text-7xl font-bold">Prayer Times</h1>
        <div className="flex justify-center gap-8">
          <div>
            <p className="text-2xl opacity-75">Today</p>
            <p className="text-4xl font-semibold">
              {currentTime.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          {config.hijriDateEnabled && (
            <div>
              <p className="text-2xl opacity-75">Hijri</p>
              <p className="text-4xl font-semibold">15 Jumada al-Ula 1446</p>
            </div>
          )}
        </div>
      </div>

      {/* Prayer Times Grid */}
      <div className="grid grid-cols-5 gap-6 w-full max-w-6xl">
        {prayers.map((prayer) => (
          <div
            key={prayer.name}
            className="p-8 rounded-2xl text-center transition-all duration-300"
            style={{
              backgroundColor: primaryColor,
              opacity: getNextPrayer().name === prayer.name ? 1 : 0.8,
              transform: getNextPrayer().name === prayer.name ? "scale(1.1)" : "scale(1)",
            }}
          >
            <p className="text-5xl mb-4">{prayer.emoji}</p>
            <p className="text-2xl font-bold mb-2">{prayer.name}</p>
            <p className="text-4xl font-bold">{prayer.time}</p>
          </div>
        ))}
      </div>

      {/* Announcements */}
      {config.announcements && config.announcements.length > 0 && (
        <div
          className="w-full max-w-4xl p-8 rounded-2xl text-center border-4"
          style={{
            backgroundColor: `${primaryColor}20`,
            borderColor: primaryColor,
          }}
        >
          <p className="text-3xl font-semibold overflow-hidden">
            <span className="inline-block animate-scroll">{config.announcements[0]}</span>
          </p>
        </div>
      )}

      {/* Time */}
      <div className="text-center">
        <p className="text-5xl font-bold">
          {currentTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </p>
      </div>
    </div>
  )
}
