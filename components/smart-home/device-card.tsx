"use client"

import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"
import { Zap, Droplets, Wind, Eye, Lock, Speaker } from "lucide-react"

interface DeviceCardProps {
  id: string
  name: string
  type: "light" | "thermostat" | "fan" | "camera" | "lock" | "speaker"
  status: boolean
  value?: number
  maxValue?: number
  lastUpdated?: string
}

const iconMap = {
  light: Zap,
  thermostat: Droplets,
  fan: Wind,
  camera: Eye,
  lock: Lock,
  speaker: Speaker,
}

const colorMap = {
  light: "text-yellow-500",
  thermostat: "text-red-500",
  fan: "text-blue-500",
  camera: "text-green-500",
  lock: "text-purple-500",
  speaker: "text-pink-500",
}

export function DeviceCard({ id, name, type, status: initialStatus, value, maxValue = 100 }: DeviceCardProps) {
  const [status, setStatus] = useState(initialStatus)
  const [currentValue, setCurrentValue] = useState(value || 0)
  const Icon = iconMap[type]

  return (
    <Card className="p-6 bg-card hover:border-accent/50 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg bg-accent/10`}>
            <Icon className={`w-5 h-5 ${colorMap[type]}`} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm md:text-base">{name}</h3>
            <p className="text-xs text-muted-foreground capitalize">{type}</p>
          </div>
        </div>
        <Switch checked={status} onCheckedChange={setStatus} />
      </div>

      {(type === "thermostat" || type === "fan" || type === "light") && status && (
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Level</span>
            <span className="font-semibold text-foreground">{currentValue}%</span>
          </div>
          <Slider
            value={[currentValue]}
            onValueChange={(val) => setCurrentValue(val[0])}
            max={maxValue}
            step={1}
            className="w-full"
          />
        </div>
      )}

      {type === "camera" && (
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-3">
          <span className="text-xs text-muted-foreground">Stream Active</span>
        </div>
      )}

      <div className="pt-3 border-t border-border">
        <p className="text-xs text-muted-foreground">{status ? "On" : "Off"} • Now</p>
      </div>
    </Card>
  )
}
