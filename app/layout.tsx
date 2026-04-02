import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SEO Analyzer Pro — AI-Powered SEO Audits",
  description: "Get instant SEO audits with AI-powered fix suggestions. Free, fast, and comprehensive.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased selection:bg-primary/10 selection:text-primary min-h-screen relative overflow-x-hidden transition-colors duration-500`}>
        {/* Ambient Background Glows for Light Mode */}
        <div className="fixed inset-0 pointer-events-none -z-10 bg-background overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/5 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/5 blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-white/[0.02] rounded-full blur-[160px]" />
        </div>
        
        <Navbar />
        <main className="relative z-0">
          {children}
        </main>
      </body>
    </html>
  )
}
