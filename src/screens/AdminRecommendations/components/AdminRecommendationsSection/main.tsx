import { Container } from "@/components/layout/Container"
import { AdminRecommendationsPanel } from "../AdminRecommendationsPanel"

export const AdminRecommendationsSection = () => {
  return (
    <Container
      className="bg-ud-neutral-100 px-8 py-8"
      contentClassName="max-w-5xl"
    >
      <AdminRecommendationsPanel />
    </Container>
  )
}
