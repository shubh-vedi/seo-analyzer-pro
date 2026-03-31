import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { ScoreRing } from "@/components/score-ring"
import { AuditTabs } from "@/components/audit-tabs"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default async function AuditDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/login")

  const { id } = await params

  const audit = await prisma.audit.findUnique({
    where: { id },
  })

  if (!audit || audit.userId !== session.user.id) notFound()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = audit.data as any
  const aiTips = audit.aiTips ? JSON.parse(audit.aiTips) : null

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-50">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Dashboard
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="font-mono text-sm text-zinc-400 truncate">{audit.url}</h1>
          <p className="text-xs text-zinc-500">{new Date(audit.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex flex-col items-center">
              <ScoreRing score={audit.score} size={140} />
              <div className="mt-3 text-center">
                <div className={`text-sm font-semibold ${audit.score >= 70 ? "text-green-400" : audit.score >= 40 ? "text-amber-400" : "text-red-400"}`}>
                  {audit.score >= 70 ? "Good" : audit.score >= 40 ? "Needs Work" : "Poor"}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-1">
              {[
                { label: "Word Count", value: data.wordCount },
                { label: "H1 Tags", value: data.h1Count },
                { label: "Images", value: data.imageCount },
                { label: "Schemas", value: data.schemas?.length ?? 0 },
              ].map(({ label, value }) => (
                <div key={label} className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50 text-center">
                  <div className="text-2xl font-bold text-zinc-100">{value}</div>
                  <div className="text-xs text-zinc-400 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <AuditTabs data={data} aiTips={aiTips} />
    </main>
  )
}
