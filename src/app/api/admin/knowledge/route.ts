/**
 * GET /api/admin/knowledge — List/search knowledge base
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, getClientIP, getUserAgent } from '@/lib/middleware/auth-middleware';
import { logAction } from '@/lib/services/audit-service';
import { searchKnowledge, getAllArticles, getArticlesByCategory, getCategoryCounts } from '@/lib/data/knowledge-base';
import { Session, KBCategory } from '@/lib/types';

async function handler(request: NextRequest, { session }: { session: Session }) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category') as KBCategory | null;

    await logAction({
      session,
      action: 'VIEW',
      resource: 'knowledge',
      details: `Searched KB: q=${query || 'none'}, category=${category || 'all'}`,
      ipAddress: getClientIP(request),
      userAgent: getUserAgent(request),
    });

    let articles;
    if (query) {
      articles = searchKnowledge(query, category || undefined);
    } else if (category) {
      articles = getArticlesByCategory(category);
    } else {
      articles = getAllArticles();
    }

    const categoryCounts = getCategoryCounts();

    return NextResponse.json({
      articles,
      total: articles.length,
      categoryCounts,
    });
  } catch (error) {
    console.error('[Knowledge API] Error:', error);
    return NextResponse.json({ error: 'Failed to load knowledge base.' }, { status: 500 });
  }
}

export const GET = withAuth(handler, ['ADMIN', 'SUPPORT', 'TECHNICAL', 'SALES']);
