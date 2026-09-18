export const ENDPOINTS_BACKEND = {
  resumes: (lang: string) => `/api/resumes/default?locale=${lang}`,
  metrics: () => "/api/metrics",
  metricLike: () => "/api/metrics/like",
}