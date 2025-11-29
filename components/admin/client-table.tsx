"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, X, AlertCircle } from "lucide-react"

interface Client {
  id: string
  email: string
  businessName: string
  businessType: string
  status: "pending" | "active" | "suspended"
  createdAt: string
  displayCount: number
}

interface ClientTableProps {
  clients: Client[]
  onApprove: (id: string) => void
  onSuspend: (id: string) => void
  onDelete: (id: string) => void
}

export function ClientTable({ clients, onApprove, onSuspend, onDelete }: ClientTableProps) {
  const [selectedClient, setSelectedClient] = useState<string | null>(null)

  const statusColors = {
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    active: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    suspended: "bg-red-500/10 text-red-400 border-red-500/20",
  }

  const businessIcons = {
    masjid: "🕌",
    hospital: "🏥",
    corporate: "🏢",
  }

  return (
    <div className="space-y-4">
      {clients.length === 0 ? (
        <Card className="bg-slate-800 border-slate-700 p-8 text-center">
          <p className="text-slate-400">No clients found</p>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Business</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Displays</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-50 font-medium">{client.businessName}</td>
                  <td className="px-6 py-4 text-sm text-slate-300 font-mono">{client.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="text-lg">
                      {businessIcons[client.businessType as keyof typeof businessIcons] || "📺"}
                    </span>{" "}
                    <span className="text-slate-300 capitalize">{client.businessType}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">{client.displayCount}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs border ${statusColors[client.status]}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {new Date(client.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      {client.status === "pending" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onApprove(client.id)}
                          className="text-cyan-400 hover:bg-cyan-500/10"
                          title="Approve"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      {client.status === "active" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onSuspend(client.id)}
                          className="text-orange-400 hover:bg-orange-500/10"
                          title="Suspend"
                        >
                          <AlertCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(client.id)}
                        className="text-red-400 hover:bg-red-500/10"
                        title="Delete"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
