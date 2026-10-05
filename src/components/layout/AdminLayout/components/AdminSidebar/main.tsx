"use client"

import Link from "next/link"
import { AdminLogoutButton } from "../AdminLogoutButton"
import { ADMIN_NAVIGATION_LINKS } from "../../constants"
import { usePathNavigation } from "@/hooks/navigation"
import { useINTLContext } from "@/providers/intl"
import { cn } from "@/utils/tailwind"

export const AdminSidebar = () => {
  const intl = useINTLContext()
  const navigation = usePathNavigation()

  return (
    <aside className="fixed top-[4.75rem] bottom-2 left-2 z-40 hidden w-60 flex-col justify-between rounded border border-ud-neutral-300 p-4 md:flex">
      <nav aria-label={intl.t("AdminNavigation")}>
        <p className="px-3 text-xs font-bold uppercase tracking-wide text-ud-secondary-600">
          {intl.t("AdminTitle")}
        </p>
        <ul className="mt-3 grid gap-1">
          {ADMIN_NAVIGATION_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={navigation.isActivePath(link.href) ? "page" : undefined}
                className={cn(
                  "block rounded-sm px-3 py-2 text-sm text-ud-neutral-950 transition hover:bg-ud-neutral-100 hover:text-ud-auxiliary-purple",
                  navigation.isActivePath(link.href) && "bg-ud-neutral-100 text-ud-auxiliary-purple",
                )}
              >
                <link.icon className="mr-2 inline-block" size={16} aria-hidden="true" />
                {intl.t(link.label)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <AdminLogoutButton />
    </aside>
  )
}
