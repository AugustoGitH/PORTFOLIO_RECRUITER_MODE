import type { INTLTranslateFunction } from "../../providers/intl"
import type { RangeDate } from "../types/date"

export const getRangeDateLabel = (rangeDate: RangeDate, t: INTLTranslateFunction) => {
  const [startDate, endDate] = rangeDate

  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : new Date()

  let years = end.getFullYear() - start.getFullYear()
  let months = end.getMonth() - start.getMonth()
  let days = end.getDate() - start.getDate()

  if (days < 0) {
    months--

    const previousMonth = new Date(end.getFullYear(), end.getMonth(), 0)
    days += previousMonth.getDate()
  }

  if (months < 0) {
    years--
    months += 12
  }

  const parts: string[] = []

  if (years > 0) {
    parts.push(`${years} ${t("Year")}`)
  }

  if (months > 0) {
    parts.push(`${months} ${t("Month")}`)
  }

  if (years === 0 && months === 0 && days > 0) {
    parts.push(`${days} ${t("Day")}`)
  }

  return parts.join(` ${t("And")} `)
}