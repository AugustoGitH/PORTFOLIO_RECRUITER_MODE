"use client"

import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { LogOutIcon } from "lucide-react"
import { Button } from "@/components/action/Button"
import { http } from "@/libs/http"
import { useAdminMutationToast } from "@/hooks/admin"
import { useINTLContext } from "@/providers/intl"

export const AdminLogoutButton = () => {
  const intl = useINTLContext()
  const router = useRouter()
  const adminToast = useAdminMutationToast()
  const logoutMutation = useMutation({
    mutationFn: () => http.post("api/admin/auth/logout"),
    onSuccess: () => {
      adminToast.success("AdminLogoutSuccess")
      router.replace("/admin/login")
      router.refresh()
    },
    onError: () => adminToast.error("AdminLogoutError"),
  })

  return (
    <Button
      type="button"
      onClick={() => logoutMutation.mutate()}
      loading={{ verb: intl.t("Logout"), state: logoutMutation.isPending }}
      startAdornment={<LogOutIcon size={15} />}
      className="w-full justify-center"
    >
      {intl.t("Logout")}
    </Button>
  )
}
