import { MenuIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { GROUP_SECTION_LINKS } from "@/constants/profile"
import { useINTLContext } from "@/providers/intl"
import { useRecruiterModeContext } from "@/providers/recruiterMode"

export const VerticalMenuButton = () => {
  const intl = useINTLContext()
  const pathname = usePathname()
  const { isRecruiterMode } = useRecruiterModeContext()

  return (
    <details className="group relative">
      <summary className="flex h-8 w-8 cursor-pointer list-none items-center justify-center rounded-sm border border-ud-neutral-300 marker:hidden hover:border-ud-auxiliary-purple">
        <MenuIcon size={20} aria-hidden="true" />
        <span className="sr-only">{intl.t("NavigationMenu")}</span>
      </summary>
      <nav className="absolute right-0 top-10 z-50 flex w-56 flex-col gap-1 rounded-md border border-ud-neutral-300 bg-white p-2 shadow-modal">
        {GROUP_SECTION_LINKS[isRecruiterMode ? "recruiter" : "main"].map((link) => (
          <a key={link.value} href={pathname === "/" ? link.href : `/${link.href}`} className="rounded px-3 py-2 text-sm hover:bg-ud-neutral-200 hover:text-ud-auxiliary-purple">
            {intl.t(link.title)}
          </a>
        ))}
        <a href="/blog" className="rounded px-3 py-2 text-sm hover:bg-ud-neutral-200 hover:text-ud-auxiliary-purple">{intl.t("Blog")}</a>
        <a href="/?audience=recruiter#about" className="rounded px-3 py-2 text-sm hover:bg-ud-neutral-200 hover:text-ud-auxiliary-purple sm:hidden">{intl.t("Recruiter")}</a>
        <div className="flex gap-2 border-t border-ud-neutral-300 px-3 pt-2 sm:hidden">
          <button type="button" onClick={() => intl.setLanguage("ptbr")} className={intl.language === "ptbr" ? "font-bold text-ud-auxiliary-purple" : "text-ud-secondary-600"}>PT</button>
          <button type="button" onClick={() => intl.setLanguage("en")} className={intl.language === "en" ? "font-bold text-ud-auxiliary-purple" : "text-ud-secondary-600"}>EN</button>
        </div>
      </nav>
    </details>
  )
}
