import type { PropsWithChildren } from "react"
import { AdminProviders } from "./AdminProviders"

export default function AdminRootLayout({ children }: PropsWithChildren) {
  return <AdminProviders>{children}</AdminProviders>
}
