import { Sidebar } from "@/components/sidebar"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen pt-20">
      {/* 
        pt-20 gives room for the global top Navbar 
        Sidebar takes up the left fixed column
      */}
      <Sidebar />
      <div className="flex-1 overflow-x-hidden p-6 md:p-10 ml-0 md:ml-64 transition-all duration-300">
        {children}
      </div>
    </div>
  )
}
