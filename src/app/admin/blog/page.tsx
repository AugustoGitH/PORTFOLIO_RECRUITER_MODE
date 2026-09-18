import { requireAdminPermission } from "@backend/admin/authorization"
import { AdminLayout } from "../components/AdminLayout"
import { AdminBlogPanel } from "./AdminBlogPanel"

export default async function AdminBlogPage() {
  await requireAdminPermission("blog.read")
  return (
    <AdminLayout>
      <div className="mx-auto w-full max-w-6xl p-8">
        <AdminBlogPanel />
      </div>
    </AdminLayout>
  )
}
