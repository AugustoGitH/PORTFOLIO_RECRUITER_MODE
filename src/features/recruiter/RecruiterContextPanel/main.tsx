import { BriefcaseBusinessIcon, DatabaseIcon, PanelTopIcon, ServerIcon, WrenchIcon, BadgeCheckIcon, BlocksIcon } from "lucide-react"
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

  return (
    <Container className="bg-ud-neutral-100">
      <section className="rounded border border-ud-neutral-300 p-4">
        <div className="flex items-start gap-3">
          <BriefcaseBusinessIcon className="mt-0.5 text-ud-auxiliary-purple" size={20} />
          <div>
            <h2 className="font-bold text-ud-neutral-950">{intl.t("RefineRecruiterReading")}</h2>
            <p className="mt-1 text-xs text-ud-secondary-600">{intl.t("RecruiterQuestionsDescription")}</p>
          </div>
        </div>

        <fieldset className="mt-4">
          <legend className="text-xs font-bold">{intl.t("RoleOrStack")}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
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
                  className={cn("flex items-center gap-1.5 rounded-sm border px-2 py-1 text-xs transition", {
                    "border-ud-auxiliary-purple bg-ud-auxiliary-purple text-ud-neutral-0": isSelected,
                    "border-ud-neutral-300 hover:border-ud-neutral-950": !isSelected,
                  })}
                >
                  <Icon size={14} />{intl.t(role.label)}
                </button>
              )
            })}
          </div>
        </fieldset>

        <fieldset className="mt-4">
          <legend className="text-xs font-bold">{intl.t("JobSeniority")}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {SENIORITIES.map((seniority) => {
              const isSelected = recruiterMode.seniority === seniority.value

              return (
                <button
                  key={seniority.value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => recruiterMode.setSeniority(isSelected ? null : seniority.value)}
                  className={cn("flex items-center gap-1.5 rounded-sm border px-2 py-1 text-xs transition", {
                    "border-ud-auxiliary-purple bg-ud-auxiliary-purple text-ud-neutral-0": isSelected,
                    "border-ud-neutral-300 hover:border-ud-neutral-950": !isSelected,
                  })}
                >
                  {intl.t(seniority.label)}
                </button>
              )
            })}
          </div>
        </fieldset>

        {recruiterMode.seniority && (
          <p className="mt-4 text-xs text-ud-secondary-600">
            {intl.t("SeniorityComparison", {
              vacancy: intl.t(SENIORITIES.find(({ value }) => value === recruiterMode.seniority)?.label ?? "MidLevel"),
              profile: intl.t("MidLevel"),
            })}
          </p>
        )}
      </section>
    </Container>
  )
}
