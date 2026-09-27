"use client"

import { useLayoutEffect, useRef, useState } from "react"
import { cn } from "../../../utils/tailwind"
import type { SegmentedControlProps } from "./types"

export const SegmentedControl = <Value extends string>(props: SegmentedControlProps<Value>) => {
  const controlRef = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState<{ height: number, left: number, top: number, width: number }>()

  useLayoutEffect(() => {
    const control = controlRef.current

    if (!control || props.value === null) {
      setIndicator(undefined)
      return
    }

    const updateIndicator = () => {
      const selectedOption = control.querySelector<HTMLButtonElement>(
        `[data-segmented-value="${props.value}"]`
      )

      if (!selectedOption) return

      setIndicator({
        height: selectedOption.offsetHeight,
        left: selectedOption.offsetLeft,
        top: selectedOption.offsetTop,
        width: selectedOption.offsetWidth,
      })
    }

    updateIndicator()

    const observer = new ResizeObserver(updateIndicator)
    observer.observe(control)
    control.querySelectorAll("button[data-segmented-value]").forEach(option => observer.observe(option))

    return () => observer.disconnect()
  }, [props.options, props.value])

  return (
    <div
      ref={controlRef}
      className={cn("relative grid grid-cols-3 overflow-hidden rounded-lg border border-ud-neutral-300 bg-ud-neutral-100", props.className)}
      aria-label={props.ariaLabel}
    >
      {props.options.map((option) => {
        const isSelected = props.value === option.value

        return (
          <button
            key={option.value}
            type="button"
            data-segmented-value={option.value}
            aria-pressed={isSelected}
            className={cn("relative z-10 min-h-11 rounded-lg px-2 text-sm font-medium text-ud-secondary-600 transition-colors hover:text-ud-auxiliary-purple", {
              "text-ud-neutral-0 hover:bg-transparent hover:text-ud-neutral-0": isSelected,
            })}
            onClick={() => props.onChange(isSelected ? null : option.value)}
          >
            {option.label}
          </button>
        )
      })}
      {indicator && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 rounded-lg bg-ud-auxiliary-purple shadow-sm transition-[transform,width,height] duration-300 ease-out motion-reduce:transition-none"
          style={{
            height: indicator.height,
            width: indicator.width,
            transform: `translate(${indicator.left}px, ${indicator.top}px)`,
          }}
        />
      )}
    </div>
  )
}
