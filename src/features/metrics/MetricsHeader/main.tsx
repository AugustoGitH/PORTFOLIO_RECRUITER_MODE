import { useINTLContext } from "../../../providers/intl"
import { cn } from "../../../utils/tailwind"
import type { PropsWithClassName } from "../../../utils/types"
import { Display } from "../../../components/general/Display"

export const MetricsHeader = (props: PropsWithClassName) => {
  const intl = useINTLContext()

  return (
    <div className={cn("flex items-center gap-2 py-1 border-y border-ud-neutral-300 justify-around", props.className)}>
      <span className="text-xs"><Display className="font-bold" value={160} /> {intl.t("Views")}</span>
      <span className="text-xs"><Display className="font-bold" value={40} /> {intl.t("Likes")}</span>
      <span className="text-xs"><Display className="font-bold" value={10} /> {intl.t("ProfessionalFeedbacks")}</span>
      <span className="text-xs"><Display className="font-bold" value={11} /> {intl.t("ResumeViews")}</span>
    </div>
  )
} 