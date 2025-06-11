"use client"

import type React from "react"
import Image from "next/image" // Added Image import
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Lock, Eye, EyeOff } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const CORRECT_PASSWORD = "Carlos1" // Keep this or update if needed

  useEffect(() => {
    const authStatus = sessionStorage.getItem("scc-auth") // Changed key
    if (authStatus === "authenticated") {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem("scc-auth", "authenticated") // Changed key
    } else {
      setError("Incorrect password. Please try again.")
      setPassword("")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem("scc-auth") // Changed key
    setPassword("")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-300"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-2xl">
          <div className="flex flex-col space-y-1.5 p-6 text-center">
            <div className="mx-auto mb-4">
              <Image
                src="/scc-logo-white.png"
                alt="Supply Chain Companions Logo"
                width={180} // Standard logo size for login
                height={45}
                className="bg-slate-800 p-3 rounded-md" // Dark patch for white logo
                priority
              />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">Strategic Cockpit</CardTitle>
            <CardDescription className="text-slate-600">
              Secure access required to view Sandvik Group's confidential supply chain data.
            </CardDescription>
          </div>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">
                  Access Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter access password"
                    className="pr-10 border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-400" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="bg-red-100 border-red-400 text-red-700">
                  <Lock className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-slate-700 hover:bg-slate-800 text-white">
                <Shield className="h-4 w-4 mr-2" />
                Access Cockpit
              </Button>
            </form>

            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h4 className="font-semibold text-sm text-slate-700 mb-2">Cockpit Features:</h4>
              <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                <li>Global supply chain overview and analytics</li>
                <li>Manufacturing footprint analysis</li>
                <li>Critical materials risk assessment</li>
                <li>Logistics and tariff impact modeling</li>
                <li>AI-powered scenario simulations</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Logout Button */}
      <div className="absolute top-4 right-4 z-50">
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="bg-white/80 backdrop-blur-sm hover:bg-white text-slate-700 border-slate-300 hover:border-slate-400"
        >
          <Lock className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
      {children}
    </div>
  )
}
