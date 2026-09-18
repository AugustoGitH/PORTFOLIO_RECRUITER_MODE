import { MetricsSnapshot } from "../useMetricsQuery";

export type MetricLikeSnapshot = Pick<MetricsSnapshot, "likes" | "liked">