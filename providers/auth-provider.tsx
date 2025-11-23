"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface User {
  id: string
  email: string
  business_name: string
  business_type: "masjid" | "hospital" | "corporate"
  role: "super_admin" | "client_admin"
  verified: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, businessName: string, businessType: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (err) {
        console.error("Failed to parse stored user:", err)
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Mock API call
      const mockUser: User = {
        id: "1",
        email,
        business_name: "Al-Noor Masjid",
        business_type: "masjid",
        role: "client_admin",
        verified: true,
      }
      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string, businessName: string, businessType: string) => {
    setLoading(true)
    try {
      // Mock API call
      const newUser: User = {
        id: Date.now().toString(),
        email,
        business_name: businessName,
        business_type: businessType as "masjid" | "hospital" | "corporate",
        role: "client_admin",
        verified: false,
      }
      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
