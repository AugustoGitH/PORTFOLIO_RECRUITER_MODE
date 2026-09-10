import type { TabEntry } from "../../types"

export type TabProps<V extends number = number> = {
  tab: TabEntry<V>,
  current: boolean
  onNavigate: (tabIndex: V) => void
}