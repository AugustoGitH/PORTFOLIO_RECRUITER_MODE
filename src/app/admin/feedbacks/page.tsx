import { requireAdminPermission } from "@backend/admin/authorization"
import { portfolioFeedbackService } from "@backend/portfolio-feedbacks"
import { AdminLayout } from "../components/AdminLayout"
import Link from "next/link"

type AdminPortfolioFeedbacksPageProps = {
  searchParams: Promise<{ cursor?: string }>
}

export default async function AdminPortfolioFeedbacksPage({ searchParams }: AdminPortfolioFeedbacksPageProps) {
  await requireAdminPermission("feedback.read")
  const { cursor } = await searchParams
  const page = await portfolioFeedbackService.list(cursor)

  return (
    <AdminLayout>
      <div className="mx-auto w-full max-w-5xl p-8">
        <h1 className="text-2xl font-bold text-ud-neutral-950">Feedbacks do portfólio</h1>
        <p className="mt-2 text-sm text-ud-secondary-600">Mensagens privadas enviadas por visitantes. A retenção é de 90 dias.</p>

        <div className="mt-6 grid gap-2">
          {page.items.length ? page.items.map((feedback) => (
            <article key={String(feedback._id)} className="rounded border border-ud-neutral-300 bg-ud-neutral-0 p-4 text-sm">
              <p className="whitespace-pre-wrap text-ud-neutral-950">{feedback.message}</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ud-secondary-600">
                <span>Visitante: {feedback.visitorId}</span>
                <time dateTime={feedback.submittedAt.toISOString()}>{feedback.submittedAt.toLocaleString("pt-BR")}</time>
              </div>
            </article>
          )) : <p className="text-sm text-ud-secondary-600">Não há feedbacks do portfólio no período de retenção.</p>}
        </div>

        {page.nextCursor && <Link href={`/admin/feedbacks?cursor=${encodeURIComponent(page.nextCursor)}`} className="mt-4 inline-flex rounded-sm border border-ud-neutral-300 px-3 py-2 text-sm hover:border-ud-neutral-950">Carregar mais</Link>}
      </div>
    </AdminLayout>
  )
}
