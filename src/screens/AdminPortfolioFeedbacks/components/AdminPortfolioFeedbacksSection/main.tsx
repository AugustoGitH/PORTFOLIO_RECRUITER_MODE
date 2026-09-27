"use client"

import Link from "next/link"
import { Container } from "@/components/layout/Container"
import { useINTLContext } from "@/providers/intl"
import type { AdminPortfolioFeedbacksSectionProps } from "./types"

export const AdminPortfolioFeedbacksSection = ({
  feedbacks,
  nextCursor,
}: AdminPortfolioFeedbacksSectionProps) => {
  const intl = useINTLContext()

  return (
    <Container
      className="bg-ud-neutral-100 px-8 py-8"
      contentClassName="max-w-5xl"
    >
      <h1 className="text-2xl font-bold text-ud-neutral-950">
        {intl.t("AdminPortfolioFeedbacksTitle")}
      </h1>
      <p className="mt-2 text-sm text-ud-secondary-600">
        {intl.t("AdminPortfolioFeedbacksDescription")}
      </p>
      <div className="mt-6 grid gap-2">
        {feedbacks.length > 0 ? feedbacks.map((feedback) => (
          <article
            key={feedback.id}
            className="rounded border border-ud-neutral-300 bg-ud-neutral-0 p-4 text-sm"
          >
            <p className="whitespace-pre-wrap text-ud-neutral-950">
              {feedback.message}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ud-secondary-600">
              <span>{intl.t("AdminVisitorLabel")}: {feedback.visitorId}</span>
              <time dateTime={feedback.submittedAt}>
                {new Date(feedback.submittedAt).toLocaleString(intl.language === "ptbr" ? "pt-BR" : "en-US")}
              </time>
            </div>
          </article>
        )) : (
          <p className="text-sm text-ud-secondary-600">
            {intl.t("AdminPortfolioFeedbacksEmpty")}
          </p>
        )}
      </div>
      {nextCursor && (
        <Link
          href={`/admin/feedbacks?cursor=${encodeURIComponent(nextCursor)}`}
          className="mt-4 inline-flex rounded-sm border border-ud-neutral-300 px-3 py-2 text-sm hover:border-ud-neutral-950"
        >
          {intl.t("AdminLoadMore")}
        </Link>
      )}
    </Container>
  )
}
