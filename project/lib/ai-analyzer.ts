import { AnalysisData, CategoryAnalysis } from './analyzer';
import { jsonrepair } from 'jsonrepair';

// Utility: Fuzzy keyword match (for rule-based fallback)
function includesFuzzy(text: string, keyword: string): boolean {
    const pattern = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').replace(/\s+/g, '\\s*');
    return new RegExp(pattern, 'i').test(text);
}

export async function analyzeWithAI(content: string): Promise<AnalysisData> {
    console.log('🤖 Starting AI-powered analysis with Together AI');

    if (!process.env.TOGETHER_API_KEY) {
        console.warn('🔄 Fallback: Together AI API key not found, using rule-based analysis');
        return fallbackAnalysis(content, 'API key missing');
    }

    try {
        // For very large content, we'll process in chunks
        if (content.length > 8000) {
            console.log(`📄 Large content detected (${content.length} chars), processing in chunks`);
            return await analyzeInChunks(content);
        }

        console.log(`🔍 Analyzing content with AI (${content.length} characters)`);
        return await analyzeSingleDocument(content);

    } catch (error) {
        console.error('❌ AI analysis failed, falling back to rule-based analysis:', error);
        console.warn('🔄 Fallback: Rule-based analysis triggered due to AI error');
        return fallbackAnalysis(content, 'AI call error');
    }
}

async function analyzeInChunks(content: string): Promise<AnalysisData> {
    const chunkSize = 6000;
    const overlap = 500;
    const chunks: string[] = [];

    // Split content into overlapping chunks
    for (let i = 0; i < content.length; i += chunkSize) {
        const chunk = content.slice(i, i + chunkSize + overlap);
        chunks.push(chunk);
    }

    if (!chunks.length) {
        console.warn('🔄 Fallback: No content chunks generated, falling back to rule-based analysis');
        return fallbackAnalysis(content, 'Chunking failure');
    }

    console.log(`📊 Processing ${chunks.length} chunks for comprehensive analysis`);

    // Analyze each chunk
    const chunkAnalyses: AnalysisData[] = [];
    for (let i = 0; i < chunks.length; i++) {
        console.log(`🔍 Analyzing chunk ${i + 1}/${chunks.length}`);
        try {
            const analysis = await analyzeSingleDocument(chunks[i]);
            chunkAnalyses.push(analysis);
        } catch (error) {
            console.warn(`⚠️ Chunk ${i + 1} analysis failed, using fallback`);
            console.warn(`🔄 Fallback: Rule-based analysis triggered for chunk ${i + 1}, length: ${chunks[i].length}`);
            chunkAnalyses.push(fallbackAnalysis(chunks[i], `Chunk ${i + 1} AI error`));
        }
    }

    // Merge results from all chunks
    return mergeChunkAnalyses(chunkAnalyses, content);
}

function mergeChunkAnalyses(chunkAnalyses: AnalysisData[], originalContent: string): AnalysisData {
    const numChunks = chunkAnalyses.length || 1;
    const avgScore = Math.round(
        chunkAnalyses.reduce((sum, analysis) => sum + analysis.score, 0) / numChunks
    );

    const riskLevel = avgScore <= 30 ? 'low' : avgScore <= 60 ? 'medium' : 'high';

    const allConcerns = chunkAnalyses.flatMap(chunk => chunk.concerns);
    const allHighlights = chunkAnalyses.flatMap(chunk => chunk.highlights);
    const uniqueConcerns = Array.from(new Set(allConcerns)).slice(0, 8);
    const uniqueHighlights = Array.from(new Set(allHighlights)).slice(0, 5);

    const categories = {
        dataPrivacy: mergeCategoryAnalyses(chunkAnalyses.map(c => c.categories.dataPrivacy)),
        userRights: mergeCategoryAnalyses(chunkAnalyses.map(c => c.categories.userRights)),
        liability: mergeCategoryAnalyses(chunkAnalyses.map(c => c.categories.liability)),
        termination: mergeCategoryAnalyses(chunkAnalyses.map(c => c.categories.termination)),
        contentOwnership: mergeCategoryAnalyses(chunkAnalyses.map(c => c.categories.contentOwnership)),
        disputeResolution: mergeCategoryAnalyses(chunkAnalyses.map(c => c.categories.disputeResolution))
    };

    const summary = `This comprehensive analysis processed ${chunkAnalyses.length} document sections. Overall risk level is ${riskLevel} with ${uniqueConcerns.length} key concerns identified across multiple sections. ${uniqueHighlights.length > 0 ? `The document includes ${uniqueHighlights.length} positive user protection${uniqueHighlights.length === 1 ? '' : 's'}. ` : ''}${avgScore > 70 ? 'Exercise significant caution before accepting these terms.' : avgScore > 40 ? 'Review carefully and consider the implications.' : 'Terms appear reasonable with standard commercial practices.'}`;

    const allRecommendations = chunkAnalyses.flatMap(chunk => chunk.recommendations);
    const uniqueRecommendations = Array.from(new Set(allRecommendations)).slice(0, 5);

    return {
        riskLevel: riskLevel as 'low' | 'medium' | 'high',
        score: avgScore,
        concerns: uniqueConcerns,
        highlights: uniqueHighlights,
        summary,
        categories,
        recommendations: uniqueRecommendations,
        keyMetrics: {
            readabilityScore: Math.round(
                chunkAnalyses.reduce((sum, analysis) => sum + analysis.keyMetrics.readabilityScore, 0) / numChunks
            ),
            lengthAnalysis: getLengthAnalysis(originalContent.trim().split(/\s+/).length),
            lastUpdated: chunkAnalyses.find(c => c.keyMetrics.lastUpdated)?.keyMetrics.lastUpdated || null,
            jurisdiction: chunkAnalyses.find(c => c.keyMetrics.jurisdiction)?.keyMetrics.jurisdiction || null
        }
    };
}

function mergeCategoryAnalyses(categories: CategoryAnalysis[]): CategoryAnalysis {
    const num = categories.length || 1;
    const avgScore = Math.round(
        categories.reduce((sum, cat) => sum + cat.score, 0) / num
    );
    const riskLevel = avgScore <= 30 ? 'low' : avgScore <= 60 ? 'medium' : 'high';
    const allFindings = categories.flatMap(cat => cat.findings);
    const uniqueFindings = Array.from(new Set(allFindings)).slice(0, 3);

    return {
        score: avgScore,
        riskLevel: riskLevel as 'low' | 'medium' | 'high',
        findings: uniqueFindings,
        explanation: categories[0]?.explanation || 'Category analysis completed'
    };
}

async function analyzeSingleDocument(content: string): Promise<AnalysisData> {
    const prompt = `Analyze this terms of service document and provide a comprehensive legal risk assessment. Return ONLY valid JSON in this exact format:

{
  "riskLevel": "low|medium|high",
  "score": 0-100,
  "concerns": ["concern1", "concern2"],
  "highlights": ["positive1", "positive2"],
  "summary": "Executive summary of the analysis",
  "categories": {
    "dataPrivacy": {
      "score": 0-100,
      "riskLevel": "low|medium|high",
      "findings": ["finding1", "finding2"],
      "explanation": "How personal data is collected and used"
    },
    "userRights": {
      "score": 0-100,
      "riskLevel": "low|medium|high", 
      "findings": ["finding1", "finding2"],
      "explanation": "User rights including refunds and account control"
    },
    "liability": {
      "score": 0-100,
      "riskLevel": "low|medium|high",
      "findings": ["finding1", "finding2"], 
      "explanation": "Liability limitations and warranty disclaimers"
    },
    "termination": {
      "score": 0-100,
      "riskLevel": "low|medium|high",
      "findings": ["finding1", "finding2"],
      "explanation": "Account termination policies and procedures"
    },
    "contentOwnership": {
      "score": 0-100,
      "riskLevel": "low|medium|high",
      "findings": ["finding1", "finding2"],
      "explanation": "Rights to user-generated content"
    },
    "disputeResolution": {
      "score": 0-100,
      "riskLevel": "low|medium|high",
      "findings": ["finding1", "finding2"],
      "explanation": "How disputes are resolved"
    }
  },
  "recommendations": ["recommendation1", "recommendation2"],
  "keyMetrics": {
    "readabilityScore": 0-100,
    "lengthAnalysis": "Short|Medium|Long description",
    "lastUpdated": "date or null",
    "jurisdiction": "location or null"
  }
}

Document to analyze:
${content}`;

    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
            messages: [
                {
                    role: "system",
                    content: "You are a legal expert specializing in terms of service analysis. Your entire response MUST be a single valid JSON object and nothing else. Do not include any prose or extra text. Analyze the COMPLETE document provided - do not truncate or summarize the input. Provide detailed, accurate analysis of the entire document in the requested JSON format."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.2,
            max_tokens: 4000
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Together AI API Error:', response.status, errorText);
        throw new Error(`Together AI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;
    if (!aiResponse) {
        throw new Error('No response from AI');
    }

    console.log('Successfully received AI response');

    // Parse the JSON response robustly
    let analysisData;
    try {
        analysisData = JSON.parse(jsonrepair(aiResponse));
    } catch (parseError) {
        console.error('Failed to parse AI response as JSON:', aiResponse);
        throw new Error('AI returned invalid JSON response');
    }

    // Validate and ensure all required fields are present
    return validateAnalysisData(analysisData);
}

function validateAnalysisData(data: any): AnalysisData {
    return {
        riskLevel: data.riskLevel || 'medium',
        score: Math.min(100, Math.max(0, data.score || 50)),
        concerns: Array.isArray(data.concerns) ? data.concerns.slice(0, 8) : [],
        highlights: Array.isArray(data.highlights) ? data.highlights.slice(0, 5) : [],
        summary: data.summary || 'Analysis completed using AI-powered assessment.',
        categories: {
            dataPrivacy: validateCategory(data.categories?.dataPrivacy, 'Data Privacy'),
            userRights: validateCategory(data.categories?.userRights, 'User Rights'),
            liability: validateCategory(data.categories?.liability, 'Liability'),
            termination: validateCategory(data.categories?.termination, 'Termination'),
            contentOwnership: validateCategory(data.categories?.contentOwnership, 'Content Ownership'),
            disputeResolution: validateCategory(data.categories?.disputeResolution, 'Dispute Resolution')
        },
        recommendations: Array.isArray(data.recommendations) ? data.recommendations.slice(0, 5) : [
            'Review the full document carefully',
            'Consider consulting legal advice for high-risk terms',
            'Keep a copy of the terms for your records'
        ],
        keyMetrics: {
            readabilityScore: Math.min(100, Math.max(0, data.keyMetrics?.readabilityScore || 60)),
            lengthAnalysis: data.keyMetrics?.lengthAnalysis || 'Standard length document',
            lastUpdated: data.keyMetrics?.lastUpdated || null,
            jurisdiction: data.keyMetrics?.jurisdiction || null
        }
    };
}

function validateCategory(category: any, categoryName: string): CategoryAnalysis {
    const explanations = {
        'Data Privacy': 'Analyzes how your personal information is collected, used, and protected',
        'User Rights': 'Examines your rights as a user, including refunds, account control, and legal recourse',
        'Liability': 'Reviews who is responsible for damages and what protections exist',
        'Termination': 'Covers how and when your account can be terminated',
        'Content Ownership': 'Determines who owns the content you create or upload',
        'Dispute Resolution': 'Outlines how conflicts between you and the service are resolved'
    };

    return {
        score: Math.min(100, Math.max(0, category?.score || 50)),
        riskLevel: category?.riskLevel || 'medium',
        findings: Array.isArray(category?.findings) ? category.findings.slice(0, 3) : [],
        explanation: category?.explanation || explanations[categoryName as keyof typeof explanations] || ''
    };
}

/**
 * Rule-based fallback analysis. Reason is for logging/auditing.
 */
function fallbackAnalysis(content: string, reason: string = 'Unspecified'): AnalysisData {
    console.warn(`🔄 Fallback: Entered rule-based analysis. Reason: ${reason}. Content length: ${content.length}, word count: ${content.trim().split(/\s+/).length}`);

    const wordCount = content.trim().split(/\s+/).length;
    const lowerContent = content.toLowerCase();

    const riskFactors = [
        { keyword: 'sell personal data', weight: 25, category: 'dataPrivacy' },
        { keyword: 'unlimited liability', weight: 20, category: 'liability' },
        { keyword: 'terminate without cause', weight: 18, category: 'termination' },
        { keyword: 'no refund', weight: 15, category: 'userRights' },
        { keyword: 'indemnify', weight: 18, category: 'liability' },
        { keyword: 'waive class action', weight: 20, category: 'userRights' },
        { keyword: 'perpetual rights', weight: 22, category: 'contentOwnership' },
        { keyword: 'company-chosen arbitration', weight: 17, category: 'disputeResolution' },
        { keyword: 'track across websites', weight: 19, category: 'dataPrivacy' },
        { keyword: 'forfeit paid fees', weight: 16, category: 'termination' }
    ];

    const positiveFactors = [
        { keyword: 'gdpr compliant', weight: 15, category: 'dataPrivacy' },
        { keyword: 'money back guarantee', weight: 18, category: 'userRights' },
        { keyword: 'data encryption', weight: 12, category: 'dataPrivacy' },
        { keyword: 'advance notice', weight: 14, category: 'termination' },
        { keyword: 'retain ownership', weight: 16, category: 'contentOwnership' }
    ];

    let totalRiskScore = 0;
    let totalPositiveScore = 0;
    const concerns: string[] = [];
    const highlights: string[] = [];
    const concernsByCategory: Record<string, string[]> = {
        dataPrivacy: [],
        userRights: [],
        liability: [],
        termination: [],
        contentOwnership: [],
        disputeResolution: []
    };
    const categoryScores = {
        dataPrivacy: 0,
        userRights: 0,
        liability: 0,
        termination: 0,
        contentOwnership: 0,
        disputeResolution: 0
    };

    riskFactors.forEach(factor => {
        if (includesFuzzy(lowerContent, factor.keyword)) {
            totalRiskScore += factor.weight;
            categoryScores[factor.category as keyof typeof categoryScores] += factor.weight;
            const message = `Contains "${factor.keyword}" clause`;
            concerns.push(message);
            concernsByCategory[factor.category].push(message);
        }
    });

    positiveFactors.forEach(factor => {
        if (includesFuzzy(lowerContent, factor.keyword)) {
            totalPositiveScore += factor.weight;
            highlights.push(`Includes "${factor.keyword}" protection`);
        }
    });

    // Calculate final score
    const baseScore = Math.min(85, totalRiskScore);
    const adjustedScore = Math.max(5, baseScore - totalPositiveScore / 2);
    const score = Math.round(adjustedScore);
    const riskLevel = score <= 30 ? 'low' : score <= 60 ? 'medium' : 'high';

    const createCategoryAnalysis = (categoryScore: number, categoryName: string): CategoryAnalysis => {
        const normalizedScore = Math.min(100, categoryScore * 2);
        const catRiskLevel = normalizedScore <= 30 ? 'low' : normalizedScore <= 60 ? 'medium' : 'high';

        return {
            score: Math.round(normalizedScore),
            riskLevel: catRiskLevel,
            findings: concernsByCategory[categoryName] || [],
            explanation: `Analysis of ${categoryName.replace(/([A-Z])/g, ' $1').toLowerCase()} terms and conditions`
        };
    };

    return {
        riskLevel: riskLevel as 'low' | 'medium' | 'high',
        score,
        concerns: concerns.slice(0, 6),
        highlights: highlights.slice(0, 4),
        summary: `This document has been analyzed using enhanced rule-based analysis. Risk level is ${riskLevel} with ${concerns.length} concerns identified and ${highlights.length} positive aspects found. ${score > 70 ? 'Exercise caution before accepting these terms.' : score > 40 ? 'Review carefully and consider the trade-offs.' : 'Terms appear reasonable for most users.'}`,
        categories: {
            dataPrivacy: createCategoryAnalysis(categoryScores.dataPrivacy, 'dataPrivacy'),
            userRights: createCategoryAnalysis(categoryScores.userRights, 'userRights'),
            liability: createCategoryAnalysis(categoryScores.liability, 'liability'),
            termination: createCategoryAnalysis(categoryScores.termination, 'termination'),
            contentOwnership: createCategoryAnalysis(categoryScores.contentOwnership, 'contentOwnership'),
            disputeResolution: createCategoryAnalysis(categoryScores.disputeResolution, 'disputeResolution')
        },
        recommendations: [
            score > 70 ? 'Consider seeking legal advice before accepting these terms' : 'Review the full document carefully',
            concerns.length > 3 ? 'Pay special attention to the identified risk areas' : 'The terms appear reasonable',
            'Keep a copy of the terms for your records',
            totalPositiveScore > 0 ? 'Note the positive user protections included' : 'Look for alternative services with better user protections'
        ],
        keyMetrics: {
            readabilityScore: Math.max(20, Math.min(100, 100 - Math.floor(wordCount / 25))),
            lengthAnalysis: getLengthAnalysis(wordCount),
            lastUpdated: extractLastUpdated(content),
            jurisdiction: extractJurisdiction(content)
        }
    };
}

function getLengthAnalysis(wordCount: number): string {
    if (wordCount < 800) return 'Short - May lack important details';
    if (wordCount < 2500) return 'Medium - Standard length';
    if (wordCount < 5000) return 'Long - Comprehensive coverage';
    return 'Very Long - Extensive legal document';
}

function extractLastUpdated(content: string): string | null {
    const datePatterns = [
        /last updated:?\s*([^.\n]+)/i,
        /effective date:?\s*([^.\n]+)/i,
        /updated on:?\s*([^.\n]+)/i
    ];
    for (const pattern of datePatterns) {
        const match = content.match(pattern);
        if (match) return match[1].trim();
    }
    return null;
}

function extractJurisdiction(content: string): string | null {
    const jurisdictionPatterns = [
        /governed by.*laws of ([^,.\n]+)/i,
        /jurisdiction of ([^,.\n]+)/i,
        /courts of ([^,.\n]+)/i
    ];
    for (const pattern of jurisdictionPatterns) {
        const match = content.match(pattern);
        if (match) return match[1].trim();
    }
    return null;
}

// Optional: Export helpers for reuse
export { fallbackAnalysis, extractLastUpdated, extractJurisdiction };
