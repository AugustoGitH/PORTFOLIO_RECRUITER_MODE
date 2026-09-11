import App from "@/App"
import { headers } from "next/headers"
import { metricsService } from "@backend/metrics"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const visitorId = (await headers()).get("x-visitor-id") ?? "anonymous"
  let initialViews = 0
  let initialLikes = 0
  let initialLiked = false
  let initialResumeDownloads = 0

  try {
    initialViews = await metricsService.registerPortfolioView(visitorId)
    const snapshot = await metricsService.getSnapshot(visitorId)
    initialLikes = snapshot.likes
    initialLiked = snapshot.liked
    initialResumeDownloads = snapshot.resumeDownloads
  } catch (error) {
    console.error("Unable to load portfolio views", error)
  }

  return <App initialViews={initialViews} initialLikes={initialLikes} initialLiked={initialLiked} initialResumeDownloads={initialResumeDownloads} />
}
