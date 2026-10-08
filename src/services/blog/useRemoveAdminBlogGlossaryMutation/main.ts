import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ENDPOINTS_BACKEND, QUERY_KEYS } from "@/constants/service"
import { useAdminMutationToast } from "@/hooks/admin"
import { http } from "@/libs/http"

export const useRemoveAdminBlogGlossaryMutation = () => {
  const queryClient = useQueryClient()
  const adminToast = useAdminMutationToast()

  return useMutation({
    mutationFn: (id: string) => http.delete(ENDPOINTS_BACKEND.adminBlogGlossaryEntry(id)),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: [QUERY_KEYS.adminBlog()] })
      adminToast.success("AdminRemoveSuccess")
    },
    onError: () => adminToast.error("AdminRemoveError"),
  })
}
