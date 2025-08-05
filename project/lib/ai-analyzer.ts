import { AnalysisData, CategoryAnalysis } from './analyzer';

// Chunking configuration
const CHUNK_SIZE = 8000; // Characters per chunk
const CHUNK_OVERLAP = 500; // Overlap between chunks to maintain context

// Together AI configuration
const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;
const TOGETHER_ENDPOINT = 'https://api.together.xyz/v1/chat/completions';

interface ChunkAnalysis {
  riskLevel: 'low' | 'medium' | 'high';
  score: number;
  concerns: string[];
  highlights: string[];
  categories: {
    [key: string]: {
      score: number;
      riskLevel: 'low' | 'medium' | 'high';
      findings: string[];
    };
  };
  recommendations: string[];
}

export async function analyzeWithAI(content: string): Promise<AnalysisData> {
  // Check if Together AI key is available
  if (!TOGETHER_API_KEY) {
    console.error('Together AI API key not found! Please set TOGETHER_API_KEY environment variable.');
    throw new Error('AI analysis requires Together AI API key. Please check your environment configuration.');
  }

  // Check if content needs chunking
  if (content.length > CHUNK_SIZE) {
    console.log(`Content is ${content.length} characters, processing in chunks`);
    return analyzeInChunks(content);
  }

  try {
    console.log('🤖 Using Together AI API for real AI analysis');
    return await analyzeSingleDocument(content);
  } catch (error) {
    console.error('❌ AI Analysis Error:', error);
    throw new Error(`AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function analyzeInChunks(content: string): Promise<AnalysisData> {
  try {
    const chunks = createChunks(content);
    console.log(`Processing ${chunks.length} chunks`);
    
    const chunkAnalyses: ChunkAnalysis[] = [];
    
    // Analyze each chunk
    for (let i = 0; i < chunks.length; i++) {
      console.log(`Analyzing chunk ${i + 1}/${chunks.length}`);
      try {
        const chunkAnalysis = await analyzeChunk(chunks[i], i + 1, chunks.length);
        chunkAnalyses.push(chunkAnalysis);
        
        // Add delay between requests to avoid rate limiting
        if (i < chunks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`Error analyzing chunk ${i + 1}:`, error);
        // Continue with other chunks even if one fails
      }
    }
    
    if (chunkAnalyses.length === 0) {
      throw new Error('All chunk analyses failed');
    }
    
    // Merge chunk analyses
    return mergeChunkAnalyses(chunkAnalyses, content);
    
  } catch (error) {
    console.error('Chunked analysis failed, falling back to rule-based analysis:', error);
    return fallbackAnalysis(content);
  }
}

function createChunks(content: string): string[] {
  const chunks: string[] = [];
  let start = 0;
  
  while (start < content.length) {
    let end = start + CHUNK_SIZE;
    
    // If this isn't the last chunk, try to break at a sentence or paragraph
    if (end < content.length) {
      // Look for paragraph break first
      const paragraphBreak = content.lastIndexOf('\n\n', end);
      if (paragraphBreak > start + CHUNK_SIZE / 2) {
        end = paragraphBreak;
      } else {
        // Look for sentence break
        const sentenceBreak = content.lastIndexOf('. ', end);
        if (sentenceBreak > start + CHUNK_SIZE / 2) {
          end = sentenceBreak + 1;
        }
      }
    }
    
    chunks.push(content.slice(start, end));
    start = end - CHUNK_OVERLAP; // Overlap to maintain context
  }
  
  return chunks;
}

async function analyzeChunk(chunk: string, chunkNumber: number, totalChunks: number): Promise<ChunkAnalysis> {
  const prompt = `
You are analyzing chunk ${chunkNumber} of ${totalChunks} from a terms of service document. Focus on identifying specific risks and positive aspects in this section.

Document chunk to analyze:
${chunk}

Provide analysis in this JSON format:
{
  "riskLevel": "low|medium|high",
  "score": 0-100,
  "concerns": ["specific concerns found in this chunk"],
  "highlights": ["positive aspects found in this chunk"],
  "categories": {
    "dataPrivacy": {"score": 0-100, "riskLevel": "low|medium|high", "findings": ["findings"]},
    "userRights": {"score": 0-100, "riskLevel": "low|medium|high", "findings": ["findings"]},
    "liability": {"score": 0-100, "riskLevel": "low|medium|high", "findings": ["findings"]},
    "termination": {"score": 0-100, "riskLevel": "low|medium|high", "findings": ["findings"]},
    "contentOwnership": {"score": 0-100, "riskLevel": "low|medium|high", "findings": ["findings"]},
    "disputeResolution": {"score": 0-100, "riskLevel": "low|medium|high", "findings": ["findings"]}
  },
  "recommendations": ["recommendations based on this chunk"]
}

Focus on what's actually present in this chunk. If a category isn't covered in this chunk, give it a neutral score of 50.
`;

  const response = await fetch(TOGETHER_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOGETHER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
      messages: [
        {
          role: "system",
          content: "You are a legal expert analyzing a portion of a terms of service document. Provide specific analysis for the content in this chunk."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 2000
    })
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  const aiResponse = data.choices[0]?.message?.content;
  
  if (!aiResponse) {
    throw new Error('No response from AI');
  }

  // Parse JSON response
  const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
  const jsonString = jsonMatch ? jsonMatch[0] : aiResponse;
  return JSON.parse(jsonString);
}

function mergeChunkAnalyses(chunkAnalyses: ChunkAnalysis[], originalContent: string): AnalysisData {
  // Calculate weighted averages and merge findings
  const totalChunks = chunkAnalyses.length;
  
  // Merge scores (weighted average)
  const avgScore = Math.round(
    chunkAnalyses.reduce((sum, chunk) => sum + chunk.score, 0) / totalChunks
  );
  
  // Determine overall risk level based on highest risk found
  const riskLevels = chunkAnalyses.map(chunk => chunk.riskLevel);
  const overallRiskLevel = riskLevels.includes('high') ? 'high' : 
                          riskLevels.includes('medium') ? 'medium' : 'low';
  
  // Merge concerns and highlights (deduplicate)
  const allConcerns = chunkAnalyses.flatMap(chunk => chunk.concerns);
  const allHighlights = chunkAnalyses.flatMap(chunk => chunk.highlights);
  const uniqueConcerns = [...new Set(allConcerns)].slice(0, 8);
  const uniqueHighlights = [...new Set(allHighlights)].slice(0, 5);
  
  // Merge category analyses
  const categoryNames = ['dataPrivacy', 'userRights', 'liability', 'termination', 'contentOwnership', 'disputeResolution'];
  const mergedCategories: any = {};
  
  categoryNames.forEach(categoryName => {
    const categoryData = chunkAnalyses.map(chunk => chunk.categories[categoryName]).filter(Boolean);
    
    if (categoryData.length > 0) {
      const avgCategoryScore = Math.round(
        categoryData.reduce((sum, cat) => sum + cat.score, 0) / categoryData.length
      );
      
      const categoryRiskLevels = categoryData.map(cat => cat.riskLevel);
      const categoryRiskLevel = categoryRiskLevels.includes('high') ? 'high' : 
                               categoryRiskLevels.includes('medium') ? 'medium' : 'low';
      
      const allFindings = categoryData.flatMap(cat => cat.findings);
      const uniqueFindings = [...new Set(allFindings)].slice(0, 3);
      
      mergedCategories[categoryName] = {
        score: avgCategoryScore,
        riskLevel: categoryRiskLevel,
        findings: uniqueFindings,
        explanation: getCategoryExplanation(categoryName)
      };
    } else {
      mergedCategories[categoryName] = {
        score: 50,
        riskLevel: 'medium' as const,
        findings: [],
        explanation: getCategoryExplanation(categoryName)
      };
    }
  });
  
  // Merge recommendations
  const allRecommendations = chunkAnalyses.flatMap(chunk => chunk.recommendations);
  const uniqueRecommendations = [...new Set(allRecommendations)].slice(0, 5);
  
  // Generate summary
  const summary = `This comprehensive document analysis processed ${totalChunks} sections totaling ${originalContent.length} characters. Overall risk level is ${overallRiskLevel} with ${uniqueConcerns.length} key concerns identified across multiple sections. ${uniqueHighlights.length > 0 ? `The document includes ${uniqueHighlights.length} positive user protections. ` : ''}${overallRiskLevel === 'high' ? 'Exercise significant caution before accepting these terms.' : overallRiskLevel === 'medium' ? 'Review carefully and consider the trade-offs.' : 'Terms appear reasonable for most users.'}`;
  
  return {
    riskLevel: overallRiskLevel,
    score: avgScore,
    concerns: uniqueConcerns,
    highlights: uniqueHighlights,
    summary,
    categories: mergedCategories,
    recommendations: uniqueRecommendations.length > 0 ? uniqueRecommendations : [
      'Review the complete document carefully',
      'Pay attention to sections with higher risk scores',
      'Consider the cumulative impact of all terms',
      'Keep a copy of the terms for your records'
    ],
    keyMetrics: {
      readabilityScore: calculateReadabilityScore(originalContent),
      lengthAnalysis: getLengthAnalysis(originalContent.trim().split(/\s+/).length),
      lastUpdated: extractLastUpdated(originalContent),
      jurisdiction: extractJurisdiction(originalContent)
    }
  };
}

function getCategoryExplanation(categoryName: string): string {
  const explanations = {
    dataPrivacy: 'Analyzes how your personal information is collected, used, and protected',
    userRights: 'Examines your rights as a user, including refunds, account control, and legal recourse',
    liability: 'Reviews who is responsible for damages and what protections exist',
    termination: 'Covers how and when your account can be terminated',
    contentOwnership: 'Determines who owns the content you create or upload',
    disputeResolution: 'Outlines how conflicts between you and the service are resolved'
  };
  return explanations[categoryName as keyof typeof explanations] || '';
}

function calculateReadabilityScore(content: string): number {
  const words = content.trim().split(/\s+/).length;
  const sentences = content.split(/[.!?]+/).length - 1;
  const avgWordsPerSentence = words / Math.max(sentences, 1);
  return Math.max(0, Math.min(100, 100 - (avgWordsPerSentence - 15) * 2));
}

function getLengthAnalysis(wordCount: number): string {
  if (wordCount < 500) return 'Very Short - May lack important details';
  if (wordCount < 1500) return 'Short - Covers basic terms';
  if (wordCount < 3000) return 'Medium - Comprehensive coverage';
  if (wordCount < 5000) return 'Long - Detailed terms';
  return 'Very Long - Extensive legal document';
}

async function analyzeSingleDocument(content: string): Promise<AnalysisData> {
  const prompt = `
You are a legal expert specializing in terms of service and privacy policy analysis. Analyze the following document and provide a comprehensive assessment.

Document to analyze:
${content}

Please provide your analysis in the following JSON format:
{
  "riskLevel": "low|medium|high",
  "score": 0-100,
  "concerns": ["array of specific concerns found"],
  "highlights": ["array of positive aspects found"],
  "summary": "comprehensive summary of the document",
  "categories": {
    "dataPrivacy": {
      "score": 0-100,
      "riskLevel": "low|medium|high",
      "findings": ["specific findings for this category"],
      "explanation": "explanation of data privacy implications"
    },
    "userRights": {
      "score": 0-100,
      "riskLevel": "low|medium|high", 
      "findings": ["specific findings for this category"],
      "explanation": "explanation of user rights implications"
    },
    "liability": {
      "score": 0-100,
      "riskLevel": "low|medium|high",
      "findings": ["specific findings for this category"],
      "explanation": "explanation of liability implications"
    },
    "termination": {
      "score": 0-100,
      "riskLevel": "low|medium|high",
      "findings": ["specific findings for this category"],
      "explanation": "explanation of termination implications"
    },
    "contentOwnership": {
      "score": 0-100,
      "riskLevel": "low|medium|high",
      "findings": ["specific findings for this category"],
      "explanation": "explanation of content ownership implications"
    },
    "disputeResolution": {
      "score": 0-100,
      "riskLevel": "low|medium|high",
      "findings": ["specific findings for this category"],
      "explanation": "explanation of dispute resolution implications"
    }
  },
  "recommendations": ["array of actionable recommendations"],
  "keyMetrics": {
    "readabilityScore": 0-100,
    "lengthAnalysis": "description of document length",
    "lastUpdated": "extracted date or null",
    "jurisdiction": "extracted jurisdiction or null"
  }
}

Focus on:
1. Data privacy and user information handling
2. User rights including refunds and account control
3. Liability limitations and user responsibilities
4. Account termination conditions
5. Content ownership and licensing
6. Dispute resolution mechanisms

Provide specific, actionable insights that help users understand the real implications of agreeing to these terms.
`;

  const response = await fetch(TOGETHER_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOGETHER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
      messages: [
        {
          role: "system",
          content: "You are a legal expert specializing in terms of service analysis. Analyze the COMPLETE document provided - do not truncate or summarize the input. Provide detailed, accurate analysis of the entire document in the requested JSON format."
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
  
  // Parse the JSON response
  let analysisData;
  try {
    // Try to extract JSON from the response if it's wrapped in text
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : aiResponse;
    analysisData = JSON.parse(jsonString);
  } catch (parseError) {
    console.error('Failed to parse AI response as JSON:', aiResponse);
    throw new Error('AI returned invalid JSON response');
  }
  
  // Validate and ensure all required fields are present
  return validateAnalysisData(analysisData);
}


function validateAnalysisData(data: any): AnalysisData {
  // Ensure all required fields are present with defaults
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

function fallbackAnalysis(content: string): AnalysisData {
  // Enhanced fallback analysis using rule-based system
  const wordCount = content.trim().split(/\s+/).length;
  const lowerContent = content.toLowerCase();
  
  // Enhanced risk assessment with weighted scoring
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
  
  // Calculate category scores
  const categoryScores = {
    dataPrivacy: 0,
    userRights: 0,
    liability: 0,
    termination: 0,
    contentOwnership: 0,
    disputeResolution: 0
  };

  // Analyze risk factors
  riskFactors.forEach(factor => {
    if (lowerContent.includes(factor.keyword)) {
      totalRiskScore += factor.weight;
      categoryScores[factor.category as keyof typeof categoryScores] += factor.weight;
      concerns.push(`Contains "${factor.keyword}" clause`);
    }
  });

  // Analyze positive factors
  positiveFactors.forEach(factor => {
    if (lowerContent.includes(factor.keyword)) {
      totalPositiveScore += factor.weight;
      highlights.push(`Includes "${factor.keyword}" protection`);
    }
  });
  
  // Calculate final score
  const baseScore = Math.min(85, totalRiskScore);
  const adjustedScore = Math.max(5, baseScore - totalPositiveScore / 2);
  const score = Math.round(adjustedScore);
  const riskLevel = score <= 30 ? 'low' : score <= 60 ? 'medium' : 'high';

  // Generate category analyses
  const createCategoryAnalysis = (categoryScore: number, categoryName: string): CategoryAnalysis => {
    const normalizedScore = Math.min(100, categoryScore * 2);
    const catRiskLevel = normalizedScore <= 30 ? 'low' : normalizedScore <= 60 ? 'medium' : 'high';
    
    return {
      score: Math.round(normalizedScore),
      riskLevel: catRiskLevel,
      findings: concerns.filter(c => c.toLowerCase().includes(categoryName.toLowerCase())).slice(0, 2),
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
      lengthAnalysis: wordCount < 800 ? 'Short - May lack important details' : 
                     wordCount < 2500 ? 'Medium - Standard length' : 
                     wordCount < 5000 ? 'Long - Comprehensive coverage' : 'Very Long - Extensive legal document',
      lastUpdated: extractLastUpdated(content),
      jurisdiction: extractJurisdiction(content)
    }
  };
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