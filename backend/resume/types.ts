export type ResumeLocale = "ptbr" | "en"

export type ResumeFocus = "general" | string

export type ResumeRequest = {
  slug: string
  locale: ResumeLocale
}

export type ResumeDefinition = {
  slug: string
  template: "standard"
  focus: ResumeFocus
  enabledLocales: readonly ResumeLocale[]
}

export type ResumeCatalog = {
  find(request: ResumeRequest): Promise<ResumeDefinition | null>
}
