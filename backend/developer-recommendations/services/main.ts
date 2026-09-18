import "server-only"
import { ObjectId } from "mongodb"
import { randomUUID } from "crypto"
import sharp from "sharp"
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache"
import { recommendationRepository } from "@backend/developer-recommendations/repositories"
import { deletePublicObject, putPublicWebp } from "@backend/media/storage"
import { selectRecommendations } from "@backend/developer-recommendations/selectors"
import type {
  DeveloperRecommendation,
  PublicRecommendation,
  RecommendationRole,
  RecommendationSeniority,
  RecommendationStatus,
} from "@backend/developer-recommendations/models"

const publishedTag = "recommendations:published"
const published = unstable_cache(
  () => recommendationRepository.list("published"),
  [publishedTag],
  { revalidate: 300, tags: [publishedTag] },
)

const editableRecommendation = (recommendation: DeveloperRecommendation) => {
  const { _id, createdAt, updatedAt, ...input } = recommendation
  return input
}

const toPublicRecommendation = async (
  profile: DeveloperRecommendation,
  context: { roles: RecommendationRole[] },
): Promise<PublicRecommendation> => ({
  id: String(profile._id),
  displayName: profile.displayName,
  headline: profile.headline,
  seniority: profile.seniority,
  skills: profile.skills.slice(0, 5),
  matchingRoles: profile.roleKinds.filter((role) => context.roles.includes(role)),
  avatarUrl: profile.avatarMediaId
    ? (await recommendationRepository.findMediaById(profile.avatarMediaId))?.publicUrl
    : undefined,
  summary: profile.summary,
  availability: profile.availability,
  contact: profile.contact,
})

export const recommendationService = {
  async list(status?: RecommendationStatus) {
    return Promise.all((await recommendationRepository.list(status)).map(async (recommendation) => ({
      ...recommendation,
      avatarUrl: recommendation.avatarMediaId
        ? (await recommendationRepository.findMediaById(recommendation.avatarMediaId))?.publicUrl
        : undefined,
    })))
  },

  async select(context: { roles: RecommendationRole[]; seniority?: RecommendationSeniority | null }): Promise<PublicRecommendation[]> {
    if (!context.roles.length) return []

    try {
      return Promise.all(selectRecommendations(await published(), context).map(({ profile }) => toPublicRecommendation(profile, context)))
    } catch {
      return []
    }
  },

  async save(
    id: string | undefined,
    actorId: string,
    input: Omit<DeveloperRecommendation, "_id" | "createdAt" | "updatedAt">,
  ) {
    const previous = id ? await recommendationRepository.find(id) : null
    const result = await recommendationRepository.save(id, input)
    if (!result) return null

    const action = input.status === "published" && previous?.status !== "published"
      ? "published"
      : input.status === "paused"
        ? "paused"
        : input.status === "archived"
          ? "archived"
          : previous
            ? "updated"
            : "created"

    await recommendationRepository.audit({
      recommendationId: result,
      actorId: new ObjectId(actorId),
      action,
      at: new Date(),
    })

    revalidateTag(publishedTag, { expire: 0 })
    revalidatePath("/")

    return result
  },

  async attachAvatar(id: string, actorId: string, source: Buffer) {
    const recommendation = await recommendationRepository.find(id)
    if (!recommendation) return null
    if (!ObjectId.isValid(actorId)) throw new Error("Invalid administrator")

    const image = sharp(source, { failOn: "error" })
    const metadata = await image.metadata()
    if (!metadata.format || !["jpeg", "png", "webp"].includes(metadata.format)) throw new Error("Unsupported image format")

    const output = await image
      .rotate()
      .resize(512, 512, { fit: "cover", position: "attention" })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true })
    const stored = await putPublicWebp(`developer-recommendations/${id}/avatar/${randomUUID()}.webp`, output.data)
    const mediaId = await recommendationRepository.createMedia({
      provider: "r2",
      ...stored,
      contentType: "image/webp",
      width: output.info.width,
      height: output.info.height,
      bytes: output.info.size,
      createdBy: new ObjectId(actorId),
    })

    await recommendationRepository.save(id, { ...editableRecommendation(recommendation), avatarMediaId: mediaId })
    if (recommendation.avatarMediaId) {
      const previous = await recommendationRepository.findMediaById(recommendation.avatarMediaId)
      if (previous) {
        await deletePublicObject(previous.key)
        await recommendationRepository.markMediaDeleted(previous._id)
      }
    }
    await recommendationRepository.audit({
      recommendationId: recommendation._id,
      actorId: new ObjectId(actorId),
      action: "updated",
      at: new Date(),
    })
    revalidateTag(publishedTag, { expire: 0 })
    revalidatePath("/")

    return stored.publicUrl
  },

  async removeAvatar(id: string, actorId: string) {
    const recommendation = await recommendationRepository.find(id)
    if (!recommendation?.avatarMediaId || !ObjectId.isValid(actorId)) return false
    const media = await recommendationRepository.findMediaById(recommendation.avatarMediaId)
    if (!media) return false

    await deletePublicObject(media.key)
    await recommendationRepository.save(id, { ...editableRecommendation(recommendation), avatarMediaId: undefined })
    await recommendationRepository.markMediaDeleted(media._id)
    await recommendationRepository.audit({
      recommendationId: recommendation._id,
      actorId: new ObjectId(actorId),
      action: "updated",
      at: new Date(),
    })
    revalidateTag(publishedTag, { expire: 0 })
    revalidatePath("/")

    return true
  },
}
