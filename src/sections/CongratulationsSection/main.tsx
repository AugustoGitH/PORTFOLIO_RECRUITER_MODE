import { HeartIcon, MessageCircleIcon } from "lucide-react"
import { Button } from "../../components/action/Button"
import { Container } from "../../components/layout/Container"
import { cn } from "../../utils/tailwind"
import type { PropsWithClassName } from "../../utils/types"
import { ABOUT, SECTIONS } from "../../constants/profile"
import { FeedbackForm } from "../../features/feedback"
import { useINTLContext } from "../../providers/intl"
import { AsciiArt } from "../../components/general/AsciiArt"

export const CongratulationsSection = (props: PropsWithClassName) => {
  const intl = useINTLContext()

  return (
    <Container id={SECTIONS.feedback.value} className={cn("bg-ud-neutral-100", props.className)}>
      <div className="flex justify-between items-center gap-6">
        <div>
          <h2 className="text-2xl font-bold text-ud-neutral-950">{intl.t("DidYouLikeMyPortfolio")}</h2>
          <p>{intl.t("FeedbackDescription")}</p>
          <div className="flex items-center gap-2 mt-4">
            <Button startAdornment={<HeartIcon size={15} />}>{intl.t("LeaveALike")}</Button>
            <Button highlight startAdornment={<MessageCircleIcon size={15} />}>{intl.t("GiveFeedback")}</Button>
          </div>
          <FeedbackForm
            className="mt-6"
            title={intl.t("LeaveYourFeedback")}
            description={intl.t("ShareYourOpinion")}
          />
        </div>
        <AsciiArt src="/assets/profile/augusto_congrulations_02.png" alt={ABOUT.name} width={380} columns={130} />
      </div>
    </Container>
  )
}
