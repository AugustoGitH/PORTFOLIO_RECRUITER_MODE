import type { ModerationFeedback } from "../AdminFeedbackPanel"

export type AdminProfessionalFeedbacksSectionProps = {
  initialFeedbacks: ModerationFeedback[]
  canModerate: boolean
}
