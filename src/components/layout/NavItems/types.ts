import type { Section } from "../../../constants/profile/page"

export type NavItemsProps = {
  links: readonly Section[]
  variant: "header" | "footer"
}
