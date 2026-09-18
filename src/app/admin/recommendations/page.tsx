import { requireAdminPermission } from "@backend/admin/authorization"
import { AdminRecommendationsPanel } from "../AdminRecommendationsPanel"
import { AdminLayout } from "../components/AdminLayout"

export default async function AdminRecommendationsPage() {
  await requireAdminPermission("recommendation.read")

  return (
    <AdminLayout>
      <div className="mx-auto w-full max-w-5xl p-8">
        <AdminRecommendationsPanel />
      </div>
    </AdminLayout>
  )
}
