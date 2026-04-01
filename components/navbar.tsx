import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { LogoutButton } from "./logout-button"

export async function Navbar() {
  const session = await getServerSession(authOptions)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none transition-all duration-300">
      <nav className="glass bg-white/70 backdrop-blur-3xl rounded-full px-6 py-2.5 flex items-center justify-between w-full max-w-5xl pointer-events-auto shadow-2xl shadow-blue-900/10 border-white/60">
        <Link href="/" className="group flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20 transition-all group-hover:scale-105 group-hover:shadow-blue-500/40">
            <span className="text-white font-black text-xs tracking-tighter">SEO</span>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900 hidden sm:block">
            Analyzer<span className="text-blue-600 underline decoration-blue-600/20 underline-offset-4">Pro</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-1 mr-2 border-r border-slate-200 pr-5">
            <Link href="/" className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors px-3 py-1">Features</Link>
            <Link href="/#pricing" className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors px-3 py-1">Pricing</Link>
          </div>

          {session ? (
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-bold px-4 transition-all">
                  Dashboard
                </Button>
              </Link>
              <Link href="/analyze">
                <Button size="sm" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/30 px-6 transition-all hover:scale-105 active:scale-95">
                  Analyze
                </Button>
              </Link>
              <LogoutButton />
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xl shadow-blue-500/30 px-8 transition-all hover:scale-105 active:scale-95">
                Get Started
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
