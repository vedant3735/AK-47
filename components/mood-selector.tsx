"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getThemeByMood } from "@/lib/utils-features"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"

interface MoodSelectorProps {
  onMoodSelect: (mood: string) => void
  currentMood?: string
  username?: string
}

export function MoodSelector({ onMoodSelect, currentMood, username }: MoodSelectorProps) {
  const [selectedMood, setSelectedMood] = useState<string>(currentMood || "neutral")
  const [showMeme, setShowMeme] = useState(false)
  const { user } = useAuth()
  const isSubmitter = user?.role === "submitter"
  const isViewer = user?.role === "viewer"

  useEffect(() => {
    // Load mood from API on initial render
    const fetchCurrentMood = async () => {
      try {
        const response = await fetch("/api/mood")
        if (response.ok) {
          const data = await response.json()
          setSelectedMood(data.mood || "neutral")
          onMoodSelect(data.mood || "neutral")
        }
      } catch (error) {
        console.error("Error fetching mood:", error)
      }
    }

    fetchCurrentMood()

    // Set up polling to check for mood updates
    const intervalId = setInterval(fetchCurrentMood, 10000) // Check every 10 seconds

    return () => clearInterval(intervalId)
  }, [onMoodSelect])

  const moods = [
    { name: "angry", emoji: "😡", label: "Angry" },
    { name: "sad", emoji: "😔", label: "Sad" },
    { name: "neutral", emoji: "😐", label: "Neutral" },
    { name: "happy", emoji: "😊", label: "Happy" },
    { name: "loving", emoji: "🥰", label: "Loving" },
  ]

  const handleMoodSelect = async (mood: string) => {
    if (!isSubmitter) return // Only submitter can change mood

    setSelectedMood(mood)
    onMoodSelect(mood)

    // Save mood to API
    try {
      await fetch("/api/mood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mood }),
      })
    } catch (error) {
      console.error("Error saving mood:", error)
    }

    setShowMeme(true)
    setTimeout(() => setShowMeme(false), 5000)
  }

  const theme = getThemeByMood(selectedMood)

  return (
    <Card className={`${theme.border} shadow-md`}>
      <CardHeader className={`${theme.primary}`}>
        <CardTitle className={`${theme.text}`}>
          {isViewer ? `${username || "Submitter"}'s Current Mood` : "How are you feeling today?"}
        </CardTitle>
        <CardDescription>{isViewer ? "Monitor your partner's mood" : "Select your current mood"}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex justify-between items-center mb-6">
          {moods.map((mood) => (
            <Button
              key={mood.name}
              variant={selectedMood === mood.name ? "default" : "outline"}
              className={`flex flex-col items-center p-2 h-auto ${
                selectedMood === mood.name ? theme.button : "hover:bg-gray-100"
              }`}
              onClick={() => handleMoodSelect(mood.name)}
              disabled={!isSubmitter}
            >
              <span className="text-2xl mb-1">{mood.emoji}</span>
              <span className="text-xs">{mood.label}</span>
            </Button>
          ))}
        </div>

        {showMeme && (
          <div className="mt-4 text-center">
            <p className={`${theme.text} mb-2 font-medium`}>{theme.message}</p>
            <div className="relative h-[200px] w-full max-w-[300px] mx-auto">
              <Image
                src={theme.meme || "/placeholder.svg"}
                alt="Mood meme"
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 300px) 100vw, 300px"
              />
            </div>
          </div>
        )}

        {isViewer && (
          <div className="mt-4 text-center">
            <p className={`${theme.text} font-medium`}>
              {selectedMood === "angry" && "They seem upset. Maybe give them some space or talk it through?"}
              {selectedMood === "sad" && "They're feeling down. A kind word might help."}
              {selectedMood === "neutral" && "They're feeling okay. Business as usual."}
              {selectedMood === "happy" && "They're in a good mood! Great time to connect."}
              {selectedMood === "loving" && "They're feeling affectionate. Perfect time for quality time together!"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
