"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { resolutionOptions } from "@/lib/utils-features"
import { RefreshCw } from "lucide-react"

export function ResolutionWheel() {
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [rotation, setRotation] = useState(0)
  const wheelRef = useRef<HTMLDivElement>(null)
  const [wheelSize, setWheelSize] = useState(256) // Default size

  // Adjust wheel size based on screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) {
        setWheelSize(220)
      } else {
        setWheelSize(256)
      }
    }

    handleResize() // Initial call
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const spinWheel = () => {
    if (spinning) return

    setSpinning(true)
    setResult(null)

    // Random rotation between 2 and 5 full spins plus a random segment
    const spinCount = 2 + Math.random() * 3
    const randomAngle = Math.random() * 360
    const totalRotation = rotation + spinCount * 360 + randomAngle
    setRotation(totalRotation)

    // Calculate which option is selected
    setTimeout(() => {
      const selectedIndex = Math.floor((totalRotation % 360) / (360 / resolutionOptions.length))
      const normalizedIndex = resolutionOptions.length - 1 - selectedIndex
      const selectedOption = resolutionOptions[normalizedIndex % resolutionOptions.length]
      setResult(selectedOption)
      setSpinning(false)
    }, 3000)
  }

  return (
    <Card className="border-pink-200 shadow-md">
      <CardHeader className="bg-pink-50">
        <CardTitle className="text-pink-700">Spin the Resolution Wheel</CardTitle>
        <CardDescription>Let fate decide how to resolve this grievance</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 pb-4 flex flex-col items-center">
        <div className="relative" style={{ width: `${wheelSize}px`, height: `${wheelSize}px` }}>
          {/* Wheel */}
          <div
            ref={wheelRef}
            className="absolute w-full h-full rounded-full border-4 border-pink-300 overflow-hidden"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? "transform 3s cubic-bezier(0.2, 0.8, 0.2, 1)" : "none",
            }}
          >
            {resolutionOptions.map((option, index) => {
              const angle = (index * 360) / resolutionOptions.length
              const color = index % 2 === 0 ? "bg-pink-100" : "bg-pink-200"

              // Calculate the next angle for the slice
              const nextAngle = ((index + 1) * 360) / resolutionOptions.length

              return (
                <div
                  key={index}
                  className={`absolute w-full h-full ${color}`}
                  style={{
                    transform: `rotate(${angle}deg)`,
                    transformOrigin: "50% 50%",
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(nextAngle * (Math.PI / 180))}% ${
                      50 - 50 * Math.sin(nextAngle * (Math.PI / 180))
                    }%)`,
                  }}
                >
                  <div
                    className="absolute text-pink-800 font-medium text-xs sm:text-sm text-center"
                    style={{
                      width: "100px",
                      left: "50%",
                      top: "15%",
                      transform: `translateX(-50%) rotate(${90 + angle + (nextAngle - angle) / 2}deg)`,
                      transformOrigin: "center bottom",
                    }}
                  >
                    {option}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Center pin */}
          <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-pink-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10"></div>

          {/* Pointer */}
          <div
            className="absolute top-0 left-1/2 w-4 h-8 bg-pink-600 transform -translate-x-1/2 z-10"
            style={{ borderRadius: "0 0 50% 50%" }}
          ></div>
        </div>

        {result && (
          <div className="text-center mt-6 mb-4">
            <p className="text-sm text-gray-500">Your resolution:</p>
            <p className="text-lg font-bold text-pink-700">{result}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={spinWheel} disabled={spinning} className="bg-pink-500 hover:bg-pink-600 flex items-center">
          <RefreshCw className={`mr-2 h-4 w-4 ${spinning ? "animate-spin" : ""}`} />
          {spinning ? "Spinning..." : "Spin the Wheel"}
        </Button>
      </CardFooter>
    </Card>
  )
}
