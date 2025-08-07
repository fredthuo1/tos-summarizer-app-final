// API endpoints specifically for browser extension integration

import { NextRequest, NextResponse } from 'next/server';
import { analyzeWithAI } from './ai-analyzer';

export interface ExtensionAnalysisRequest {
  urls: string[];
  domain: string;
  userAgent?: string;
  timestamp?: number;
}

export interface ExtensionAnalysisResponse {
  domain: string;
  riskLevel: 'low' | 'medium' | 'high' | 'unknown';
  score: number;
  message: string;
  links: Array<{
    url: string;
    text: string;
    type: string;
  }>;
  analyses: Array<{
    link: any;
    analysis: any;
  }>;
  summary: {
    concerns: string[];
    highlights: string[];
    totalDocuments: number;
  };
  cached?: boolean;
  timestamp: number;
}

// Analyze multiple URLs for browser extension
export async function analyzeForExtension(
  urls: string[], 
  domain: string
): Promise<ExtensionAnalysisResponse> {
  
  if (urls.length === 0) {
    return {
      domain,
      riskLevel: 'unknown',
      score: 0,
      message: 'No terms or privacy policy links found on this website.',
      links: [],
      analyses: [],
      summary: {
        concerns: [],
        highlights: [],
        totalDocuments: 0
      },
      timestamp: Date.now()
    };
  }

  const analyses = [];
  
  // Analyze each URL (limit to 3 most relevant)
  const relevantUrls = urls.slice(0, 3);
  
  for (const url of relevantUrls) {
    try {
      // Fetch content from URL
      const content = await fetchUrlContent(url);
      
      // Analyze with AI
      const analysis = await analyzeWithAI(content);
      
      analyses.push({
        link: {
          url,
          text: extractTitleFromUrl(url),
          type: determineDocumentType(url)
        },
        analysis
      });
    } catch (error) {
      console.error(`Error analyzing ${url}:`, error);
      // Continue with other URLs even if one fails
    }
  }

  if (analyses.length === 0) {
    return {
      domain,
      riskLevel: 'unknown',
      score: 0,
      message: 'Could not analyze the found links.',
      links: urls.map(url => ({
        url,
        text: extractTitleFromUrl(url),
        type: determineDocumentType(url)
      })),
      analyses: [],
      summary: {
        concerns: [],
        highlights: [],
        totalDocuments: 0
      },
      timestamp: Date.now()
    };
  }

  // Combine analyses
  const avgScore = Math.round(
    analyses.reduce((sum, a) => sum + a.analysis.score, 0) / analyses.length
  );

  const highestRisk = analyses.reduce((highest, current) => {
    const riskLevels = { low: 1, medium: 2, high: 3, unknown: 0 };
    return riskLevels[current.analysis.riskLevel] > riskLevels[highest] 
      ? current.analysis.riskLevel 
      : highest;
  }, 'low');

  const allConcerns = analyses.flatMap(a => a.analysis.concerns);
  const allHighlights = analyses.flatMap(a => a.analysis.highlights);

  return {
    domain,
    riskLevel: highestRisk as 'low' | 'medium' | 'high',
    score: avgScore,
    message: `Analyzed ${analyses.length} document(s) from this website.`,
    links: urls.map(url => ({
      url,
      text: extractTitleFromUrl(url),
      type: determineDocumentType(url)
    })),
    analyses,
    summary: {
      concerns: [...new Set(allConcerns)].slice(0, 5),
      highlights: [...new Set(allHighlights)].slice(0, 3),
      totalDocuments: analyses.length
    },
    timestamp: Date.now()
  };
}

// Fetch content from URL (simplified version for extension)
async function fetchUrlContent(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Terms Analyzer Extension/1.0'
      },
      timeout: 10000 // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    
    // Extract text content from HTML (basic implementation)
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (textContent.length < 100) {
      throw new Error('Document appears to be too short or empty');
    }

    return textContent;
  } catch (error) {
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