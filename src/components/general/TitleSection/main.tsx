import { Chip } from "../../action/Chip"
import { cn } from "../../../utils/tailwind"
import type { TitleSectionProps } from "./types"

export const TitleSection = (props: TitleSectionProps) => {
  return (
    <div className={props.className}>
      {props.tag && <Chip size="sm" className="items-center gap-2">{props.tag}</Chip>}
      <h2 className={cn("text-3xl font-extrabold text-ud-neutral-950", {
        "mt-2": Boolean(props.tag),
      })}>
        {props.title}
      </h2>
      <p className="mt-1 text-sm text-ud-secondary-600">{props.subtitle}</p>
    </div>
  )
}
