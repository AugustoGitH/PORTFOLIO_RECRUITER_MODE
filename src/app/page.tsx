import App from "@/App"
import { getInitialPageData, getPageContext } from "@/screens/Main/server"
import type { HomePageProps } from "@/screens/Main/server"
import { headers } from "next/headers"

export const dynamic = "force-dynamic"

export default async function HomePage(props: HomePageProps) {
  const [searchParams, requestHeaders] = await Promise.all([props.searchParams, headers()])
  const context = getPageContext(searchParams, requestHeaders.get("x-visitor-id") ?? "anonymous")
  const initialData = await getInitialPageData(context)

  return <App {...initialData} />
}
