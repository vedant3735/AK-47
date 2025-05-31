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

// Helper function to check for a winner
function checkWinner(board: Array<string | null>) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]
    }
  }

  if (board.every((square) => square !== null)) {
    return "draw"
  }

  return null
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { index, player } = await request.json()

    await connectToDatabase()

    // Get the current game
    const game = await MiniGame.findById(id)

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 })
    }

    // Check if the move is valid
    if (game.board[index] !== null || game.winner !== null || game.currentPlayer !== player) {
      return NextResponse.json({ error: "Invalid move" }, { status: 400 })
    }

    // Make the move
    const newBoard = [...game.board]
    newBoard[index] = player

    // Check for a winner
    const winner = checkWinner(newBoard)

    // Update the game
    game.board = newBoard
    game.currentPlayer = player === "X" ? "O" : "X"
    game.winner = winner
    game.updatedAt = new Date()

    // If there's a winner or it's a draw, mark the game as inactive
    if (winner) {
      game.isActive = false
    }

    await game.save()

    return NextResponse.json(game)
  } catch (error) {
    console.error("Error making move:", error)
    return NextResponse.json({ error: "Failed to make move" }, { status: 500 })
  }
}
