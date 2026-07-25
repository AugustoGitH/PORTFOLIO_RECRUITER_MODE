import { useINTLContext } from "../../../../providers/intl"
import type { TestimonialCardProps } from "./types"

export const TestimonialCard = (props: TestimonialCardProps) => {
  const intl = useINTLContext()

  return (
    <div className="border border-ud-neutral-300 rounded p-3 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3">
          <img width={30} className="w-8 overflow-hidden rounded" src={props.testimonial.enterprise.image.src} alt={props.testimonial.enterprise.image.alt} />
          <span className="font-bold">{props.testimonial.enterprise.name}</span>
        </div>
        <p className="mt-2 text-xs" dangerouslySetInnerHTML={{
          __html: intl.t(props.testimonial.description)
        }}></p>
      </div>
      <div className="flex items-center gap-3 border-t border-ud-neutral-300 pt-3 mt-3">
        <div className="object-cover overflow-hidden rounded-full w-10 h-10 flex items-center justify-center border">
          <img width={60} height={60} className="w-full h-full" src={props.testimonial.author.image.src} alt={props.testimonial.author.image.alt} />
        </div>
        <div>
          <span className="block text-xs font-bold">{props.testimonial.author.name}</span>
          <span className="block text-2xs">{intl.t(props.testimonial.author.position)}</span>
        </div>
      </div>
    </div>
  )
}