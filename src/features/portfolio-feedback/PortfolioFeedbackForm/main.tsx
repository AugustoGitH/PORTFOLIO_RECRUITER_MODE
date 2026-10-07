"use client"

import Image from "next/image"
import { SendIcon } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { Button } from "../../../components/action/Button"
import { Textarea } from "../../../components/input/Textarea"
import { Checkbox } from "../../../components/input/Checkbox"
import { useINTLContext } from "../../../providers/intl"
import type { PropsWithClassName } from "../../../utils/types"
import { http } from "../../../libs/http"
import { useToast } from "../../../providers/toast"

type PortfolioFeedbackFormProps = PropsWithClassName<{
  title: string
  description: string
}>

export const PortfolioFeedbackForm = ({ title, description, className }: PortfolioFeedbackFormProps) => {
  const intl = useINTLContext()
  const { showToast } = useToast()
  const submission = useMutation({
    mutationFn: async (form: HTMLFormElement) => {
      const data = new FormData(form)
      const message = data.get("message")
      const allowPublication = data.get("allowPublication") === "on"
      await http.post(
        "api/portfolio-feedbacks",
        { message, allowPublication },
        { headers: { "Idempotency-Key": crypto.randomUUID() } },
      )
      return form
    },
    onSuccess: (form) => {
      form.reset()
      showToast({
        variant: "custom",
        title: intl.t("MessageReceivedToastTitle"),
        description: intl.t("MessageReceivedToastDescription"),
        icon: (
          <Image
            src="/assets/toast/feedback-avatar.png"
            alt=""
            width={72}
            height={79}
            unoptimized
            className="h-16 w-auto object-contain object-bottom [image-rendering:pixelated]"
          />
        ),
        action: {
          label: intl.t("ViewFeedback"),
          onClick: () => {
            const input = document.getElementById("portfolio-feedback-message")
            input?.scrollIntoView({ behavior: "smooth", block: "center" })
            input?.focus({ preventScroll: true })
          },
        },
      })
    },
    onError: () => {
      showToast({
        variant: "status",
        status: "error",
        title: intl.t("FeedbackErrorToastTitle"),
        description: intl.t("FeedbackSubmissionError"),
      })
    },
  })

  return (
    <form className={className} onSubmit={(event) => {
      event.preventDefault()
      submission.mutate(event.currentTarget)
    }}>
      <span className="block text-sm font-bold text-ud-neutral-950">{title}</span>
      <span className="mt-1 block text-xs text-ud-secondary-600">{description}</span>
      <label className="mt-4 block text-sm font-bold text-ud-neutral-950">
        {intl.t("FeedbackMessage")}
        <Textarea id="portfolio-feedback-message" name="message" required minLength={1} maxLength={1000} className="mt-1" placeholder={intl.t("FeedbackMessagePlaceholder")} />
      </label>
      <Checkbox
        name="allowPublication"
        label={intl.t("PortfolioFeedbackPublicationConsent")}
        className="mt-3 leading-relaxed text-ud-secondary-600"
      />
      <Button type="submit" startAdornment={<SendIcon size={21} />} highlight loading={{ verb: intl.t("SubmitFeedback"), state: submission.isPending }} className="mt-4">
        {intl.t("SubmitFeedback")}
      </Button>
    </form>
  )
}
