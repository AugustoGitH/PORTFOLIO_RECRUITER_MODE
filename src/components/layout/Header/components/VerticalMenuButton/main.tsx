import { ArrowRightIcon, ChevronRightIcon, LanguagesIcon, MessageCircleIcon, NotebookPenIcon, UserRoundSearchIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { useMemo } from "react"
import { Button } from "@/components/action/Button"
import { SegmentedControl } from "@/components/action/SegmentedControl"
import { NavigationMenuPopover } from "@/components/layout/NavigationMenuPopover"
import { GROUP_SECTION_LINKS } from "@/constants/profile"
import { useHashNavigation } from "@/hooks/navigation"
import { useINTLContext } from "@/providers/intl"
import { useRecruiterModeContext } from "@/providers/recruiterMode"
import { cn } from "@/utils/tailwind"

export const VerticalMenuButton = () => {
  const intl = useINTLContext()
  const pathname = usePathname()
  const { isRecruiterMode, toggleRecruiterMode } = useRecruiterModeContext()
  const links = GROUP_SECTION_LINKS[isRecruiterMode ? "recruiter" : "main"]
  const sectionHrefs = useMemo(() => links.map((link) => link.href), [links])
  const navigation = useHashNavigation(sectionHrefs)
  const isHome = pathname === "/"

  return (
    <NavigationMenuPopover
      name="vertical-navigation-menu"
      label={intl.t("NavigationMenu")}
    >
      {(onClose) => (
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
                    onClose()
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
              onClick={onClose}
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
                onClose()
              }}
              className="relative flex min-h-14 items-center gap-4 overflow-hidden rounded-md bg-ud-auxiliary-purple-light px-4 text-base font-bold text-ud-auxiliary-purple transition-colors hover:bg-ud-auxiliary-purple/15"
            >
              <MessageCircleIcon size={22} strokeWidth={1.8} aria-hidden="true" />
              <span>{intl.t("ContactMe")}</span>
              <ArrowRightIcon className="ml-auto" size={21} aria-hidden="true" />
            </a>
          </div>

          <div className="mt-2 flex flex-col gap-3 border-t border-ud-neutral-300 p-2 pt-3 sm:hidden">
            <Button
              href={isHome ? undefined : "/?audience=recruiter#about"}
              highlight={!isRecruiterMode || !isHome}
              startAdornment={<UserRoundSearchIcon size={18} aria-hidden="true" />}
              className="w-full justify-center"
              onClick={() => {
                if (isHome) toggleRecruiterMode()
                onClose()
              }}
            >
              {isHome && isRecruiterMode ? intl.t("GeneralReading") : intl.t("Recruiter")}
            </Button>

            <div>
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-ud-secondary-600">
                <LanguagesIcon size={16} aria-hidden="true" />
                {intl.t("Language")}
              </span>
              <SegmentedControl
                className="mt-2 w-full grid-cols-2"
                optionClassName="h-[38px] min-h-0"
                ariaLabel={intl.t("Language")}
                options={[
                  { value: "ptbr", label: "Português" },
                  { value: "en", label: "English" },
                ]}
                value={intl.language}
                onChange={(language) => {
                  if (language) intl.setLanguage(language)
                }}
              />
            </div>
          </div>
        </nav>
      )}
    </NavigationMenuPopover>
  )
}
