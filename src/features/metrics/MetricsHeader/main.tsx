import { useINTLContext } from "../../../providers/intl"
import { cn } from "../../../utils/tailwind"
import { Display } from "../../../components/general/Display"
import { useMetricsQuery } from "@/services/metric"
import { MetricsHeaderProps } from "./types"



export const MetricsHeader = (props: MetricsHeaderProps) => {
  const intl = useINTLContext()
  const metricsQuery = useMetricsQuery({
    metrics: props.metrics
  })

  return (
    <div className={cn("flex items-center gap-2 py-1 border-y border-ud-neutral-300 justify-around", props.className)}>
      <span className="text-xs"><Display className="font-bold" value={metricsQuery.data.views} /> {intl.t("Views")}</span>
      <span className="text-xs"><Display className="font-bold" value={metricsQuery.data.likes} /> {intl.t("Likes")}</span>
      <span className="text-xs"><Display className="font-bold" value={props.metrics.professionalFeedbacks} /> {intl.t("ProfessionalFeedbacks")}</span>
      <span className="text-xs"><Display className="font-bold" value={metricsQuery.data.resumeDownloads} /> {intl.t("ResumeViews")}</span>
    </div>
  )
}
