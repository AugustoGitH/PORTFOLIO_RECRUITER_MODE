import { cn } from "../../../utils/tailwind"
import type { ContainerProps } from "./types"

export const Container = ({ children, className, contentClassName, ...sectionProps }: ContainerProps) => {
  return (
    <section {...sectionProps} className={cn("flex w-full justify-center px-4 py-10", className)}>
      <div className={cn("w-full max-w-[calc(64rem-2rem)]", contentClassName)}>
        {children}
      </div>
    </section>
  )
}
