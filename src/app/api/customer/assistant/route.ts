/**
 * POST /api/customer/assistant — Customer-facing AI assistant
 * 
 * Public endpoint (no auth required). Rate-limited.
 * Knowledge-bounded — never hallucinate business policy.
 */

import { NextRequest, NextResponse } from 'next/server';

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW = 60 * 1000;

function checkRate(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!checkRate(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again shortly.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { query } = body;

    if (!query || typeof query !== 'string' || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please provide a valid question.' },
        { status: 400 }
      );
    }

    // Sanitise input
    const sanitised = query.trim().substring(0, 500);

    // Dynamic import to avoid loading AI service on every request
    const { aiService } = await import('@/lib/services/ai-service');
    const response = await aiService.answerCustomerQuery(sanitised);

    return NextResponse.json({ message: response });
  } catch (error) {
    console.error('[Customer Assistant API] Error:', error);
    return NextResponse.json(
      { error: 'The assistant is temporarily unavailable. Please contact our team directly.' },
      { status: 500 }
    );
  }
}
