import { AdminProfessionalFeedbacksPage } from "@/screens/AdminProfessionalFeedbacks"
import {
  getAdminProfessionalFeedbacksPageData,
  requireAdminProfessionalFeedbacksPageAccess,
} from "@/server/admin"

async function Page() {
  const access = await requireAdminProfessionalFeedbacksPageAccess()
  const pageData = await getAdminProfessionalFeedbacksPageData(access)

  return <AdminProfessionalFeedbacksPage {...pageData} />
}

export default Page
