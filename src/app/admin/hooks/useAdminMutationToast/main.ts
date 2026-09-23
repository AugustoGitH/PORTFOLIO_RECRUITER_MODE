import type { Term } from "@/constants/intl"
import { useINTLContext } from "@/providers/intl"
import { useToast } from "@/providers/toast"

export const useAdminMutationToast = () => {
  const intl = useINTLContext()
  const { showToast } = useToast()

  const success = (description: Term) => showToast({
    variant: "status",
    status: "success",
    title: intl.t("AdminOperationSuccessTitle"),
    description: intl.t(description),
  })

  const error = (description: Term) => showToast({
    variant: "status",
    status: "error",
    title: intl.t("AdminOperationErrorTitle"),
    description: intl.t(description),
  })

  return { success, error }
}
