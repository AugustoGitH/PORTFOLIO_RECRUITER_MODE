import { Fragment, useRef } from "react"
import { Popover } from "@/components/general/Popover"
import type { MarkdownToolbarAction } from "./actions"
import { pickToolbarGroups } from "./actions"
import type { MarkdownToolbarProps } from "./types"

const ToolbarButton = (props: {
  action: MarkdownToolbarAction
  onClick: () => void
}) => {
  const anchorRef = useRef<HTMLButtonElement>(null)
  const label = props.action.shortcut ? `${props.action.label} (${props.action.shortcut})` : props.action.label

  return (
    <Popover<HTMLButtonElement>
      name={`markdown-toolbar-${props.action.id}`}
      hovering
      arrow
      direction="top"
      hoverOpenDelay={250}
      anchor={{
        ref: anchorRef,
        element: () => (
          <button
            ref={anchorRef}
            type="button"
            aria-label={label}
            onMouseDown={(event) => event.preventDefault()}
            onClick={props.onClick}
            className="flex h-8 w-8 items-center justify-center rounded-sm text-ud-secondary-600 transition hover:bg-ud-neutral-0 hover:text-ud-auxiliary-purple focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ud-auxiliary-purple"
          >
            <props.action.icon size={16} aria-hidden="true" />
          </button>
        ),
      }}
    >
      <div className="max-w-60 space-y-1.5 p-2">
        <div className="flex items-center justify-between gap-3">
          <strong className="text-xs text-ud-neutral-950">{props.action.label}</strong>
          {props.action.shortcut && (
            <kbd className="rounded-sm border border-ud-neutral-300 bg-ud-neutral-100 px-1.5 py-0.5 text-2xs text-ud-secondary-600">
              {props.action.shortcut}
            </kbd>
          )}
        </div>
        <p className="text-xs text-ud-secondary-600">{props.action.description}</p>
        <code className="block rounded-sm bg-ud-neutral-100 px-2 py-1 font-mono text-2xs text-ud-neutral-950">
          {props.action.syntax}
        </code>
      </div>
    </Popover>
  )
}

export const MarkdownToolbar = (props: MarkdownToolbarProps) => {
  const groups = pickToolbarGroups(props.actions)

  return (
    <div
      role="toolbar"
      aria-label="Formatação Markdown"
      className="flex flex-wrap items-center gap-1 border-b border-ud-neutral-300 bg-ud-neutral-100 px-3 py-2"
    >
      {groups.map((group, groupIndex) => (
        <Fragment key={group[0].id}>
          {groupIndex > 0 && <span className="mx-1 h-5 w-px bg-ud-neutral-300" aria-hidden="true" />}
          {group.map((action) => (
            <ToolbarButton
              key={action.id}
              action={action}
              onClick={() => props.onApply(action.run(props.getState()))}
            />
          ))}
        </Fragment>
      ))}
    </div>
  )
}
