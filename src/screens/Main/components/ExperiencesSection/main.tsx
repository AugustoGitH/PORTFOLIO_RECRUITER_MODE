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
import { getDurationLabel } from "@/utils/date"



export const ExperiencesSection = (props: PropsWithClassName) => {
  const intl = useINTLContext()
  const { isRecruiterMode, roles } = useRecruiterModeContext()
  const professionalExperiences = EXPERIENCES.filter((experience) => experience.kind === ExperienceKind.Professional)
  const rankedProfessionalExperiences = sortByRecruiterRoles(professionalExperiences, roles)
  const professionalMonths = getExperienceMonths(professionalExperiences)

  return (
    <Container id={SECTIONS.experiences.value} className={cn("bg-ud-neutral-100", props.className)}>
      <div>
        <div className="flex items-start justify-between gap-6 pb-3">
          <div>
            <Chip size="sm">{intl.t("Experiences")}</Chip>
            <h2 className="mt-2 text-3xl font-bold text-ud-neutral-950">
              {intl.t(isRecruiterMode ? "ProfessionalTimeline" : SECTIONS.experiences.title)}
            </h2>
            <p className="mt-1 text-sm text-ud-secondary-600">
              {isRecruiterMode
                ? intl.t("ProfessionalExperienceTotal", { duration: getDurationLabel(professionalMonths, intl.t) })
                : intl.t("ExperiencesIntro")}
            </p>
          </div>
          <Image src="/assets/profile/experiences-steps.png" alt={intl.t("ExperiencesArtworkAlt")} width={310} height={165} className="hidden h-auto w-60 shrink-0 md:block" />
        </div>
        {isRecruiterMode ? (
          <>
            <div className="mt-4 space-y-3">
              {rankedProfessionalExperiences.map((experience) => (
                <ExperienceCard key={experience.value} experience={experience} />
              ))}
            </div>
          </>
        ) : (
          <Tabs className="mt-3" tabs={EXPERIENCE_TABS}>
            {EXPERIENCE_TABS.map(tab => <ExperiencesTab key={slug("experience-tab", tab.value)} tab={tab} />)}
          </Tabs>
        )}
      </div>
    </Container>
  )
}
import Image from "next/image"
import { Chip } from "../../../../components/action/Chip"
