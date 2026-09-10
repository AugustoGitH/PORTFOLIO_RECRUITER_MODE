import { MessageCircleIcon, SendIcon } from "lucide-react"
import { Button } from "../../../components/action/Button"
import { cn } from "../../../utils/tailwind"
import type { FeedbackFormProps } from "./types"
import { useINTLContext } from "../../../providers/intl"

export const FeedbackForm = (props: FeedbackFormProps) => {
  const intl = useINTLContext()

  return (
    <div className={cn("p-3 border border-ud-neutral-300", props.className)}>
      <div className="flex items-start gap-3">
        <MessageCircleIcon />
        <div>
          <span className="block text-sm font-bold">{props.title}</span>
          <span className="block text-xs">{props.description}</span>
        </div>
      </div>
      <textarea className="resize-none w-full text-xs border border-ud-neutral-300 transition-all rounded mt-4 outline-0 p-2 min-h-24 focus:border-ud-neutral-950 text-ud-neutral-950" placeholder="Escreva seu feedback aqui" />
      <Button startAdornment={<SendIcon size={15} />} highlight className={props.classNameButton}>{intl.t("SubmitFeedback")}</Button>
    </div>
  )
}