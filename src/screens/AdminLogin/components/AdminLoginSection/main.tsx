"use client"

import type { FormEvent } from "react"
import { LockKeyholeIcon, MailIcon } from "lucide-react"
import { Button } from "@/components/action/Button"
import { Input } from "@/components/input/Input"
import { Container } from "@/components/layout/Container"
import { useINTLContext } from "@/providers/intl"
import { useAdminLoginMutation } from "@/services/auth"

const formatWaitTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`
}

export const AdminLoginSection = () => {
  const intl = useINTLContext()
  const {
    attemptsRemaining,
    isBlocked,
    isPending,
    login,
    secondsUntilRetry,
  } = useAdminLoginMutation()
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isBlocked) return

    const form = new FormData(event.currentTarget)
    login({
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    })
  }

  const attemptsMessage = isBlocked
    ? intl.t("AdminLoginRateLimited", { time: formatWaitTime(secondsUntilRetry) })
    : attemptsRemaining === 1
      ? intl.t("AdminLoginAttemptRemaining")
      : intl.t("AdminLoginAttemptsRemaining", { count: attemptsRemaining })

  return (
    <Container
      className="min-h-screen bg-ud-neutral-0 p-4"
      contentClassName="flex max-w-none items-center justify-center"
    >
      <form
        onSubmit={submit}
        className="w-96 max-w-full rounded-lg border border-ud-neutral-300 bg-ud-neutral-100 p-6 shadow-modal"
      >
        <div className="flex items-center gap-3">
          <span className="rounded-md bg-ud-auxiliary-purple p-2 text-ud-neutral-0">
            <LockKeyholeIcon size={20} />
          </span>
          <div>
            <h1 className="text-xl font-bold text-ud-neutral-950">
              {intl.t("AdminTitle")}
            </h1>
            <p className="text-xs text-ud-secondary-600">
              {intl.t("AdminLoginDescription")}
            </p>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <Input
            required
            disabled={isBlocked}
            name="email"
            type="email"
            label={intl.t("Email")}
            autoComplete="username"
            placeholder="voce@exemplo.com"
          />
          <Input
            required
            disabled={isBlocked}
            name="password"
            type="password"
            label={intl.t("Password")}
            autoComplete="current-password"
          />
        </div>
        <p
          className={isBlocked
            ? "mt-4 text-sm font-medium text-ud-semantic-error"
            : "mt-4 text-sm text-ud-secondary-600"}
          role="status"
          aria-live="polite"
        >
          {attemptsMessage}
        </p>
        <Button
          type="submit"
          disabled={isBlocked}
          highlight
          className="mt-4 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
          loading={{ verb: intl.t("SigningIn"), state: isPending }}
          startAdornment={<MailIcon size={16} />}
        >
          {intl.t("SignIn")}
        </Button>
      </form>
    </Container>
  )
}
