import { InfoIcon } from "lucide-react";
import { useRef } from "react";
import { Popover } from "../../general/Popover";
import type { InfoWrapperProps } from "./types";

/**
 * Wraps an element and pins an info icon to its top-right corner. When `info` is
 * provided, hovering or clicking the icon opens an informative popover; clicking
 * keeps it open until an outside click.
 */
export const InfoWrapper = (props: InfoWrapperProps) => {
  const anchorRef = useRef<HTMLSpanElement>(null)

  const icon = (onToggle?: (e?: React.MouseEvent<HTMLSpanElement>) => void) => (
    <span
      ref={anchorRef}
      onClick={onToggle}
      className="absolute -right-4 top-0 cursor-pointer text-ud-auxiliary-purple"
    >
      <InfoIcon size={15} />
    </span>
  )

  return (
    <div className="relative inline-block">
      {props.children}
      {props.info ? (
        <Popover
          name={props.name ?? "info"}
          hovering
          allowModalHover
          persistOnManualOpen
          arrow
          origin={props.origin ?? "center"}
          direction={props.direction ?? "bottom"}
          anchor={{ ref: anchorRef, element: (state) => icon(state.onToggleShow) }}
        >
          <div className="p-2 max-w-xs text-xs text-ud-neutral-800">{props.info}</div>
        </Popover>
      ) : (
        icon()
      )}
    </div>
  )
}
