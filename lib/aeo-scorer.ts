import { ScrapedData } from "./scraper"

export interface AEOResult {
  score: number
  breakdown: {
    name: string
    score: number
    maxScore: number
    status: "good" | "ok" | "bad"
    detail: string
    tip: string
    improveTip: string
  }[]
  grade: "A+" | "A" | "B" | "C" | "D" | "F"
}

function getGrade(score: number): AEOResult["grade"] {
  if (score >= 90) return "A+"
  if (score >= 80) return "A"
  if (score >= 70) return "B"
  if (score >= 50) return "C"
  if (score >= 30) return "D"
  return "F"
}

export function calculateAEOScore(data: ScrapedData): AEOResult {
  const breakdown: AEOResult["breakdown"] = []

  // 1. FAQ Schema (15 pts)
  let faqScore = 0
  let faqDetail = "No schema markup found."
  if (data.schemas.some(s => s.includes("FAQPage"))) {
    faqScore = 15
    faqDetail = "FAQPage schema detected."
  } else if (data.schemas.length > 0) {
    faqScore = 5
    faqDetail = "Other schema found, but no FAQPage."
  }
  const faqTip = "Add JSON-LD FAQPage schema to help AI engines extract direct answers to common questions."
  breakdown.push({ name: "FAQ Schema", score: faqScore, maxScore: 15, status: faqScore === 15 ? "good" : faqScore > 0 ? "ok" : "bad", detail: faqDetail, tip: faqTip, improveTip: faqTip })

  // 2. Concise Answer Blocks (12 pts)
  let answerBlockScore = 0
  let answerBlockDetail = "No answer blocks found after headings."
  if (data.h2h3Paragraphs.length > 0) {
    const avgLength = data.h2h3Paragraphs.reduce((acc, p) => acc + p.split(/\s+/).length, 0) / data.h2h3Paragraphs.length
    if (avgLength <= 40) answerBlockScore = 12
    else if (avgLength <= 60) answerBlockScore = 8
    else if (avgLength <= 80) answerBlockScore = 4
    answerBlockDetail = `Average answer block length: ${Math.round(avgLength)} words.`
  }
  const answerTip = "Keep the first paragraph after subheadings under 40 words for better AI extraction."
  breakdown.push({ name: "Concise Answer Blocks", score: answerBlockScore, maxScore: 12, status: answerBlockScore >= 8 ? "good" : answerBlockScore > 0 ? "ok" : "bad", detail: answerBlockDetail, tip: answerTip, improveTip: answerTip })

  // 3. Question-First Headings (12 pts)
  const questionWords = ["who", "what", "when", "where", "why", "how", "can", "does", "is", "are", "should", "will"]
  const questionHeadings = data.headings.filter(h =>
    (h.tag === "h2" || h.tag === "h3") &&
    questionWords.some(word => h.text.toLowerCase().startsWith(word))
  )
  const h2h3Count = data.headings.filter(h => h.tag === "h2" || h.tag === "h3").length
  const questionPercent = h2h3Count > 0 ? (questionHeadings.length / h2h3Count) * 100 : 0
  let qHeadingScore = 0
  if (questionPercent >= 40) qHeadingScore = 12
  else if (questionPercent >= 20) qHeadingScore = 8
  else if (questionPercent >= 10) qHeadingScore = 4
  const qTip = "Structure subheadings as questions (Who, What, How) to match AI query patterns."
  breakdown.push({ name: "Question-First Headings", score: qHeadingScore, maxScore: 12, status: qHeadingScore >= 8 ? "good" : qHeadingScore > 0 ? "ok" : "bad", detail: `${Math.round(questionPercent)}% of subheadings are questions.`, tip: qTip, improveTip: qTip })

  // 4. Entity-First Definitions (10 pts)
  const defPatterns = ["is a", "is an", "is the", "refers to", "is defined as"]
  const defCount = defPatterns.reduce((acc, pattern) => {
    const regex = new RegExp(`\\b${pattern}\\b`, "gi")
    return acc + (data.first500Words.match(regex)?.length || 0)
  }, 0)
  const defScore = defCount >= 3 ? 10 : defCount >= 1 ? 5 : 0
  const defTip = "Use '[Entity] is a [category]' patterns early in the content to define core topics."
  breakdown.push({ name: "Entity-First Definitions", score: defScore, maxScore: 10, status: defScore === 10 ? "good" : defScore > 0 ? "ok" : "bad", detail: `Found ${defCount} definition-style sentence patterns.`, tip: defTip, improveTip: defTip })

  // 5. Data-Backed Claims (10 pts)
  const dataRegex = /\d+%|\$\d|\d+ million|\d+ billion|according to|study|research|report|survey/gi
  const dataClaimsCount = (data.first500Words.match(dataRegex)?.length || 0)
  const claimScore = dataClaimsCount >= 5 ? 10 : dataClaimsCount >= 3 ? 7 : dataClaimsCount >= 1 ? 4 : 0
  const claimTip = "Include numbers, percentages, and citations to increase content authority for AI."
  breakdown.push({ name: "Data-Backed Claims", score: claimScore, maxScore: 10, status: claimScore >= 7 ? "good" : claimScore > 0 ? "ok" : "bad", detail: `Detected ${dataClaimsCount} statistics or authority citations.`, tip: claimTip, improveTip: claimTip })

  // 6. Structured Content (8 pts)
  let structScore = 0
  if (data.hasLists) structScore += 4
  if (data.hasTables) structScore += 4
  const structTip = "Use <ul>, <ol>, and <table> tags. AI models prefer structured data for comparison and extraction."
  breakdown.push({ name: "Structured Content", score: structScore, maxScore: 8, status: structScore === 8 ? "good" : structScore > 0 ? "ok" : "bad", detail: `${data.hasLists ? "Lists" : "No lists"} and ${data.hasTables ? "tables" : "no tables"} detected.`, tip: structTip, improveTip: structTip })

  // 7. HowTo / Step Schema (8 pts)
  let stepScore = 0
  if (data.schemas.some(s => s.includes("HowTo"))) {
    stepScore = 8
  } else if (data.hasLists) {
    stepScore = 4
  }
  const stepTip = "Add HowTo JSON-LD schema or numbered lists for procedural content."
  breakdown.push({ name: "HowTo or Step Schema", score: stepScore, maxScore: 8, status: stepScore === 8 ? "good" : stepScore > 0 ? "ok" : "bad", detail: stepScore === 8 ? "HowTo schema detected." : stepScore === 4 ? "Procedural lists found." : "No steps or HowTo schema.", tip: stepTip, improveTip: stepTip })

  // 8. Content Depth (8 pts)
  let depthScore = 0
  if (data.wordCount >= 1500) depthScore = 8
  else if (data.wordCount >= 800) depthScore = 6
  else if (data.wordCount >= 300) depthScore = 3
  const depthTip = "Longer, comprehensive content (800+ words) provides more 'surface area' for AI citations."
  breakdown.push({ name: "Content Depth", score: depthScore, maxScore: 8, status: depthScore >= 6 ? "good" : depthScore > 0 ? "ok" : "bad", detail: `Word count: ${data.wordCount}.`, tip: depthTip, improveTip: depthTip })

  // 9. Source Attribution (7 pts)
  let sourceScore = 0
  if (data.externalLinks >= 5) sourceScore = 7
  else if (data.externalLinks >= 3) sourceScore = 5
  else if (data.externalLinks >= 1) sourceScore = 3
  const sourceTip = "Link to authoritative external sources (5+) to build trust with answer engines."
  breakdown.push({ name: "Source Attribution", score: sourceScore, maxScore: 7, status: sourceScore >= 5 ? "good" : sourceScore > 0 ? "ok" : "bad", detail: `${data.externalLinks} external source links found.`, tip: sourceTip, improveTip: sourceTip })

  // 10. Meta + Title Structure (10 pts)
  let metaScore = 0
  const titleQWords = ["how", "what", "why", "who", "guide", "tutorial", "tips"]
  if (data.title && titleQWords.some(w => data.title?.toLowerCase().includes(w))) metaScore += 5
  if (data.metaDescription && (data.metaDescription.includes(".") || data.metaDescription.includes("!"))) metaScore += 5
  const metaTip = "Include target questions in titles and direct answer sentences in meta descriptions."
  breakdown.push({ name: "Meta & Title Structure", score: metaScore, maxScore: 10, status: metaScore === 10 ? "good" : metaScore > 0 ? "ok" : "bad", detail: "Evaluated title keywords and meta description format.", tip: metaTip, improveTip: metaTip })

  const totalScore = breakdown.reduce((acc, b) => acc + b.score, 0)

  return {
    score: Math.round(totalScore),
    breakdown,
    grade: getGrade(totalScore),
  }
}
