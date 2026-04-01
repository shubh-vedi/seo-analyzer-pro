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
  }[]
  grade: "A+" | "A" | "B" | "C" | "D" | "F"
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
  breakdown.push({
    name: "FAQ Schema",
    score: faqScore,
    maxScore: 15,
    status: faqScore === 15 ? "good" : faqScore > 0 ? "ok" : "bad",
    detail: faqDetail,
    tip: "Add JSON-LD FAQPage schema to help AI engines extract direct answers to common questions."
  })

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
  breakdown.push({
    name: "Concise Answer Blocks",
    score: answerBlockScore,
    maxScore: 12,
    status: answerBlockScore >= 8 ? "good" : answerBlockScore > 0 ? "ok" : "bad",
    detail: answerBlockDetail,
    tip: "Keep the first paragraph after subheadings under 40 words for better AI extraction."
  })

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
  breakdown.push({
    name: "Question-First Headings",
    score: qHeadingScore,
    maxScore: 12,
    status: qHeadingScore >= 8 ? "good" : qHeadingScore > 0 ? "ok" : "bad",
    detail: `${Math.round(questionPercent)}% of subheadings are questions.`,
    tip: "Structure subheadings as questions (Who, What, How) to match AI query patterns."
  })

  // 4. Entity-First Definitions (10 pts)
  const defPatterns = ["is a", "is an", "is the", "refers to", "is defined as"]
  const defCount = defPatterns.reduce((acc, pattern) => {
    const regex = new RegExp(`\\b${pattern}\\b`, "gi")
    return acc + (data.first500Words.match(regex)?.length || 0)
  }, 0)
  let defScore = defCount >= 3 ? 10 : defCount >= 1 ? 5 : 0
  breakdown.push({
    name: "Entity-First Definitions",
    score: defScore,
    maxScore: 10,
    status: defScore === 10 ? "good" : defScore > 0 ? "ok" : "bad",
    detail: `Found ${defCount} definition-style sentence patterns.`,
    tip: "Use '[Entity] is a [category]' patterns early in the content to define core topics."
  })

  // 5. Data-Backed Claims (10 pts)
  const dataRegex = /\d+%|\$\d|\d+ million|\d+ billion|according to|study|research|report|survey/gi
  const dataClaimsCount = (data.first500Words.match(dataRegex)?.length || 0)
  let claimScore = dataClaimsCount >= 5 ? 10 : dataClaimsCount >= 3 ? 7 : dataClaimsCount >= 1 ? 4 : 0
  breakdown.push({
    name: "Data-Backed Claims",
    score: claimScore,
    maxScore: 10,
    status: claimScore >= 7 ? "good" : claimScore > 0 ? "ok" : "bad",
    detail: `Detected ${dataClaimsCount} statistics or authority citations.`,
    tip: "Include numbers, percentages, and citations to increase content authority for AI."
  })

  // 6. Structured Content (8 pts)
  let structScore = 0
  if (data.hasLists) structScore += 4
  if (data.hasTables) structScore += 4
  breakdown.push({
    name: "Structured Content",
    score: structScore,
    maxScore: 8,
    status: structScore === 8 ? "good" : structScore > 0 ? "ok" : "bad",
    detail: `${data.hasLists ? "Lists" : "No lists"} and ${data.hasTables ? "tables" : "no tables"} detected.`,
    tip: "Use <ul>, <ol>, and <table> tags. AI models prefer structured data for comparison and extraction."
  })

  // 7. HowTo / Step Schema (8 pts)
  let stepScore = 0
  if (data.schemas.some(s => s.includes("HowTo"))) {
    stepScore = 8
  } else if (data.hasLists) {
    stepScore = 4
  }
  breakdown.push({
    name: "HowTo or Step Schema",
    score: stepScore,
    maxScore: 8,
    status: stepScore === 8 ? "good" : stepScore > 0 ? "ok" : "bad",
    detail: stepScore === 8 ? "HowTo schema detected." : stepScore === 4 ? "Procedural lists found." : "No steps or HowTo schema.",
    tip: "Add HowTo JSON-LD schema or numbered lists for procedural content."
  })

  // 8. Content Depth (8 pts)
  let depthScore = 0
  if (data.wordCount >= 1500) depthScore = 8
  else if (data.wordCount >= 800) depthScore = 6
  else if (data.wordCount >= 300) depthScore = 3
  breakdown.push({
    name: "Content Depth",
    score: depthScore,
    maxScore: 8,
    status: depthScore >= 6 ? "good" : depthScore > 0 ? "ok" : "bad",
    detail: `Word count: ${data.wordCount}.`,
    tip: "Longer, comprehensive content (800+ words) provides more 'surface area' for AI citations."
  })

  // 9. Source Attribution (7 pts)
  let sourceScore = 0
  if (data.externalLinks >= 5) sourceScore = 7
  else if (data.externalLinks >= 3) sourceScore = 5
  else if (data.externalLinks >= 1) sourceScore = 3
  breakdown.push({
    name: "Source Attribution",
    score: sourceScore,
    maxScore: 7,
    status: sourceScore >= 5 ? "good" : sourceScore > 0 ? "ok" : "bad",
    detail: `${data.externalLinks} external source links found.`,
    tip: "Link to authoritative external sources (5+) to build trust with answer engines."
  })

  // 10. Meta + Title Structure (10 pts)
  let metaScore = 0
  const titleQWords = ["how", "what", "why", "who", "guide", "tutorial", "tips"]
  if (data.title && titleQWords.some(w => data.title?.toLowerCase().includes(w))) metaScore += 5
  if (data.metaDescription && (data.metaDescription.includes(".") || data.metaDescription.includes("!"))) metaScore += 5
  breakdown.push({
    name: "Meta & Title Structure",
    score: metaScore,
    maxScore: 10,
    status: metaScore === 10 ? "good" : metaScore > 0 ? "ok" : "bad",
    detail: "Evaluated title keywords and meta description format.",
    tip: "Include target questions in titles and direct answer sentences in meta descriptions."
  })

  const totalScore = breakdown.reduce((acc, b) => acc + b.score, 0)
  
  let grade: AEOResult["grade"] = "F"
  if (totalScore >= 90) grade = "A+"
  else if (totalScore >= 80) grade = "A"
  else if (totalScore >= 70) grade = "B"
  else if (totalScore >= 60) grade = "C"
  else if (totalScore >= 50) grade = "D"

  return {
    score: Math.round(totalScore),
    breakdown,
    grade
  }
}
