import { AdminHeader } from "./components/AdminHeader"
import { AdminSidebar } from "./components/AdminSidebar"
import type { AdminLayoutProps } from "./types"

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <main className="min-h-screen">
      <AdminSidebar />
      <AdminHeader />
      <div className="md:pl-64">
        {children}
      </div>
    </main>
  )
}
