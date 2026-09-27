"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { PortfolioAudience, RecruiterModeContextValue, RecruiterModeProviderProps, RecruiterRole, RecruiterSeniority } from "./types"

const RecruiterModeContext = createContext({} as RecruiterModeContextValue)

const RECRUITER_ROLES: RecruiterRole[] = ["frontend", "backend", "database", "tests", "architecture", "tools"]
const RECRUITER_SENIORITIES: RecruiterSeniority[] = ["junior", "mid-level", "senior"]

export const useRecruiterModeContext = () => useContext(RecruiterModeContext)

export const RecruiterModeProvider = (props: RecruiterModeProviderProps) => {
  const router = useRouter()
  const [audience, setAudience] = useState<PortfolioAudience>("default")
  const [roles, setRoles] = useState<RecruiterRole[]>([])
  const [seniority, setSeniority] = useState<RecruiterSeniority | null>(null)
  const [hasRestoredReading, setHasRestoredReading] = useState(false)
  const isRecruiterMode = audience === "recruiter"

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const parameters = new URLSearchParams(window.location.search)
      setAudience(parameters.get("audience") === "recruiter" ? "recruiter" : "default")
      const queryRoles = (parameters.get("roles") ?? parameters.get("role") ?? "").split(",")
      const querySeniority = parameters.get("seniority")
      setRoles(queryRoles.filter((role): role is RecruiterRole => RECRUITER_ROLES.includes(role as RecruiterRole)))
      setSeniority(RECRUITER_SENIORITIES.includes(querySeniority as RecruiterSeniority) ? querySeniority as RecruiterSeniority : null)
      setHasRestoredReading(true)
    })

    return () => window.clearTimeout(timeoutId)
  }, [])

  useEffect(() => {
    if (!hasRestoredReading) return

    const url = new URL(window.location.href)

    if (isRecruiterMode) {
      url.searchParams.set("audience", "recruiter")
      if (roles.length) url.searchParams.set("roles", roles.join(","))
      else url.searchParams.delete("roles")
      url.searchParams.delete("role")
      if (seniority) url.searchParams.set("seniority", seniority)
      else url.searchParams.delete("seniority")
    } else {
      url.searchParams.delete("audience")
      url.searchParams.delete("roles")
      url.searchParams.delete("seniority")
    }

    const nextPath = `${url.pathname}${url.search}`
    if (nextPath !== `${window.location.pathname}${window.location.search}`) router.replace(nextPath, { scroll: false })
  }, [hasRestoredReading, isRecruiterMode, roles, seniority, router])

  const onRecruiterMode = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  const changeRecruiterMode = (state: boolean | ((prevState: boolean) => boolean)) => {
    setAudience((previousAudience) => {
      const currentState = typeof state === "function" ? state(previousAudience === "recruiter") : state

      if (currentState) onRecruiterMode()

      return currentState ? "recruiter" : "default"
    })
  }

  const toggleRecruiterMode = () => changeRecruiterMode(prevState => !prevState)

  const value: RecruiterModeContextValue = {
    audience,
    isRecruiterMode,
    roles,
    seniority,
    changeRecruiterMode,
    toggleRecruiterMode,
    setRoles,
    setSeniority,
  }

  return (
    <RecruiterModeContext.Provider value={value}>
      {props.children}
    </RecruiterModeContext.Provider>
  )
}
