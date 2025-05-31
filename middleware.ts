import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/"

  // Get the token from the cookies
  const token = request.cookies.get("grievancePortalUser")?.value || ""

  // If the user is not logged in and trying to access a protected route
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/dashboard/:path*"],
}
