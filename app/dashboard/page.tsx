"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import { TopBar } from "@/components/top-bar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RoomGroup } from "@/components/smart-home/room-group"
import { EnergyMonitor } from "@/components/smart-home/energy-monitor"
import { Plus, Home, Zap } from "lucide-react"
import Link from "next/link"

const livingRoomDevices = [
  { id: "1", name: "Main Light", type: "light" as const, status: true, value: 80 },
  { id: "2", name: "Ceiling Fan", type: "fan" as const, status: false, value: 0 },
  { id: "3", name: "Security Camera", type: "camera" as const, status: true, value: 100 },
]

const bedroomDevices = [
  { id: "4", name: "Bedroom Light", type: "light" as const, status: true, value: 60 },
  { id: "5", name: "AC Unit", type: "thermostat" as const, status: true, value: 72 },
  { id: "6", name: "Door Lock", type: "lock" as const, status: true },
]

const kitchenDevices = [
  { id: "7", name: "Kitchen Light", type: "light" as const, status: true, value: 100 },
  { id: "8", name: "Smart Speaker", type: "speaker" as const, status: false },
]

const outdoorDevices = [
  { id: "9", name: "Patio Light", type: "light" as const, status: false, value: 0 },
  { id: "10", name: "Outdoor Camera", type: "camera" as const, status: true, value: 100 },
]

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <SidebarNavigation />
      <TopBar />

      <main className="md:ml-64 pt-20 pb-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Home className="w-6 h-6 text-accent" />
                </div>
                <h1 className="text-4xl font-bold text-foreground">Smart Home</h1>
              </div>
              <p className="text-muted-foreground">Monitor and control all your home devices</p>
            </div>
            <Link href="/devices/new">
              <Button className="mt-4 md:mt-0 gap-2">
                <Plus className="w-4 h-4" />
                Add Device
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Active Devices</p>
                  <p className="text-3xl font-bold text-foreground">7 of 10</p>
                </div>
                <span className="text-4xl">✓</span>
              </div>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Energy Usage</p>
                  <p className="text-3xl font-bold text-foreground">2.4 kW</p>
                </div>
                <Zap className="w-8 h-8 text-primary" />
              </div>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Temperature</p>
                  <p className="text-3xl font-bold text-foreground">72°F</p>
                </div>
                <span className="text-4xl">🌡️</span>
              </div>
            </Card>
          </div>

          <div className="space-y-12 mb-12">
            <RoomGroup name="Living Room" icon="living" devices={livingRoomDevices} />
            <RoomGroup name="Bedroom" icon="bedroom" devices={bedroomDevices} />
            <RoomGroup name="Kitchen" icon="kitchen" devices={kitchenDevices} />
            <RoomGroup name="Outdoor" icon="outdoor" devices={outdoorDevices} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <EnergyMonitor />
            </div>
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <span className="text-sm text-muted-foreground">Wi-Fi</span>
                  <span className="text-sm font-semibold text-green-500">Connected</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <span className="text-sm text-muted-foreground">Hub</span>
                  <span className="text-sm font-semibold text-green-500">Online</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <span className="text-sm text-muted-foreground">Backup</span>
                  <span className="text-sm font-semibold text-green-500">Active</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
