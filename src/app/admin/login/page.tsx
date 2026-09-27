import { AdminLoginPage } from "@/screens/AdminLogin"
import { requireAdminLoginPageAccess } from "@/server/admin"

async function Page() {
  await requireAdminLoginPageAccess()

  return <AdminLoginPage />
}

export default Page
