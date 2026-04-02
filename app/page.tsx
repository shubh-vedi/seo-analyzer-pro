import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Sparkles, Search, ShieldCheck, ListOrdered, Code2, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 pt-44 pb-32">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center mb-32 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <Badge variant="outline" className="mb-8 border-blue-600/20 bg-blue-600/5 text-blue-600 tracking-[0.25em] uppercase text-[10px] px-5 py-1.5 font-black flex items-center gap-2">
          <div className="flex -space-x-2 mr-2">
            {["bg-blue-500", "bg-emerald-500", "bg-amber-500"].map((color, i) => (
              <div key={i} className={`w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[7px] font-bold text-white shadow-sm ${color}`}>
                 {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          Trusted by 1,000+ content creators
        </Badge>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 text-gradient leading-[1.1] max-w-4xl mx-auto">
          Optimize for the <br />
          <span className="text-blue-600">AI-First Search Era</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          Scan and optimize your content for AEO, GEO, and AIO with real-time AI-powered recommendations. Don't just rank — dominate AI overviews.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
          <Link href="/analyze" className="w-full sm:w-auto">
             <Button size="lg" className="w-full sm:w-auto h-14 rounded-full px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-xl shadow-blue-500/30 transition-all hover:scale-105 active:scale-95">
               Start Free Analysis
               <Sparkles className="w-4 h-4 ml-2" />
             </Button>
          </Link>
          <Link href="#frameworks" className="w-full sm:w-auto">
             <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 rounded-full px-8 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold transition-all shadow-sm">
               Learn More
             </Button>
          </Link>
        </div>
      </section>

      {/* Frameworks Section */}
      <section id="frameworks" className="py-24 border-y border-slate-100 mb-32 relative">
         <div className="absolute inset-0 bg-blue-50/30 -z-10" />
         <div className="max-w-6xl mx-auto">
           <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-4">Modern Optimization Frameworks</h2>
             <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">We analyze your content across the four pillars of modern AI-driven search to ensure maximum visibility.</p>
           </div>

           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* AEO Card */}
              <Card className="bg-white border-slate-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300 group rounded-[2rem] overflow-hidden">
                <CardContent className="p-8 h-full flex flex-col relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110" />
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-1">AEO</h3>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Answer Engine Optimization</div>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium mt-auto">
                    Optimize for ChatGPT, Gemini, and Perplexity. Get cited in AI-generated answers with precise entity-first definitions.
                  </p>
                </CardContent>
              </Card>

              {/* GEO Card */}
              <Card className="bg-white border-slate-100 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-900/5 transition-all duration-300 group rounded-[2rem] overflow-hidden">
                <CardContent className="p-8 h-full flex flex-col relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110" />
                  <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center mb-6">
                    <Sparkles className="w-6 h-6 text-violet-600" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-1">GEO</h3>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Generative Engine Optimization</div>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium mt-auto">
                    Ensure your content is structured perfectly for retrieval-augmented generation (RAG) pipelines with deep semantic maps.
                  </p>
                </CardContent>
              </Card>

              {/* AIO Card */}
              <Card className="bg-white border-slate-100 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-900/5 transition-all duration-300 group rounded-[2rem] overflow-hidden">
                <CardContent className="p-8 h-full flex flex-col relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110" />
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mb-6">
                    <Search className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-1">AIO</h3>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">AI Overview Optimization</div>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium mt-auto">
                    Win the Google AI Overviews featured position with robust People Also Ask semantic alignment and clarity.
                  </p>
                </CardContent>
              </Card>

              {/* Guidelines Card */}
              <Card className="bg-white border-slate-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/5 transition-all duration-300 group rounded-[2rem] overflow-hidden">
                <CardContent className="p-8 h-full flex flex-col relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110" />
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6">
                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-1">E-E-A-T</h3>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Search Quality Compliance</div>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium mt-auto">
                    Strict adherence to Google's E-E-A-T guidelines. Master expertise, authority, and trust signals across your domain.
                  </p>
                </CardContent>
              </Card>
           </div>
         </div>
      </section>

      {/* Features Detail */}
      <section className="mb-32">
         <div className="mb-16 text-center">
           <h2 className="text-3xl md:text-5xl font-black tracking-tight text-gradient mb-6">Actionable Insights,<br className="hidden md:block" /> Not Just Scores</h2>
         </div>

         <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: ListOrdered, color: "text-amber-500", bg: "bg-amber-50", title: "Priority Action Plan", desc: "Get a step-by-step guide on what to fix first for maximum impact. AI ranks fixes by effort vs. improvement potential." },
              { icon: Code2, color: "text-violet-600", bg: "bg-violet-50", title: "Schema Generation", desc: "Automatically generate JSON-LD schema markup tailored to your content. FAQ, HowTo, Article, Organization — copy-paste ready." },
              { icon: Zap, color: "text-blue-600", bg: "bg-blue-50", title: "Real-time Audit", desc: "Instant feedback on content quality, structure, and AI-readiness. See scores update as you improve your page." }
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-[2rem] p-10 shadow-xl shadow-blue-900/5 border border-slate-100 hover:border-blue-100 transition-colors group">
                <div className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-7 h-7 ${f.color}`} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
         </div>
      </section>

      {/* Bottom CTA */}
      <section className="text-center">
         <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-16 relative overflow-hidden shadow-2xl shadow-blue-900/20">
           <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full" />
           <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/50 blur-[100px] rounded-full" />
           
           <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6">Ready to Optimize Your Content?</h2>
              <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium">Join thousands of content creators who are already dominating the AI search era.</p>
              
              <Link href="/analyze">
                <Button size="lg" className="h-16 px-10 bg-white hover:bg-slate-50 text-blue-600 font-black text-lg rounded-full shadow-xl transition-all hover:scale-105 active:scale-95">
                  Get Started Free <span className="ml-2">→</span>
                </Button>
              </Link>
              <p className="text-blue-200 text-sm font-bold tracking-wide mt-8 uppercase">No credit card required · 5 free audits daily</p>
           </div>
         </div>
      </section>
    </main>
  )
}
