import type { PortfolioFeaturedBlogPost } from "../../types"
import type { PropsWithClassName } from "@/utils/types"

export type BlogHighlightSectionProps = PropsWithClassName<{
  post: PortfolioFeaturedBlogPost | null
}>
