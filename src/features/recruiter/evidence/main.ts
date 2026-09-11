import { ExperienceKind, type Experience, type SkillValue } from "../../../constants/profile"
import type { SkillEvidence, SkillEvidenceByValue, SkillEvidenceSource } from "./types"

const getMonthIndex = (date: string) => {
  const parsed = new Date(`${date}T00:00:00`)
  return parsed.getFullYear() * 12 + parsed.getMonth()
}

const getCurrentMonthIndex = () => {
  const current = new Date()
  return current.getFullYear() * 12 + current.getMonth()
}

const getCombinedMonths = (ranges: Array<[string, string | null]>) => {
  const orderedRanges = ranges
    .map(([start, end]) => [getMonthIndex(start), end ? getMonthIndex(end) + 1 : getCurrentMonthIndex() + 1] as const)
    .sort(([firstStart], [secondStart]) => firstStart - secondStart)

  const mergedRanges: Array<[number, number]> = []

  for (const [start, end] of orderedRanges) {
    const previous = mergedRanges.at(-1)

    if (!previous || start > previous[1]) {
      mergedRanges.push([start, end])
      continue
    }

    previous[1] = Math.max(previous[1], end)
  }

  return mergedRanges.reduce((total, [start, end]) => total + Math.max(0, end - start), 0)
}

export const getExperienceMonths = (experiences: readonly Pick<Experience, "rangeDate">[]) => {
  return getCombinedMonths(experiences.map((experience) => experience.rangeDate))
}

export const getSkillEvidence = (source: SkillEvidenceSource): SkillEvidence[] => {
  return source.skills.map((skill) => {
    const skillValue = skill.value as SkillValue
    const experiences = source.experiences.filter((experience) => experience.skills?.includes(skillValue))
    const professionalExperiences = experiences.filter((experience) => experience.kind === ExperienceKind.Professional)
    const projects = source.projects.filter((project) => project.skills.includes(skillValue))
    const courses = source.courses.filter((course) => course.skills.includes(skillValue))
    const learningEvidence = source.learningEvidence.filter((evidence) => evidence.skill === skillValue)

    return {
      skill,
      professionalMonths: getExperienceMonths(professionalExperiences),
      professionalExperienceCount: professionalExperiences.length,
      experiences: experiences.map((experience) => ({
        value: experience.value,
        title: experience.title,
        href: `#experience-${experience.value}`,
      })),
      projects: projects.map((project) => ({
        value: project.value,
        title: project.title,
        href: `#project-${project.value}`,
      })),
      courses,
      learningEvidence,
    }
  }).sort((first, second) => (
    second.professionalMonths - first.professionalMonths
    || second.professionalExperienceCount - first.professionalExperienceCount
    || second.projects.length - first.projects.length
    || first.skill.title.localeCompare(second.skill.title)
  ))
}

export const getSkillEvidenceByValue = (source: SkillEvidenceSource): SkillEvidenceByValue => {
  return Object.fromEntries(getSkillEvidence(source).map((evidence) => [evidence.skill.value, evidence])) as SkillEvidenceByValue
}
