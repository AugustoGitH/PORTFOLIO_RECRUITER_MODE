import "server-only"

import { metricsRepository } from "@backend/metrics/repositories"

const dayKey = (date = new Date()) => date.toISOString().slice(0, 10)

export const metricsService = {
  async registerPortfolioView(visitorId: string) {
    return metricsRepository.recordPortfolioView(visitorId, `portfolio:${visitorId}:${dayKey()}`)
  },

  async getPortfolioViews() {
    return metricsRepository.countPortfolioViews()
  },

  async getSnapshot(visitorId: string) {
    const [views, likes, liked, resumeDownloads] = await Promise.all([
      metricsRepository.countPortfolioViews(),
      metricsRepository.countLikes(),
      metricsRepository.hasLike(visitorId),
      metricsRepository.countResumeViews(),
    ])
    return { views, likes, liked, resumeDownloads }
  },

  async toggleLike(visitorId: string) {
    const liked = await metricsRepository.toggleLike(visitorId)
    return { likes: await metricsRepository.countLikes(), liked }
  },

  async recordResumeDownload(visitorId: string, locale: string, slug: string) {
    return metricsRepository.recordResumeView(visitorId, locale, slug)
  },
}
