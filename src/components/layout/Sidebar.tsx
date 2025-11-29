"use client";

import {
  LayoutDashboard,
  Monitor,
  Image,
  PieChart,
  Users,
  Palette,
  Bell,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Monitor, label: "Displays", href: "/displays" },
  { icon: Image, label: "Media Library", href: "/media" },
  { icon: Palette, label: "Templates", href: "/templates" },
  { icon: Users, label: "Locations", href: "/locations" },
];

const bottomItems = [
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="fixed left-0 top-0 h-screen w-20 bg-gray-900 flex flex-col items-center py-8 overflow-y-auto scrollbar-hide">
      <Link
        href="/"
        className="mb-8 flex-shrink-0 hover:opacity-80 transition-opacity"
      >
        <div className=" border-pink-300 rounded-lg">
          <img
            src="/logo.png"
            alt="Display Manager Logo"
            className="w-12 h-12 object-contain"
          />
        </div>
      </Link>

      <div className="flex flex-col items-center space-y-6 flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <div className="flex flex-col items-center space-y-6">
          {navItems.map(({ icon: Icon, label, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                className={`w-12 h-12 flex items-center justify-center rounded-xl transition-colors flex-shrink-0 ${
                  isActive
                    ? "bg-pink-300 text-gray-900"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
                title={label}
              >
                <Icon size={20} strokeWidth={1.5} />
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col items-center space-y-6 mb-4 flex-shrink-0">
        {bottomItems.map(({ icon: Icon, label, href }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              className={`w-12 h-12 flex items-center justify-center rounded-xl transition-colors ${
                isActive
                  ? "bg-pink-300 text-gray-900"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`}
              title={label}
            >
              <Icon size={20} strokeWidth={1.5} />
            </Link>
          );
        })}
      </div>

      <Link
        href="/profile"
        className="relative w-16 h-16 rounded-full border-2 border-pink-300 flex-shrink-0 overflow-hidden bg-gray-800 hover:border-pink-200 transition-colors"
      >
        <img
          src="https://hebbkx1sfanhila5yf.public.blob.vercel-storage.com/photo-1494790108377-be9c29b29330-0ITDG9UYNBJygMOGBGIv4aR4Qj9VKY.jpeg"
          alt="User Profile"
          className="w-full h-full object-cover rounded-full"
          onError={(e) => {
            // Fallback if image fails to load
            e.currentTarget.style.display = "none";
            e.currentTarget.parentElement!.innerHTML =
              '<div class="w-full h-full bg-gray-700 rounded-full flex items-center justify-center text-white text-sm font-medium">SK</div>';
          }}
        />
      </Link>
    </nav>
  );
}
