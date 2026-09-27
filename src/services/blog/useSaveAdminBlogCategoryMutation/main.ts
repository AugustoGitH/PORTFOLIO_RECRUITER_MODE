import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ENDPOINTS_BACKEND, QUERY_KEYS } from "@/constants/service"
import { useAdminMutationToast } from "@/hooks/admin"
import { http } from "@/libs/http"
import type { SaveAdminBlogCategoryVariables } from "./types"

export const useSaveAdminBlogCategoryMutation = () => {
  const queryClient = useQueryClient()
  const adminToast = useAdminMutationToast()

  return useMutation({
    mutationFn: ({ id, body }: SaveAdminBlogCategoryVariables) => id
      ? http.patch(ENDPOINTS_BACKEND.adminBlogCategory(id), body)
      : http.post(ENDPOINTS_BACKEND.adminBlogCategories(), body),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: [QUERY_KEYS.adminBlog()],
      })
      adminToast.success("AdminSaveSuccess")
    },
    onError: () => adminToast.error("AdminSaveError"),
  })
}
