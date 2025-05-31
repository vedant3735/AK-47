import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Grievance from "@/models/Grievance"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if the user has the viewer role
    const userRole = request.cookies.get("userRole")?.value

    if (userRole !== "viewer") {
      return NextResponse.json({ error: "Unauthorized. Only viewers can update grievance status." }, { status: 403 })
    }

    const { id } = params
    const { status } = await request.json()

    if (!status || !["yet-to-approach", "in-progress", "resolved"].includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 })
    }

    await connectToDatabase()

    const updatedGrievance = await Grievance.findByIdAndUpdate(id, { status }, { new: true })

    if (!updatedGrievance) {
      return NextResponse.json({ error: "Grievance not found" }, { status: 404 })
    }

    return NextResponse.json(updatedGrievance)
  } catch (error) {
    console.error("Error updating grievance:", error)
    return NextResponse.json({ error: "Failed to update grievance" }, { status: 500 })
  }
}
