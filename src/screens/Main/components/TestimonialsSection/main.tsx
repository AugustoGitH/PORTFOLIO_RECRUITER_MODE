import { useMemo } from "react"
import Image from "next/image"
import { Chip } from "../../../../components/action/Chip"
import { Container } from "../../../../components/layout/Container"
import { SECTIONS } from "../../../../constants/profile"
import { FeedbackForm } from "../../../../features/feedback"
import { slug } from "../../../../utils/string"
import { cn } from "../../../../utils/tailwind"
import { useINTLContext } from "../../../../providers/intl"
import { TestimonialCard } from "./components"
import type { TestimonialsSectionProps } from "./types"
import { getTestimonials } from "./utils"

export const TestimonialsSection = (props: TestimonialsSectionProps) => {
  const intl = useINTLContext()

  const testimonials = useMemo(
    () => getTestimonials(props.feedbacks, intl.t),
    [props.feedbacks, intl.t],
  )
  const featuredTestimonial = testimonials.find((item) => item.value === "emanuel") ?? testimonials[0]
  const otherTestimonials = testimonials.filter((item) => item !== featuredTestimonial)
  const [firstAside, secondAside, wideTestimonial, ...remainingTestimonials] = otherTestimonials

  return (
    <Container id={SECTIONS.testimonials.value} className={cn("bg-ud-neutral-100", props.className)}>
      <div>
        <div className="grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_10rem] lg:grid-cols-[minmax(0,1fr)_12rem]">
          <div className="min-w-0">
            <Chip size="sm">{intl.t("TestimonialsEyebrow")}</Chip>
            <h2 className="mt-2 text-3xl font-bold leading-tight text-ud-neutral-950 md:text-4xl">{intl.t("TestimonialsHeadline")}</h2>
            <p className="mt-2 text-sm text-ud-secondary-600 md:text-base">{intl.t("TestimonialsIntro")}</p>
          </div>
          <Image
            src="/assets/profile/testimonials-bubbles.png"
            alt={intl.t("TestimonialsBubblesAlt")}
            width={210}
            height={140}
            className="hidden h-auto w-full md:block"
          />
        </div>
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {featuredTestimonial && (
            <TestimonialCard
              key={slug("testimonial", featuredTestimonial.value)}
              testimonial={featuredTestimonial}
              featured
              className={otherTestimonials.length
                ? "md:row-span-2 lg:col-start-1 lg:row-start-1"
                : "md:col-span-2 lg:col-start-1 lg:row-start-1"}
            />
          )}
          {firstAside && (
            <TestimonialCard
              key={slug("testimonial", firstAside.value)}
              testimonial={firstAside}
              className="lg:col-start-2 lg:row-start-1"
            />
          )}
          {secondAside && (
            <TestimonialCard
              key={slug("testimonial", secondAside.value)}
              testimonial={secondAside}
              className="lg:col-start-2 lg:row-start-2"
            />
          )}
          {wideTestimonial && (
            <TestimonialCard
              key={slug("testimonial", wideTestimonial.value)}
              testimonial={wideTestimonial}
              className="md:col-span-2 lg:col-start-1 lg:row-start-3"
            />
          )}
          <FeedbackForm
            className="h-full rounded-md border-ud-auxiliary-purple/30 bg-ud-auxiliary-purple-light/50 md:col-span-2 lg:col-span-1 lg:col-start-3 lg:row-start-1 lg:row-span-3"
            classNameButton="w-full justify-center"
            title={intl.t("HaveYouWorkedWithMe")}
            description={intl.t("ShareYourTestimonial")}
          />
          {remainingTestimonials.map((testimonial) => (
            <TestimonialCard key={slug("testimonial", testimonial.value)} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </Container>
  )
}
