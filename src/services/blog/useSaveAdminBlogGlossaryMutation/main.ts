import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ENDPOINTS_BACKEND, QUERY_KEYS } from "@/constants/service"
import { useAdminMutationToast } from "@/hooks/admin"
import { http } from "@/libs/http"
import type { SaveAdminBlogGlossaryVariables } from "./types"

export const useSaveAdminBlogGlossaryMutation = () => {
  const queryClient = useQueryClient()
  const adminToast = useAdminMutationToast()

  return useMutation({
    mutationFn: ({ id, body }: SaveAdminBlogGlossaryVariables) => id
      ? http.patch(ENDPOINTS_BACKEND.adminBlogGlossaryEntry(id), body)
      : http.post(ENDPOINTS_BACKEND.adminBlogGlossary(), body),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: [QUERY_KEYS.adminBlog()] })
      adminToast.success("AdminSaveSuccess")
    },
    onError: () => adminToast.error("AdminSaveError"),
  })
}
