import { AdminLayout } from "@/components/layout/AdminLayout"
import { AdminPortfolioFeedbacksSection } from "./components"
import type { AdminPortfolioFeedbacksPageProps } from "./types"

export const AdminPortfolioFeedbacksPage = (props: AdminPortfolioFeedbacksPageProps) => {
  return (
    <AdminLayout>
      <AdminPortfolioFeedbacksSection {...props} />
    </AdminLayout>
  )
}
