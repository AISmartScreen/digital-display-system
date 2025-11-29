"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Monitor,
  CheckCircle,
  XCircle,
  Search,
  MoreVertical,
  Plus,
  TrendingUp,
  AlertCircle,
  Settings,
  Eye,
  Trash2,
  Ban,
  UserCheck,
} from "lucide-react";

const mockStats = [
  {
    label: "Total Clients",
    value: "124",
    trend: "+12 this month",
    icon: Users,
    color: "text-blue-600",
  },
  {
    label: "Total Displays",
    value: "487",
    trend: "+34 this month",
    icon: Monitor,
    color: "text-purple-600",
  },
  {
    label: "Active Displays",
    value: "452",
    trend: "92.8% uptime",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    label: "Pending Approvals",
    value: "8",
    trend: "Requires action",
    icon: AlertCircle,
    color: "text-orange-600",
  },
];

const mockClients = [
  {
    id: 1,
    name: "Al-Noor Masjid",
    email: "admin@alnoor.com",
    businessType: "Masjid",
    displays: 5,
    status: "active",
    joinedDate: "Jan 15, 2025",
    lastActive: "2m ago",
  },
  {
    id: 2,
    name: "City General Hospital",
    email: "it@cityhospital.com",
    businessType: "Hospital",
    displays: 12,
    status: "active",
    joinedDate: "Dec 10, 2024",
    lastActive: "1h ago",
  },
  {
    id: 3,
    name: "TechCorp Solutions",
    email: "admin@techcorp.com",
    businessType: "Corporate",
    displays: 8,
    status: "suspended",
    joinedDate: "Nov 5, 2024",
    lastActive: "3d ago",
  },
  {
    id: 4,
    name: "Grand Masjid",
    email: "contact@grandmasjid.org",
    businessType: "Masjid",
    displays: 0,
    status: "pending",
    joinedDate: "Nov 28, 2025",
    lastActive: "Just now",
  },
];

const mockRecentActivity = [
  {
    action: 'New client registration: "Green Valley Hospital"',
    time: "5 minutes ago",
    type: "new",
  },
  {
    action: 'Client "Al-Noor Masjid" created 2 new displays',
    time: "1 hour ago",
    type: "update",
  },
  {
    action: 'Display offline alert: "TechCorp - Lobby"',
    time: "2 hours ago",
    type: "alert",
  },
  {
    action: 'Client approved: "Metro Clinic"',
    time: "3 hours ago",
    type: "approval",
  },
];

export default function SuperAdminPanel() {
  const [activeTab, setActiveTab] = useState("clients");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);

  const filteredClients = mockClients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
      case "suspended":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
      case "pending":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary" />
            Super Admin
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            System Management
          </p>
        </div>

        <nav className="space-y-2">
          {[
            { id: "dashboard", label: "Dashboard", icon: TrendingUp },
            { id: "clients", label: "Clients", icon: Users },
            { id: "displays", label: "All Displays", icon: Monitor },
            { id: "templates", label: "Templates", icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold text-foreground">
              {activeTab === "clients" && "Client Management"}
              {activeTab === "dashboard" && "System Overview"}
              {activeTab === "displays" && "All Displays"}
              {activeTab === "templates" && "Template Management"}
            </h2>
            <p className="text-muted-foreground mt-2">
              {activeTab === "clients" &&
                "Manage all client accounts and approvals"}
              {activeTab === "dashboard" &&
                "Monitor system performance and activity"}
            </p>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockStats.map((stat, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {stat.trend}
                      </p>
                    </div>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </Card>
              ))}
            </div>

            {/* Charts & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <Card className="lg:col-span-2 p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {mockRecentActivity.map((activity, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-secondary rounded-lg"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === "alert"
                            ? "bg-red-500"
                            : activity.type === "new"
                            ? "bg-blue-500"
                            : activity.type === "approval"
                            ? "bg-green-500"
                            : "bg-purple-500"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm text-foreground">
                          {activity.action}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Quick Stats */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Storage Used
                    </span>
                    <span className="text-sm font-semibold">
                      124 GB / 500 GB
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: "24.8%" }}
                    />
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    <span className="text-sm text-muted-foreground">
                      API Calls Today
                    </span>
                    <span className="text-sm font-semibold">45,234</span>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-muted-foreground">
                      Avg Response Time
                    </span>
                    <span className="text-sm font-semibold">124ms</span>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-muted-foreground">
                      System Uptime
                    </span>
                    <span className="text-sm font-semibold text-green-600">
                      99.97%
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Clients Tab */}
        {activeTab === "clients" && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search clients by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline">All Clients</Button>
                <Button variant="outline">
                  Pending (
                  {mockClients.filter((c) => c.status === "pending").length})
                </Button>
                <Button variant="outline">Active</Button>
              </div>
            </div>

            {/* Clients Table */}
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="text-left p-4 text-sm font-semibold text-foreground">
                        Client
                      </th>
                      <th className="text-left p-4 text-sm font-semibold text-foreground">
                        Business Type
                      </th>
                      <th className="text-left p-4 text-sm font-semibold text-foreground">
                        Displays
                      </th>
                      <th className="text-left p-4 text-sm font-semibold text-foreground">
                        Status
                      </th>
                      <th className="text-left p-4 text-sm font-semibold text-foreground">
                        Joined
                      </th>
                      <th className="text-left p-4 text-sm font-semibold text-foreground">
                        Last Active
                      </th>
                      <th className="text-left p-4 text-sm font-semibold text-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.map((client) => (
                      <tr
                        key={client.id}
                        className="border-t border-border hover:bg-secondary/50 transition-colors"
                      >
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-foreground">
                              {client.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {client.email}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline">{client.businessType}</Badge>
                        </td>
                        <td className="p-4">
                          <span className="font-medium text-foreground">
                            {client.displays}
                          </span>
                        </td>
                        <td className="p-4">
                          <Badge className={getStatusColor(client.status)}>
                            {client.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-muted-foreground">
                            {client.joinedDate}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-muted-foreground">
                            {client.lastActive}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {client.status === "pending" && (
                              <Button
                                size="sm"
                                variant="default"
                                className="gap-1"
                              >
                                <UserCheck className="w-4 h-4" />
                                Approve
                              </Button>
                            )}
                            {client.status === "active" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            )}
                            {client.status !== "pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1 text-orange-600"
                              >
                                <Ban className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1 text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Displays Tab */}
        {activeTab === "displays" && (
          <Card className="p-6">
            <p className="text-muted-foreground">
              All displays across all clients will be listed here with filtering
              and search capabilities.
            </p>
          </Card>
        )}

        {/* Templates Tab */}
        {activeTab === "templates" && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Create New Template
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["Masjid", "Hospital", "Corporate"].map((template) => (
                <Card
                  key={template}
                  className="p-6 hover:border-primary transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      {template} Template
                    </h3>
                    <Button size="sm" variant="outline">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Default template for {template.toLowerCase()} displays
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      Used by 45 displays
                    </span>
                    <Button size="sm" variant="link">
                      Edit
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
