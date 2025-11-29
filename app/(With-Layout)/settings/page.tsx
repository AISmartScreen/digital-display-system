"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Bell, Shield, Palette, Eye } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-50">Settings</h1>
          <p className="text-slate-400 mt-2">Manage your account and preferences</p>
        </div>

        {/* Account Section */}
        <Card className="bg-slate-800 border-slate-700">
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-50 flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-orange-500" />
                Account Settings
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-slate-300">Business Name</Label>
                <Input
                  placeholder="Your business name"
                  className="mt-2 bg-slate-900 border-slate-700 text-slate-50 placeholder:text-slate-500"
                />
              </div>

              <div>
                <Label className="text-slate-300">Email</Label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  className="mt-2 bg-slate-900 border-slate-700 text-slate-50 placeholder:text-slate-500"
                />
              </div>

              <div>
                <Label className="text-slate-300">Business Type</Label>
                <div className="mt-2 flex gap-3">
                  {["Masjid", "Hospital", "Corporate"].map((type) => (
                    <Button
                      key={type}
                      variant="outline"
                      className="border-slate-700 text-slate-300 hover:bg-slate-700 bg-transparent"
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              <Button className="bg-orange-500 hover:bg-orange-600 w-full">Save Changes</Button>
            </div>
          </div>
        </Card>

        {/* Notifications Section */}
        <Card className="bg-slate-800 border-slate-700">
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-50 flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-orange-500" />
                Notifications
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded">
                <span className="text-slate-300">Display Status Alerts</span>
                <input type="checkbox" className="w-4 h-4 rounded" defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded">
                <span className="text-slate-300">Weekly Reports</span>
                <input type="checkbox" className="w-4 h-4 rounded" defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded">
                <span className="text-slate-300">Email Notifications</span>
                <input type="checkbox" className="w-4 h-4 rounded" />
              </div>
            </div>
          </div>
        </Card>

        {/* Display Preferences */}
        <Card className="bg-slate-800 border-slate-700">
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-50 flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-orange-500" />
                Display Preferences
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-slate-300">Auto-refresh Interval (hours)</Label>
                <Input
                  type="number"
                  placeholder="24"
                  defaultValue="24"
                  className="mt-2 bg-slate-900 border-slate-700 text-slate-50"
                />
              </div>

              <div>
                <Label className="text-slate-300">Default Preview Resolution</Label>
                <select className="w-full mt-2 px-3 py-2 bg-slate-900 border border-slate-700 rounded text-slate-50">
                  <option>1920x1080 (Full HD)</option>
                  <option>1280x720 (HD)</option>
                  <option>3840x2160 (4K)</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-red-500/5 border-red-500/20">
          <div className="p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-red-400 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Danger Zone
              </h2>
              <p className="text-sm text-slate-400 mt-2">Irreversible actions</p>
            </div>
            <Button variant="destructive" className="w-full">
              Delete Account
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
