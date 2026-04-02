import { ScrapedData } from "./scraper"

export interface GEOResult {
  score: number
  breakdown: {
    name: string
    score: number
    maxScore: number
    status: "good" | "ok" | "bad"
    detail: string
    improveTip: string
  }[]
  grade: "A+" | "A" | "B" | "C" | "D" | "F"
}

function getGrade(score: number): GEOResult["grade"] {
  if (score >= 90) return "A+"
  if (score >= 80) return "A"
  if (score >= 70) return "B"
  if (score >= 50) return "C"
  if (score >= 30) return "D"
  return "F"
}

export function calculateGEOScore(data: ScrapedData): GEOResult {
  const breakdown: GEOResult["breakdown"] = []

  // 1. Semantic Entity Coverage (15 pts)
  // Count unique proper-noun-ish tokens (capitalized words not at sentence start)
  const bodyWords = data.first500Words.split(/\s+/)
  const entityCandidates = new Set<string>()
  bodyWords.forEach((w, i) => {
    if (i > 0 && /^[A-Z][a-z]{2,}/.test(w)) entityCandidates.add(w.toLowerCase())
  })
  const entityCount = entityCandidates.size
  const entityScore = entityCount >= 20 ? 15 : entityCount >= 10 ? 10 : entityCount >= 5 ? 5 : 0
  const entityTip = "Include 20+ unique named entities (brands, people, technical terms) for richer LLM retrieval context."
  breakdown.push({ name: "Semantic Entity Coverage", score: entityScore, maxScore: 15, status: entityScore >= 10 ? "good" : entityScore > 0 ? "ok" : "bad", detail: `~${entityCount} unique named entities detected in first 500 words.`, improveTip: entityTip })

  // 2. Topical Depth / Word Count (12 pts)
  const depthScore = data.wordCount >= 2000 ? 12 : data.wordCount >= 1500 ? 9 : data.wordCount >= 800 ? 6 : 2
  const depthTip = "Write comprehensive 2000+ word content to maximize topical coverage for RAG pipelines."
  breakdown.push({ name: "Topical Depth", score: depthScore, maxScore: 12, status: depthScore >= 9 ? "good" : depthScore >= 6 ? "ok" : "bad", detail: `Word count: ${data.wordCount}.`, improveTip: depthTip })

  // 3. Internal Linking Density (10 pts)
  const internalPer1k = data.wordCount > 0 ? (data.internalLinks / data.wordCount) * 1000 : 0
  const internalScore = internalPer1k >= 3 ? 10 : internalPer1k >= 2 ? 7 : internalPer1k >= 1 ? 4 : 0
  const internalTip = "Add at least 3 internal links per 1,000 words to improve content graph density for LLMs."
  breakdown.push({ name: "Internal Linking Density", score: internalScore, maxScore: 10, status: internalScore >= 7 ? "good" : internalScore > 0 ? "ok" : "bad", detail: `${internalPer1k.toFixed(1)} internal links per 1,000 words.`, improveTip: internalTip })

  // 4. External Citations (10 pts)
  const externalScore = data.externalLinks >= 5 ? 10 : data.externalLinks >= 3 ? 7 : data.externalLinks >= 1 ? 4 : 0
  const externalTip = "Link to 5+ external authoritative sources so LLMs can trace credibility chains."
  breakdown.push({ name: "External Citations", score: externalScore, maxScore: 10, status: externalScore >= 7 ? "good" : externalScore > 0 ? "ok" : "bad", detail: `${data.externalLinks} external source links found.`, improveTip: externalTip })

  // 5. Content Freshness Signals (8 pts)
  const freshnessScore = data.hasDatePublished ? 8 : data.hasDateModified ? 8 : 0
  const freshnessTip = "Add datePublished and dateModified in JSON-LD schema to signal content recency to LLMs."
  breakdown.push({ name: "Content Freshness Signals", score: freshnessScore, maxScore: 8, status: freshnessScore === 8 ? "good" : "bad", detail: data.hasDatePublished ? "datePublished found in schema." : data.hasDateModified ? "dateModified found in schema." : "No date signals detected.", improveTip: freshnessTip })

  // 6. Multi-Format Content (10 pts)
  let multiFormatScore = 0
  if (data.imageCount > 0) multiFormatScore += 3
  if (data.hasLists) multiFormatScore += 3
  if (data.hasTables) multiFormatScore += 2
  if (data.hasCodeBlocks) multiFormatScore += 2
  const multiTip = "Use images, lists, tables, and code blocks to make content scannable for LLM chunking."
  breakdown.push({ name: "Multi-Format Content", score: multiFormatScore, maxScore: 10, status: multiFormatScore >= 7 ? "good" : multiFormatScore > 0 ? "ok" : "bad", detail: `Images: ${data.imageCount > 0 ? "✓" : "✗"}, Lists: ${data.hasLists ? "✓" : "✗"}, Tables: ${data.hasTables ? "✓" : "✗"}, Code: ${data.hasCodeBlocks ? "✓" : "✗"}`, improveTip: multiTip })

  // 7. Organization / Author Schema (10 pts)
  let schemaScore = 0
  if (data.hasOrganizationSchema) schemaScore += 5
  if (data.hasAuthorSchema) schemaScore += 5
  const schemaTip = "Add both Organization and Person/Author JSON-LD schemas; LLMs use entity graphs to validate content authority."
  breakdown.push({ name: "Organization/Author Schema", score: schemaScore, maxScore: 10, status: schemaScore === 10 ? "good" : schemaScore > 0 ? "ok" : "bad", detail: `Org schema: ${data.hasOrganizationSchema ? "✓" : "✗"}, Author schema: ${data.hasAuthorSchema ? "✓" : "✗"}`, improveTip: schemaTip })

  // 8. Heading Hierarchy Completeness (8 pts)
  const hasH3 = data.h3Count > 0
  const hierarchyScore = (data.h1Count >= 1 && data.h2Count > 0 && hasH3) ? 8 : (data.h1Count >= 1 && data.h2Count > 0) ? 5 : data.h1Count >= 1 ? 2 : 0
  const hierarchyTip = "Use H1 → H2 → H3 hierarchy. Complete heading hierarchy enables LLMs to understand content structure."
  breakdown.push({ name: "Heading Hierarchy", score: hierarchyScore, maxScore: 8, status: hierarchyScore === 8 ? "good" : hierarchyScore > 0 ? "ok" : "bad", detail: `H1: ${data.h1Count}, H2: ${data.h2Count}, H3: ${data.h3Count}`, improveTip: hierarchyTip })

  // 9. Meta Completeness for LLM Context (8 pts)
  let metaScore = 0
  if (data.ogTags["title"]) metaScore += 2
  if (data.ogTags["description"]) metaScore += 2
  if (data.ogTags["image"]) metaScore += 2
  if (data.canonical) metaScore += 2
  const metaTip = "Complete og:title, og:description, og:image, and canonical tag — LLMs parse these for content summaries."
  breakdown.push({ name: "Meta Completeness", score: metaScore, maxScore: 8, status: metaScore >= 6 ? "good" : metaScore > 0 ? "ok" : "bad", detail: `OG title: ${data.ogTags["title"] ? "✓" : "✗"}, OG desc: ${data.ogTags["description"] ? "✓" : "✗"}, OG image: ${data.ogTags["image"] ? "✓" : "✗"}, Canonical: ${data.canonical ? "✓" : "✗"}`, improveTip: metaTip })

  // 10. Clean URL Structure (9 pts)
  const urlStr = data.url
  const urlPath = (() => { try { return new URL(urlStr).pathname } catch { return urlStr } })()
  const hasKeywords = !/\/([\da-f]{8,}|[?&]|page\d+\/?$)/i.test(urlPath)
  const urlShort = urlStr.length < 75
  const urlScore = (hasKeywords ? 5 : 0) + (urlShort ? 4 : 0)
  const urlTip = "Use semantic, keyword-rich URLs under 75 characters. Avoid IDs and query strings in URL paths."
  breakdown.push({ name: "Clean URL Structure", score: urlScore, maxScore: 9, status: urlScore >= 7 ? "good" : urlScore > 0 ? "ok" : "bad", detail: `URL length: ${urlStr.length} chars. ${hasKeywords ? "Keyword-rich path." : "Path may contain non-descriptive IDs."}`, improveTip: urlTip })

  const totalScore = breakdown.reduce((acc, b) => acc + b.score, 0)

  return {
    score: Math.round(totalScore),
    breakdown,
    grade: getGrade(totalScore),
  }
}
