export const RECOMMENDATION_SKILLS = [
  "react", "typescript", "javascript", "nextjs", "tailwindcss", "node", "postgresql", "firebase", "docker", "azure", "rest",
] as const

export type RecommendationSkillValue = typeof RECOMMENDATION_SKILLS[number]

const aliases: Record<string, RecommendationSkillValue> = { nodejs: "node" }

export const normalizeRecommendationSkill = (value: string) => aliases[value] ?? value as RecommendationSkillValue
