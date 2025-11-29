"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, Eye, Trash2, MoreVertical, Lightbulb, Thermometer, Camera, Lock } from "lucide-react"
import Link from "next/link"

interface Device {
  id: number
  name: string
  template: string
  status: "active" | "offline"
  lastHeartbeat: string
}

interface DeviceCardProps {
  display: Device
  viewMode: "grid" | "list"
}

export function DisplayCard({ display, viewMode }: DeviceCardProps) {
  const getDeviceIcon = (template: string) => {
    switch (template.toLowerCase()) {
      case "masjid":
        return <Lightbulb className="w-8 h-8 text-accent" />
      case "hospital":
        return <Camera className="w-8 h-8 text-accent" />
      case "corporate":
        return <Thermometer className="w-8 h-8 text-accent" />
      default:
        return <Lock className="w-8 h-8 text-accent" />
    }
  }

  if (viewMode === "list") {
    return (
      <Card className="p-4 hover:shadow-md transition-shadow border-border/50">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            {getDeviceIcon(display.template)}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground">{display.name}</h3>
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    display.status === "active" ? "bg-accent" : "bg-muted-foreground"
                  }`}
                ></span>
              </div>
              <p className="text-sm text-muted-foreground">
                {display.template} • Last sync: {display.lastHeartbeat}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col border-border/50">
      <div className="h-24 bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
        {getDeviceIcon(display.template)}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-2 gap-2">
          <h3 className="font-semibold text-foreground line-clamp-2">{display.name}</h3>
          <span
            className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ml-auto ${
              display.status === "active" ? "bg-accent/20 text-accent" : "bg-muted/50 text-muted-foreground"
            }`}
          >
            {display.status === "active" ? "Active" : "Offline"}
          </span>
        </div>

        <p className="text-sm text-muted-foreground mb-1">{display.template}</p>
        <p className="text-xs text-muted-foreground mb-4 flex-1">Sync: {display.lastHeartbeat}</p>

        <div className="flex gap-2 pt-4 border-t border-border/30">
          <Link href={`/displays/${display.id}/customize`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full bg-transparent">
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </Link>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
