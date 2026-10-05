"use client"

import Link from "next/link"
import { ABOUT, GROUP_SECTION_LINKS } from "../../../constants/profile"
import { useINTLContext } from "../../../providers/intl"
import { LanguageSelect, VerticalMenuButton } from "./components"
import { RecruiterModeButton } from "../../../features/recruiter"
import { NavItems } from "../NavItems"
import { useRecruiterModeContext } from "../../../providers/recruiterMode"
import { Button } from "../../action/Button"
import { BriefcaseBusinessIcon, LayoutDashboardIcon, NotebookPenIcon } from "lucide-react"
import type { HeaderProps } from "./types"

export const Header = ({ hasAdminSession = false, variant = "portfolio" }: HeaderProps) => {
  const intl = useINTLContext()
  const { isRecruiterMode } = useRecruiterModeContext()
  const isBlog = variant === "blog"

  return (
    <div className="sticky left-0 top-0 z-50 w-full bg-ud-neutral-100 px-2 pt-2">
      <div className="flex h-15 w-full items-center justify-between gap-3 rounded border border-ud-neutral-300 bg-ud-neutral-100 px-4 py-1">
        <div className="flex items-center gap-2">
          {/* <img src="/src/assets/profile/augusto_main_profile.png" width={60} className="w-12" /> */}
          <Link href="/" className="cursor-pointer">
            <span className="block font-bold text-sm">{ABOUT.name}</span>
            <span className="block text-xs">{intl.t(ABOUT.role[0])}</span>
          </Link>
        </div>
        {!isBlog && (
          <nav className="hidden items-center gap-6 2xl:flex">
            <NavItems links={GROUP_SECTION_LINKS[isRecruiterMode ? "recruiter" : "main"]} variant="header" />
          </nav>
        )}
        <div className="flex items-center gap-2 sm:gap-4">
          {hasAdminSession && (
            <Button
              href="/admin"
              className="px-2 sm:px-5"
              startAdornment={<LayoutDashboardIcon size={15} aria-hidden="true" />}
              title={intl.t("AdminPanel")}
            >
              <span className="hidden xl:inline">{intl.t("AdminPanel")}</span>
              <span className="sr-only xl:hidden">{intl.t("AdminPanel")}</span>
            </Button>
          )}
          <Button
            href={isBlog ? "/" : "/blog"}
            startAdornment={isBlog
              ? <BriefcaseBusinessIcon size={15} aria-hidden="true" />
              : <NotebookPenIcon size={15} aria-hidden="true" />}
          >
            {intl.t(isBlog ? "Portfolio" : "Blog")}
          </Button>
          {!isBlog && <span className="hidden sm:block"><RecruiterModeButton /></span>}
          <span className="hidden sm:block"><LanguageSelect /></span>
          {!isBlog && <VerticalMenuButton />}
        </div>
      </div>
    </div>
  )
}
