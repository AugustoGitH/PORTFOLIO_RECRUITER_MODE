import { ENDPOINTS_BACKEND, QUERY_KEYS } from "@/constants/service"
import { http } from "@/libs/http"
import { useQuery } from "@tanstack/react-query"
import { AdminLoginRateLimit } from "./types"

export const useAdminLoginAttemptsQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.adminLoginAttempts()],
    queryFn: async () => (
      await http.get<AdminLoginRateLimit[]>(ENDPOINTS_BACKEND.adminLoginAttempts())
    ).data,
    refetchInterval: 30_000,
  })
}