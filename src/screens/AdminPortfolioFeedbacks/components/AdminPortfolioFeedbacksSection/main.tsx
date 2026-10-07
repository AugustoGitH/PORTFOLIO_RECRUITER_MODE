"use client"

import Link from "next/link"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/action/Button"
import type { Term } from "@/constants/intl"
import { Container } from "@/components/layout/Container"
import { http } from "@/libs/http"
import { useINTLContext } from "@/providers/intl"
import type { PortfolioFeedbackCategory } from "@/types/service/portfolio-feedback"
import type { AdminPortfolioFeedbacksSectionProps } from "./types"

const categories: PortfolioFeedbackCategory[] = [
  "navigation",
  "content",
  "recruiter",
  "design",
  "general",
]

const categoryTerms: Record<PortfolioFeedbackCategory, Term> = {
  navigation: "PortfolioFeedbackCategoryNavigation",
  content: "PortfolioFeedbackCategoryContent",
  recruiter: "PortfolioFeedbackCategoryRecruiter",
  design: "PortfolioFeedbackCategoryDesign",
  general: "PortfolioFeedbackCategoryGeneral",
}

export const AdminPortfolioFeedbacksSection = ({
  feedbacks: initialFeedbacks,
  nextCursor,
  canModerate,
}: AdminPortfolioFeedbacksSectionProps) => {
  const intl = useINTLContext()
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks)
  const [selectedCategories, setSelectedCategories] = useState<Record<string, PortfolioFeedbackCategory>>(
    Object.fromEntries(initialFeedbacks.map((feedback) => [feedback.id, feedback.category])),
  )
  const moderation = useMutation({
    mutationFn: async ({
      id,
      status,
      category,
    }: {
      id: string
      status: "pending" | "published"
      category: PortfolioFeedbackCategory
    }) => (await http.patch<Pick<(typeof initialFeedbacks)[number], "id" | "status" | "category">>(
      `api/admin/portfolio-feedbacks/${id}`,
      { status, category },
    )).data,
    onSuccess: (updated) => {
      setFeedbacks((current) => current.map((feedback) => (
        feedback.id === updated.id ? { ...feedback, ...updated } : feedback
      )))
    },
  })

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
            <div className="mt-4 flex flex-wrap items-end gap-2 border-t border-ud-neutral-200 pt-3">
              <label className="grid gap-1 text-xs font-medium text-ud-neutral-950">
                {intl.t("AdminPortfolioFeedbackCategory")}
                <select
                  value={selectedCategories[feedback.id]}
                  disabled={!canModerate || moderation.isPending}
                  onChange={(event) => setSelectedCategories((current) => ({
                    ...current,
                    [feedback.id]: event.target.value as PortfolioFeedbackCategory,
                  }))}
                  className="min-h-9 rounded-sm border border-ud-neutral-300 bg-ud-neutral-0 px-2"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {intl.t(categoryTerms[category])}
                    </option>
                  ))}
                </select>
              </label>
              {canModerate && (
                <Button
                  type="button"
                  highlight={feedback.status !== "published"}
                  disabled={feedback.status !== "published" && !feedback.publicationConsent}
                  loading={{
                    verb: intl.t("AdminPortfolioFeedbackSaving"),
                    state: moderation.isPending && moderation.variables?.id === feedback.id,
                  }}
                  onClick={() => moderation.mutate({
                    id: feedback.id,
                    status: feedback.status === "published" ? "pending" : "published",
                    category: selectedCategories[feedback.id],
                  })}
                  className="min-h-9 py-1"
                >
                  {intl.t(feedback.status === "published"
                    ? "AdminPortfolioFeedbackHide"
                    : "AdminPortfolioFeedbackPublish")}
                </Button>
              )}
              <span className="pb-2 text-xs text-ud-secondary-600">
                {intl.t(feedback.status === "published"
                  ? "AdminPortfolioFeedbackPublished"
                  : "AdminPortfolioFeedbackPending")}
              </span>
              <span className="pb-2 text-xs text-ud-secondary-600">
                {intl.t(feedback.publicationConsent
                  ? "AdminPortfolioFeedbackAuthorized"
                  : "AdminPortfolioFeedbackNotAuthorized")}
              </span>
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
