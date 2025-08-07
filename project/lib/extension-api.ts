// API endpoints specifically for browser extension integration

import { NextRequest, NextResponse } from 'next/server';
import { analyzeWithAI } from './ai-analyzer';

export interface ExtensionAnalysisRequest {
  urls: string[];
  domain: string;
  userAgent?: string;
  timestamp?: number;
  inlineContent?: {
    cookieBanners: Array<{ text: string; selector: string; visible: boolean }>;
    privacyNotices: Array<{ text: string; selector: string; fullLength: number }>;
    termsSnippets: Array<{ text: string; selector: string; fullLength: number }>;
  };
  metadata?: {
    hasGDPRBanner: boolean;
    hasCookieConsent: boolean;
    hasSSL: boolean;
    wordCount: number;
  };
}

export interface ExtensionAnalysisResponse {
  domain: string;
  riskLevel: 'low' | 'medium' | 'high' | 'unknown';
  score: number;
  message: string;
  documents: Array<{
    url: string;
    text: string;
    category: string;
    confidence: number;
  }>;
  analyses: Array<{
    document: any;
    analysis: any;
    contentLength: number;
  }>;
  inlineAnalysis?: {
    type: string;
    analysis: any;
    sources: {
      cookieBanners: number;
      privacyNotices: number;
      termsSnippets: number;
    };
  };
  metadata: any;
  summary: {
    concerns: string[];
    highlights: string[];
    totalDocuments: number;
    hasInlineContent: boolean;
    categoryRisks?: Record<string, string[]>;
    analysisDepth: number;
  };
  cached?: boolean;
  timestamp: number;
}

// Enhanced analysis for comprehensive extension data
export async function analyzeComprehensiveExtensionData(
  extractionData: any
): Promise<ExtensionAnalysisResponse> {
  
  const { prioritizedDocuments, inlineContent, metadata } = extractionData;
  const domain = metadata.domain;
  
  if (prioritizedDocuments.length === 0 && (!inlineContent || 
      (inlineContent.cookieBanners.length === 0 && inlineContent.privacyNotices.length === 0))) {
    return {
      domain,
      riskLevel: 'unknown',
      score: 0,
      message: 'No terms, privacy policies, or cookie policies found on this website.',
      documents: [],
      analyses: [],
      metadata: metadata,
      summary: {
        concerns: [],
        highlights: [],
        totalDocuments: 0,
        hasInlineContent: false,
        analysisDepth: 0
      },
      timestamp: Date.now()
    };
  }

  const analyses = [];
  const inlineAnalyses = [];
  
  // Analyze document URLs (limit to top 3 to avoid rate limits)
  const topDocuments = prioritizedDocuments.slice(0, 3);
  
  for (const doc of topDocuments) {
    try {
      console.log(`📄 Analyzing document: ${doc.url} (${doc.category}, confidence: ${doc.confidence}%)`);
      
      // Fetch document content
      const content = await fetchUrlContent(doc.url);
      
      if (content && content.length > 100) {
        // Analyze with AI
        const analysis = await analyzeWithAI(content);
        
        analyses.push({
          document: doc,
          analysis,
          contentLength: content.length
        });
        
        console.log(`✅ Analysis complete for ${doc.url}: ${analysis.riskLevel} risk (${analysis.score}/100)`);
      }
    } catch (error) {
      console.error(`❌ Failed to analyze ${doc.url}:`, error);
      // Continue with other documents
    }
  }
  
  // Analyze inline content if available
  if (inlineContent && (inlineContent.cookieBanners.length > 0 || 
      inlineContent.privacyNotices.length > 0 || inlineContent.termsSnippets.length > 0)) {
    
    try {
      console.log(`📝 Analyzing inline content: ${inlineContent.cookieBanners.length} banners, ${inlineContent.privacyNotices.length} notices, ${inlineContent.termsSnippets.length} snippets`);
      
      const inlineText = [
        ...inlineContent.cookieBanners.map(b => `COOKIE BANNER: ${b.text}`),
        ...inlineContent.privacyNotices.map(n => `PRIVACY NOTICE: ${n.text}`),
        ...inlineContent.termsSnippets.map(s => `TERMS SNIPPET: ${s.text}`)
      ].join('\n\n');
      
      if (inlineText.length > 100) {
        const analysis = await analyzeWithAI(inlineText);
        
        inlineAnalyses.push({
          type: 'inline',
          analysis,
          sources: {
            cookieBanners: inlineContent.cookieBanners.length,
            privacyNotices: inlineContent.privacyNotices.length,
            termsSnippets: inlineContent.termsSnippets.length
          }
        });
        
        console.log(`✅ Inline content analysis complete: ${analysis.riskLevel} risk (${analysis.score}/100)`);
      }
    } catch (error) {
      console.error('❌ Failed to analyze inline content:', error);
      // Continue with other URLs even if one fails
    }
  }

  // Combine all analyses
  const allAnalyses = [...analyses.map(a => a.analysis), ...inlineAnalyses.map(i => i.analysis)];
  
  if (allAnalyses.length === 0) {
    return {
      domain,
      riskLevel: 'unknown',
      score: 0,
      message: 'Could not analyze the found documents.',
      documents: prioritizedDocuments,
      analyses: [],
      metadata: metadata,
      summary: {
        concerns: [],
        highlights: [],
        totalDocuments: 0,
        hasInlineContent: false,
        analysisDepth: 0
      },
      timestamp: Date.now()
    };
  }

  // Combine analyses
  const avgScore = Math.round(
    allAnalyses.reduce((sum, analysis) => sum + analysis.score, 0) / allAnalyses.length
  );

  const highestRisk = allAnalyses.reduce((highest, analysis) => {
    const riskLevels = { low: 1, medium: 2, high: 3, unknown: 0 };
    return riskLevels[analysis.riskLevel] > riskLevels[highest] 
      ? analysis.riskLevel 
      : highest;
  }, 'low');

  const allConcerns = allAnalyses.flatMap(analysis => analysis.concerns);
  const allHighlights = allAnalyses.flatMap(analysis => analysis.highlights);
  
  // Create comprehensive message
  const documentCount = analyses.length;
  const inlineCount = inlineAnalyses.length;
  let message = `Analyzed ${documentCount} document(s)`;
  if (inlineCount > 0) {
    message += ` and ${inlineCount} inline content section(s)`;
  }
  message += ` from this website.`;
  
  // Calculate category risks
  const categoryRisks = {};
  allAnalyses.forEach(analysis => {
    Object.entries(analysis.categories).forEach(([category, data]) => {
      if (!categoryRisks[category]) {
        categoryRisks[category] = [];
      }
      categoryRisks[category].push(data.riskLevel);
    });
  });

  return {
    domain,
    riskLevel: highestRisk as 'low' | 'medium' | 'high',
    score: avgScore,
    message: message,
    documents: prioritizedDocuments,
    analyses,
    inlineAnalysis: inlineAnalyses.length > 0 ? inlineAnalyses[0] : undefined,
    metadata: metadata,
    summary: {
      concerns: [...new Set(allConcerns)].slice(0, 8),
      highlights: [...new Set(allHighlights)].slice(0, 5),
      totalDocuments: documentCount,
      hasInlineContent: inlineCount > 0,
      categoryRisks: categoryRisks,
      analysisDepth: documentCount + inlineCount
    },
    timestamp: Date.now()
  };
}

// Enhanced URL content fetching with better error handling
async function fetchUrlContent(url: string): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Terms Analyzer Extension/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache'
      },
      credentials: 'omit',
      mode: 'cors',
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    
    // Enhanced text extraction
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Remove non-content elements
    const elementsToRemove = doc.querySelectorAll('script, style, noscript, nav, header, footer, .nav, .header, .footer, .menu, .sidebar, .advertisement, .ads, .social-share');
    elementsToRemove.forEach(el => el.remove());
    
    // Try to find main content areas
    const contentSelectors = [
      'main', 
      '[role="main"]', 
      '.main-content', 
      '.content', 
      '.terms-content', 
      '.policy-content', 
      '.legal-content', 
      'article',
      '.article',
      '.document-content',
      '.page-content'
    ];
    
    let textContent = '';
    
    // Try each content selector
    for (const selector of contentSelectors) {
      const contentEl = doc.querySelector(selector);
      if (contentEl && contentEl.textContent.length > textContent.length) {
        textContent = contentEl.textContent;
      }
    }
    
    // Fallback to body if no main content found
    if (!textContent || textContent.length < 200) {
      textContent = doc.body?.textContent || '';
    }
    
    // Clean up the text
    const cleanContent = textContent
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim();

    if (cleanContent.length < 100) {
      throw new Error('Document appears to be too short or empty');
    }

    // Truncate very long documents
    if (cleanContent.length > 100000) {
      return cleanContent.substring(0, 100000) + '\n\n[Document truncated for analysis]';
    }

    return cleanContent;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout - ${url} took too long to load`);
    }
    throw new Error(`Failed to fetch content from ${url}: ${error.message}`);
  }
}

// Extract title from URL
function extractTitleFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    
    // Extract meaningful part from path
    const segments = path.split('/').filter(s => s.length > 0);
    const lastSegment = segments[segments.length - 1] || '';
    
    // Convert to readable title
    return lastSegment
      .replace(/[-_]/g, ' ')
      .replace(/\.(html|php|aspx?)$/i, '')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') || 'Legal Document';
  } catch {
    return 'Legal Document';
  }
}

// Determine document type from URL
function determineDocumentType(url: string): string {
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('privacy')) return 'privacy';
  if (lowerUrl.includes('cookie')) return 'cookie';
  if (lowerUrl.includes('terms')) return 'terms';
  if (lowerUrl.includes('legal')) return 'legal';
  if (lowerUrl.includes('policy')) return 'privacy';
  if (lowerUrl.includes('tos')) return 'terms';
  if (lowerUrl.includes('eula')) return 'terms';
  
  return 'legal';
}

// Rate limiting for extension requests
const extensionRequestLimits = new Map<string, { count: number; resetTime: number }>();

export function checkExtensionRateLimit(domain: string): boolean {
  const now = Date.now();
  const limit = extensionRequestLimits.get(domain);
  
  if (!limit || now > limit.resetTime) {
    // Reset or create new limit (10 requests per hour)
    extensionRequestLimits.set(domain, {
      count: 1,
      resetTime: now + 60 * 60 * 1000 // 1 hour
    });
    return true;
  }
  
  if (limit.count >= 10) {
    return false; // Rate limit exceeded
  }
  
  limit.count++;
  return true;
}