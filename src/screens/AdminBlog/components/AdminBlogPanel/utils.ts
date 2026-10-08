export const getPostBody = (form: HTMLFormElement) => {
  const data = new FormData(form)

  return {
    status: String(data.get("status")),
    categoryId: String(data.get("categoryId")),
  }
}
