import {
  BriefcaseIcon,
  HandHeartIcon,
  Building2Icon,
  HeartHandshakeIcon
} from "lucide-react"

import type { TabEntry } from "../../components/action/Tabs"
import type { TagEntry } from "../../components/action/Tag/types"
import type { Image } from "../../utils/types"
import type { RangeDate } from "../../utils/types/date"
import type { Term } from "../intl"

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
  skills?: TagEntry[]
  kind: Exclude<ExperienceKind, ExperienceKind.All>
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
      src: "/src/assets/enterprise/budgetxpert_logo.jpg",
      alt: "Logo da BudgetXpert"
    }
  },

  saludii: {
    title: "Saludii",
    image: {
      src: "/src/assets/enterprise/saludii_logo.jpg",
      alt: "Logo da Saludii"
    }
  },

  techLegion: {
    title: "Tech Legion",
    image: {
      src: "/src/assets/enterprise/techlegionbr_logo.jpg",
      alt: "Logo da Tech Legion"
    }
  },

  drtSistemas: {
    title: "DRT Sistemas",
    image: {
      src: "/src/assets/enterprise/drt_logo.jpg",
      alt: "Logo da DRT Sistemas"
    }
  },

  elysTech: {
    title: "Elys Tech",
    image: {
      src: "/src/assets/enterprise/elkys_logo.jpg",
      alt: "Logo da Elys Tech"
    }
  },

  workana: {
    title: "Workana",
    image: {
      src: "/src/assets/enterprise/workana_logo.jpg",
      alt: "Logo da Workana"
    }
  },

  getNinjas: {
    title: "GetNinjas",
    image: {
      src: "/src/assets/enterprise/getninjas_logo.jpg",
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
    skills: [
      { label: "Next.js", value: "nextjs", icon: <Building2Icon size={14} /> },
      { label: "React", value: "react", icon: <Building2Icon size={14} /> },
      { label: "TypeScript", value: "typescript", icon: <Building2Icon size={14} /> },
      { label: "GraphQL", value: "graphql", icon: <Building2Icon size={14} /> },
      { label: "Storybook", value: "storybook", icon: <Building2Icon size={14} /> }
    ]
  },

  {
    title: ENTERPRISE.saludii.title,
    description: "SaludiiDescription",
    value: "saludii",
    rangeDate: ["2024-04-01", "2025-04-01"],
    image: ENTERPRISE.saludii.image,
    kind: ExperienceKind.Professional,
    skills: [
      { label: "Redwood.js", value: "redwood", icon: <Building2Icon size={14} /> },
      { label: "GraphQL", value: "graphql", icon: <Building2Icon size={14} /> },
      { label: "Prisma", value: "prisma", icon: <Building2Icon size={14} /> },
      { label: "PostgreSQL", value: "postgresql", icon: <Building2Icon size={14} /> }
    ]
  },

  {
    title: ENTERPRISE.techLegion.title,
    description: "TechLeadDescription",
    value: "tech-legion",
    rangeDate: ["2023-03-01", "2024-03-01"],
    image: ENTERPRISE.techLegion.image,
    kind: ExperienceKind.Volunteer,
    skills: [
      { label: "React", value: "react", icon: <HandHeartIcon size={14} /> },
      { label: "Next.js", value: "nextjs", icon: <HandHeartIcon size={14} /> },
      { label: "Code Review", value: "code-review", icon: <HandHeartIcon size={14} /> },
      { label: "API REST", value: "rest", icon: <HandHeartIcon size={14} /> }
    ]
  },

  {
    title: ENTERPRISE.drtSistemas.title,
    description: "ZapFlowDescription",
    value: "drt-sistemas",
    rangeDate: ["2023-05-01", "2023-12-01"],
    image: ENTERPRISE.drtSistemas.image,
    kind: ExperienceKind.Professional,
    skills: [
      { label: "Next.js", value: "nextjs", icon: <Building2Icon size={14} /> },
      { label: "NestJS", value: "nestjs", icon: <Building2Icon size={14} /> },
      { label: "PostgreSQL", value: "postgresql", icon: <Building2Icon size={14} /> },
      { label: "REST API", value: "rest", icon: <Building2Icon size={14} /> }
    ]
  },

  {
    title: ENTERPRISE.workana.title,
    description: "FreelancerDescription",
    value: "workana",
    rangeDate: ["2022-10-01", "2024-04-01"],
    image: ENTERPRISE.workana.image,
    kind: ExperienceKind.Professional,
    skills: [
      { label: "React", value: "react", icon: <Building2Icon size={14} /> },
      { label: "Next.js", value: "nextjs", icon: <Building2Icon size={14} /> },
      { label: "Node.js", value: "nodejs", icon: <Building2Icon size={14} /> },
      { label: "VPS", value: "vps", icon: <Building2Icon size={14} /> }
    ]
  },

  {
    title: ENTERPRISE.getNinjas.title,
    description: "DesignRushDescription",
    value: "getninjas",
    rangeDate: ["2022-04-01", "2022-04-30"],
    image: ENTERPRISE.getNinjas.image,
    kind: ExperienceKind.Professional,
    skills: [
      { label: "React", value: "react", icon: <Building2Icon size={14} /> },
      { label: "Redux", value: "redux", icon: <Building2Icon size={14} /> },
      { label: "Landing Pages", value: "landing-pages", icon: <Building2Icon size={14} /> }
    ]
  },

  {
    title: ENTERPRISE.elysTech.title,
    description: "TechLeadFrontendDescription",
    value: "elys-tech",
    rangeDate: ["2024-04-01", "2024-08-01"],
    image: ENTERPRISE.elysTech.image,
    kind: ExperienceKind.Volunteer,
    skills: [
      { label: "React", value: "react", icon: <HeartHandshakeIcon size={14} /> },
      { label: "Next.js", value: "nextjs", icon: <HeartHandshakeIcon size={14} /> },
      { label: "TypeScript", value: "typescript", icon: <HeartHandshakeIcon size={14} /> }
    ]
  }
]
