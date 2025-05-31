"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle2, Heart, ImageIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface SweetMomentProps {
  grievanceId: string
  onSuccess?: () => void
}

export function SweetMoment({ grievanceId, onSuccess }: SweetMomentProps) {
  const [text, setText] = useState("")
  const [imageUrl, setImageUrl] = useState("/placeholder.svg?height=200&width=300&text=Happy+Memory")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const handleSubmit = async () => {
    if (!text.trim()) {
      setSubmitError("Please enter a sweet memory")
      return
    }

    try {
      setIsSubmitting(true)
      setSubmitError("")

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSubmitSuccess(true)
      if (onSuccess) onSuccess()

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Error submitting sweet moment:", error)
      setSubmitError("Failed to submit sweet moment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Simulate file upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, this would upload to a server
      // For this demo, we'll just use a placeholder
      setImageUrl("/placeholder.svg?height=200&width=300&text=Uploaded+Image")
    }
  }

  return (
    <Card className="border-pink-200 shadow-md">
      <CardHeader className="bg-pink-50">
        <div className="flex items-center space-x-2">
          <Heart className="h-5 w-5 text-pink-600" />
          <CardTitle className="text-pink-700">Sweet Moments Wall</CardTitle>
        </div>
        <CardDescription>Share a happy memory to celebrate resolving this grievance</CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="sweet-memory">Your Happy Memory</Label>
          <Textarea
            id="sweet-memory"
            placeholder="Share a sweet moment or memory..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[100px] border-pink-200 focus:border-pink-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="memory-image">Add a Photo (Optional)</Label>
          <div className="flex items-center space-x-4">
            <div className="relative h-20 w-20 bg-pink-100 rounded-md flex items-center justify-center overflow-hidden">
              {imageUrl ? (
                <img src={imageUrl || "/placeholder.svg"} alt="Memory" className="h-full w-full object-cover" />
              ) : (
                <ImageIcon className="h-8 w-8 text-pink-500" />
              )}
            </div>
            <div className="flex-1">
              <Input
                id="memory-image"
                type="file"
                accept="image/*"
                className="border-pink-200"
                onChange={handleImageChange}
              />
            </div>
          </div>
        </div>

        {submitSuccess && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Sweet Moment Added</AlertTitle>
            <AlertDescription className="text-green-700">
              Your happy memory has been added to the wall!
            </AlertDescription>
          </Alert>
        )}

        {submitError && (
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Error</AlertTitle>
            <AlertDescription className="text-red-700">{submitError}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !text.trim()}
          className="w-full bg-pink-500 hover:bg-pink-600"
        >
          {isSubmitting ? "Saving..." : "Add to Sweet Moments Wall"}
        </Button>
      </CardFooter>
    </Card>
  )
}
