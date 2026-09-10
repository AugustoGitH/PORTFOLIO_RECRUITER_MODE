import { TabWrapper, useTabsContext } from "../../../../components/action/Tabs"
import { Tag } from "../../../../components/action/Tag"
import { Stagger } from "../../../../components/wrapper/Stagger"
import type { SkillsTabProps } from "./types"
import { SKILLS } from "../../../../constants/profile"
import { filterByKind } from "../../../../utils/array"

export const SkillsTab = (props: SkillsTabProps) => {
  const { hasNavigated } = useTabsContext()

  return (
    <TabWrapper tabIndex={props.tab.value}>
      <div className="flex flex-wrap gap-2">
        <Stagger animate={hasNavigated}>
          {
            filterByKind(SKILLS, props.tab.value).map(skill => (
              <Tag key={skill.value}
                tag={{
                  icon: skill.icon && <skill.icon size={18} />,
                  label: skill.title,
                  value: skill.value
                }}
              />
            ))
          }
        </Stagger>
      </div>
    </TabWrapper>
  )
}
