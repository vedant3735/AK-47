"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle2, Lock, Clock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function SecretConfession() {
  const [confession, setConfession] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const handleSubmit = async () => {
    if (!confession.trim()) {
      setSubmitError("Please enter your confession")
      return
    }

    try {
      setIsSubmitting(true)
      setSubmitError("")

      const response = await fetch("/api/confessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: confession }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit confession")
      }

      setConfession("")
      setSubmitSuccess(true)

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Error submitting confession:", error)
      setSubmitError("Failed to submit confession. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-pink-200 shadow-md">
      <CardHeader className="bg-pink-50">
        <div className="flex items-center space-x-2">
          <Lock className="h-5 w-5 text-pink-600" />
          <CardTitle className="text-pink-700">Secret Confession Box</CardTitle>
        </div>
        <CardDescription className="flex items-center gap-1">
          <span>Share your light-hearted confessions anonymously</span>
          <Clock className="h-3 w-3 text-pink-600" />
          <span className="text-pink-600 font-medium">Expires after 48 hours</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <Textarea
          placeholder="I finished your fries but acted surprised..."
          value={confession}
          onChange={(e) => setConfession(e.target.value)}
          className="min-h-[100px] border-pink-200 focus:border-pink-400"
        />

        {submitSuccess && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Confession Received</AlertTitle>
            <AlertDescription className="text-green-700">
              Your secret is safe with us! It will automatically be deleted after 48 hours.
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
          disabled={isSubmitting || !confession.trim()}
          className="w-full bg-pink-500 hover:bg-pink-600"
        >
          {isSubmitting ? "Confessing..." : "Confess Anonymously"}
        </Button>
      </CardFooter>
    </Card>
  )
}
