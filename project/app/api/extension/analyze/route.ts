import { NextRequest, NextResponse } from 'next/server';
import { analyzeComprehensiveExtensionData, checkExtensionRateLimit } from '@/lib/extension-api';

export async function POST(request: NextRequest) {
  try {
    const { extractionData, domain, userAgent } = await request.json();

    // Validate extraction data
    if (!extractionData || !extractionData.prioritizedDocuments) {
      return NextResponse.json(
        { error: 'Extraction data is required' },
        { status: 400 }
      );
    }

    if (!domain || typeof domain !== 'string') {
      return NextResponse.json(
        { error: 'Domain is required' },
        { status: 400 }
      );
    }

    // Check rate limiting
    if (!checkExtensionRateLimit(domain)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    const documentCount = extractionData.prioritizedDocuments?.length || 0;
    const inlineCount = (extractionData.inlineContent?.cookieBanners?.length || 0) + 
                       (extractionData.inlineContent?.privacyNotices?.length || 0) + 
                       (extractionData.inlineContent?.termsSnippets?.length || 0);
    
    console.log(`🔍 Extension API: Comprehensive analysis for ${domain}`);
    console.log(`📄 Documents: ${documentCount}, Inline content: ${inlineCount}`);

    // Perform comprehensive analysis
    const analysis = await analyzeComprehensiveExtensionData(extractionData);

    console.log(`✅ Extension API: Comprehensive analysis completed for ${domain}`);
    console.log(`📊 Results: ${analysis.riskLevel} risk, ${analysis.score}/100 score, ${analysis.summary.analysisDepth} total analyses`);

    return NextResponse.json({
      success: true,
      analysis,
      metadata: {
        domain,
        timestamp: new Date().toISOString(),
        documentsAnalyzed: documentCount,
        inlineContentAnalyzed: inlineCount,
        totalAnalysisDepth: analysis.summary.analysisDepth,
        userAgent: userAgent || 'Unknown',
        processingTime: Date.now() - analysis.timestamp
      }
    });

  } catch (error) {
    console.error('❌ Extension API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Comprehensive analysis failed. Please try again.',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Terms Analyzer Extension API',
    version: '2.0.0',
    features: [
      'Comprehensive document analysis',
      'Inline content extraction',
      'Cookie banner analysis',
      'Privacy notice detection',
      'Multi-document risk assessment'
    ],
    endpoints: {
      analyze: 'POST /api/extension/analyze'
    },
    rateLimit: {
      requests: 10,
      window: '1 hour',
      scope: 'per domain'
    },
    analysisCapabilities: {
      maxDocuments: 3,
      inlineContentSupport: true,
      cacheEnabled: true,
      cacheDuration: '24 hours'
    }
  });
}