"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2, Plus } from "lucide-react"

interface HospitalEditorProps {
  config: any
  onConfigChange: (config: any) => void
}

export function HospitalEditor({ config, onConfigChange }: HospitalEditorProps) {
  const doctorSchedules = config.doctorSchedules || []
  const departmentInfo = config.departmentInfo || "Emergency Department"
  const emergencyContact = config.emergencyContact || "911"

  const handleAddDoctor = () => {
    onConfigChange({
      ...config,
      doctorSchedules: [...doctorSchedules, { name: "", specialty: "", time: "09:00", room: "" }],
    })
  }

  const handleUpdateDoctor = (idx: number, field: string, value: string) => {
    const updated = [...doctorSchedules]
    updated[idx] = { ...updated[idx], [field]: value }
    onConfigChange({ ...config, doctorSchedules: updated })
  }

  const handleRemoveDoctor = (idx: number) => {
    const updated = doctorSchedules.filter((_: any, i: number) => i !== idx)
    onConfigChange({ ...config, doctorSchedules: updated })
  }

  return (
    <div className="space-y-6">
      {/* Contact Info */}
      <div>
        <h3 className="text-sm font-semibold text-slate-200 mb-3">Contact Information</h3>
        <div className="space-y-2">
          <div>
            <label className="text-xs text-slate-400">Emergency Contact</label>
            <Input
              value={emergencyContact}
              onChange={(e) => onConfigChange({ ...config, emergencyContact: e.target.value })}
              placeholder="911"
              className="mt-1 bg-slate-700 border-slate-600 text-slate-50"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">Department</label>
            <Input
              value={departmentInfo}
              onChange={(e) => onConfigChange({ ...config, departmentInfo: e.target.value })}
              placeholder="Emergency Department"
              className="mt-1 bg-slate-700 border-slate-600 text-slate-50"
            />
          </div>
        </div>
      </div>

      <hr className="border-slate-700" />

      {/* Doctor Schedules */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-200">Doctor Schedules</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddDoctor}
            className="border-slate-600 text-slate-300 h-7 bg-transparent"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Doctor
          </Button>
        </div>
        <div className="space-y-3">
          {doctorSchedules.map((doctor: any, idx: number) => (
            <div key={idx} className="bg-slate-700/50 p-3 rounded space-y-2">
              <Input
                value={doctor.name}
                onChange={(e) => handleUpdateDoctor(idx, "name", e.target.value)}
                placeholder="Doctor Name"
                className="bg-slate-700 border-slate-600 text-slate-50 text-sm"
              />
              <Input
                value={doctor.specialty}
                onChange={(e) => handleUpdateDoctor(idx, "specialty", e.target.value)}
                placeholder="Specialty"
                className="bg-slate-700 border-slate-600 text-slate-50 text-sm"
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="time"
                  value={doctor.time}
                  onChange={(e) => handleUpdateDoctor(idx, "time", e.target.value)}
                  className="bg-slate-700 border-slate-600 text-slate-50 text-sm"
                />
                <Input
                  value={doctor.room}
                  onChange={(e) => handleUpdateDoctor(idx, "room", e.target.value)}
                  placeholder="Room"
                  className="bg-slate-700 border-slate-600 text-slate-50 text-sm"
                />
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleRemoveDoctor(idx)}
                className="w-full text-red-400 hover:bg-red-500/10 text-sm"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
