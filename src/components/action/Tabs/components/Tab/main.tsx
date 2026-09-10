import { cn } from "../../../../../utils/tailwind"
import { useINTLContext } from "../../../../../providers/intl"
import type { TabProps } from "./types"

export const Tab = <V extends number = number>(props: TabProps<V>) => {
  const intl = useINTLContext()

  return (
    <button data-tabs-value={props.tab.value} className={cn("py-2 transition text-ud-neutral-700", {
      "text-ud-neutral-950": props.current
    })} onClick={() => props.onNavigate(props.tab.value)} >
      <div className="flex items-center gap-1 mx-2 ">
        {props.tab.icon && <props.tab.icon size={18} />}
        <span className="text-sm">{intl.t(props.tab.label)}</span>
      </div>
    </button>
  )
}
