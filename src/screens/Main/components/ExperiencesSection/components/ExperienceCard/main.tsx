import { OverflowTags } from "../../../../../../components/action/OverflowTags";
import { cn } from "../../../../../../utils/tailwind";
import { useINTLContext } from "../../../../../../providers/intl";
import type { ExperienceCardProps } from "./types";
import { getSkillByValue } from "../../../../../../constants/profile";

export const ExperienceCard = (props: ExperienceCardProps) => {
  const intl = useINTLContext()
  const locale = intl.language === "ptbr" ? "pt-BR" : "en-US"
  const formatDate = (date: string | null) => {
    if (!date) return intl.language === "ptbr" ? "Presente" : "Present"

    return new Intl.DateTimeFormat(locale, {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(`${date}T12:00:00Z`))
  }
  const [startDate, endDate] = props.experience.rangeDate

  return (
    <article id={`experience-${props.experience.value}`} style={props.style} className={cn("relative grid w-full grid-cols-[6.5rem_minmax(0,1fr)] gap-3 py-1 pl-3 sm:grid-cols-[7rem_minmax(0,1fr)]", props.className)}>
      <div className="relative pt-3 text-xs leading-tight text-ud-secondary-600 after:absolute after:top-7 after:right-0 after:h-[calc(100%+0.5rem)] after:w-px after:bg-ud-auxiliary-purple/30 last:after:hidden">
        <span className="block">{formatDate(startDate)}</span>
        <span className="mt-1 block font-semibold text-ud-auxiliary-purple">{formatDate(endDate)}</span>
        <span className="absolute top-4 -right-1.25 h-2.5 w-2.5 rounded-full border-2 border-ud-auxiliary-purple bg-ud-neutral-100" />
      </div>
      <div className="relative min-w-0 rounded-md border border-ud-neutral-300 bg-ud-neutral-100 p-3 before:absolute before:-left-1 before:top-4 before:h-2.5 before:w-2.5 before:rotate-45 before:border-b before:border-l before:border-ud-neutral-300 before:bg-ud-neutral-100">
        <div className="flex min-w-0 items-start gap-3">
        {
          props.experience.image && (
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-sm border border-ud-neutral-300 bg-ud-neutral-200">
              <img width={60} height={60} className="w-full h-full" src={props.experience.image.src} alt={props.experience.image.alt} />
            </div>
          )
        }
        <div className="min-w-0">
          <span className="font-bold block text-sm">{props.experience.title}</span>
          {
            props.experience.description && (
              <span className="text-xs block" dangerouslySetInnerHTML={{
                __html: intl.t(props.experience.description)
              }}></span>
            )
          }
        </div>
        </div>
        {props.experience.skills?.length ? (
          <OverflowTags
            className="mt-2 max-w-full shrink-0"
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
        ) : undefined}
      </div>
    </article>
  )
}
