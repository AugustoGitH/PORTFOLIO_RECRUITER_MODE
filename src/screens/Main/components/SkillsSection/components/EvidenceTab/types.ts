import type { TabEntry } from "../../../../../../components/action/Tabs"
import type { SkillKind } from "../../../../../../constants/profile"
import type { SkillEvidence } from "../../../../../../features/recruiter"

export type EvidenceTabProps = {
  tab: TabEntry<SkillKind>
  evidence: SkillEvidence[]
  highlightedSkillValues: readonly string[]
}
