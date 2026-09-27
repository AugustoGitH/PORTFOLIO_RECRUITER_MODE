import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ENDPOINTS_BACKEND, QUERY_KEYS } from "@/constants/service"
import { useAdminMutationToast } from "@/hooks/admin"
import { http } from "@/libs/http"
import type {
  AdminBlogImageUpload,
  UploadAdminBlogImageVariables,
} from "./types"

export const useUploadAdminBlogImageMutation = () => {
  const queryClient = useQueryClient()
  const adminToast = useAdminMutationToast()

  return useMutation({
    mutationFn: ({ id, file, purpose }: UploadAdminBlogImageVariables) => {
      const form = new FormData()
      form.set("postId", id)
      form.set("image", file)
      form.set("purpose", purpose)

      return http.post<AdminBlogImageUpload>(
        ENDPOINTS_BACKEND.adminBlogImage(),
        form,
        { headers: { "Content-Type": undefined } },
      )
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.adminBlog()],
      })
      adminToast.success("AdminUploadSuccess")
    },
    onError: () => adminToast.error("AdminUploadError"),
  })
}
