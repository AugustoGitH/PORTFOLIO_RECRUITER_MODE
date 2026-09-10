import { cn } from "../../../utils/tailwind";
import type { ContainerProps } from "./types";

export const Container = (props: ContainerProps) => {
  return (
    <section id={props.id} className={cn("w-full flex justify-center px-4 py-10", props.className)}>
      <div className="w-180">
        {props.children}
      </div>
    </section>
  )
}