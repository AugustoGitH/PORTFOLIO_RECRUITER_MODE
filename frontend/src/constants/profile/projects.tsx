import {
  StarIcon,
  ClockIcon,
  LinkIcon,
  Columns3CogIcon,
  HandHeartIcon,
  MicrochipIcon,
  FlaskConicalIcon,
  PuzzleIcon,
  BriefcaseBusinessIcon,
  PanelLeftIcon
} from "lucide-react"
import type { TabEntry } from "../../components/action/Tabs";
import type { TagEntry } from "../../components/action/Tag/types";
import { BsGithub, BsWhatsapp } from "react-icons/bs";
import { IoNutrition } from "react-icons/io5";
import type { Link } from "../../utils/types";

export enum ProjectKind {
  All,
  Professional,
  Volunteer,
  Personal
}

export type Project = {
  icon?: React.ComponentType<{ size?: number }>;
  description?: string
  title: string
  value: string
  skill?: TagEntry
  links?: Link[]
  kind: Exclude<ProjectKind, ProjectKind.All>
}

export const PROJECT_TABS: TabEntry<ProjectKind>[] = [
  {
    label: "All",
    value: ProjectKind.All,
    icon: StarIcon
  }, {
    label: "Professional",
    value: ProjectKind.Professional,
    icon: ClockIcon
  }, {
    label: "Volunteering",
    value: ProjectKind.Volunteer,
    icon: HandHeartIcon
  },
  {
    label: "Personal",
    value: ProjectKind.Personal,
    icon: FlaskConicalIcon
  },
]

export const PROJECTS: Project[] = [
  {
    icon: BsWhatsapp,
    title: "ZapFlow",
    description: "ZapFlowDescription",
    value: "zap-flow",
    kind: ProjectKind.Professional,
  },
  {
    icon: IoNutrition,
    title: "Saludii Nutrition",
    description: "SaludiiDescription",
    value: "saludii",
    kind: ProjectKind.Professional,
    links: [
      {
        href: "https://saludii.com/para-nutricionistas#nutritionSection",
        icon: LinkIcon,
        title: "Saludii Nutrition",
        iconOnly: true

      }
    ]
  },
  {
    icon: Columns3CogIcon,
    title: "BudgetXpert",
    description: "BudgetXpertDescription",
    value: "budget-xpert",
    kind: ProjectKind.Professional,
    links: [
      {
        href: "https://budgetxpert.com/br",
        icon: LinkIcon,
        title: "BudgetXpert",
        iconOnly: true
      }
    ]
  },
  {
    icon: MicrochipIcon,
    title: "Tech Legion",
    description: "Desenvolvi voluntariamente e de forma independente o <b>site institucional da TechLegion</b>, incluindo um <b>blog completo</b> com <b>dashboard de gerenciamento</b>, <b>controle de permissões</b> e sistema de publicação de conteúdo.",
    value: "tech-legion",
    kind: ProjectKind.Volunteer,
    links: [
      {
        href: "https://www.linkedin.com/feed/update/urn:li:activity:7095622376691777536/",
        icon: LinkIcon,
        title: "TechLegion",
        iconOnly: true
      },
      {
        href: "https://github.com/techlegionbr/site-techlegion--frontend",
        icon: BsGithub,
        title: "Tech Legion Frontend",
        iconOnly: true
      },
      {
        href: "https://github.com/techlegionbr/site-techlegion--backend",
        icon: BsGithub,
        title: "Tech Legion Backend",
        iconOnly: true
      },
    ]
  },
  {
    icon: LinkIcon,
    title: "Onlinks",
    description: "Desenvolvi voluntariamente o <b>Onlinks</b>, uma plataforma para criação de <b>páginas de links personalizadas</b> com suporte a <b>múltiplos perfis</b> e gerenciamento centralizado de conteúdo.",
    value: "onlinks",
    kind: ProjectKind.Volunteer,
    links: [
      {
        href: "https://www.linkedin.com/feed/update/urn:li:activity:7178782843492331521/?originTrackingId=oTeEBqIOQualcn3xYI7Q%2Bg%3D%3D",
        icon: LinkIcon,
        title: "Onlinks",
        iconOnly: true
      },
      {
        href: "https://github.com/techlegionbr/onlinks-frontend",
        icon: BsGithub,
        title: "Onlinks Frontend",
        iconOnly: true
      },
      {
        href: "https://github.com/techlegionbr/onlinks-backend",
        icon: BsGithub,
        title: "Onlinks Backend",
        iconOnly: true
      },
    ]
  },
  {
    icon: PuzzleIcon,
    title: "CodeQuiz",
    description: "Desenvolvi o <b>QuizDev</b>, uma plataforma para <b>criação e compartilhamento de desafios de programação</b>, permitindo que usuários criem quizzes, testem seus conhecimentos e desafiem outros desenvolvedores.",
    value: "codequiz",
    kind: ProjectKind.Personal,
    links: [
      {
        href: "https://www.linkedin.com/feed/update/urn:li:activity:7050885870089908224/?originTrackingId=tltcKXPtQ82H3vhMTxFpYQ%3D%3D",
        icon: LinkIcon,
        title: "codequiz",
        iconOnly: true
      },
      {
        href: "https://github.com/AugustoGitH/ONLINKS-FRONTEND--DEV",
        icon: BsGithub,
        title: "Codequiz Frontend",
        iconOnly: true
      },
      {
        href: "https://github.com/AugustoGitH/ONLINKS-BACKEND--DEV",
        icon: BsGithub,
        title: "Codequiz Backend",
        iconOnly: true
      },
    ]
  },
  {
    icon: BriefcaseBusinessIcon,
    title: "Portfolio/Bio Links",
    description: "Desenvolvi meu <b>portfólio pessoal</b> com foco em <b>experiência do usuário</b>, apresentando minha trajetória, projetos e habilidades por meio de uma interface moderna, interativa e altamente personalizável.",
    value: "portfolio-bio-links",
    kind: ProjectKind.Personal,
    links: [
      {
        href: "https://augustowestphal.netlify.app/",
        icon: LinkIcon,
        title: "portfolio-bio-links",
        iconOnly: true
      },
      {
        href: "https://github.com/AugustoGitH?tab=repositories",
        icon: BsGithub,
        title: "portfolio-bio-links",
        iconOnly: true
      },
    ]
  },
  {
    icon: PanelLeftIcon,
    title: "Portfolio CMS",
    description: "Desenvolvi um <b>portfólio com CMS próprio</b>, permitindo o gerenciamento de projetos, sincronização com o <b>GitHub</b> e acompanhamento de métricas como visualizações e favoritos.",
    value: "portfolio-cms",
    kind: ProjectKind.Personal,
    links: [
      {
        href: "https://www.linkedin.com/feed/update/urn:li:activity:7041787445163483136/?originTrackingId=UR1fCSU1RwiyDXkQclivqw%3D%3D",
        icon: LinkIcon,
        title: "portfolio-cms",
        iconOnly: true
      },
      {
        href: "https://github.com/AugustoGitH/PORTFOLIO-5.1--DEV",
        icon: BsGithub,
        title: "portfolio-cms",
        iconOnly: true
      },
    ]
  },
]
