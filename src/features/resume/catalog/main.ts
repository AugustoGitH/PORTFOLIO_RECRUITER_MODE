import type { ResumeCatalog, ResumeDefinition, ResumeRequest } from "../types"

const DEFAULT_RESUME: ResumeDefinition = {
  slug: "default",
  template: "standard",
  focus: "general",
  enabledLocales: ["ptbr", "en"],
}

export class StaticResumeCatalog implements ResumeCatalog {
  async find(request: ResumeRequest) {
    if (request.slug !== DEFAULT_RESUME.slug || !DEFAULT_RESUME.enabledLocales.includes(request.locale)) {
      return null
    }

    return DEFAULT_RESUME
  }
}
