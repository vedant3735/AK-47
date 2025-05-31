import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Grievance from "@/models/Grievance"

export async function GET(request: NextRequest) {
  try {
    // Check if the user has the submitter role
    const userRole = request.cookies.get("userRole")?.value

    if (userRole !== "submitter") {
      return NextResponse.json(
        { error: "Unauthorized. Only submitters can view their in-progress grievances." },
        { status: 403 },
      )
    }

    // Get the username from the cookie
    const username = request.cookies.get("grievancePortalUser")?.value

    if (!username) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
    }

    await connectToDatabase()

    // Find grievances submitted by this user that are in progress
    const grievances = await Grievance.find({
      username: username,
      status: "in-progress",
    }).sort({ createdAt: -1 })

    return NextResponse.json(grievances)
  } catch (error) {
    console.error("Error fetching in-progress grievances:", error)
    return NextResponse.json({ error: "Failed to fetch in-progress grievances" }, { status: 500 })
  }
}
