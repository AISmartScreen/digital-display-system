import { Card } from "@/components/ui/card"

interface MetricCardProps {
  label: string
  value: string
  trend: string
  icon: string
}

export function MetricCard({ label, value, trend, icon }: MetricCardProps) {
  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground mt-2">{trend}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </Card>
  )
}
