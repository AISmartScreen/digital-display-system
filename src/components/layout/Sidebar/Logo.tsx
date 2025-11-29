import { Monitor } from "lucide-react"

export function Logo() {
  return (
    <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex-shrink-0 mb-8">
      <Monitor className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={1.5} />
    </div>
  )
}
