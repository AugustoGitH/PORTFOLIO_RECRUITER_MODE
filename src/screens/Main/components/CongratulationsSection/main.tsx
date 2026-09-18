import { HeartIcon, MessageCircleIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "../../../../components/action/Button"
import { Container } from "../../../../components/layout/Container"
import { cn } from "../../../../utils/tailwind"
import { ABOUT, GROUP_LINKS, SECTIONS } from "../../../../constants/profile"
import { PortfolioFeedbackForm } from "../../../../features/portfolio-feedback"
import { useINTLContext } from "../../../../providers/intl"
import { AsciiArt } from "../../../../components/general/AsciiArt"

import { useRecruiterModeContext } from "../../../../providers/recruiterMode"
import { CongratulationsSectionProps } from "./types"
import { useMetricLikeMutation } from "@/services/metric"
import { createAsciiArtProps } from "@/utils/ascii"


export const CongratulationsSection = (props: CongratulationsSectionProps) => {
  const intl = useINTLContext()
  const { isRecruiterMode } = useRecruiterModeContext()
  const [isActionHovered, setIsActionHovered] = useState(false)
  const likeMutation = useMetricLikeMutation()

  const liked = likeMutation.data?.liked ?? props.initialLiked

  const asciiArtProps = createAsciiArtProps({
    states: [
      {
        active: isActionHovered,
        art: { src: "/assets/profile/augusto_congrulations_02-hover.png", alt: ABOUT.name }
      },
      {
        active: !isActionHovered,
        art: { src: "/assets/profile/augusto_congrulations_02.png", alt: ABOUT.name }
      },
    ],
    width: 380,
    baseRows: 78,
    baseWidth: 380,
    columns: 130,
  })

  if (isRecruiterMode) {
    return (
      <Container id={SECTIONS.feedback.value} className={cn("bg-ud-neutral-100", props.className)}>
        <div className="flex justify-between items-center gap-6">
          <div>
            <h2 className="text-2xl font-extrabold text-ud-neutral-950">{intl.t("ContactMe")}</h2>
            <p className="mt-2">{intl.t("RecruiterContactDescription")}</p>
            <div className="flex items-center flex-wrap gap-2 mt-4">
              {GROUP_LINKS.main.map((link) => (
                <Button
                  key={link.title}
                  startAdornment={link.icon && <link.icon size={15} />}
                  href={link.href}
                  target="_blank"
                  highlight={link.title === "Linkedin"}
                  onMouseEnter={() => setIsActionHovered(true)}
                  onMouseLeave={() => setIsActionHovered(false)}
                  onFocus={() => setIsActionHovered(true)}
                  onBlur={() => setIsActionHovered(false)}
                >
                  {link.title}
                </Button>
              ))}
            </div>
          </div>
          <AsciiArt {...asciiArtProps} />
        </div>
      </Container>
    )
  }

  return (
    <Container id={SECTIONS.feedback.value} className={cn("bg-ud-neutral-100", props.className)}>
      <div className="flex justify-between items-center gap-6">
        <div>
          <h2 className="text-2xl font-extrabold text-ud-neutral-950">{intl.t("DidYouLikeMyPortfolio")}</h2>
          <p>{intl.t("FeedbackDescription")}</p>
          <div className="flex items-center gap-2 mt-4">
            <Button
              startAdornment={<HeartIcon size={15} />}
              loading={{ verb: liked ? intl.t("Liked") : intl.t("Liking"), state: likeMutation.isPending }}
              onClick={() => likeMutation.mutate()}
              disabled={likeMutation.isPending}
              onMouseEnter={() => setIsActionHovered(true)}
              onMouseLeave={() => setIsActionHovered(false)}
              onFocus={() => setIsActionHovered(true)}
              onBlur={() => setIsActionHovered(false)}
              className={liked ? "bg-ud-semantic-error border border-ud-semantic-error text-ud-neutral-0 hover:bg-transparent hover:text-ud-semantic-error " : ""}
            >
              {liked ? intl.t("Liked") : intl.t("LeaveALike")}
            </Button>
            <Button
              highlight
              startAdornment={<MessageCircleIcon size={15} />}
              onMouseEnter={() => setIsActionHovered(true)}
              onMouseLeave={() => setIsActionHovered(false)}
              onFocus={() => setIsActionHovered(true)}
              onBlur={() => setIsActionHovered(false)}
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
        <AsciiArt {...asciiArtProps} />
      </div>
    </Container>
  )
}
