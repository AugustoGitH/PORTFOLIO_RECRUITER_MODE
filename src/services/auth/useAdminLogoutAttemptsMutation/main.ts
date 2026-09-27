import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ENDPOINTS_BACKEND, QUERY_KEYS } from "@/constants/service"
import { useAdminMutationToast } from "@/hooks/admin"
import { http } from "@/libs/http"

export const useAdminLogoutAttemptsMutation = () => {
  const queryClient = useQueryClient()
  const adminToast = useAdminMutationToast()

  return useMutation({
    mutationFn: async (ip: string) => {
      await http.delete(ENDPOINTS_BACKEND.adminLoginAttempts(), {
        data: { ip },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.adminLoginAttempts()],
      })
      adminToast.success("AdminLoginAttemptsResetSuccess")
    },
    onError: () => adminToast.error("AdminLoginAttemptsResetError"),
  })
}
