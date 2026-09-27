import { TESTIMONIALS } from "@/constants/profile"
import type { Term } from "@/constants/intl"
import type { Testimonial } from "@/constants/profile"
import type { Feedback } from "@/types/service/feedback"

export const feedbackToTestimonialAdapter = (feedback: Feedback): Testimonial => ({
  value: feedback.id,
  author: {
    image: feedback.profileImageUrl ? {
      src: feedback.profileImageUrl,
      alt: feedback.displayName
    } : undefined,
    name: feedback.displayName,
    position: feedback.role,
  },
  description: feedback.publicMessage,
  enterprise: {
    name: feedback.company,
    image: feedback.companyImageUrl ? {
      src: feedback.companyImageUrl,
      alt: feedback.company ?? "enterprise"
    } : undefined
  }
})

export const getTestimonials = (
  feedbacks: Feedback[],
  translate: (term: Term) => string,
): Testimonial[] => {
  if (feedbacks.length > 0) return feedbacks.map(feedbackToTestimonialAdapter)

  return TESTIMONIALS.map((testimonial) => ({
    ...testimonial,
    author: {
      ...testimonial.author,
      position: testimonial.author.position ? translate(testimonial.author.position as Term) : undefined,
    },
    description: translate(testimonial.description as Term),
  }))
}
