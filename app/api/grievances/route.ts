import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Grievance from "@/models/Grievance"

export async function GET(request: NextRequest) {
  try {
    // Check if the user has the viewer role
    const userRole = request.cookies.get("userRole")?.value

    if (userRole !== "viewer") {
      return NextResponse.json({ error: "Unauthorized. Only viewers can access grievances." }, { status: 403 })
    }

    await connectToDatabase()
    const grievances = await Grievance.find({}).sort({ createdAt: -1 })
    return NextResponse.json(grievances)
  } catch (error) {
    console.error("Error fetching grievances:", error)
    return NextResponse.json({ error: "Failed to fetch grievances" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if the user has the submitter role
    const userRole = request.cookies.get("userRole")?.value

    if (userRole !== "submitter") {
      return NextResponse.json({ error: "Unauthorized. Only submitters can create grievances." }, { status: 403 })
    }

    const { text, severity, mood, evidenceUrls } = await request.json()

    // Get the username from the cookie
    const cookies = request.cookies
    const userCookie = cookies.get("grievancePortalUser")
    const username = userCookie ? userCookie.value : "anonymous"

    if (!text) {
      return NextResponse.json({ error: "Grievance text is required" }, { status: 400 })
    }

    await connectToDatabase()

    const newGrievance = new Grievance({
      username,
      text,
      severity: severity || 5,
      status: "yet-to-approach", // Default status
      mood: mood || "neutral",
      evidenceUrls: evidenceUrls || [],
    })

    await newGrievance.save()

    return NextResponse.json({ message: "Grievance submitted successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error submitting grievance:", error)
    return NextResponse.json({ error: "Failed to submit grievance" }, { status: 500 })
  }
}
