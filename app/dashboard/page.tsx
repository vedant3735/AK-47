"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { AlertCircle, CheckCircle2, Search, ImageIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { MoodSelector } from "@/components/mood-selector"
import { LoveCoupon } from "@/components/love-coupon"
import { EvidenceUpload } from "@/components/evidence-upload"
import { ApologyGenerator } from "@/components/apology-generator"
import { ResolutionWheel } from "@/components/resolution-wheel"
import { SweetMoment } from "@/components/sweet-moment"
import { MiniGame } from "@/components/mini-game"
import { DatePlanner } from "@/components/date-planner"

interface Grievance {
  _id: string
  username: string
  text: string
  severity: number
  status: "yet-to-approach" | "in-progress" | "resolved"
  mood?: string
  evidenceUrls?: string[]
  createdAt: string
  sweetMoment?: {
    text: string
    imageUrl?: string
  }
}

export default function Dashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [grievances, setGrievances] = useState<Grievance[]>([])
  const [inProgressGrievances, setInProgressGrievances] = useState<Grievance[]>([])
  const [text, setText] = useState("")
  const [severity, setSeverity] = useState(5)
  const [mood, setMood] = useState("neutral")
  const [evidenceUrls, setEvidenceUrls] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(false)
  const [showLoveCoupon, setShowLoveCoupon] = useState(false)
  const [showFeatures, setShowFeatures] = useState<Record<string, boolean>>({
    resolutionWheel: false,
    secretConfession: false,
    sweetMoment: false,
    miniGame: false,
    datePlanner: false,
    apologyGenerator: false,
  })
  const [selectedGrievanceId, setSelectedGrievanceId] = useState<string | null>(null)
  const [confessions, setConfessions] = useState<{ text: string; createdAt: string }[]>([])

  const isSubmitter = user?.role === "submitter"
  const isViewer = user?.role === "viewer"

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("grievancePortalUser")

      if (!storedUser) {
        router.push("/")
        return
      }

      // Fetch grievances based on role
      if (isViewer) {
        fetchAllGrievances()
        fetchConfessions()
      } else if (isSubmitter) {
        fetchInProgressGrievances()
      }
    }
  }, [router, user, isViewer, isSubmitter])

  const fetchAllGrievances = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/grievances")
      const data = await response.json()
      setGrievances(data)
    } catch (error) {
      console.error("Error fetching grievances:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchConfessions = async () => {
    try {
      const response = await fetch("/api/confessions")
      const data = await response.json()
      setConfessions(data)
    } catch (error) {
      console.error("Error fetching confessions:", error)
    }
  }

  const fetchInProgressGrievances = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/grievances/in-progress")
      const data = await response.json()
      setInProgressGrievances(data)
    } catch (error) {
      console.error("Error fetching in-progress grievances:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!text.trim()) {
      setSubmitError("Please enter your grievance text")
      return
    }

    try {
      setIsSubmitting(true)
      setSubmitError("")

      const response = await fetch("/api/grievances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          severity,
          mood,
          evidenceUrls,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit grievance")
      }

      setText("")
      setSeverity(5)
      setEvidenceUrls([])
      setSubmitSuccess(true)
      setShowLoveCoupon(true)

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Error submitting grievance:", error)
      setSubmitError("Failed to submit grievance. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateGrievanceStatus = async (grievanceId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/grievances/${grievanceId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update status")
      }

      // Show success message
      setStatusUpdateSuccess(true)
      setTimeout(() => {
        setStatusUpdateSuccess(false)
      }, 3000)

      // If resolving a grievance, show date planner
      if (newStatus === "resolved") {
        setShowFeatures((prev) => ({ ...prev, datePlanner: true, sweetMoment: true }))
        setSelectedGrievanceId(grievanceId)
      }

      // Refresh grievances
      fetchAllGrievances()
    } catch (error) {
      console.error("Error updating grievance status:", error)
    }
  }

  const getSeverityLabel = (severity: number) => {
    if (severity <= 3) return "Bother"
    if (severity <= 6) return "Ick"
    return "Dealbreaker"
  }

  const getSeverityColor = (severity: number) => {
    if (severity <= 3) return "text-green-600"
    if (severity <= 6) return "text-yellow-600"
    return "text-red-600"
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "yet-to-approach":
        return "bg-gray-100 text-gray-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "yet-to-approach":
        return "Yet to Approach"
      case "in-progress":
        return "In Progress"
      case "resolved":
        return "Resolved"
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const filteredResolvedGrievances = grievances
    .filter((g) => g.status === "resolved")
    .filter(
      (g) =>
        g.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.username.toLowerCase().includes(searchTerm.toLowerCase()),
    )

  const activeGrievances = grievances.filter((g) => g.status !== "resolved")

  const toggleFeature = (feature: string) => {
    setShowFeatures((prev) => ({ ...prev, [feature]: !prev[feature] }))
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Mood Selector - visible to both users */}
        <MoodSelector onMoodSelect={setMood} currentMood={mood} username={isViewer ? "Vrinda" : undefined} />

        {/* Interactive Features - visible to both users */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <Button onClick={() => toggleFeature("miniGame")} className="bg-pink-500 hover:bg-pink-600 h-auto py-3">
            {showFeatures.miniGame ? "Hide Mini Game" : "Play Tic Tac Toe Together"}
          </Button>
          <Button
            onClick={() => toggleFeature("resolutionWheel")}
            className="bg-pink-500 hover:bg-pink-600 h-auto py-3"
          >
            {showFeatures.resolutionWheel ? "Hide Resolution Wheel" : "Spin the Resolution Wheel"}
          </Button>
        </div>

        {showFeatures.miniGame && (
          <div className="mb-6">
            <MiniGame />
          </div>
        )}

        {showFeatures.resolutionWheel && (
          <div className="mb-6">
            <ResolutionWheel />
          </div>
        )}

        {/* Secret Confession - visible to both users */}
        {isViewer && (
          <div className="mb-6">
            <Card className="border-pink-200 shadow-md">
              <CardHeader className="bg-pink-50">
                <CardTitle className="text-pink-700">Secret Confessions</CardTitle>
                <CardDescription>
                  Anonymous confessions from your partner (automatically deleted after 48 hours)
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {confessions.length === 0 ? (
                  <p className="text-center py-4 text-pink-600">No confessions yet.</p>
                ) : (
                  <div className="space-y-4">
                    {confessions.map((confession, index) => {
                      // Calculate time remaining
                      const expiresAt = new Date(confession.createdAt)
                      const now = new Date()
                      const hoursRemaining = Math.max(
                        0,
                        Math.floor((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60)),
                      )

                      return (
                        <div key={index} className="bg-white p-4 rounded-lg border border-pink-200">
                          <p className="text-sm text-gray-700 mb-2">{confession.text}</p>
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-500">{formatDate(confession.createdAt)}</p>
                            <p className="text-xs text-pink-600">
                              Expires in {hoursRemaining} {hoursRemaining === 1 ? "hour" : "hours"}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Submitter-specific features */}
        {isSubmitter && (
          <div className="space-y-8">
            {/* Submission Form */}
            <Card className="border-pink-200">
              <CardHeader>
                <CardTitle className="text-pink-700">Submit a New Grievance</CardTitle>
                <CardDescription>Share your concerns with us. All submissions are confidential.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="grievance">Grievance Details</Label>
                    <Textarea
                      id="grievance"
                      placeholder="Describe your grievance in detail..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="min-h-[150px] border-pink-200 focus:border-pink-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="severity">Severity Level: {severity}</Label>
                      <span className={`font-medium ${getSeverityColor(severity)}`}>{getSeverityLabel(severity)}</span>
                    </div>
                    <Slider
                      id="severity"
                      min={1}
                      max={10}
                      step={1}
                      value={[severity]}
                      onValueChange={(value) => setSeverity(value[0])}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-pink-600">
                      <span>Bother</span>
                      <span>Ick</span>
                      <span>Dealbreaker</span>
                    </div>
                  </div>

                  <EvidenceUpload onUpload={setEvidenceUrls} />

                  {submitSuccess && (
                    <Alert className="bg-green-50 border-green-200">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertTitle className="text-green-800">Success</AlertTitle>
                      <AlertDescription className="text-green-700">
                        Your grievance has been submitted successfully.
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
                </form>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !text.trim()}
                  className="w-full bg-pink-500 hover:bg-pink-600"
                >
                  {isSubmitting ? "Submitting..." : "Submit Grievance"}
                </Button>
              </CardFooter>
            </Card>

            {/* Love Coupon */}
            {showLoveCoupon && <LoveCoupon onClose={() => setShowLoveCoupon(false)} />}

            {/* In Progress Grievances */}
            <Card className="border-pink-200">
              <CardHeader>
                <CardTitle className="text-pink-700">Grievances Being Addressed</CardTitle>
                <CardDescription>These are your grievances currently being worked on</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-pink-600">Loading grievances...</div>
                ) : inProgressGrievances.length === 0 ? (
                  <div className="text-center py-8 text-pink-600">No grievances are currently being addressed.</div>
                ) : (
                  <div className="space-y-4">
                    {inProgressGrievances.map((grievance) => (
                      <Card key={grievance._id} className="border-pink-100">
                        <CardHeader className="py-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <CardDescription className="text-xs">{formatDate(grievance.createdAt)}</CardDescription>
                            </div>
                            <div className="flex space-x-2">
                              <div
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  grievance.severity <= 3
                                    ? "bg-green-100 text-green-800"
                                    : grievance.severity <= 6
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {getSeverityLabel(grievance.severity)}
                              </div>
                              <div className={`px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>
                                In Progress
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="py-2">
                          <p className="text-sm whitespace-pre-wrap">{grievance.text}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Viewer-specific features */}
        {isViewer && (
          <div>
            {statusUpdateSuccess && (
              <Alert className="bg-green-50 border-green-200 mb-4">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Success</AlertTitle>
                <AlertDescription className="text-green-700">Grievance status updated successfully.</AlertDescription>
              </Alert>
            )}

            {showFeatures.datePlanner && (
              <div className="mb-6">
                <DatePlanner />
              </div>
            )}

            {showFeatures.sweetMoment && selectedGrievanceId && (
              <div className="mb-6">
                <SweetMoment
                  grievanceId={selectedGrievanceId}
                  onSuccess={() => {
                    setShowFeatures((prev) => ({ ...prev, sweetMoment: false }))
                    setSelectedGrievanceId(null)
                  }}
                />
              </div>
            )}

            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-pink-100">
                <TabsTrigger value="active" className="data-[state=active]:bg-pink-200">
                  Active Grievances
                </TabsTrigger>
                <TabsTrigger value="resolved" className="data-[state=active]:bg-pink-200">
                  Resolved Grievances
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active">
                <Card className="border-pink-200">
                  <CardHeader>
                    <CardTitle className="text-pink-700">Active Grievances</CardTitle>
                    <CardDescription>Manage and update the status of active grievances</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="text-center py-8 text-pink-600">Loading grievances...</div>
                    ) : activeGrievances.length === 0 ? (
                      <div className="text-center py-8 text-pink-600">No active grievances found.</div>
                    ) : (
                      <div className="space-y-4">
                        {activeGrievances.map((grievance) => (
                          <Card key={grievance._id} className="border-pink-100">
                            <CardHeader className="py-3">
                              <div className="flex justify-between items-center">
                                <div>
                                  <CardTitle className="text-sm font-medium text-pink-700">
                                    From: {grievance.username}
                                  </CardTitle>
                                  <CardDescription className="text-xs">
                                    {formatDate(grievance.createdAt)}
                                  </CardDescription>
                                </div>
                                <div className="flex space-x-2">
                                  <div
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      grievance.severity <= 3
                                        ? "bg-green-100 text-green-800"
                                        : grievance.severity <= 6
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {getSeverityLabel(grievance.severity)}
                                  </div>
                                  <div
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                                      grievance.status,
                                    )}`}
                                  >
                                    {getStatusLabel(grievance.status)}
                                  </div>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="py-2">
                              <p className="text-sm whitespace-pre-wrap mb-4">{grievance.text}</p>

                              {/* Evidence display */}
                              {grievance.evidenceUrls && grievance.evidenceUrls.length > 0 && (
                                <div className="mb-4">
                                  <p className="text-xs font-medium text-pink-700 mb-2">
                                    Evidence (Exhibits A through{" "}
                                    {String.fromCharCode(64 + grievance.evidenceUrls.length)}):
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {grievance.evidenceUrls.map((url, index) => (
                                      <div key={index} className="relative">
                                        <div className="h-16 w-16 bg-pink-100 rounded-md flex items-center justify-center overflow-hidden">
                                          {url.startsWith("data:image") ? (
                                            <img
                                              src={url || "/placeholder.svg"}
                                              alt={`Evidence ${index + 1}`}
                                              className="h-full w-full object-cover rounded-md"
                                            />
                                          ) : (
                                            <ImageIcon className="h-8 w-8 text-pink-500" />
                                          )}
                                        </div>
                                        <span className="absolute -bottom-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                          {String.fromCharCode(65 + index)}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="flex justify-between items-center">
                                <Label htmlFor={`status-${grievance._id}`} className="text-sm">
                                  Update Status:
                                </Label>
                                <Select
                                  defaultValue={grievance.status}
                                  onValueChange={(value) => updateGrievanceStatus(grievance._id, value)}
                                >
                                  <SelectTrigger className="w-[180px] border-pink-200">
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="yet-to-approach">Yet to Approach</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="mt-4 flex justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-pink-600 border-pink-200"
                                  onClick={() => toggleFeature("apologyGenerator")}
                                >
                                  {showFeatures.apologyGenerator ? "Hide Apology Generator" : "Write an Apology"}
                                </Button>
                              </div>
                              {showFeatures.apologyGenerator && (
                                <div className="mt-4">
                                  <ApologyGenerator grievanceText={grievance.text} />
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resolved">
                <Card className="border-pink-200">
                  <CardHeader>
                    <CardTitle className="text-pink-700">Resolved Grievances</CardTitle>
                    <CardDescription>View all resolved grievances</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-pink-400" />
                      <Input
                        placeholder="Search resolved grievances..."
                        className="pl-8 border-pink-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    {isLoading ? (
                      <div className="text-center py-8 text-pink-600">Loading grievances...</div>
                    ) : filteredResolvedGrievances.length === 0 ? (
                      <div className="text-center py-8 text-pink-600">
                        {searchTerm ? "No matching resolved grievances found." : "No resolved grievances yet."}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredResolvedGrievances.map((grievance) => (
                          <Card key={grievance._id} className="border-pink-100">
                            <CardHeader className="py-3">
                              <div className="flex justify-between items-center">
                                <div>
                                  <CardTitle className="text-sm font-medium text-pink-700">
                                    From: {grievance.username}
                                  </CardTitle>
                                  <CardDescription className="text-xs">
                                    {formatDate(grievance.createdAt)}
                                  </CardDescription>
                                </div>
                                <div className="flex space-x-2">
                                  <div
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      grievance.severity <= 3
                                        ? "bg-green-100 text-green-800"
                                        : grievance.severity <= 6
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {getSeverityLabel(grievance.severity)}
                                  </div>
                                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Resolved
                                  </div>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="py-2">
                              <p className="text-sm whitespace-pre-wrap">{grievance.text}</p>

                              {/* Evidence display */}
                              {grievance.evidenceUrls && grievance.evidenceUrls.length > 0 && (
                                <div className="mb-4">
                                  <p className="text-xs font-medium text-pink-700 mb-2">
                                    Evidence (Exhibits A through{" "}
                                    {String.fromCharCode(64 + grievance.evidenceUrls.length)}):
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {grievance.evidenceUrls.map((url, index) => (
                                      <div key={index} className="relative">
                                        <div className="h-16 w-16 bg-pink-100 rounded-md flex items-center justify-center overflow-hidden">
                                          {url.startsWith("data:image") ? (
                                            <img
                                              src={url || "/placeholder.svg"}
                                              alt={`Evidence ${index + 1}`}
                                              className="h-full w-full object-cover rounded-md"
                                            />
                                          ) : (
                                            <ImageIcon className="h-8 w-8 text-pink-500" />
                                          )}
                                        </div>
                                        <span className="absolute -bottom-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                          {String.fromCharCode(65 + index)}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Sweet Moment display */}
                              {grievance.sweetMoment && (
                                <div className="mt-4 bg-pink-50 p-3 rounded-md">
                                  <p className="text-xs font-medium text-pink-700 mb-2">Sweet Memory:</p>
                                  <p className="text-sm text-gray-700">{grievance.sweetMoment.text}</p>
                                  {grievance.sweetMoment.imageUrl && (
                                    <div className="mt-2 h-32 w-full">
                                      <img
                                        src={grievance.sweetMoment.imageUrl || "/placeholder.svg"}
                                        alt="Sweet memory"
                                        className="h-full w-auto object-contain rounded-md"
                                      />
                                    </div>
                                  )}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
    </div>
  )
}
