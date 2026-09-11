import { BriefcaseBusinessIcon, FolderIcon, GridIcon, MegaphoneIcon, StarIcon, UserIcon } from "lucide-react"
import type { Term } from "../intl"

export type Section = {
  href: string,
  value: string,
  title: Term
  icon: React.ComponentType<{ size?: number }>;
}

export const PAGE = {
  published: "2026"
}

export const SECTIONS: Record<string, Section> = {
  about: {
    href: "#about",
    value: "about",
    title: "About",
    icon: UserIcon
  },
  skills: {
    href: "#skills",
    value: "skills",
    title: "Skills",
    icon: GridIcon
  },
  projects: {
    href: "#projects",
    value: "projects",
    title: "Projects",
    icon: FolderIcon
  },
  experiences: {
    href: "#experiences",
    value: "experiences",
    title: "Experiences",
    icon: BriefcaseBusinessIcon

  },
  testimonials: {
    href: "#testimonials",
    value: "testimonials",
    title: "Testimonials",
    icon: StarIcon
  },
  feedback: {
    href: "#feedback",
    value: "feedback",
    title: "Feedback",
    icon: MegaphoneIcon
  },
}

export const GROUP_SECTION_LINKS = {
  main: [SECTIONS.about, SECTIONS.skills, SECTIONS.projects, SECTIONS.experiences, SECTIONS.testimonials, SECTIONS.feedback],
  recruiter: [SECTIONS.about, SECTIONS.experiences, SECTIONS.projects, SECTIONS.skills, SECTIONS.testimonials, SECTIONS.feedback],
}
