"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { loveCoupons, getRandomItem } from "@/lib/utils-features"
import Image from "next/image"
import { Heart, Gift } from "lucide-react"

interface LoveCouponProps {
  onClose?: () => void
}

export function LoveCoupon({ onClose }: LoveCouponProps) {
  const [coupon] = useState(getRandomItem(loveCoupons))
  const [isRevealed, setIsRevealed] = useState(false)

  return (
    <Card className="border-pink-200 shadow-lg max-w-md mx-auto">
      <CardHeader className="bg-pink-50 text-center">
        <div className="flex justify-center mb-2">
          <Heart className="h-8 w-8 text-pink-500" />
        </div>
        <CardTitle className="text-pink-700">You've Earned a Love Coupon!</CardTitle>
        <CardDescription>Click to reveal your special reward</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 pb-4 text-center">
        {isRevealed ? (
          <div className="space-y-4">
            <div className="relative h-[100px] w-[100px] mx-auto">
              <Image
                src={coupon.imageUrl || "/placeholder.svg"}
                alt={coupon.title}
                fill
                className="object-contain"
                sizes="100px"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-pink-700 mb-2">{coupon.title}</h3>
              <p className="text-gray-600">{coupon.description}</p>
            </div>
          </div>
        ) : (
          <div
            className="bg-pink-100 rounded-lg p-8 cursor-pointer flex items-center justify-center"
            onClick={() => setIsRevealed(true)}
          >
            <Gift className="h-16 w-16 text-pink-500" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={onClose} className="bg-pink-500 hover:bg-pink-600">
          {isRevealed ? "Save Coupon" : "Maybe Later"}
        </Button>
      </CardFooter>
    </Card>
  )
}
