import { NextRequest, NextResponse } from 'next/server';
import { analyzeForExtension, checkExtensionRateLimit } from '@/lib/extension-api';

export async function POST(request: NextRequest) {
  try {
    const { urls, domain, userAgent } = await request.json();

    // Validate input
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: 'URLs array is required' },
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

    // Validate URLs
    const validUrls = urls.filter(url => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    });

    if (validUrls.length === 0) {
      return NextResponse.json(
        { error: 'No valid URLs provided' },
        { status: 400 }
      );
    }

    console.log(`🔍 Extension API: Analyzing ${validUrls.length} URLs for domain: ${domain}`);

    // Analyze URLs
    const analysis = await analyzeForExtension(validUrls, domain);

    console.log(`✅ Extension API: Analysis completed for ${domain} - Risk: ${analysis.riskLevel}, Score: ${analysis.score}`);

    return NextResponse.json({
      success: true,
      analysis,
      metadata: {
        domain,
        timestamp: new Date().toISOString(),
        urlsAnalyzed: validUrls.length,
        userAgent: userAgent || 'Unknown',
        processingTime: Date.now() - analysis.timestamp
      }
    });

  } catch (error) {
    console.error('❌ Extension API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Analysis failed. Please try again.',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Terms Analyzer Extension API',
    version: '1.0.0',
    endpoints: {
      analyze: 'POST /api/extension/analyze'
    },
    rateLimit: {
      requests: 10,
      window: '1 hour',
      scope: 'per domain'
    }
  });
}