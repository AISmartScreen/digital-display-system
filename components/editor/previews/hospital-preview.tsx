"use client"

import { useEffect, useState } from "react"

export function HospitalPreview({ config }: { config: any }) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const doctorSchedules = config.doctorSchedules || []
  const emergencyContact = config.emergencyContact || "911"

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center text-white p-12 bg-gradient-to-br from-slate-900 to-slate-950">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-2">Doctor Schedule</h1>
          <p className="text-2xl opacity-75">{config.departmentInfo || "Emergency Department"}</p>
        </div>

        {doctorSchedules.length > 0 ? (
          <div className="space-y-4">
            {doctorSchedules.map((doctor: any, idx: number) => (
              <div
                key={idx}
                className="bg-slate-800/50 backdrop-blur border border-slate-700 p-6 rounded-2xl flex justify-between items-center hover:bg-slate-800/70 transition-colors"
              >
                <div>
                  <p className="font-bold text-2xl">{doctor.name}</p>
                  <p className="text-sm opacity-75">{doctor.specialty}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-2xl">{doctor.time}</p>
                  <p className="text-sm opacity-75">Room {doctor.room}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-lg opacity-50">No doctors scheduled</p>
        )}

        <div className="bg-red-600 text-white p-6 rounded-2xl text-center">
          <p className="text-lg mb-2 font-semibold">Emergency Contact</p>
          <p className="text-5xl font-bold">{emergencyContact}</p>
        </div>

        <div className="text-center text-slate-400 text-lg">
          {currentTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </div>
      </div>
    </div>
  )
}
