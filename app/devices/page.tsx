"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import { TopBar } from "@/components/top-bar"
import { Button } from "@/components/ui/button"
import { DeviceCard } from "@/components/smart-home/device-card"
import { Plus, Lightbulb } from "lucide-react"
import Link from "next/link"

const allDevices = [
  { id: "1", name: "Main Light", type: "light" as const, status: true, value: 80 },
  { id: "2", name: "Ceiling Fan", type: "fan" as const, status: false, value: 0 },
  { id: "3", name: "Security Camera", type: "camera" as const, status: true, value: 100 },
  { id: "4", name: "Bedroom Light", type: "light" as const, status: true, value: 60 },
  { id: "5", name: "AC Unit", type: "thermostat" as const, status: true, value: 72 },
  { id: "6", name: "Door Lock", type: "lock" as const, status: true },
  { id: "7", name: "Kitchen Light", type: "light" as const, status: true, value: 100 },
  { id: "8", name: "Smart Speaker", type: "speaker" as const, status: false },
  { id: "9", name: "Patio Light", type: "light" as const, status: false, value: 0 },
  { id: "10", name: "Outdoor Camera", type: "camera" as const, status: true, value: 100 },
]

export default function DevicesPage() {
  const activeCount = allDevices.filter((d) => d.status).length

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
                  <Lightbulb className="w-6 h-6 text-accent" />
                </div>
                <h1 className="text-4xl font-bold text-foreground">All Devices</h1>
              </div>
              <p className="text-muted-foreground">
                {activeCount} of {allDevices.length} devices active
              </p>
            </div>
            <Link href="/devices/new">
              <Button className="mt-4 md:mt-0 gap-2">
                <Plus className="w-4 h-4" />
                Add New Device
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {allDevices.map((device) => (
              <DeviceCard key={device.id} {...device} />
            ))}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
