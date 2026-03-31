import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Clock, TrendingUp, Plus, ExternalLink, History, Globe } from "lucide-react"

interface AuditRow {
  id: string
  url: string
  score: number
  createdAt: Date
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/login")

  const auditsRaw = await prisma.audit.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  })
  const audits = auditsRaw as unknown as AuditRow[]

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { credits: true, name: true },
  })

  const avgScore =
    audits.length > 0
      ? Math.round(audits.reduce((sum, a) => sum + a.score, 0) / audits.length)
      : 0

  const startOfDay = new Date()
  startOfDay.setUTCHours(0, 0, 0, 0)
  const todayCount = audits.filter((a) => new Date(a.createdAt) >= startOfDay).length
  const dailyLimit = 5
  const creditsLeft = Math.max(0, dailyLimit - todayCount)

  return (
    <main className="max-w-7xl mx-auto px-4 pt-44 pb-32">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="space-y-4">
           <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/10 font-black tracking-widest text-[10px] px-4 py-1.5 rounded-full">
             LIVE ACCOUNT: SYNCED
           </Badge>
           <h1 className="text-5xl md:text-6xl font-black tracking-tight text-gradient">Dashboard.</h1>
           <p className="text-slate-500 text-xl font-medium">
             Welcome back, <span className="text-slate-900 border-b-2 border-primary/10 tracking-tight">{(user as { name?: string | null } | null)?.name?.split(" ")[0] ?? "there"}</span>
           </p>
        </div>
        
        <Link href="/analyze">
          <Button variant="premium" className="h-16 px-10 text-base font-black shadow-2xl transition-all hover:scale-105 active:scale-95">
            <Plus className="w-6 h-6 mr-3" />
            Initiate New Scan
          </Button>
        </Link>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        {[
          { label: "Total History", value: audits.length, icon: History, color: "text-blue-600", bg: "bg-blue-600/5" },
          { label: "Avg. SEO Score", value: `${avgScore}%`, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/5" },
          { label: "Scan Credits", value: `${creditsLeft}/${dailyLimit}`, icon: BarChart3, color: "text-amber-500", bg: "bg-amber-500/5" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="group hover-lift border-slate-100 shadow-xl shadow-blue-900/5">
            <CardContent className="p-10">
              <div className="flex justify-between items-start mb-6">
                 <div className="text-6xl font-black text-slate-900 tracking-tighter transition-transform group-hover:scale-105">{value}</div>
                 <div className={`p-3 rounded-2xl ${bg} ${color} transition-all duration-500 group-hover:rotate-12`}>
                   <Icon className="w-8 h-8" />
                 </div>
              </div>
              <div className="text-xs font-black text-slate-300 uppercase tracking-[0.3em]">{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Scans List */}
      <div className="space-y-10">
        <div className="flex items-center gap-4 px-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/5 flex items-center justify-center">
            <History className="w-5 h-5 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight font-heading">Recent Audit Timeline</h2>
        </div>

        {audits.length === 0 ? (
          <Card className="border-dashed border-slate-200 bg-slate-50/30 shadow-none border-2">
            <CardContent className="py-44 flex flex-col items-center text-center">
               <div className="w-20 h-20 rounded-[2rem] bg-indigo-600/5 flex items-center justify-center mb-8 border border-indigo-600/10">
                  <BarChart3 className="w-10 h-10 text-indigo-600/20" />
               </div>
               <p className="text-slate-400 font-bold mb-10 max-w-xs text-lg">No audit history. Start by analyzing your first URL to populate this space.</p>
               <Link href="/analyze">
                <Button size="lg" className="h-16 px-12 font-black shadow-xl">
                  Deep Scan Now
                </Button>
               </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {audits.map((audit) => (
              <Card key={audit.id} className="hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 border-slate-100 group">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 p-6 md:p-8 lg:px-12">
                    <div className="flex items-center gap-8 flex-1 min-w-0">
                      <div className="hidden sm:flex items-center justify-center w-16 h-16 rounded-[1.25rem] bg-slate-50 border border-slate-100 group-hover:bg-blue-600 transition-colors">
                         <Globe className="w-8 h-8 text-slate-300 group-hover:text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-xl font-black text-slate-900 truncate max-w-md tracking-tight">{audit.url}</h3>
                          <Badge variant="outline" className="border-slate-100 text-[10px] font-black text-slate-300 bg-slate-50 px-3 uppercase tracking-widest">
                            {new Date(audit.createdAt).toLocaleDateString(undefined, { month: 'short', day: '2-digit' })}
                          </Badge>
                        </div>
                        <p className="text-xs font-bold text-slate-300 flex items-center gap-2">
                           <Clock className="w-3.5 h-3.5" />
                           {new Date(audit.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-16 border-t md:border-t-0 border-slate-50 pt-6 md:pt-0">
                      <div className="text-right">
                         <div className={`text-4xl font-black ${audit.score >= 70 ? 'text-emerald-500' : audit.score >= 40 ? 'text-amber-500' : 'text-rose-600'}`}>
                           {audit.score}%
                         </div>
                         <div className="text-[10px] font-black text-slate-200 uppercase tracking-[0.3em] mt-1">SEO Rating</div>
                      </div>
                      
                      <Link href={`/analyze/${audit.id}`}>
                        <Button className="h-14 w-full md:w-auto md:px-8 rounded-2xl group border-slate-100 bg-white text-slate-400 hover:text-blue-600 hover:border-blue-600/20 shadow-none hover:shadow-xl transition-all">
                           <span className="mr-3 font-black">View Insight</span>
                           <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Spacer */}
      <div className="h-32" />
    </main>
  )
}
