"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import { TopBar } from "@/components/top-bar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, CheckCircle, XCircle, Eye } from "lucide-react"
import { useState } from "react"

interface Client {
  id: string
  businessName: string
  email: string
  businessType: string
  status: "pending" | "active" | "suspended"
  displayCount: number
  subscriptionPlan: string
  registeredDate: string
}

const mockClients: Client[] = [
  {
    id: "1",
    businessName: "Al-Noor Masjid",
    email: "contact@alnoor.org",
    businessType: "Masjid",
    status: "active",
    displayCount: 8,
    subscriptionPlan: "Professional",
    registeredDate: "2024-01-15",
  },
  {
    id: "2",
    businessName: "City Hospital",
    email: "admin@cityhospital.com",
    businessType: "Hospital",
    status: "active",
    displayCount: 15,
    subscriptionPlan: "Enterprise",
    registeredDate: "2024-01-20",
  },
  {
    id: "3",
    businessName: "Tech Corp Inc",
    email: "dashboard@techcorp.com",
    businessType: "Corporate",
    status: "pending",
    displayCount: 0,
    subscriptionPlan: "Starter",
    registeredDate: "2024-06-05",
  },
  {
    id: "4",
    businessName: "Islamic Center",
    email: "info@islamiccenter.org",
    businessType: "Masjid",
    status: "active",
    displayCount: 6,
    subscriptionPlan: "Professional",
    registeredDate: "2024-02-10",
  },
  {
    id: "5",
    businessName: "Central Clinic",
    email: "admin@centralclinic.com",
    businessType: "Hospital",
    status: "suspended",
    displayCount: 5,
    subscriptionPlan: "Professional",
    registeredDate: "2024-03-01",
  },
]

export default function AdminClientsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "active" | "suspended">("all")
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [showApprovalModal, setShowApprovalModal] = useState(false)

  const filtered = mockClients.filter((client) => {
    const matchesSearch =
      client.businessName.toLowerCase().includes(search.toLowerCase()) ||
      client.email.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || client.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
      case "suspended":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
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
            <h1 className="text-4xl font-bold text-foreground">Manage Clients</h1>
            <p className="text-muted-foreground mt-2">Approve, manage, and monitor client accounts</p>
          </div>

          {/* Filter Bar */}
          <Card className="p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by business name or email..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                {(["all", "pending", "active", "suspended"] as const).map((status) => (
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

          {/* Clients Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Business</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Displays</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Plan</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Registered</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? (
                    filtered.map((client) => (
                      <tr key={client.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                        <td className="py-3 px-4 font-medium text-foreground">{client.businessName}</td>
                        <td className="py-3 px-4 text-muted-foreground text-sm">{client.email}</td>
                        <td className="py-3 px-4 text-muted-foreground">{client.businessType}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}
                          >
                            {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{client.displayCount}</td>
                        <td className="py-3 px-4 text-muted-foreground">{client.subscriptionPlan}</td>
                        <td className="py-3 px-4 text-muted-foreground text-sm">{client.registeredDate}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                              <Eye className="w-4 h-4" />
                              View
                            </Button>
                            {client.status === "pending" && (
                              <Button
                                size="sm"
                                className="gap-1 bg-green-600 hover:bg-green-700"
                                onClick={() => {
                                  setSelectedClient(client)
                                  setShowApprovalModal(true)
                                }}
                              >
                                <CheckCircle className="w-4 h-4" />
                                Approve
                              </Button>
                            )}
                            {client.status === "active" && (
                              <Button size="sm" variant="outline" className="gap-1 text-destructive bg-transparent">
                                <XCircle className="w-4 h-4" />
                                Suspend
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-muted-foreground">
                        No clients found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Approval Modal */}
          {showApprovalModal && selectedClient && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-md p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Approve Client</h2>
                <p className="text-muted-foreground mb-6">
                  Are you sure you want to approve{" "}
                  <span className="font-semibold text-foreground">{selectedClient.businessName}</span>? They will gain
                  immediate access to the platform.
                </p>

                <div className="bg-secondary p-4 rounded-lg mb-6 space-y-2">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Business</p>
                    <p className="text-foreground font-semibold">{selectedClient.businessName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Email</p>
                    <p className="text-foreground">{selectedClient.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Type</p>
                    <p className="text-foreground">{selectedClient.businessType}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setShowApprovalModal(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setShowApprovalModal(false)
                      setSelectedClient(null)
                    }}
                    className="flex-1"
                  >
                    Approve
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  )
}
