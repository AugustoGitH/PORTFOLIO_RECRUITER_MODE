import "server-only"
import { ObjectId } from "mongodb"
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache"
import { portfolioFeedbackRepository } from "@backend/portfolio-feedbacks/repositories"
import type {
  PortfolioFeedbackCategory,
  PortfolioFeedbackStatus,
} from "@backend/portfolio-feedbacks/models"

const pageSize = 50
const publicFeedbackLimit = 4
const publishedCacheTag = "portfolio-feedbacks:published"

const cachedPublishedFeedbacks = unstable_cache(
  () => portfolioFeedbackRepository.listPublished(publicFeedbackLimit),
  [publishedCacheTag],
  { revalidate: 300, tags: [publishedCacheTag] },
)

export class PortfolioFeedbackError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message)
  }
}

const decodeCursor = (value?: string) => {
  if (!value) return undefined
  const [submittedAt, id] = Buffer.from(value, "base64url").toString("utf8").split("|")
  const date = new Date(submittedAt)

  return Number.isNaN(date.getTime()) || !ObjectId.isValid(id) ? undefined : { submittedAt: date, id: new ObjectId(id) }
}

const encodeCursor = (value: { submittedAt: Date; _id: ObjectId }) =>
  Buffer.from(`${value.submittedAt.toISOString()}|${value._id.toHexString()}`).toString("base64url")

export const portfolioFeedbackService = {
  submit: (message: string, visitorId: string, publicationConsent = false) => portfolioFeedbackRepository.create({
    message,
    visitorId,
    submittedAt: new Date(),
    publicationConsent,
    status: "pending",
  }),

  async getPublished() {
    try {
      return (await cachedPublishedFeedbacks()).map((feedback) => ({
        id: String(feedback._id),
        message: feedback.message,
        category: feedback.category ?? "general",
      }))
    } catch (error) {
      console.error("Unable to load published portfolio feedbacks", error)
      return []
    }
  },

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

  async moderate(
    id: string,
    input: {
      status: PortfolioFeedbackStatus
      category: PortfolioFeedbackCategory
    },
  ) {
    const feedback = await portfolioFeedbackRepository.findById(id)
    if (!feedback) return null
    if (input.status === "published" && !feedback.publicationConsent) {
      throw new PortfolioFeedbackError("Portfolio feedback publication was not authorized", 409)
    }

    const updated = await portfolioFeedbackRepository.update(feedback._id, {
      status: input.status,
      category: input.category,
      ...(input.status === "published" && feedback.status !== "published"
        ? { publishedAt: new Date() }
        : {}),
    })

    if (input.status === "published" || feedback.status === "published") {
      revalidateTag(publishedCacheTag, { expire: 0 })
      revalidatePath("/")
    }

    return updated
  },
}
