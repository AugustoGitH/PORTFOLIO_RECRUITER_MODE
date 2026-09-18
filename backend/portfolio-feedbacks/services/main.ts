import "server-only"
import { ObjectId } from "mongodb"
import { portfolioFeedbackRepository } from "@backend/portfolio-feedbacks/repositories"

const pageSize = 50

const decodeCursor = (value?: string) => {
  if (!value) return undefined
  const [submittedAt, id] = Buffer.from(value, "base64url").toString("utf8").split("|")
  const date = new Date(submittedAt)

  return Number.isNaN(date.getTime()) || !ObjectId.isValid(id) ? undefined : { submittedAt: date, id: new ObjectId(id) }
}

const encodeCursor = (value: { submittedAt: Date; _id: ObjectId }) =>
  Buffer.from(`${value.submittedAt.toISOString()}|${value._id.toHexString()}`).toString("base64url")

export const portfolioFeedbackService = {
  submit: (message: string, visitorId: string) => portfolioFeedbackRepository.create({ message, visitorId, submittedAt: new Date() }),

  async list(cursor?: string) {
    const records = await portfolioFeedbackRepository.list(decodeCursor(cursor), pageSize)
    const hasMore = records.length > pageSize
    const items = records.slice(0, pageSize)
    const last = items.at(-1)

    return {
      items,
      nextCursor: hasMore && last ? encodeCursor(last) : undefined,
    }
  },
}
