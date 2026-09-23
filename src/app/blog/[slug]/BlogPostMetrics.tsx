"use client"
import { useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { Eye, HeartIcon, MessageSquare } from "lucide-react"
import { Button } from "@/components/action/Button"
import { http } from "@/libs/http"
import { useINTLContext } from "@/providers/intl"

export const BlogPostMetrics = ({ slug, initialLikes, initialViews }: { slug: string; initialLikes: number; initialViews: number }) => {
  const intl = useINTLContext()
  const like = useMutation({ mutationFn: async () => (await http.post<{ likes: number; views: number; liked: boolean }>(`api/blog/posts/${slug}/like`)).data })
  useEffect(() => { void http.post(`api/blog/posts/${slug}/view`).catch(() => undefined) }, [slug])
  const result = like.data
  return (
    <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-ud-neutral-300 pt-5">
      <div>
        <p className="font-bold text-ud-neutral-999">{intl.t("BlogWasThisClear")}</p>
        <span className="mt-1 inline-flex items-center gap-1.5 text-xs text-ud-secondary-600">
          <Eye size={14} aria-hidden="true" />
          {intl.t("BlogViews", { views: result?.views ?? initialViews })}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          highlight
          startAdornment={<HeartIcon size={15} />}
          loading={{ verb: intl.t("BlogLiking"), state: like.isPending }}
          onClick={() => like.mutate()}
        >
          {result?.liked ? intl.t("BlogLiked") : intl.t("BlogYesClear")} ({result?.likes ?? initialLikes})
        </Button>
        <Button href="mailto:augustowestphaldev@gmail.com?subject=Tenho uma dúvida sobre o artigo" startAdornment={<MessageSquare size={15} />}>
          {intl.t("BlogStillHaveQuestion")}
        </Button>
      </div>
    </div>
  )
}
