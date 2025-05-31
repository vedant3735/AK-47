import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Confession from "@/models/Confession"

export async function GET(request: NextRequest) {
  try {
    // Check if the user has the viewer role
    const userRole = request.cookies.get("userRole")?.value

    if (userRole !== "viewer") {
      return NextResponse.json({ error: "Unauthorized. Only viewers can access confessions." }, { status: 403 })
    }

    await connectToDatabase()
    const confessions = await Confession.find({}).sort({ createdAt: -1 })
    return NextResponse.json(confessions)
  } catch (error) {
    console.error("Error fetching confessions:", error)
    return NextResponse.json({ error: "Failed to fetch confessions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if the user has the submitter role
    const userRole = request.cookies.get("userRole")?.value

    if (userRole !== "submitter") {
      return NextResponse.json({ error: "Unauthorized. Only submitters can create confessions." }, { status: 403 })
    }

    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Confession text is required" }, { status: 400 })
    }

    await connectToDatabase()

    // Calculate expiration date (48 hours from now)
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 48)

    const newConfession = new Confession({
      text,
      expiresAt,
    })

    await newConfession.save()

    return NextResponse.json({ message: "Confession submitted successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error submitting confession:", error)
    return NextResponse.json({ error: "Failed to submit confession" }, { status: 500 })
  }
}
