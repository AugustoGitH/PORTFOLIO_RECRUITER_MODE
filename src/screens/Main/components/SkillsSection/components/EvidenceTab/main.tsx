import {
  ArrowRightIcon,
  BriefcaseBusinessIcon,
  CalendarDaysIcon,
  ChevronRightIcon,
  Code2Icon,
  FileTextIcon,
  FolderIcon,
  GraduationCapIcon,
} from "lucide-react"
import { TabWrapper, useTabsContext } from "../../../../../../components/action/Tabs"
import { Chip } from "../../../../../../components/action/Chip"
import { Stagger } from "../../../../../../components/wrapper/Stagger"
import { useINTLContext } from "../../../../../../providers/intl"
import { cn } from "../../../../../../utils/tailwind"
import type { EvidenceTabProps } from "./types"
import { createCourseLabel, getEvidenceDuration } from "./utils"


export const EvidenceTab = (props: EvidenceTabProps) => {
  const intl = useINTLContext()
  const { hasNavigated } = useTabsContext()
  const evidence = props.evidence.filter((entry) => entry.skill.kind === props.tab.value)

  return (
    <TabWrapper tabIndex={props.tab.value}>
      <div>
        <Chip size="sm">{intl.t(props.tab.label)}</Chip>
        <div className="mt-2">
          <h3 className="text-2xl font-bold leading-tight text-ud-neutral-950">{intl.t("EvidenceHeadline")}</h3>
          <p className="mt-1 text-sm text-ud-secondary-600">{intl.t("EvidenceHeadlineDescription")}</p>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Stagger animate={hasNavigated}>
            {evidence.map((entry) => {
              const hasReferences = entry.experiences.length > 0 || entry.projects.length > 0
              const hasSupportingEvidence = entry.courses.length > 0 || entry.learningEvidence.length > 0

              return (
                <article
                  key={entry.skill.value}
                  className={cn("flex min-h-62 flex-col rounded-lg border border-ud-neutral-300 bg-ud-neutral-100 p-4 shadow-[0_1px_2px_rgba(20,23,60,0.04)]", {
                    "border-ud-auxiliary-purple shadow-[0_1px_4px_rgba(92,53,255,0.18)]": props.highlightedSkillValues.includes(entry.skill.value),
                  })}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-ud-auxiliary-purple-light text-ud-auxiliary-purple">
                      {entry.skill.icon ? <entry.skill.icon size={27} /> : <Code2Icon size={27} aria-hidden="true" />}
                    </span>
                    <h4 className="min-w-0 flex-1 text-xl font-extrabold text-ud-neutral-950">{entry.skill.title}</h4>
                    <ChevronRightIcon className="shrink-0 text-ud-neutral-700" size={20} aria-hidden="true" />
                  </div>

                  <dl className="mt-4 space-y-2 border-b border-ud-neutral-300 pb-3 text-xs text-ud-secondary-600">
                    <div className="flex items-center gap-1.5">
                      <dt className="sr-only">{intl.t("Experience")}</dt>
                      <dd className="flex items-center gap-1.5 font-medium text-ud-auxiliary-purple">
                        <CalendarDaysIcon size={17} aria-hidden="true" />
                        {getEvidenceDuration(entry.professionalMonths, intl.t) || "—"}
                      </dd>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <dt className="sr-only">{intl.t("ProfessionalExperiences")}</dt>
                      <dd className="flex items-center gap-1.5">
                        <BriefcaseBusinessIcon size={17} aria-hidden="true" />
                        {entry.professionalExperienceCount} {intl.t("ProfessionalExperiences")}
                      </dd>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <dt className="sr-only">{intl.t("ProjectsBuilt")}</dt>
                      <dd className="flex items-center gap-1.5">
                        <FolderIcon size={17} aria-hidden="true" />
                        {entry.projects.length} {intl.t("ProjectsBuilt")}
                      </dd>
                    </div>
                  </dl>

                  {hasReferences ? (
                    <div className="mt-3 space-y-3">
                      {entry.experiences.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 text-sm font-bold text-ud-neutral-950">
                            <BriefcaseBusinessIcon size={18} aria-hidden="true" />
                            <span>{intl.t("Experiences")} ({entry.experiences.length})</span>
                          </div>
                          <nav className="mt-2 flex flex-wrap items-center gap-1.5" aria-label={intl.t("Experiences")}>
                            {entry.experiences.map((reference) => (
                              <a key={reference.value} href={reference.href} className="rounded-md border border-ud-neutral-300 bg-ud-secondary-100 px-2 py-1 text-xs text-ud-neutral-900 transition-colors hover:border-ud-auxiliary-purple hover:text-ud-auxiliary-purple">
                                {reference.title}
                              </a>
                            ))}
                            <a href="#experiences" className="inline-flex items-center gap-1 px-1 py-1 text-xs font-medium text-ud-auxiliary-purple underline underline-offset-4">
                              {intl.t("ViewEvidence")} <ArrowRightIcon size={14} aria-hidden="true" />
                            </a>
                          </nav>
                        </div>
                      )}
                      {entry.projects.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 text-sm font-bold text-ud-neutral-950">
                            <FolderIcon size={18} aria-hidden="true" />
                            <span>{intl.t("Projects")} ({entry.projects.length})</span>
                          </div>
                          <nav className="mt-2 flex flex-wrap items-center gap-1.5" aria-label={intl.t("Projects")}>
                            {entry.projects.map((reference) => (
                              <a key={reference.value} href={reference.href} className="rounded-md border border-ud-neutral-300 bg-ud-secondary-100 px-2 py-1 text-xs text-ud-neutral-900 transition-colors hover:border-ud-auxiliary-purple hover:text-ud-auxiliary-purple">
                                {reference.title}
                              </a>
                            ))}
                            <a href="#projects" className="inline-flex items-center gap-1 px-1 py-1 text-xs font-medium text-ud-auxiliary-purple underline underline-offset-4">
                              {intl.t("ViewEvidence")} <ArrowRightIcon size={14} aria-hidden="true" />
                            </a>
                          </nav>
                        </div>
                      )}
                    </div>
                  ) : !hasSupportingEvidence ? (
                    <div className="mt-3 flex flex-1 flex-col items-center justify-center rounded-md bg-ud-secondary-100 px-4 py-6 text-center">
                      <FileTextIcon className="text-ud-neutral-700" size={30} aria-hidden="true" />
                      <p className="mt-3 font-medium text-ud-neutral-900">{intl.t("NoEvidenceLinked")}</p>
                      <p className="mt-1 text-xs text-ud-secondary-600">{intl.t("NoEvidenceLinkedDescription")}</p>
                    </div>
                  ) : null}

                  {hasSupportingEvidence && (
                    <div className="mt-3 space-y-2">
                      {entry.learningEvidence.length > 0 && (
                        <div className="rounded-md bg-ud-auxiliary-purple-light px-3 py-2">
                          <div className="flex items-center gap-2 text-sm font-bold text-ud-neutral-950">
                            <GraduationCapIcon className="text-ud-auxiliary-purple" size={19} aria-hidden="true" />
                            {intl.t("LearningRecorded")}
                          </div>
                          {entry.learningEvidence.map((learning) => (
                            <p className="mt-1 text-xs text-ud-secondary-600" key={learning.description}>{intl.t(learning.description)}</p>
                          ))}
                        </div>
                      )}
                      {entry.courses.map((course) => (
                        <div className="rounded-md bg-ud-auxiliary-purple-light px-3 py-2" key={course.title}>
                          <div className="flex items-start gap-2">
                            <GraduationCapIcon className="mt-0.5 shrink-0 text-ud-auxiliary-purple" size={19} aria-hidden="true" />
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-ud-neutral-950">{intl.t("Courses")}</p>
                              <p className="mt-1 text-xs font-medium text-ud-neutral-900">{course.title}</p>
                              <p className="mt-0.5 text-xs text-ud-secondary-600">{createCourseLabel(course, intl.language)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              )
            })}
          </Stagger>
        </div>
      </div>
    </TabWrapper>
  )
}
