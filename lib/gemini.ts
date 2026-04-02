import { GoogleGenAI } from "@google/genai"

export interface AdvancedAiTip {
  priority: number
  title: string
  description: string
  impact: "high" | "medium" | "low"
  framework: "AEO" | "GEO" | "AIO" | "GGL"
  howToFix: string
  whyItMatters: string
  codeBlock?: string
}

export async function getAiTips(auditData: unknown): Promise<AdvancedAiTip[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

  const prompt = `You are a Principal ContentOptima Architect specializing in AI Search (AEO, GEO, AIO) and traditional SEO (GGL).
Analyze the provided page/text data.
Generate exactly 6 actionable Optimization Suggestions ranked by impact priority (1 is highest).
Cover different frameworks: AEO (Answer Engine Optimization), GEO (Generative Engine Optimization), AIO (AI Overview Optimization), GGL (Google Search E-E-A-T).

For each suggestion, provide:
- priority: Int (1-6)
- title: Brief hook
- description: The core issue
- impact: "high" | "medium" | "low"
- framework: "AEO" | "GEO" | "AIO" | "GGL"
- howToFix: Step by step action plan
- whyItMatters: Why algorithms care about this
- codeBlock: (Optional) If suggesting schema markup, optimized headings, or a direct AEO Answer Paragraph, wrap it here exactly as copy-pasteable text/code.

Format as a strict JSON array matching this exact schema: [{ "priority": 1, ... }]

Page data: ${JSON.stringify(auditData, null, 2)}`

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  })

  const text = response.text ?? ""

  // Extract JSON from response
  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error("Invalid AI response format")

  return JSON.parse(jsonMatch[0]) as AdvancedAiTip[]
}
