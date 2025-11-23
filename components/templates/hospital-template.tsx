"use client"

import type React from "react"

interface HospitalCustomization {
  colors: any
  backgroundType: string
  backgroundColor: string
  font: string
}

interface HospitalTemplateProps {
  customization: HospitalCustomization
  backgroundStyle: React.CSSProperties
}

export function HospitalTemplate({ customization, backgroundStyle }: HospitalTemplateProps) {
  const textStyle = {
    color: customization.colors.text,
    fontFamily: customization.font,
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
  }

  const doctors = [
    { name: "Dr. Ahmed Hassan", specialty: "Cardiology", time: "9:00 AM - 5:00 PM", room: "201" },
    { name: "Dr. Fatima Khan", specialty: "Neurology", time: "10:00 AM - 6:00 PM", room: "305" },
    { name: "Dr. Mohamed Ali", specialty: "Orthopedics", time: "8:00 AM - 4:00 PM", room: "102" },
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
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40"></div>

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-12 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-2" style={textStyle}>
            🏥 HOSPITAL INFORMATION
          </h1>
          <p className="text-2xl opacity-80" style={textStyle}>
            Doctor Schedule & Patient Services
          </p>
        </div>

        {/* Doctors Schedule Table */}
        <div className="w-full max-w-4xl mb-8">
          <div className="bg-black/60 rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-4 bg-blue-900 text-white font-bold text-lg p-4">
              <div>Doctor Name</div>
              <div>Specialty</div>
              <div>Schedule</div>
              <div>Room</div>
            </div>

            {/* Table Rows */}
            {doctors.map((doctor, index) => (
              <div
                key={index}
                className="grid grid-cols-4 border-t border-white/20 p-4 text-white/90 text-lg hover:bg-white/10 transition-colors"
              >
                <div className="font-semibold">{doctor.name}</div>
                <div>{doctor.specialty}</div>
                <div>{doctor.time}</div>
                <div className="bg-blue-700 inline-flex items-center justify-center rounded px-3 py-1">
                  {doctor.room}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Info */}
        <div
          className="w-full max-w-4xl bg-red-900/80 rounded-lg p-6 text-center"
          style={{ color: customization.colors.secondary }}
        >
          <div className="text-3xl font-bold mb-2">🚑 EMERGENCY</div>
          <div className="text-2xl">Dial 911 or Proceed to Emergency Room - Ground Floor</div>
        </div>
      </div>
    </div>
  )
}
