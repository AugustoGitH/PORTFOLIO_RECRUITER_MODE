import { redirect } from "next/navigation"
import { getVerifiedAdminSession } from "@backend/admin/authorization"
import { AdminLoginForm } from "./AdminLoginForm"

export default async function AdminLoginPage() {
  if (await getVerifiedAdminSession()) redirect("/admin")
  return <AdminLoginForm />
}
