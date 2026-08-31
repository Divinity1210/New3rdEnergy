/**
 * GET /api/portal/support/[id] — Get single ticket thread
 * POST /api/portal/support/[id] — Reply to support ticket thread
 */

import { NextRequest, NextResponse } from 'next/server';
import { withCustomerAuth } from '@/lib/middleware/customer-auth-middleware';
import { getTicketById, addTicketMessage } from '@/lib/services/ticket-service';

export const GET = withCustomerAuth(async (_req, { session, params }) => {
  try {
    const ticketId = params?.id;
    if (!ticketId) {
      return NextResponse.json({ error: 'Ticket ID is required.' }, { status: 400 });
    }

    const ticket = await getTicketById(ticketId, session.userId);
    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found or access denied.' }, { status: 404 });
    }

    return NextResponse.json({ ticket });
  } catch (error) {
    console.error('[Portal Ticket Detail GET API] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch ticket.' }, { status: 500 });
  }
});

export const POST = withCustomerAuth(async (req: NextRequest, { session, params }) => {
  try {
    const ticketId = params?.id;
    if (!ticketId) {
      return NextResponse.json({ error: 'Ticket ID is required.' }, { status: 400 });
    }

    const body = await req.json();
    const { content, attachments } = body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: 'Message content is required.' }, { status: 400 });
    }

    const updated = await addTicketMessage(ticketId, {
      senderId: session.userId,
      senderName: `${session.firstName} ${session.lastName}`.trim() || 'Customer',
      senderType: 'CUSTOMER',
      content: content.trim(),
      attachments: attachments || [],
    });

    if (!updated) {
      return NextResponse.json({ error: 'Failed to post message to ticket.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, ticket: updated });
  } catch (error) {
    console.error('[Portal Ticket Reply POST API] Error:', error);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
});
