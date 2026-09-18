export type Metrics = {
  views: number
  likes: number
  liked: boolean
  resumeDownloads: number
  professionalFeedbacks: number
}

export type MetricsSnapshot = {
  views: number
  likes: number
  liked: boolean
  resumeDownloads: number
}

export type MetricsQueryOptions = {
  metrics: MetricsSnapshot
}