"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ScoreRing } from "@/components/score-ring"
import { AuditTabs } from "@/components/audit-tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Download, Search, Sparkles, Globe, BarChart3, Fingerprint, LucideRocket } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AuditResult = any

export default function AnalyzePage() {
  const router = useRouter()
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AuditResult>(null)

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login")
          return
        }
        setError(data.error || "Analysis failed")
        return
      }

      setResult(data)
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  function exportCsv() {
    if (!result) return
    const d = result.data
    const rows = [
      ["Field", "Value"],
      ["URL", result.url],
      ["Score", result.score],
      ["Title", d.title ?? ""],
      ["Title Length", d.titleLength],
      ["Meta Description", d.metaDescription ?? ""],
      ["Meta Description Length", d.metaDescriptionLength],
      ["H1 Count", d.h1Count],
      ["H2 Count", d.h2Count],
      ["Image Count", d.imageCount],
      ["Missing Alt", d.missingAltCount],
      ["Internal Links", d.internalLinks],
      ["External Links", d.externalLinks],
      ["Word Count", d.wordCount],
      ["Canonical", d.canonical ?? ""],
      ["Robots", d.robots ?? ""],
      ["Viewport", d.viewport ?? ""],
      ["Lang", d.lang ?? ""],
      ["Schema Count", d.schemas.length],
    ]
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = `seo-audit-${new URL(result.url).hostname}-${Date.now()}.csv`
    a.click()
  }

  const domain = url ? (() => { try { return new URL(url).hostname } catch { return url } })() : ""

  return (
    <main className="max-w-5xl mx-auto px-4 pt-44 pb-32">
      <div className="flex flex-col items-center text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <Badge variant="outline" className="mb-6 border-blue-600/20 bg-blue-600/5 text-blue-600 tracking-[0.25em] uppercase text-[10px] px-5 py-1.5 font-black">
          Global Scan Engine
        </Badge>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6 text-gradient">Audit Your URL.</h1>
        <p className="text-slate-500 max-w-lg mx-auto leading-relaxed font-medium">
          Instant technical metadata parsing with <span className="text-blue-600 font-bold border-b-2 border-blue-600/10">Advanced AI</span> powered synthesis.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-24">
        <form onSubmit={handleAnalyze} className="relative group">
          <div className="absolute -inset-1 bg-linear-to-r from-blue-600/20 to-indigo-600/20 rounded-3xl blur opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-200" />
          <div className="relative bg-white/70 backdrop-blur-3xl rounded-[2rem] p-3 flex flex-col sm:flex-row gap-3 border border-white shadow-2xl shadow-blue-900/10">
            <div className="flex-1 relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300" />
              <Input
                type="url"
                placeholder="https://your-business.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="h-16 pl-14 bg-transparent border-0 shadow-none focus-visible:ring-0 text-xl text-slate-900 placeholder:text-slate-200 font-bold"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              variant="premium"
              className="h-16 px-12 text-base font-black shadow-2xl shadow-blue-600/30 active:scale-[0.97]"
            >
              {loading ? "SCANNING..." : "START AUDIT"}
            </Button>
          </div>
        </form>
        
        {error && (
          <div className="mt-6 p-5 bg-rose-50 border-rose-100 border rounded-2xl text-rose-600 text-sm font-bold flex items-center gap-4 animate-in fade-in zoom-in-95 shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            {error}
          </div>
        )}
      </div>

      {loading && (
        <div className="space-y-16 max-w-4xl mx-auto animate-in fade-in duration-500">
          <div className="text-center space-y-6">
            <Badge variant="outline" className="border-blue-600/10 text-blue-600 animate-pulse font-black px-6">
               FETCHING: {domain.toUpperCase()}
            </Badge>
            <div className="flex justify-center py-12 scale-110">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600/5 blur-[80px] rounded-full" />
                <ScoreRing score={0} size={180} />
                <div className="absolute inset-0 flex items-center justify-center">
                   <LucideRocket className="w-12 h-12 text-blue-600/20 animate-bounce" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28 bg-white rounded-3xl border border-slate-100 shadow-sm" />
            ))}
          </div>
          <Skeleton className="h-[600px] bg-white rounded-[2.5rem] border border-slate-100 shadow-sm" />
        </div>
      )}

      {result && !loading && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-700 ease-out">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 border-b border-slate-100 pb-12">
            <div>
              <div className="flex items-center gap-2 text-slate-300 text-[10px] font-black uppercase tracking-[0.4em] mb-3">
                <Fingerprint className="w-4 h-4" />
                Unique Report ID: {Math.random().toString(36).substring(7).toUpperCase()}
              </div>
              <h2 className="text-3xl font-black text-slate-900 truncate max-w-xl font-heading">{domain}</h2>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={exportCsv}
              className="h-12 border-slate-100 bg-white shadow-xl shadow-blue-900/5 text-slate-400 font-black tracking-tight rounded-2xl px-6 hover:text-blue-600 transition-all hover:scale-105"
            >
              <Download className="w-4 h-4 mr-3" />
              Download Report (.CSV)
            </Button>
          </div>

          {/* Report Summary Card */}
          <Card className="border-slate-100 shadow-3xl shadow-blue-900/10 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-[400px_1fr] gap-0">
                {/* Visual Score Section */}
                <div className="p-16 border-r border-slate-50 flex flex-col items-center justify-center bg-slate-50/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-radial-gradient(blue-100,transparent) opacity-10" />
                  <div className="flex flex-row items-center justify-center gap-10 relative group">
                    <div className="flex flex-col items-center">
                      <ScoreRing score={result.score} size={180} label="SEO" />
                    </div>
                    <div className="flex flex-col items-center">
                      <ScoreRing score={result.aeoScore || 0} size={180} label="AEO" />
                      <div className="mt-2 text-xl font-black text-blue-600 bg-blue-50 px-3 py-0.5 rounded-lg border border-blue-100">
                        {result.aeoResult?.grade || "F"}
                      </div>
                    </div>
                  </div>
                  <div className="mt-10 text-center">
                    <div className="flex items-center gap-2 justify-center mb-1">
                      <div className={`text-2xl font-black ${result.score >= 70 ? "text-emerald-500" : result.score >= 40 ? "text-amber-500" : "text-rose-600"}`}>
                        {result.score >= 70 ? "OPTIMIZED" : result.score >= 40 ? "SUB-OPTIMAL" : "CRITICAL"}
                      </div>
                      <div className="w-1 h-1 rounded-full bg-slate-200" />
                      <div className={`text-2xl font-black ${result.aeoScore >= 70 ? "text-blue-500" : result.aeoScore >= 40 ? "text-amber-500" : "text-rose-600"}`}>
                        {result.aeoScore >= 70 ? "AEO READY" : result.aeoScore >= 40 ? "AEO FAIR" : "AEO WEAK"}
                      </div>
                    </div>
                    <div className="text-[10px] font-black text-slate-300 tracking-[0.4em] uppercase text-center">ANALYTICS ENGINE RATING</div>
                  </div>
                </div>

                {/* Performance Stat Grid */}
                <div className="p-16 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white">
                   {[
                    { label: "Word Density", value: result.data.wordCount, icon: Fingerprint, color: "text-blue-600" },
                    { label: "DOM Architecture", value: `${result.data.h1Count} x H1`, icon: BarChart3, color: "text-indigo-600" },
                    { label: "Asset Metadata", value: result.data.imageCount, icon: Globe, color: "text-emerald-600" },
                    { label: "AI Suggestions", value: 5, icon: Sparkles, color: "text-purple-600" },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="p-8 border border-slate-50 rounded-[1.75rem] flex items-center justify-between group hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300">
                      <div>
                         <div className="text-3xl font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tighter">{value}</div>
                         <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-2">{label}</div>
                      </div>
                      <div className={`p-3 rounded-2xl bg-slate-50 ${color} group-hover:rotate-12 transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audit Dashboard Section */}
          <div className="relative pt-12">
             <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-100 to-transparent" />
             <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-full bg-blue-600/5 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 font-heading">Technical Deep Scan</h3>
             </div>
             <AuditTabs data={result.data} aiTips={result.aiTips} />
          </div>
        </div>
      )}
    </main>
  )
}
