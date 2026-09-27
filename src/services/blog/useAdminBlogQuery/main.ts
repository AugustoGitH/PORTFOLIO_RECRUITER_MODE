import { useQuery } from "@tanstack/react-query"
import { ENDPOINTS_BACKEND, QUERY_KEYS } from "@/constants/service"
import { http } from "@/libs/http"
import type { AdminBlogData } from "./types"

export const useAdminBlogQuery = () => useQuery({
  queryKey: [QUERY_KEYS.adminBlog()],
  queryFn: async () => (
    await http.get<AdminBlogData>(ENDPOINTS_BACKEND.adminBlog())
  ).data,
})
