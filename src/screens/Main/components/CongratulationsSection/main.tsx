import { ArrowRightIcon, HeartIcon, MessageCircleIcon, SparklesIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "../../../../components/action/Button"
import { AsciiArt } from "../../../../components/general/AsciiArt"
import { Container } from "../../../../components/layout/Container"
import { ABOUT, SECTIONS } from "../../../../constants/profile"
import { PortfolioFeedbackForm } from "../../../../features/portfolio-feedback"
import { useINTLContext } from "../../../../providers/intl"
import { useRecruiterModeContext } from "../../../../providers/recruiterMode"
import { cn } from "../../../../utils/tailwind"
import { useMetricLikeMutation } from "@/services/metric"
import { createAsciiArtProps } from "@/utils/ascii"
import type { CongratulationsSectionProps } from "./types"
import { Chip } from "@/components/action/Chip"
import { useToast } from "@/providers/toast"

const contactLinks = [ABOUT.link.linkedin, ABOUT.link.github, ABOUT.link.loucoDaSyntax]
const stableArtSrc = "/assets/profile/augusto_congrulations_02.png"
const faceRegion = { left: 0.38, right: 0.61, top: 0.14, bottom: 0.46 }

export const CongratulationsSection = (props: CongratulationsSectionProps) => {
  const intl = useINTLContext()
  const { isRecruiterMode } = useRecruiterModeContext()
  const [isActionHovered, setIsActionHovered] = useState(false)
  const likeMutation = useMetricLikeMutation()
  const { showToast } = useToast()
  const liked = likeMutation.data?.liked ?? props.initialLiked

  const toggleLike = (notify = true) => {
    likeMutation.mutate(undefined, {
      onSuccess: (result) => {
        if (!notify || !result.liked) return

        showToast({
          variant: "action",
          title: intl.t("PortfolioLikedToastTitle"),
          description: intl.t("PortfolioLikedToastDescription"),
          action: {
            label: intl.t("Undo"),
            onClick: () => toggleLike(false),
          },
        })
      },
      onError: () => {
        if (!notify) return

        showToast({
          variant: "status",
          status: "error",
          title: intl.t("LikeErrorToastTitle"),
          description: intl.t("LikeSubmissionError"),
        })
      },
    })
  }

  const asciiArtProps = {
    ...createAsciiArtProps({
      states: [
        {
          active: isActionHovered,
          art: { src: "/assets/profile/augusto_congrulations_02-hover.png", alt: ABOUT.name }
        },
        {
          active: !isActionHovered,
          art: { src: stableArtSrc, alt: ABOUT.name }
        },
      ],
      width: 380,
      baseRows: 78,
      baseWidth: 380,
      columns: 130,
    }),
    stableSrc: stableArtSrc,
    morphRegion: faceRegion,
  }

  const actionEvents = {
    onMouseEnter: () => setIsActionHovered(true),
    onMouseLeave: () => setIsActionHovered(false),
    onFocus: () => setIsActionHovered(true),
    onBlur: () => setIsActionHovered(false),
  }

  return (
    <Container id={SECTIONS.feedback.value} className={cn("bg-ud-neutral-100", props.className)}>
      <div className="grid overflow-hidden rounded-lg border border-ud-auxiliary-purple/30 bg-ud-neutral-100 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col px-6 py-8 sm:px-9 sm:py-10 lg:px-10">
          <div>
            <Chip>
              <MessageCircleIcon size={15} aria-hidden="true" />
              {intl.t(isRecruiterMode ? "Contact" : "Feedback")}
            </Chip>
          </div>

          <h2 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-[-0.045em] text-ud-neutral-999 sm:text-5xl">
            {intl.t(isRecruiterMode ? "ContactMe" : "DidYouLikeMyPortfolio")}
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-ud-secondary-600 sm:text-lg">
            {intl.t(isRecruiterMode ? "RecruiterContactDescription" : "FeedbackDescription")}
          </p>

          {isRecruiterMode ? (
            <div className="mt-9">
              <h3 className="text-base font-bold text-ud-neutral-999">
                {intl.t("ChooseContactChannel")}
              </h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {contactLinks.map((link, index) => (
                  <Button
                    key={link.title}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    highlight={index === 0}
                    startAdornment={link.icon && <link.icon size={24} aria-hidden="true" />}
                    endAdornment={index === 0 ? <ArrowRightIcon size={22} aria-hidden="true" className="ml-auto shrink-0" /> : undefined}
                    className="min-h-14 min-w-0 justify-center whitespace-nowrap px-2 text-[13px] sm:justify-start"
                    {...actionEvents}
                  >
                    {link.title}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-8">
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  startAdornment={<HeartIcon size={24} aria-hidden="true" />}
                  loading={{ verb: liked ? intl.t("Liked") : intl.t("Liking"), state: likeMutation.isPending }}
                  onClick={() => toggleLike()}
                  disabled={likeMutation.isPending}
                  className={cn(
                    "min-h-12",
                    liked && "border-ud-semantic-error bg-ud-semantic-error hover:border-ud-semantic-error text-ud-neutral-0 hover:text-ud-neutral-0 hover:bg-ud-semantic-error ",
                  )}
                  {...actionEvents}
                >
                  {liked ? intl.t("Liked") : intl.t("LeaveALike")}
                </Button>
                <Button
                  highlight
                  startAdornment={<MessageCircleIcon size={24} aria-hidden="true" />}
                  onClick={() => document.getElementById("portfolio-feedback-message")?.focus()}
                  className="min-h-12"
                  {...actionEvents}
                >
                  {intl.t("GiveFeedback")}
                </Button>
              </div>
              <PortfolioFeedbackForm
                className="mt-6"
                title={intl.t("LeaveYourFeedback")}
                description={intl.t("ShareYourOpinion")}
              />
            </div>
          )}

          <div className="mt-9 flex items-center gap-3 border-t border-ud-auxiliary-purple/25 pt-6 text-sm text-ud-secondary-600 sm:text-base lg:pt-7">
            <SparklesIcon size={23} className="shrink-0 text-ud-auxiliary-purple" aria-hidden="true" />
            <p className="text-sm">{intl.t(isRecruiterMode ? "ConversationStart" : "FeedbackClosing")}</p>
          </div>
        </div>

        <div className="flex min-h-[400px] items-center justify-center overflow-hidden border-t border-ud-auxiliary-purple/20 bg-ud-auxiliary-purple-light/35 lg:min-h-0 lg:border-l lg:border-t-0">
          <AsciiArt {...asciiArtProps} />
        </div>
      </div>
    </Container>
  )
}
