import { blogController } from "@backend/blog"
import { withPublicControllerSecurity, withRateLimit } from "@backend/security"

export const runtime = "nodejs"
export const POST = (
  request: Request,
  context: { params: Promise<{ slug: string }> },
) => context.params.then(({ slug }) => withRateLimit(
  (request) => withPublicControllerSecurity(
    (request) => blogController.recordView(request, slug),
  )(request),
  { visitor: 10, ip: 30 },
  "blog-view",
)(request, undefined))
