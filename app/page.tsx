"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth, getPasswordHint } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Heart } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showHint, setShowHint] = useState(false)
  const { user, login } = useAuth()
  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!username.trim()) {
      setError("Username is required")
      return
    }

    if (!password.trim()) {
      setError("Password is required")
      return
    }

    const success = login(username, password)

    if (success) {
      console.log("Login successful, redirecting...")
      router.push("/dashboard")
    } else {
      console.log("Login failed")
      setError("Invalid username or password")
    }
  }

  const passwordHint = username ? getPasswordHint(username) : ""

  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-50 p-4">
      <Card className="w-full max-w-md border-pink-200 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Heart className="h-12 w-12 text-pink-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-pink-700">Grievance Portal</CardTitle>
          <CardDescription>Enter your credentials to sign in</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  setError("")
                }}
                className="border-pink-200 focus:border-pink-400 focus:ring-pink-400"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Password</Label>
                {passwordHint && (
                  <button
                    type="button"
                    onClick={() => setShowHint(!showHint)}
                    className="text-xs text-pink-600 hover:text-pink-800"
                  >
                    {showHint ? "Hide hint" : "Show hint"}
                  </button>
                )}
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError("")
                }}
                className="border-pink-200 focus:border-pink-400 focus:ring-pink-400"
              />
              {showHint && passwordHint && <p className="text-xs text-pink-600 mt-1">Hint: {passwordHint}</p>}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600" onClick={handleSubmit}>
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-pink-600">Grievance Portal v1.0</p>
        </CardFooter>
      </Card>
    </div>
  )
}
