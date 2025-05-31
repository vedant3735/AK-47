import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import mongoose from "mongoose"

// Create a simple schema for mood if it doesn't exist
let Mood: any
try {
  Mood = mongoose.model("Mood")
} catch {
  const MoodSchema = new mongoose.Schema({
    username: { type: String, required: true },
    mood: { type: String, default: "neutral" },
    updatedAt: { type: Date, default: Date.now },
  })

  Mood = mongoose.model("Mood", MoodSchema)
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    // Get the submitter's username (Vrinda)
    const submitterUsername = "vrinda"

    // Find the current mood
    let currentMood = await Mood.findOne({ username: submitterUsername })

    if (!currentMood) {
      currentMood = await Mood.create({
        username: submitterUsername,
        mood: "neutral",
      })
    }

    return NextResponse.json({ mood: currentMood.mood })
  } catch (error) {
    console.error("Error fetching mood:", error)
    return NextResponse.json({ error: "Failed to fetch mood" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { mood } = await request.json()

    // Check if the user has the submitter role
    const userRole = request.cookies.get("userRole")?.value

    if (userRole !== "submitter") {
      return NextResponse.json({ error: "Unauthorized. Only submitters can update mood." }, { status: 403 })
    }

    await connectToDatabase()

    // Get the username from the cookie
    const cookies = request.cookies
    const userCookie = cookies.get("grievancePortalUser")
    const username = userCookie ? userCookie.value : "anonymous"

    // Update or create the mood
    const updatedMood = await Mood.findOneAndUpdate(
      { username },
      { mood, updatedAt: new Date() },
      { upsert: true, new: true },
    )

    return NextResponse.json(updatedMood)
  } catch (error) {
    console.error("Error updating mood:", error)
    return NextResponse.json({ error: "Failed to update mood" }, { status: 500 })
  }
}
