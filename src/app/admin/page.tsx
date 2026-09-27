import { AdminPage } from "@/screens/Admin"
import {
  getAdminDashboardPageData,
  requireAdminDashboardPageAccess,
} from "@/server/admin"

async function Page() {
  const access = await requireAdminDashboardPageAccess()
  const data = getAdminDashboardPageData(access)

  return <AdminPage {...data} />
}

export default Page
