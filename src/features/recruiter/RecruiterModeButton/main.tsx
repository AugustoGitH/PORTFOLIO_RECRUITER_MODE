import { UserRoundSearch } from "lucide-react"
import { usePathname } from "next/navigation"
import { Button } from "../../../components/action/Button"
import { useRecruiterModeContext } from "../../../providers/recruiterMode"
import { useINTLContext } from "../../../providers/intl"

export const RecruiterModeButton = () => {
  const intl = useINTLContext()
  const recruiterMode = useRecruiterModeContext()
  const pathname = usePathname()

  if (pathname !== "/") {
    return (
      <Button href="/?audience=recruiter#about" startAdornment={<UserRoundSearch size={15} />} highlight>
        {intl.t("Recruiter")}
      </Button>
    )
  }

  return <Button
    onClick={() => recruiterMode.toggleRecruiterMode()}
    startAdornment={<UserRoundSearch size={15} />}
    highlight={!recruiterMode.isRecruiterMode}
  >
    {recruiterMode.isRecruiterMode ? intl.t("GeneralReading") : intl.t("Recruiter")}
  </Button>
}
