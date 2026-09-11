import { randomUUID } from "crypto"

const visitorPattern = /^[a-f0-9-]{36}$/i

export const getVisitorId = (request: Request) => {
  const value = request.headers.get("cookie")?.match(/(?:^|;\s*)visitor_id=([^;]+)/)?.[1]
  return value && visitorPattern.test(value) ? value : randomUUID()
}