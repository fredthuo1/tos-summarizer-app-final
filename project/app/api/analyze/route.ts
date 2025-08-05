import { NextRequest, NextResponse } from 'next/server';
import { analyzeWithAI } from '@/lib/ai-analyzer';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 API Route: Starting AI-powered analysis request');
    const { content, source, type } = await request.json();

    // Verify Together AI key is available
    if (!process.env.TOGETHER_API_KEY) {
      console.error('❌ Together AI API key not configured');
      return NextResponse.json(
        { error: 'AI analysis service not configured. Please set TOGETHER_API_KEY environment variable.' },
        { status: 500 }
      );
    }

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required and must be a string' },
        { status: 400 }
      );
    }

    if (content.length < 50) {
      return NextResponse.json(
        { error: 'Content must be at least 50 characters long' },
        { status: 400 }
      );
    }

    if (content.length > 100000) {
      return NextResponse.json(
        { error: 'Content is too long (max 100,000 characters). Please provide a shorter document or contact support for enterprise analysis.' },
        { status: 400 }
      );
    }

    console.log(`🔍 API Route: Using AI to analyze ${type} content from ${source} (${content.length} characters)`);
    
    // Log if content will be processed in chunks
    if (content.length > 8000) {
      console.log(`📄 API Route: Large content (${content.length} chars) will be processed in AI chunks`);
    }
    
    // Log content preview for debugging (first 200 characters)
    console.log(`📝 API Route: Content preview for AI: ${content.substring(0, 200)}...`);
    
    const analysis = await analyzeWithAI(content);
    console.log('✅ API Route: AI analysis completed successfully');

    return NextResponse.json({
      success: true,
      analysis,
      metadata: {
        source: source || 'Unknown',
        type: type || 'text',
        timestamp: new Date().toISOString(),
        contentLength: content.length,
        wordCount: content.trim().split(/\s+/).length,
        processingMethod: content.length > 8000 ? 'ai-chunked' : 'ai-single-document',
        aiProvider: 'Together AI (Meta-Llama-3.1-70B-Instruct-Turbo)'
      }
    });

  } catch (error) {
    console.error('❌ AI Analysis API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'AI analysis failed. Please check your API configuration.',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Terms Analyzer API is running',
    version: '1.0.0',
    endpoints: {
      analyze: 'POST /api/analyze'
    }
  });
}