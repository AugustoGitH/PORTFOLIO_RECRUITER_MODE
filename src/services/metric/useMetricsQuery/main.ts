import { http } from "@/libs/http"
import { useQuery } from "@tanstack/react-query"
import { MetricsQueryOptions, MetricsSnapshot } from "./types"
import { ENDPOINTS_BACKEND, QUERY_KEYS } from "@/constants/service"

export const useMetricsQuery = (options: MetricsQueryOptions) => {
  return useQuery({
    queryKey: [QUERY_KEYS.metrics()],
    queryFn: async () => {
      const response = await http.get<MetricsSnapshot>(ENDPOINTS_BACKEND.metrics())
      return response.data
    },
    initialData: options.metrics,
    staleTime: 60_000,
  })

}