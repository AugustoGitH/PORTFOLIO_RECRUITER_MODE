import { useState, type MouseEvent } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Container } from "../../../../components/layout/Container"
import type { PropsWithClassName } from "../../../../utils/types"
import { cn } from "../../../../utils/tailwind"
import { Button } from "../../../../components/action/Button"
import { InfoWrapper } from "../../../../components/wrapper/InfoWrapper"
import { ABOUT, getSkillByValue, GROUP_LINKS, RECRUITER_PROFILE, SECTIONS } from "../../../../constants/profile"
import { BriefcaseBusinessIcon } from "lucide-react"
import { MetricsHeader } from "../../../../features/metrics/MetricsHeader"
import { useINTLContext } from "../../../../providers/intl"
import { AsciiArt } from "../../../../components/general/AsciiArt"
import type { MetricsSnapshot } from "../../../../features/metrics"
import { useRecruiterModeContext } from "../../../../providers/recruiterMode"
import { getElapsedYears } from "../../../../utils/date"

type AboutSectionProps = PropsWithClassName & {
  initialViews: number
  initialLikes: number
  initialLiked: boolean
  initialResumeDownloads: number
}

export const AboutSection = (props: AboutSectionProps) => {
  const intl = useINTLContext()
  const recruiterMode = useRecruiterModeContext()
  const queryClient = useQueryClient()
  const [isDownloading, setIsDownloading] = useState(false)
  const [hasDownloadedResume, setHasDownloadedResume] = useState(false)
  const isRecruiterMode = recruiterMode.isRecruiterMode
  const primarySkills = RECRUITER_PROFILE.primaryStack.map(getSkillByValue)

  const resumeHref = `/api/resumes/default?locale=${intl.language}`
  const handleResumeDownload = async (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    if (isDownloading) return

    setIsDownloading(true)

    try {
      const response = await fetch(resumeHref)
      if (!response.ok) throw new Error(`Resume download failed with status ${response.status}`)

      const blob = await response.blob()
      setHasDownloadedResume(true)
      queryClient.setQueryData<MetricsSnapshot>(["metrics"], (current) => current ? {
        ...current,
        resumeDownloads: current.resumeDownloads + 1,
      } : current)
      const downloadUrl = URL.createObjectURL(blob)
      const anchor = document.createElement("a")
      anchor.href = downloadUrl
      anchor.download = "augusto-westphal-resume.pdf"
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error("Unable to download resume", error)
    } finally {
      setIsDownloading(false)
    }
  }

  const profileArt = hasDownloadedResume || !isRecruiterMode
    ? { src: "/assets/profile/augusto_main_profile.png", width: 300, rows: 78 }
    : { src: "/assets/profile/augusto_main_profile-recruiter.png", width: 300, rows: 78 }

  return (
    <Container id={SECTIONS.about.value} className={cn("bg-ud-neutral-100", props.className)}>
      <div className="w-full">
        <div className="flex justify-between items-end gap-4">
          <div>
            <h1 className="text-4xl font-bold text-ud-neutral-950">Portfolio</h1>
            {isRecruiterMode ? (
              <>
                <h2 className="text-2xl font-bold text-ud-neutral-950 mt-10">{intl.t("ProfessionalProfile")}</h2>
                <p className="mt-1 font-bold">{ABOUT.name}</p>
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
                <h2 className="text-2xl font-bold text-ud-neutral-950 mt-10">{intl.t("Greeting")} <InfoWrapper direction="right" info={intl.t("WestphalOrigin")}>{ABOUT.name}</InfoWrapper></h2>
                {ABOUT.description.content(ABOUT, intl.t).map((description, index) => (
                  <p key={index} className={index === 0 ? "mt-2" : "mt-1"} dangerouslySetInnerHTML={{
                    __html: description
                  }}></p>
                ))}
              </>
            )}
            <div className="flex items-center flex-wrap gap-2 mt-2">
              {
                GROUP_LINKS.main.map(link => (
                  <Button key={link.title} startAdornment={link.icon && <link.icon size={15} />} href={link.href} target="_blank">
                    {link.title}
                  </Button>
                ))
              }
              <Button
                startAdornment={<BriefcaseBusinessIcon size={20} />}
                highlight
                loading={{ verb: "Downloading", state: isDownloading }}
                href={resumeHref}
                onClick={handleResumeDownload}
              >
                {intl.t("Resume")}
              </Button>
            </div>
          </div>
          <AsciiArt
            src={profileArt.src}
            alt={ABOUT.name}
            width={profileArt.width}
            baseWidth={300}
            baseRows={78}
            columns={110}
            rows={profileArt.rows}
          />
        </div>
        <MetricsHeader className="mt-10" views={props.initialViews} likes={props.initialLikes} liked={props.initialLiked} resumeDownloads={props.initialResumeDownloads} />
      </div>
    </Container>
  )
}
