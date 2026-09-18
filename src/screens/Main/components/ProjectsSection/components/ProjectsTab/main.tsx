import { TabWrapper, useTabsContext } from "../../../../../../components/action/Tabs"
import { Stagger } from "../../../../../../components/wrapper/Stagger"
import type { ProjectsTabProps } from "./types"
import { PROJECTS, ProjectKind } from "../../../../../../constants/profile"
import { filterByKind } from "../../../../../../utils/array"
import { useRecruiterModeContext } from "../../../../../../providers/recruiterMode"
import { sortByRecruiterRoles } from "../../../../../../features/recruiter"
import { ProjectCard } from "../ProjectCard"

export const ProjectsTab = (props: ProjectsTabProps) => {
  const { hasNavigated } = useTabsContext()
  const { isRecruiterMode, roles } = useRecruiterModeContext()
  const projects = sortByRecruiterRoles(filterByKind(PROJECTS, props.tab.value, ProjectKind.All), isRecruiterMode ? roles : [])
  const featuredProject = projects.find((project) => project.value === "budget-xpert")
  const otherProjects = projects.filter((project) => project !== featuredProject)

  return (
    <TabWrapper tabIndex={props.tab.value}>
      <div className={featuredProject ? "grid gap-3 md:grid-cols-[minmax(0,35%)_minmax(0,1fr)]" : "w-full"}>
        {featuredProject && (
          <Stagger animate={hasNavigated}>
            <ProjectCard key={featuredProject.value} project={featuredProject} featured />
          </Stagger>
        )}
        <div className={featuredProject ? "grid content-start gap-2 sm:grid-cols-2" : "grid gap-3 sm:grid-cols-2 lg:grid-cols-3"}>
          <Stagger animate={hasNavigated}>
            {otherProjects.map((project) => (
              <ProjectCard key={project.value} project={project} />
            ))}
          </Stagger>
        </div>
      </div>
    </TabWrapper>
  )
}
