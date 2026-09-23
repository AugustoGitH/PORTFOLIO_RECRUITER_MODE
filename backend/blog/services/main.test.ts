import { beforeEach, describe, expect, it, vi } from "vitest"
import { ObjectId } from "mongodb"

const repository = {
  listPosts: vi.fn(),
  getTotals: vi.fn(),
  findMediaByIds: vi.fn(),
  findMedia: vi.fn(),
}

vi.mock("@backend/blog/repositories", () => ({ blogRepository: repository }))
vi.mock("@backend/media/storage", () => ({
  deletePublicObject: vi.fn(),
  putPublicWebp: vi.fn(),
}))
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
  unstable_cache: (callback: () => unknown) => callback,
}))

const { blogService } = await import("./main")

describe("blog service public posts", () => {
  const postId = new ObjectId()
  const categoryId = new ObjectId()
  const coverMediaId = new ObjectId()
  const authorId = new ObjectId()
  const post = {
    _id: postId,
    slug: "post-com-capa",
    status: "published" as const,
    title: "Post com capa",
    subtitle: "Subtítulo editorial",
    excerpt: "Resumo da listagem",
    markdown: "Conteúdo do post",
    categoryId,
    coverMediaId,
    publishedAt: new Date("2026-09-20T12:00:00.000Z"),
    createdBy: authorId,
    updatedBy: authorId,
    createdAt: new Date("2026-09-20T11:00:00.000Z"),
    updatedAt: new Date("2026-09-20T12:00:00.000Z"),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    repository.listPosts.mockResolvedValue([post])
    repository.getTotals.mockResolvedValue(new Map([[postId.toHexString(), { views: 2, likes: 1 }]]))
    repository.findMediaByIds.mockResolvedValue([{
      _id: coverMediaId,
      publicUrl: "https://media.example/cover.webp",
      width: 1200,
      height: 630,
    }])
  })

  it("includes the subtitle and resolved cover without exposing its media id", async () => {
    const [result] = await blogService.publishedPosts()

    expect(result).toMatchObject({
      slug: post.slug,
      subtitle: post.subtitle,
      cover: {
        url: "https://media.example/cover.webp",
        width: 1200,
        height: 630,
      },
    })
    expect(result).not.toHaveProperty("coverMediaId")
  })
})
