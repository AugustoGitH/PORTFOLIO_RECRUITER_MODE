import { Container } from "../../components/layout/Container"
import type { PropsWithClassName } from "../../utils/types"
import { cn } from "../../utils/tailwind"
import { Button } from "../../components/action/Button"
import { InfoWrapper } from "../../components/wrapper/InfoWrapper"
import { ABOUT, GROUP_LINKS, SECTIONS } from "../../constants/profile"
import { BriefcaseBusinessIcon, DraftingCompassIcon } from "lucide-react"
import { MetricsHeader } from "../../features/metrics/MetricsHeader"
import { useINTLContext } from "../../providers/intl"

export const AboutSection = (props: PropsWithClassName) => {
  const intl = useINTLContext()

  return (
    <Container id={SECTIONS.about.value} className={cn("bg-ud-neutral-100", props.className)}>
      <div className="w-full">
        <div className="flex justify-between items-end gap-4">
          <div>
            <h1 className="text-4xl font-bold text-ud-neutral-950">Portfolio</h1>
            <h2 className="text-2xl font-bold text-ud-neutral-950 mt-10">{intl.t("Greeting")} <InfoWrapper direction="right" info={intl.t("WestphalOrigin")}>{ABOUT.name}</InfoWrapper></h2>
            {ABOUT.description.content(ABOUT, intl.t).map((description, index) => (
              <p key={index} className={index === 0 ? "mt-2" : "mt-1"} dangerouslySetInnerHTML={{
                __html: description
              }}></p>
            ))}
            <div className="flex items-center flex-wrap gap-2 mt-2">
              {
                GROUP_LINKS.main.map(link => (
                  <Button key={link.title} startAdornment={link.icon && <link.icon size={15} />} href={link.href} target="_blank">
                    {link.title}
                  </Button>
                ))
              }
              <Button startAdornment={<BriefcaseBusinessIcon size={20} />} highlight target="_blank">
                {intl.t("Resume")}
              </Button>
            </div>
          </div>
          <img className="object-cover" src="src/assets/profile/augusto_main_profile.png" alt="Augusto Caetano Westphal" width={280} />
        </div>
        <MetricsHeader className="mt-10" />
      </div>
    </Container>
  )
}