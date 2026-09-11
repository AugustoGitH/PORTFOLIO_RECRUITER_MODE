import type { Course, Experience, Project, Skill, SkillLearningEvidence, SkillValue } from "../../../constants/profile"

export type SkillEvidenceReference = {
  value: string
  title: string
  href: string
}

export type SkillEvidence = {
  skill: Skill
  professionalMonths: number
  professionalExperienceCount: number
  projects: SkillEvidenceReference[]
  experiences: SkillEvidenceReference[]
  courses: Course[]
  learningEvidence: SkillLearningEvidence[]
}

export type DatedSkillReference = Pick<Experience, "rangeDate" | "skills" | "kind" | "title" | "value">

export type SkillEvidenceSource = {
  skills: readonly Skill[]
  experiences: readonly Experience[]
  projects: readonly Project[]
  courses: readonly Course[]
  learningEvidence: readonly SkillLearningEvidence[]
}

export type SkillEvidenceByValue = Record<SkillValue, SkillEvidence>
