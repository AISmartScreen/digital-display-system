"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

interface Template {
  id: string
  name: string
  category: string
  description: string
  preview: string
}

interface TemplateSelectorProps {
  template: Template
  isSelected: boolean
  onSelect: () => void
}

export function TemplateSelector({ template, isSelected, onSelect }: TemplateSelectorProps) {
  return (
    <Card
      onClick={onSelect}
      className={`overflow-hidden cursor-pointer transition-all ${
        isSelected ? "ring-2 ring-primary border-primary" : "hover:shadow-lg"
      }`}
    >
      <div className="relative h-40 bg-gradient-to-br from-secondary to-secondary/50">
        <img src={template.preview || "/placeholder.svg"} alt={template.name} className="w-full h-full object-cover" />
        {isSelected && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-accent" />
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs font-medium text-primary mb-1">{template.category}</p>
        <h3 className="font-semibold text-foreground mb-2">{template.name}</h3>
        <p className="text-sm text-muted-foreground">{template.description}</p>
      </div>
    </Card>
  )
}
