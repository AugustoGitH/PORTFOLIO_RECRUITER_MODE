"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { slug } from "../../../utils/string"
import { TabsProvider, useTabsContext } from "./providers"
import type { TabsProps } from "./types"
import { Tab } from "./components"
import { cn } from "../../../utils/tailwind"

const TabsInner = <V extends number = number>(props: TabsProps<V>) => {
  const control = useTabsContext()
  const tabsRef = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState<{
    height: number
    left: number
    top: number
    width: number
  }>()

  useLayoutEffect(() => {
    const tabsElement = tabsRef.current

    if (!tabsElement) return

    const updateIndicator = () => {
      const currentTab = tabsElement.querySelector<HTMLButtonElement>(
        `[data-tabs-value="${control.currentTab}"]`
      )

      if (!currentTab) return

      setIndicator({
        height: currentTab.offsetHeight,
        left: currentTab.offsetLeft,
        top: currentTab.offsetTop,
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
      <div ref={tabsRef} className="relative flex w-full items-center overflow-x-auto border-b-2 border-ud-neutral-300">
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
            className="pointer-events-none absolute left-0 top-0 rounded-md bg-ud-auxiliary-purple-light transition-[transform,width,height] duration-300 ease-out motion-reduce:transition-none"
            style={{
              height: indicator.height,
              width: indicator.width,
              transform: `translate(${indicator.left}px, ${indicator.top}px)`
            }}
          />
        )}
        {indicator && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-0 z-20 h-0.5 bg-ud-auxiliary-purple transition-[transform,width] duration-300 ease-out motion-reduce:transition-none"
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
