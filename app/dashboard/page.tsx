"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import { TopBar } from "@/components/top-bar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MetricCard } from "@/components/metric-card"
import { ActivityFeed } from "@/components/activity-feed"
import { Plus } from "lucide-react"
import Link from "next/link"

const mockMetrics = [
  { label: "Total Displays", value: "8", trend: "+2 this month", icon: "📺" },
  { label: "Active Now", value: "7", trend: "1 offline", icon: "🟢" },
  { label: "Storage Used", value: "2.4 GB", trend: "of 10 GB", icon: "💾" },
]

const mockActivity = [
  { id: 1, action: 'Display "Masjid Hall" went offline', time: "2 minutes ago", type: "offline" },
  { id: 2, action: 'Customization saved for "Prayer Times 1"', time: "1 hour ago", type: "save" },
  { id: 3, action: "New announcement added", time: "3 hours ago", type: "update" },
  { id: 4, action: 'Display "Hospital Main" synced successfully', time: "5 hours ago", type: "sync" },
]

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <SidebarNavigation />
      <TopBar />

      <main className="md:ml-64 pt-20 pb-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-2">Welcome back! Here's your display overview.</p>
            </div>
            <Link href="/displays/new">
              <Button className="mt-4 md:mt-0 gap-2">
                <Plus className="w-4 h-4" />
                Add New Display
              </Button>
            </Link>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {mockMetrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Displays */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">Recent Displays</h2>
                  <Link href="/displays">
                    <button className="text-primary text-sm font-medium hover:underline">View all</button>
                  </Link>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      name: "Prayer Times Display - Main Hall",
                      status: "active",
                      template: "Masjid",
                      lastSync: "5m ago",
                    },
                    {
                      name: "Hospital Schedule - 2nd Floor",
                      status: "active",
                      template: "Hospital",
                      lastSync: "12m ago",
                    },
                    { name: "Corporate Dashboard", status: "offline", template: "Corporate", lastSync: "2h ago" },
                  ].map((display, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-foreground">{display.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {display.template} • Last sync: {display.lastSync}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          display.status === "active"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                        }`}
                      >
                        {display.status === "active" ? "🟢 Active" : "🔴 Offline"}
                      </div>
                    </div>
                  ))}
                </div>

                <Link href="/displays">
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    View All Displays
                  </Button>
                </Link>
              </Card>
            </div>

            {/* Activity Feed */}
            <ActivityFeed activities={mockActivity} />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Need Help?</h3>
                  <p className="text-sm text-muted-foreground">Check our documentation and guides</p>
                </div>
                <span className="text-3xl">📚</span>
              </div>
            </Card>
            <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:border-accent/40 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Upgrade Plan</h3>
                  <p className="text-sm text-muted-foreground">Get unlimited displays and storage</p>
                </div>
                <span className="text-3xl">⭐</span>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
