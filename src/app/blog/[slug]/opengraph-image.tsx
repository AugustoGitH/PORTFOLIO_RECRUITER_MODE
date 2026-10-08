import { ImageResponse } from "next/og"
import sharp from "sharp"
import { getBlogPostMetadataData } from "@/server/blog"

export const alt = "Artigo do blog de Augusto Westphal"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ?? "https://www.augustowestphal.com.br"

const fallbackCoverUrl = new URL(
  "/assets/blog/cache-blocks.png",
  siteUrl,
).toString()

const getSocialCoverUrl = async (coverUrl?: string) => {
  if (!coverUrl) return fallbackCoverUrl

  try {
    const response = await fetch(coverUrl)
    if (!response.ok) return fallbackCoverUrl

    const png = await sharp(await response.arrayBuffer())
      .resize({
        width: 520,
        height: 630,
        fit: "inside",
        withoutEnlargement: true,
      })
      .png({ compressionLevel: 9 })
      .toBuffer()

    return `data:image/png;base64,${png.toString("base64")}`
  } catch {
    return fallbackCoverUrl
  }
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getBlogPostMetadataData(slug)
  const coverUrl = await getSocialCoverUrl(post?.cover?.url)

  return new ImageResponse(
    <div
      style={{
        background: "#f7f5fb",
        color: "#17131f",
        display: "flex",
        height: "100%",
        padding: "46px",
        width: "100%",
      }}
    >
      <div
        style={{
          background: "white",
          border: "2px solid #ded8e8",
          borderRadius: "24px",
          display: "flex",
          height: "100%",
          overflow: "hidden",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "54px",
            width: "64%",
          }}
        >
          <div
            style={{
              alignSelf: "flex-start",
              background: "#eee4ff",
              borderRadius: "999px",
              color: "#7134d4",
              display: "flex",
              fontSize: "22px",
              fontWeight: 700,
              padding: "10px 20px",
            }}
          >
            {post?.category ?? "Blog"}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: post && post.title.length > 70 ? "48px" : "58px",
              fontWeight: 800,
              letterSpacing: "-2px",
              lineHeight: 1.05,
              marginTop: "34px",
            }}
          >
            {post?.title ?? "Blog de Augusto Westphal"}
          </div>

          <div
            style={{
              color: "#655d70",
              display: "flex",
              fontSize: "22px",
              marginTop: "auto",
            }}
          >
            Augusto Westphal · Desenvolvedor Web Full Stack
          </div>
        </div>

        <div
          style={{
            alignItems: "center",
            background: "linear-gradient(145deg, #201332, #7c3aed)",
            display: "flex",
            justifyContent: "center",
            overflow: "hidden",
            position: "relative",
            width: "36%",
          }}
        >
          <img
            alt=""
            src={coverUrl}
            style={{
              height: "100%",
              objectFit: "contain",
              padding: post?.cover ? "0" : "56px",
              width: "100%",
            }}
          />
        </div>
      </div>
    </div>,
    size,
  )
}
