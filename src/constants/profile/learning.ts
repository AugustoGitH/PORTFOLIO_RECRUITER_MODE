import type { Term } from "../intl"
import { EXPERIENCES } from "./experiences"
import type { SkillValue } from "./skills"

export type SkillLearningEvidence = {
  skill: SkillValue
  experience: string
  description: Term
}

export const SKILL_LEARNING_EVIDENCE: SkillLearningEvidence[] = [
  {
    skill: "redwood",
    experience: "saludii",
    description: "SaludiiRedwoodLearningDelivery",
  },
  {
    skill: "nestjs",
    experience: "drt-sistemas",
    description: "ZapFlowNestLearningDelivery",
  },
  {
    skill: "postgresql",
    experience: "drt-sistemas",
    description: "ZapFlowPostgresLearningDelivery",
  },
  {
    skill: "sql-server",
    experience: "budgetxpert",
    description: "BudgetXpertSqlServerLearningDelivery",
  },
]

for (const evidence of SKILL_LEARNING_EVIDENCE) {
  if (!EXPERIENCES.some((experience) => experience.value === evidence.experience)) {
    throw new Error(`Unknown learning evidence experience: ${evidence.experience}`)
  }
}
