import { useTabsContext } from "../../providers";
import type { TabWrapperProps } from "./types";

export const TabWrapper = (props: TabWrapperProps) => {
  const control = useTabsContext()

  if (props.tabIndex !== undefined && control.isCurrentTab(props.tabIndex)) {
    return props.children
  }

  return null
}