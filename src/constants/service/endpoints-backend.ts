export const ENDPOINTS_BACKEND = {
  resumes: (lang: string) => `/api/resumes/default?locale=${lang}`,
  metrics: () => "/api/metrics",
  metricLike: () => "/api/metrics/like",
  adminBlog: () => "/api/admin/blog",
  adminBlogPost: (id: string) => `/api/admin/blog/${id}`,
  adminBlogCategories: () => "/api/admin/blog/categories",
  adminBlogCategory: (id: string) => `/api/admin/blog/categories/${id}`,
  adminBlogGlossary: () => "/api/admin/blog/glossary",
  adminBlogGlossaryEntry: (id: string) => `/api/admin/blog/glossary/${id}`,
  adminBlogImage: () => "/api/admin/media/blog-image",
  adminBlogPostImage: (postId: string, mediaId: string) =>
    `/api/admin/blog/${postId}/images/${mediaId}`,
  adminLogin: () => "/api/admin/auth/login",
  adminLoginAttempts: () => "api/admin/auth/login-attempts",
  adminPublicRateLimits: () => "api/admin/rate-limits"
}
