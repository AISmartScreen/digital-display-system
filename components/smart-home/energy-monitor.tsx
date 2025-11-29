"use client"

import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Zap } from "lucide-react"

const energyData = [
  { time: "12 AM", usage: 0.5 },
  { time: "3 AM", usage: 0.3 },
  { time: "6 AM", usage: 0.8 },
  { time: "9 AM", usage: 2.1 },
  { time: "12 PM", usage: 3.5 },
  { time: "3 PM", usage: 4.2 },
  { time: "6 PM", usage: 5.8 },
  { time: "9 PM", usage: 4.5 },
  { time: "12 AM", usage: 1.2 },
]

export function EnergyMonitor() {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-lg bg-accent/10">
          <Zap className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Energy Usage</h3>
          <p className="text-sm text-muted-foreground">Today's consumption</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={energyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.2 0 0)" />
          <XAxis dataKey="time" stroke="oklch(0.556 0 0)" style={{ fontSize: "12px" }} />
          <YAxis stroke="oklch(0.556 0 0)" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "oklch(0.145 0 0)",
              border: "1px solid oklch(0.269 0 0)",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "oklch(0.95 0 0)" }}
          />
          <Line type="monotone" dataKey="usage" stroke="oklch(0.52 0.195 200.37)" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="p-3 bg-secondary rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Current</p>
          <p className="text-lg font-bold text-foreground">2.4 kW</p>
        </div>
        <div className="p-3 bg-secondary rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Today</p>
          <p className="text-lg font-bold text-foreground">28.6 kWh</p>
        </div>
        <div className="p-3 bg-secondary rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Cost</p>
          <p className="text-lg font-bold text-foreground">$3.43</p>
        </div>
      </div>
    </Card>
  )
}
