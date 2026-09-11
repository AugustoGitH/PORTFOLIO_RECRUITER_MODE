import { useLayoutEffect, useRef, useState } from "react"
import { slug } from "../../../utils/string"
import { TabsProvider, useTabsContext } from "./providers"
import type { TabsProps } from "./types"
import { Tab } from "./components"
import { cn } from "../../../utils/tailwind"

const TabsInner = <V extends number = number>(props: TabsProps<V>) => {
  const control = useTabsContext()
  const tabsRef = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState<{ left: number, width: number }>()

  useLayoutEffect(() => {
    const tabsElement = tabsRef.current

    if (!tabsElement) return

    const updateIndicator = () => {
      const currentTab = tabsElement.querySelector<HTMLButtonElement>(
        `[data-tabs-value="${control.currentTab}"]`
      )

      if (!currentTab) return

      setIndicator({
        left: currentTab.offsetLeft,
        width: currentTab.offsetWidth
      })
    }

    updateIndicator()

    const observer = new ResizeObserver(updateIndicator)
    observer.observe(tabsElement)
    tabsElement.querySelectorAll("button[data-tabs-value]").forEach(tab => observer.observe(tab))

    return () => observer.disconnect()
  }, [control.currentTab, props.tabs])

  return (
    <div className={cn("w-full", props.className)}>
      <div ref={tabsRef} className="relative flex items-center w-full border-b-2 border-ud-neutral-300">
        {props.tabs.map((tab, index) => (
          <Tab
            key={slug("tab", tab.value, index)}
            tab={tab} current={control.currentTab === tab.value}
            onNavigate={control.navigateToTab}
          />
        ))}
        {indicator && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-0.5 left-0 h-0.5 bg-ud-neutral-950 transition-[transform,width] duration-300 ease-out motion-reduce:transition-none"
            style={{ width: indicator.width, transform: `translateX(${indicator.left}px)` }}
          />
        )}
      </div>
      <div className="w-full mt-2">
        {props.children}
      </div>
    </div>
  )
}

export const Tabs = <V extends number = number>(props: TabsProps<V>) => {
  return (
    <TabsProvider initialTab={props.initialTab}>
      <TabsInner {...props} />
    </TabsProvider>
  )
}
