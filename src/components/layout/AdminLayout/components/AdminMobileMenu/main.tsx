"use client"

import { ChevronRightIcon } from "lucide-react"
import Link from "next/link"
import { NavigationMenuPopover } from "@/components/layout/NavigationMenuPopover"
import { usePathNavigation } from "@/hooks/navigation"
import { useINTLContext } from "@/providers/intl"
import { cn } from "@/utils/tailwind"
import { ADMIN_NAVIGATION_LINKS } from "../../constants"
import { AdminLogoutButton } from "../AdminLogoutButton"

export const AdminMobileMenu = () => {
  const intl = useINTLContext()
  const navigation = usePathNavigation()

  return (
    <NavigationMenuPopover
      name="admin-navigation-menu"
      label={intl.t("AdminNavigation")}
    >
      {(onClose) => (
        <nav
          aria-label={intl.t("AdminNavigation")}
          className="flex flex-col"
          role="menu"
        >
          <div className="mb-2 px-2 py-1">
            <span className="text-xs font-bold uppercase tracking-wide text-ud-secondary-600">
              {intl.t("AdminTitle")}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            {ADMIN_NAVIGATION_LINKS.map((link) => {
              const isCurrent = navigation.isActivePath(link.href)

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isCurrent ? "page" : undefined}
                  role="menuitem"
                  onClick={onClose}
                  className={cn(
                    "relative flex min-h-12 items-center gap-4 rounded-md px-4 text-base font-medium text-ud-neutral-999 transition-colors hover:bg-ud-auxiliary-purple-light hover:text-ud-auxiliary-purple",
                    isCurrent
                    && "bg-ud-auxiliary-purple-light text-ud-auxiliary-purple before:absolute before:inset-y-1 before:left-0 before:w-1 before:rounded-r-full before:bg-ud-auxiliary-purple",
                  )}
                >
                  <link.icon size={22} strokeWidth={1.8} aria-hidden="true" />
                  <span>{intl.t(link.label)}</span>
                  <ChevronRightIcon
                    className="ml-auto text-ud-secondary-600/80"
                    size={20}
                    aria-hidden="true"
                  />
                </Link>
              )
            })}
          </div>

          <div className="mx-1 mt-2 border-t border-ud-neutral-300 pt-2">
            <AdminLogoutButton />
          </div>
        </nav>
      )}
    </NavigationMenuPopover>
  )
}
