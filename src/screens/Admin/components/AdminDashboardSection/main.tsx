"use client"

import { Container } from "@/components/layout/Container"
import { useINTLContext } from "@/providers/intl"
import { AdminLoginAttemptsPanel } from "../AdminLoginAttemptsPanel"
import { AdminPublicRateLimitsPanel } from "../AdminPublicRateLimitsPanel"
import type { AdminDashboardSectionProps } from "./types"

export const AdminDashboardSection = ({
  canManageLoginAttempts,
  canManagePublicRateLimits,
}: AdminDashboardSectionProps) => {
  const intl = useINTLContext()

  return (
    <Container
      className="bg-ud-neutral-100 px-8 py-8"
      contentClassName="max-w-5xl"
    >
      <h1 className="text-2xl font-bold text-ud-neutral-950">
        {intl.t("AdminTitle")}
      </h1>
      <p className="mt-2 text-sm text-ud-secondary-600">
        {intl.t("AdminDashboardDescription")}
      </p>
      {canManageLoginAttempts && <AdminLoginAttemptsPanel />}
      {canManagePublicRateLimits && <AdminPublicRateLimitsPanel />}
    </Container>
  )
}
