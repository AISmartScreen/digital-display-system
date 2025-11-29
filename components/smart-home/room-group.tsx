"use client"
import { DeviceCard } from "./device-card"
import { Home, Sofa, Utensils, Wind } from "lucide-react"

interface Device {
  id: string
  name: string
  type: "light" | "thermostat" | "fan" | "camera" | "lock" | "speaker"
  status: boolean
  value?: number
}

interface RoomGroupProps {
  name: string
  icon: "living" | "bedroom" | "kitchen" | "outdoor"
  devices: Device[]
}

const iconMap = {
  living: Home,
  bedroom: Sofa,
  kitchen: Utensils,
  outdoor: Wind,
}

export function RoomGroup({ name, icon, devices }: RoomGroupProps) {
  const Icon = iconMap[icon]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Icon className="w-5 h-5 text-accent" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">{name}</h2>
        <span className="ml-auto text-sm text-muted-foreground">{devices.length} devices</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map((device) => (
          <DeviceCard key={device.id} {...device} />
        ))}
      </div>
    </div>
  )
}
