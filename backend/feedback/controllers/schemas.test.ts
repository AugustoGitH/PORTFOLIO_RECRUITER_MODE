import { describe, expect, it } from "vitest"
import { feedbackModerationSchema, feedbackSubmissionSchema } from "./schemas"

describe("feedback schemas", () => {
  const validSubmission = {
    message: "Trabalhamos juntos e sua contribuição foi muito importante.",
    linkedinUrl: "https://www.linkedin.com/in/example",
    consent: true,
    consentVersion: "v1",
  }

  it("accepts a consenting submission with an HTTPS LinkedIn URL", () => {
    expect(feedbackSubmissionSchema.safeParse(validSubmission).success).toBe(true)
  })

  it("rejects messages shorter than 20 characters and missing consent", () => {
    expect(feedbackSubmissionSchema.safeParse({ ...validSubmission, message: "Muito bom", consent: false }).success).toBe(false)
  })

  it("rejects URLs outside linkedin.com or without HTTPS", () => {
    expect(feedbackSubmissionSchema.safeParse({ ...validSubmission, linkedinUrl: "http://linkedin.com/in/example" }).success).toBe(false)
    expect(feedbackSubmissionSchema.safeParse({ ...validSubmission, linkedinUrl: "https://example.com/in/example" }).success).toBe(false)
  })

  it("requires an editorial identity and public message when editorial content is supplied", () => {
    expect(feedbackModerationSchema.safeParse({ status: "approved", editorial: { displayName: "Ana", publicMessage: "Ótimo trabalho." } }).success).toBe(true)
    expect(feedbackModerationSchema.safeParse({ status: "approved", editorial: { displayName: "", publicMessage: "" } }).success).toBe(false)
  })
})
