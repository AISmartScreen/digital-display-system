"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import { TopBar } from "@/components/top-bar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DisplayCard } from "@/components/display-card"
import { Plus, Search, Grid, List } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const mockDisplays = [
  {
    id: 1,
    name: "Prayer Times Display - Main Hall",
    template: "Masjid",
    status: "active",
    lastHeartbeat: "2m ago",
    displayCount: 1,
  },
  {
    id: 2,
    name: "Hospital Schedule - 2nd Floor",
    template: "Hospital",
    status: "active",
    lastHeartbeat: "5m ago",
    displayCount: 1,
  },
  {
    id: 3,
    name: "Corporate Dashboard",
    template: "Corporate",
    status: "offline",
    lastHeartbeat: "2h ago",
    displayCount: 1,
  },
  {
    id: 4,
    name: "Masjid Announcement Board",
    template: "Masjid",
    status: "active",
    lastHeartbeat: "1m ago",
    displayCount: 1,
  },
  {
    id: 5,
    name: "Emergency Info Display",
    template: "Hospital",
    status: "active",
    lastHeartbeat: "3m ago",
    displayCount: 1,
  },
  {
    id: 6,
    name: "Meeting Room Scheduler",
    template: "Corporate",
    status: "offline",
    lastHeartbeat: "1h ago",
    displayCount: 1,
  },
]

export default function DisplaysPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [search, setSearch] = useState("")

  const filtered = mockDisplays.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <ProtectedRoute>
      <SidebarNavigation />
      <TopBar />

      <main className="md:ml-64 pt-20 pb-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground">My Displays</h1>
              <p className="text-muted-foreground mt-2">Manage and monitor all your digital displays</p>
            </div>
            <Link href="/displays/new">
              <Button className="mt-4 md:mt-0 gap-2">
                <Plus className="w-4 h-4" />
                Create Display
              </Button>
            </Link>
          </div>

          {/* Search and Filter */}
          <Card className="p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
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
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </Card>

          {/* Displays Grid/List */}
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
            {filtered.length > 0 ? (
              filtered.map((display) => <DisplayCard key={display.id} display={display} viewMode={viewMode} />)
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground mb-4">No displays found</p>
                <Link href="/displays/new">
                  <Button>Create your first display</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
