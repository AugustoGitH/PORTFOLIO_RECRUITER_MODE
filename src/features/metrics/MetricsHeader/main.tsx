import { useINTLContext } from "../../../providers/intl"
import { cn } from "../../../utils/tailwind"
import { Display } from "../../../components/general/Display"
import { useMetricsQuery } from "@/services/metric"
import { MetricsHeaderProps } from "./types"



export const MetricsHeader = (props: MetricsHeaderProps) => {
  const intl = useINTLContext()
  const metricClassName = "flex flex-1 flex-col items-center justify-center text-center text-xs lg:flex-row lg:gap-1"
  const metricsQuery = useMetricsQuery({
    metrics: props.metrics
  })

  return (
    <div className={cn("flex flex-row items-start justify-center border-y border-ud-neutral-300 py-1", props.className)}>
      <span className={metricClassName}>
        <Display className="font-bold" value={metricsQuery.data.views} />
        {intl.t("Views")}
      </span>
      <span className={metricClassName}>
        <Display className="font-bold" value={metricsQuery.data.likes} />
        {intl.t("Likes")}
      </span>
      <span className={metricClassName}>
        <Display className="font-bold" value={props.metrics.professionalFeedbacks} />
        <span className="lg:hidden">{intl.t("Feedbacks")}</span>
        <span className="hidden lg:inline">{intl.t("ProfessionalFeedbacks")}</span>
      </span>
      <span className={metricClassName}>
        <Display className="font-bold" value={metricsQuery.data.resumeDownloads} />
        <span className="lg:hidden">{intl.t("ResumeDownloads")}</span>
        <span className="hidden lg:inline">{intl.t("ResumeViews")}</span>
      </span>
    </div>
  )
}
