import { ABOUT } from "../../constants/profile"
import { HouseIcon } from "lucide-react"
import Link from "next/link"

export const AdminHeader = () => {
  return (
    <header className="w-full px-2 pt-2 sticky top-0 left-0 z-50 bg-ud-neutral-100">
      <div className="w-full h-15 border border-ud-neutral-300 rounded flex items-center justify-between bg-ud-neutral-100 py-1 px-4">
        <span className="text-xs font-bold uppercase tracking-wide text-ud-secondary-600">{ABOUT.name}</span>
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 rounded-sm border border-ud-neutral-300 px-2 py-1 text-sm transition hover:border-ud-neutral-950 hover:text-ud-neutral-950">
            <HouseIcon size={15} />
            Portfólio
          </Link>
        </div>
      </div>
    </header>
  )
}
