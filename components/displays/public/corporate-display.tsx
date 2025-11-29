"use client"

import { useEffect, useState } from "react"

interface CorporateDisplayProps {
  config: any
}

export function CorporateDisplay({ config }: CorporateDisplayProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const meetingRooms = config.meetingRooms || []
  const kpiMetrics = config.kpiMetrics || {}

  const getRoomStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-cyan-600"
      case "Booked":
        return "bg-orange-600"
      case "Maintenance":
        return "bg-red-600"
      default:
        return "bg-slate-600"
    }
  }

  return (
    <div
      className="w-full h-screen flex flex-col justify-between items-center text-white p-12"
      style={{
        backgroundColor: "#0f172a",
      }}
    >
      {/* Header */}
      <div className="w-full text-center space-y-6 mb-8">
        <h1 className="text-6xl font-bold">Meeting Rooms</h1>
        <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
          {Object.entries(kpiMetrics).map(([key, value]) => (
            <div key={key} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <p className="text-sm opacity-75 capitalize mb-2">{key}</p>
              <p className="text-3xl font-bold text-orange-500">{value as string}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Meeting Rooms Grid */}
      <div className="grid grid-cols-3 gap-6 w-full max-w-6xl flex-1">
        {meetingRooms.length > 0 ? (
          meetingRooms.map((room: any, idx: number) => (
            <div
              key={idx}
              className={`${getRoomStatusColor(
                room.status,
              )} p-8 rounded-2xl flex flex-col justify-center text-center border-4 border-white`}
            >
              <p className="text-4xl font-bold mb-4">{room.room}</p>
              <p className="text-2xl mb-4 opacity-90">{room.schedule}</p>
              <p className="text-xl font-semibold">{room.status}</p>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center opacity-50 py-12">
            <p className="text-2xl">No meeting rooms configured</p>
          </div>
        )}
      </div>

      {/* Time */}
      <div className="mt-8 text-center">
        <p className="text-5xl font-bold">
          {currentTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  )
}
