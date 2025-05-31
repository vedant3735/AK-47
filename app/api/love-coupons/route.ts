import { type NextRequest, NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import LoveCoupon from "@/models/LoveCoupon"
import { loveCoupons, getRandomItem } from "@/lib/utils-features"

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    const coupons = await LoveCoupon.find({ isRedeemed: false }).sort({ createdAt: -1 })
    return NextResponse.json(coupons)
  } catch (error) {
    console.error("Error fetching love coupons:", error)
    return NextResponse.json({ error: "Failed to fetch love coupons" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the username from the cookie
    const cookies = request.cookies
    const userCookie = cookies.get("grievancePortalUser")
    const username = userCookie ? userCookie.value : "anonymous"

    // Only allow submitters to create love coupons
    const userRole = cookies.get("userRole")?.value
    if (userRole !== "submitter") {
      return NextResponse.json({ error: "Unauthorized. Only submitters can create love coupons." }, { status: 403 })
    }

    await connectToDatabase()

    // Generate a random love coupon
    const couponTemplate = getRandomItem(loveCoupons)

    const newCoupon = new LoveCoupon({
      title: couponTemplate.title,
      description: couponTemplate.description,
      imageUrl: couponTemplate.imageUrl,
      isRedeemed: false,
    })

    await newCoupon.save()

    return NextResponse.json(newCoupon, { status: 201 })
  } catch (error) {
    console.error("Error creating love coupon:", error)
    return NextResponse.json({ error: "Failed to create love coupon" }, { status: 500 })
  }
}
