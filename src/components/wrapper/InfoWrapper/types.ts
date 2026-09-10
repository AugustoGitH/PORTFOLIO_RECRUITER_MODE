import type { PropsWithChildren } from "react";
import type { PopoverDirection, PopoverOrigin } from "../../general/Popover";

export type InfoWrapperProps = PropsWithChildren<{
  /** Content shown inside the popover. When omitted, only the icon renders (no popover). */
  info?: React.ReactNode
  /** Stable name for the underlying popover (used for the test id). */
  name?: string
  origin?: PopoverOrigin
  direction?: PopoverDirection
}>
