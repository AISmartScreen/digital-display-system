"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import { TopBar } from "@/components/top-bar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Power } from "lucide-react"
import { useState } from "react"

interface Display {
  id: string
  name: string
  clientName: string
  template: string
  status: "online" | "offline" | "warning"
  lastHeartbeat: string
  resolution: string
  uptime: string
}

const mockDisplays: Display[] = [
  {
    id: "DSP-001",
    name: "Prayer Times - Main Hall",
    clientName: "Al-Noor Masjid",
    template: "Masjid",
    status: "online",
    lastHeartbeat: "1m ago",
    resolution: "1920x1080",
    uptime: "99.8%",
  },
  {
    id: "DSP-002",
    name: "Hospital Schedule - 2nd Floor",
    clientName: "City Hospital",
    template: "Hospital",
    status: "online",
    lastHeartbeat: "2m ago",
    resolution: "1920x1080",
    uptime: "99.2%",
  },
  {
    id: "DSP-003",
    name: "Corporate Dashboard",
    clientName: "Tech Corp Inc",
    template: "Corporate",
    status: "offline",
    lastHeartbeat: "2h ago",
    resolution: "1920x1080",
    uptime: "98.5%",
  },
  {
    id: "DSP-004",
    name: "Emergency Info",
    clientName: "City Hospital",
    template: "Hospital",
    status: "warning",
    lastHeartbeat: "5m ago",
    resolution: "1920x1080",
    uptime: "97.8%",
  },
  {
    id: "DSP-005",
    name: "Announcement Board",
    clientName: "Islamic Center",
    template: "Masjid",
    status: "online",
    lastHeartbeat: "30s ago",
    resolution: "1920x1080",
    uptime: "99.9%",
  },
]

export default function AdminDisplaysPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "online" | "offline" | "warning">("all")

  const filtered = mockDisplays.filter((display) => {
    const matchesSearch =
      display.name.toLowerCase().includes(search.toLowerCase()) ||
      display.clientName.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || display.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
      case "offline":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
      case "warning":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
      default:
        return ""
    }
  }

  return (
    <ProtectedRoute requiredRole="super_admin">
      <SidebarNavigation />
      <TopBar />

      <main className="md:ml-64 pt-20 pb-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground">All Displays</h1>
            <p className="text-muted-foreground mt-2">Monitor and manage all displays across all clients</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Total Displays</p>
              <p className="text-3xl font-bold text-foreground mt-1">{mockDisplays.length}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Online</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {mockDisplays.filter((d) => d.status === "online").length}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Offline</p>
              <p className="text-3xl font-bold text-red-600 mt-1">
                {mockDisplays.filter((d) => d.status === "offline").length}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Warning</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">
                {mockDisplays.filter((d) => d.status === "warning").length}
              </p>
            </Card>
          </div>

          {/* Filter Bar */}
          <Card className="p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search displays..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                {(["all", "online", "offline", "warning"] as const).map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                    className="capitalize"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          {/* Displays Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Display Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Client</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Template</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Last Heartbeat</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Resolution</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Uptime</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? (
                    filtered.map((display) => (
                      <tr key={display.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                        <td className="py-3 px-4 font-medium text-foreground">{display.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">{display.clientName}</td>
                        <td className="py-3 px-4 text-muted-foreground">{display.template}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(display.status)}`}
                          >
                            {display.status.charAt(0).toUpperCase() + display.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground text-sm">{display.lastHeartbeat}</td>
                        <td className="py-3 px-4 text-muted-foreground">{display.resolution}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              Number.parseInt(display.uptime) > 99
                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                            }`}
                          >
                            {display.uptime}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                            {display.status !== "offline" && (
                              <Button size="sm" variant="outline" className="gap-1 text-destructive bg-transparent">
                                <Power className="w-4 h-4" />
                                Restart
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-muted-foreground">
                        No displays found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </ProtectedRoute>
  )
}
