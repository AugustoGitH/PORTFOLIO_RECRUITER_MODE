import { AdminLayout } from "@/components/layout/AdminLayout"
import { AdminProfessionalFeedbacksSection } from "./components"
import type { AdminProfessionalFeedbacksPageProps } from "./types"

export const AdminProfessionalFeedbacksPage = (props: AdminProfessionalFeedbacksPageProps) => {
  return (
    <AdminLayout>
      <AdminProfessionalFeedbacksSection {...props} />
    </AdminLayout>
  )
}
