import { CheckIcon, MenuIcon, UsersIcon } from "lucide-react"
import { ABOUT, GROUP_SECTION_LINKS } from "../../../constants/profile"
import { useHashNavigation } from "../../../hooks/navigation"
import { useINTLContext } from "../../../providers/intl"
import { Button } from "../../action/Button"
import { LanguageSelect, VerticalMenuButton } from "./components"
import { RecruiterModeButton } from "../../../features/recruiter"

export const Header = () => {
  const intl = useINTLContext()
  const navigation = useHashNavigation()

  return (
    <div className="w-full  px-2 pt-2  sticky top-0 left-0 z-50 bg-ud-neutral-100">
      <div className="w-full h-15 border border-ud-neutral-300 rounded flex items-center justify-between bg-ud-neutral-100 py-1 px-4">
        <div className="flex items-center gap-2">
          {/* <img src="/src/assets/profile/augusto_main_profile.png" width={60} className="w-12" /> */}
          <div>
            <span className="block font-bold text-sm">{ABOUT.name}</span>
            <span className="block text-xs">{intl.t(ABOUT.role[0])}</span>
          </div>
        </div>
        <nav className="flex items-center gap-6">
          {
            GROUP_SECTION_LINKS.main.map(link => (
              <a href={link.href} title={intl.t(link.title)} onClick={navigation.handleAnchorClick(link.href)} className="flex transition hover:text-ud-auxiliary-purple gap-2">
                <link.icon size={18} />
                <span className="text-xs font-bold">{intl.t(link.title)}</span>
              </a>
            ))
          }
        </nav>
        <div className="flex items-center gap-4">
          <RecruiterModeButton />
          <LanguageSelect />
          <VerticalMenuButton />
        </div>
      </div>
    </div>
  )
}