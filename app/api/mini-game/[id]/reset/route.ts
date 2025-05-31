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

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    await connectToDatabase()

    // Get the current game
    const game = await MiniGame.findById(id)

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 })
    }

    // Reset the game
    game.board = Array(9).fill(null)
    game.currentPlayer = "X"
    game.winner = null
    game.updatedAt = new Date()
    game.isActive = true

    await game.save()

    return NextResponse.json(game)
  } catch (error) {
    console.error("Error resetting game:", error)
    return NextResponse.json({ error: "Failed to reset game" }, { status: 500 })
  }
}
