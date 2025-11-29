"use client"

import { useEffect, useState } from "react"

export function CorporatePreview({ config }: { config: any }) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const meetingRooms = config.meetingRooms || []
  const kpiMetrics = config.kpiMetrics || {}

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center text-white p-12 bg-gradient-to-br from-slate-900 via-cyan-900/20 to-slate-950">
      <div className="w-full max-w-6xl space-y-8">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-6">Meeting Rooms</h1>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(kpiMetrics).map(([key, value]) => (
              <div key={key} className="bg-slate-800/50 backdrop-blur border border-slate-700 p-4 rounded-2xl">
                <p className="text-sm opacity-75 capitalize">{key}</p>
                <p className="text-3xl font-bold text-cyan-400">{value as string}</p>
              </div>
            ))}
          </div>
        </div>

        {meetingRooms.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {meetingRooms.map((room: any, idx: number) => {
              const statusColor =
                room.status === "Available"
                  ? "bg-green-500/20 border-green-500/50"
                  : room.status === "Booked"
                    ? "bg-orange-500/20 border-orange-500/50"
                    : "bg-red-500/20 border-red-500/50"

              return (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl border backdrop-blur ${statusColor} hover:scale-105 transition-transform`}
                >
                  <p className="font-bold text-2xl mb-2">{room.room}</p>
                  <p className="text-sm opacity-75 mb-3">{room.schedule}</p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${room.status === "Available" ? "bg-green-500" : room.status === "Booked" ? "bg-orange-500" : "bg-red-500"}`}
                    ></span>
                    <p className="text-sm font-semibold">{room.status}</p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-center text-lg opacity-50">No meeting rooms configured</p>
        )}

        <div className="text-center text-slate-400 text-lg mt-8">
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
