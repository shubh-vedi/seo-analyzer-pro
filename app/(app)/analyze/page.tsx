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
import { Globe, FileText, Layers, CheckCircle, XCircle, Loader2, ListChecks, MessageSquare, Layout, Zap, Sparkles, Copy, ChevronRight, Code } from "lucide-react"

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

  const InputSection = (isSidebar = false) => (
    <Card className={`border-slate-100 shadow-xl shadow-blue-900/5 ${isSidebar ? 'p-0' : 'p-8 md:p-12'}`}>
      <CardContent className={isSidebar ? 'p-6' : 'p-0'}>
        <div className="flex items-center gap-2 mb-6">
          <Layout className="w-5 h-5 text-blue-600" />
          <h2 className="font-black text-slate-800 text-lg uppercase tracking-tight">Analysis Input</h2>
          <div className="ml-auto flex gap-1">
            <Badge variant="outline" className={`px-2 py-0 h-6 text-[10px] font-black cursor-pointer hover:border-blue-400 transition-colors ${mode === 'url' ? 'bg-blue-600 text-white border-blue-600' : 'text-slate-400 border-slate-200'}`} onClick={() => setMode('url')}>Single</Badge>
            <Badge variant="outline" className={`px-2 py-0 h-6 text-[10px] font-black cursor-pointer hover:border-amber-400 transition-colors ${mode === 'bulk' ? 'bg-amber-500 text-white border-amber-500' : 'text-slate-400 border-slate-200'}`} onClick={() => setMode('bulk')}>Bulk</Badge>
          </div>
        </div>

        <Tabs value={mode} onValueChange={(val) => setMode(val as any)}>
          <TabsContent value="url" className="space-y-4 m-0 transition-all">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Content URL</label>
              <div className="relative group">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <Input
                  type="url"
                  placeholder="https://example.com/blog-post"
                  value={url}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                  className={`h-12 pl-11 rounded-xl border-slate-200 bg-slate-50/50 focus-visible:ring-blue-600/20 focus-visible:border-blue-600 text-sm font-medium ${isSidebar ? 'h-11 text-xs' : ''}`}
                />
              </div>
            </div>
            {!isSidebar && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Paste Content</label>
                <Textarea
                  placeholder="Paste your article content here..."
                  className="min-h-[150px] rounded-xl border-slate-200 bg-slate-50/50 focus-visible:ring-violet-600/20 focus-visible:border-violet-600 text-sm p-4 font-medium"
                  value={text}
                  onChange={(e) => { setText(e.target.value); setMode('text'); }}
                />
              </div>
            )}
            <Button 
              onClick={handleSingleAnalyze} 
              disabled={loading} 
              className={`w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-lg shadow-blue-600/20 gap-2 transition-all active:scale-[0.98] ${isSidebar ? 'h-11' : ''}`}
            >
              <Zap className={`w-3.5 h-3.5 ${loading ? 'animate-pulse' : ''}`} />
              {loading ? "Analyzing..." : "Analyze Content"}
            </Button>
          </TabsContent>

          <TabsContent value="text" className="space-y-4 m-0">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Paste Content</label>
                <Textarea
                  placeholder="Paste your article content here..."
                  className="min-h-[200px] rounded-xl border-slate-200 bg-slate-50/50 focus-visible:ring-violet-600/20 focus-visible:border-violet-600 text-sm p-4 font-medium"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleSingleAnalyze} 
                disabled={loading} 
                className="w-full h-12 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-black text-sm shadow-lg shadow-violet-600/20 gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Analyze Draft
              </Button>
          </TabsContent>

          <TabsContent value="bulk" className="space-y-4 m-0">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Batch URLs</label>
                <Textarea
                  placeholder="Paste URLs (one per line)..."
                  className="min-h-[150px] rounded-xl border-slate-200 bg-slate-50/50 focus-visible:ring-amber-600/20 focus-visible:border-amber-600 text-sm p-4 font-mono"
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleBulkAnalyze} 
                disabled={bulkRunning || !bulkInput.trim()} 
                className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-lg shadow-amber-500/20 gap-2"
              >
                <Layers className="w-3.5 h-3.5" />
                {bulkRunning ? "Processing..." : "Start Bulk Scan"}
              </Button>
          </TabsContent>
        </Tabs>
        {error && <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-600 text-xs font-bold border border-red-100 animate-in fade-in">{error}</div>}
      </CardContent>
    </Card>
  )

  return (
    <main className="max-w-[1400px] mx-auto pb-32 pt-10 px-4 md:px-8">
      {/* Centered initial state */}
      {!result && bulkItems.length === 0 && (
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="space-y-4 text-center">
            <h1 className="text-5xl font-black tracking-tighter text-slate-900 lg:text-6xl">
              Content<span className="text-blue-600">Optima</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto italic">
              "Dominate generative search results with real-time AI content auditing and optimization suggestions."
            </p>
          </div>
          {InputSection()}
        </div>
      )}

      {/* Grid Layout after scan */}
      {(result || bulkItems.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            {InputSection(true)}

            {/* Priority Action Plan */}
            {result && result.aiTips && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 pl-1">
                  <Badge className="bg-amber-100 text-amber-700 border-none rounded-full p-1"><Zap className="w-3.5 h-3.5" /></Badge>
                  <h3 className="font-black text-slate-800 text-base tracking-tight uppercase">Priority Action Plan</h3>
                </div>
                <div className="space-y-4">
                  {result.aiTips.slice(0, 4).map((tip: any, idx: number) => (
                    <div key={idx} className="group p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center font-black text-rose-500 text-xs border border-rose-100 group-hover:bg-rose-500 group-hover:text-white transition-all">
                        {idx + 1}
                      </div>
                      <div className="space-y-1.5 flex-1">
                        <div className="font-bold text-slate-800 text-xs leading-tight">{tip.title}</div>
                        <div className="flex gap-1.5">
                          <Badge variant="outline" className="px-1.5 py-0 h-4 text-[8px] font-black text-blue-500 border-blue-100 bg-blue-50/30 uppercase">{tip.framework}</Badge>
                          <Badge variant="outline" className="px-1.5 py-0 h-4 text-[8px] font-black text-slate-400 border-slate-100 bg-slate-50 uppercase">{tip.impact}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bulk items sidebar view */}
            {bulkItems.length > 0 && !result && (
              <Card className="border-slate-100 shadow-md">
                <CardContent className="p-0 overflow-hidden">
                  <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs font-black text-slate-500 uppercase tracking-widest">
                    <span>Scan Queue</span>
                    <span>{bulkItems.filter(i => i.status === 'completed').length}/{bulkItems.length}</span>
                  </div>
                  <div className="divide-y divide-slate-50 max-h-[400px] overflow-auto">
                    {bulkItems.map((item, idx) => (
                      <div key={item.id} className="p-4 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-[10px] font-black text-slate-300 w-4">{idx+1}</span>
                          <span className="text-[11px] font-bold text-slate-600 truncate max-w-[120px]">{item.url}</span>
                        </div>
                        {item.status === 'completed' ? (
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-blue-600 font-black text-[10px] uppercase" onClick={() => router.push(`/analyze/${item.resultId}`)}>View <ChevronRight className="w-3 h-3 ml-1" /></Button>
                        ) : (
                          <div className={`w-2 h-2 rounded-full ${item.status === 'analyzing' ? 'bg-blue-500 animate-pulse' : item.status === 'failed' ? 'bg-red-500' : 'bg-slate-200'}`} />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </aside>

          {/* Main Content Area */}
          <section className="lg:col-span-8 space-y-10">
            {result ? (
              <>
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-blue-900/5 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                      <Layout className="w-64 h-64 -mr-20 -mt-20 transform rotate-12" />
                   </div>
                   <div className="relative z-10 space-y-8">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-1">
                          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Optimization Dashboard</h2>
                          <div className="flex items-center gap-2">
                             <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Overall Score</span>
                             <Badge className="bg-blue-600 text-white border-0 font-black px-2 py-0.5 text-xs">{result.score}/100</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2 print:hidden">
                           <Button onClick={() => window.print()} variant="outline" className="border-slate-200 rounded-xl font-black text-xs hover:bg-slate-50 h-10 px-6 uppercase tracking-widest">Export PDF</Button>
                           <Button onClick={() => {setResult(null); setUrl(""); setText("")}} className="bg-slate-900 text-white rounded-xl font-black text-xs h-10 px-6 uppercase tracking-widest hover:bg-slate-800 transition-all">New Scan</Button>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-50/50 p-6 rounded-3xl border border-slate-100/50">
                        <ScoreRing score={result.aeoScore} label="AEO" subtitle="" size={110} colorOverride="text-emerald-500" />
                        <ScoreRing score={result.aioScore} label="AIO" subtitle="" size={110} colorOverride="text-blue-500" />
                        <ScoreRing score={result.geoScore} label="GEO" subtitle="" size={110} colorOverride="text-violet-500" />
                        <ScoreRing score={result.score} label="GGL" subtitle="" size={110} colorOverride="text-slate-900" />
                     </div>
                   </div>
                </div>

                {/* Framework Detailed Audit */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-blue-900/5 p-2 overflow-hidden">
                   <AuditTabs data={result.data} aiTips={result.aiTips} type={result.type} />
                </div>

                {/* Vertical Split Context Panels */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  {/* Left Column: Rewrite Suggestions */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 pl-4">
                      <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20"><MessageSquare className="w-4 h-4" /></div>
                      <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">Rewrite Suggestions</h3>
                    </div>
                    <div className="space-y-4">
                      {result.aiTips?.map((tip: any, i: number) => (
                        <div key={i} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-4 group">
                          <div className="flex justify-between items-start">
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">{tip.title}</h4>
                            <Badge variant="outline" className="h-5 px-2 text-[8px] font-black border-slate-100 text-slate-400 bg-slate-50 uppercase tracking-[0.2em]">{tip.framework}</Badge>
                          </div>
                          
                          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100/50">
                            <p className="text-xs text-slate-600 font-bold leading-relaxed italic">"{tip.description}"</p>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-md bg-emerald-500/10 flex items-center justify-center text-emerald-500 mt-0.5"><CheckCircle className="w-3 h-3" /></div>
                            <div className="flex-1 space-y-1">
                              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">How to Optimize</span>
                              <p className="text-xs text-slate-700 font-medium leading-relaxed">{tip.howToFix}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Schema & Snippets */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 pl-4">
                      <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg"><Code className="w-4 h-4" /></div>
                      <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">Schema & Snippets</h3>
                    </div>
                    <div className="space-y-6">
                      {result.aiTips?.filter((t: any) => t.codeBlock).map((tip: any, i: number) => (
                        <div key={i} className="p-6 bg-slate-900 rounded-[2rem] shadow-xl group">
                          <div className="flex items-center justify-between mb-4">
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{tip.title} (Code)</span>
                             <button onClick={() => {navigator.clipboard.writeText(tip.codeBlock)}} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"><Copy className="w-3 h-3" /></button>
                          </div>
                          <div className="overflow-auto max-h-[300px] scrollbar-hide">
                            <pre className="text-[11px] font-mono text-emerald-400/90 whitespace-pre-wrap leading-relaxed">
                              {tip.codeBlock}
                            </pre>
                          </div>
                        </div>
                      ))}
                      {/* Default Snippet if no code blocks */}
                      {!result.aiTips?.some((t: any) => t.codeBlock) && (
                        <div className="p-10 text-center bg-slate-100 rounded-3xl border-2 border-dashed border-slate-200">
                          <p className="text-slate-400 font-bold text-sm">No structured data blocks generated for this sample.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center py-20 text-center border-2 border-dashed border-slate-200 rounded-[2.5rem]">
                  <div className="space-y-4 max-w-sm px-6">
                    <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-3xl mx-auto shadow-sm"><Zap className="w-8 h-8 text-slate-300" /></div>
                    <h3 className="text-xl font-black text-slate-400">Ready for Scan Engine</h3>
                    <p className="text-sm font-medium text-slate-300">Enter a destination on the left to initialize the AEO & GEO scoring protocols.</p>
                  </div>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  )
}
