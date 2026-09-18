import { BadgeCheckIcon, BlocksIcon, BotIcon, DatabaseIcon, PanelTopIcon, ServerIcon, WrenchIcon } from "lucide-react";
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
  SiJquery,
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
  SiRedux,
  SiRemix,
  SiVitest,
  SiPytest,
  SiAnthropic,
  SiElectron,
  SiTestinglibrary,
  SiMocha,
  SiChai,
  SiWordpress,
  SiRedwoodjs,
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
    label: "FrontEnd",
    value: SkillKind.Frontend,
    icon: PanelTopIcon
  }, {
    label: "BackEnd",
    value: SkillKind.Backend,
    icon: ServerIcon
  }, {
    label: "Database",
    value: SkillKind.DataBase,
    icon: DatabaseIcon
  }, {
    label: "Tests",
    value: SkillKind.Tests,
    icon: BadgeCheckIcon
  }, {
    label: "Architecture",
    value: SkillKind.Architecture,
    icon: BlocksIcon
  }, {
    label: "Tools",
    value: SkillKind.Tools,
    icon: WrenchIcon
  }
]

export const SKILLS = [
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
  { icon: SiRemix, title: "Remix", value: "remix", kind: SkillKind.Frontend },
  { icon: SiJquery, title: "jQuery", value: "jquery", kind: SkillKind.Frontend },
  { icon: SiElectron, title: "Electron", value: "electron", kind: SkillKind.Frontend },

  { icon: SiNodedotjs, title: "Node.js", value: "nodejs", kind: SkillKind.Backend },
  { icon: SiExpress, title: "Express.js", value: "express", kind: SkillKind.Backend },
  { icon: SiNestjs, title: "NestJS", value: "nestjs", kind: SkillKind.Backend },
  { icon: SiGraphql, title: "GraphQL", value: "graphql", kind: SkillKind.Backend },

  { icon: SiPostgresql, title: "PostgreSQL", value: "postgresql", kind: SkillKind.DataBase },
  { title: "SQL Server", value: "sql-server", kind: SkillKind.DataBase },
  { icon: SiMongodb, title: "MongoDB", value: "mongodb", kind: SkillKind.DataBase },
  { icon: SiFirebase, title: "Firebase", value: "firebase", kind: SkillKind.DataBase },
  { icon: SiPrisma, title: "Prisma", value: "prisma", kind: SkillKind.DataBase },
  { icon: SiTypeorm, title: "TypeORM", value: "typeorm", kind: SkillKind.DataBase },
  { icon: SiSequelize, title: "Sequelize", value: "sequelize", kind: SkillKind.DataBase },

  { icon: SiJest, title: "Jest", value: "jest", kind: SkillKind.Tests },
  { icon: SiTestinglibrary, title: "React Testing Library", value: "react-testing-library", kind: SkillKind.Tests },
  { icon: SiMocha, title: "Mocha", value: "mocha", kind: SkillKind.Tests },
  { icon: SiChai, title: "Chai", value: "chai", kind: SkillKind.Tests },
  { icon: SiSelenium, title: "Selenium", value: "selenium", kind: SkillKind.Tests },
  { icon: SiVitest, title: "Vitest", value: "vitest", kind: SkillKind.Tests },
  { icon: SiPytest, title: "Pytest", value: "pytest", kind: SkillKind.Tests },

  { title: "SOLID", value: "solid", kind: SkillKind.Architecture },
  { title: "Design Patterns", value: "design-patterns", kind: SkillKind.Architecture },
  { title: "Clean Code", value: "clean-code", kind: SkillKind.Architecture },

  { icon: SiGit, title: "Git", value: "git", kind: SkillKind.Tools },
  { icon: SiGithub, title: "GitHub", value: "github", kind: SkillKind.Tools },
  { icon: SiEslint, title: "ESLint", value: "eslint", kind: SkillKind.Tools },
  { icon: SiStorybook, title: "Storybook", value: "storybook", kind: SkillKind.Tools },
  { icon: SiWordpress, title: "WordPress", value: "wordpress", kind: SkillKind.Tools },
  { icon: SiAnthropic, title: "Claude Code", value: "claude-code", kind: SkillKind.Tools },
  { icon: BotIcon, title: "Codex", value: "codex", kind: SkillKind.Tools },

  // These entries were previously declared only inside experiences. Keeping
  // them here makes the catalog complete before recruiter matching is added.
  { icon: SiRedwoodjs, title: "Redwood.js", value: "redwood", kind: SkillKind.Architecture },
  { title: "REST API", value: "rest", kind: SkillKind.Architecture },
  { title: "Code Review", value: "code-review", kind: SkillKind.Tools },
  { title: "VPS", value: "vps", kind: SkillKind.Tools },
  { icon: SiRedux, title: "Redux", value: "redux", kind: SkillKind.Architecture },
] as const satisfies readonly Skill[]

export type SkillValue = (typeof SKILLS)[number]["value"]

export const SKILL_BY_VALUE: Record<SkillValue, Skill> = Object.fromEntries(
  SKILLS.map((skill) => [skill.value, skill])
) as Record<SkillValue, Skill>

if (Object.keys(SKILL_BY_VALUE).length !== SKILLS.length) {
  throw new Error("Profile skill values must be unique")
}

export const getSkillByValue = (value: SkillValue): Skill => {
  const skill = SKILL_BY_VALUE[value]

  if (!skill) {
    throw new Error(`Unknown profile skill: ${value}`)
  }

  return skill
}
