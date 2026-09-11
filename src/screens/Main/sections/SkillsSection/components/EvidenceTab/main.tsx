import { TabWrapper, useTabsContext } from "../../../../../../components/action/Tabs"
import { Stagger } from "../../../../../../components/wrapper/Stagger"
import { useINTLContext } from "../../../../../../providers/intl"
import { cn } from "../../../../../../utils/tailwind"
import type { EvidenceTabProps } from "./types"

const getEvidenceDuration = (months: number, t: ReturnType<typeof useINTLContext>["t"]) => {
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12
  const parts = []

  if (years) parts.push(`${years} ${t("Year")}`)
  if (remainingMonths) parts.push(`${remainingMonths} ${t("Month")}`)

  return parts.join(` ${t("And")} `)
}

const formatCourseDate = (issuedAt: string, language: "ptbr" | "en") => {
  return new Intl.DateTimeFormat(language === "ptbr" ? "pt-BR" : "en", {
    month: "short",
    year: "numeric",
  }).format(new Date(`${issuedAt}-01T00:00:00`))
}

export const EvidenceTab = (props: EvidenceTabProps) => {
  const intl = useINTLContext()
  const { hasNavigated } = useTabsContext()
  const evidence = props.evidence.filter((entry) => entry.skill.kind === props.tab.value)

  return (
    <TabWrapper tabIndex={props.tab.value}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
        <Stagger animate={hasNavigated}>
          {evidence.map((entry) => (
            <article key={entry.skill.value} className={cn("border border-ud-neutral-300 rounded p-3", {
              "border-ud-auxiliary-purple": props.highlightedSkillValues.includes(entry.skill.value),
            })}>
              <div className={cn("flex items-center gap-2", {
                "text-ud-auxiliary-purple": props.highlightedSkillValues.includes(entry.skill.value),
              })}>
                {entry.skill.icon && <entry.skill.icon size={18} />}
                <h3 className="font-bold">{entry.skill.title}</h3>
              </div>
              <p className="mt-2 text-xs text-ud-secondary-600">
                {getEvidenceDuration(entry.professionalMonths, intl.t) || "—"} · {entry.professionalExperienceCount} {intl.t("ProfessionalExperiences")} · {entry.projects.length} {intl.t("ProjectsBuilt")}
              </p>
              {(entry.experiences.length || entry.projects.length) > 0 && (
                <nav className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-xs" aria-label={intl.t("Evidence")}>
                  {entry.experiences.map((reference) => <a className="underline underline-offset-2" key={reference.value} href={reference.href}>{reference.title}</a>)}
                  {entry.projects.map((reference) => <a className="underline underline-offset-2" key={reference.value} href={reference.href}>{reference.title}</a>)}
                </nav>
              )}
              {entry.courses.length > 0 && (
                <div className="mt-3 border-t border-ud-neutral-300 pt-3 text-xs">
                  <span className="block font-bold">{intl.t("Courses")}</span>
                  <ul className="mt-1 space-y-1 text-ud-secondary-600">
                    {entry.courses.map((course) => (
                      <li key={course.title}>{course.title} · {course.issuer} · {formatCourseDate(course.issuedAt, intl.language)}</li>
                    ))}
                  </ul>
                </div>
              )}
              {entry.learningEvidence.length > 0 && (
                <div className="mt-3 border-t border-ud-neutral-300 pt-3 text-xs">
                  <span className="block font-bold">{intl.t("LearningInContext")}</span>
                  {entry.learningEvidence.map((learning) => (
                    <p className="mt-1 text-ud-secondary-600" key={learning.description}>{intl.t(learning.description)}</p>
                  ))}
                </div>
              )}
            </article>
          ))}
        </Stagger>
      </div>
    </TabWrapper>
  )
}
