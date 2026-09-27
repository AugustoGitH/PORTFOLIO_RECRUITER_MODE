"use client"

import { Container } from "@/components/layout/Container"
import { useINTLContext } from "@/providers/intl"
import { AdminFeedbackPanel } from "../AdminFeedbackPanel"
import type { AdminProfessionalFeedbacksSectionProps } from "./types"

export const AdminProfessionalFeedbacksSection = (props: AdminProfessionalFeedbacksSectionProps) => {
  const intl = useINTLContext()

  return (
    <Container
      className="bg-ud-neutral-100 px-8 py-8"
      contentClassName="max-w-5xl"
    >
      <h1 className="text-2xl font-bold text-ud-neutral-950">
        {intl.t("AdminProfessionalFeedbacksTitle")}
      </h1>
      <p className="mt-2 text-sm text-ud-secondary-600">
        {intl.t("AdminProfessionalFeedbacksDescription")}
      </p>
      <AdminFeedbackPanel {...props} />
    </Container>
  )
}
