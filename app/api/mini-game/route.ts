import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import mongoose from "mongoose"

// Create a schema for the mini-game if it doesn't exist
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

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    // Create a new game
    const newGame = new MiniGame({
      board: Array(9).fill(null),
      currentPlayer: "X",
      winner: null,
      isActive: true,
    })

    await newGame.save()

    return NextResponse.json(newGame)
  } catch (error) {
    console.error("Error creating mini-game:", error)
    return NextResponse.json({ error: "Failed to create mini-game" }, { status: 500 })
  }
}
