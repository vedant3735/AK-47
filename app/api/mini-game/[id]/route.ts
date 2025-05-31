import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import mongoose from "mongoose"

// Get the MiniGame model
let MiniGame: any
try {
  MiniGame = mongoose.model("MiniGame")
} catch {
  const MiniGameSchema = new mongoose.Schema({
    board: [{ type: String, default: null }],
    currentPlayer: { type: String, default: "X" },
    winner: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  })

  MiniGame = mongoose.model("MiniGame", MiniGameSchema)
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    await connectToDatabase()

    const game = await MiniGame.findById(id)

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 })
    }

    return NextResponse.json(game)
  } catch (error) {
    console.error("Error fetching mini-game:", error)
    return NextResponse.json({ error: "Failed to fetch mini-game" }, { status: 500 })
  }
}
