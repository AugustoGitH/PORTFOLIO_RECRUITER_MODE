export const getPostBody = (form: HTMLFormElement) => {
  const data = new FormData(form)

  return {
    slug: String(data.get("slug")),
    status: String(data.get("status")),
    title: String(data.get("title")),
    excerpt: String(data.get("excerpt")),
    markdown: String(data.get("markdown")),
    categoryId: String(data.get("categoryId")),
  }
}
