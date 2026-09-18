import { beforeEach, describe, expect, it, vi } from "vitest"

const submit = vi.fn()

vi.mock("@backend/portfolio-feedbacks/services", () => ({
  portfolioFeedbackService: { submit },
}))

const { POST } = await import("./route")

describe("POST /api/portfolio-feedbacks", () => {
  beforeEach(() => vi.clearAllMocks())

  it("accepts a minimal same-origin message without client identifiers", async () => {
    const response = await POST(new Request("http://localhost:5173/api/portfolio-feedbacks", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "http://localhost:5173",
        "idempotency-key": crypto.randomUUID(),
      },
      body: JSON.stringify({ message: "O portfólio está claro e objetivo." }),
    }), undefined)

    expect(response.status).toBe(202)
    expect(await response.json()).toEqual({ status: "received" })
    expect(submit).toHaveBeenCalledWith("O portfólio está claro e objetivo.", expect.any(String))
  })

  it("blocks cross-origin writes before reaching the service", async () => {
    const response = await POST(new Request("http://localhost:5173/api/portfolio-feedbacks", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://attacker.example",
        "idempotency-key": crypto.randomUUID(),
      },
      body: JSON.stringify({ message: "Mensagem privada" }),
    }), undefined)

    expect(response.status).toBe(403)
    expect(submit).not.toHaveBeenCalled()
  })

  it("rejects client-controlled fields", async () => {
    const response = await POST(new Request("http://localhost:5173/api/portfolio-feedbacks", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "http://localhost:5173",
        "idempotency-key": crypto.randomUUID(),
      },
      body: JSON.stringify({ message: "Mensagem privada", visitorId: "not-allowed" }),
    }), undefined)

    expect(response.status).toBe(400)
    expect(submit).not.toHaveBeenCalled()
  })
})
