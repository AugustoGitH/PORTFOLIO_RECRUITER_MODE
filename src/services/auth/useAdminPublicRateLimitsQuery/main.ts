import { useQuery } from "@tanstack/react-query"
import { ENDPOINTS_BACKEND, QUERY_KEYS } from "@/constants/service"
import { http } from "@/libs/http"
import type { AdminPublicRateLimit } from "./types"

export const useAdminPublicRateLimitsQuery = () => useQuery({
  queryKey: [QUERY_KEYS.adminPublicRateLimits()],
  queryFn: async () => (
    await http.get<AdminPublicRateLimit[]>(
      ENDPOINTS_BACKEND.adminPublicRateLimits(),
    )
  ).data,
  refetchInterval: 30_000,
})
