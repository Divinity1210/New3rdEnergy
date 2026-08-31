/**
 * GET /api/portal/systems/[id] — Detailed technical profile of customer energy system
 */

import { NextResponse } from 'next/server';
import { withCustomerAuth } from '@/lib/middleware/customer-auth-middleware';
import { getCustomerSystemById, getCustomerServiceHistory } from '@/lib/services/customer-portal-service';
import { warrantiesStore, maintenanceStore, documentsStore } from '@/lib/services/store-service';
import { WarrantyRecord, MaintenanceReminder, DocumentRecord } from '@/lib/types';

export const GET = withCustomerAuth(async (_req, { session, params }) => {
  try {
    const systemId = params?.id;
    if (!systemId) {
      return NextResponse.json({ error: 'System ID is required.' }, { status: 400 });
    }

    const system = await getCustomerSystemById(session.userId, systemId);
    if (!system) {
      return NextResponse.json({ error: 'Energy system not found or access denied.' }, { status: 404 });
    }

    const [serviceHistory, allWarranties, allMaintenance, allDocs] = await Promise.all([
      getCustomerServiceHistory(session.userId, systemId),
      warrantiesStore.findBy('customerId', session.userId),
      maintenanceStore.findBy('customerId', session.userId),
      documentsStore.findBy('customerId', session.userId),
    ]);

    const warranties = (allWarranties as unknown as WarrantyRecord[]).filter(w => !w.systemId || w.systemId === systemId);
    const maintenance = (allMaintenance as unknown as MaintenanceReminder[]).filter(m => !m.systemId || m.systemId === systemId);
    const documents = (allDocs as unknown as DocumentRecord[]).filter(d => !d.systemId || d.systemId === systemId);

    return NextResponse.json({
      system,
      serviceHistory,
      warranties,
      maintenance,
      documents,
    });
  } catch (error) {
    console.error('[Portal System Detail API] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch system details.' }, { status: 500 });
  }
});
