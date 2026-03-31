"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function WaitlistForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus("success")
        setEmail("")
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <p className="text-green-400 text-sm font-medium">
        You&apos;re on the list! We&apos;ll notify you when Pro launches.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm">
      <Input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="bg-zinc-800 border-zinc-700 text-zinc-50 placeholder:text-zinc-500"
      />
      <Button
        type="submit"
        disabled={status === "loading"}
        variant="outline"
        className="border-zinc-600 text-zinc-300 hover:bg-zinc-800"
      >
        {status === "loading" ? "..." : "Notify Me"}
      </Button>
    </form>
  )
}
