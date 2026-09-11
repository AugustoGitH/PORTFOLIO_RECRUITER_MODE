import { Tabs } from "../../../../components/action/Tabs"
import { Container } from "../../../../components/layout/Container"
import { PROJECT_TABS, ProjectKind, SECTIONS } from "../../../../constants/profile"
import { cn } from "../../../../utils/tailwind"
import type { PropsWithClassName } from "../../../../utils/types"
import { ProjectsTab } from "./components"
import { slug } from "../../../../utils/string"
import { useINTLContext } from "../../../../providers/intl"
import { useRecruiterModeContext } from "../../../../providers/recruiterMode"

export const ProjectsSection = (props: PropsWithClassName) => {
  const intl = useINTLContext()
  const { isRecruiterMode } = useRecruiterModeContext()

  return (
    <Container id={SECTIONS.projects.value} className={cn("bg-ud-neutral-100", props.className)}>
      <div>
        <h2 className="text-2xl font-bold text-ud-neutral-950">{intl.t(SECTIONS.projects.title)}</h2>
        <Tabs key={isRecruiterMode ? "recruiter" : "default"} className="mt-2" tabs={PROJECT_TABS} initialTab={isRecruiterMode ? ProjectKind.Professional : ProjectKind.All}>
          {
            PROJECT_TABS.map(tab => (
              <ProjectsTab key={slug("project-tab", tab.value)} tab={tab} />
            ))
          }

        </Tabs>
      </div>
    </Container>
  )
}
