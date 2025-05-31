"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"

export function MiniGame() {
  const [gameState, setGameState] = useState<Array<string | null>>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X")
  const [winner, setWinner] = useState<string | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameId, setGameId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // X is always submitter (Vrinda), O is always viewer (Anirvesh)
  const player1 = "Vrinda"
  const player2 = "Anirvesh"
  const isMyTurn =
    (user?.role === "submitter" && currentPlayer === "X") || (user?.role === "viewer" && currentPlayer === "O")

  // Poll for game updates
  useEffect(() => {
    if (!gameId || !gameStarted) return

    const fetchGameState = async () => {
      try {
        const response = await fetch(`/api/mini-game/${gameId}`)
        if (response.ok) {
          const data = await response.json()
          setGameState(data.board)
          setCurrentPlayer(data.currentPlayer)
          setWinner(data.winner)
        }
      } catch (error) {
        console.error("Error fetching game state:", error)
      }
    }

    // Poll every 2 seconds
    const intervalId = setInterval(fetchGameState, 2000)

    return () => clearInterval(intervalId)
  }, [gameId, gameStarted])

  const checkWinner = (board: Array<string | null>) => {
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

  const handleClick = async (index: number) => {
    if (!gameStarted || gameState[index] || winner || !isMyTurn || isLoading) return

    try {
      setIsLoading(true)

      const newGameState = [...gameState]
      newGameState[index] = currentPlayer

      // Update the game state on the server
      const response = await fetch(`/api/mini-game/${gameId}/move`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          index,
          player: currentPlayer,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to make move")
      }

      const data = await response.json()

      // Update local state
      setGameState(data.board)
      setCurrentPlayer(data.currentPlayer)
      setWinner(data.winner)
    } catch (error) {
      console.error("Error making move:", error)
      setError("Failed to make move. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const startGame = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Create a new game on the server
      const response = await fetch("/api/mini-game", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to start game")
      }

      const data = await response.json()

      setGameId(data._id)
      setGameState(data.board)
      setCurrentPlayer(data.currentPlayer)
      setWinner(data.winner)
      setGameStarted(true)
    } catch (error) {
      console.error("Error starting game:", error)
      setError("Failed to start game. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const joinGame = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Get the latest active game
      const response = await fetch("/api/mini-game/active")

      if (!response.ok) {
        throw new Error("No active game found")
      }

      const data = await response.json()

      setGameId(data._id)
      setGameState(data.board)
      setCurrentPlayer(data.currentPlayer)
      setWinner(data.winner)
      setGameStarted(true)
    } catch (error) {
      console.error("Error joining game:", error)
      setError("No active game found. Please ask your partner to start a new game.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetGame = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Reset the game on the server
      const response = await fetch(`/api/mini-game/${gameId}/reset`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to reset game")
      }

      const data = await response.json()

      setGameState(data.board)
      setCurrentPlayer(data.currentPlayer)
      setWinner(data.winner)
    } catch (error) {
      console.error("Error resetting game:", error)
      setError("Failed to reset game. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-pink-200 shadow-md">
      <CardHeader className="bg-pink-50">
        <CardTitle className="text-pink-700">Mini Game: Tic Tac Toe</CardTitle>
        <CardDescription>Resolve your conflict with a friendly game</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {!gameStarted ? (
          <div className="text-center py-4">
            <p className="mb-4 text-pink-700">Play a game to decide who's right!</p>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 justify-center">
              <Button onClick={startGame} className="bg-pink-500 hover:bg-pink-600" disabled={isLoading}>
                {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : null}
                Start New Game
              </Button>
              <Button
                onClick={joinGame}
                variant="outline"
                className="border-pink-200 text-pink-700"
                disabled={isLoading}
              >
                {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : null}
                Join Existing Game
              </Button>
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {!winner && (
              <p className="mb-4 text-pink-700">
                {currentPlayer === "X" ? player1 : player2}'s turn ({currentPlayer})
                {isMyTurn ? " - Your turn!" : " - Waiting for opponent..."}
              </p>
            )}

            {winner && (
              <Alert
                className={winner === "draw" ? "bg-blue-50 border-blue-200 mb-4" : "bg-green-50 border-green-200 mb-4"}
              >
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className={winner === "draw" ? "text-blue-800" : "text-green-800"}>
                  {winner === "draw" ? "It's a draw!" : `${winner === "X" ? player1 : player2} wins!`}
                </AlertTitle>
                <AlertDescription className={winner === "draw" ? "text-blue-700" : "text-green-700"}>
                  {winner === "draw"
                    ? "You both have valid points!"
                    : `${winner === "X" ? player1 : player2} gets to decide this one!`}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-3 gap-2 mb-4">
              {gameState.map((value, index) => (
                <button
                  key={index}
                  className={`w-16 h-16 flex items-center justify-center text-2xl font-bold rounded-md ${
                    value
                      ? value === "X"
                        ? "bg-pink-200 text-pink-700"
                        : "bg-blue-200 text-blue-700"
                      : isMyTurn
                        ? "bg-gray-100 hover:bg-gray-200"
                        : "bg-gray-100 cursor-not-allowed"
                  }`}
                  onClick={() => handleClick(index)}
                  disabled={!!value || !!winner || !isMyTurn || isLoading}
                >
                  {value}
                </button>
              ))}
            </div>

            {isLoading && (
              <div className="flex items-center justify-center mb-4">
                <RefreshCw className="h-5 w-5 animate-spin text-pink-500 mr-2" />
                <span className="text-pink-700">Processing...</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        {gameStarted && (
          <Button onClick={resetGame} variant="outline" className="border-pink-200 text-pink-700" disabled={isLoading}>
            {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : null}
            Reset Game
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
