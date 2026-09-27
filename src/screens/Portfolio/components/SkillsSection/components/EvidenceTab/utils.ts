import { language } from "@/constants/intl"
import { Course } from "@/constants/profile"
import { INTLTranslateFunction } from "@/providers/intl"

export const getEvidenceDuration = (months: number, t: INTLTranslateFunction) => {
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12
  const parts = []

  if (years) parts.push(`${years} ${t("Year")}`)
  if (remainingMonths) parts.push(`${remainingMonths} ${t("Month")}`)

  return parts.join(` ${t("And")} `)
}

export const formatCourseDate = (issuedAt: string, language: language) => {
  return new Intl.DateTimeFormat(language === "ptbr" ? "pt-BR" : "en", {
    month: "short",
    year: "numeric",
  }).format(new Date(`${issuedAt}-01T00:00:00`))
}

export const createCourseLabel = (course: Course, language: language) => `${course.issuer} · ${formatCourseDate(course.issuedAt, language)}`
