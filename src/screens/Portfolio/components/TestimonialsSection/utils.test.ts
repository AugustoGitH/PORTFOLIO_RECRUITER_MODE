import { describe, expect, it } from "vitest"
import { TESTIMONIALS } from "@/constants/profile"
import { getTestimonials } from "./utils"

describe("getTestimonials", () => {
  it("uses every static testimonial, including its approved local avatar, when feedbacks are unavailable", () => {
    const testimonials = getTestimonials([], (term) => term)

    expect(testimonials).toHaveLength(TESTIMONIALS.length)
    expect(testimonials.map((testimonial) => testimonial.author.image?.src)).toEqual(
      TESTIMONIALS.map((testimonial) => testimonial.author.image?.src),
    )
  })
})
