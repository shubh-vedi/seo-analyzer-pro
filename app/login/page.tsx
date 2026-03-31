"use client"

import { signIn, getProviders } from "next-auth/react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Lock, Sparkles, Binary } from "lucide-react"

type Providers = Awaited<ReturnType<typeof getProviders>>

export default function LoginPage() {
  const [providers, setProviders] = useState<Providers>(null)

  useEffect(() => {
    getProviders().then(setProviders)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-background">
      {/* Decorative sapphire glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[160px] animate-pulse -z-10" />
      
      <Card className="w-full max-w-[440px] px-2 pt-6 shadow-3xl shadow-blue-900/10 border-white/60 animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="text-center pt-10 pb-8 px-10">
          <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-600/5 flex items-center justify-center mx-auto mb-8 border border-indigo-600/10 transition-transform hover:scale-110">
            <Lock className="w-8 h-8 text-indigo-600" />
          </div>
          <CardTitle className="text-4xl font-black tracking-tight text-gradient">Identity Access.</CardTitle>
          <CardDescription className="text-slate-500 mt-3 text-base font-medium leading-relaxed">
            Welcome to the Analyzer Pro network. Access your <span className="text-indigo-600 font-bold border-b-2 border-indigo-600/10">Deep Scan History</span> and AI suggestions.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-10 pb-12 space-y-5">
          {providers?.google && (
            <Button
              className="w-full h-16 bg-white text-slate-900 hover:bg-slate-50 font-bold rounded-2xl shadow-[0_15px_30px_-10px_rgba(30,58,138,0.1)] border border-slate-100 transition-all active:scale-[0.98] group"
              onClick={() => signIn("google", { callbackUrl: "/analyze" })}
            >
              <svg className="w-6 h-6 mr-4 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
          )}
          
          {providers?.github && (
            <Button
              variant="outline"
              className="w-full h-16 border-slate-100 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-bold rounded-2xl transition-all active:scale-[0.98] group"
              onClick={() => signIn("github", { callbackUrl: "/analyze" })}
            >
              <svg className="w-6 h-6 mr-4 transition-transform group-hover:rotate-12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Continue with GitHub
            </Button>
          )}

          {!providers && (
            <div className="py-12 flex flex-col items-center gap-6">
               <div className="relative">
                 <div className="absolute inset-0 bg-blue-600/10 blur-[30px] rounded-full animate-pulse" />
                 <div className="w-10 h-10 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin relative" />
               </div>
               <p className="text-slate-300 font-black tracking-[0.2em] uppercase text-[10px]">Initializing Secure Tunnel...</p>
            </div>
          )}

          <div className="pt-8 flex flex-col items-center gap-4 border-t border-slate-50 mt-4">
             <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 tracking-[0.2em] group">
               <Binary className="w-4 h-4 text-slate-200 group-hover:text-blue-500 transition-colors" />
               AES-256 SYNCED IDENTITY
             </div>
             <p className="text-[9px] font-bold text-slate-200 max-w-[200px] text-center leading-relaxed">
               Securely redirecting to federated OAuth endpoints using enterprise-grade encryption.
             </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Soft Footer Version */}
      <div className="absolute bottom-12 left-0 right-0 text-center flex flex-col items-center gap-2">
         <Sparkles className="w-4 h-4 text-blue-100" />
         <span className="text-[10px] font-black text-slate-300 tracking-[0.6em] uppercase">SAPPHIRE LIGHT &copy; 2026</span>
      </div>
    </div>
  )
}
