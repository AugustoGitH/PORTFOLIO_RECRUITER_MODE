import { beforeEach, describe, expect, it, vi } from "vitest"
import { ObjectId } from "mongodb"

const repository = {
  create: vi.fn(),
  audit: vi.fn(),
  listPublished: vi.fn(),
  listByStatus: vi.fn(),
  findByVisitorId: vi.fn(),
  findById: vi.fn(),
  update: vi.fn(),
}

vi.mock("@backend/feedback/repositories", () => ({ feedbackRepository: repository }))

const { feedbackService, FeedbackError } = await import("./main")

describe("feedback service", () => {
  const id = new ObjectId()
  const moderatorId = new ObjectId().toHexString()
  const pendingFeedback = {
    _id: id,
    message: "Uma mensagem de feedback com conteúdo suficiente.",
    consent: { publishedAt: new Date(), version: "v1" },
    status: "pending" as const,
    submittedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    repository.findByVisitorId.mockResolvedValue(null)
  })

  it("creates private feedback as pending with a retention date and audit entry", async () => {
    repository.create.mockResolvedValue(id)
    await feedbackService.submit({ visitorId: "visitor-id", message: pendingFeedback.message, consentVersion: "v1" })

    expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({ visitorId: "visitor-id", status: "pending", message: pendingFeedback.message, retentionDeleteAt: expect.any(Date) }))
    expect(repository.audit).toHaveBeenCalledWith(expect.objectContaining({ feedbackId: id, action: "submitted" }))
  })

  it("allows only one feedback per visitor", async () => {
    repository.findByVisitorId.mockResolvedValue(pendingFeedback)
    await expect(feedbackService.submit({ visitorId: "visitor-id", message: pendingFeedback.message, consentVersion: "v1" })).rejects.toMatchObject({ status: 409 })
    expect(repository.create).not.toHaveBeenCalled()
  })

  it("rejects a direct transition from pending to published", async () => {
    repository.findById.mockResolvedValue(pendingFeedback)
    await expect(feedbackService.moderate(id.toHexString(), moderatorId, {
      status: "published",
      editorial: { displayName: "Ana", publicMessage: "Conteúdo revisado." },
    })).rejects.toBeInstanceOf(FeedbackError)
    expect(repository.update).not.toHaveBeenCalled()
  })

  it("approves pending feedback and records the moderator", async () => {
    repository.findById.mockResolvedValue(pendingFeedback)
    repository.update.mockResolvedValue({ ...pendingFeedback, status: "approved" })

    await feedbackService.moderate(id.toHexString(), moderatorId, {
      status: "approved",
      editorial: { displayName: "Ana", publicMessage: "Conteúdo revisado." },
    })

    expect(repository.update).toHaveBeenCalledWith(id, expect.objectContaining({ status: "approved", reviewedBy: expect.any(ObjectId) }))
    expect(repository.audit).toHaveBeenCalledWith(expect.objectContaining({ action: "moderated", actorId: expect.any(ObjectId) }))
  })
})
