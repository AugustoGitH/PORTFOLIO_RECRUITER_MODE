import { ABOUT, GROUP_SECTION_LINKS } from "../../../constants/profile"
import { useINTLContext } from "../../../providers/intl"
import { LanguageSelect, VerticalMenuButton } from "./components"
import { RecruiterModeButton } from "../../../features/recruiter"
import { NavItems } from "../NavItems"
import { useRecruiterModeContext } from "../../../providers/recruiterMode"

export const Header = () => {
  const intl = useINTLContext()
  const { isRecruiterMode } = useRecruiterModeContext()

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
          <NavItems links={GROUP_SECTION_LINKS[isRecruiterMode ? "recruiter" : "main"]} variant="header" />
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
