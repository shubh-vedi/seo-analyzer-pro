"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { ScoreRing } from "@/components/score-ring"
import { AuditTabs } from "@/components/audit-tabs"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, FileText, Layers, CheckCircle, XCircle, Loader2 } from "lucide-react"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AuditResult = any

interface BulkItem {
  id: string
  url: string
  status: "pending" | "analyzing" | "completed" | "failed"
  error?: string
  resultId?: string
}

export default function AnalyzePage() {
  const router = useRouter()
  // Single modes
  const [mode, setMode] = useState<"url" | "text" | "bulk">("url")
  const [url, setUrl] = useState("")
  const [text, setText] = useState("")
  const [bulkInput, setBulkInput] = useState("")
  
  // Single states
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AuditResult>(null)

  // Bulk states
  const [bulkItems, setBulkItems] = useState<BulkItem[]>([])
  const [bulkRunning, setBulkRunning] = useState(false)

  async function handleSingleAnalyze(e?: React.FormEvent) {
    if (e) e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const payload = mode === "url" ? { url, type: "url" } : { text, type: "text" }
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

  async function handleBulkAnalyze() {
    const urls = bulkInput.split('\n').map(u => u.trim()).filter(Boolean)
    if (urls.length === 0) return

    const items: BulkItem[] = urls.map((u, i) => ({
      id: `bulk-${Date.now()}-${i}`,
      url: u,
      status: "pending"
    }))
    
    setBulkItems(items)
    setBulkRunning(true)
    
    const bulkId = `b-${Date.now()}`

    for (let i = 0; i < items.length; i++) {
        setBulkItems(prev => prev.map((it, idx) => idx === i ? { ...it, status: "analyzing" } : it))
        
        try {
          const res = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: items[i].url, type: "url", bulkId }),
          })
          const data = await res.json()
          
          if (!res.ok) {
            setBulkItems(prev => prev.map((it, idx) => idx === i ? { ...it, status: "failed", error: data.error || "Failed" } : it))
          } else {
            setBulkItems(prev => prev.map((it, idx) => idx === i ? { ...it, status: "completed", resultId: data.id } : it))
          }
        } catch (err) {
          setBulkItems(prev => prev.map((it, idx) => idx === i ? { ...it, status: "failed", error: "Network error" } : it))
        }
    }
    setBulkRunning(false)
  }

  return (
    <main className="max-w-5xl mx-auto pb-32 pt-10 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-10 animate-in fade-in">
        <div className="space-y-4">
           <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gradient">Quick Scan</h1>
           <p className="text-slate-500 text-lg font-medium">
             Run deep AEO & GEO metadata parsing engines.
           </p>
        </div>
      </div>

      {!result && bulkItems.length === 0 && (
        <Card className="border-slate-100 shadow-xl shadow-blue-900/5 mb-10">
          <CardContent className="p-8 md:p-12">
            <Tabs defaultValue="url" onValueChange={(val) => setMode(val as any)}>
              <TabsList className="grid w-full grid-cols-3 mb-10 h-14 bg-slate-50">
                <TabsTrigger value="url" className="font-bold gap-2 text-slate-500 data-[state=active]:text-blue-600 data-[state=active]:shadow-md rounded-xl h-10"><Globe className="w-4 h-4"/> Single URL</TabsTrigger>
                <TabsTrigger value="text" className="font-bold gap-2 text-slate-500 data-[state=active]:text-violet-600 data-[state=active]:shadow-md rounded-xl h-10"><FileText className="w-4 h-4"/> Raw Text</TabsTrigger>
                <TabsTrigger value="bulk" className="font-bold gap-2 text-slate-500 data-[state=active]:text-amber-600 data-[state=active]:shadow-md rounded-xl h-10"><Layers className="w-4 h-4"/> Bulk URLs</TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="space-y-6">
                 <form onSubmit={handleSingleAnalyze}>
                    <div className="space-y-3 mb-6">
                      <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Target Webpage</label>
                      <Input
                        type="url"
                        placeholder="https://your-domain.com/blog/article"
                        value={url}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                        required
                        className="h-16 rounded-2xl border-slate-200 bg-white shadow-sm focus-visible:ring-blue-600/20 focus-visible:border-blue-600 text-lg px-6 font-medium"
                      />
                    </div>
                    {error && <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-bold mb-6 border border-red-100">{error}</div>}
                    <Button type="submit" disabled={loading} className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-xl shadow-blue-600/20">
                      {loading ? "Scanning Protocols..." : "Initiate Audit"}
                    </Button>
                 </form>
              </TabsContent>

              <TabsContent value="text" className="space-y-6">
                 <form onSubmit={handleSingleAnalyze}>
                    <div className="space-y-3 mb-6">
                      <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Raw Text or HTML Content</label>
                      <Textarea
                        placeholder="Paste your drafted article or offline HTML here to simulate search engine parsing..."
                        value={text}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
                        required
                        className="min-h-[250px] rounded-2xl border-slate-200 bg-white shadow-sm focus-visible:ring-violet-600/20 focus-visible:border-violet-600 text-base p-6 font-medium"
                      />
                    </div>
                    {error && <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-bold mb-6 border border-red-100">{error}</div>}
                    <Button type="submit" disabled={loading} className="w-full h-16 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-black text-lg shadow-xl shadow-violet-600/20">
                      {loading ? "Synthesizing Content..." : "Analyze Draft"}
                    </Button>
                 </form>
              </TabsContent>

              <TabsContent value="bulk" className="space-y-6">
                  <div className="space-y-3 mb-6">
                    <label className="text-sm font-black text-slate-900 uppercase tracking-widest">Bulk URL Array</label>
                    <div className="text-xs text-slate-500 font-medium mb-2">Paste one URL per line. Up to 10 URLs recommended.</div>
                    <Textarea
                      placeholder="https://domain.com/1&#10;https://domain.com/2"
                      value={bulkInput}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBulkInput(e.target.value)}
                      className="min-h-[250px] rounded-2xl border-slate-200 bg-white shadow-sm focus-visible:ring-amber-600/20 focus-visible:border-amber-600 text-base p-6 font-mono"
                    />
                  </div>
                  <Button onClick={handleBulkAnalyze} disabled={bulkRunning || !bulkInput.trim()} className="w-full h-16 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-lg shadow-xl shadow-amber-500/20">
                    {bulkRunning ? "Processing Batch..." : "Start Bulk Audit"}
                  </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Bulk Tracker UI */}
      {bulkItems.length > 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
           <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Bulk Scan Progress</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">Processing {bulkItems.length} destinations.</p>
              </div>
              {!bulkRunning && (
                <Button onClick={() => {setBulkItems([]); setMode("bulk")}} variant="outline" className="border-slate-200">
                  Scan New Batch
                </Button>
              )}
           </div>

           <Card className="border-slate-100 shadow-md">
             <CardContent className="p-0">
               <div className="divide-y divide-slate-100">
                 {bulkItems.map((item, idx) => (
                   <div key={item.id} className="flex items-center justify-between p-6 hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-4 min-w-0">
                         <div className="text-slate-400 font-black text-xs w-6 text-center">{idx + 1}</div>
                         <div className="truncate flex-1 min-w-0 font-medium text-slate-700">{item.url}</div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0 pl-6">
                         {item.status === "pending" && <Badge variant="outline" className="text-slate-400 bg-slate-50 border-slate-200">Pending</Badge>}
                         {item.status === "analyzing" && <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200 animate-pulse"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Analyzing</Badge>}
                         {item.status === "completed" && (
                           <>
                             <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0"><CheckCircle className="w-3 h-3 mr-1" /> Success</Badge>
                             <Button variant="ghost" size="sm" className="font-bold text-blue-600 hover:text-blue-700" onClick={() => router.push(`/analyze/${item.resultId}`)}>View</Button>
                           </>
                         )}
                         {item.status === "failed" && (
                           <div className="flex items-center gap-2">
                             <span className="text-xs text-red-500 max-w-[120px] truncate">{item.error}</span>
                             <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 border-0"><XCircle className="w-3 h-3 mr-1" /> Failed</Badge>
                           </div>
                         )}
                      </div>
                   </div>
                 ))}
               </div>
             </CardContent>
           </Card>
        </div>
      )}

      {/* Single Result Dashboard */}
      {result && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-blue-900/5">
            <div>
              <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-0 mb-4 tracking-widest text-[10px] uppercase font-black px-3 py-1">
                {result.type === 'text' ? 'Raw Text Engine' : 'URL Scan Complete'}
              </Badge>
              <h2 className="text-2xl font-black text-slate-900 truncate max-w-xl tracking-tight" title={result.url || "Raw text snippet"}>
                {result.url || "Raw Text Block"}
              </h2>
            </div>
            <div className="flex gap-3 print:hidden">
              <Button onClick={() => window.print()} variant="premium" className="font-bold px-6 h-12 rounded-xl shadow-xl shadow-blue-600/20">
                Export PDF
              </Button>
              <Button onClick={() => {setResult(null); setUrl(""); setText("")}} variant="outline" className="border-slate-200 hover:bg-slate-50 font-bold px-6 h-12 rounded-xl">
                New Scan
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <ScoreRing score={result.score} label="Legacy SEO" subtitle="Base Technicals" size={140} colorOverride="" />
            <ScoreRing score={result.aeoScore} label="AEO Score" subtitle="Answer Engine Readability" size={140} colorOverride="text-cyan-500" />
            <ScoreRing score={result.geoScore} label="GEO Score" subtitle="Generative Engine Map" size={140} colorOverride="text-violet-500" />
            <ScoreRing score={result.aioScore} label="AIO Readiness" subtitle="AI Overviews" size={140} colorOverride="text-amber-500" />
          </div>

          <div className="mt-16 bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-blue-900/5 overflow-hidden">
            <AuditTabs data={result.data} aiTips={result.aiTips} type={result.type} />
          </div>
        </div>
      )}
    </main>
  )
}
