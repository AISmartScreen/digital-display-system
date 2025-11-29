"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { HelpCircle, MessageSquare, BookOpen, Mail } from "lucide-react"
import { useState } from "react"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const faqs = [
    {
      category: "Getting Started",
      items: [
        {
          q: "How do I create my first display?",
          a: "Navigate to Dashboard > Create Display, choose your business type, and fill in the configuration details.",
        },
        {
          q: "What display types are available?",
          a: "We offer three main types: Masjid (prayer times), Hospital (doctor schedules), and Corporate (meetings & KPIs).",
        },
      ],
    },
    {
      category: "Display Management",
      items: [
        {
          q: "How often do displays refresh?",
          a: "Displays auto-refresh every 24 hours by default. You can customize this in Settings.",
        },
        {
          q: "Can I edit a display after creation?",
          a: "Yes! Click Edit on any display to modify its configuration. Changes take effect immediately.",
        },
      ],
    },
    {
      category: "Media Upload",
      items: [
        {
          q: "What file formats are supported?",
          a: "We support JPG, PNG, GIF for images and MP4, WebM for videos.",
        },
        {
          q: "What is my storage limit?",
          a: "Storage limits depend on your plan. Check your Media page for current usage.",
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-50 flex items-center gap-3">
            <HelpCircle className="w-8 h-8 text-orange-500" />
            Help & Support
          </h1>
          <p className="text-slate-400 mt-2">Find answers to common questions</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Input
            placeholder="Search help topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-800 border-slate-700 text-slate-50 placeholder:text-slate-500 pl-10"
          />
          <BookOpen className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
        </div>

        {/* Quick Help Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-800 border-slate-700 p-6 cursor-pointer hover:border-orange-500/50 transition-colors">
            <MessageSquare className="w-6 h-6 text-orange-500 mb-3" />
            <h3 className="font-semibold text-slate-50 mb-2">Contact Support</h3>
            <p className="text-sm text-slate-400">Get help from our support team</p>
          </Card>
          <Card className="bg-slate-800 border-slate-700 p-6 cursor-pointer hover:border-orange-500/50 transition-colors">
            <BookOpen className="w-6 h-6 text-orange-500 mb-3" />
            <h3 className="font-semibold text-slate-50 mb-2">Documentation</h3>
            <p className="text-sm text-slate-400">Read detailed guides and tutorials</p>
          </Card>
          <Card className="bg-slate-800 border-slate-700 p-6 cursor-pointer hover:border-orange-500/50 transition-colors">
            <Mail className="w-6 h-6 text-orange-500 mb-3" />
            <h3 className="font-semibold text-slate-50 mb-2">Email Us</h3>
            <p className="text-sm text-slate-400">support@displayhub.com</p>
          </Card>
        </div>

        {/* FAQs */}
        <div className="space-y-6">
          {faqs.map((section) => (
            <div key={section.category}>
              <h2 className="text-lg font-semibold text-slate-50 mb-4">{section.category}</h2>
              <div className="space-y-3">
                {section.items.map((faq, idx) => (
                  <Card
                    key={idx}
                    className="bg-slate-800 border-slate-700 p-4 cursor-pointer hover:border-slate-600 transition-colors"
                  >
                    <p className="font-semibold text-slate-50 mb-2">{faq.q}</p>
                    <p className="text-sm text-slate-400">{faq.a}</p>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <Card className="bg-slate-800 border-slate-700 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-50">Didn't find what you need?</h2>
          <p className="text-slate-400">Send us a message and we'll get back to you shortly.</p>
          <Button className="bg-orange-500 hover:bg-orange-600 w-full">Contact Support</Button>
        </Card>
      </div>
    </div>
  )
}
