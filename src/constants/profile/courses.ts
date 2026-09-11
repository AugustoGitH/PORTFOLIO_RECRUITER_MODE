import type { SkillValue } from "./skills"

export type Course = {
  title: string
  issuer: string
  issuedAt: string
  credentialId?: string
  skills: SkillValue[]
}

// Verified from Augusto's public LinkedIn licences and certifications section
// on 2026-09-10. Courses reinforce learning; they never count as professional experience.
export const COURSES: Course[] = [
  {
    title: "JS EXPERT",
    issuer: "Erick Wendel Training and Consulting",
    issuedAt: "2024-05",
    skills: ["javascript", "nodejs"],
  },
  {
    title: "ProgramadorBr - ReactJS | Redux | ContextAPI",
    issuer: "Hotmart Company",
    issuedAt: "2023-04",
    credentialId: "DVWBACW24RE28597",
    skills: ["react", "redux"],
  },
  {
    title: "ProgramadorBr - NodeJs e MongoDB",
    issuer: "Hotmart Company",
    issuedAt: "2022-12",
    credentialId: "DVWBACW24NO28597",
    skills: ["nodejs", "mongodb"],
  },
  {
    title: "ProgramadorBr - HTML, CSS E JavaScript",
    issuer: "Hotmart Company",
    issuedAt: "2022-05",
    credentialId: "DVWBACW24HT28597",
    skills: ["html", "css", "javascript"],
  },
  {
    title: "ProgramadorBr Firebase, Jquery e Bootstrap",
    issuer: "Hotmart Company",
    issuedAt: "2022-05",
    credentialId: "DVWBACW24FI28597",
    skills: ["firebase", "jquery", "bootstrap"],
  },
  {
    title: "ProgramadorBr - Electron",
    issuer: "Hotmart Company",
    issuedAt: "2023-08",
    credentialId: "DVWBACW24EL28597",
    skills: ["electron"],
  },
]
