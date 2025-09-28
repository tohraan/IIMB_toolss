"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Store user session in localStorage for temporary auth
    localStorage.setItem(
      "user",
      JSON.stringify({
        username,
        loggedIn: true,
        loginTime: Date.now(),
      }),
    )

    setLoading(false)
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Tools Platform</h1>
          <p className="text-muted-foreground text-sm">Your comprehensive toolkit for modern productivity</p>
        </div>

        <Card className="shadow-lg border-border/50">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl font-semibold">Welcome Back</CardTitle>
            <CardDescription className="text-sm">Enter any username and password to continue</CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter any username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter any password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
                  required
                />
              </div>
              <Button type="submit" className="w-full h-11 font-medium" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-border/50 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground mb-3">Access 20+ AI tools across 4 categories</p>
          <div className="flex justify-center gap-4 text-xs text-muted-foreground">
            <span>Cloud Dev</span>
            <span>•</span>
            <span>Marketing</span>
            <span>•</span>
            <span>Productivity</span>
            <span>•</span>
            <span>AI General</span>
          </div>
        </div>
      </div>
    </div>
  )
}
