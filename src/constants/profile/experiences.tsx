import {
  BriefcaseIcon,
  HandHeartIcon,
} from "lucide-react"

import type { TabEntry } from "../../components/action/Tabs"
import type { Image } from "../../utils/types"
import type { RangeDate } from "../../utils/types/date"
import type { Term } from "../intl"
import type { SkillValue } from "./skills"

export enum ExperienceKind {
  // `All` is a filter-only sentinel (the "Todas" tab) — never assigned to an item.
  All,
  Professional,
  Volunteer
}

export type Experience = {
  image?: Image
  description?: Term
  title: string
  value: string
  rangeDate: RangeDate
  skills?: SkillValue[]
  kind: Exclude<ExperienceKind, ExperienceKind.All>
  /** Editorial relevance for the one-page resume, from 0 (lowest) to 100. */
  resumePriority: number
}

export const EXPERIENCE_TABS: TabEntry<ExperienceKind>[] = [
  {
    label: "All",
    value: ExperienceKind.All,
    icon: BriefcaseIcon
  },
  {
    label: "Professional",
    value: ExperienceKind.Professional,
    icon: BriefcaseIcon
  },
  {
    label: "Volunteering",
    value: ExperienceKind.Volunteer,
    icon: HandHeartIcon
  }
]

export const ENTERPRISE = {
  budgetXpert: {
    title: "BudgetXpert",
    image: {
      src: "/assets/enterprise/budgetxpert_logo.jpg",
      alt: "Logo da BudgetXpert"
    }
  },

  saludii: {
    title: "Saludii",
    image: {
      src: "/assets/enterprise/saludii_logo.jpg",
      alt: "Logo da Saludii"
    }
  },

  techLegion: {
    title: "Tech Legion",
    image: {
      src: "/assets/enterprise/techlegionbr_logo.jpg",
      alt: "Logo da Tech Legion"
    }
  },

  drtSistemas: {
    title: "DRT Sistemas",
    image: {
      src: "/assets/enterprise/drt_logo.jpg",
      alt: "Logo da DRT Sistemas"
    }
  },

  elysTech: {
    title: "Elys Tech",
    image: {
      src: "/assets/enterprise/elkys_logo.jpg",
      alt: "Logo da Elys Tech"
    }
  },

  workana: {
    title: "Workana",
    image: {
      src: "/assets/enterprise/workana_logo.jpg",
      alt: "Logo da Workana"
    }
  },

  getNinjas: {
    title: "GetNinjas",
    image: {
      src: "/assets/enterprise/getninjas_logo.jpg",
      alt: "Logo da GetNinjas"
    }
  },

  linkedIn: {
    title: "LinkedIn",
    image: {
      src: "/images/companies/linkedin.png",
      alt: "Logo do LinkedIn"
    }
  }
}

export const EXPERIENCES: Experience[] = [
  {
    title: ENTERPRISE.budgetXpert.title,
    description: "BudgetXpertDescription",
    value: "budgetxpert",
    rangeDate: ["2024-09-01", null],
    image: ENTERPRISE.budgetXpert.image,
    kind: ExperienceKind.Professional,
    resumePriority: 100,
    skills: [
      "nextjs", "react", "typescript", "graphql", "sql-server", "storybook", "vitest", "pytest", "claude-code"
    ]
  },

  {
    title: ENTERPRISE.saludii.title,
    description: "SaludiiDescription",
    value: "saludii",
    rangeDate: ["2024-04-01", "2025-04-01"],
    image: ENTERPRISE.saludii.image,
    kind: ExperienceKind.Professional,
    resumePriority: 95,
    skills: [
      "redwood", "remix", "graphql", "prisma", "postgresql"
    ]
  },

  {
    title: ENTERPRISE.techLegion.title,
    description: "TechLeadDescription",
    value: "tech-legion",
    rangeDate: ["2023-03-01", "2024-03-01"],
    image: ENTERPRISE.techLegion.image,
    kind: ExperienceKind.Professional,
    resumePriority: 80,
    skills: [
      "react", "nextjs", "wordpress", "code-review", "rest"
    ]
  },

  {
    title: ENTERPRISE.drtSistemas.title,
    description: "ZapFlowDescription",
    value: "drt-sistemas",
    rangeDate: ["2023-05-01", "2023-12-01"],
    image: ENTERPRISE.drtSistemas.image,
    kind: ExperienceKind.Professional,
    resumePriority: 90,
    skills: [
      "nextjs", "nestjs", "postgresql", "rest"
    ]
  },

  {
    title: ENTERPRISE.workana.title,
    description: "FreelancerDescription",
    value: "workana",
    rangeDate: ["2022-10-01", "2024-04-01"],
    image: ENTERPRISE.workana.image,
    kind: ExperienceKind.Professional,
    resumePriority: 85,
    skills: [
      "react", "nextjs", "nodejs", "vps"
    ]
  },

  {
    title: ENTERPRISE.getNinjas.title,
    description: "DesignRushDescription",
    value: "getninjas",
    rangeDate: ["2022-04-01", "2022-04-30"],
    image: ENTERPRISE.getNinjas.image,
    kind: ExperienceKind.Professional,
    resumePriority: 70,
    skills: [
      "react", "redux"
    ]
  },

  {
    title: ENTERPRISE.elysTech.title,
    description: "TechLeadFrontendDescription",
    value: "elys-tech",
    rangeDate: ["2024-04-01", "2024-08-01"],
    image: ENTERPRISE.elysTech.image,
    kind: ExperienceKind.Volunteer,
    resumePriority: 0,
    skills: [
      "react", "nextjs", "typescript"
    ]
  }
]
