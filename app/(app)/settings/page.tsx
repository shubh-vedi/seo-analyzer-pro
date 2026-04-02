import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { credits: true, name: true, email: true },
  })

  return (
    <main className="max-w-4xl mx-auto pb-32 pt-10">
      <div className="mb-10 animate-in fade-in">
         <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gradient mb-4">Settings</h1>
         <p className="text-slate-500 text-lg font-medium">
           Manage your account and billing.
         </p>
      </div>

      <div className="space-y-6">
        <Card className="shadow-lg shadow-blue-900/5 border-slate-100">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Personal details associated with your account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div>
               <div className="text-sm font-bold text-slate-500 mb-1">Name</div>
               <div className="font-medium text-slate-900">{user?.name || "Not provided"}</div>
             </div>
             <div>
               <div className="text-sm font-bold text-slate-500 mb-1">Email</div>
               <div className="font-medium text-slate-900">{user?.email}</div>
             </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg shadow-blue-900/5 border-slate-100">
          <CardHeader>
            <CardTitle>Subscription & Scanning Limits</CardTitle>
            <CardDescription>View your current tier and credit balances.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="flex items-center justify-between p-6 rounded-2xl bg-slate-50 border border-slate-100 mb-4">
                <div>
                  <div className="text-lg font-black text-slate-900 mb-1">Free Tier</div>
                  <div className="text-sm font-medium text-slate-500">5 Audits per day</div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0">ACTIVE</Badge>
             </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
