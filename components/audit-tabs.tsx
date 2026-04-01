"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrapedData } from "@/lib/scraper"
import { AiTip } from "@/lib/gemini"
import { Info, Code, Share2, Database, Link2, AlertCircle, Sparkles, Brain, CheckCircle2, AlertTriangle, XCircle } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AEOResult } from "@/lib/aeo-scorer"

interface AuditTabsProps {
  data: ScrapedData & { 
    scoreBreakdown: Record<string, number>; 
    issues: { type: string; message: string }[];
    aeoResult?: AEOResult;
  }
  aiTips: AiTip[] | null
}

export function AuditTabs({ data, aiTips }: AuditTabsProps) {
  return (
    <Tabs defaultValue="meta" className="w-full">
      <TabsList className="bg-slate-100/50 border border-slate-200/60 p-1 flex-wrap h-auto rounded-2xl gap-1 mb-8">
        <TabsTrigger value="meta" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl px-4 py-2 text-xs font-bold text-slate-500 data-[state=active]:text-blue-600 transition-all flex items-center gap-2">
          <Info className="w-3.5 h-3.5" /> Meta Tags
        </TabsTrigger>
        <TabsTrigger value="headings" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl px-4 py-2 text-xs font-bold text-slate-500 data-[state=active]:text-blue-600 transition-all flex items-center gap-2">
          <Code className="w-3.5 h-3.5" /> Headings
        </TabsTrigger>
        <TabsTrigger value="og" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl px-4 py-2 text-xs font-bold text-slate-500 data-[state=active]:text-blue-600 transition-all flex items-center gap-2">
          <Share2 className="w-3.5 h-3.5" /> OG / Social
        </TabsTrigger>
        <TabsTrigger value="aeo" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl px-4 py-2 text-xs font-bold text-slate-500 data-[state=active]:text-blue-600 transition-all flex items-center gap-2">
          <Brain className="w-3.5 h-3.5" /> AEO Analysis
        </TabsTrigger>
        <TabsTrigger value="schema" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl px-4 py-2 text-xs font-bold text-slate-500 data-[state=active]:text-blue-600 transition-all flex items-center gap-2">
          <Database className="w-3.5 h-3.5" /> Schema
        </TabsTrigger>
        <TabsTrigger value="links" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl px-4 py-2 text-xs font-bold text-slate-500 data-[state=active]:text-blue-600 transition-all flex items-center gap-2">
          <Link2 className="w-3.5 h-3.5" /> Assets
        </TabsTrigger>
        <TabsTrigger value="issues" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl px-4 py-2 text-xs font-bold text-slate-500 data-[state=active]:text-blue-600 transition-all flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5" /> Issues
        </TabsTrigger>
        <TabsTrigger value="ai" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-xl px-4 py-2 text-xs font-black text-slate-500 transition-all flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" /> AI Insights
        </TabsTrigger>
      </TabsList>

      {/* Meta Tags */}
      <TabsContent value="meta" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid gap-3">
          {[
            { label: "Title", value: data.title, note: `${data.titleLength} chars` },
            { label: "Meta Description", value: data.metaDescription, note: `${data.metaDescriptionLength} chars` },
            { label: "Canonical", value: data.canonical },
            { label: "Robots", value: data.robots },
            { label: "Viewport", value: data.viewport },
            { label: "Charset", value: data.charset },
            { label: "Lang", value: data.lang },
          ].map(({ label, value, note }) => (
            <div key={label} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 p-5 rounded-[1.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest w-36 shrink-0 group-hover:text-blue-600 transition-colors">{label}</span>
              <div className="flex-1 flex items-center justify-between gap-4 overflow-hidden">
                <span className={`text-sm font-bold truncate ${value ? "text-slate-900" : "text-rose-500 italic opacity-50"}`}>
                  {value || "Missing Resource"}
                </span>
                {note && <Badge variant="outline" className="border-slate-100 text-[10px] font-bold text-slate-400 bg-slate-50">{note}</Badge>}
              </div>
            </div>
          ))}
        </div>
      </TabsContent>

      {/* Headings */}
      <TabsContent value="headings" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-3">
          {data.headings.length === 0 ? (
            <div className="p-12 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
               <p className="text-slate-400 font-bold">No structural headings detected.</p>
            </div>
          ) : (
            data.headings.map((h, i) => (
              <div
                key={i}
                className="flex gap-4 items-start p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-blue-600/10 transition-all"
                style={{ marginLeft: `${Math.min((parseInt(h.tag[1]) - 1) * 20, 80)}px` }}
              >
                <Badge className="bg-blue-600/10 text-blue-600 border-0 shrink-0 font-black uppercase text-[10px] px-3">
                  {h.tag}
                </Badge>
                <span className="text-sm font-bold text-slate-700 leading-relaxed">{h.text}</span>
              </div>
            ))
          )}
        </div>
      </TabsContent>

      {/* OG / Twitter */}
      <TabsContent value="og" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4 px-2">
               <Share2 className="w-4 h-4 text-blue-600" />
               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Open Graph</h3>
            </div>
            <div className="space-y-2">
              {Object.entries(data.ogTags).length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl text-slate-400 text-xs font-bold">No data.</div>
              ) : (
                Object.entries(data.ogTags).map(([key, val]) => (
                  <div key={key} className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 group shadow-sm">
                    <span className="text-slate-300 text-[9px] font-black uppercase vertical-text mt-1">OG:{key}</span>
                    <span className="text-sm text-slate-700 font-bold break-all leading-relaxed">{val}</span>
                  </div>
                ))
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-4 px-2">
               <Share2 className="w-4 h-4 text-indigo-500" />
               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Twitter Card</h3>
            </div>
            <div className="space-y-2">
              {Object.entries(data.twitterTags).length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl text-slate-400 text-xs font-bold">No data.</div>
              ) : (
                Object.entries(data.twitterTags).map(([key, val]) => (
                  <div key={key} className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 group shadow-sm">
                    <span className="text-slate-300 text-[9px] font-black uppercase vertical-text mt-1">TWT:{key}</span>
                    <span className="text-sm text-slate-700 font-bold break-all leading-relaxed">{val}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="aeo" className="animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none">
        <div className="mb-8 p-8 rounded-[2rem] bg-linear-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-900/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Brain className="w-5 h-5 opacity-80" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70">Answer Engine Optimization</span>
              </div>
              <h3 className="text-3xl font-black tracking-tight mb-2">AEO Visibility Grade</h3>
              <p className="text-blue-100 font-medium max-w-md">
                This score measures how likely AI answer engines like ChatGPT and Gemini are to cite your content as a primary source.
              </p>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 min-w-[160px]">
              <div className="text-6xl font-black mb-1">{data.aeoResult?.grade || "F"}</div>
              <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Composite Grade</div>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {!data.aeoResult ? (
            <div className="p-16 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
              <p className="text-slate-400 font-bold">No AEO data available for this audit.</p>
            </div>
          ) : (
            data.aeoResult.breakdown.map((item, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-md transition-all">
                <div className="p-6 flex items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      item.status === "good" ? "bg-emerald-50 text-emerald-500" : 
                      item.status === "ok" ? "bg-amber-50 text-amber-500" : "bg-rose-50 text-rose-500"
                    }`}>
                      {item.status === "good" ? <CheckCircle2 className="w-5 h-5" /> : 
                       item.status === "ok" ? <AlertTriangle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-sm uppercase tracking-tight">{item.name}</h4>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">{item.detail}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-lg font-black text-slate-900 leading-none">{item.score}<span className="text-slate-300 text-xs font-bold">/{item.maxScore}</span></div>
                    <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1">Points</div>
                  </div>
                </div>
                <div className="px-6 pb-2 pt-0 border-t border-slate-50">
                  <Accordion className="w-full">
                    <AccordionItem value="tip" className="border-0">
                      <AccordionTrigger className="py-3 text-[11px] font-black text-blue-600 uppercase tracking-widest hover:no-underline">
                        How to improve Visibility
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-500 font-medium leading-relaxed pb-4">
                        {item.tip}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            ))
          )}
        </div>
      </TabsContent>

      {/* Schema */}
      <TabsContent value="schema" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {data.schemas.length === 0 ? (
          <div className="p-16 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
             <p className="text-slate-400 font-bold text-lg">No JSON-LD schema found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.schemas.map((schema, i) => (
              <div key={i} className="relative group">
                <div className="absolute top-4 right-4 bg-blue-600/10 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  Schema #{i+1}
                </div>
                <pre className="text-xs font-mono bg-slate-900 border border-slate-800 rounded-[1.5rem] p-8 overflow-auto text-blue-400/80 max-h-96 shadow-2xl">
                  {(() => {
                    try { return JSON.stringify(JSON.parse(schema), null, 2) }
                    catch { return schema }
                  })()}
                </pre>
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      {/* Links & Images */}
      <TabsContent value="links" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: "Internal Links", value: data.internalLinks, icon: Link2, color: "text-blue-600" },
            { label: "External Links", value: data.externalLinks, icon: Globe, color: "text-indigo-600" },
            { label: "Total Images", value: data.imageCount, icon: Share2, color: "text-emerald-600" },
            { label: "Missing Alt", value: data.missingAltCount, icon: AlertCircle, color: "text-rose-500" },
            { label: "Total Words", value: data.wordCount, icon: Code, color: "text-slate-900" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-center group">
               <div className={`w-10 h-10 rounded-2xl bg-slate-50 ${color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                 <Icon className="w-5 h-5" />
               </div>
              <div className="text-2xl font-black text-slate-900 tracking-tighter">{value}</div>
              <div className="text-[10px] text-slate-300 font-black uppercase tracking-widest mt-1">{label}</div>
            </div>
          ))}
        </div>
      </TabsContent>

      {/* Issues */}
      <TabsContent value="issues" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-3">
          {data.issues.length === 0 ? (
            <div className="p-16 text-center bg-emerald-50/50 rounded-[2rem] border-2 border-dashed border-emerald-100">
               <p className="text-emerald-600 font-black text-xl">Perfect Score. No issues detected.</p>
            </div>
          ) : (
            data.issues.map((issue, i) => (
              <div key={i} className="flex gap-5 items-center p-5 rounded-[1.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <Badge
                  className={
                    issue.type === "error"
                      ? "bg-rose-500 text-white border-0 px-4 h-8"
                      : issue.type === "warning"
                      ? "bg-amber-400 text-white border-0 px-4 h-8"
                      : "bg-blue-600 text-white border-0 px-4 h-8"
                  }
                >
                  <span className="font-black uppercase tracking-widest text-[9px]">{issue.type}</span>
                </Badge>
                <span className="text-sm font-bold text-slate-700 leading-relaxed flex-1">{issue.message}</span>
              </div>
            ))
          )}
        </div>
      </TabsContent>

      {/* AI Tips */}
      <TabsContent value="ai" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {!aiTips ? (
          <div className="p-16 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
             <p className="text-slate-400 font-bold">Waiting for Gemini synthesis...</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {aiTips.map((tip) => (
              <div key={tip.priority} className="p-10 rounded-[2.5rem] border border-slate-100 bg-white shadow-xl shadow-blue-900/5 relative group hover:border-blue-600/10 transition-all">
                <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600/5 flex items-center justify-center font-black text-blue-600 text-xl border border-blue-600/10 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    {tip.priority}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-black text-slate-900 text-2xl tracking-tight leading-none uppercase">{tip.title}</h4>
                      <Badge
                        className={
                          tip.impact === "high"
                            ? "bg-rose-500/10 text-rose-500 border-0 px-3 font-black text-[9px] uppercase tracking-widest"
                            : tip.impact === "medium"
                            ? "bg-amber-400/10 text-amber-500 border-0 px-3 font-black text-[9px] uppercase tracking-widest"
                            : "bg-blue-600/10 text-blue-600 border-0 px-3 font-black text-[9px] uppercase tracking-widest"
                        }
                      >
                        {tip.impact}
                      </Badge>
                    </div>
                    <div className="text-[10px] font-black text-slate-200 uppercase tracking-[0.4em]">Gemini Optimization Vector</div>
                  </div>
                </div>
                <p className="text-lg text-slate-600 font-medium leading-relaxed bg-slate-50/50 p-8 rounded-[1.5rem] border border-slate-50 group-hover:bg-white transition-colors duration-500">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}

function Globe({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20" />
      <path d="M2 12h20" />
    </svg>
  )
}
