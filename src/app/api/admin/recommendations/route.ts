import { recommendationController } from "@backend/developer-recommendations"
export const runtime = "nodejs"
export const GET = recommendationController.list
export const POST = (request: Request) => recommendationController.save(request)
