import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ENDPOINTS_BACKEND, QUERY_KEYS } from "@/constants/service"
import { useAdminMutationToast } from "@/hooks/admin"
import { http } from "@/libs/http"

export const useRemoveAdminBlogCategoryMutation = () => {
  const queryClient = useQueryClient()
  const adminToast = useAdminMutationToast()

  return useMutation({
    mutationFn: (id: string) => http.delete(
      ENDPOINTS_BACKEND.adminBlogCategory(id),
    ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.adminBlog()],
      })
      adminToast.success("AdminRemoveSuccess")
    },
    onError: () => adminToast.error("AdminRemoveError"),
  })
}
