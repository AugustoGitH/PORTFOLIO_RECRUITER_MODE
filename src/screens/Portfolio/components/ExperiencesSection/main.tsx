import { Tabs } from "../../../../components/action/Tabs"
import { ResponsiveAsciiArt } from "../../../../components/general/AsciiArt"
import { TitleSection } from "../../../../components/general/TitleSection"
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
          <TitleSection
            tag={intl.t("CareerPath")}
            title={intl.t(isRecruiterMode ? "ProfessionalTimeline" : SECTIONS.experiences.title)}
            subtitle={isRecruiterMode
              ? intl.t("ProfessionalExperienceTotal", { duration: getDurationLabel(professionalMonths, intl.t) })
              : intl.t("ExperiencesIntro")}
          />
          <ResponsiveAsciiArt
            src="/assets/profile/experiences-steps.png"
            alt={intl.t("ExperiencesArtworkAlt")}
            initialWidth={240}
            columns={96}
            rows={31}
            palette="source"
            wrapperClassName="hidden w-60 shrink-0 md:block"
          />
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
