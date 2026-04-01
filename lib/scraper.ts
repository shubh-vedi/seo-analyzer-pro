import * as cheerio from "cheerio"

export interface ScrapedData {
  title: string | null
  titleLength: number
  metaDescription: string | null
  metaDescriptionLength: number
  canonical: string | null
  robots: string | null
  ogTags: Record<string, string>
  twitterTags: Record<string, string>
  headings: { tag: string; text: string }[]
  h1Count: number
  h2Count: number
  imageCount: number
  missingAltCount: number
  internalLinks: number
  externalLinks: number
  schemas: string[]
  lang: string | null
  viewport: string | null
  charset: string | null
  hasFavicon: boolean
  wordCount: number
  hasLists: boolean
  hasTables: boolean
  first500Words: string
  h2h3Paragraphs: string[]
  url: string
}

export async function scrapeUrl(url: string): Promise<ScrapedData> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 (compatible; SEOAnalyzerBot/1.0)",
    },
    signal: AbortSignal.timeout(30000),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`)
  }

  const html = await response.text()
  const $ = cheerio.load(html)

  // Title
  const title = $("title").first().text().trim() || null
  const titleLength = title?.length ?? 0

  // Meta description
  const metaDescription = $('meta[name="description"]').attr("content")?.trim() || null
  const metaDescriptionLength = metaDescription?.length ?? 0

  // Canonical
  const canonical = $('link[rel="canonical"]').attr("href") || null

  // Robots
  const robots = $('meta[name="robots"]').attr("content") || null

  // OG tags
  const ogTags: Record<string, string> = {}
  $('meta[property^="og:"]').each((_, el) => {
    const property = $(el).attr("property")
    const content = $(el).attr("content")
    if (property && content) {
      ogTags[property.replace("og:", "")] = content
    }
  })

  // Twitter tags
  const twitterTags: Record<string, string> = {}
  $('meta[name^="twitter:"]').each((_, el) => {
    const name = $(el).attr("name")
    const content = $(el).attr("content")
    if (name && content) {
      twitterTags[name.replace("twitter:", "")] = content
    }
  })

  // Headings
  const headings: { tag: string; text: string }[] = []
  $("h1, h2, h3, h4, h5, h6").each((_, el) => {
    headings.push({
      tag: el.tagName.toLowerCase(),
      text: $(el).text().trim(),
    })
  })

  const h1Count = headings.filter((h) => h.tag === "h1").length
  const h2Count = headings.filter((h) => h.tag === "h2").length

  // Paragraphs after H2/H3 for AEO
  const h2h3Paragraphs: string[] = []
  $('h2, h3').each((_, el) => {
    const nextP = $(el).nextAll('p').first().text().trim()
    if (nextP) h2h3Paragraphs.push(nextP)
  })

  // Images
  let imageCount = 0
  let missingAltCount = 0
  $("img").each((_, el) => {
    imageCount++
    const alt = $(el).attr("alt")
    if (!alt || alt.trim() === "") missingAltCount++
  })

  // Links
  let internalLinks = 0
  let externalLinks = 0
  const baseHost = new URL(url).hostname
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") || ""
    try {
      const linkUrl = new URL(href, url)
      if (linkUrl.hostname === baseHost) {
        internalLinks++
      } else {
        externalLinks++
      }
    } catch {
      internalLinks++
    }
  })

  // JSON-LD schemas
  const schemas: string[] = []
  $('script[type="application/ld+json"]').each((_, el) => {
    const text = $(el).html()
    if (text) schemas.push(text.trim())
  })

  // Lang
  const lang = $("html").attr("lang") || null

  // Viewport
  const viewport = $('meta[name="viewport"]').attr("content") || null

  // Charset
  const charset =
    $("meta[charset]").attr("charset") ||
    $('meta[http-equiv="Content-Type"]').attr("content")?.match(/charset=([^\s;]+)/i)?.[1] ||
    null

  // Favicon
  const hasFavicon =
    $('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]').length > 0 ||
    false

  // Lists & Tables
  const hasLists = $('ul, ol').length > 0
  const hasTables = $('table').length > 0

  // Word count & First 500 words
  const bodyText = $("body").text().replace(/\s+/g, " ").trim()
  const words = bodyText.split(" ").filter((w) => w.length > 0)
  const wordCount = words.length
  const first500Words = words.slice(0, 500).join(" ")

  return {
    title,
    titleLength,
    metaDescription,
    metaDescriptionLength,
    canonical,
    robots,
    ogTags,
    twitterTags,
    headings,
    h1Count,
    h2Count,
    imageCount,
    missingAltCount,
    internalLinks,
    externalLinks,
    schemas,
    lang,
    viewport,
    charset,
    hasFavicon,
    wordCount,
    hasLists,
    hasTables,
    first500Words,
    h2h3Paragraphs,
    url,
  }
}
