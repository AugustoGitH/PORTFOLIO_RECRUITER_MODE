"use client"

import { Clock3 } from "lucide-react"
import { useINTLContext } from "@/providers/intl"
import type { ArticleMetaProps } from "./types"

export const ArticleMeta = ({ minutes }: ArticleMetaProps) => {
  const intl = useINTLContext()

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-ud-secondary-600">
      <Clock3 size={15} aria-hidden="true" />
      {intl.t("BlogReadingMinutes", { minutes })}
    </span>
  )
}
