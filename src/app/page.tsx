import { Portfolio } from "@/screens/Portfolio"
import { getPortfolioPageData, type SearchParams } from "@/server/portfolio"

export const dynamic = "force-dynamic"

async function Page(props: { searchParams: Promise<SearchParams> }) {
  const pageData = await getPortfolioPageData(props.searchParams)

  return <Portfolio {...pageData} />
}


export default Page