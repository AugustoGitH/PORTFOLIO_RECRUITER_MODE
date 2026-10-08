"use client"

import Link from "next/link"
import { ABOUT, GROUP_LINKS, GROUP_SECTION_LINKS, PAGE } from "../../../constants/profile"
import { useINTLContext } from "../../../providers/intl"
import { slug } from "../../../utils/string"
import { NavItems } from "../NavItems"

export const Footer = () => {
  const intl = useINTLContext()

  return (
    <footer className="w-full border-t border-ud-neutral-300 bg-ud-neutral-100 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-[calc(64rem-2rem)]">
        <div className="flex flex-col items-center gap-6 text-center lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:text-left">
          <Link href="/" className="min-w-0 cursor-pointer lg:justify-self-start">
            <span className="block text-sm font-bold">{ABOUT.name}</span>
            <span className="block text-xs text-ud-secondary-600">
              {intl.t(ABOUT.role[0])}
            </span>
          </Link>

          <nav
            aria-label={intl.t("NavigationMenu")}
            className="flex w-full max-w-[36rem] flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-bold sm:gap-x-5 lg:w-auto lg:justify-self-center"
          >
            <NavItems links={GROUP_SECTION_LINKS.main} variant="footer" />
          </nav>

          <nav
            aria-label={intl.t("SocialMedia")}
            className="flex items-center justify-center gap-1 lg:justify-self-end"
          >
            {GROUP_LINKS.main.map((link, index) => (
              <a
                key={slug("footer", "group-link", index)}
                href={link.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={link.title}
                title={link.title}
                className="flex size-11 items-center justify-center rounded-full transition-colors hover:bg-ud-auxiliary-purple-light hover:text-ud-auxiliary-purple"
              >
                {link.icon && <link.icon aria-hidden="true" size={20} />}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-6 flex justify-center border-t border-ud-neutral-300 pt-4 text-center text-xs leading-relaxed text-ud-secondary-600">
          <span>
            {intl.t("FooterCopyright", {
              name: ABOUT.name,
              year: PAGE.published,
            })}
          </span>
        </div>
      </div>
    </footer>
  )
}
