import { Container } from "../../components/layout/Container"
import { SECTIONS, TESTIMONIALS } from "../../constants/profile"
import { FeedbackForm } from "../../features/feedback"
import { slug } from "../../utils/string"
import { cn } from "../../utils/tailwind"
import type { PropsWithClassName } from "../../utils/types"
import { TestimonialCard } from "./components"
import { useINTLContext } from "../../providers/intl"

export const TestimonialsSection = (props: PropsWithClassName) => {
  const intl = useINTLContext()

  return (
    <Container id={SECTIONS.testimonials.value} className={cn("bg-ud-neutral-100", props.className)}>
      <div>
        <h2 className="text-2xl font-bold text-ud-neutral-950">{intl.t(SECTIONS.testimonials.title)}</h2>
        <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3  gap-2">
          {
            TESTIMONIALS.map(testimonial => (
              <TestimonialCard key={slug("testimonial", testimonial.value)} testimonial={testimonial} />
            ))
          }
          <FeedbackForm
            classNameButton="w-full justify-center"
            title={intl.t("HaveYouWorkedWithMe")}
            description={intl.t("ShareYourTestimonial")}
          />
        </div>
      </div>
    </Container>
  )
}