import Image from "next/image"
import { TabWrapper, useTabsContext } from "../../../../../../components/action/Tabs"
import { Tag } from "../../../../../../components/action/Tag"
import { Chip } from "../../../../../../components/action/Chip"
import { Stagger } from "../../../../../../components/wrapper/Stagger"
import type { SkillsTabProps } from "./types"
import { getSkillByValue, SKILLS, SkillKind } from "../../../../../../constants/profile"
import type { Term } from "../../../../../../constants/intl"
import { filterByKind } from "../../../../../../utils/array"
import { useINTLContext } from "../../../../../../providers/intl"

const SKILL_TAB_COPY: Record<SkillKind, { title: Term, description: Term }> = {
  [SkillKind.Frontend]: { title: "SkillsFrontendTitle", description: "SkillsFrontendDescription" },
  [SkillKind.Backend]: { title: "SkillsBackendTitle", description: "SkillsBackendDescription" },
  [SkillKind.DataBase]: { title: "SkillsDatabaseTitle", description: "SkillsDatabaseDescription" },
  [SkillKind.Tests]: { title: "SkillsTestsTitle", description: "SkillsTestsDescription" },
  [SkillKind.Architecture]: { title: "SkillsArchitectureTitle", description: "SkillsArchitectureDescription" },
  [SkillKind.Tools]: { title: "SkillsToolsTitle", description: "SkillsToolsDescription" },
}

export const SkillsTab = (props: SkillsTabProps) => {
  const { hasNavigated } = useTabsContext()
  const intl = useINTLContext()
  const copy = SKILL_TAB_COPY[props.tab.value]

  return (
    <TabWrapper tabIndex={props.tab.value}>
      <div className="grid gap-5 rounded-md border border-ud-neutral-300 bg-ud-neutral-100 p-4 md:grid-cols-[minmax(0,30%)_minmax(0,1fr)] md:gap-6 md:p-5">
        <div className="flex self-start items-center justify-center border-b border-ud-neutral-300 pb-4 md:border-r md:border-b-0 md:pr-5 md:pb-0">
          <Image
            src="/assets/profile/skills-code-coffee.png"
            alt={intl.t("SkillsArtworkAlt")}
            width={300}
            height={208}
            className="h-auto w-full max-w-[260px]"
          />
        </div>
        <div className="min-w-0">
          <Chip size="sm">{intl.t(props.tab.label)}</Chip>
          <h3 className="mt-1 text-lg font-bold leading-tight text-ud-neutral-950">{intl.t(copy.title)}</h3>
          <p className="mt-0.5 text-xs text-ud-secondary-600">{intl.t(copy.description)}</p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            <Stagger animate={hasNavigated}>
              {filterByKind(SKILLS, props.tab.value).map((skillEntry) => {
                const skill = getSkillByValue(skillEntry.value)

                return (
                  <Tag
                    key={skill.value}
                    className="min-h-12 rounded-md px-2.5 py-2 text-xs shadow-[0_1px_2px_rgba(20,23,60,0.04)]"
                    tag={{
                      icon: skill.icon && <skill.icon size={20} />,
                      label: skill.title,
                      value: skill.value,
                    }}
                    description={intl.t("SkillsTagDetail")}
                  />
                )
              })}
            </Stagger>
          </div>
        </div>
      </div>
    </TabWrapper>
  )
}
