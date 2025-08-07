import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory cache for extension results
// In production, you might want to use Redis or a database
const extensionCache = new Map<string, {
  analysis: any;
  timestamp: number;
  domain: string;
}>();

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');

    if (!domain) {
      return NextResponse.json(
        { error: 'Domain parameter is required' },
        { status: 400 }
      );
    }

    const cached = extensionCache.get(domain);
    
    if (!cached) {
      return NextResponse.json(
        { cached: false, analysis: null },
        { status: 404 }
      );
    }

    // Check if cache is still valid
    if (Date.now() - cached.timestamp > CACHE_DURATION) {
      extensionCache.delete(domain);
      return NextResponse.json(
        { cached: false, analysis: null },
        { status: 404 }
      );
    }

    return NextResponse.json({
      cached: true,
      analysis: cached.analysis,
      timestamp: cached.timestamp,
      age: Date.now() - cached.timestamp
    });

  } catch (error) {
    console.error('Extension Cache GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve cache' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { domain, analysis } = await request.json();

    if (!domain || !analysis) {
      return NextResponse.json(
        { error: 'Domain and analysis are required' },
        { status: 400 }
      );
    }

    // Store in cache
    extensionCache.set(domain, {
      analysis,
      timestamp: Date.now(),
      domain
    });

    return NextResponse.json({
      success: true,
      cached: true,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Extension Cache POST Error:', error);
    return NextResponse.json(
      { error: 'Failed to cache analysis' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain');

    if (!domain) {
      return NextResponse.json(
        { error: 'Domain parameter is required' },
        { status: 400 }
      );
    }

    const deleted = extensionCache.delete(domain);

    return NextResponse.json({
      success: true,
      deleted,
      domain
    });

  } catch (error) {
    console.error('Extension Cache DELETE Error:', error);
    return NextResponse.json(
      { error: 'Failed to clear cache' },
      { status: 500 }
    );
  }
}

// Cleanup old cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [domain, cached] of extensionCache.entries()) {
    if (now - cached.timestamp > CACHE_DURATION * 2) { // Keep for 48 hours max
      extensionCache.delete(domain);
    }
  }
}, 60 * 60 * 1000); // Run every hour