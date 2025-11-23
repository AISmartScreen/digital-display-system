"use client"

import type React from "react"

import { useAuth } from "@/providers/auth-provider"
import { redirect } from "next/navigation"
import { LoadingSpinner } from "./loading-spinner"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "super_admin" | "client_admin"
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    redirect("/login")
  }

  if (requiredRole && user?.role !== requiredRole) {
    redirect("/dashboard")
  }

  return <>{children}</>
}
