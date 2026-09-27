import type { PortfolioAudience } from "@/providers/recruiterMode"
import type {
  RecommendationRole,
  RecommendationSeniority,
} from "@backend/developer-recommendations"
import {
  VALID_AUDIENCES,
  VALID_ROLES,
  VALID_SENIORITIES,
} from "./constants"
import type { PageContext, SearchParams } from "./types"

const isPortfolioAudience = (value: string | undefined): value is PortfolioAudience =>
  Boolean(value && VALID_AUDIENCES.includes(value as PortfolioAudience))

const isRecommendationSeniority = (value: string | undefined): value is RecommendationSeniority =>
  Boolean(value && VALID_SENIORITIES.includes(value as RecommendationSeniority))

const getRolesFromParam = (rolesParam: string | undefined): RecommendationRole[] =>
  (rolesParam ?? "").split(",").filter((role): role is RecommendationRole => VALID_ROLES.includes(role as RecommendationRole))

export const getPageContext = (searchParams: SearchParams, visitorId: string): PageContext => ({
  audience: isPortfolioAudience(searchParams.audience) ? searchParams.audience : undefined,
  roles: getRolesFromParam(searchParams.roles),
  seniority: isRecommendationSeniority(searchParams.seniority) ? searchParams.seniority : undefined,
  visitorId,
})
