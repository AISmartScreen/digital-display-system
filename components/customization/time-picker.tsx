"use client"

interface TimePickerProps {
  value: string
  onChange: (time: string) => void
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  return (
    <input
      type="time"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground"
    />
  )
}
