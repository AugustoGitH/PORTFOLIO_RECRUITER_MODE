import { OverflowTags } from "../../../../../../components/action/OverflowTags";
import { Tag } from "../../../../../../components/action/Tag";
import { formatRangeDate, getRangeDateLabel } from "../../../../../../utils/date";
import { cn } from "../../../../../../utils/tailwind";
import { useINTLContext } from "../../../../../../providers/intl";
import type { ExperienceCardProps } from "./types";
import { getSkillByValue } from "../../../../../../constants/profile";

export const ExperienceCard = (props: ExperienceCardProps) => {
  const intl = useINTLContext()

  return (
    <div id={`experience-${props.experience.value}`} style={props.style} className={cn("w-full min-h-30 border border-ud-neutral-300 rounded flex items-center gap-4 py-2 px-4 justify-between", props.className)}>
      <div className="flex min-w-0 items-center gap-4">
        {
          props.experience.image && (
            <div className="w-10 h-10 shrink-0 overflow-hidden object-cover bg-red-700">
              <img width={60} height={60} className="w-full h-full" src={props.experience.image.src} alt={props.experience.image.alt} />
            </div>
          )
        }
        <div className="min-w-0">
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
          <OverflowTags
            className="max-w-40 shrink-0"
            maxVisible={3}
            popoverName={`experience-skills-${props.experience.value}`}
            tags={props.experience.skills.map(skillValue => {
              const skill = getSkillByValue(skillValue)

              return {
                icon: skill.icon && <skill.icon size={14} />,
                label: skill.title,
                value: skill.value,
              }
            })}
          />
        ) : undefined
      }
    </div>
  )
}
