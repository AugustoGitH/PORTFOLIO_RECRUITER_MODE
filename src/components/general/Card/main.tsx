import { cn } from "../../../utils/tailwind"
import type { CardProps } from "./types"

export const Card = (props: CardProps) => {
  return (
    <div style={props.style} className={cn("rounded border p-2 border-ud-neutral-300 w-60", props.className)}>
      <div className="flex items-center gap-2">
        {props.icon}
        <span className="text-sm font-bold">{props.title}</span>
        {
          props.links?.length ? (
            <nav className="flex items-center gap-2">
              {
                props.links.map(link => (
                  <a className="inline-flex items-center gap-1 text-2xs" target="_blank" href={link.href} title={link.title}>{!link.iconOnly && <span>{link.title}</span>}{link.icon && <div className="text-ud-auxiliary-purple"><link.icon size={10} /></div>}</a>
                ))
              }
            </nav>
          ) : undefined
        }
      </div>
      {
        props.description && (
          <p className="text-xs mt-2" dangerouslySetInnerHTML={{
            __html: props.description
          }} ></p>
        )
      }
    </div>
  )
}
