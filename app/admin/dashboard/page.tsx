"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import { TopBar } from "@/components/top-bar"
import { Card } from "@/components/ui/card"
import { MetricCard } from "@/components/metric-card"
import { AlertCircle } from "lucide-react"
import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

const systemMetrics = [
  { label: "Total Clients", value: "124", trend: "+8 this month", icon: "👥" },
  { label: "Active Displays", value: "487", trend: "+45 displays", icon: "📺" },
  { label: "Monthly Revenue", value: "$18.5K", trend: "+12% growth", icon: "💰" },
  { label: "System Alerts", value: "3", trend: "needs attention", icon: "⚠️" },
]

const revenueData = [
  { month: "Jan", revenue: 8000 },
  { month: "Feb", revenue: 10500 },
  { month: "Mar", revenue: 12000 },
  { month: "Apr", revenue: 15000 },
  { month: "May", revenue: 16500 },
  { month: "Jun", revenue: 18500 },
]

const clientGrowthData = [
  { month: "Jan", clients: 45 },
  { month: "Feb", clients: 62 },
  { month: "Mar", clients: 78 },
  { month: "Apr", clients: 95 },
  { month: "May", clients: 112 },
  { month: "Jun", clients: 124 },
]

export default function AdminDashboardPage() {
  const [selectedMetric, setSelectedMetric] = useState("revenue")

  return (
    <ProtectedRoute requiredRole="super_admin">
      <SidebarNavigation />
      <TopBar />

      <main className="md:ml-64 pt-20 pb-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">System overview and analytics</p>
          </div>

          {/* System Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {systemMetrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Revenue Trend</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.269 0 0)" />
                  <XAxis dataKey="month" stroke="oklch(0.556 0 0)" />
                  <YAxis stroke="oklch(0.556 0 0)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.145 0 0)",
                      border: "1px solid oklch(0.269 0 0)",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "oklch(0.95 0 0)" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="oklch(0.496 0.243 264.376)"
                    strokeWidth={2}
                    dot={{ fill: "oklch(0.496 0.243 264.376)", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Client Growth Chart */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Client Growth</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={clientGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.269 0 0)" />
                  <XAxis dataKey="month" stroke="oklch(0.556 0 0)" />
                  <YAxis stroke="oklch(0.556 0 0)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.145 0 0)",
                      border: "1px solid oklch(0.269 0 0)",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "oklch(0.95 0 0)" }}
                  />
                  <Bar dataKey="clients" fill="oklch(0.496 0.243 264.376)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* System Alerts */}
          <Card className="p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <h2 className="text-xl font-semibold text-foreground">System Alerts</h2>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-destructive">High CPU Usage</p>
                    <p className="text-sm text-muted-foreground mt-1">Server 2 is running at 89% capacity</p>
                  </div>
                  <button className="text-sm text-destructive hover:underline">View</button>
                </div>
              </div>

              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-yellow-600 dark:text-yellow-500">Upcoming Maintenance</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Database maintenance scheduled for tonight 2-4 AM
                    </p>
                  </div>
                  <button className="text-sm text-yellow-600 dark:text-yellow-500 hover:underline">Reschedule</button>
                </div>
              </div>

              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-yellow-600 dark:text-yellow-500">Pending Client Approvals</p>
                    <p className="text-sm text-muted-foreground mt-1">5 new registrations waiting for admin approval</p>
                  </div>
                  <button className="text-sm text-yellow-600 dark:text-yellow-500 hover:underline">Review</button>
                </div>
              </div>
            </div>
          </Card>

          {/* Top Performing Clients */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Top Performing Clients</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Business Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Displays</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Revenue (Mo.)</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 1, name: "Al-Noor Masjid", type: "Masjid", displays: 8, revenue: "$2,400", status: "active" },
                    {
                      id: 2,
                      name: "City Hospital",
                      type: "Hospital",
                      displays: 15,
                      revenue: "$4,500",
                      status: "active",
                    },
                    {
                      id: 3,
                      name: "Tech Corp Inc",
                      type: "Corporate",
                      displays: 12,
                      revenue: "$3,600",
                      status: "active",
                    },
                    { id: 4, name: "Islamic Center", type: "Masjid", displays: 6, revenue: "$1,800", status: "active" },
                    {
                      id: 5,
                      name: "Central Clinic",
                      type: "Hospital",
                      displays: 5,
                      revenue: "$1,500",
                      status: "active",
                    },
                  ].map((client) => (
                    <tr key={client.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-foreground">{client.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{client.type}</td>
                      <td className="py-3 px-4 text-muted-foreground">{client.displays}</td>
                      <td className="py-3 px-4 font-semibold text-accent">{client.revenue}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                          Active
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-primary hover:underline text-sm font-medium">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </ProtectedRoute>
  )
}
