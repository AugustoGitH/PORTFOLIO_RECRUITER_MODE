import type { Testimonial } from "../../../../../../constants/profile"
import type { PropsWithClassName } from "../../../../../../utils/types"

export type TestimonialCardProps = PropsWithClassName<{
  testimonial: Testimonial
  featured?: boolean
}>
