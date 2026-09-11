import { MainProvider } from "./providers"
import type { MainProps } from "./types"
import { AboutSection } from "./sections/AboutSection"
import { SkillsSection } from "./sections/SkillsSection"
import { ProjectsSection } from "./sections/ProjectsSection"
import { ExperiencesSection } from "./sections/ExperiencesSection"
import { TestimonialsSection } from "./sections/TestimonialsSection"
import { PageLayout } from "../../components/layout/PageLayout"
import { CongratulationsSection } from "./sections/CongratulationsSection"
import { useRecruiterModeContext } from "../../providers/recruiterMode"
import { RecruiterContextPanel } from "../../features/recruiter"

const SECTION_ORDER = {
  default: ["about", "skills", "projects", "experiences", "testimonials", "feedback"],
  recruiter: ["about", "refinement", "experiences", "projects", "skills", "testimonials", "feedback"],
} as const

const MainInner = (props: MainProps) => {
  const { isRecruiterMode } = useRecruiterModeContext()
  const sections = {
    about: <AboutSection className="pt-28" initialViews={props.initialViews} initialLikes={props.initialLikes} initialLiked={props.initialLiked} initialResumeDownloads={props.initialResumeDownloads} />,
    refinement: <RecruiterContextPanel />,
    skills: <SkillsSection />,
    projects: <ProjectsSection />,
    experiences: <ExperiencesSection />,
    testimonials: <TestimonialsSection />,
    feedback: <CongratulationsSection className="pb-28" initialLiked={props.initialLiked} />,
  }
  const sectionOrder = SECTION_ORDER[isRecruiterMode ? "recruiter" : "default"]

  return (
    <PageLayout>
      {sectionOrder.map((section) => sections[section])}
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
