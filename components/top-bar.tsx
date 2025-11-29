"use client"

import { useAuth } from "@/providers/auth-provider"
import { Bell, Settings, HelpCircle } from "lucide-react"

export function TopBar() {
  const { user } = useAuth()

  return (
    <div className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-card border-b border-border px-6 flex items-center justify-between z-30">
      <div className="hidden md:block">
        <h2 className="text-lg font-semibold">Control Center</h2>
        <p className="text-sm text-muted-foreground">{user?.business_name}</p>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
          <HelpCircle className="w-5 h-5 text-muted-foreground" />
        </button>
        <button className="p-2 hover:bg-secondary rounded-lg transition-colors relative">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
        </button>
        <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
          <Settings className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
    </div>
  )
}
