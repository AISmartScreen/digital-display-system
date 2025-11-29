import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/src/components/layout/Sidebar"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Display Manager - Digital Signage Platform",
  description: "Create and manage digital display screens for your business",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="bg-gray-950 text-gray-50 antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <div className="flex">
            <Sidebar />
            <main className="flex-1 ml-16 sm:ml-20">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
