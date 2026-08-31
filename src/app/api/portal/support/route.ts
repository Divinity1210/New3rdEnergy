/**
 * GET /api/portal/support — List customer support tickets
 * POST /api/portal/support — Create a new support ticket (with optional attachments & category)
 */

import { NextRequest, NextResponse } from 'next/server';
import { withCustomerAuth } from '@/lib/middleware/customer-auth-middleware';
import { listCustomerTickets, createSupportTicket } from '@/lib/services/ticket-service';

export const GET = withCustomerAuth(async (_req, { session }) => {
  try {
    const tickets = await listCustomerTickets(session.userId);
    return NextResponse.json({ tickets });
  } catch (error) {
    console.error('[Portal Support Tickets GET API] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch tickets.' }, { status: 500 });
  }
});

export const POST = withCustomerAuth(async (req: NextRequest, { session }) => {
  try {
    const body = await req.json();
    const { subject, initialDescription, category, priority, systemId, systemName, attachments, escalatedFromAi } = body;

    if (!subject || !initialDescription) {
      return NextResponse.json(
        { error: 'Subject and description are required.' },
        { status: 400 }
      );
    }

    const ticket = await createSupportTicket({
      customerId: session.userId,
      customerName: `${session.firstName} ${session.lastName}`.trim() || 'Customer',
      customerEmail: session.email,
      systemId,
      systemName,
      category: category || 'GENERAL_INQUIRY',
      priority: priority || 'MEDIUM',
      subject,
      initialDescription,
      attachments: attachments || [],
      escalatedFromAi: !!escalatedFromAi,
    });

    return NextResponse.json({ success: true, ticket }, { status: 201 });
  } catch (error) {
    console.error('[Portal Support Tickets POST API] Error:', error);
    return NextResponse.json({ error: 'Failed to create support ticket.' }, { status: 500 });
  }
});
