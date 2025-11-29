"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Plus } from "lucide-react"

interface CorporateEditorProps {
  config: any
  onConfigChange: (config: any) => void
}

export function CorporateEditor({ config, onConfigChange }: CorporateEditorProps) {
  const meetingRooms = config.meetingRooms || []
  const kpiMetrics = config.kpiMetrics || {}

  const handleAddRoom = () => {
    onConfigChange({
      ...config,
      meetingRooms: [...meetingRooms, { room: "", schedule: "09:00 - 10:00", status: "Available" }],
    })
  }

  const handleUpdateRoom = (idx: number, field: string, value: string) => {
    const updated = [...meetingRooms]
    updated[idx] = { ...updated[idx], [field]: value }
    onConfigChange({ ...config, meetingRooms: updated })
  }

  const handleRemoveRoom = (idx: number) => {
    const updated = meetingRooms.filter((_: any, i: number) => i !== idx)
    onConfigChange({ ...config, meetingRooms: updated })
  }

  return (
    <div className="space-y-6">
      {/* Meeting Rooms */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-200">Meeting Rooms</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddRoom}
            className="border-slate-600 text-slate-300 h-7 bg-transparent"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Room
          </Button>
        </div>
        <div className="space-y-3">
          {meetingRooms.map((room: any, idx: number) => (
            <div key={idx} className="bg-slate-700/50 p-3 rounded space-y-2">
              <Input
                value={room.room}
                onChange={(e) => handleUpdateRoom(idx, "room", e.target.value)}
                placeholder="Room Name"
                className="bg-slate-700 border-slate-600 text-slate-50 text-sm"
              />
              <Input
                value={room.schedule}
                onChange={(e) => handleUpdateRoom(idx, "schedule", e.target.value)}
                placeholder="Schedule"
                className="bg-slate-700 border-slate-600 text-slate-50 text-sm"
              />
              <select
                value={room.status}
                onChange={(e) => handleUpdateRoom(idx, "status", e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-slate-50 text-sm"
              >
                <option>Available</option>
                <option>Booked</option>
                <option>Maintenance</option>
              </select>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleRemoveRoom(idx)}
                className="w-full text-red-400 hover:bg-red-500/10 text-sm"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-slate-700" />

      {/* KPI Metrics */}
      <div>
        <h3 className="text-sm font-semibold text-slate-200 mb-3">KPI Metrics</h3>
        <div className="space-y-2">
          <div>
            <label className="text-xs text-slate-400">Revenue</label>
            <Input
              value={kpiMetrics.revenue || "$1.2M"}
              onChange={(e) =>
                onConfigChange({
                  ...config,
                  kpiMetrics: { ...kpiMetrics, revenue: e.target.value },
                })
              }
              placeholder="$1.2M"
              className="mt-1 bg-slate-700 border-slate-600 text-slate-50 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">Growth</label>
            <Input
              value={kpiMetrics.growth || "+15%"}
              onChange={(e) =>
                onConfigChange({
                  ...config,
                  kpiMetrics: { ...kpiMetrics, growth: e.target.value },
                })
              }
              placeholder="+15%"
              className="mt-1 bg-slate-700 border-slate-600 text-slate-50 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
