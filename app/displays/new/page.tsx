"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import { TopBar } from "@/components/top-bar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { TemplateSelector } from "@/components/template-selector"
import { QRCodeComponent } from "@/components/qr-code"
import { CheckCircle } from "lucide-react"

const templates = [
  {
    id: "masjid-classic",
    name: "Classic Masjid",
    category: "Masjid",
    description: "Prayer times with Islamic decoration and countdown timer",
    preview: "/masjid-prayer-times-display-elegant.jpg",
  },
  {
    id: "hospital-modern",
    name: "Modern Hospital",
    category: "Hospital",
    description: "Doctor schedule with emergency alerts and announcements",
    preview: "/hospital-schedule-display-clean.jpg",
  },
  {
    id: "corporate-dashboard",
    name: "Professional Dashboard",
    category: "Corporate",
    description: "Meeting rooms, KPIs, and company announcements",
    preview: "/corporate-dashboard-display-professional.jpg",
  },
]

type CreateStep = "info" | "template" | "success"

export default function NewDisplayPage() {
  const router = useRouter()
  const [step, setStep] = useState<CreateStep>("info")
  const [displayName, setDisplayName] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [displayId, setDisplayId] = useState("")
  const [deviceToken, setDeviceToken] = useState("")

  const handleCreateDisplay = () => {
    if (!displayName || !selectedTemplate) return

    // Generate mock display ID and device token
    const newDisplayId = `DSP-${Date.now()}`
    const token = `TOKEN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    setDisplayId(newDisplayId)
    setDeviceToken(token)
    setStep("success")
  }

  const handleGoToDashboard = () => {
    router.push("/displays")
  }

  if (step === "info") {
    return (
      <ProtectedRoute>
        <SidebarNavigation />
        <TopBar />

        <main className="md:ml-64 pt-20 pb-8 px-4 md:px-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-8">Create New Display</h1>

            <Card className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Display Name</label>
                <Input
                  placeholder="e.g., Main Prayer Times Display"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="text-base"
                />
                <p className="text-xs text-muted-foreground mt-1">Choose a memorable name for your display</p>
              </div>

              <Button onClick={() => setStep("template")} disabled={!displayName} className="w-full">
                Next: Choose Template
              </Button>
            </Card>
          </div>
        </main>
      </ProtectedRoute>
    )
  }

  if (step === "template") {
    return (
      <ProtectedRoute>
        <SidebarNavigation />
        <TopBar />

        <main className="md:ml-64 pt-20 pb-8 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-2">Select a Template</h1>
            <p className="text-muted-foreground mb-8">Choose the template that best fits your needs</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {templates.map((template) => (
                <TemplateSelector
                  key={template.id}
                  template={template}
                  isSelected={selectedTemplate === template.id}
                  onSelect={() => setSelectedTemplate(template.id)}
                />
              ))}
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep("info")} className="flex-1">
                Back
              </Button>
              <Button onClick={handleCreateDisplay} disabled={!selectedTemplate} className="flex-1">
                Create Display
              </Button>
            </div>
          </div>
        </main>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <SidebarNavigation />
      <TopBar />

      <main className="md:ml-64 pt-20 pb-8 px-4 md:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-accent-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Display Created Successfully!</h1>
            <p className="text-muted-foreground mt-2">Your display is ready to be linked to a device</p>
          </div>

          <Card className="p-8 space-y-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-secondary p-6 rounded-lg">
                <p className="text-xs font-medium text-muted-foreground mb-2">Display Name</p>
                <p className="text-lg font-semibold text-foreground">{displayName}</p>
              </div>
              <div className="bg-secondary p-6 rounded-lg">
                <p className="text-xs font-medium text-muted-foreground mb-2">Display ID</p>
                <p className="text-lg font-semibold text-foreground font-mono">{displayId}</p>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="font-semibold text-foreground mb-4">Link Your Device</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-3">1. Scan QR Code</p>
                  <div className="bg-white p-4 rounded-lg flex items-center justify-center">
                    <QRCodeComponent value={displayId} />
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-3">2. Or Enter Token</p>
                  <div className="bg-secondary p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">Device Token:</p>
                    <p className="font-mono text-sm text-foreground break-all">{deviceToken}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3 bg-transparent"
                      onClick={() => navigator.clipboard.writeText(deviceToken)}
                    >
                      Copy Token
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => router.push("/displays")} className="flex-1">
              View All Displays
            </Button>
            <Button onClick={() => router.push(`/displays/${displayId}/customize`)} className="flex-1">
              Customize Display
            </Button>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
