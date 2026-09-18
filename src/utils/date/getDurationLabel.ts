import { INTLTranslateFunction } from "@/providers/intl"

export const getDurationLabel = (months: number, t: INTLTranslateFunction) => {
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12
  const parts = []

  if (years) parts.push(`${years} ${t("Year")}`)
  if (remainingMonths) parts.push(`${remainingMonths} ${t("Month")}`)

  return parts.join(` ${t("And")} `)
}