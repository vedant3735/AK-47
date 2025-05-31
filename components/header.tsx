"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

export function Header() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // Get emoji based on mood from localStorage
  const getMoodEmoji = () => {
    if (typeof window === "undefined") return "😐"

    const mood = localStorage.getItem("currentMood") || "neutral"
    switch (mood) {
      case "angry":
        return "😡"
      case "sad":
        return "😔"
      case "neutral":
        return "😐"
      case "happy":
        return "😊"
      case "loving":
        return "🥰"
      default:
        return "😐"
    }
  }

  return (
    <header className="bg-white border-b border-pink-200 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Heart className="h-6 w-6 text-pink-500" />
          <h1 className="text-xl font-bold text-pink-700">Grievance Portal</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-pink-600">
              Welcome, <span className="font-semibold">{user?.username}</span>
            </p>
            <Badge variant="outline" className="bg-pink-100 text-pink-700 border-pink-200">
              {user?.role === "submitter" ? "Submitter" : "Viewer"}
            </Badge>
            {user?.role === "submitter" && (
              <span className="text-xl" title="Current Mood">
                {getMoodEmoji()}
              </span>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-pink-300 text-pink-700 hover:bg-pink-100"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
