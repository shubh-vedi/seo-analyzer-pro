"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Clock, LayoutDashboard, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Quick Scan", href: "/analyze", icon: BarChart3 },
  { name: "History", href: "/history", icon: Clock },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex flex-col w-64 fixed left-0 top-20 bottom-0 border-r border-slate-100 bg-white/50 backdrop-blur-xl z-10 px-4 py-8 pointer-events-auto">
      <div className="text-xs font-black text-slate-300 uppercase tracking-widest pl-4 mb-6">Menu</div>
      <nav className="flex-1 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all group",
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                  : "text-slate-500 hover:bg-blue-50/50 hover:text-blue-600"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600")} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Credit Status or User info can go here */}
      <div className="mt-8 px-4">
         <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
             <div className="text-xs font-bold text-slate-500 mb-1">PRO Plan Active</div>
             <div className="text-sm font-black text-slate-900 tracking-tight">ContentOptima Engine</div>
         </div>
      </div>
    </div>
  )
}
