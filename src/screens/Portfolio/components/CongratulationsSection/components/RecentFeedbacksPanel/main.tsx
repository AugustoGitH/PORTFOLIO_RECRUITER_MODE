import { UserRoundIcon } from "lucide-react"
import { useINTLContext } from "@/providers/intl"
import type { Term } from "@/constants/intl"
import { cn } from "@/utils/tailwind"
import type { PortfolioFeedbackCategory } from "@/types/service/portfolio-feedback"
import type { RecentFeedbacksPanelProps } from "./types"
import { Chip } from "@/components/action/Chip"

const categoryTerms: Record<PortfolioFeedbackCategory, Term> = {
  navigation: "PortfolioFeedbackCategoryNavigation",
  content: "PortfolioFeedbackCategoryContent",
  recruiter: "PortfolioFeedbackCategoryRecruiter",
  design: "PortfolioFeedbackCategoryDesign",
  general: "PortfolioFeedbackCategoryGeneral",
}

const desktopPositions = [
  "lg:left-2 lg:top-5 lg:w-[43%]",
  "lg:right-2 lg:top-10 lg:w-[46%]",
  "lg:left-7 lg:top-35 lg:w-[43%]",
  "lg:bottom-6 lg:left-5 lg:w-[47%]",
]

export const RecentFeedbacksPanel = ({ feedbacks, artwork }: RecentFeedbacksPanelProps) => {
  const intl = useINTLContext()

  return (
    <div className="relative flex min-h-[440px] flex-col overflow-hidden border-t border-ud-auxiliary-purple/20 bg-ud-auxiliary-purple-light/35 px-4 py-6 lg:min-h-[640px] lg:border-l lg:border-t-0 lg:px-0 lg:py-0">
      <div className="hidden z-10 sm:grid-cols-2 lg:absolute lg:inset-0 lg:mt-0 lg:block">
        {feedbacks.map((feedback, index) => (
          <article
            key={feedback.id}
            className={cn(
              "rounded-md border border-ud-auxiliary-purple/20 bg-white p-3 shadow-md shadow-purple-200 backdrop-blur-sm lg:absolute",
              desktopPositions[index],
            )}
          >
            <div className="flex items-center gap-2">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ud-auxiliary-purple-light text-ud-auxiliary-purple">
                <UserRoundIcon size={15} aria-hidden="true" />
              </span>
              <Chip size="sm">
                {intl.t(categoryTerms[feedback.category])}
              </Chip>
            </div>
            <p className="mt-2 line-clamp-3 text-xs font-semibold leading-snug text-ud-neutral-950">
              {feedback.message}
            </p>
            <p className="mt-2 text-[11px] text-ud-secondary-600">
              {intl.t("PortfolioVisitor")}
            </p>
          </article>
        ))}
      </div>

      <div className="pointer-events-none mt-auto flex min-h-64 items-end justify-center lg:absolute lg:inset-x-0 lg:bottom-8 lg:min-h-0">
        {artwork}
      </div>
    </div>
  )
}
