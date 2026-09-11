import { metricsController } from "@backend/metrics"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export const GET = metricsController.getSnapshot
