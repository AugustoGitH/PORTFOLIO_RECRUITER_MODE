import type { TestimonialCardProps } from "./types"
import { Building2Icon, UserRoundIcon } from "lucide-react"
import { Chip } from "../../../../../../components/action/Chip"
import { ResponsiveAsciiArt } from "../../../../../../components/general/AsciiArt"
import { useINTLContext } from "../../../../../../providers/intl"
import { cn } from "../../../../../../utils/tailwind"

export const TestimonialCard = (props: TestimonialCardProps) => {
  const intl = useINTLContext()
  const content = props.testimonial.description.split(/(<b>[^<]*<\/b>)/g).map((part, index) =>
    part.startsWith("<b>") && part.endsWith("</b>")
      ? <strong key={index}>{part.slice(3, -4)}</strong>
      : part,
  )

  return (
    <article className={cn(
      "relative flex min-h-44 min-w-0 flex-col rounded-md border border-ud-neutral-300 bg-ud-neutral-100 p-4",
      props.featured && "md:min-h-80",
      props.className,
    )}>
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded border border-ud-neutral-300 text-ud-neutral-900">
            <Building2Icon size={16} />
          </span>
          {props.testimonial.enterprise.name && <Chip size="sm">{props.testimonial.enterprise.name}</Chip>}
        </div>
        <div className={cn("mt-3 flex items-start gap-2", props.featured && "md:mt-5")}>
          <span aria-hidden="true" className="-mt-3 text-5xl font-bold leading-none text-ud-auxiliary-purple">“</span>
          <p className={cn("text-xs leading-relaxed text-ud-neutral-900", props.featured && "md:text-sm")}>{content}</p>
        </div>
      </div>
      <div className={cn("mt-auto flex items-center gap-3 pt-4", props.featured && "md:relative md:min-h-24 md:pr-28")}>
        {
          props.testimonial.author.image ? (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-ud-neutral-300 object-cover">
              <img width={40} height={40} className="h-full w-full object-cover" src={props.testimonial.author.image.src} alt={props.testimonial.author.image.alt} />
            </div>
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ud-neutral-300"><UserRoundIcon size={18} /></div>
          )
        }

        <div className="min-w-0">
          <span className="block text-xs font-bold">{props.testimonial.author.name}</span>
          <span className="block text-2xs text-ud-secondary-600">{props.testimonial.author.position}</span>
        </div>
        {props.featured && (
          <ResponsiveAsciiArt
            src="/assets/profile/testimonials-laptop.png"
            alt={intl.t("TestimonialsLaptopAlt")}
            initialWidth={128}
            columns={72}
            rows={30}
            palette="source"
            wrapperClassName="absolute -right-1 -bottom-2 hidden w-32 md:flex"
          />
        )}
      </div>
    </article>
  )
}
