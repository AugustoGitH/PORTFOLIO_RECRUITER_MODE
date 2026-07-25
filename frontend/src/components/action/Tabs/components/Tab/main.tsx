import { cn } from "../../../../../utils/tailwind"
import { useINTLContext } from "../../../../../providers/intl"
import type { TabProps } from "./types"

export const Tab = <V extends number = number>(props: TabProps<V>) => {
  const intl = useINTLContext()

  return (
    <button className={cn("py-2 transition relative text-ud-neutral-700  after:contents-[''] after:left-0 after:absolute after:transition after:-bottom-0.5 after:w-full after:h-0.5", {
      "border-ud-neutral-950 text-ud-neutral-950 after:bg-ud-neutral-950": props.current
    })} onClick={() => props.onNavigate(props.tab.value)} >
      <div className="flex items-center gap-1 mx-2 ">
        {props.tab.icon && <props.tab.icon size={18} />}
        <span className="text-sm">{intl.t(props.tab.label)}</span>
      </div>
    </button>
  )
}