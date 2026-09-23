"use client"

import type { PropsWithChildren } from "react"
import { Footer } from "@/components/layout/Footer"
import { Header } from "@/components/layout/Header"
import { PopoverProvider } from "@/components/general/Popover/providers/popover"
import { RecruiterModeProvider } from "@/providers/recruiterMode"

export const BlogChrome = ({ children, hasAdminSession }: PropsWithChildren<{ hasAdminSession: boolean }>) => (
  <PopoverProvider>
    <RecruiterModeProvider>
      <Header hasAdminSession={hasAdminSession} variant="blog" />
      {children}
      <Footer />
    </RecruiterModeProvider>
  </PopoverProvider>
)
