"use client"

import { useRouter } from "next/navigation"
import { LogOutIcon } from "lucide-react"
import { Button } from "../../components/action/Button"

export const AdminLogoutButton = () => {
  const router = useRouter()
  const logout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" })
    router.replace("/admin/login")
    router.refresh()
  }

  return <Button type="button" onClick={logout} startAdornment={<LogOutIcon size={15} />}>Sair</Button>
}
