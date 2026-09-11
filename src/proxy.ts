import type { NextRequest } from "next/server"
import { applyVisitorProxy } from "@backend/security/proxy"

export function proxy(request: NextRequest) {
  return applyVisitorProxy(request)
}

export const config = {
  matcher: ["/"],
}
