import { Metrics } from "@/services/metric"
import { Feedback } from "@/types/service/feedback"
import { Recommendation } from "@/types/service/recommendation"

export type MainProps = {
  metrics: Metrics
  recommendations: Recommendation[]
  feedbacks: Feedback[]
}
