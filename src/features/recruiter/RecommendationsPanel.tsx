"use client"

import { useState } from "react"
import { Button } from "../../components/action/Button"
import { Container } from "../../components/layout/Container"
import { useINTLContext } from "../../providers/intl"
import { useRecruiterModeContext } from "../../providers/recruiterMode"
import type { MainProps } from "../../screens/Main/types"

const strongAugustoCoverage = (roles: string[], seniority: string | null) =>
  roles.length > 0 && (!seniority || seniority === "mid-level")

export const RecommendationsPanel = ({ recommendations }: { recommendations: MainProps["recommendations"] }) => {
  const recruiter = useRecruiterModeContext()
  const intl = useINTLContext()
  const [opened, setOpened] = useState(false)

  if (!recruiter.isRecruiterMode || !recruiter.roles.length) return null

  const shouldOpen = opened || !strongAugustoCoverage(recruiter.roles, recruiter.seniority)
  if (!shouldOpen) {
    return (
      <Container className="bg-ud-neutral-100">
        <Button type="button" onClick={() => setOpened(true)}>{intl.t("ViewOtherProfiles")}</Button>
      </Container>
    )
  }

  return (
    <Container className="bg-ud-neutral-100">
      <section className="rounded border border-ud-neutral-300 bg-ud-neutral-0 p-4">
        <h2 className="font-extrabold text-ud-neutral-950">{intl.t("OtherProfiles")}</h2>
        {recommendations.length ? (
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {recommendations.map((item) => (
              <article key={item.id} className="rounded border border-ud-neutral-300 p-3">
                <div className="flex items-center gap-2">
                  {item.avatarUrl ? <img src={item.avatarUrl} alt="" className="h-9 w-9 rounded-full object-cover" /> : <div className="h-9 w-9 rounded-full border border-ud-neutral-300" />}
                  <b className="text-ud-neutral-950">{item.displayName}</b>
                </div>
                <p className="mt-1 text-xs text-ud-secondary-600">{item.headline} · {item.seniority}</p>
                <p className="mt-2 text-xs text-ud-secondary-600">{item.matchingRoles.join(" · ")} · {item.skills.join(", ")}</p>
                {item.summary && <p className="mt-2 text-xs text-ud-secondary-600">{item.summary}</p>}
                <a className="mt-3 inline-block text-sm underline" href={item.contact.url} target="_blank" rel="noreferrer noopener">
                  {item.contact.label || intl.t("RecommendationContact")}
                </a>
              </article>
            ))}
          </div>
        ) : <p className="mt-2 text-sm text-ud-secondary-600">{intl.t("RecommendationEmpty")}</p>}
      </section>
    </Container>
  )
}
