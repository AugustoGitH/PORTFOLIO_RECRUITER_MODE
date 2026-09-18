import { ENDPOINTS_BACKEND } from "@/constants/service"

import { useINTLContext } from "@/providers/intl"
import { MetricsSnapshot } from "@/services/metric"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

export const useResumeDownload = () => {
  const intl = useINTLContext()
  const queryClient = useQueryClient()

  const [isDownloadingResume, setIsDownloadingResume] = useState(false)
  const [hasDownloadedResume, setHasDownloadedResume] = useState(false)

  const resumeHref = ENDPOINTS_BACKEND.resumes(intl.language)

  const downloadResume = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    if (isDownloadingResume) return

    setIsDownloadingResume(true)

    try {
      const response = await fetch(resumeHref)
      if (!response.ok) throw new Error(`Resume download failed with status ${response.status}`)

      const blob = await response.blob()
      setHasDownloadedResume(true)
      queryClient.setQueryData<MetricsSnapshot>(["metrics"], (current) => current ? {
        ...current,
        resumeDownloads: current.resumeDownloads + 1,
      } : current)
      const downloadUrl = URL.createObjectURL(blob)
      const anchor = document.createElement("a")
      anchor.href = downloadUrl
      anchor.download = "augusto-westphal-resume.pdf"
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error("Unable to download resume", error)
    } finally {
      setIsDownloadingResume(false)
    }
  }

  return {
    downloadResume,
    hasDownloadedResume,
    isDownloadingResume,
    resumeHref
  }
}