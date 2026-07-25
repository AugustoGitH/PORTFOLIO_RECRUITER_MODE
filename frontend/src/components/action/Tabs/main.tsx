import { useId } from "react"
import { slug } from "../../../utils/string"
import { TabsProvider, useTabsContext } from "./providers"
import type { TabsProps } from "./types"
import { Tab } from "./components"
import { cn } from "../../../utils/tailwind"

const TabsInner = <V extends number = number>(props: TabsProps<V>) => {
  const name = useId()

  const control = useTabsContext()

  return (
    <div className={cn("w-full", props.className)}>
      <div className="flex items-center w-full border-b-2 border-ud-neutral-300">
        {props.tabs.map((tab, index) => (
          <Tab
            key={slug(name, tab.value, index)}
            tab={tab} current={control.currentTab === tab.value}
            onNavigate={control.navigateToTab}
          />
        ))}
      </div>
      <div className="w-full mt-2">
        {props.children}
      </div>
    </div>
  )
}

export const Tabs = <V extends number = number>(props: TabsProps<V>) => {
  return (
    <TabsProvider>
      <TabsInner {...props} />
    </TabsProvider>
  )
}