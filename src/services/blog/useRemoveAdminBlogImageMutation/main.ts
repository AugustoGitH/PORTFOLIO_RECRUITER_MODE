import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ENDPOINTS_BACKEND, QUERY_KEYS } from "@/constants/service"
import { useAdminMutationToast } from "@/hooks/admin"
import { http } from "@/libs/http"
import type { RemoveAdminBlogImageVariables } from "./types"

export const useRemoveAdminBlogImageMutation = () => {
  const queryClient = useQueryClient()
  const adminToast = useAdminMutationToast()

  return useMutation({
    mutationFn: ({ postId, mediaId }: RemoveAdminBlogImageVariables) =>
      http.delete(ENDPOINTS_BACKEND.adminBlogPostImage(postId, mediaId)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.adminBlog()],
      })
      adminToast.success("AdminRemoveSuccess")
    },
    onError: () => adminToast.error("AdminRemoveError"),
  })
}
