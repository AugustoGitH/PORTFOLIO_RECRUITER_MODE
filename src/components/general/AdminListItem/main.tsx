import { cn } from "@/utils/tailwind"
import type { AdminListItemProps } from "./types"

export const AdminListItem = ({
  title,
  description,
  status,
  selected = false,
  onSelect,
  actions,
}: AdminListItemProps) => {
  const content = (
    <>
      <span>
        <b>{title}</b>
        {description && <> · {description}</>}
      </span>
      {status && <span className="ml-3 shrink-0 text-xs text-ud-secondary-600">{status}</span>}
    </>
  )

  return (
    <article className={cn(
      "flex flex-wrap items-center justify-between gap-3 rounded border p-3 text-sm",
      selected ? "border-ud-auxiliary-purple bg-ud-neutral-0" : "border-ud-neutral-300",
    )}>
      {onSelect ? (
        <button
          type="button"
          onClick={onSelect}
          className={cn(
            "flex min-w-0 flex-1 items-center justify-between text-left transition",
            selected && "text-ud-auxiliary-purple",
          )}
        >
          {content}
        </button>
      ) : <div className="flex min-w-0 flex-1 items-center justify-between">{content}</div>}
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </article>
  )
}
