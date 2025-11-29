import { Card } from "@/components/ui/card"
import { PowerOff, Save, RefreshCw, CheckCircle2 } from "lucide-react"

interface Activity {
  id: number
  action: string
  time: string
  type: "offline" | "save" | "update" | "sync"
}

interface ActivityFeedProps {
  activities: Activity[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "offline":
        return <PowerOff className="w-4 h-4 text-destructive" />
      case "save":
        return <Save className="w-4 h-4 text-accent" />
      case "update":
        return <RefreshCw className="w-4 h-4 text-muted-foreground" />
      case "sync":
        return <CheckCircle2 className="w-4 h-4 text-accent" />
      default:
        return <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
    }
  }

  return (
    <Card className="p-6 h-full border-border/50">
      <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-3 pb-3 border-b border-border/30 last:border-0">
            <div className="mt-0.5">{getIcon(activity.type)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{activity.action}</p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
