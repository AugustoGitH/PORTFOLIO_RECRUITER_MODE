import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ENDPOINTS_BACKEND, QUERY_KEYS } from "@/constants/service"
import { useAdminMutationToast } from "@/hooks/admin"
import { http } from "@/libs/http"
import type {
  AdminBlogData,
} from "../useAdminBlogQuery"
import type {
  SaveAdminBlogPostVariables,
  UseSaveAdminBlogPostMutationOptions,
} from "./types"

export const useSaveAdminBlogPostMutation = (
  options: UseSaveAdminBlogPostMutationOptions = {},
) => {
  const queryClient = useQueryClient()
  const adminToast = useAdminMutationToast()

  return useMutation({
    mutationFn: ({ id, body }: SaveAdminBlogPostVariables) => id
      ? http.patch<{ id: string }>(ENDPOINTS_BACKEND.adminBlogPost(id), body)
      : http.post<{ id: string }>(ENDPOINTS_BACKEND.adminBlog(), body),
    onSuccess: async ({ data }, variables) => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.adminBlog()],
      })
      const refreshed = queryClient.getQueryData<AdminBlogData>([
        QUERY_KEYS.adminBlog(),
      ])
      options.onSaved?.(
        refreshed?.posts.find((post) => post._id === data.id),
        variables,
      )
      adminToast.success("AdminSaveSuccess")
    },
    onError: () => adminToast.error("AdminSaveError"),
  })
}
