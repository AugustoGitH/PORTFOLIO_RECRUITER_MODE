import { TabWrapper, useTabsContext } from "../../../../components/action/Tabs"
import { Stagger } from "../../../../components/wrapper/Stagger"
import type { ProjectsTabProps } from "./types"
import { PROJECTS, ProjectKind } from "../../../../constants/profile"
import { Card } from "../../../../components/general/Card"
import { filterByKind } from "../../../../utils/array"
import { useINTLContext } from "../../../../providers/intl"

export const ProjectsTab = (props: ProjectsTabProps) => {
  const { hasNavigated } = useTabsContext()
  const intl = useINTLContext()

  return (
    <TabWrapper tabIndex={props.tab.value}>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2  gap-2">
        <Stagger animate={hasNavigated}>
          {
            filterByKind(PROJECTS, props.tab.value, ProjectKind.All).map(project => (
              <Card
                key={project.value}
                className="w-auto h-full"
                icon={project.icon && <project.icon size={18} />}
                title={project.title}
                description={project.description && intl.t(project.description)}
                links={project.links}
                tags={[]}
              />
            ))
          }
        </Stagger>
      </div>
    </TabWrapper>
  )
}
