import type { PropsWithChildren } from "react"
import { HeaderVariant } from "../Header"

export type PageLayoutProps = PropsWithChildren<{
  hasAdminSession: boolean
  headerVariant?: HeaderVariant
}>
