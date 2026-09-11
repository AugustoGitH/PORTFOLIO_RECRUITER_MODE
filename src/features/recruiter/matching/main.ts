import { getSkillByValue, SkillKind, type SkillValue } from "../../../constants/profile"
import type { RecruiterRole } from "../../../providers/recruiterMode"

export const SKILL_KIND_BY_RECRUITER_ROLE: Record<RecruiterRole, SkillKind> = {
  frontend: SkillKind.Frontend,
  backend: SkillKind.Backend,
  database: SkillKind.DataBase,
  tests: SkillKind.Tests,
  architecture: SkillKind.Architecture,
  tools: SkillKind.Tools,
}

export const sortByRecruiterRoles = <T extends { skills?: SkillValue[] }>(items: readonly T[], roles: readonly RecruiterRole[]): T[] => {
  if (!roles.length) return Array.from(items)

  const skillKinds = roles.map((role) => SKILL_KIND_BY_RECRUITER_ROLE[role])

  return items
    .map((item, index) => ({
      item,
      index,
      score: item.skills?.filter((skillValue) => skillKinds.includes(getSkillByValue(skillValue).kind)).length ?? 0,
    }))
    .sort((first, second) => second.score - first.score || first.index - second.index)
    .map(({ item }) => item)
}
