import { ArrowRightIcon, ChevronRightIcon, MenuIcon, MessageCircleIcon, NotebookPenIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { useMemo, useRef } from "react"
import { Popover } from "@/components/general/Popover"
import { GROUP_SECTION_LINKS } from "@/constants/profile"
import { useHashNavigation } from "@/hooks/navigation"
import { useINTLContext } from "@/providers/intl"
import { useRecruiterModeContext } from "@/providers/recruiterMode"
import { cn } from "@/utils/tailwind"

export const VerticalMenuButton = () => {
  const intl = useINTLContext()
  const pathname = usePathname()
  const { isRecruiterMode } = useRecruiterModeContext()
  const anchorRef = useRef<HTMLButtonElement>(null)
  const links = GROUP_SECTION_LINKS[isRecruiterMode ? "recruiter" : "main"]
  const sectionHrefs = useMemo(() => links.map((link) => link.href), [links])
  const navigation = useHashNavigation(sectionHrefs)
  const isHome = pathname === "/"

  return (
    <Popover<HTMLButtonElement>
      name="vertical-navigation-menu"
      origin="right"
      paperProps={{
        className: "w-[min(22rem,calc(100vw-1.5rem))] rounded-lg bg-ud-neutral-100 p-2 shadow-modal",
      }}
      anchor={{
        ref: anchorRef,
        element: (state) => (
          <button
            ref={anchorRef}
            type="button"
            onClick={state.onToggleShow}
            aria-expanded={state.show}
            aria-haspopup="menu"
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-sm border border-ud-neutral-300 transition-colors hover:border-ud-auxiliary-purple hover:text-ud-auxiliary-purple",
              state.show && "border-ud-auxiliary-purple text-ud-auxiliary-purple",
            )}
          >
            <MenuIcon size={20} aria-hidden="true" />
            <span className="sr-only">{intl.t("NavigationMenu")}</span>
          </button>
        ),
      }}
    >
      {(state) => (
        <nav aria-label={intl.t("NavigationMenu")} className="flex flex-col" role="menu">
          <div className="mb-2 px-2 py-1">
            <span className="text-xs font-bold uppercase tracking-wide text-ud-secondary-600">
              {intl.t("Menu")}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            {links.map((link) => {
              const isCurrent = isHome && navigation.activeHref === link.href

              return (
                <a
                  key={link.value}
                  href={isHome ? link.href : `/${link.href}`}
                  aria-current={isCurrent ? "location" : undefined}
                  role="menuitem"
                  onClick={(event) => {
                    if (isHome) navigation.handleAnchorClick(link.href)(event)
                    state.onClose()
                  }}
                  className={cn(
                    "relative flex min-h-12 items-center gap-4 rounded-md px-4 text-base font-medium text-ud-neutral-999 transition-colors hover:bg-ud-auxiliary-purple-light hover:text-ud-auxiliary-purple",
                    isCurrent && "bg-ud-auxiliary-purple-light text-ud-auxiliary-purple before:absolute before:inset-y-1 before:left-0 before:w-1 before:rounded-r-full before:bg-ud-auxiliary-purple",
                  )}
                >
                  <span className="flex shrink-0" aria-hidden="true">
                    <link.icon size={22} />
                  </span>
                  <span>{intl.t(link.title)}</span>
                  <ChevronRightIcon className="ml-auto text-ud-secondary-600/80" size={20} aria-hidden="true" />
                </a>
              )
            })}

            <a
              href="/blog"
              role="menuitem"
              onClick={state.onClose}
              className={cn(
                "flex min-h-12 items-center gap-4 rounded-md px-4 text-base font-medium text-ud-neutral-999 transition-colors hover:bg-ud-auxiliary-purple-light hover:text-ud-auxiliary-purple",
                pathname.startsWith("/blog") && "bg-ud-auxiliary-purple-light text-ud-auxiliary-purple",
              )}
            >
              <NotebookPenIcon size={22} strokeWidth={1.8} aria-hidden="true" />
              <span>{intl.t("Blog")}</span>
              <ChevronRightIcon className="ml-auto text-ud-secondary-600/80" size={20} aria-hidden="true" />
            </a>
          </div>

          <div className="mx-1 mt-2 border-t border-ud-neutral-300 pt-2">
            <a
              href={isHome ? "#feedback" : "/#feedback"}
              role="menuitem"
              onClick={(event) => {
                if (isHome) navigation.handleAnchorClick("#feedback")(event)
                state.onClose()
              }}
              className="relative flex min-h-14 items-center gap-4 overflow-hidden rounded-md bg-ud-auxiliary-purple-light px-4 text-base font-bold text-ud-auxiliary-purple transition-colors hover:bg-ud-auxiliary-purple/15"
            >
              <MessageCircleIcon size={22} strokeWidth={1.8} aria-hidden="true" />
              <span>{intl.t("ContactMe")}</span>
              <ArrowRightIcon className="ml-auto" size={21} aria-hidden="true" />
            </a>
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-ud-neutral-300 px-4 pt-2 sm:hidden">
            <a href="/?audience=recruiter#about" onClick={state.onClose} className="text-sm font-bold text-ud-neutral-999 hover:text-ud-auxiliary-purple">
              {intl.t("Recruiter")}
            </a>
            <div className="flex gap-3">
              <button type="button" onClick={() => intl.setLanguage("ptbr")} className={intl.language === "ptbr" ? "font-bold text-ud-auxiliary-purple" : "text-ud-secondary-600"}>PT</button>
              <button type="button" onClick={() => intl.setLanguage("en")} className={intl.language === "en" ? "font-bold text-ud-auxiliary-purple" : "text-ud-secondary-600"}>EN</button>
            </div>
          </div>
        </nav>
      )}
    </Popover>
  )
}
