import { UserRoundSearch } from "lucide-react"
import { Button } from "../../../components/action/Button"
import { useRecruiterModeContext } from "../../../providers/recruiterMode"
import { useINTLContext } from "../../../providers/intl"

export const RecruiterModeButton = () => {
  const intl = useINTLContext()
  const recruiterMode = useRecruiterModeContext()

  return <Button
    onClick={() => recruiterMode.toggleRecruiterMode()}
    startAdornment={<UserRoundSearch size={15} />}
    highlight={!recruiterMode.isRecruiterMode}
  >
    {recruiterMode.isRecruiterMode ? intl.t("DefaultMode") : intl.t("RecruitmentMode")}
  </Button>
}