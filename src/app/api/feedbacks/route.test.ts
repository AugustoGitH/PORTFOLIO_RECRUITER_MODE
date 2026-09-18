import { beforeEach, describe, expect, it, vi } from "vitest"

const submit = vi.fn()
vi.mock("@backend/feedback/services", () => ({ feedbackService: { submit }, FeedbackError: class FeedbackError extends Error {} }))
vi.mock("@backend/admin/authorization", () => ({ getVerifiedAdminSession: vi.fn() }))

const { POST } = await import("./route")

describe("POST /api/feedbacks", () => {
  const body = {
    message: "Trabalhamos juntos e sua contribuição foi muito importante.",
    consent: true,
    consentVersion: "v1",
  }

  beforeEach(() => vi.clearAllMocks())

  it("accepts a valid same-origin submission", async () => {
    const response = await POST(new Request("http://localhost:5173/api/feedbacks", {
      method: "POST",
      headers: { "content-type": "application/json", origin: "http://localhost:5173" },
      body: JSON.stringify(body),
    }), undefined)

    expect(response.status).toBe(202)
    expect(await response.json()).toEqual({ status: "received" })
    expect(submit).toHaveBeenCalledWith(expect.objectContaining({ message: body.message, consentVersion: "v1" }))
  })

  it("rejects a cross-origin write before reaching the service", async () => {
    const response = await POST(new Request("http://localhost:5173/api/feedbacks", {
      method: "POST",
      headers: { "content-type": "application/json", origin: "https://attacker.example" },
      body: JSON.stringify(body),
    }), undefined)

    expect(response.status).toBe(403)
    expect(submit).not.toHaveBeenCalled()
  })
})
