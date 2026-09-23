"use client"

import type { PropsWithChildren } from "react"
import { ToastProvider } from "@/providers/toast"

export const AdminProviders = ({ children }: PropsWithChildren) => (
  <ToastProvider>{children}</ToastProvider>
)
