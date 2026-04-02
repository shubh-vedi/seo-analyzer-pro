import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Sparkles, Search, ShieldCheck, ListOrdered, Code2, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white selection:bg-cyan-500/30 font-sans selection:text-cyan-200">
      {/* CSS-only animated gradient background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-1/4 w-[800px] h-[800px] bg-cyan-400/5 rounded-full blur-[150px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-1/4 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[150px] mix-blend-screen animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10">
        {/* Navigation / Header */}
        <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-zinc-950" />
            </div>
            <span className="font-bold text-lg tracking-tight">SEO Analyzer Pro</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/analyze">
              <Button className="bg-white/10 hover:bg-white/20 text-white border-0 font-semibold px-5">
                Go to App
              </Button>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-40 pb-32 px-4 max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="flex -space-x-2">
                {["bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-violet-500"].map((color, i) => (
                  <div key={i} className={`w-6 h-6 rounded-full border-2 border-zinc-900 flex items-center justify-center text-[8px] font-bold text-white ${color}`}>
                     {String.fromCharCode(65 + i)}
                  </div>
                ))}
             </div>
             <span className="text-sm font-medium text-zinc-300">Trusted by 1,000+ content creators</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1] max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Optimize for the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">AI-First Search Era</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Scan and optimize your content for AEO, GEO, and AIO with real-time AI-powered recommendations. Don't just rank — dominate AI overviews.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <Link href="/analyze" className="w-full sm:w-auto">
               <Button size="lg" className="w-full sm:w-auto h-14 px-8 bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold text-base transition-all hover:scale-105 active:scale-95">
                 Start Free Analysis
                 <Sparkles className="w-4 h-4 ml-2" />
               </Button>
            </Link>
            <Link href="#features" className="w-full sm:w-auto">
               <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 border-zinc-700 bg-transparent text-white hover:bg-zinc-800 hover:text-white font-semibold transition-all">
                 Learn More
               </Button>
            </Link>
          </div>
        </section>

        {/* Frameworks Section */}
        <section id="frameworks" className="py-24 px-4 bg-zinc-900/50 border-y border-zinc-900">
           <div className="max-w-7xl mx-auto">
             <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-4">Modern Optimization Frameworks</h2>
               <p className="text-zinc-400 max-w-2xl mx-auto text-lg">We analyze your content across the four pillars of modern AI-driven search.</p>
             </div>

             <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* AEO Card */}
                <Card className="bg-zinc-900 border-zinc-800 hover:border-cyan-400/50 transition-all duration-300 group">
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                       <div className="w-10 h-10 rounded-full bg-cyan-400/10 flex items-center justify-center">
                         <MessageSquare className="w-5 h-5 text-cyan-400" />
                       </div>
                       <div className="w-10 h-10 rounded-full border-2 border-zinc-800 border-t-cyan-400 flex items-center justify-center group-hover:rotate-180 transition-transform duration-700">
                          <span className="text-[10px] font-bold text-zinc-300 transform group-hover:-rotate-180 transition-transform duration-700">87</span>
                       </div>
                    </div>
                    <h3 className="text-xl font-bold text-cyan-400 mb-1">AEO</h3>
                    <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Answer Engine Optimization</div>
                    <p className="text-zinc-400 text-sm leading-relaxed mt-auto">
                      Optimize for ChatGPT, Gemini, Perplexity, and Copilot. Get cited in AI-generated answers with FAQ schema, concise answer blocks, and entity-first definitions.
                    </p>
                  </CardContent>
                </Card>

                {/* GEO Card */}
                <Card className="bg-zinc-900 border-zinc-800 hover:border-violet-400/50 transition-all duration-300 group">
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                       <div className="w-10 h-10 rounded-full bg-violet-400/10 flex items-center justify-center">
                         <Sparkles className="w-5 h-5 text-violet-400" />
                       </div>
                       <div className="w-10 h-10 rounded-full border-2 border-zinc-800 border-t-violet-400 flex items-center justify-center group-hover:rotate-180 transition-transform duration-700">
                          <span className="text-[10px] font-bold text-zinc-300 transform group-hover:-rotate-180 transition-transform duration-700">72</span>
                       </div>
                    </div>
                    <h3 className="text-xl font-bold text-violet-400 mb-1">GEO</h3>
                    <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Generative Engine Optimization</div>
                    <p className="text-zinc-400 text-sm leading-relaxed mt-auto">
                      Optimize for LLM-based search. Ensure your content is structured for retrieval-augmented generation (RAG) pipelines with proper entity graphs and semantic depth.
                    </p>
                  </CardContent>
                </Card>

                {/* AIO Card */}
                <Card className="bg-zinc-900 border-zinc-800 hover:border-amber-400/50 transition-all duration-300 group">
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                       <div className="w-10 h-10 rounded-full bg-amber-400/10 flex items-center justify-center">
                         <Search className="w-5 h-5 text-amber-400" />
                       </div>
                       <div className="w-10 h-10 rounded-full border-2 border-zinc-800 border-t-amber-400 flex items-center justify-center group-hover:rotate-180 transition-transform duration-700">
                          <span className="text-[10px] font-bold text-zinc-300 transform group-hover:-rotate-180 transition-transform duration-700">65</span>
                       </div>
                    </div>
                    <h3 className="text-xl font-bold text-amber-400 mb-1">AIO</h3>
                    <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">AI Overview Optimization</div>
                    <p className="text-zinc-400 text-sm leading-relaxed mt-auto">
                      Optimize for Google AI Overviews and Search Generative Experience. Win the featured position above traditional search results.
                    </p>
                  </CardContent>
                </Card>

                {/* Guidelines Card */}
                <Card className="bg-zinc-900 border-zinc-800 hover:border-green-400/50 transition-all duration-300 group">
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                       <div className="w-10 h-10 rounded-full bg-green-400/10 flex items-center justify-center">
                         <ShieldCheck className="w-5 h-5 text-green-400" />
                       </div>
                       <div className="w-10 h-10 rounded-full border-2 border-zinc-800 border-t-green-400 flex items-center justify-center group-hover:rotate-180 transition-transform duration-700">
                          <span className="text-[10px] font-bold text-zinc-300 transform group-hover:-rotate-180 transition-transform duration-700">91</span>
                       </div>
                    </div>
                    <h3 className="text-xl font-bold text-green-400 mb-1">Guidelines</h3>
                    <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Search Quality Compliance</div>
                    <p className="text-zinc-400 text-sm leading-relaxed mt-auto">
                      Strict adherence to Google's E-E-A-T and Search Quality Rater guidelines. Ensure expertise, experience, authority, and trust signals across your content.
                    </p>
                  </CardContent>
                </Card>
             </div>
           </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 px-4 max-w-7xl mx-auto">
           <div className="mb-16">
             <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-6">Actionable Insights,<br className="hidden md:block" /> Not Just Scores</h2>
           </div>

           <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: ListOrdered, color: "text-amber-400", title: "Priority Action Plan", desc: "Get a step-by-step guide on what to fix first for maximum impact. AI ranks fixes by effort vs. improvement potential." },
                { icon: Code2, color: "text-violet-400", title: "Schema Generation", desc: "Automatically generate JSON-LD schema markup tailored to your content. FAQ, HowTo, Article, Organization — copy-paste ready." },
                { icon: Zap, color: "text-cyan-400", title: "Real-time Audit", desc: "Instant feedback on content quality, structure, and AI-readiness. See scores update as you improve your page." }
              ].map((f, i) => (
                <div key={i} className="bg-zinc-800/50 rounded-2xl p-8 hover:bg-zinc-800 border border-transparent transition-colors">
                  <f.icon className={`w-8 h-8 ${f.color} mb-6`} />
                  <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                  <p className="text-zinc-400 leading-relaxed font-medium">{f.desc}</p>
                </div>
              ))}
           </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 pb-32 max-w-5xl mx-auto text-center">
           <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 md:p-20 relative overflow-hidden group">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-cyan-400/5 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
             <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">Ready to Optimize Your Content?</h2>
                <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">Join thousands of content creators who are already winning in the AI search era.</p>
                
                <Link href="/analyze">
                  <Button size="lg" className="h-16 px-10 bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-bold text-lg rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl shadow-cyan-500/20">
                    Get Started Free <span className="ml-2">→</span>
                  </Button>
                </Link>
                <p className="text-zinc-500 text-sm font-medium mt-6">No credit card required · 5 free audits daily</p>
             </div>
           </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-zinc-900 bg-zinc-950 py-12 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-cyan-400 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-zinc-950" />
                </div>
                <span className="font-bold text-sm tracking-tight text-zinc-300">SEO Analyzer Pro</span>
             </div>
             
             <div className="flex gap-8 text-sm font-medium text-zinc-500">
               <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
               <Link href="/analyze" className="hover:text-cyan-400 transition-colors">Analyze</Link>
               <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">Dashboard</Link>
               <Link href="#" className="hover:text-cyan-400 transition-colors">About</Link>
             </div>

             <div className="text-sm font-medium text-zinc-600">
               Built by @buildfastwithai
             </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
