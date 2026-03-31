import { ScrapedData } from "./scraper"

export interface ScoreBreakdown {
  title: number
  metaDescription: number
  h1: number
  headings: number
  canonical: number
  robots: number
  ogTags: number
  twitterCard: number
  schema: number
  imageAlt: number
  viewport: number
  lang: number
  charset: number
  favicon: number
  wordCount: number
  total: number
}

export function calculateScore(data: ScrapedData): ScoreBreakdown {
  let title = 0
  if (data.title) {
    title = data.titleLength >= 30 && data.titleLength <= 60 ? 15 : 8
  }

  let metaDescription = 0
  if (data.metaDescription) {
    metaDescription = data.metaDescriptionLength >= 120 && data.metaDescriptionLength <= 160 ? 15 : 8
  }

  const h1 = data.h1Count === 1 ? 10 : 0

  const headings = data.h2Count > 0 ? 5 : 0

  const canonical = data.canonical ? 5 : 0

  const robots = !data.robots || !data.robots.includes("noindex") ? 5 : 0

  let ogTags = 0
  const ogRequired = ["title", "description", "image", "url"]
  ogRequired.forEach((tag) => {
    if (data.ogTags[tag]) ogTags += 2.5
  })

  const twitterCard = data.twitterTags["card"] ? 5 : 0

  const schema = data.schemas.length > 0 ? 10 : 0

  const imageAlt =
    data.imageCount === 0
      ? 10
      : data.missingAltCount === 0
      ? 10
      : Math.round(((data.imageCount - data.missingAltCount) / data.imageCount) * 10)

  const viewport = data.viewport ? 3 : 0

  const lang = data.lang ? 2 : 0

  const charset = data.charset ? 2 : 0

  const favicon = data.hasFavicon ? 1 : 0

  const wordCount = data.wordCount >= 300 ? 2 : 0

  const total = Math.round(
    title + metaDescription + h1 + headings + canonical + robots + ogTags + twitterCard + schema + imageAlt + viewport + lang + charset + favicon + wordCount
  )

  return {
    title,
    metaDescription,
    h1,
    headings,
    canonical,
    robots,
    ogTags,
    twitterCard,
    schema,
    imageAlt,
    viewport,
    lang,
    charset,
    favicon,
    wordCount,
    total,
  }
}

export function getIssues(data: ScrapedData, score: ScoreBreakdown) {
  const issues: { type: "error" | "warning" | "info"; message: string }[] = []

  if (!data.title) issues.push({ type: "error", message: "Missing <title> tag" })
  else if (data.titleLength < 30) issues.push({ type: "warning", message: `Title too short (${data.titleLength} chars, min 30)` })
  else if (data.titleLength > 60) issues.push({ type: "warning", message: `Title too long (${data.titleLength} chars, max 60)` })

  if (!data.metaDescription) issues.push({ type: "error", message: "Missing meta description" })
  else if (data.metaDescriptionLength < 120) issues.push({ type: "warning", message: `Meta description too short (${data.metaDescriptionLength} chars, min 120)` })
  else if (data.metaDescriptionLength > 160) issues.push({ type: "warning", message: `Meta description too long (${data.metaDescriptionLength} chars, max 160)` })

  if (data.h1Count === 0) issues.push({ type: "error", message: "Missing H1 tag" })
  else if (data.h1Count > 1) issues.push({ type: "warning", message: `Multiple H1 tags found (${data.h1Count})` })

  if (data.h2Count === 0) issues.push({ type: "warning", message: "No H2 subheadings found" })

  if (!data.canonical) issues.push({ type: "warning", message: "No canonical URL set" })

  if (data.robots?.includes("noindex")) issues.push({ type: "error", message: "Page is set to noindex" })

  if (!data.ogTags["title"]) issues.push({ type: "warning", message: "Missing og:title" })
  if (!data.ogTags["description"]) issues.push({ type: "warning", message: "Missing og:description" })
  if (!data.ogTags["image"]) issues.push({ type: "warning", message: "Missing og:image" })

  if (!data.twitterTags["card"]) issues.push({ type: "info", message: "No Twitter Card tags found" })

  if (data.schemas.length === 0) issues.push({ type: "warning", message: "No JSON-LD schema markup found" })

  if (data.missingAltCount > 0) issues.push({ type: "warning", message: `${data.missingAltCount} image(s) missing alt text` })

  if (!data.viewport) issues.push({ type: "error", message: "Missing viewport meta tag" })

  if (!data.lang) issues.push({ type: "warning", message: "Missing lang attribute on <html>" })

  if (!data.charset) issues.push({ type: "warning", message: "No charset declaration found" })

  if (data.wordCount < 300) issues.push({ type: "info", message: `Low word count (${data.wordCount} words, recommended 300+)` })

  return issues
}
