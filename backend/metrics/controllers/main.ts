import "server-only"

import { metricsService } from "@backend/metrics/services"
import { getVisitorId } from "@backend/metrics/utils"

const visitorCookie = "visitor_id"

export const metricsController = {
  getVisitorId(request: Request) {
    return getVisitorId(request)
  },
  async getSnapshot(request: Request) {
    const visitorId = getVisitorId(request)
    try {
      return Response.json(await metricsService.getSnapshot(visitorId))
    } catch (error) {
      console.error("Unable to read metrics snapshot", error)
      return Response.json({ error: "Metrics unavailable" }, { status: 503 })
    }
  },

  async toggleLike(request: Request) {
    const visitorId = getVisitorId(request)
    try {
      const response = Response.json(await metricsService.toggleLike(visitorId))
      if (!request.headers.get("cookie")?.includes(`${visitorCookie}=`)) {
        response.headers.append("Set-Cookie", `${visitorCookie}=${visitorId}; Path=/; Max-Age=31536000; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`)
      }
      return response
    } catch (error) {
      console.error("Unable to toggle portfolio like", error)
      return Response.json({ error: "Metrics unavailable" }, { status: 503 })
    }
  },

  async registerPortfolioView(request: Request) {
    const visitorId = getVisitorId(request)
    try {
      const views = await metricsService.registerPortfolioView(visitorId)
      const response = Response.json({ views })
      if (!request.headers.get("cookie")?.includes(`${visitorCookie}=`)) {
        response.headers.append("Set-Cookie", `${visitorCookie}=${visitorId}; Path=/; Max-Age=31536000; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`)
      }
      return response
    } catch (error) {
      console.error("Unable to register portfolio view", error)
      return Response.json({ error: "Metrics unavailable" }, { status: 503 })
    }
  },

  async getPortfolioViews() {
    try {
      return Response.json({ views: await metricsService.getPortfolioViews() })
    } catch (error) {
      console.error("Unable to read portfolio views", error)
      return Response.json({ error: "Metrics unavailable" }, { status: 503 })
    }
  },
}
