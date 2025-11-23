"use client"

import type React from "react"

interface CorporateCustomization {
  colors: any
  backgroundType: string
  backgroundColor: string
  font: string
}

interface CorporateTemplateProps {
  customization: CorporateCustomization
  backgroundStyle: React.CSSProperties
}

export function CorporateTemplate({ customization, backgroundStyle }: CorporateTemplateProps) {
  const textStyle = {
    color: customization.colors.text,
    fontFamily: customization.font,
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
  }

  const meetings = [
    { room: "Conference Room A", topic: "Q4 Planning", time: "10:00 AM", attendees: "12" },
    { room: "Board Room", topic: "Executive Meeting", time: "2:00 PM", attendees: "8" },
    { room: "Meeting Room 3", topic: "Team Standup", time: "3:30 PM", attendees: "6" },
  ]

  const kpis = [
    { label: "Revenue", value: "$2.5M", target: "$3.0M" },
    { label: "Clients", value: "156", target: "180" },
    { label: "Growth", value: "+22%", target: "+25%" },
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
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50"></div>

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-12 py-8">
        {/* Header */}
        <h1 className="text-5xl font-bold mb-8" style={textStyle}>
          💼 CORPORATE DASHBOARD
        </h1>

        <div className="grid grid-cols-3 gap-8 mb-12 w-full max-w-5xl">
          {/* Meeting Rooms */}
          <div className="bg-black/40 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4" style={textStyle}>
              Meetings Today
            </h2>
            <div className="space-y-3">
              {meetings.map((meeting, index) => (
                <div key={index} className="bg-white/10 rounded p-3">
                  <div className="font-bold" style={textStyle}>
                    {meeting.room}
                  </div>
                  <div className="text-sm opacity-80" style={textStyle}>
                    {meeting.topic} @ {meeting.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KPIs */}
          <div className="bg-black/40 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4" style={textStyle}>
              Key Metrics
            </h2>
            <div className="space-y-3">
              {kpis.map((kpi, index) => (
                <div key={index} className="bg-white/10 rounded p-3">
                  <div className="text-sm opacity-80" style={textStyle}>
                    {kpi.label}
                  </div>
                  <div className="font-bold text-lg" style={textStyle}>
                    {kpi.value}
                  </div>
                  <div className="text-xs opacity-60" style={textStyle}>
                    Target: {kpi.target}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-black/40 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4" style={textStyle}>
              Announcements
            </h2>
            <div className="space-y-3">
              <div className="bg-accent/20 rounded p-3 text-sm" style={textStyle}>
                📢 Team lunch at 12:30 PM in the cafeteria
              </div>
              <div className="bg-accent/20 rounded p-3 text-sm" style={textStyle}>
                📋 All-hands meeting moved to tomorrow
              </div>
              <div className="bg-accent/20 rounded p-3 text-sm" style={textStyle}>
                🎉 Congratulations to the Sales team!
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-lg opacity-70" style={textStyle}>
          Last Updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}
