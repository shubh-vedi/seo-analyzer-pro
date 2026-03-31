import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { WaitlistForm } from "@/components/waitlist-form"
import { Zap, BarChart2, Clock, CheckCircle, Search, ShieldCheck, Sparkles, TrendingUp, Laptop, Globe } from "lucide-react"

export default function LandingPage() {
  return (
    <main className="relative overflow-hidden pt-20 bg-background">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 pt-28 pb-40 text-center overflow-hidden">
        {/* Decorative elements for Light Mode */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-40">
          <div className="absolute top-[-20%] left-1/4 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-[-10%] right-1/4 w-[500px] h-[500px] bg-indigo-400/5 rounded-full blur-[120px]" />
        </div>

        <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out">
          <Badge variant="outline" className="mb-10 border-blue-600/20 bg-blue-600/5 text-blue-600 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 mr-2 text-blue-500 animate-pulse" />
            Next-Gen SEO Scanning
          </Badge>
          
          <h1 className="text-6xl md:text-[5.5rem] font-black tracking-tight mb-10 leading-[1.05] text-gradient">
            Analyze your site <br />
            with <span className="text-blue-600 text-glow">Clarity.</span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-14 leading-relaxed font-medium">
            Get a deep-metadata 100-point audit and actionable fix 
            suggestions from <span className="text-slate-900 font-bold border-b-2 border-blue-600/20">Gemini 2.5 Flash</span> in under 5 seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center w-full max-w-md">
            <Link href="/analyze" className="w-full sm:w-auto">
              <Button size="lg" variant="premium" className="w-full h-16 shadow-2xl transition-all hover:scale-105 active:scale-95 group">
                Deep Scan Your URL
                <Search className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full h-16 px-12 border-slate-200 text-slate-900 font-bold shadow-md hover:bg-white hover:border-slate-300">
                Sign In
              </Button>
            </Link>
          </div>
          
          <div className="mt-20 flex items-center gap-10 justify-center opacity-30">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-slate-900" />
              <span className="text-xs font-black uppercase tracking-widest">Enterprise Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <Laptop className="w-5 h-5 text-slate-900" />
              <span className="text-xs font-black uppercase tracking-widest">Cross-Platform</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-slate-900" />
              <span className="text-xs font-black uppercase tracking-widest">Rank Tracking</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid of Key Features */}
      <section className="max-w-7xl mx-auto px-4 py-32 border-t border-slate-100 bg-white/30 backdrop-blur-sm">
        <div className="grid lg:grid-cols-3 gap-8">
           {[
            { icon: Zap, title: "Velocity Audit", desc: "Our engine executes 15+ comprehensive technical checks across your DOM in milliseconds." },
            { icon: Sparkles, title: "Gemini Synthesis", desc: "Advanced AI models synthesize suggestions to specifically match your niche's SEO requirements." },
            { icon: Clock, title: "Persistent History", desc: "Maintain a cloud-synced database of your progress to track SEO score improvements over time." }
          ].map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="hover-lift border-slate-100 bg-white shadow-xl shadow-blue-900/5">
              <CardContent className="p-12">
                <div className="w-16 h-16 rounded-2xl bg-blue-600/5 flex items-center justify-center mb-8 border border-blue-600/10">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-black text-slate-900 text-2xl mb-4 leading-none">{title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Score Section */}
      <section className="py-32 mb-32 bg-slate-50/50 border-y border-slate-100 relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1 text-center md:text-left">
               <Badge variant="outline" className="mb-6 border-indigo-600/20 bg-indigo-600/5 text-indigo-600">The Gold Standard</Badge>
               <h2 className="text-5xl font-black tracking-tight text-slate-900 mb-6 font-heading">The 100-Point <span className="text-blue-600 underline underline-offset-8 decoration-blue-600/10">SEO Blueprint</span></h2>
               <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10">
                 We've engineered a rigorous auditing framework that maps directly to current search engine ranking signals.
               </p>
               <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                  {["Title Tags", "Meta Descriptions", "Heading Hierarchy", "Schema.org Checks", "Image Alt Validation", "OG Card Testing"].map(check => (
                    <div key={check} className="flex items-center gap-3 text-slate-900 font-bold text-sm tracking-tight">
                       <CheckCircle className="w-5 h-5 text-emerald-500" />
                       {check}
                    </div>
                  ))}
               </div>
            </div>
            
            <div className="w-full max-w-sm">
                <Card className="rotate-3 shadow-2xl shadow-indigo-600/10 border-indigo-100">
                  <CardContent className="p-10 text-center">
                     <div className="text-7xl font-black text-indigo-600 mb-2">94%</div>
                     <div className="text-xs uppercase tracking-[0.3em] font-black text-slate-300">Avg Efficiency Rise</div>
                  </CardContent>
                </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified Pricing */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 py-32">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-black tracking-tight text-slate-900 mb-4">Start for free today.</h2>
          <p className="text-slate-500 font-medium">Simple usage limits for solo creators, enterprise features coming soon.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          {/* Free Card */}
          <Card className="group border-slate-100 shadow-2xl shadow-blue-900/5 hover:border-blue-600/20 transition-all">
            <CardContent className="p-12">
              <div className="text-xs font-black text-blue-600 uppercase tracking-widest mb-2">Forever Free</div>
              <div className="text-5xl font-black text-slate-900 mb-10">Essential</div>
              
              <div className="space-y-5 text-left mb-12 border-t border-slate-50 pt-10">
                {[
                  "5 deep-scans per day",
                  "Full Technical 100pt score",
                  "Gemini AI Fix Engine",
                  "Scan timeline history",
                  "PDF/CSV Data Export",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-4 text-slate-600 font-bold text-sm">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              
              <Link href="/analyze" className="block">
                <Button className="w-full h-14 text-base font-black shadow-xl shadow-blue-600/20 group-hover:scale-[1.02] transition-transform">
                  Initiate Scan
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Pro/Waitlist Card */}
          <Card className="bg-slate-50/50 border-slate-100 flex flex-col hover:bg-slate-100 transition-all group">
            <CardContent className="p-12 flex-grow">
               <div className="flex justify-between items-start mb-2">
                 <div className="text-xs font-black text-indigo-400 uppercase tracking-widest">Early Access</div>
                 <Badge className="bg-indigo-600/10 text-indigo-600 font-black border-0">SAVE 50%</Badge>
               </div>
              <div className="text-5xl font-black text-slate-900 mb-6">Expert</div>
              
              <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                Join our private beta for advanced features like bulk analysis, competitor monitoring, and automated scan scheduling.
              </p>

              <div className="mt-auto">
                <WaitlistForm />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="border-t border-slate-100 py-16 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center font-black text-white text-[10px]">S</div>
             <span className="font-black text-slate-300 tracking-widest uppercase text-xs">SEO ANALYZER</span>
          </div>
          <p className="text-slate-300 font-black uppercase text-[10px] tracking-widest">
            &copy; 2026 Crafted in Sapphire Light
          </p>
        </div>
      </footer>
    </main>
  )
}
