import { cn } from "../../../../../utils/tailwind"
import { useINTLContext } from "../../../../../providers/intl"
import type { TabProps } from "./types"

export const Tab = <V extends number = number>(props: TabProps<V>) => {
  const intl = useINTLContext()

  return (
    <button
      type="button"
      data-tabs-value={props.tab.value}
      aria-pressed={props.current}
      className={cn("relative z-10 mb-1 shrink-0 rounded-md px-3 py-2 text-ud-neutral-900 transition-colors hover:text-ud-auxiliary-purple", {
        "text-ud-auxiliary-purple": props.current,
      })}
      onClick={() => props.onNavigate(props.tab.value)}
    >
      <div className="flex items-center gap-1">
        {props.tab.icon && <props.tab.icon aria-hidden="true" size={18} />}
        <span className="whitespace-nowrap text-sm">{intl.t(props.tab.label)}</span>
        {props.tab.indicator && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ud-auxiliary-purple" />}
      </div>
    </button>
  )
}
