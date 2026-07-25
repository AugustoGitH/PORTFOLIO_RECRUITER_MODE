import { use } from "react"
import { MainProvider } from "./providers"
import type { MainProps } from "./types"
import { instance } from "../../libs/axios"
import { AboutSection } from "../../sections/AboutSection"
import { SkillsSection } from "../../sections/SkillsSection"
import { ProjectsSection } from "../../sections/ProjectsSection"
import { ExperiencesSection } from "../../sections/ExperiencesSection"
import { TestimonialsSection } from "../../sections/TestimonialsSection"
import { PageLayout } from "../../components/layout/PageLayout"
import { CongratulationsSection } from "../../sections/CongratulationsSection"


const promise = instance.get("/health").then(res => res.data);


const MainInner = () => {

  const response = use(promise)

  return (
    <PageLayout>
      <AboutSection className="pt-28" />
      <SkillsSection />
      <ProjectsSection />
      <ExperiencesSection />
      <TestimonialsSection />
      <CongratulationsSection className="pb-28" />
    </PageLayout>
  )
}

export const Main = (_props: MainProps) => {
  return (
    <MainProvider>
      <MainInner />
    </MainProvider>
  )
}