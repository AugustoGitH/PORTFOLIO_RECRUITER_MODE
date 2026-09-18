"use client"
import { useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { HeartIcon } from "lucide-react"
import { Button } from "@/components/action/Button"
import { http } from "@/libs/http"

export const BlogPostMetrics = ({ slug, initialLikes, initialViews }: { slug: string; initialLikes: number; initialViews: number }) => {
  const like = useMutation({ mutationFn: async () => (await http.post<{ likes: number; views: number; liked: boolean }>(`api/blog/posts/${slug}/like`)).data })
  useEffect(() => { void http.post(`api/blog/posts/${slug}/view`).catch(() => undefined) }, [slug])
  const result = like.data
  return <div className="mt-4 flex items-center gap-3 text-sm text-ud-secondary-600"><span>{result?.views ?? initialViews} visualizações</span><Button type="button" startAdornment={<HeartIcon size={15} />} loading={{ verb: "Curtindo", state: like.isPending }} onClick={() => like.mutate()}>{result?.liked ? "Curtido" : "Curtir"} ({result?.likes ?? initialLikes})</Button></div>
}
