import { ABOUT, GROUP_LINKS, GROUP_SECTION_LINKS, PAGE } from "../../../constants/profile"
import { useINTLContext } from "../../../providers/intl"
import { slug } from "../../../utils/string"
import { NavItems } from "../NavItems"

export const Footer = () => {
  const intl = useINTLContext()

  return (
    <footer className="w-full border-t border-ud-neutral-300 py-4 px-10  bg-ud-neutral-100">
      <div className="flex items-center justify-between">
        <div>
          <span className="block font-bold text-sm">{ABOUT.name}</span>
          <span className="block text-xs">{intl.t(ABOUT.role[0])}</span>
        </div>
        <nav className="flex items-center gap-3 text-xs font-bold">
          <NavItems links={GROUP_SECTION_LINKS.main} variant="footer" />
        </nav>
        <nav className="flex items-center gap-2">
          {
            GROUP_LINKS.main.map((link, index) => (
              <a key={slug("footer", "group-link", index)} target="_blank" href={link.href}>{link.icon && <link.icon size={20} />}</a>
            ))
          }
        </nav>
      </div>
      <div className="flex justify-center mt-4 text-xs">
        <span>© {PAGE.published} {ABOUT.name}. All rights reserved.</span>
      </div>
    </footer>
  )
}
