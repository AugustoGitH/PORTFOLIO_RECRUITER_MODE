"use client"

import {
  BadgeCheckIcon,
  BookOpenIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  UsersRoundIcon,
} from "lucide-react"
import Link from "next/link"
import { AdminLogoutButton } from "../AdminLogoutButton"
import { usePathNavigation } from "@/hooks/navigation"
import { cn } from "@/utils/tailwind"
import type { AdminSidebarLink } from "./types"

const ADMIN_SIDEBAR_LINKS: AdminSidebarLink[] = [
  { href: "/admin", label: "Painel", icon: LayoutDashboardIcon },
  { href: "/admin/professional-feedbacks", label: "Feedbacks profissionais", icon: BadgeCheckIcon },
  { href: "/admin/feedbacks", label: "Feedbacks do portfólio", icon: MessageSquareIcon },
  { href: "/admin/recommendations", label: "Indicações", icon: UsersRoundIcon },
  { href: "/admin/blog", label: "Blog", icon: BookOpenIcon },
]

export const AdminSidebar = () => {
  const navigation = usePathNavigation()

  return (
    <aside className="fixed top-[4.75rem] bottom-2 left-2 z-40 hidden w-60 flex-col justify-between rounded border border-ud-neutral-300 p-4 md:flex">
      <nav aria-label="Navegação administrativa">
        <p className="px-3 text-xs font-bold uppercase tracking-wide text-ud-secondary-600">Administração</p>
        <ul className="mt-3 grid gap-1">
          {ADMIN_SIDEBAR_LINKS.map((link) => (
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
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <AdminLogoutButton />
    </aside>
  )
}
