import type { PropsWithChildren } from 'react'

export type PortfolioAudience = "default" | "recruiter"
export type RecruiterRole = "frontend" | "backend" | "database" | "tests" | "architecture" | "tools"
export type RecruiterSeniority = "junior" | "mid-level" | "senior"

export type RecruiterModeContextValue = {
  audience: PortfolioAudience
  isRecruiterMode: boolean
  roles: RecruiterRole[]
  seniority: RecruiterSeniority | null
  changeRecruiterMode: (state: boolean | ((previousState: boolean) => boolean)) => void
  toggleRecruiterMode: () => void
  setRoles: (roles: RecruiterRole[]) => void
  setSeniority: (seniority: RecruiterSeniority | null) => void
}

export type RecruiterModeProviderProps = PropsWithChildren
