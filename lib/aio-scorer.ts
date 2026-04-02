import { ScrapedData } from "./scraper"

export interface AIOResult {
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

function getGrade(score: number): AIOResult["grade"] {
  if (score >= 90) return "A+"
  if (score >= 80) return "A"
  if (score >= 70) return "B"
  if (score >= 50) return "C"
  if (score >= 30) return "D"
  return "F"
}

export function calculateAIOScore(data: ScrapedData): AIOResult {
  const breakdown: AIOResult["breakdown"] = []

  // 1. Featured Snippet Readiness (15 pts)
  // Check for a short paragraph directly answering the title's implied question
  let snippetScore = 0
  let snippetDetail = "No concise answer paragraph detected near the top."
  if (data.h2h3Paragraphs.length > 0) {
    const firstPara = data.h2h3Paragraphs[0]
    const wordCount = firstPara.split(/\s+/).length
    if (wordCount <= 50) {
      snippetScore = 15
      snippetDetail = `First answer paragraph is ${wordCount} words — ideal for featured snippets.`
    } else {
      snippetScore = 8
      snippetDetail = `First answer paragraph is ${wordCount} words — too long for optimal snippet (aim ≤50).`
    }
  }
  const snippetTip = "Write a concise 40–50 word paragraph immediately after the first H2 that directly answers the page's main question."
  breakdown.push({ name: "Featured Snippet Readiness", score: snippetScore, maxScore: 15, status: snippetScore >= 12 ? "good" : snippetScore > 0 ? "ok" : "bad", detail: snippetDetail, improveTip: snippetTip })

  // 2. Definition / List / Table Format (12 pts)
  const schemasJoined = data.schemas.join(" ")
  const hasDefinitionPara = data.first500Words.toLowerCase().includes(" is a ") || data.first500Words.toLowerCase().includes(" is the ") || data.first500Words.toLowerCase().includes(" refers to ")
  let formatScore = 0
  if (hasDefinitionPara) formatScore += 4
  if (data.hasLists) formatScore += 4
  if (data.hasTables) formatScore += 4
  const formatTip = "Use definition-style paragraphs, bulleted/numbered lists, and comparison tables — these formats are preferred by Google's AI Overviews."
  breakdown.push({ name: "Definition/List/Table Format", score: formatScore, maxScore: 12, status: formatScore >= 8 ? "good" : formatScore > 0 ? "ok" : "bad", detail: `Definition para: ${hasDefinitionPara ? "✓" : "✗"}, Lists: ${data.hasLists ? "✓" : "✗"}, Tables: ${data.hasTables ? "✓" : "✗"}`, improveTip: formatTip })

  // 3. People Also Ask Alignment (12 pts)
  const questionWords = ["who", "what", "when", "where", "why", "how", "can", "does", "is", "are", "should", "will"]
  const questionHeadings = data.headings.filter(h =>
    (h.tag === "h2" || h.tag === "h3") &&
    questionWords.some(word => h.text.toLowerCase().startsWith(word))
  )
  const h2h3Total = data.headings.filter(h => h.tag === "h2" || h.tag === "h3").length
  const paaPercent = h2h3Total > 0 ? (questionHeadings.length / h2h3Total) * 100 : 0
  let paaScore = 0
  if (paaPercent >= 40) paaScore = 12
  else if (paaPercent >= 20) paaScore = 8
  else if (paaPercent >= 10) paaScore = 4
  const paaTip = "Format 40%+ of H2/H3 subheadings as questions to align with Google's People Also Ask boxes and AI Overview triggers."
  breakdown.push({ name: "People Also Ask Alignment", score: paaScore, maxScore: 12, status: paaScore >= 8 ? "good" : paaScore > 0 ? "ok" : "bad", detail: `${Math.round(paaPercent)}% of subheadings are question-format.`, improveTip: paaTip })

  // 4. Image Alt Text Quality (8 pts)
  let altScore = 0
  let altDetail = "No images found."
  if (data.imageCount > 0) {
    if (data.altTextMissingRatio === 0) {
      altScore = 8
      altDetail = `All ${data.imageCount} images have descriptive alt text.`
    } else if (data.altTextMissingRatio <= 0.5) {
      altScore = 4
      altDetail = `${data.missingAltCount}/${data.imageCount} images are missing alt text.`
    } else {
      altDetail = `${data.missingAltCount}/${data.imageCount} images missing alt text — majority is absent.`
    }
  }
  const altTip = "Ensure all images have descriptive, keyword-rich alt text. Google AI Overviews use image context to validate content relevance."
  breakdown.push({ name: "Image Alt Text Quality", score: altScore, maxScore: 8, status: altScore === 8 ? "good" : altScore > 0 ? "ok" : "bad", detail: altDetail, improveTip: altTip })

  // 5. Page Experience Signals (10 pts)
  let expScore = 0
  if (data.viewport) expScore += 3
  if (data.charset) expScore += 2
  if (data.lang) expScore += 2
  if (data.canonical) expScore += 3
  const expTip = "Set viewport, charset, lang, and canonical tags — these are basic page quality signals Google uses to assess AIO eligibility."
  breakdown.push({ name: "Page Experience Signals", score: expScore, maxScore: 10, status: expScore >= 7 ? "good" : expScore > 0 ? "ok" : "bad", detail: `Viewport: ${data.viewport ? "✓" : "✗"}, Charset: ${data.charset ? "✓" : "✗"}, Lang: ${data.lang ? "✓" : "✗"}, Canonical: ${data.canonical ? "✓" : "✗"}`, improveTip: expTip })

  // 6. Schema Richness (10 pts)
  let richSchema = 0
  const hasArticleSchema = schemasJoined.includes('"Article"') || schemasJoined.includes('"BlogPosting"') || schemasJoined.includes('"NewsArticle"')
  if (hasArticleSchema) richSchema += 4
  if (data.hasAuthorSchema) richSchema += 3
  if (data.hasDatePublished) richSchema += 3
  const richTip = "Add Article/BlogPosting schema with author and datePublished — Google uses these signals to validate content for AI Overviews."
  breakdown.push({ name: "Schema Richness", score: richSchema, maxScore: 10, status: richSchema >= 7 ? "good" : richSchema > 0 ? "ok" : "bad", detail: `Article schema: ${hasArticleSchema ? "✓" : "✗"}, Author: ${data.hasAuthorSchema ? "✓" : "✗"}, Date published: ${data.hasDatePublished ? "✓" : "✗"}`, improveTip: richTip })

  // 7. Content Uniqueness Indicators (8 pts)
  const dataRegex = /\b\d+[%$]?|\b\d+\s*(million|billion|thousand)\b/gi
  const statsCount = (data.first500Words.match(dataRegex)?.length || 0)
  let uniqueScore = 0
  if (data.wordCount >= 800) uniqueScore += 4
  if (statsCount >= 3) uniqueScore += 4
  const uniqueTip = "Use original data, proprietary statistics, and research-backed claims — unique insights are prioritized in AI Overviews over generic content."
  breakdown.push({ name: "Content Uniqueness", score: uniqueScore, maxScore: 8, status: uniqueScore === 8 ? "good" : uniqueScore > 0 ? "ok" : "bad", detail: `Word count ≥800: ${data.wordCount >= 800 ? "✓" : "✗"}, Stat signals: ${statsCount}`, improveTip: uniqueTip })

  // 8. Heading Keyword Alignment (10 pts)
  let keyAlignScore = 0
  const titleWords = (data.title || "").toLowerCase().split(/\s+/).filter(w => w.length > 3)
  const h1Text = data.headings.find(h => h.tag === "h1")?.text.toLowerCase() || ""
  const h1Overlap = titleWords.filter(w => h1Text.includes(w)).length
  if (h1Overlap >= 2) keyAlignScore += 5
  const h2Texts = data.headings.filter(h => h.tag === "h2").map(h => h.text.toLowerCase()).join(" ")
  const h2Overlap = titleWords.filter(w => h2Texts.includes(w)).length
  if (h2Overlap >= 2) keyAlignScore += 5
  const keyTip = "Ensure H1 and H2 headings contain primary and secondary keywords from the page title for stronger AI Overview keyword alignment."
  breakdown.push({ name: "Heading Keyword Alignment", score: keyAlignScore, maxScore: 10, status: keyAlignScore >= 7 ? "good" : keyAlignScore > 0 ? "ok" : "bad", detail: `H1 overlaps with title: ${h1Overlap} keyword(s). H2s overlap: ${h2Overlap} keyword(s).`, improveTip: keyTip })

  // 9. Summary / TLDR Presence (8 pts)
  const first200 = data.first500Words.split(/\s+/).slice(0, 200).join(" ").toLowerCase()
  const hasSummary = /summary|overview|key takeaways|tldr|in brief|in summary/.test(first200)
  const summaryScore = hasSummary ? 8 : first200.split(/\s+/).length < 60 ? 4 : 0
  const summaryTip = "Add a 'Key Takeaways' or 'Summary' section in the first 200 words — AI Overviews frequently pull from opening summaries."
  breakdown.push({ name: "Summary/TLDR Presence", score: summaryScore, maxScore: 8, status: summaryScore === 8 ? "good" : summaryScore > 0 ? "ok" : "bad", detail: hasSummary ? "Summary/overview section detected near top." : "No summary section detected in opening content.", improveTip: summaryTip })

  // 10. Outbound Authority Links (7 pts)
  const authorityDomains = /\.gov|\.edu|wikipedia\.org|bbc\.com|reuters\.com|nature\.com|pubmed\.ncbi/i
  // We can only approximate by checking if externalLinks > 0; without full link hrefs, award partial
  const authorityScore = data.externalLinks >= 3 ? 7 : data.externalLinks >= 1 ? 4 : 0
  const authorityTip = "Link to .gov, .edu, Wikipedia, or major news domains — Google's AI Overviews favor content that cites high-authority sources."
  breakdown.push({ name: "Authority Outbound Links", score: authorityScore, maxScore: 7, status: authorityScore === 7 ? "good" : authorityScore > 0 ? "ok" : "bad", detail: `${data.externalLinks} outbound link(s) detected.`, improveTip: authorityTip })

  // suppress unused variable warning
  void authorityDomains

  const totalScore = breakdown.reduce((acc, b) => acc + b.score, 0)

  return {
    score: Math.round(totalScore),
    breakdown,
    grade: getGrade(totalScore),
  }
}
