import { GoogleGenAI } from "@google/genai"

export interface AiTip {
  priority: number
  title: string
  description: string
  impact: "high" | "medium" | "low"
}

export async function getAiTips(auditData: unknown): Promise<AiTip[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

  const prompt = `You are an expert SEO and AEO (Answer Engine Optimization) consultant. 
Analyze the provided page data, including the AEO score breakdown, and give exactly 5 actionable fix suggestions ranked by impact.
Focus on both traditional SEO (meta tags, headings) and AEO (helping this page be cited by AI answer engines like ChatGPT, Gemini, and Perplexity).
Be specific with character counts and exact text recommendations (e.g. "Direct answer: [Proposed Sentence]").
Format as JSON array: [{ "priority": 1, "title": "...", "description": "...", "impact": "high|medium|low" }]

Page data: ${JSON.stringify(auditData, null, 2)}`

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  })

  const text = response.text ?? ""

  // Extract JSON from response
  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error("Invalid AI response format")

  return JSON.parse(jsonMatch[0]) as AiTip[]
}
