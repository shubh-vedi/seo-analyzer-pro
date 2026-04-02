import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { History as HistoryIcon, Clock, Globe, FileText, Download, Trash2, ArrowRight } from "lucide-react"

export default async function HistoryPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/login")

  const audits = await prisma.audit.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 100, // recent 100
  })

  // Group by date or bulkId if needed. For now, flat list is fine.
  return (
    <main className="max-w-5xl mx-auto pb-32 pt-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-10 animate-in fade-in">
        <div className="space-y-4">
           <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gradient">Audit History</h1>
           <p className="text-slate-500 text-lg font-medium">
             Review, re-export, or manage your past analysis reports.
           </p>
        </div>
      </div>

      <div className="grid gap-6">
        {audits.length === 0 ? (
           <Card className="border-dashed border-slate-200 bg-slate-50/30 shadow-none border-2">
             <CardContent className="py-32 flex flex-col items-center text-center">
                <HistoryIcon className="w-12 h-12 text-slate-300 mb-6" />
                <p className="text-slate-400 font-bold mb-6 text-lg">No history found.</p>
             </CardContent>
           </Card>
        ) : audits.map((audit) => {
          // Fallbacks for typing if Prisma generic schema is lagging
          const auditAny = audit as any
          const type = auditAny.type || "url"
          const title = type === "text" ? "Raw Text Analysis" : (auditAny.url || "Unknown URL")
          
          return (
            <Card key={audit.id} className="hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 border-slate-100 group">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 p-6 lg:px-8">
                  <div className="flex items-center gap-6 flex-1 min-w-0">
                    <div className={`flex items-center justify-center w-14 h-14 rounded-2xl border transition-colors ${type === 'text' ? 'bg-amber-50 border-amber-100 group-hover:bg-amber-500 text-amber-500' : 'bg-slate-50 border-slate-100 group-hover:bg-blue-600 text-slate-300'} group-hover:text-white`}>
                       {type === "text" ? <FileText className="w-6 h-6" /> : <Globe className="w-6 h-6" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-black text-slate-900 truncate tracking-tight">{title}</h3>
                        {auditAny.bulkId && (
                           <Badge variant="outline" className="border-amber-200 text-[10px] text-amber-600 bg-amber-50 px-2 tracking-widest uppercase">
                             Bulk
                           </Badge>
                        )}
                        <Badge variant="outline" className="border-slate-100 text-[10px] font-black text-slate-400 bg-slate-50 px-3 uppercase tracking-widest">
                          {new Date(audit.createdAt).toLocaleDateString(undefined, { month: 'short', day: '2-digit' })}
                        </Badge>
                      </div>
                      <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
                         <Clock className="w-3.5 h-3.5" />
                         {new Date(audit.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-6 text-right">
                    <div>
                       <div className={`text-2xl font-black ${audit.score >= 70 ? 'text-emerald-500' : audit.score >= 40 ? 'text-amber-500' : 'text-rose-600'}`}>
                         {audit.score}%
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Link href={`/analyze/${audit.id}`}>
                        <Button className="rounded-xl border-slate-100 bg-white text-slate-500 hover:text-blue-600 hover:border-blue-600/20 shadow-none hover:shadow-lg transition-all">
                           Open <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </main>
  )
}
