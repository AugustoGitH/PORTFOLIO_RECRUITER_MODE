import Image from "next/image"
import { ArrowRightIcon, MessageCircleIcon } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { Button } from "../../../components/action/Button"
import { Input } from "../../../components/input/Input"
import { Textarea } from "../../../components/input/Textarea"
import { cn } from "../../../utils/tailwind"
import type { FeedbackFormProps } from "./types"
import { useINTLContext } from "../../../providers/intl"
import { http } from "../../../libs/http"

export const FeedbackForm = (props: FeedbackFormProps) => {
  const intl = useINTLContext()
  const submission = useMutation({
    mutationFn: async (form: HTMLFormElement) => {
      const values = new FormData(form)
      await http.post("api/feedbacks", {
        message: values.get("message"),
        linkedinUrl: values.get("linkedinUrl"),
        consent: values.get("consent") === "on",
        consentVersion: "v1",
      })
    },
  })

  if (submission.isSuccess) {
    return <div className={cn("p-3 border border-ud-neutral-300 text-sm", props.className)} role="status">{intl.t("FeedbackReceived")}</div>
  }

  return (
    <form
      className={cn("flex flex-col border border-ud-neutral-300 p-4", props.className)}
      onSubmit={(event) => {
        event.preventDefault()
        submission.mutate(event.currentTarget)
      }}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-ud-auxiliary-purple/30 bg-ud-neutral-100">
          <MessageCircleIcon size={19} className="text-ud-auxiliary-purple" />
        </span>
        <div>
          <span className="block text-lg font-bold text-ud-neutral-950">{props.title}</span>
          <span className="block text-sm text-ud-secondary-600">{props.description}</span>
        </div>
      </div>
      <label className="mt-4 block text-sm font-bold text-ud-neutral-950">
        {intl.t("FeedbackMessage")}
        <Textarea name="message" required minLength={20} maxLength={1500} className="mt-1" placeholder={intl.t("FeedbackMessagePlaceholder")} />
      </label>
      <Input name="linkedinUrl" type="url" label={intl.t("LinkedinUrl")} maxLength={2048} className="mt-4" />
      <label className="mt-4 flex items-start gap-2 text-xs text-ud-neutral-950">
        <input name="consent" type="checkbox" required className="mt-0.5 h-4 w-4 shrink-0 appearance-none rounded-sm border border-ud-neutral-950 bg-transparent checked:bg-ud-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ud-neutral-950" />
        <span>{intl.t("FeedbackConsent")}</span>
      </label>
      {submission.isError && <p className="mt-2 text-xs text-ud-semantic-error" role="alert">{intl.t("FeedbackSubmissionError")}</p>}
      <Button type="submit" endAdornment={<ArrowRightIcon size={16} />} highlight loading={{ verb: intl.t("SubmitFeedback"), state: submission.isPending }} className={cn("mt-4", props.classNameButton)}>
        {intl.t("SubmitFeedback")}

      </Button>
      <div className="mt-auto flex items-end justify-between gap-2 pt-5">
        <p className="max-w-28 pb-2 text-xs leading-snug text-ud-neutral-900">{intl.t("FeedbackFormNote")}</p>
        <Image
          src="/assets/profile/testimonials-coffee.png"
          alt={intl.t("FeedbackArtworkAlt")}
          width={160}
          height={128}
          className="h-auto w-36 max-w-[55%]"
        />
      </div>
    </form>
  )
}
