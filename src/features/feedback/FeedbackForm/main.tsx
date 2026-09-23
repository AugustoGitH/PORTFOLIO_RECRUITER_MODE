import { ArrowRightIcon, MessageCircleIcon } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { Button } from "../../../components/action/Button"
import { ResponsiveAsciiArt } from "../../../components/general/AsciiArt"
import { Input } from "../../../components/input/Input"
import { Textarea } from "../../../components/input/Textarea"
import { cn } from "../../../utils/tailwind"
import type { FeedbackFormProps } from "./types"
import { useINTLContext } from "../../../providers/intl"
import { http } from "../../../libs/http"
import { useToast } from "../../../providers/toast"

export const FeedbackForm = (props: FeedbackFormProps) => {
  const intl = useINTLContext()
  const { showToast } = useToast()
  const submission = useMutation({
    mutationFn: async (form: HTMLFormElement) => {
      const values = new FormData(form)
      await http.post("api/feedbacks", {
        message: values.get("message"),
        linkedinUrl: values.get("linkedinUrl"),
        consent: values.get("consent") === "on",
        consentVersion: "v1",
      })
      return form
    },
    onSuccess: (form) => {
      form.reset()
      showToast({
        variant: "status",
        status: "success",
        title: intl.t("FeedbackSentToastTitle"),
        description: intl.t("FeedbackSentToastDescription"),
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
      <Button type="submit" endAdornment={<ArrowRightIcon size={16} />} highlight loading={{ verb: intl.t("SubmitFeedback"), state: submission.isPending }} className={cn("mt-4", props.classNameButton)}>
        {intl.t("SubmitFeedback")}

      </Button>
      <div className="mt-auto flex items-end justify-between gap-2 pt-5">
        <p className="max-w-28 pb-2 text-xs leading-snug text-ud-neutral-900">{intl.t("FeedbackFormNote")}</p>
        <ResponsiveAsciiArt
          src="/assets/profile/testimonials-coffee.png"
          alt={intl.t("FeedbackArtworkAlt")}
          initialWidth={144}
          columns={80}
          rows={38}
          palette="source"
          wrapperClassName="w-36 max-w-[55%] overflow-hidden"
        />
      </div>
    </form>
  )
}
