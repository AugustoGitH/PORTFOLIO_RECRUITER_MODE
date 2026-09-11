import { Tabs } from "../../../../components/action/Tabs"
import { Container } from "../../../../components/layout/Container"
import { EXPERIENCES, ExperienceKind, SECTIONS } from "../../../../constants/profile"
import { EXPERIENCE_TABS } from "../../../../constants/profile/experiences"
import { slug } from "../../../../utils/string"
import { cn } from "../../../../utils/tailwind"
import type { PropsWithClassName } from "../../../../utils/types"
import { ExperiencesTab } from "./components/ExperiencesTab"
import { useINTLContext } from "../../../../providers/intl"
import { useRecruiterModeContext } from "../../../../providers/recruiterMode"
import { getExperienceMonths, sortByRecruiterRoles } from "../../../../features/recruiter"
import { ExperienceCard } from "./components/ExperienceCard"

const getDurationLabel = (months: number, t: ReturnType<typeof useINTLContext>["t"]) => {
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12
  const parts = []

  if (years) parts.push(`${years} ${t("Year")}`)
  if (remainingMonths) parts.push(`${remainingMonths} ${t("Month")}`)

  return parts.join(` ${t("And")} `)
}

export const ExperiencesSection = (props: PropsWithClassName) => {
  const intl = useINTLContext()
  const { isRecruiterMode, roles } = useRecruiterModeContext()
  const professionalExperiences = EXPERIENCES.filter((experience) => experience.kind === ExperienceKind.Professional)
  const rankedProfessionalExperiences = sortByRecruiterRoles(professionalExperiences, roles)
  const professionalMonths = getExperienceMonths(professionalExperiences)

  return (
    <Container id={SECTIONS.experiences.value} className={cn("bg-ud-neutral-100", props.className)}>
      <div>
        <h2 className="text-2xl font-bold text-ud-neutral-950">{isRecruiterMode ? intl.t("ProfessionalTimeline") : intl.t(SECTIONS.experiences.title)}</h2>
        {isRecruiterMode ? (
          <>
            <p className="mt-2 text-sm text-ud-secondary-600">
              {intl.t("ProfessionalExperienceTotal", { duration: getDurationLabel(professionalMonths, intl.t) })}
            </p>
            <div className="mt-4 space-y-3">
              {rankedProfessionalExperiences.map((experience) => (
                <ExperienceCard key={experience.value} experience={experience} />
              ))}
            </div>
          </>
        ) : (
          <Tabs className="mt-2" tabs={EXPERIENCE_TABS}>
            {EXPERIENCE_TABS.map(tab => <ExperiencesTab key={slug("experience-tab", tab.value)} tab={tab} />)}
          </Tabs>
        )}
      </div>
    </Container>
  )
}
