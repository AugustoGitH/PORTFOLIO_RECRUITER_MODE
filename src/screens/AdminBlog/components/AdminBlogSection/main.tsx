import { Container } from "@/components/layout/Container"
import { AdminBlogPanel } from "../AdminBlogPanel"

export const AdminBlogSection = () => {
  return (
    <Container
      className="bg-ud-neutral-100 px-8 py-8"
      contentClassName="max-w-6xl"
    >
      <AdminBlogPanel />
    </Container>
  )
}
