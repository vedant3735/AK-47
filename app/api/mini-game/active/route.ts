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

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    // Find the most recent active game
    const activeGame = await MiniGame.findOne({ isActive: true }).sort({ createdAt: -1 })

    if (!activeGame) {
      return NextResponse.json({ error: "No active game found" }, { status: 404 })
    }

    return NextResponse.json(activeGame)
  } catch (error) {
    console.error("Error fetching active mini-game:", error)
    return NextResponse.json({ error: "Failed to fetch active mini-game" }, { status: 500 })
  }
}
