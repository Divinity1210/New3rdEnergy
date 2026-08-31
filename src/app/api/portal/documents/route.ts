/**
 * GET /api/portal/documents — List Document Vault files (Invoices, Schematics, Manuals, Certs)
 */

import { NextResponse } from 'next/server';
import { withCustomerAuth } from '@/lib/middleware/customer-auth-middleware';
import { getCustomerDocuments } from '@/lib/services/customer-portal-service';

export const GET = withCustomerAuth(async (_req, { session }) => {
  try {
    const documents = await getCustomerDocuments(session.userId);
    return NextResponse.json({ documents });
  } catch (error) {
    console.error('[Portal Documents API] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch customer documents.' }, { status: 500 });
  }
});
