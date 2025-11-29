"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Tv } from "lucide-react"

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [businessType, setBusinessType] = useState("")

  const businessTypes = [
    { id: "masjid", name: "Masjid", description: "Prayer times & announcements", icon: "🕌" },
    { id: "hospital", name: "Hospital", description: "Doctor schedules & services", icon: "🏥" },
    { id: "corporate", name: "Corporate", description: "Meetings & KPIs", icon: "🏢" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8 flex items-center gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= i ? "bg-orange-500 text-white" : "bg-slate-700 text-slate-400"
                }`}
              >
                {step > i ? <CheckCircle2 className="w-4 h-4" /> : i}
              </div>
              {i < 3 && <div className={`flex-1 h-1 rounded ${step > i ? "bg-orange-500" : "bg-slate-700"}`} />}
            </div>
          ))}
        </div>

        {/* Content */}
        {step === 1 && (
          <Card className="bg-slate-800 border-slate-700 p-8 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-50 mb-2">Welcome!</h1>
              <p className="text-slate-400">Let's set up your display management system</p>
            </div>

            <div>
              <Label className="text-slate-300 text-lg mb-4 block">What type of business are you?</Label>
              <div className="grid grid-cols-1 gap-3">
                {businessTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setBusinessType(type.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      businessType === type.id
                        ? "border-orange-500 bg-orange-500/10"
                        : "border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{type.icon}</span>
                      <div>
                        <p className="font-semibold text-slate-50">{type.name}</p>
                        <p className="text-sm text-slate-400">{type.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={() => setStep(2)}
              disabled={!businessType}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50"
            >
              Continue
            </Button>
          </Card>
        )}

        {step === 2 && (
          <Card className="bg-slate-800 border-slate-700 p-8 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-50 mb-2">Business Details</h1>
              <p className="text-slate-400">Tell us more about your business</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-slate-300">Business Name</Label>
                <Input placeholder="Your business name" className="mt-2 bg-slate-900 border-slate-700 text-slate-50" />
              </div>

              <div>
                <Label className="text-slate-300">Contact Email</Label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  className="mt-2 bg-slate-900 border-slate-700 text-slate-50"
                />
              </div>

              <div>
                <Label className="text-slate-300">Phone Number</Label>
                <Input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="mt-2 bg-slate-900 border-slate-700 text-slate-50"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setStep(1)} variant="outline" className="flex-1 border-slate-700">
                Back
              </Button>
              <Button onClick={() => setStep(3)} className="flex-1 bg-orange-500 hover:bg-orange-600">
                Continue
              </Button>
            </div>
          </Card>
        )}

        {step === 3 && (
          <Card className="bg-slate-800 border-slate-700 p-8 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-50 mb-2">Create Your First Display</h1>
              <p className="text-slate-400">Set up your initial display configuration</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-slate-300">Display Name</Label>
                <Input
                  placeholder="e.g., Main Hall, Emergency Room, Lobby"
                  className="mt-2 bg-slate-900 border-slate-700 text-slate-50"
                />
              </div>

              <div>
                <Label className="text-slate-300">Location/Description</Label>
                <Input
                  placeholder="Where will this display be located?"
                  className="mt-2 bg-slate-900 border-slate-700 text-slate-50"
                />
              </div>

              <div className="bg-slate-900 rounded p-4 text-center">
                <Tv className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">Display will use your selected template type</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setStep(2)} variant="outline" className="flex-1 border-slate-700">
                Back
              </Button>
              <Button
                onClick={() => (window.location.href = "/dashboard")}
                className="flex-1 bg-orange-500 hover:bg-orange-600"
              >
                Complete Setup
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
