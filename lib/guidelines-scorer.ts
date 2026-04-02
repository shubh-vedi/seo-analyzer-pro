import { ScrapedData } from "./scraper"

export interface GuidelinesResult {
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

function getGrade(score: number): GuidelinesResult["grade"] {
  if (score >= 90) return "A+"
  if (score >= 80) return "A"
  if (score >= 70) return "B"
  if (score >= 50) return "C"
  if (score >= 30) return "D"
  return "F"
}

export function calculateGuidelinesScore(data: ScrapedData): GuidelinesResult {
  const breakdown: GuidelinesResult["breakdown"] = []

  // 1. Experience Signals (15 pts) — first-person language
  const experienceRegex = /\b(I |we |my |our |I've |we've |I tested|I found|in my experience|we tested)\b/gi
  const expMatches = (data.first500Words.match(experienceRegex)?.length || 0)
  const expScore = expMatches >= 4 ? 15 : expMatches >= 1 ? 8 : 0
  const expTip = "Include first-person experience language ('I tested', 'in my experience') to demonstrate hands-on E-E-A-T experience signals."
  breakdown.push({ name: "Experience Signals", score: expScore, maxScore: 15, status: expScore >= 12 ? "good" : expScore > 0 ? "ok" : "bad", detail: `${expMatches} first-person experience signal(s) detected.`, improveTip: expTip })

  // 2. Expertise Indicators (15 pts)
  let expertiseScore = 0
  if (data.hasAuthorSchema) expertiseScore += 5
  // Heuristic: check for bio-like text
  const bioRegex = /\b(author|editor|expert|founder|ceo|phd|md|certified|years of experience)\b/gi
  const bioMatches = data.first500Words.match(bioRegex)?.length || 0
  if (bioMatches >= 1) expertiseScore += 5
  // Author schema with linked page proxy: if hasAuthorSchema and externalLinks > 0
  if (data.hasAuthorSchema && data.externalLinks > 0) expertiseScore += 5
  const expertiseTip = "Add an Author JSON-LD schema with name and credentials, a visible bio section, and link it to an author profile page."
  breakdown.push({ name: "Expertise Indicators", score: expertiseScore, maxScore: 15, status: expertiseScore >= 12 ? "good" : expertiseScore > 0 ? "ok" : "bad", detail: `Author schema: ${data.hasAuthorSchema ? "✓" : "✗"}, Bio keywords: ${bioMatches}, Linked author: ${data.hasAuthorSchema && data.externalLinks > 0 ? "✓" : "✗"}`, improveTip: expertiseTip })

  // 3. Authority Signals (15 pts)
  let authorityScore = 0
  const dataRegex = /\b\d+[%$]?|\bstudy\b|\bresearch\b|\bdata\b|\bstatistic/gi
  const dataClaimCount = data.first500Words.match(dataRegex)?.length || 0
  if (dataClaimCount >= 3) authorityScore += 8
  if (data.hasOrganizationSchema) authorityScore += 4
  // About page proxy: check external links to same domain about page impossible without full hrefs
  // Award 3 pts if externalLinks present as proxy for citation-worthy content
  if (data.externalLinks >= 3) authorityScore += 3
  const authorityTip = "Include original research, data, and statistics; add Organization schema; link to credible sources to build topical authority."
  breakdown.push({ name: "Authority Signals", score: Math.min(authorityScore, 15), maxScore: 15, status: authorityScore >= 12 ? "good" : authorityScore > 0 ? "ok" : "bad", detail: `Data claims: ${dataClaimCount}, Organization schema: ${data.hasOrganizationSchema ? "✓" : "✗"}, External links: ${data.externalLinks}`, improveTip: authorityTip })

  // 4. Trust Signals (15 pts)
  let trustScore = 0
  const isHttps = data.url.startsWith("https://")
  if (isHttps) trustScore += 5
  // Privacy policy / contact — approximate with external links
  if (data.externalLinks >= 1) trustScore += 5
  if (data.internalLinks >= 3) trustScore += 5
  const trustTip = "Serve content over HTTPS, include a privacy policy link, and ensure contact/about information is accessible from the page."
  breakdown.push({ name: "Trust Signals", score: trustScore, maxScore: 15, status: trustScore >= 12 ? "good" : trustScore > 0 ? "ok" : "bad", detail: `HTTPS: ${isHttps ? "✓" : "✗"}, External links: ${data.externalLinks}, Internal links: ${data.internalLinks}`, improveTip: trustTip })

  // 5. Content Quality (15 pts)
  let qualityScore = 0
  if (data.wordCount >= 1000) qualityScore += 5
  if (data.wordCount >= 300) qualityScore += 5
  if (data.imageCount > 0) qualityScore += 5
  const qualityTip = "Publish long-form (1000+ words) content with images and multimedia — thin content is flagged by Search Quality Raters."
  breakdown.push({ name: "Content Quality", score: qualityScore, maxScore: 15, status: qualityScore >= 12 ? "good" : qualityScore > 0 ? "ok" : "bad", detail: `Word count: ${data.wordCount}, Images: ${data.imageCount}`, improveTip: qualityTip })

  // 6. Transparency (10 pts)
  let transparencyScore = 0
  if (data.hasDatePublished) transparencyScore += 4
  if (data.hasDateModified) transparencyScore += 3
  if (data.hasAuthorSchema) transparencyScore += 3
  const transparencyTip = "Add datePublished, dateModified, and clear author attribution in JSON-LD — transparency is a key E-E-A-T trust signal."
  breakdown.push({ name: "Transparency", score: transparencyScore, maxScore: 10, status: transparencyScore >= 7 ? "good" : transparencyScore > 0 ? "ok" : "bad", detail: `Published date: ${data.hasDatePublished ? "✓" : "✗"}, Modified date: ${data.hasDateModified ? "✓" : "✗"}, Author: ${data.hasAuthorSchema ? "✓" : "✗"}`, improveTip: transparencyTip })

  // 7. User-First Design (8 pts)
  let uxScore = 0
  if (data.viewport) uxScore += 4
  // No intrusive elements proxy: if wordCount > 0 and no issues indicators
  if (data.wordCount > 0 && data.hasLists) uxScore += 4
  const uxTip = "Ensure mobile-friendly viewport meta and clean page structure. Avoid intrusive pop-ups and use well-organized list content."
  breakdown.push({ name: "User-First Design", score: uxScore, maxScore: 8, status: uxScore === 8 ? "good" : uxScore > 0 ? "ok" : "bad", detail: `Viewport: ${data.viewport ? "✓" : "✗"}, Structured content: ${data.hasLists ? "✓" : "✗"}`, improveTip: uxTip })

  // 8. Navigation Clarity (7 pts)
  let navScore = 0
  if (data.hasBreadcrumbSchema) navScore += 4
  if (data.hasNav) navScore += 3
  const navTip = "Add BreadcrumbList JSON-LD schema and a visible <nav> element so search quality raters can easily understand site structure."
  breakdown.push({ name: "Navigation Clarity", score: navScore, maxScore: 7, status: navScore >= 5 ? "good" : navScore > 0 ? "ok" : "bad", detail: `Breadcrumb schema: ${data.hasBreadcrumbSchema ? "✓" : "✗"}, Nav element: ${data.hasNav ? "✓" : "✗"}`, improveTip: navTip })

  const totalScore = breakdown.reduce((acc, b) => acc + b.score, 0)

  return {
    score: Math.round(Math.min(totalScore, 100)),
    breakdown,
    grade: getGrade(Math.min(totalScore, 100)),
  }
}
