import "server-only"
import { z } from "zod"
import { getVerifiedAdminSession } from "@backend/admin/authorization"
import {
  RECOMMENDATION_SKILLS,
  normalizeRecommendationSkill,
} from "@backend/developer-recommendations/catalog"
import { recommendationService } from "@backend/developer-recommendations/services"

const noStore = { "Cache-Control": "no-store" }
const schema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  status: z.enum(["draft", "published", "paused", "archived"]),
  displayName: z.string().min(1).max(160),
  headline: z.string().min(1).max(200),
  seniority: z.enum(["junior", "mid-level", "senior"]),
  roleKinds: z.array(z.enum(["frontend", "backend", "database", "tests", "architecture", "tools"])).min(1),
  skills: z.array(z.enum(RECOMMENDATION_SKILLS)).max(5),
  summary: z.string().max(500).optional(),
  availability: z.string().max(160).optional(),
  contact: z.object({
    label: z.string().min(1).max(80),
    url: z.string().url(),
  }),
  editorialPriority: z.number().int(),
  consent: z.object({
    grantedAt: z.coerce.date(),
    confirmedAt: z.coerce.date(),
    version: z.string().min(1).max(64),
  }),
}).strict()

const authorize = async (permission: "recommendation.read" | "recommendation.manage") => {
  const session = await getVerifiedAdminSession()
  if (!session) return 401
  if (!session.permissions.includes(permission)) return 403

  return session
}

export const recommendationController = {
  async list() {
    const session = await authorize("recommendation.read")
    if (typeof session === "number") {
      return Response.json({ error: session === 401 ? "Unauthorized" : "Forbidden" }, { status: session, headers: noStore })
    }

    const recommendations = await recommendationService.list()
    return Response.json(recommendations.map((item) => ({ ...item, _id: String(item._id) })), { headers: noStore })
  },

  async save(request: Request, id?: string) {
    const session = await authorize("recommendation.manage")
    if (typeof session === "number") {
      return Response.json({ error: session === 401 ? "Unauthorized" : "Forbidden" }, { status: session, headers: noStore })
    }

    const body = await request.json().catch(() => null)
    if (body?.skills) body.skills = body.skills.map(normalizeRecommendationSkill)

    const parsed = schema.safeParse(body)
    if (!parsed.success) return Response.json({ error: "Invalid recommendation" }, { status: 400, headers: noStore })

    const saved = await recommendationService.save(id, session.userId, parsed.data)
    if (!saved) return Response.json({ error: "Not found" }, { status: 404, headers: noStore })

    return Response.json({ id: String(saved) }, { status: id ? 200 : 201, headers: noStore })
  },

  async uploadAvatar(request: Request) {
    const session = await authorize("recommendation.manage")
    if (typeof session === "number") {
      return Response.json({ error: session === 401 ? "Unauthorized" : "Forbidden" }, { status: session, headers: noStore })
    }

    const form = await request.formData().catch(() => null)
    const recommendationId = form?.get("recommendationId")
    const avatar = form?.get("avatar")
    if (typeof recommendationId !== "string" || !(avatar instanceof File) || avatar.size === 0 || avatar.size > 5 * 1024 * 1024) {
      return Response.json({ error: "Invalid avatar upload" }, { status: 400, headers: noStore })
    }

    try {
      const publicUrl = await recommendationService.attachAvatar(recommendationId, session.userId, Buffer.from(await avatar.arrayBuffer()))
      return publicUrl ? Response.json({ publicUrl }, { headers: noStore }) : Response.json({ error: "Not found" }, { status: 404, headers: noStore })
    } catch {
      return Response.json({ error: "Avatar unavailable" }, { status: 503, headers: noStore })
    }
  },

  async removeAvatar(request: Request) {
    const session = await authorize("recommendation.manage")
    if (typeof session === "number") {
      return Response.json({ error: session === 401 ? "Unauthorized" : "Forbidden" }, { status: session, headers: noStore })
    }

    const recommendationId = (await request.json().catch(() => null))?.recommendationId
    if (typeof recommendationId !== "string") return Response.json({ error: "Invalid avatar removal" }, { status: 400, headers: noStore })

    try {
      const removed = await recommendationService.removeAvatar(recommendationId, session.userId)
      return removed ? new Response(null, { status: 204, headers: noStore }) : Response.json({ error: "Not found" }, { status: 404, headers: noStore })
    } catch {
      return Response.json({ error: "Avatar unavailable" }, { status: 503, headers: noStore })
    }
  },
}
