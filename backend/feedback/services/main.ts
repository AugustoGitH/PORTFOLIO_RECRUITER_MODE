import "server-only"
import { ObjectId } from "mongodb"
import { randomUUID } from "crypto"
import sharp from "sharp"
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache"
import { feedbackRepository } from "@backend/feedback/repositories"
import { deletePublicObject, putPublicWebp } from "@backend/media/storage"
import type { Feedback, FeedbackEditorial, FeedbackStatus, PublicFeedback } from "@backend/feedback/models"

const publishedCacheTag = "feedbacks:published"
const retentionMs = 90 * 24 * 60 * 60 * 1000

const cachedPublishedFeedbacks = unstable_cache(
  async () => feedbackRepository.listPublished(),
  [publishedCacheTag],
  { revalidate: 300, tags: [publishedCacheTag] },
)

const toPublicFeedback = (feedback: Feedback): PublicFeedback | null => {
  if (!feedback.editorial) return null
  return {
    id: String(feedback._id),
    publicMessage: feedback.editorial.publicMessage,
    displayName: feedback.editorial.displayName,
    role: feedback.editorial.role,
    company: feedback.editorial.company,
  }
}

const transitions: Record<FeedbackStatus, FeedbackStatus[]> = {
  pending: ["approved", "rejected"],
  approved: ["published", "archived", "redacted"],
  published: ["archived", "redacted"],
  rejected: [],
  archived: ["published", "redacted"],
  redacted: [],
}

export class FeedbackError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message)
  }
}

export const feedbackService = {
  async submit(input: { visitorId: string; message: string; linkedinUrl?: string; consentVersion: string }) {
    if (await feedbackRepository.findByVisitorId(input.visitorId)) throw new FeedbackError("Feedback already submitted", 409)
    const now = new Date()
    let id: ObjectId
    try {
      id = await feedbackRepository.create({
        visitorId: input.visitorId,
        message: input.message,
        linkedinUrl: input.linkedinUrl,
        consent: { publishedAt: now, version: input.consentVersion },
        status: "pending",
        submittedAt: now,
        retentionDeleteAt: new Date(now.getTime() + retentionMs),
      })
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) throw new FeedbackError("Feedback already submitted", 409)
      throw error
    }
    await feedbackRepository.audit({ feedbackId: id, action: "submitted", at: now })
  },
  async getPublished() {
    try {
      return (await Promise.all((await cachedPublishedFeedbacks()).map(async (feedback) => {
        const publicFeedback = toPublicFeedback(feedback)
        if (!publicFeedback) return null
        const [profileMedia, companyMedia] = await Promise.all([
          feedback.editorial?.profileImageId ? feedbackRepository.findMediaById(feedback.editorial.profileImageId) : null,
          feedback.editorial?.companyImageId ? feedbackRepository.findMediaById(feedback.editorial.companyImageId) : null,
        ])
        return { ...publicFeedback, ...(profileMedia ? { profileImageUrl: profileMedia.publicUrl } : {}), ...(companyMedia ? { companyImageUrl: companyMedia.publicUrl } : {}) }
      }))).filter((feedback): feedback is PublicFeedback => feedback !== null)
    } catch (error) {
      console.error("Unable to load published feedbacks", error)
      return []
    }
  },
  async listForModeration(status: FeedbackStatus) {
    return feedbackRepository.listByStatus(status)
  },
  async listAllForModeration() { return feedbackRepository.listAll() },
  async getAvatarUrl(profileImageId?: ObjectId) {
    return profileImageId ? (await feedbackRepository.findMediaById(profileImageId))?.publicUrl : undefined
  },
  async attachAvatar(id: string, actorId: string, source: Buffer, kind: "profile" | "company" = "profile") {
    const feedback = await feedbackRepository.findById(id)
    if (!feedback) throw new FeedbackError("Feedback not found", 404)
    if (!(["approved", "published", "archived"] as FeedbackStatus[]).includes(feedback.status) || !feedback.editorial) throw new FeedbackError("Avatar requires approved, published, or archived feedback", 409)
    if (!ObjectId.isValid(actorId)) throw new FeedbackError("Invalid moderator", 400)
    const image = sharp(source, { failOn: "error" })
    const metadata = await image.metadata()
    if (!metadata.format || !["jpeg", "png", "webp"].includes(metadata.format)) throw new FeedbackError("Unsupported image format")
    const output = await image.rotate().resize(512, 512, { fit: "cover", position: "attention" }).webp({ quality: 82 }).toBuffer({ resolveWithObject: true })
    const field = kind === "profile" ? "profileImageId" : "companyImageId"
    const stored = await putPublicWebp(`testimonials-feedback/${id}/${kind}/${randomUUID()}.webp`, output.data)
    const mediaId = await feedbackRepository.createMedia({ provider: "r2", ...stored, contentType: "image/webp", width: output.info.width, height: output.info.height, bytes: output.info.size, createdBy: new ObjectId(actorId) })
    await feedbackRepository.update(feedback._id, { editorial: { ...feedback.editorial, [field]: mediaId } })
    if (feedback.editorial[field]) {
      const previous = await feedbackRepository.findMediaById(feedback.editorial[field])
      if (previous) {
        await deletePublicObject(previous.key)
        await feedbackRepository.markMediaDeleted(previous._id)
      }
    }
    if (feedback.status === "published") {
      revalidateTag(publishedCacheTag, { expire: 0 })
      revalidatePath("/")
    }
    return stored.publicUrl
  },
  async removeAvatar(id: string, actorId: string, kind: "profile" | "company" = "profile") {
    const feedback = await feedbackRepository.findById(id)
    if (!feedback) throw new FeedbackError("Feedback not found", 404)
    const field = kind === "profile" ? "profileImageId" : "companyImageId"
    if (!ObjectId.isValid(actorId) || !feedback.editorial?.[field]) throw new FeedbackError("Avatar not found", 404)
    const media = await feedbackRepository.findMediaById(feedback.editorial[field])
    if (!media) throw new FeedbackError("Avatar not found", 404)
    await deletePublicObject(media.key)
    const editorial = { ...feedback.editorial }
    delete editorial[field]
    await feedbackRepository.update(feedback._id, { editorial })
    await feedbackRepository.markMediaDeleted(media._id)
    if (feedback.status === "published") {
      revalidateTag(publishedCacheTag, { expire: 0 })
      revalidatePath("/")
    }
  },
  async remove(id: string, actorId: string) {
    const feedback = await feedbackRepository.findById(id)
    if (!feedback) throw new FeedbackError("Feedback not found", 404)
    if (!ObjectId.isValid(actorId)) throw new FeedbackError("Invalid moderator", 400)
    const mediaIds = [feedback.editorial?.profileImageId, feedback.editorial?.companyImageId].filter((mediaId): mediaId is ObjectId => Boolean(mediaId))
    for (const mediaId of mediaIds) {
      const media = await feedbackRepository.findMediaById(mediaId)
      if (media) {
        await deletePublicObject(media.key)
        await feedbackRepository.markMediaDeleted(media._id)
      }
    }
    await feedbackRepository.audit({ feedbackId: feedback._id, action: "removed", actorId: new ObjectId(actorId), at: new Date() })
    await feedbackRepository.remove(feedback._id)
    if (feedback.status === "published") {
      revalidateTag(publishedCacheTag, { expire: 0 })
      revalidatePath("/")
    }
  },
  async moderate(id: string, actorId: string, input: { status?: FeedbackStatus; editorial?: FeedbackEditorial }) {
    const current = await feedbackRepository.findById(id)
    if (!current) throw new FeedbackError("Feedback not found", 404)
    if (!ObjectId.isValid(actorId)) throw new FeedbackError("Invalid moderator", 400)
    const status = input.status ?? current.status
    if (status !== current.status && !transitions[current.status].includes(status)) throw new FeedbackError("Invalid feedback status transition", 409)
    const editorial = input.editorial ? { ...current.editorial, ...input.editorial } : current.editorial
    if (status === "published" && (!editorial?.displayName || !editorial.publicMessage)) throw new FeedbackError("Published feedback requires editorial content", 400)
    const now = new Date()
    const isTerminalPrivate = status === "rejected" || status === "redacted"
    const updated = await feedbackRepository.update(current._id, {
      ...(editorial ? { editorial } : {}),
      status,
      reviewedAt: now,
      reviewedBy: new ObjectId(actorId),
      ...(status === "published" && !current.publishedAt ? { publishedAt: now, retentionDeleteAt: undefined } : {}),
      ...(isTerminalPrivate ? { retentionDeleteAt: new Date(now.getTime() + retentionMs) } : {}),
    })
    await feedbackRepository.audit({ feedbackId: current._id, action: "moderated", actorId: new ObjectId(actorId), at: now })
    if (status === "published" || current.status === "published") {
      revalidateTag(publishedCacheTag, { expire: 0 })
      revalidatePath("/")
    }
    return updated
  },
}
