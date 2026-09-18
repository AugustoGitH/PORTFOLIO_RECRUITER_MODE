import { ABOUT, GROUP_SECTION_LINKS } from "../../../constants/profile"
import { useINTLContext } from "../../../providers/intl"
import { LanguageSelect, VerticalMenuButton } from "./components"
import { RecruiterModeButton } from "../../../features/recruiter"
import { NavItems } from "../NavItems"
import { useRecruiterModeContext } from "../../../providers/recruiterMode"
import { Button } from "../../action/Button"
import { NotebookPenIcon } from "lucide-react"
import { usePathname } from "next/navigation"

export const Header = () => {
  const intl = useINTLContext()
  const { isRecruiterMode } = useRecruiterModeContext()
  const pathname = usePathname()

  return (
    <div className="sticky left-0 top-0 z-50 w-full bg-ud-neutral-100 px-2 pt-2">
      <div className="flex h-15 w-full items-center justify-between gap-3 rounded border border-ud-neutral-300 bg-ud-neutral-100 px-4 py-1">
        <div className="flex items-center gap-2">
          {/* <img src="/src/assets/profile/augusto_main_profile.png" width={60} className="w-12" /> */}
          <div>
            <span className="block font-bold text-sm">{ABOUT.name}</span>
            <span className="block text-xs">{intl.t(ABOUT.role[0])}</span>
          </div>
        </div>
        <nav className="hidden items-center gap-6 2xl:flex">
          <NavItems links={GROUP_SECTION_LINKS[isRecruiterMode ? "recruiter" : "main"]} variant="header" />
        </nav>
        <div className="flex items-center gap-2 sm:gap-4">
          <Button href="/blog" className={pathname.startsWith("/blog") ? "bg-ud-auxiliary-purple/10 text-ud-auxiliary-purple hover:border-auxiliary-purple  border-auxiliary-purple/10 hover:text-ud-auxiliary-purple" : undefined} startAdornment={<NotebookPenIcon size={15} />}>{intl.t("Blog")}</Button>
          <span className="hidden sm:block"><RecruiterModeButton /></span>
          <span className="hidden sm:block"><LanguageSelect /></span>
          <VerticalMenuButton />
        </div>
      </div>
    </div>
  )
}
