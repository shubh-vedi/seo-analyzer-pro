import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { scrapeUrl } from "@/lib/scraper"
import { calculateScore, getIssues } from "@/lib/scorer"
import { calculateAEOScore } from "@/lib/aeo-scorer"
import { calculateGEOScore } from "@/lib/geo-scorer"
import { calculateAIOScore } from "@/lib/aio-scorer"
import { calculateGuidelinesScore } from "@/lib/guidelines-scorer"
import { getAiTips } from "@/lib/gemini"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { url } = await req.json()
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Validate URL
    let parsedUrl: URL
    try {
      parsedUrl = new URL(url)
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
    }

    // Rate limiting: 5 audits per day (resets at midnight UTC)
    const userId = session.user.id
    const startOfDay = new Date()
    startOfDay.setUTCHours(0, 0, 0, 0)

    const todayCount = await prisma.audit.count({
      where: {
        userId,
        createdAt: { gte: startOfDay },
      },
    })

    if (todayCount >= 5) {
      return NextResponse.json(
        { error: "Daily limit reached. You can run 5 audits per day. Resets at midnight UTC." },
        { status: 429 }
      )
    }

    // Scrape
    const scrapedData = await scrapeUrl(parsedUrl.toString())

    // Scores
    const scoreBreakdown = calculateScore(scrapedData)
    const issues = getIssues(scrapedData, scoreBreakdown)
    const aeoResult = calculateAEOScore(scrapedData)
    const geoResult = calculateGEOScore(scrapedData)
    const aioResult = calculateAIOScore(scrapedData)
    const guidelinesResult = calculateGuidelinesScore(scrapedData)

    // AI tips
    let aiTips: string | null = null
    try {
      const tips = await getAiTips({ ...scrapedData, scoreBreakdown, issues, aeoResult })
      aiTips = JSON.stringify(tips)
    } catch (err) {
      console.error("Gemini error:", err)
    }

    // Save to DB
    const audit = await prisma.audit.create({
      data: {
        url: parsedUrl.toString(),
        score: scoreBreakdown.total,
        data: {
          ...scrapedData,
          scoreBreakdown,
          issues,
          aeoResult,
          geoResult,
          aioResult,
          guidelinesResult,
        } as object,
        aiTips,
        userId,
      },
    })

    return NextResponse.json({
      id: audit.id,
      url: audit.url,
      score: audit.score,
      aeoScore: aeoResult.score,
      aeoResult,
      geoScore: geoResult.score,
      geoResult,
      aioScore: aioResult.score,
      aioResult,
      guidelinesScore: guidelinesResult.score,
      guidelinesResult,
      data: audit.data,
      aiTips: audit.aiTips ? JSON.parse(audit.aiTips) : null,
      createdAt: audit.createdAt,
    })
  } catch (err) {
    console.error("Analyze error:", err)

    let errorMessage = "Analysis failed"
    let status = 500

    if (err instanceof Error) {
      errorMessage = err.message
      if (err.name === "TimeoutError") {
        errorMessage = "The website took too long to respond. It may be slow or blocking automated scans."
        status = 504
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status }
    )
  }
}
