/**
 * POST /api/portal/assistant — Context-Aware AI Energy Assistant for Customer Systems
 */

import { NextRequest, NextResponse } from 'next/server';
import { withCustomerAuth } from '@/lib/middleware/customer-auth-middleware';
import { getCustomerSystems } from '@/lib/services/customer-portal-service';
import { aiService } from '@/lib/services/ai-service';

export const POST = withCustomerAuth(async (req: NextRequest, { session }) => {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query || typeof query !== 'string' || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please enter a valid energy system question or diagnostic description.' },
        { status: 400 }
      );
    }

    const sanitised = query.trim().substring(0, 1000);
    const systems = await getCustomerSystems(session.userId);

    const response = await aiService.answerCustomerSystemQuery(sanitised, {
      systems,
      customerName: `${session.firstName} ${session.lastName}`.trim(),
      customerEmail: session.email,
    });

    return NextResponse.json({ message: response });
  } catch (error) {
    console.error('[Portal AI Assistant API] Error:', error);
    return NextResponse.json(
      { error: 'AI Assistant temporarily unavailable. Please contact our support engineering team.' },
      { status: 500 }
    );
  }
});
