import axios from "axios"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { ENDPOINTS_BACKEND } from "@/constants/service"
import { useAdminMutationToast } from "@/hooks/admin"
import { http } from "@/libs/http"
import type {
  AdminLoginError,
  AdminLoginPayload,
} from "./types"

const ADMIN_LOGIN_ATTEMPT_LIMIT = 5

export const useAdminLoginMutation = () => {
  const router = useRouter()
  const adminToast = useAdminMutationToast()
  const [attemptsRemaining, setAttemptsRemaining] = useState(
    ADMIN_LOGIN_ATTEMPT_LIMIT,
  )
  const [blockedUntil, setBlockedUntil] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const secondsUntilRetry = blockedUntil
    ? Math.max(0, Math.ceil((blockedUntil - now) / 1_000))
    : 0
  const isBlocked = secondsUntilRetry > 0

  useEffect(() => {
    if (!blockedUntil) return

    const interval = window.setInterval(() => {
      const currentTime = Date.now()

      if (currentTime >= blockedUntil) {
        window.clearInterval(interval)
        setBlockedUntil(null)
        setAttemptsRemaining(ADMIN_LOGIN_ATTEMPT_LIMIT)
        return
      }

      setNow(currentTime)
    }, 1_000)

    return () => window.clearInterval(interval)
  }, [blockedUntil])

  const mutation = useMutation({
    mutationFn: async (payload: AdminLoginPayload) => (
      await http.post(ENDPOINTS_BACKEND.adminLogin(), payload)
    ).data,
    onSuccess: () => {
      adminToast.success("AdminLoginSuccess")
      router.replace("/admin")
      router.refresh()
    },
    onError: (error) => {
      const response = axios.isAxiosError<AdminLoginError>(error)
        ? error.response
        : undefined
      const attemptsRemaining = response?.data?.attemptsRemaining
      const retryAfterSeconds = response?.data?.retryAfterSeconds
      const nextIsBlocked = (
        response?.status === 429 || attemptsRemaining === 0
      ) && typeof retryAfterSeconds === "number"

      if (typeof attemptsRemaining === "number") {
        setAttemptsRemaining(attemptsRemaining)
      }

      if (nextIsBlocked && typeof retryAfterSeconds === "number") {
        const currentTime = Date.now()

        setNow(currentTime)
        setBlockedUntil(currentTime + retryAfterSeconds * 1_000)
      }

      if (!nextIsBlocked) {
        adminToast.error("AdminLoginError")
      }
    },
  })

  return {
    attemptsRemaining,
    isBlocked,
    isPending: mutation.isPending,
    login: mutation.mutate,
    secondsUntilRetry,
  }
}
