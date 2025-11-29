"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import { TopBar } from "@/components/top-bar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, AlertCircle } from "lucide-react"

interface Plan {
  name: string
  price: number
  period: string
  description: string
  features: string[]
  current?: boolean
}

const plans: Plan[] = [
  {
    name: "Starter",
    price: 29,
    period: "/month",
    description: "Perfect for small homes",
    features: ["5 devices", "50 GB storage", "Email support", "Basic templates", "Monthly analytics"],
  },
  {
    name: "Professional",
    price: 79,
    period: "/month",
    description: "For growing smart homes",
    features: [
      "20 devices",
      "500 GB storage",
      "Priority support",
      "All templates",
      "Advanced analytics",
      "Custom branding",
      "API access",
    ],
    current: true,
  },
  {
    name: "Enterprise",
    price: 199,
    period: "/month",
    description: "For large installations",
    features: [
      "Unlimited devices",
      "Unlimited storage",
      "24/7 phone support",
      "All templates + custom",
      "Real-time analytics",
      "White-label solution",
      "API access",
      "Dedicated account manager",
    ],
  },
]

export default function SubscriptionPage() {
  return (
    <ProtectedRoute>
      <SidebarNavigation />
      <TopBar />

      <main className="md:ml-64 pt-20 pb-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground">Plans & Pricing</h1>
            <p className="text-muted-foreground mt-2 text-lg">Choose the right plan for your smart home</p>
          </div>

          {/* Current Plan Notice */}
          <Card className="p-4 mb-8 bg-accent/10 border border-accent/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-foreground">Current Plan: Professional</p>
                <p className="text-sm text-muted-foreground">Renews on July 15, 2024 • $79/month</p>
              </div>
            </div>
          </Card>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`p-6 flex flex-col transition-all border-border/50 ${
                  plan.current ? "ring-2 ring-accent shadow-lg" : "hover:shadow-lg"
                }`}
              >
                {plan.current && (
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-accent text-accent-foreground rounded-full text-xs font-semibold">
                      Current Plan
                    </span>
                  </div>
                )}

                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-5xl font-bold text-foreground">${plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-accent flex-shrink-0" />
                      <span className="text-foreground text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.current ? (
                  <Button variant="outline" disabled className="w-full bg-transparent">
                    Current Plan
                  </Button>
                ) : (
                  <Button className="w-full bg-accent hover:bg-accent/90">Upgrade to {plan.name}</Button>
                )}
              </Card>
            ))}
          </div>

          {/* Billing History */}
          <Card className="p-6 border-border/50">
            <h2 className="text-2xl font-bold text-foreground mb-4">Billing History</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Description</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      date: "2024-06-15",
                      description: "Professional Plan (Monthly)",
                      amount: "$79.00",
                      status: "Paid",
                    },
                    {
                      date: "2024-05-15",
                      description: "Professional Plan (Monthly)",
                      amount: "$79.00",
                      status: "Paid",
                    },
                    {
                      date: "2024-04-15",
                      description: "Professional Plan (Monthly)",
                      amount: "$79.00",
                      status: "Paid",
                    },
                    {
                      date: "2024-03-15",
                      description: "Professional Plan (Monthly)",
                      amount: "$79.00",
                      status: "Paid",
                    },
                  ].map((invoice, index) => (
                    <tr key={index} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                      <td className="py-3 px-4 text-foreground">{invoice.date}</td>
                      <td className="py-3 px-4 text-muted-foreground">{invoice.description}</td>
                      <td className="py-3 px-4 font-semibold text-foreground">{invoice.amount}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-medium">
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Button size="sm" variant="outline">
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </ProtectedRoute>
  )
}
