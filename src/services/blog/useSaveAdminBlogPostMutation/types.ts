import type { AdminBlogPost } from "../useAdminBlogQuery"

export type SaveAdminBlogPostVariables = {
  id?: string
  body: unknown
}

export type UseSaveAdminBlogPostMutationOptions = {
  onSaved?: (
    post: AdminBlogPost | undefined,
    variables: SaveAdminBlogPostVariables,
  ) => void
}
