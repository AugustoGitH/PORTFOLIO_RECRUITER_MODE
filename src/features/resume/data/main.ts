import { ABOUT, ExperienceKind, EXPERIENCES, GROUP_LINKS, SKILLS, SKILL_TABS } from "../../../constants/profile"
import { INTL_TERMS, type Term } from "../../../constants/intl"
import type { INTLTranslateFunction } from "../../../providers/intl"
import type { ResumeDefinition, ResumeLocale } from "../types"
import type { ResumeProfile } from "./types"

const stripHtml = (value: string) => value.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()

const translate = (locale: ResumeLocale) => (term: Term) => INTL_TERMS[term][locale]

const formatPeriod = (startDate: string, endDate: string | null, locale: ResumeLocale) => {
  const formatter = new Intl.DateTimeFormat(locale === "ptbr" ? "pt-BR" : "en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })

  const start = formatter.format(new Date(`${startDate}T00:00:00Z`))
  const end = endDate ? formatter.format(new Date(`${endDate}T00:00:00Z`)) : locale === "ptbr" ? "Atual" : "Present"

  return `${start} — ${end}`
}

export const toResumeProfile = (_definition: ResumeDefinition, locale: ResumeLocale): ResumeProfile => {
  const t = translate(locale)
  const aboutDescriptions = ABOUT.description.content(ABOUT, t as INTLTranslateFunction)

  return {
    locale,
    name: ABOUT.name,
    roles: ABOUT.role.map(t),
    summary: aboutDescriptions.map(stripHtml),
    links: GROUP_LINKS.main
      .filter((link) => link.title === "GitHub" || link.title === "Linkedin")
      .map(({ title, href }) => ({ label: title, href })),
    experiences: [...EXPERIENCES]
      .sort((first, second) => second.rangeDate[0].localeCompare(first.rangeDate[0]))
      .map((experience) => ({
        organization: experience.title,
        kind: t(experience.kind === ExperienceKind.Professional ? "Professional" : "Volunteering"),
        period: formatPeriod(experience.rangeDate[0], experience.rangeDate[1], locale),
        description: experience.description ? stripHtml(t(experience.description)) : "",
        skills: experience.skills?.map((skill) => skill.label) ?? [],
      })),
    skillGroups: SKILL_TABS.map((tab) => ({
      title: t(tab.label),
      skills: SKILLS.filter((skill) => skill.kind === tab.value).map((skill) => skill.title),
    })),
    labels: {
      summary: t("ResumeSummary"),
      experience: t("Experiences"),
      skills: t("Skills"),
      technologies: t("ResumeTechnologies"),
    },
  }
}

export { stripHtml }
