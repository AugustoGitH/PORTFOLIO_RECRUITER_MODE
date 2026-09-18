"use client"

import { SendIcon } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { Button } from "../../../components/action/Button"
import { Textarea } from "../../../components/input/Textarea"
import { useINTLContext } from "../../../providers/intl"
import { cn } from "../../../utils/tailwind"
import type { PropsWithClassName } from "../../../utils/types"
import { http } from "../../../libs/http"

type PortfolioFeedbackFormProps = PropsWithClassName<{
  title: string
  description: string
}>

export const PortfolioFeedbackForm = ({ title, description, className }: PortfolioFeedbackFormProps) => {
  const intl = useINTLContext()
  const submission = useMutation({
    mutationFn: async (form: HTMLFormElement) => {
      const message = new FormData(form).get("message")
      await http.post("api/portfolio-feedbacks", { message }, { headers: { "Idempotency-Key": crypto.randomUUID() } })
    },
  })

  if (submission.isSuccess) {
    return <div className={cn("border border-ud-neutral-300 p-3 text-sm", className)} role="status">{intl.t("FeedbackReceived")}</div>
  }

  return (
    <form className={cn("border border-ud-neutral-300 p-3", className)} onSubmit={(event) => {
      event.preventDefault()
      submission.mutate(event.currentTarget)
    }}>
      <span className="block text-sm font-bold text-ud-neutral-950">{title}</span>
      <span className="mt-1 block text-xs text-ud-secondary-600">{description}</span>
      <label className="mt-4 block text-sm font-bold text-ud-neutral-950">
        {intl.t("FeedbackMessage")}
        <Textarea name="message" required minLength={1} maxLength={1000} className="mt-1" placeholder={intl.t("FeedbackMessagePlaceholder")} />
      </label>
      {submission.isError && <p className="mt-2 text-xs text-ud-semantic-error" role="alert">{intl.t("FeedbackSubmissionError")}</p>}
      <Button type="submit" startAdornment={<SendIcon size={15} />} highlight loading={{ verb: intl.t("SubmitFeedback"), state: submission.isPending }} className="mt-4">
        {intl.t("SubmitFeedback")}
      </Button>
    </form>
  )
}
