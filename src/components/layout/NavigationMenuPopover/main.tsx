"use client"

import { useRef } from "react"
import { MenuIcon } from "lucide-react"
import { Button } from "@/components/action/Button"
import { Popover } from "@/components/general/Popover"
import { cn } from "@/utils/tailwind"
import type { NavigationMenuPopoverProps } from "./types"

export const NavigationMenuPopover = ({
  children,
  label,
  name,
}: NavigationMenuPopoverProps) => {
  const anchorRef = useRef<HTMLButtonElement>(null)

  return (
    <Popover<HTMLButtonElement>
      name={name}
      origin="right"
      paperProps={{
        className: "w-[min(22rem,calc(100vw-1.5rem))] rounded-lg bg-ud-neutral-100 p-2 shadow-modal",
      }}
      anchor={{
        ref: anchorRef,
        element: (state) => (
          <Button
            ref={anchorRef}
            type="button"
            onClick={state.onToggleShow}
            aria-expanded={state.show}
            aria-haspopup="menu"
            highlight={state.show}
            startAdornment={<MenuIcon size={20} aria-hidden="true" />}
            className={cn(
              "h-10 w-10 justify-center gap-0 px-0 py-0",
              state.show
              && "hover:border-ud-auxiliary-purple hover:bg-ud-auxiliary-purple hover:text-ud-neutral-0",
            )}
          >
            <span className="sr-only">{label}</span>
          </Button>
        ),
      }}
    >
      {(state) => children(state.onClose)}
    </Popover>
  )
}
