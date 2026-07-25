import { getElapsedYears } from "../../utils/date"
import { SiGithub, SiInstagram } from "react-icons/si"
import { TiSocialLinkedin } from "react-icons/ti"
import type { Link } from "../../utils/types"
import type { INTLTranslateFunction } from "../../providers/intl"
import type { Term } from "../intl"

export type About = {
  name: string
  role: Term[]
  description: {
    content: (about: About, t: INTLTranslateFunction) => string[]
  },
  link: Record<string, Link>
}

export const ABOUT: About = {
  name: "Augusto Westphal",
  role: ["WebDeveloper", "FullStackWebDeveloper"],
  description: {
    content(about, t) {
      const years = getElapsedYears(new Date("2022-01-01"))
      const yearExperienceLabel = `${years} ${t("Year")}`

      return [
        t("AboutRoleDescription", { role: t(about.role[0]), yearExperience: yearExperienceLabel }),
        t("AboutPhilosophyDescription")
      ]
    },
  },
  link: {
    github: {
      icon: SiGithub,
      title: "GitHub",
      href: "https://github.com/AugustoGitH"
    },
    loucoDaSyntax: {
      icon: SiInstagram,
      title: "Louco da Syntax",
      href: "https://www.instagram.com/louco_da_syntax"
    },
    linkedin: {
      icon: TiSocialLinkedin,
      title: "Linkedin",
      href: "https://www.linkedin.com/in/augusto-westphal"
    },
  },
}

export const GROUP_LINKS = {
  main: [ABOUT.link.github, ABOUT.link.linkedin, ABOUT.link.loucoDaSyntax]
}