import { AdminBlogPage } from "@/screens/AdminBlog"
import { requireAdminBlogPageAccess } from "@/server/admin"

async function Page() {
  await requireAdminBlogPageAccess()

  return <AdminBlogPage />
}

export default Page
