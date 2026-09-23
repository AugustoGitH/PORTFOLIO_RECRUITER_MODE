"use client"

import Image from "next/image"
import { useState } from "react"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BlocksIcon,
  BracesIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Code2Icon,
  DatabaseIcon,
  ExternalLinkIcon,
  FileCode2Icon,
  FileTextIcon,
  Grid2X2Icon,
  InfoIcon,
  MonitorIcon,
  ServerIcon,
  SparklesIcon,
  UserRoundIcon,
  UsersRoundIcon,
  WrenchIcon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/action/Button"
import { Chip } from "@/components/action/Chip"
import { Container } from "@/components/layout/Container"
import type { Term } from "@/constants/intl"
import { useINTLContext } from "@/providers/intl"
import { useRecruiterModeContext } from "@/providers/recruiterMode"
import type { Recommendation } from "@/types/service/recommendation"
import { cn } from "@/utils/tailwind"
import type { RecommendationsPanelProps } from "./types"

const ROLE_PRESENTATION: Record<string, { label: Term, icon: LucideIcon }> = {
  frontend: { label: "FrontEnd", icon: MonitorIcon },
  backend: { label: "BackEnd", icon: ServerIcon },
  database: { label: "Database", icon: DatabaseIcon },
  tests: { label: "Tests", icon: FileCode2Icon },
  architecture: { label: "Architecture", icon: BlocksIcon },
  tools: { label: "Tools", icon: WrenchIcon },
}

const SKILL_LABELS: Record<string, string> = {
  react: "React",
  typescript: "TypeScript",
  javascript: "JavaScript",
  nextjs: "Next.js",
  tailwindcss: "Tailwind CSS",
  node: "Node.js",
  postgresql: "PostgreSQL",
  firebase: "Firebase",
  docker: "Docker",
  azure: "Azure",
  rest: "REST",
}

const SENIORITY_TERMS: Record<string, Term> = {
  junior: "Junior",
  "mid-level": "MidLevel",
  senior: "Senior",
}

const strongAugustoCoverage = (roles: string[], seniority: string | null) =>
  roles.length > 0 && (!seniority || seniority === "mid-level")

const getInitials = (name: string) => name
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0]?.toUpperCase())
  .join("")

const RecommendationIllustration = () => (
  <div className="relative mx-auto flex h-44 max-w-sm items-center justify-center" aria-hidden="true">
    <div className="relative z-10 h-32 w-24 -rotate-2 rounded-md border-2 border-ud-secondary-600 bg-ud-neutral-100 p-3 shadow-[7px_7px_0_rgba(124,92,252,0.10)]">
      <UserRoundIcon className="mx-auto mt-1 text-ud-secondary-600" size={35} />
      <span className="mt-3 block h-1.5 rounded-full bg-ud-secondary-300" />
      <span className="mt-2 block h-1.5 w-4/5 rounded-full bg-ud-secondary-300" />
      <span className="mt-2 block h-1.5 w-3/5 rounded-full bg-ud-secondary-300" />
      <span className="absolute -right-2 bottom-3 flex h-9 w-10 items-center justify-center border-2 border-ud-secondary-600 bg-ud-neutral-100">
        <Code2Icon size={22} />
      </span>
    </div>

    <div className="relative z-20 mx-5 flex items-center text-ud-auxiliary-purple">
      <span className="absolute -top-10 left-1/2 -translate-x-1/2"><SparklesIcon size={19} /></span>
      <span className="mr-1 tracking-[0.22em]">•••</span>
      <ArrowRightIcon size={30} strokeWidth={2.5} />
    </div>

    <div className="relative z-10 h-32 w-24 rotate-2 rounded-md border-2 border-ud-auxiliary-purple bg-ud-neutral-100 p-3 shadow-[7px_7px_0_rgba(124,92,252,0.16)]">
      <UserRoundIcon className="mx-auto mt-1 text-ud-auxiliary-purple" size={35} />
      <span className="mt-3 block h-1.5 rounded-full bg-ud-auxiliary-purple/30" />
      <span className="mt-2 block h-1.5 w-4/5 rounded-full bg-ud-auxiliary-purple/30" />
      <span className="mt-2 block h-1.5 w-3/5 rounded-full bg-ud-auxiliary-purple/30" />
      <span className="absolute -right-2 bottom-3 flex h-9 w-10 items-center justify-center border-2 border-ud-auxiliary-purple bg-ud-neutral-100 text-ud-auxiliary-purple">
        <Code2Icon size={22} />
      </span>
    </div>
  </div>
)

const RecommendationCard = ({ recommendation }: { recommendation: Recommendation }) => {
  const intl = useINTLContext()
  const seniorityTerm = SENIORITY_TERMS[recommendation.seniority]

  return (
    <article className="flex h-full flex-col px-5 py-5 md:px-7 md:py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[linear-gradient(145deg,#f1eeff,#e7e1ff)] text-xl font-extrabold text-ud-auxiliary-purple">
            {recommendation.avatarUrl ? (
              <Image
                src={recommendation.avatarUrl}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
                unoptimized
              />
            ) : getInitials(recommendation.displayName)}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-xl font-extrabold text-ud-neutral-950 md:text-2xl">
              {recommendation.displayName}
            </h3>
            <p className="mt-1 text-sm text-ud-secondary-600 md:text-base">{recommendation.headline}</p>
          </div>
        </div>

        {seniorityTerm && (
          <span className="w-fit shrink-0 rounded-full bg-ud-auxiliary-purple-light px-3 py-1.5 text-sm font-medium text-ud-auxiliary-purple">
            {intl.t(seniorityTerm)}
          </span>
        )}
      </div>

      <div className="mt-5 border-y border-ud-neutral-300 py-4">
        <h4 className="flex items-center gap-2 text-sm font-extrabold text-ud-neutral-950 md:text-base">
          <BracesIcon className="text-ud-auxiliary-purple" size={22} aria-hidden="true" />
          {intl.t("RecommendationTechnologies")}
        </h4>
        <div className="mt-3 flex flex-wrap gap-2">
          {recommendation.matchingRoles.map((role) => {
            const presentation = ROLE_PRESENTATION[role]
            if (!presentation) return null
            const Icon = presentation.icon

            return (
              <span key={role} className="inline-flex items-center gap-2 rounded-md border border-ud-neutral-300 bg-ud-neutral-100 px-3 py-2 text-xs font-medium text-ud-secondary-700">
                <Icon className="text-ud-auxiliary-purple" size={17} aria-hidden="true" />
                {intl.t(presentation.label)}
              </span>
            )
          })}
          {recommendation.skills.slice(0, 5).map((skill) => (
            <span key={skill} className="inline-flex items-center gap-2 rounded-md border border-ud-neutral-300 bg-ud-neutral-100 px-3 py-2 text-xs font-medium text-ud-secondary-700">
              <Code2Icon className="text-ud-auxiliary-purple" size={16} aria-hidden="true" />
              {SKILL_LABELS[skill] ?? skill}
            </span>
          ))}
          {recommendation.skills.length > 5 && (
            <span className="inline-flex items-center rounded-md border border-ud-neutral-300 px-3 py-2 text-xs font-bold text-ud-auxiliary-purple">
              +{recommendation.skills.length - 5}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        {recommendation.summary && (
          <p className="flex gap-3 text-sm leading-relaxed text-ud-secondary-700 md:text-base">
            <FileTextIcon className="mt-0.5 shrink-0 text-ud-auxiliary-purple" size={22} aria-hidden="true" />
            <span>{recommendation.summary}</span>
          </p>
        )}
        {recommendation.availability && (
          <p className="mt-3 text-xs font-medium text-ud-secondary-600">
            {intl.t("Availability")}: {recommendation.availability}
          </p>
        )}
        <Button
          href={recommendation.contact.url}
          target="_blank"
          rel="noreferrer noopener"
          highlight
          className="mt-5 w-fit"
          startAdornment={<UserRoundIcon size={18} aria-hidden="true" />}
          endAdornment={<ExternalLinkIcon size={16} aria-hidden="true" />}
        >
          {recommendation.contact.label || intl.t("RecommendationContact")}
        </Button>
      </div>
    </article>
  )
}

export const RecommendationsPanel = ({ recommendations }: RecommendationsPanelProps) => {
  const recruiter = useRecruiterModeContext()
  const intl = useINTLContext()
  const [opened, setOpened] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [showAll, setShowAll] = useState(false)

  if (!recruiter.isRecruiterMode || !recruiter.roles.length) return null

  const shouldOpen = opened || !strongAugustoCoverage(recruiter.roles, recruiter.seniority)
  if (!shouldOpen) {
    return (
      <Container className="bg-ud-neutral-100 py-5">
        <div className="flex justify-center">
          <Button
            type="button"
            onClick={() => setOpened(true)}
            startAdornment={<UsersRoundIcon size={18} aria-hidden="true" />}
          >
            {intl.t("ViewOtherProfiles")}
          </Button>
        </div>
      </Container>
    )
  }

  const safeActiveIndex = recommendations.length
    ? Math.min(activeIndex, recommendations.length - 1)
    : 0
  const activeRecommendation = recommendations[safeActiveIndex]
  const goToPrevious = () => setActiveIndex((safeActiveIndex - 1 + recommendations.length) % recommendations.length)
  const goToNext = () => setActiveIndex((safeActiveIndex + 1) % recommendations.length)

  return (
    <Container className="bg-ud-neutral-100">
      <section className="overflow-hidden rounded-lg border border-ud-neutral-300 bg-ud-neutral-100 shadow-[0_1px_3px_rgba(20,23,60,0.06)] lg:grid lg:grid-cols-[minmax(18rem,0.78fr)_minmax(0,1.22fr)]">
        <aside className="flex flex-col bg-[linear-gradient(145deg,#faf9ff_0%,#f0edff_100%)] p-5 md:p-7 lg:border-r lg:border-ud-neutral-300">
          <Chip size="sm" className="w-fit gap-2">
            <UsersRoundIcon size={17} aria-hidden="true" />
            {intl.t("RecommendationHonestBadge")}
          </Chip>
          <h2 className="mt-5 text-2xl font-extrabold leading-tight text-ud-neutral-950 md:text-3xl">
            {intl.t("RecommendationHonestTitle")}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ud-secondary-600 md:text-base">
            {intl.t("RecommendationHonestDescription")}
          </p>

          <RecommendationIllustration />

          <p className="mt-auto flex gap-3 border-t border-ud-auxiliary-purple/20 pt-5 text-xs leading-relaxed text-ud-secondary-600 md:text-sm">
            <InfoIcon className="shrink-0 text-ud-auxiliary-purple" size={21} aria-hidden="true" />
            <span>{intl.t("RecommendationConditionalNote")}</span>
          </p>
        </aside>

        <div className="min-w-0 p-4 md:p-5">
          <div className="overflow-hidden rounded-lg border border-ud-neutral-300 bg-ud-neutral-100 shadow-[0_10px_28px_rgba(62,48,125,0.07)]">
            <header className="flex flex-wrap items-center gap-3 border-t-[5px] border-t-ud-auxiliary-purple px-5 py-4 md:px-7">
              <h2 className="mr-auto flex items-center gap-3 text-sm font-extrabold uppercase tracking-wide text-ud-auxiliary-purple md:text-base">
                <UsersRoundIcon size={25} aria-hidden="true" />
                {intl.t("RecommendedProfiles")}
              </h2>

              {recommendations.length > 0 && (
                <>
                  <span className="text-sm text-ud-secondary-600">
                    {intl.t("RecommendationCount", {
                      current: showAll ? recommendations.length : safeActiveIndex + 1,
                      total: recommendations.length,
                    })}
                  </span>
                  {!showAll && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={goToPrevious}
                        disabled={recommendations.length < 2}
                        aria-label={intl.t("PreviousRecommendation")}
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-ud-neutral-300 text-ud-auxiliary-purple transition hover:border-ud-auxiliary-purple disabled:cursor-not-allowed disabled:text-ud-neutral-500"
                      >
                        <ChevronLeftIcon size={22} />
                      </button>
                      <button
                        type="button"
                        onClick={goToNext}
                        disabled={recommendations.length < 2}
                        aria-label={intl.t("NextRecommendation")}
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-ud-auxiliary-purple text-ud-auxiliary-purple transition hover:bg-ud-auxiliary-purple hover:text-ud-neutral-0 disabled:cursor-not-allowed disabled:border-ud-neutral-300 disabled:text-ud-neutral-500 disabled:hover:bg-transparent"
                      >
                        <ChevronRightIcon size={22} />
                      </button>
                    </div>
                  )}
                  {recommendations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setShowAll((current) => !current)}
                      className="flex items-center gap-2 text-sm font-medium text-ud-auxiliary-purple hover:underline"
                    >
                      {showAll ? <ArrowLeftIcon size={18} /> : <Grid2X2Icon size={18} />}
                      {intl.t(showAll ? "ViewRecommendationCarousel" : "ViewAllRecommendations")}
                    </button>
                  )}
                </>
              )}
            </header>

            <div className="border-t border-ud-neutral-300">
              {!recommendations.length ? (
                <p className="px-5 py-12 text-center text-sm text-ud-secondary-600">
                  {intl.t("RecommendationEmpty")}
                </p>
              ) : showAll ? (
                <div className="grid divide-y divide-ud-neutral-300 xl:grid-cols-2 xl:divide-y-0">
                  {recommendations.map((recommendation, index) => (
                    <div
                      key={recommendation.id}
                      className={cn("min-w-0", {
                        "xl:border-l xl:border-ud-neutral-300": index % 2 === 1,
                        "xl:border-t xl:border-ud-neutral-300": index > 1,
                      })}
                    >
                      <RecommendationCard recommendation={recommendation} />
                    </div>
                  ))}
                </div>
              ) : activeRecommendation ? (
                <RecommendationCard recommendation={activeRecommendation} />
              ) : null}
            </div>

            {recommendations.length > 1 && !showAll && (
              <div className="px-5 pb-3 text-center md:px-7">
                <div className="flex justify-center gap-2" aria-label={intl.t("RecommendationNavigation")}>
                  {recommendations.map((recommendation, index) => (
                    <button
                      key={recommendation.id}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-label={intl.t("GoToRecommendation", { position: index + 1 })}
                      aria-current={index === safeActiveIndex ? "true" : undefined}
                      className={cn("h-2.5 w-2.5 rounded-full bg-ud-auxiliary-purple/20 transition", {
                        "bg-ud-auxiliary-purple": index === safeActiveIndex,
                      })}
                    />
                  ))}
                </div>
                <p className="mt-3 text-xs text-ud-secondary-600">{intl.t("RecommendationCarouselHelp")}</p>
              </div>
            )}

            <p className="mx-5 border-t border-ud-neutral-300 py-3 text-xs text-ud-secondary-600 md:mx-7">
              {intl.t("RecommendationDisclosure")}
            </p>
          </div>
        </div>
      </section>
    </Container>
  )
}
