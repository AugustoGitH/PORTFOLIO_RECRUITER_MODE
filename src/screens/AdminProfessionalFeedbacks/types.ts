import type { ModerationFeedback } from "./components/AdminFeedbackPanel"

export type AdminProfessionalFeedbacksPageProps = {
  initialFeedbacks: ModerationFeedback[]
  canModerate: boolean
}
