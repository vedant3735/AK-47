import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import LoveCoupon from "@/models/LoveCoupon"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Only allow viewers to redeem love coupons
    const userRole = request.cookies.get("userRole")?.value
    if (userRole !== "viewer") {
      return NextResponse.json({ error: "Unauthorized. Only viewers can redeem love coupons." }, { status: 403 })
    }

    await connectToDatabase()

    const coupon = await LoveCoupon.findById(id)
    if (!coupon) {
      return NextResponse.json({ error: "Love coupon not found" }, { status: 404 })
    }

    if (coupon.isRedeemed) {
      return NextResponse.json({ error: "This love coupon has already been redeemed" }, { status: 400 })
    }

    coupon.isRedeemed = true
    await coupon.save()

    return NextResponse.json(coupon)
  } catch (error) {
    console.error("Error redeeming love coupon:", error)
    return NextResponse.json({ error: "Failed to redeem love coupon" }, { status: 500 })
  }
}
