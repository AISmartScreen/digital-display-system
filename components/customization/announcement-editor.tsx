"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X } from "lucide-react"

interface Announcement {
  text: string
  duration: number
}

interface AnnouncementEditorProps {
  announcements: Announcement[]
  onChange: (announcements: Announcement[]) => void
}

export function AnnouncementEditor({ announcements, onChange }: AnnouncementEditorProps) {
  return (
    <div className="mt-4 pt-4 border-t border-border">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-foreground">Announcements</h4>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onChange([...announcements, { text: "", duration: 5 }])}
          className="gap-1"
        >
          <Plus className="w-3 h-3" />
          Add
        </Button>
      </div>

      <div className="space-y-3">
        {announcements.map((announcement, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder="Announcement text"
              value={announcement.text}
              onChange={(e) => {
                const updated = [...announcements]
                updated[index].text = e.target.value
                onChange(updated)
              }}
              maxLength={500}
              className="flex-1"
            />
            <Input
              type="number"
              min="1"
              max="60"
              placeholder="Duration (s)"
              value={announcement.duration}
              onChange={(e) => {
                const updated = [...announcements]
                updated[index].duration = Number.parseInt(e.target.value)
                onChange(updated)
              }}
              className="w-20"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => onChange(announcements.filter((_, i) => i !== index))}
              className="text-destructive"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
