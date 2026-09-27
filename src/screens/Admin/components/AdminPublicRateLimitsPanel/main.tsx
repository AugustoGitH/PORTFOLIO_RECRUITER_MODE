"use client"

import { RotateCcwIcon } from "lucide-react"
import { Button } from "@/components/action/Button"
import { useINTLContext } from "@/providers/intl"
import {
  useAdminPublicRateLimitsQuery,
  useAdminResetPublicRateLimitMutation,
} from "@/services/auth"

export const AdminPublicRateLimitsPanel = () => {
  const intl = useINTLContext()
  const query = useAdminPublicRateLimitsQuery()
  const reset = useAdminResetPublicRateLimitMutation()
  const locale = intl.language === "en" ? "en-US" : "pt-BR"

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-ud-neutral-950">
        {intl.t("AdminPublicRateLimitsTitle")}
      </h2>
      <p className="mt-1 text-sm text-ud-secondary-600">
        {intl.t("AdminPublicRateLimitsDescription")}
      </p>

      {query.isPending && (
        <p className="mt-4 text-sm text-ud-secondary-600">
          {intl.t("AdminPublicRateLimitsLoading")}
        </p>
      )}
      {query.isError && (
        <p className="mt-4 text-sm text-ud-semantic-error">
          {intl.t("AdminPublicRateLimitsLoadError")}
        </p>
      )}
      {query.data?.length === 0 && (
        <p className="mt-4 rounded border border-ud-neutral-300 bg-ud-neutral-0 p-4 text-sm text-ud-secondary-600">
          {intl.t("AdminPublicRateLimitsEmpty")}
        </p>
      )}
      <ul className="mt-4 grid gap-3">
        {query.data?.map((rateLimit) => {
          const mutationKey = `${rateLimit.scope}:${rateLimit.dimension}:${rateLimit.identifier}`
          const activeMutationKey = reset.variables
            ? `${reset.variables.scope}:${reset.variables.dimension}:${reset.variables.identifier}`
            : null

          return (
            <li
              key={mutationKey}
              className="flex flex-col gap-4 rounded border border-ud-neutral-300 bg-ud-neutral-0 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <strong className="text-sm text-ud-neutral-950">
                    {rateLimit.scope}
                  </strong>
                  <span className="rounded-full bg-ud-neutral-200 px-2 py-0.5 text-xs font-bold text-ud-secondary-600">
                    {rateLimit.dimension === "ip"
                      ? intl.t("AdminPublicRateLimitsIp")
                      : intl.t("AdminPublicRateLimitsVisitor")}
                  </span>
                  {rateLimit.isBlocked && (
                    <span className="rounded-full bg-ud-semantic-error/10 px-2 py-0.5 text-xs font-bold text-ud-semantic-error">
                      {intl.t("AdminLoginAttemptsBlocked")}
                    </span>
                  )}
                </div>
                <code className="mt-2 block break-all text-sm text-ud-neutral-950">
                  {rateLimit.identifier}
                </code>
                <p className="mt-2 text-sm text-ud-secondary-600">
                  {intl.t("AdminLoginAttemptsCount", {
                    count: rateLimit.count,
                    limit: rateLimit.limit,
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
                  state: reset.isPending && activeMutationKey === mutationKey,
                }}
                onClick={() => reset.mutate(rateLimit)}
              >
                {intl.t("AdminLoginAttemptsReset")}
              </Button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
