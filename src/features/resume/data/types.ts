import type { ResumeLocale } from "../types"

export type ResumeExperience = {
  organization: string
  kind: string
  period: string
  description: string
  skills: string[]
}

export type ResumeSkillGroup = {
  title: string
  skills: string[]
}

export type ResumeProfile = {
  locale: ResumeLocale
  name: string
  roles: string[]
  summary: string[]
  links: { label: string, href: string }[]
  experiences: ResumeExperience[]
  skillGroups: ResumeSkillGroup[]
  labels: {
    summary: string
    experience: string
    skills: string
    technologies: string
  }
}
