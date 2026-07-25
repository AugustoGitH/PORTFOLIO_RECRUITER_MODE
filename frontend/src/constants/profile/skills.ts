import { BadgeCheckIcon, BlocksIcon, DatabaseIcon, PanelTopIcon, ServerIcon, WrenchIcon } from "lucide-react";
import type { TabEntry } from "../../components/action/Tabs";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiHtml5,
  SiCss,
  SiSass,
  SiStyledcomponents,
  SiMui,
  SiBootstrap,
  SiApollographql,
  SiNodedotjs,
  SiExpress,
  SiNestjs,
  SiGraphql,
  SiPostgresql,
  SiMongodb,
  SiFirebase,
  SiPrisma,
  SiTypeorm,
  SiSequelize,
  SiJest,
  SiSelenium,
  SiGit,
  SiGithub,
  SiEslint,
  SiStorybook,
} from "react-icons/si";

export enum SkillKind {
  Frontend,
  Backend,
  DataBase,
  Tests,
  Architecture,
  Tools
}

export type Skill = {
  icon?: React.ComponentType<{ size?: number }>;
  title: string
  value: string
  kind: SkillKind
}

// Skills are a true partition: every skill belongs to exactly one kind, so the
// tabs ARE the kinds — there is no "all" tab.
export const SKILL_TABS: TabEntry<SkillKind>[] = [
  {
    label: "Front-End",
    value: SkillKind.Frontend,
    icon: PanelTopIcon
  }, {
    label: "Back-End",
    value: SkillKind.Backend,
    icon: ServerIcon
  }, {
    label: "Banco de Dados",
    value: SkillKind.DataBase,
    icon: DatabaseIcon
  }, {
    label: "Testes",
    value: SkillKind.Tests,
    icon: BadgeCheckIcon
  }, {
    label: "Arquitetura",
    value: SkillKind.Architecture,
    icon: BlocksIcon
  }, {
    label: "Ferramentas",
    value: SkillKind.Tools,
    icon: WrenchIcon
  }
]

export const SKILLS: Skill[] = [
  { icon: SiReact, title: "React", value: "react", kind: SkillKind.Frontend },
  { icon: SiNextdotjs, title: "Next.js", value: "nextjs", kind: SkillKind.Frontend },
  { icon: SiTypescript, title: "TypeScript", value: "typescript", kind: SkillKind.Frontend },
  { icon: SiJavascript, title: "JavaScript", value: "javascript", kind: SkillKind.Frontend },
  { icon: SiHtml5, title: "HTML", value: "html", kind: SkillKind.Frontend },
  { icon: SiCss, title: "CSS", value: "css", kind: SkillKind.Frontend },
  { icon: SiSass, title: "SASS", value: "sass", kind: SkillKind.Frontend },
  { icon: SiStyledcomponents, title: "Styled Components", value: "styled-components", kind: SkillKind.Frontend },
  { icon: SiMui, title: "Material UI", value: "mui", kind: SkillKind.Frontend },
  { icon: SiBootstrap, title: "Bootstrap", value: "bootstrap", kind: SkillKind.Frontend },
  { icon: SiApollographql, title: "Apollo", value: "apollo", kind: SkillKind.Frontend },

  { icon: SiNodedotjs, title: "Node.js", value: "nodejs", kind: SkillKind.Backend },
  { icon: SiExpress, title: "Express.js", value: "express", kind: SkillKind.Backend },
  { icon: SiNestjs, title: "NestJS", value: "nestjs", kind: SkillKind.Backend },
  { icon: SiGraphql, title: "GraphQL", value: "graphql", kind: SkillKind.Backend },

  { icon: SiPostgresql, title: "PostgreSQL", value: "postgresql", kind: SkillKind.DataBase },
  { icon: SiMongodb, title: "MongoDB", value: "mongodb", kind: SkillKind.DataBase },
  { icon: SiFirebase, title: "Firebase", value: "firebase", kind: SkillKind.DataBase },
  { icon: SiPrisma, title: "Prisma", value: "prisma", kind: SkillKind.DataBase },
  { icon: SiTypeorm, title: "TypeORM", value: "typeorm", kind: SkillKind.DataBase },
  { icon: SiSequelize, title: "Sequelize", value: "sequelize", kind: SkillKind.DataBase },

  { icon: SiJest, title: "Jest", value: "jest", kind: SkillKind.Tests },
  { title: "React Testing Library", value: "react-testing-library", kind: SkillKind.Tests },
  { title: "Mocha", value: "mocha", kind: SkillKind.Tests },
  { title: "Chai", value: "chai", kind: SkillKind.Tests },
  { icon: SiSelenium, title: "Selenium", value: "selenium", kind: SkillKind.Tests },

  { title: "SOLID", value: "solid", kind: SkillKind.Architecture },
  { title: "Design Patterns", value: "design-patterns", kind: SkillKind.Architecture },
  { title: "Clean Code", value: "clean-code", kind: SkillKind.Architecture },

  { icon: SiGit, title: "Git", value: "git", kind: SkillKind.Tools },
  { icon: SiGithub, title: "GitHub", value: "github", kind: SkillKind.Tools },
  { icon: SiEslint, title: "ESLint", value: "eslint", kind: SkillKind.Tools },
  { icon: SiStorybook, title: "Storybook", value: "storybook", kind: SkillKind.Tools },
];
