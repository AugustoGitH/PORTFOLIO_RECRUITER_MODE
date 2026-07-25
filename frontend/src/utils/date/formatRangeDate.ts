import type { RangeDate } from "../types/date"

export const  formatRangeDate = (rangeDate: RangeDate) => {
  const [startDate, endDate] = rangeDate

  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : new Date()

  const formatter = new Intl.DateTimeFormat("pt-BR", {
    month: "short",
    year: "numeric"
  })

  return `${formatter.format(start)} - ${
    endDate ? formatter.format(end) : "Presente"
  }`
}