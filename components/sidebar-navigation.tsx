"use client"

import { useAuth } from "@/providers/auth-provider"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Zap, Lightbulb, Gauge, BarChart3, Users, LogOut, Menu } from "lucide-react"
import { useState } from "react"

const clientNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/devices", label: "All Devices", icon: Lightbulb },
  { href: "/energy", label: "Energy Monitor", icon: Zap },
  { href: "/automation", label: "Automations", icon: Gauge },
]

const adminNavItems = [
  { href: "/admin/dashboard", label: "System", icon: BarChart3 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/devices", label: "All Devices", icon: Lightbulb },
]

export function SidebarNavigation() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = user?.role === "super_admin" ? adminNavItems : clientNavItems

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 hover:bg-sidebar-accent rounded-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-sidebar-primary">
              <Home className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-sidebar-foreground">Smart Home Hub</h1>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "hover:bg-sidebar-accent text-sidebar-foreground"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
          <div className="mb-4 p-3 rounded-lg bg-sidebar-accent/50">
            <p className="text-sm font-medium text-sidebar-foreground">{user?.business_name}</p>
            <p className="text-xs text-sidebar-foreground/60">{user?.email}</p>
          </div>
          <Button
            onClick={() => {
              logout()
              setIsOpen(false)
            }}
            variant="outline"
            className="w-full justify-start gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
