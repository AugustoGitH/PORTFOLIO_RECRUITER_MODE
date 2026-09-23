"use client"

import { Button } from "@/components/action/Button"
import { useINTLContext } from "@/providers/intl"
import { ABOUT } from "../../constants/profile"
import { HouseIcon, NotebookPenIcon } from "lucide-react"

export const AdminHeader = () => {
  const intl = useINTLContext()

  return (
    <header className="w-full px-2 pt-2 sticky top-0 left-0 z-50 bg-ud-neutral-100">
      <div className="w-full h-15 border border-ud-neutral-300 rounded flex items-center justify-between bg-ud-neutral-100 py-1 px-4">
        <span className="text-xs font-bold uppercase tracking-wide text-ud-secondary-600">{ABOUT.name}</span>
        <div className="flex items-center gap-2">
          <Button
            href="/"
            className="px-3"
            startAdornment={<HouseIcon size={15} aria-hidden="true" />}
          >
            {intl.t("Portfolio")}
          </Button>
          <Button
            href="/blog"
            className="px-3"
            startAdornment={<NotebookPenIcon size={15} aria-hidden="true" />}
          >
            {intl.t("Blog")}
          </Button>
        </div>
      </div>
    </header>
  )
}
