import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import Grievance from "@/models/Grievance"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { text, imageUrl } = await request.json()

    if (!text) {
      return NextResponse.json({ error: "Sweet moment text is required" }, { status: 400 })
    }

    await connectToDatabase()

    const updatedGrievance = await Grievance.findByIdAndUpdate(
      id,
      {
        sweetMoment: {
          text,
          imageUrl,
        },
      },
      { new: true },
    )

    if (!updatedGrievance) {
      return NextResponse.json({ error: "Grievance not found" }, { status: 404 })
    }

    return NextResponse.json(updatedGrievance)
  } catch (error) {
    console.error("Error adding sweet moment:", error)
    return NextResponse.json({ error: "Failed to add sweet moment" }, { status: 500 })
  }
}
