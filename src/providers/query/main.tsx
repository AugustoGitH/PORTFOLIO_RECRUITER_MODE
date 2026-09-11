"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState, type PropsWithChildren } from "react"

export const QueryProvider = (props: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient())
  return <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
}
