import { AdminRecommendationsPage } from "@/screens/AdminRecommendations"
import { requireAdminRecommendationsPageAccess } from "@/server/admin"

async function Page() {
  await requireAdminRecommendationsPageAccess()

  return <AdminRecommendationsPage />
}

export default Page
