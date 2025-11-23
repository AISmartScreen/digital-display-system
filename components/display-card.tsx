"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, Eye, Trash2, MoreVertical } from "lucide-react"
import Link from "next/link"

interface Display {
  id: number
  name: string
  template: string
  status: "active" | "offline"
  lastHeartbeat: string
}

interface DisplayCardProps {
  display: Display
  viewMode: "grid" | "list"
}

export function DisplayCard({ display, viewMode }: DisplayCardProps) {
  if (viewMode === "list") {
    return (
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground">{display.name}</h3>
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  display.status === "active" ? "bg-green-500" : "bg-red-500"
                }`}
              ></span>
            </div>
            <p className="text-sm text-muted-foreground">
              {display.template} • Last sync: {display.lastHeartbeat}
            </p>
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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
        <span className="text-5xl">📺</span>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-foreground line-clamp-2">{display.name}</h3>
          <span
            className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ml-2 ${
              display.status === "active"
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
            }`}
          >
            {display.status === "active" ? "🟢 Active" : "🔴 Offline"}
          </span>
        </div>

        <p className="text-sm text-muted-foreground mb-4">{display.template}</p>
        <p className="text-xs text-muted-foreground mb-4 flex-1">Last sync: {display.lastHeartbeat}</p>

        <div className="flex gap-2 pt-4 border-t border-border">
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
