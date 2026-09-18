import { useMemo } from "react"
import { usePathname } from "next/navigation"
import { useHashNavigation } from "../../../hooks/navigation"
import { useINTLContext } from "../../../providers/intl"
import { cn } from "../../../utils/tailwind"
import type { NavItemsProps } from "./types"

export const NavItems = (props: NavItemsProps) => {
  const intl = useINTLContext()
  const pathname = usePathname()
  const isHome = pathname === "/"
  const sectionHrefs = useMemo(() => props.links.map(link => link.href), [props.links])
  const navigation = useHashNavigation(sectionHrefs)

  return props.links.map(link => {
    const isCurrent = navigation.activeHref === link.href

    return (
      <a
        key={link.value}
        href={isHome ? link.href : `/${link.href}`}
        title={intl.t(link.title)}
        aria-current={isHome && isCurrent ? "location" : undefined}
        onClick={isHome ? navigation.handleAnchorClick(link.href) : undefined}
        className={cn("transition-colors hover:text-ud-auxiliary-purple", {
          "text-ud-auxiliary-purple": isHome && isCurrent,
          "flex items-center gap-2": props.variant === "header"
        })}
      >
        {props.variant === "header" && <link.icon size={18} />}
        <span className={cn({ "text-xs font-bold": props.variant === "header" })}>
          {intl.t(link.title)}
        </span>
      </a>
    )
  })
}
