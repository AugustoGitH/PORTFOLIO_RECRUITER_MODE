import { TabWrapper, useTabsContext } from "../../../../components/action/Tabs"
import { Stagger } from "../../../../components/wrapper/Stagger"
import type { ExperiencesTabProps } from "./types"
import { EXPERIENCES, ExperienceKind } from "../../../../constants/profile"
import { ExperienceCard } from "../ExperienceCard"
import { filterByKind } from "../../../../utils/array"

export const ExperiencesTab = (props: ExperiencesTabProps) => {
  const { hasNavigated } = useTabsContext()

  return (
    <TabWrapper tabIndex={props.tab.value}>
      <div className="flex flex-wrap gap-2 w-full">
        <Stagger animate={hasNavigated}>
          {
            filterByKind(EXPERIENCES, props.tab.value, ExperienceKind.All).map(experience => (
              <ExperienceCard
                key={experience.value}
                experience={experience}
              />
            ))
          }
        </Stagger>
      </div>
    </TabWrapper>
  )
}
