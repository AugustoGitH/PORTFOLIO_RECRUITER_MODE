import { requireAdminPermission } from "@backend/admin/authorization"
import { AdminLayout } from "./components/AdminLayout"

export default async function AdminPage() {
  await requireAdminPermission("admin.dashboard.read")

  return (
    <AdminLayout>
      <div className="mx-auto w-full max-w-5xl p-8">
        <h1 className="text-2xl font-bold text-ud-neutral-950">Administração</h1>
        <p className="mt-2 text-sm text-ud-secondary-600">Use a navegação lateral para acessar cada área administrativa.</p>
      </div>
    </AdminLayout>
  )
}
