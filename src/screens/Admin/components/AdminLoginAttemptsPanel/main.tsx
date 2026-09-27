"use client"

import { RotateCcwIcon } from "lucide-react"
import { Button } from "@/components/action/Button"
import { useINTLContext } from "@/providers/intl"
import {
  useAdminLoginAttemptsQuery,
  useAdminLogoutAttemptsMutation,
} from "@/services/auth"

export const AdminLoginAttemptsPanel = () => {
  const intl = useINTLContext()
  const loginQuery = useAdminLoginAttemptsQuery()
  const reset = useAdminLogoutAttemptsMutation()

  const locale = intl.language === "en" ? "en-US" : "pt-BR"

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-ud-neutral-950">
        {intl.t("AdminLoginAttemptsTitle")}
      </h2>
      <p className="mt-1 text-sm text-ud-secondary-600">
        {intl.t("AdminLoginAttemptsDescription")}
      </p>

      {loginQuery.isPending && (
        <p className="mt-4 text-sm text-ud-secondary-600">
          {intl.t("AdminLoginAttemptsLoading")}
        </p>
      )}
      {loginQuery.isError && (
        <p className="mt-4 text-sm text-ud-semantic-error">
          {intl.t("AdminLoginAttemptsLoadError")}
        </p>
      )}
      {loginQuery.data?.length === 0 && (
        <p className="mt-4 rounded border border-ud-neutral-300 bg-ud-neutral-0 p-4 text-sm text-ud-secondary-600">
          {intl.t("AdminLoginAttemptsEmpty")}
        </p>
      )}
      <ul className="mt-4 grid gap-3">
        {loginQuery.data?.map((rateLimit) => (
          <li
            key={rateLimit.ip}
            className="flex flex-col gap-4 rounded border border-ud-neutral-300 bg-ud-neutral-0 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <code className="font-bold text-ud-neutral-950">
                  {rateLimit.ip}
                </code>
                <span className={rateLimit.isBlocked
                  ? "rounded-full bg-ud-semantic-error/10 px-2 py-0.5 text-xs font-bold text-ud-semantic-error"
                  : "rounded-full bg-ud-neutral-200 px-2 py-0.5 text-xs font-bold text-ud-secondary-600"}
                >
                  {rateLimit.isBlocked
                    ? intl.t("AdminLoginAttemptsBlocked")
                    : intl.t("AdminLoginAttemptsActive")}
                </span>
              </div>
              <p className="mt-2 text-sm text-ud-secondary-600">
                {intl.t("AdminLoginAttemptsCount", {
                  count: rateLimit.count,
                  limit: 5,
                })}
              </p>
              <p className="mt-1 text-xs text-ud-secondary-600">
                {intl.t("AdminLoginAttemptsLastAttempt", {
                  date: new Date(rateLimit.lastAttemptAt).toLocaleString(locale),
                })}
              </p>
              <p className="mt-1 text-xs text-ud-secondary-600">
                {intl.t("AdminLoginAttemptsExpiresAt", {
                  date: new Date(rateLimit.expiresAt).toLocaleString(locale),
                })}
              </p>
            </div>
            <Button
              type="button"
              startAdornment={<RotateCcwIcon size={15} aria-hidden="true" />}
              loading={{
                verb: intl.t("AdminLoginAttemptsResetting"),
                state: reset.isPending && reset.variables === rateLimit.ip,
              }}
              onClick={() => reset.mutate(rateLimit.ip)}
            >
              {intl.t("AdminLoginAttemptsReset")}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
