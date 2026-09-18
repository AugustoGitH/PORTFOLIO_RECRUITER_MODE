import { requireAdminPermission } from "@backend/admin/authorization"
import { feedbackService } from "@backend/feedback"
import { AdminFeedbackPanel } from "../AdminFeedbackPanel"
import { AdminLayout } from "../components/AdminLayout"

export default async function AdminProfessionalFeedbacksPage() {
  const session = await requireAdminPermission("feedback.read")
  const feedbacks = await feedbackService.listAllForModeration()

  return (
    <AdminLayout>
      <div className="mx-auto w-full max-w-5xl p-8">
        <h1 className="text-2xl font-bold text-ud-neutral-950">Feedbacks profissionais</h1>
        <p className="mt-2 text-sm text-ud-secondary-600">Modere os relatos que podem aparecer publicamente no portfólio.</p>
        <AdminFeedbackPanel
          canModerate={session.permissions.includes("feedback.moderate")}
          initialFeedbacks={await Promise.all(feedbacks.map(async (feedback) => ({
            id: String(feedback._id),
            message: feedback.message,
            linkedinUrl: feedback.linkedinUrl,
            submittedAt: feedback.submittedAt.toISOString(),
            status: feedback.status,
            editorial: feedback.editorial && {
              displayName: feedback.editorial.displayName,
              role: feedback.editorial.role,
              company: feedback.editorial.company,
              publicMessage: feedback.editorial.publicMessage,
            },
            avatarUrl: await feedbackService.getAvatarUrl(feedback.editorial?.profileImageId),
            companyImageUrl: await feedbackService.getAvatarUrl(feedback.editorial?.companyImageId),
          })))}
        />
      </div>
    </AdminLayout>
  )
}
