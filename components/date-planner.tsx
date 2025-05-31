"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { dateIdeas, getRandomItem } from "@/lib/utils-features"
import { Calendar, Heart, RefreshCw } from "lucide-react"

export function DatePlanner() {
  const [dateIdea, setDateIdea] = useState(getRandomItem(dateIdeas))
  const [isGenerating, setIsGenerating] = useState(false)

  const generateNewIdea = () => {
    setIsGenerating(true)

    // Simulate API call
    setTimeout(() => {
      let newIdea = getRandomItem(dateIdeas)
      // Make sure we don't get the same idea twice
      while (newIdea === dateIdea) {
        newIdea = getRandomItem(dateIdeas)
      }
      setDateIdea(newIdea)
      setIsGenerating(false)
    }, 500)
  }

  return (
    <Card className="border-pink-200 shadow-md">
      <CardHeader className="bg-pink-50">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-pink-600" />
          <CardTitle className="text-pink-700">Date Planner</CardTitle>
        </div>
        <CardDescription>Peace offering date ideas after resolving grievances</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 pb-4 text-center">
        <div className="bg-pink-100 rounded-lg p-6 mb-4">
          <Heart className="h-10 w-10 text-pink-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-pink-700 mb-2">Date Idea</h3>
          <p className="text-gray-700">{dateIdea}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          onClick={generateNewIdea}
          disabled={isGenerating}
          className="bg-pink-500 hover:bg-pink-600 flex items-center"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
          {isGenerating ? "Generating..." : "Get Another Idea"}
        </Button>
      </CardFooter>
    </Card>
  )
}
