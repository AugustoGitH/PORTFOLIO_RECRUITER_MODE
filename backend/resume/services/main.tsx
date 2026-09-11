import { renderToStream } from "@react-pdf/renderer"
import { StandardResumeDocument } from "../documents"
import type { ResumeProfile } from "../data"
import type { ResumeLocale } from "../types"

export const renderResume = (profile: ResumeProfile) => renderToStream(<StandardResumeDocument profile={profile} />)

export const getResumeFilename = (locale: ResumeLocale) => `augusto-westphal-curriculo-${locale}.pdf`
