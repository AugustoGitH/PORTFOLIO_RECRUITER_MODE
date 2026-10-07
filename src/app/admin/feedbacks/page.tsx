import { AdminPortfolioFeedbacksPage } from "@/screens/AdminPortfolioFeedbacks"
import {
  getAdminPortfolioFeedbacksPageData,
  requireAdminPortfolioFeedbacksPageAccess,
} from "@/server/admin"

type AdminPortfolioFeedbacksRouteProps = {
  searchParams: Promise<{ cursor?: string }>
}

async function Page({ searchParams }: AdminPortfolioFeedbacksRouteProps) {
  const { cursor } = await searchParams
  const access = await requireAdminPortfolioFeedbacksPageAccess()
  const pageData = await getAdminPortfolioFeedbacksPageData(cursor, access)

  return <AdminPortfolioFeedbacksPage {...pageData} />
}

export default Page
