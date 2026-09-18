import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MetricsSnapshot } from "../useMetricsQuery"
import { http } from "@/libs/http"
import { MetricLikeSnapshot } from "./types"
import { ENDPOINTS_BACKEND, QUERY_KEYS } from "@/constants/service"

export const useMetricLikeMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await http.post<MetricLikeSnapshot>(ENDPOINTS_BACKEND.metricLike())
      return response.data
    },
    onSuccess: (result) => {
      queryClient.setQueryData<MetricsSnapshot>([QUERY_KEYS.metrics()], (current) => ({
        views: current?.views ?? 0,
        likes: result.likes,
        liked: result.liked,
        resumeDownloads: current?.resumeDownloads ?? 0,
      }))
    },
  })
}