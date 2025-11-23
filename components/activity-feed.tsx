import { Card } from "@/components/ui/card"

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
        return "🔴"
      case "save":
        return "💾"
      case "update":
        return "📝"
      case "sync":
        return "✅"
      default:
        return "📌"
    }
  }

  return (
    <Card className="p-6 h-full">
      <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-3 pb-3 border-b border-border last:border-0">
            <span className="text-lg">{getIcon(activity.type)}</span>
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
