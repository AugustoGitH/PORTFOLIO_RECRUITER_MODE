import { Tabs } from "../../../../components/action/Tabs"

import { Container } from "../../../../components/layout/Container"
import { COURSES, EXPERIENCES, PROJECTS, SECTIONS, SKILL_LEARNING_EVIDENCE, SKILLS, SKILL_TABS } from "../../../../constants/profile"
import { slug } from "../../../../utils/string"
import { cn } from "../../../../utils/tailwind"
import type { PropsWithClassName } from "../../../../utils/types"
import { useINTLContext } from "../../../../providers/intl"
import { SkillsTab } from "./components"
import { useRecruiterModeContext } from "../../../../providers/recruiterMode"
import { getSkillEvidence, SKILL_KIND_BY_RECRUITER_ROLE } from "../../../../features/recruiter"
import { EvidenceTab } from "./components/EvidenceTab"

export const SkillsSection = (props: PropsWithClassName) => {
  const intl = useINTLContext()
  const { isRecruiterMode, roles } = useRecruiterModeContext()
  const evidence = getSkillEvidence({ skills: SKILLS, experiences: EXPERIENCES, projects: PROJECTS, courses: COURSES, learningEvidence: SKILL_LEARNING_EVIDENCE })
  const highlightedSkillValues = evidence.slice(0, 5).map((entry) => entry.skill.value)
  const selectedSkillKind = roles.length ? SKILL_KIND_BY_RECRUITER_ROLE[roles[0]] : null
  const evidenceTabs = SKILL_TABS.map((tab) => ({
    ...tab,
    indicator: roles.slice(1).some((role) => SKILL_KIND_BY_RECRUITER_ROLE[role] === tab.value),
  }))
  const initialEvidenceTab = SKILL_TABS.reduce((leadingTab, tab) => {
    const totalMonths = evidence
      .filter((entry) => entry.skill.kind === tab.value)
      .reduce((total, entry) => total + entry.professionalMonths, 0)
    const leadingMonths = evidence
      .filter((entry) => entry.skill.kind === leadingTab)
      .reduce((total, entry) => total + entry.professionalMonths, 0)

    return totalMonths > leadingMonths ? tab.value : leadingTab
  }, SKILL_TABS[0].value)

  return (
    <Container id={SECTIONS.skills.value} className={cn("bg-ud-neutral-100", props.className)}>
      <div>
        <h2 className="text-2xl font-bold text-ud-neutral-950">{isRecruiterMode ? intl.t("EvidenceBySkill") : intl.t(SECTIONS.skills.title)}</h2>
        {isRecruiterMode ? (
          <div className="mt-4">
            <Tabs key={roles.join("-") || "default"} tabs={evidenceTabs} initialTab={selectedSkillKind ?? initialEvidenceTab}>
              {SKILL_TABS.map((tab) => <EvidenceTab key={slug("evidence-tab", tab.value)} tab={tab} evidence={evidence} highlightedSkillValues={highlightedSkillValues} />)}
            </Tabs>
          </div>
        ) : (
          <Tabs className="mt-2" tabs={SKILL_TABS}>
            {SKILL_TABS.map(tab => <SkillsTab key={slug("skill-tab", tab.value)} tab={tab} />)}
          </Tabs>
        )}
      </div>
    </Container>
  )
}
