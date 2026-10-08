
import { Container } from "../../../../components/layout/Container"
import { cn } from "../../../../utils/tailwind"
import { Button } from "../../../../components/action/Button"
import { InfoWrapper } from "../../../../components/wrapper/InfoWrapper"
import { ABOUT, getSkillByValue, GROUP_LINKS, RECRUITER_PROFILE, SECTIONS } from "../../../../constants/profile"
import { BriefcaseBusinessIcon } from "lucide-react"
import { MetricsHeader } from "../../../../features/metrics/MetricsHeader"
import { useINTLContext } from "../../../../providers/intl"
import { ResponsiveAsciiArt } from "../../../../components/general/AsciiArt"
import { useRecruiterModeContext } from "../../../../providers/recruiterMode"
import { getElapsedYears } from "../../../../utils/date"
import { AboutSectionProps } from "./types"
import { useResumeDownload } from "@/services/resume"
import { createAsciiArtProps } from "@/utils/ascii"


export const AboutSection = (props: AboutSectionProps) => {
  const intl = useINTLContext()
  const recruiterMode = useRecruiterModeContext()
  const { downloadResume, hasDownloadedResume, isDownloadingResume, resumeHref } = useResumeDownload()

  const isRecruiterMode = recruiterMode.isRecruiterMode
  const primarySkills = RECRUITER_PROFILE.primaryStack.map(getSkillByValue)


  const asciiProps = createAsciiArtProps({
    states: [
      {
        active: hasDownloadedResume,
        art: { src: "/assets/profile/augusto_main_profile.png", alt: "Main profile image", width: 300, rows: 78 }
      },
      {
        active: isRecruiterMode,
        art: { src: "/assets/profile/augusto_main_profile-recruiter.png", alt: "Recruiter profile image", width: 300, rows: 78 }
      }
    ],
    baseRows: 78,
    baseWidth: 300,
    columns: 110,
  })

  return (
    <Container
      id={SECTIONS.about.value}
      className={cn("portfolio-hero min-h-[calc(100dvh-4.25rem)] bg-ud-neutral-100 lg:min-h-0", props.className)}
    >
      <div className="w-full">
        <div className="grid grid-cols-1 items-end lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-x-5">
          <div className="order-3 mt-5 w-full min-w-0 lg:order-1 lg:mt-0">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-ud-auxiliary-purple">{intl.t("Portfolio")}</p>
            {isRecruiterMode ? (
              <>
                <h1 className="text-4xl font-extrabold leading-[1.04] tracking-[-0.045em] text-ud-neutral-999 sm:text-5xl lg:text-[3.6rem]">{intl.t("ProfessionalProfile")}</h1>
                <p className="mt-2 font-semibold text-ud-neutral-950">{ABOUT.name}</p>
                <dl className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3 text-sm">
                  <div>
                    <dt className="text-xs text-ud-secondary-600">{intl.t("Role")}</dt>
                    <dd className="font-bold">{intl.t("FullStackWebDeveloper")}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ud-secondary-600">{intl.t("Experience")}</dt>
                    <dd className="font-bold">{getElapsedYears(new Date("2022-01-01"))} {intl.t("Year")}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ud-secondary-600">{intl.t("Seniority")}</dt>
                    <dd className="font-bold">{intl.t(RECRUITER_PROFILE.seniority)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ud-secondary-600">{intl.t("Availability")}</dt>
                    <dd className="font-bold">{intl.t(RECRUITER_PROFILE.availability)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ud-secondary-600">{intl.t("Location")}</dt>
                    <dd className="font-bold">{intl.t(RECRUITER_PROFILE.location)}</dd>
                  </div>
                  <div className="sm:col-span-2 lg:col-span-3">
                    <dt className="text-xs text-ud-secondary-600">{intl.t("PrimaryStack")}</dt>
                    <dd className="flex flex-wrap gap-x-2 gap-y-1 mt-1 font-bold">
                      {primarySkills.map((skill) => <span key={skill.value}>{skill.title}</span>)}
                    </dd>
                  </div>
                </dl>
              </>
            ) : (
              <>
                <h1 className="text-4xl font-extrabold leading-[1.04] tracking-[-0.045em] text-ud-neutral-999 sm:text-5xl lg:text-[3.6rem]">{intl.t("Greeting")} <InfoWrapper direction="right" info={intl.t("WestphalOrigin")}>{ABOUT.name}</InfoWrapper></h1>
                {ABOUT.description.content(ABOUT, intl.t).map((description, index) => (
                  <p key={index} className={index === 0 ? "mt-4 leading-relaxed" : "mt-2 leading-relaxed"} dangerouslySetInnerHTML={{
                    __html: description
                  }}></p>
                ))}
              </>
            )}
            <div className="mt-5 grid grid-cols-4 items-center gap-2 sm:flex sm:flex-wrap">
              {
                GROUP_LINKS.main.map((link) => (
                  <Button
                    key={link.title}
                    className="col-span-2 justify-center px-2 text-xs sm:px-5 sm:text-sm"
                    startAdornment={link.icon && <link.icon size={15} />}
                    href={link.href}
                    target="_blank"
                  >
                    {link.title}
                  </Button>
                ))
              }
              <Button
                startAdornment={<BriefcaseBusinessIcon className="shrink-0" size={20} />}
                highlight
                loading={{ verb: "Downloading", state: isDownloadingResume }}
                href={resumeHref}
                onClick={downloadResume}
                className="col-span-2 justify-center gap-1 px-2 text-xs sm:px-5 sm:text-sm"
              >
                {intl.t("Resume")}
              </Button>
            </div>
          </div>
          <div className="order-1 flex w-full justify-center lg:order-2 lg:w-[300px]">
            <ResponsiveAsciiArt
              {...asciiProps}
              initialWidth={asciiProps.width}
              wrapperClassName="max-w-[300px]"
            />
          </div>
          <MetricsHeader className="order-2 lg:order-3 lg:col-span-2 lg:mt-9" metrics={props.metrics} />
        </div>
      </div>
    </Container>
  )
}
