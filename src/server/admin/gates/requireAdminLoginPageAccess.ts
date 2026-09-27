import { redirect } from "next/navigation"
import { getAdminLoginPageData } from "../getAdminPageData"

export const requireAdminLoginPageAccess = async () => {
  const { hasAdminSession } = await getAdminLoginPageData()

  if (hasAdminSession) redirect("/admin")
}