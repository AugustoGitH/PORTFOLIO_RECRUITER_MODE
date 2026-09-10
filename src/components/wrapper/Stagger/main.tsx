import { Children, cloneElement, isValidElement } from "react";
import { cn } from "../../../utils/tailwind";
import { setDefaultProps } from "../../../utils/preset";
import type { StaggerProps } from "./types";

/**
 * Reveals its children one after another. Instead of wrapping each child, the
 * animation utility and an incremental `animation-delay` are cloned directly
 * onto the child element — its own `className`/`style` are preserved (merged,
 * not replaced), so no extra DOM node is introduced and the layout is untouched.
 *
 * Children must be elements that forward `className` and `style` to their root
 * node (native elements do; custom components should spread them).
 */
type StaggerableProps = {
  className?: string
  style?: React.CSSProperties
}

export const Stagger = (_props: StaggerProps) => {
  const props = setDefaultProps(_props, {
    animate: true,
    animation: "animate-scale-in",
    step: 60,
    initialDelay: 0,
  })

  return (
    <>
      {Children.map(props.children, (child, index) => {
        if (!props.animate || !isValidElement(child)) return child

        const element = child as React.ReactElement<StaggerableProps>

        return cloneElement(element, {
          className: cn(element.props.className, props.animation),
          style: {
            ...element.props.style,
            animationDelay: `${props.initialDelay + index * props.step}ms`,
          },
        })
      })}
    </>
  )
}
