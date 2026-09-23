import {
  BadgeCheckIcon,
  BlocksIcon,
  BriefcaseBusinessIcon,
  CheckIcon,
  DatabaseIcon,
  FileTextIcon,
  Layers3Icon,
  PanelTopIcon,
  ServerIcon,
  SparklesIcon,
  UserRoundIcon,
  WrenchIcon,
} from "lucide-react"
import { SegmentedControl } from "../../../components/action/SegmentedControl"
import { ResponsiveAsciiArt } from "../../../components/general/AsciiArt"
import { TitleSection } from "../../../components/general/TitleSection"
import { Container } from "../../../components/layout/Container"
import { useINTLContext } from "../../../providers/intl"
import { useRecruiterModeContext, type RecruiterRole, type RecruiterSeniority } from "../../../providers/recruiterMode"
import { cn } from "../../../utils/tailwind"

const ROLES: Array<{ value: RecruiterRole, label: "FrontEnd" | "BackEnd" | "Database" | "Tests" | "Architecture" | "Tools", icon: React.ComponentType<{ size?: number }> }> = [
  { value: "frontend", label: "FrontEnd", icon: PanelTopIcon },
  { value: "backend", label: "BackEnd", icon: ServerIcon },
  { value: "database", label: "Database", icon: DatabaseIcon },
  { value: "tests", label: "Tests", icon: BadgeCheckIcon },
  { value: "architecture", label: "Architecture", icon: BlocksIcon },
  { value: "tools", label: "Tools", icon: WrenchIcon },
]

const SENIORITIES: Array<{ value: RecruiterSeniority, label: "Junior" | "MidLevel" | "Senior" }> = [
  { value: "junior", label: "Junior" },
  { value: "mid-level", label: "MidLevel" },
  { value: "senior", label: "Senior" },
]

export const RecruiterContextPanel = () => {
  const intl = useINTLContext()
  const recruiterMode = useRecruiterModeContext()

  if (!recruiterMode.isRecruiterMode) return null

  const selectedRoles = ROLES.filter((role) => recruiterMode.roles.includes(role.value))
  const selectedRolesLabel = selectedRoles.length
    ? selectedRoles.map((role) => intl.t(role.label)).join(" + ")
    : intl.t("NoContextSelected")
  const selectedSeniority = SENIORITIES.find((seniority) => seniority.value === recruiterMode.seniority)
  const hasContext = selectedRoles.length > 0 || recruiterMode.seniority !== null

  return (
    <Container className="bg-ud-neutral-100">
      <section className="overflow-hidden rounded-lg border border-ud-neutral-300 bg-ud-neutral-100 shadow-[0_1px_3px_rgba(20,23,60,0.06)] lg:grid lg:grid-cols-[minmax(0,1.7fr)_minmax(20rem,0.9fr)]">
        <div className="p-5 md:p-6">
          <TitleSection
            tag={<>
              <BriefcaseBusinessIcon size={18} aria-hidden="true" />
              {intl.t("RecruiterModeBadge")}
            </>}
            title={intl.t("RefineRecruiterReading")}
            subtitle={intl.t("RecruiterQuestionsDescription")}
          />

          <fieldset className="mt-5">
            <legend className="flex items-center gap-2.5 text-base font-bold text-ud-neutral-950">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ud-auxiliary-purple-light text-ud-auxiliary-purple">1</span>
              {intl.t("RoleOrStack")}
            </legend>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {ROLES.map((role) => {
                const Icon = role.icon
                const isSelected = recruiterMode.roles.includes(role.value)

                return (
                  <button
                    key={role.value}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => recruiterMode.setRoles(
                      isSelected
                        ? recruiterMode.roles.filter((value) => value !== role.value)
                        : [...recruiterMode.roles, role.value]
                    )}
                    className={cn("flex min-h-16 items-center gap-3 rounded-md border px-3 text-left text-sm font-medium text-ud-secondary-700 transition-colors hover:border-ud-auxiliary-purple hover:bg-ud-auxiliary-purple-light", {
                      "border-ud-auxiliary-purple bg-ud-auxiliary-purple-light text-ud-auxiliary-purple shadow-[0_0_0_1px_rgba(92,53,255,0.12)]": isSelected,
                      "border-ud-neutral-300 bg-ud-neutral-100": !isSelected,
                    })}
                  >
                    <span className="shrink-0" aria-hidden="true"><Icon size={20} /></span>
                    <span className="min-w-0 flex-1 ">{intl.t(role.label)}</span>
                    <span
                      aria-hidden="true"
                      className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors", {
                        "border-ud-auxiliary-purple bg-ud-auxiliary-purple text-ud-neutral-0": isSelected,
                        "border-ud-neutral-300": !isSelected,
                      })}
                    >
                      {isSelected && <CheckIcon size={14} strokeWidth={3} />}
                    </span>
                  </button>
                )
              })}
            </div>
          </fieldset>

          <fieldset className="mt-6">
            <legend className="flex items-center gap-2.5 text-base font-bold text-ud-neutral-950">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ud-auxiliary-purple-light text-ud-auxiliary-purple">2</span>
              {intl.t("JobSeniority")}
            </legend>
            <SegmentedControl
              className="mt-3 w-full"
              ariaLabel={intl.t("JobSeniority")}
              options={SENIORITIES.map((seniority) => ({
                value: seniority.value,
                label: intl.t(seniority.label),
              }))}
              value={recruiterMode.seniority}
              onChange={recruiterMode.setSeniority}
            />
          </fieldset>

          <div className="mt-6 flex flex-col gap-3 border-t border-ud-neutral-300 pt-4 text-sm text-ud-secondary-600 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-3">
              <SparklesIcon className="shrink-0 text-ud-auxiliary-purple" size={25} aria-hidden="true" />
              {intl.t("RecruiterSectionsPrioritized")}
            </p>
            {hasContext && (
              <button
                type="button"
                className="self-start font-medium text-ud-auxiliary-purple underline underline-offset-4 sm:self-auto"
                onClick={() => {
                  recruiterMode.setRoles([])
                  recruiterMode.setSeniority(null)
                }}
              >
                {intl.t("ClearRecruiterContext")}
              </button>
            )}
          </div>
        </div>

        <aside className="overflow-hidden border-t border-ud-neutral-300 bg-[linear-gradient(145deg,#f8f6ff_0%,#eeebff_100%)] p-5 md:p-6 lg:border-t-0 lg:border-l">
          <ResponsiveAsciiArt
            src="/assets/profile/recruiter-context-artwork.png"
            alt=""
            initialWidth={320}
            columns={132}
            rows={53}
            baseRows={53}
            palette="source"
            wrapperClassName="mx-auto aspect-[3/2] max-w-[420px] overflow-hidden"
          />
          <h3 className="mt-1 text-xl font-extrabold text-ud-neutral-950">{intl.t("YourReading")}</h3>
          <div className="mt-3 divide-y divide-ud-neutral-300 rounded-md border border-ud-auxiliary-purple/20 bg-ud-neutral-100/75 px-4 py-1">
            <dl className="flex gap-3 py-2.5">
              <Layers3Icon className="mt-0.5 shrink-0 text-ud-auxiliary-purple" size={24} aria-hidden="true" />
              <div>
                <dt className="text-sm text-ud-secondary-600">{intl.t("SelectedAreas")}</dt>
                <dd className="mt-0.5 text-base font-bold text-ud-neutral-950">{selectedRolesLabel}</dd>
              </div>
            </dl>
            <dl className="flex gap-3 py-2.5">
              <UserRoundIcon className="mt-0.5 shrink-0 text-ud-auxiliary-purple" size={24} aria-hidden="true" />
              <div>
                <dt className="text-sm text-ud-secondary-600">{intl.t("Seniority")}</dt>
                <dd className="mt-0.5 text-base font-bold text-ud-neutral-950">{selectedSeniority ? intl.t(selectedSeniority.label) : intl.t("NoContextSelected")}</dd>
              </div>
            </dl>
          </div>
          <p className="mt-5 flex items-center gap-3 text-sm text-ud-secondary-600">
            <FileTextIcon className="shrink-0 text-ud-auxiliary-purple" size={22} aria-hidden="true" />
            {intl.t("RecruiterEvidenceOrganized")}
          </p>
        </aside>
      </section>
    </Container>
  )
}
