"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle, Mail } from "lucide-react"

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl border-border/50 text-center">
        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-accent-foreground" />
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-2">Check Your Email</h1>
        <p className="text-muted-foreground mb-6">
          We've sent a verification link to your email. Click the link to verify your account.
        </p>

        <div className="bg-secondary p-4 rounded-lg mb-6 flex items-center justify-center gap-3">
          <Mail className="w-5 h-5 text-primary" />
          <p className="text-sm font-medium text-foreground">Verification email sent</p>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          If you don't see the email in a few minutes, check your spam folder.
        </p>

        <Link href="/login">
          <Button className="w-full">Back to Login</Button>
        </Link>
      </Card>
    </div>
  )
}
