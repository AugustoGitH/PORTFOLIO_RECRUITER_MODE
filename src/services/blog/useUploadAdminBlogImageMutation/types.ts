export type AdminBlogImageUpload = {
  mediaId: string
  publicUrl: string
  width: number
  height: number
}

export type UploadAdminBlogImageVariables = {
  id: string
  file: File
  purpose: "content" | "cover"
}
