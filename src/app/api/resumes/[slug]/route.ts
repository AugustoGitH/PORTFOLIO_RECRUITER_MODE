import { StaticResumeCatalog, getResumeFilename, renderResume, toResumeProfile, type ResumeLocale } from "@backend/resume"
import { metricsController, metricsService } from "@backend/metrics"
import { withRateLimit } from "@backend/security"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const supportedLocales: ResumeLocale[] = ["ptbr", "en"]

async function download(request: Request, context: { params: Promise<{ slug: string }> }) {
  const locale = new URL(request.url).searchParams.get("locale")

  if (!locale || !supportedLocales.includes(locale as ResumeLocale)) {
    return Response.json({ error: "Invalid resume locale" }, { status: 400 })
  }

  const { slug } = await context.params
  const definition = await new StaticResumeCatalog().find({ slug, locale: locale as ResumeLocale })

  if (!definition) {
    return Response.json({ error: "Resume not found" }, { status: 404 })
  }

  try {
    const profile = toResumeProfile(definition, locale as ResumeLocale)
    const stream = await renderResume(profile)
    const chunks: Uint8Array[] = []

    for await (const chunk of stream) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk)
    }

    try {
      await metricsService.recordResumeDownload(metricsController.getVisitorId(request), locale, slug)
    } catch (metricsError) {
      console.error("Unable to record resume download", metricsError)
    }

    return new Response(Buffer.concat(chunks), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${getResumeFilename(profile.locale)}"`,
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("Unable to render resume", error)
    return Response.json({ error: "Unable to render resume" }, { status: 500 })
  }
}

export const GET = withRateLimit(
  download,
  { visitor: 3, ip: 10 },
  "resume-download",
)
