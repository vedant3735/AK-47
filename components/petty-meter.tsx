"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import Image from "next/image"

interface PettyMeterProps {
  value?: number
  onChange: (value: number) => void
}

export function PettyMeter({ value = 5, onChange }: PettyMeterProps) {
  const [pettyLevel, setPettyLevel] = useState(value)
  const [showAnimation, setShowAnimation] = useState(false)

  const handleChange = (newValue: number[]) => {
    const level = newValue[0]
    setPettyLevel(level)
    onChange(level)

    if (level <= 3) {
      setShowAnimation(true)
      setTimeout(() => setShowAnimation(false), 3000)
    }
  }

  const getPettyLabel = (level: number) => {
    if (level <= 3) return "Just Being Petty"
    if (level <= 6) return "Somewhat Serious"
    return "Very Serious"
  }

  const getPettyColor = (level: number) => {
    if (level <= 3) return "text-green-600"
    if (level <= 6) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <Card className="border-pink-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-pink-700 text-lg flex items-center">
          <span>Petty Meter™</span>
          {pettyLevel <= 3 && (
            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Petty Alert</span>
          )}
        </CardTitle>
        <CardDescription>How serious is this complaint?</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="petty-level">Level: {pettyLevel}</Label>
            <span className={`font-medium ${getPettyColor(pettyLevel)}`}>{getPettyLabel(pettyLevel)}</span>
          </div>
          <Slider
            id="petty-level"
            min={1}
            max={10}
            step={1}
            value={[pettyLevel]}
            onValueChange={handleChange}
            className="py-4"
          />
          <div className="flex justify-between text-xs text-pink-600">
            <span>Just Petty</span>
            <span>Somewhat Serious</span>
            <span>Very Serious</span>
          </div>

          {showAnimation && (
            <div className="mt-4 text-center">
              <p className="text-sm text-green-600 mb-2">Noted with love! 💕</p>
              <div className="relative h-[150px] w-full max-w-[200px] mx-auto">
                <Image
                  src="/placeholder.svg?height=150&width=200&text=Dancing+Cat"
                  alt="Dancing cat"
                  fill
                  className="object-contain"
                  sizes="(max-width: 200px) 100vw, 200px"
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
