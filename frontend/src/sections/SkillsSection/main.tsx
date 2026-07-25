import { Tabs } from "../../components/action/Tabs"

import { Container } from "../../components/layout/Container"
import { SECTIONS, SKILL_TABS } from "../../constants/profile"
import { slug } from "../../utils/string"
import { cn } from "../../utils/tailwind"
import type { PropsWithClassName } from "../../utils/types"
import { useINTLContext } from "../../providers/intl"
import { SkillsTab } from "./components"

export const SkillsSection = (props: PropsWithClassName) => {
  const intl = useINTLContext()

  return (
    <Container id={SECTIONS.skills.value} className={cn("bg-ud-neutral-100", props.className)}>
      <div>
        <h2 className="text-2xl font-bold text-ud-neutral-950">{intl.t(SECTIONS.skills.title)}</h2>
        <Tabs className="mt-2" tabs={SKILL_TABS}>
          {
            SKILL_TABS.map(tab => (
              <SkillsTab key={slug("skill-tab", tab.value)} tab={tab} />
            ))
          }
        </Tabs>
      </div>
    </Container>
  )
}