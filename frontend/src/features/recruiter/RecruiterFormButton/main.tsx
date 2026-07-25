import { UserRoundSearchIcon } from "lucide-react"
import { useINTLContext } from "../../../providers/intl"
import { Button } from "../../../components/action/Button"
import { useState } from "react"
import { cn } from "../../../utils/tailwind"

export const RecruiterFormButton = () => {
  const intl = useINTLContext()
  const [isShowedForm, setIsShowedForm] = useState(false)

  const reset = () => { }

  const closeForm = () => {
    reset()
  }

  const handleToggleShowForm = () => {
    setIsShowedForm(prevShow => {
      const currentState = !prevShow

      if (!currentState) {
        closeForm()
      }

      return currentState
    })
  }


  return (
    <div className={cn("fixed bottom-0 transition right-5 w-96 h-96 bg-ud-neutral-100 border border-ud-neutral-300 rounded-tl py-6 px-4", {
      "translate-y-96": !isShowedForm
    })}>
      <button onClick={handleToggleShowForm} className={cn("text-xs h-10 flex items-center gap-2 absolute -top-10 right-0 bg-ud-auxiliary-purple px-4 text-ud-neutral-0 font-bold p-2 rounded-tl-lg rounded-tr-lg border border-ud-auxiliary-purple transition ", {
        "hover:bg-transparent hover:text-ud-auxiliary-purple": !isShowedForm
      })}>
        <UserRoundSearchIcon size={20} />
        {intl.t("Recruiter")}
      </button>
      <span className="text-sm font-bold block">{intl.t("CustomizePortfolioForYourPosition")}</span>
      <p className="text-xs mt-1">{intl.t("RecruiterModeDescription")}</p>
      <form>
        <div className="mt-4">
          <label className="text-xs font-bold">{intl.t("JobDescriptionOrLink")}</label>
          <input placeholder={intl.t("PasteJobDescriptionOrUrl")} autoFocus className="px-2 text-sm border w-full outline-0 border-ud-neutral-300 rounded h-8 " />
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Button className="text-xs" type="submit" highlight>{intl.t("AnalyzeJob")}</Button>
          <Button className="text-xs" type="submit">{intl.t("AnswerQuestions")}</Button>
        </div>
      </form>
    </div>
  )
}