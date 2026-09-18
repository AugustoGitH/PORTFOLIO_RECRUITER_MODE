import { MainProvider } from "./providers"
import type { MainProps } from "./types"
import { Fragment } from "react"

import { PageLayout } from "../../components/layout/PageLayout"
import { useRecruiterModeContext } from "../../providers/recruiterMode"
import { RecruiterContextPanel, RecommendationsPanel } from "../../features/recruiter"
import { SECTION_ORDER } from "@/constants/portfolio/sections"
import { AboutSection, CongratulationsSection, ExperiencesSection, ProjectsSection, SkillsSection, TestimonialsSection } from "./components"


const MainInner = (props: MainProps) => {
  const { isRecruiterMode } = useRecruiterModeContext()

  const sections = {
    about: <AboutSection className="pt-28" metrics={props.metrics} />,
    refinement: <><RecruiterContextPanel /><RecommendationsPanel recommendations={props.recommendations} /></>,
    skills: <SkillsSection />,
    projects: <ProjectsSection />,
    experiences: <ExperiencesSection />,
    testimonials: <TestimonialsSection feedbacks={props.feedbacks} />,
    feedback: <CongratulationsSection className="pb-28" initialLiked={props.metrics.liked} />,
  }

  const sectionOrder = SECTION_ORDER[isRecruiterMode ? "recruiter" : "default"]

  return (
    <PageLayout>
      {sectionOrder.map((section) => (
        <Fragment key={section}>
          {sections[section]}
        </Fragment>
      ))}
    </PageLayout>
  )
}

export const Main = (props: MainProps) => {
  return (
    <MainProvider>
      <MainInner {...props} />
    </MainProvider>
  )
}
