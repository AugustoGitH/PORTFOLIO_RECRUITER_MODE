import { NextResponse, type NextRequest } from "next/server"

const visitorCookie = "visitor_id"
const visitorPattern = /^[a-f0-9-]{36}$/i

export function applyVisitorProxy(request: NextRequest) {
  const existingVisitorId = request.cookies.get(visitorCookie)?.value
  const visitorId = existingVisitorId && visitorPattern.test(existingVisitorId)
    ? existingVisitorId
    : crypto.randomUUID()
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-visitor-id", visitorId)
  const response = NextResponse.next({ request: { headers: requestHeaders } })

  if (!existingVisitorId) {
    response.cookies.set(visitorCookie, visitorId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    })
  }

  return response
}
