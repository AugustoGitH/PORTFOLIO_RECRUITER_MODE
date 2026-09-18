import { AdminHeader } from "../../AdminHeader"
import { AdminSidebar } from "../AdminSidebar"
import type { AdminLayoutProps } from "./types"

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <main className="min-h-screen bg-ud-neutral-100">
      <AdminSidebar />
      <AdminHeader />
      <div className="md:pl-64">
        {children}
      </div>
    </main>
  )
}
