import { TabWrapper, useTabsContext } from "../../../../../../components/action/Tabs"
import { Stagger } from "../../../../../../components/wrapper/Stagger"
import type { ProjectsTabProps } from "./types"
import { getSkillByValue, PROJECTS, ProjectKind } from "../../../../../../constants/profile"
import { Card } from "../../../../../../components/general/Card"
import { filterByKind } from "../../../../../../utils/array"
import { useINTLContext } from "../../../../../../providers/intl"
import { useRecruiterModeContext } from "../../../../../../providers/recruiterMode"
import { sortByRecruiterRoles } from "../../../../../../features/recruiter"

export const ProjectsTab = (props: ProjectsTabProps) => {
  const { hasNavigated } = useTabsContext()
  const intl = useINTLContext()
  const { isRecruiterMode, roles } = useRecruiterModeContext()
  const projects = sortByRecruiterRoles(filterByKind(PROJECTS, props.tab.value, ProjectKind.All), isRecruiterMode ? roles : [])

  return (
    <TabWrapper tabIndex={props.tab.value}>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2  gap-2">
        <Stagger animate={hasNavigated}>
          {
            projects.map(project => (
              <div id={`project-${project.value}`} key={project.value}>
                <Card
                  className="w-auto h-full"
                  icon={project.icon && <project.icon size={18} />}
                  title={project.title}
                  description={project.description && intl.t(project.description)}
                  links={project.links}
                  tags={project.skills.map((skillValue) => {
                    const skill = getSkillByValue(skillValue)

                    return {
                      tag: {
                        icon: skill.icon && <skill.icon size={14} />,
                        label: skill.title,
                        value: skill.value,
                      }
                    }
                  })}
                />
              </div>
            ))
          }
        </Stagger>
      </div>
    </TabWrapper>
  )
}
