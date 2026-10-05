import {
  BadgeCheckIcon,
  BookOpenIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  UsersRoundIcon,
} from "lucide-react"
import type { AdminSidebarLink } from "./components/AdminSidebar"

export const ADMIN_NAVIGATION_LINKS = [
  {
    href: "/admin",
    label: "AdminDashboardNav",
    icon: LayoutDashboardIcon,
  },
  {
    href: "/admin/professional-feedbacks",
    label: "AdminProfessionalFeedbacksTitle",
    icon: BadgeCheckIcon,
  },
  {
    href: "/admin/feedbacks",
    label: "AdminPortfolioFeedbacksTitle",
    icon: MessageSquareIcon,
  },
  {
    href: "/admin/recommendations",
    label: "AdminRecommendationsNav",
    icon: UsersRoundIcon,
  },
  {
    href: "/admin/blog",
    label: "Blog",
    icon: BookOpenIcon,
  },
] as const satisfies readonly AdminSidebarLink[]
