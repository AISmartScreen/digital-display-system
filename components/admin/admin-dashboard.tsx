"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ClientTable } from "./client-table"
import { LogOut, Users, Monitor, BarChart3, TrendingUp } from "lucide-react"

interface Client {
  id: string
  email: string
  businessName: string
  businessType: string
  status: "pending" | "active" | "suspended"
  createdAt: string
  displayCount: number
}

const mockClients: Client[] = [
  {
    id: "1",
    email: "admin@masjid.com",
    businessName: "Al-Noor Masjid",
    businessType: "masjid",
    status: "active",
    createdAt: "2025-01-15",
    displayCount: 3,
  },
  {
    id: "2",
    email: "info@hospital.com",
    businessName: "Central Medical Hospital",
    businessType: "hospital",
    status: "pending",
    createdAt: "2025-01-20",
    displayCount: 0,
  },
  {
    id: "3",
    email: "office@techcorp.com",
    businessName: "TechCorp Inc",
    businessType: "corporate",
    status: "active",
    createdAt: "2025-01-10",
    displayCount: 5,
  },
  {
    id: "4",
    email: "suspended@business.com",
    businessName: "Suspended Business",
    businessType: "corporate",
    status: "suspended",
    createdAt: "2024-12-20",
    displayCount: 2,
  },
]

export function AdminDashboard() {
  const [clients, setClients] = useState(mockClients)
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "active" | "suspended">("all")

  const stats = [
    {
      label: "Total Clients",
      value: clients.length,
      icon: Users,
      color: "orange",
    },
    {
      label: "Active Clients",
      value: clients.filter((c) => c.status === "active").length,
      icon: TrendingUp,
      color: "cyan",
    },
    {
      label: "Pending Approval",
      value: clients.filter((c) => c.status === "pending").length,
      icon: BarChart3,
      color: "yellow",
    },
    {
      label: "Total Displays",
      value: clients.reduce((sum, c) => sum + c.displayCount, 0),
      icon: Monitor,
      color: "orange",
    },
  ]

  const filteredClients = filterStatus === "all" ? clients : clients.filter((c) => c.status === filterStatus)

  const handleApprove = async (clientId: string) => {
    try {
      await fetch(`/api/admin/clients/${clientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active" }),
      })
      setClients(clients.map((c) => (c.id === clientId ? { ...c, status: "active" as const } : c)))
    } catch {
      alert("Failed to approve client")
    }
  }

  const handleSuspend = async (clientId: string) => {
    try {
      await fetch(`/api/admin/clients/${clientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "suspended" }),
      })
      setClients(clients.map((c) => (c.id === clientId ? { ...c, status: "suspended" as const } : c)))
    } catch {
      alert("Failed to suspend client")
    }
  }

  const handleDelete = async (clientId: string) => {
    if (!confirm("Are you sure you want to delete this client? This action cannot be undone.")) {
      return
    }
    try {
      await fetch(`/api/admin/clients/${clientId}`, { method: "DELETE" })
      setClients(clients.filter((c) => c.id !== clientId))
    } catch {
      alert("Failed to delete client")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Admin Dashboard</h1>
            <p className="text-slate-400 text-sm">Manage clients and displays</p>
          </div>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-400">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            const colorMap = {
              orange: "bg-orange-500/10 text-orange-500",
              cyan: "bg-cyan-500/10 text-cyan-500",
              yellow: "bg-yellow-500/10 text-yellow-500",
            }
            return (
              <Card key={stat.label} className="bg-slate-800 border-slate-700">
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-50 mt-2">{stat.value}</p>
                  </div>
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${colorMap[stat.color as keyof typeof colorMap]}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Clients Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-50 mb-4">Manage Clients</h2>
            <div className="flex gap-2 mb-4">
              {["all", "pending", "active", "suspended"].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus(status as any)}
                  className={
                    filterStatus === status
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : "border-slate-700 text-slate-400 hover:text-slate-50"
                  }
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <ClientTable
            clients={filteredClients}
            onApprove={handleApprove}
            onSuspend={handleSuspend}
            onDelete={handleDelete}
          />
        </div>
      </main>
    </div>
  )
}
