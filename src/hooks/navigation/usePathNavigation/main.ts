"use client"

import { usePathname } from "next/navigation"
import type { PathNavigationOutput } from "./types"

export const usePathNavigation = (): PathNavigationOutput => {
  const activePath = usePathname()

  return {
    activePath,
    isActivePath: (href) => activePath === href,
  }
}
