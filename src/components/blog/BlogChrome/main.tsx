"use client"

import type { PropsWithChildren } from "react"
import { Footer } from "@/components/layout/Footer"
import { Header } from "@/components/layout/Header"
import { PopoverProvider } from "@/components/general/Popover/providers/popover"
import { INTLProvider } from "@/providers/intl"
import { RecruiterModeProvider } from "@/providers/recruiterMode"

export const BlogChrome = ({ children }: PropsWithChildren) => (
  <INTLProvider>
    <PopoverProvider>
      <RecruiterModeProvider>
        <Header />
        {children}
        <Footer />
      </RecruiterModeProvider>
    </PopoverProvider>
  </INTLProvider>
)
