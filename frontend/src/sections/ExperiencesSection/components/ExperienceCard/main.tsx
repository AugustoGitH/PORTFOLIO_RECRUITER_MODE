import { Tag } from "../../../../components/action/Tag";
import { formatRangeDate, getRangeDateLabel } from "../../../../utils/date";
import { cn } from "../../../../utils/tailwind";
import { useINTLContext } from "../../../../providers/intl";
import type { ExperienceCardProps } from "./types";

export const ExperienceCard = (props: ExperienceCardProps) => {
  const intl = useINTLContext()

  return (
    <div style={props.style} className={cn("w-full border border-ud-neutral-300 rounded flex items-center gap-2 py-2 px-4 justify-between", props.className)}>
      <div className="flex items-center gap-4">
        {
          props.experience.image && (
            <div className="w-10 h-10 shrink-0 overflow-hidden object-cover bg-red-700">
              <img width={60} height={60} className="w-full h-full" src={props.experience.image.src} alt={props.experience.image.alt} />
            </div>
          )
        }
        <div>
          <span className="text-xs block">
            {formatRangeDate(props.experience.rangeDate)}
            <Tag
              className="rounded-sm text-3xs inline-block ml-2 p-1"
              tag={{
                label: getRangeDateLabel(props.experience.rangeDate, intl.t),
                value: "node"
              }}
            />
          </span>
          <span className="font-bold block">{props.experience.title}</span>
          {
            props.experience.description && (
              <span className="text-xs block" dangerouslySetInnerHTML={{
                __html: intl.t(props.experience.description)
              }}></span>
            )
          }
        </div>
      </div>
      {
        props.experience.skills?.length ? (
          <div className="flex items-center justify-center flex-wrap gap-2 max-w-40" >
            {
              props.experience.skills.map(skill => (
                <Tag
                  className="rounded-xl text-2xs py-1 px-2"
                  tag={skill}
                />
              ))
            }
          </div>
        ) : undefined
      }
    </div>
  )
}