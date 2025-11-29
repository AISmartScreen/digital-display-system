import { LogOut, Settings } from "lucide-react"

export function UserProfile() {
  return (
    <div className="flex flex-col items-center gap-3 pt-6 border-t border-gray-700 w-full px-2">
      <button
        title="Settings"
        className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 transition-all duration-200"
      >
        <Settings size={20} className="sm:w-6 sm:h-6" strokeWidth={1.5} />
      </button>
      <button
        title="Logout"
        className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
      >
        <LogOut size={20} className="sm:w-6 sm:h-6" strokeWidth={1.5} />
      </button>
    </div>
  )
}
