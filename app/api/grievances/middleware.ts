import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // For POST requests to the grievances API, we need to ensure the user is authenticated
  if (request.method === "POST") {
    const token = request.cookies.get("grievancePortalUser")?.value

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/grievances"],
}
