import { AdminLayout } from "@/components/layout/AdminLayout"
import { AdminDashboardSection } from "./components/AdminDashboardSection"
import type { AdminPageProps } from "./types"

export const AdminPage = ({
  canManageLoginAttempts,
  canManagePublicRateLimits,
}: AdminPageProps) => {
  return (
    <AdminLayout>
      <AdminDashboardSection
        canManageLoginAttempts={canManageLoginAttempts}
        canManagePublicRateLimits={canManagePublicRateLimits}
      />
    </AdminLayout>
  )
}
