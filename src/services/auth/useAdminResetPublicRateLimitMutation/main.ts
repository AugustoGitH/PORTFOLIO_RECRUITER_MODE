import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ENDPOINTS_BACKEND, QUERY_KEYS } from "@/constants/service"
import { useAdminMutationToast } from "@/hooks/admin"
import { http } from "@/libs/http"
import type { AdminPublicRateLimit } from "../useAdminPublicRateLimitsQuery"

export const useAdminResetPublicRateLimitMutation = () => {
  const queryClient = useQueryClient()
  const adminToast = useAdminMutationToast()

  return useMutation({
    mutationFn: async (rateLimit: AdminPublicRateLimit) => {
      await http.delete(ENDPOINTS_BACKEND.adminPublicRateLimits(), {
        data: {
          scope: rateLimit.scope,
          dimension: rateLimit.dimension,
          identifier: rateLimit.identifier,
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.adminPublicRateLimits()],
      })
      adminToast.success("AdminPublicRateLimitsResetSuccess")
    },
    onError: () => adminToast.error("AdminPublicRateLimitsResetError"),
  })
}
