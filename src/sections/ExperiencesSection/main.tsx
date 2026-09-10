import { Tabs } from "../../components/action/Tabs"
import { Container } from "../../components/layout/Container"
import { SECTIONS } from "../../constants/profile"
import { EXPERIENCE_TABS } from "../../constants/profile/experiences"
import { slug } from "../../utils/string"
import { cn } from "../../utils/tailwind"
import type { PropsWithClassName } from "../../utils/types"
import { ExperiencesTab } from "./components/ExperiencesTab"
import { useINTLContext } from "../../providers/intl"

export const ExperiencesSection = (props: PropsWithClassName) => {
  const intl = useINTLContext()

  return (
    <Container id={SECTIONS.experiences.value} className={cn("bg-ud-neutral-100", props.className)}>
      <div>
        <h2 className="text-2xl font-bold text-ud-neutral-950">{intl.t(SECTIONS.experiences.title)}</h2>
        <Tabs className="mt-2" tabs={EXPERIENCE_TABS}>
          {
            EXPERIENCE_TABS.map(tab => (
              <ExperiencesTab key={slug("experience-tab", tab.value)} tab={tab} />
            ))
          }
        </Tabs>
      </div>
    </Container>
  )
}