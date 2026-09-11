import { useINTLContext } from "../../../providers/intl"
import { cn } from "../../../utils/tailwind"
import type { PropsWithClassName } from "../../../utils/types"
import { Display } from "../../../components/general/Display"

export type MetricsHeaderProps = PropsWithClassName & {
  views: number
  likes: number
  liked: boolean
  resumeDownloads: number
}

export const MetricsHeader = (props: MetricsHeaderProps) => {
  const intl = useINTLContext()
  const metrics = useQuery({
    queryKey: ["metrics"],
    queryFn: async () => (await http.get<MetricsSnapshot>("api/metrics")).data,
    initialData: { views: props.views, likes: props.likes, liked: props.liked, resumeDownloads: props.resumeDownloads },
    staleTime: 60_000,
  })

  return (
    <div className={cn("flex items-center gap-2 py-1 border-y border-ud-neutral-300 justify-around", props.className)}>
      <span className="text-xs"><Display className="font-bold" value={metrics.data.views} /> {intl.t("Views")}</span>
      <span className="text-xs"><Display className="font-bold" value={metrics.data.likes} /> {intl.t("Likes")}</span>
      <span className="text-xs"><Display className="font-bold" value={10} /> {intl.t("ProfessionalFeedbacks")}</span>
      <span className="text-xs"><Display className="font-bold" value={metrics.data.resumeDownloads} /> {intl.t("ResumeViews")}</span>
    </div>
  )
}
import { useQuery } from "@tanstack/react-query"
import { http } from "../../../libs/http"
import type { MetricsSnapshot } from "../types"
