/**
 * GET /api/portal/systems — List customer installed energy systems
 * POST /api/portal/systems — Register new energy system (or self-link)
 */

import { NextRequest, NextResponse } from 'next/server';
import { withCustomerAuth } from '@/lib/middleware/customer-auth-middleware';
import { getCustomerSystems } from '@/lib/services/customer-portal-service';
import { customerSystemsStore, StoreEntity } from '@/lib/services/store-service';
import { CustomerSystem } from '@/lib/types';

export const GET = withCustomerAuth(async (_req, { session }) => {
  try {
    const systems = await getCustomerSystems(session.userId);
    return NextResponse.json({ systems });
  } catch (error) {
    console.error('[Portal Systems API] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch systems.' }, { status: 500 });
  }
});

export const POST = withCustomerAuth(async (req: NextRequest, { session }) => {
  try {
    const body = await req.json();
    const { name, systemType, locationName, totalCapacityKva, batteryCapacityKwh, solarCapacityKwp, components } = body;

    if (!name) {
      return NextResponse.json({ error: 'System name is required.' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const newSystem: CustomerSystem = {
      id: `sys_${Date.now()}`,
      customerId: session.userId,
      name,
      systemType: systemType || 'HYBRID_SOLAR',
      locationId: `loc_${Date.now()}`,
      locationName: locationName || 'Primary Location',
      installationDate: now,
      installedBy: '3rd Energy Certified Field Engineering',
      totalCapacityKva: Number(totalCapacityKva) || 5,
      batteryCapacityKwh: Number(batteryCapacityKwh) || 10,
      solarCapacityKwp: Number(solarCapacityKwp) || 5.5,
      healthStatus: 'OPTIMAL',
      components: components || [],
      telemetry: {
        lastSyncAt: now,
        currentOutputKw: 0,
        dailyYieldKwh: 0,
        batterySocPercent: 100,
        gridStatus: 'ONLINE',
      },
      createdAt: now,
      updatedAt: now,
    };

    await customerSystemsStore.create(newSystem as StoreEntity & Record<string, unknown>);
    return NextResponse.json({ success: true, system: newSystem }, { status: 201 });
  } catch (error) {
    console.error('[Portal Systems POST API] Error:', error);
    return NextResponse.json({ error: 'Failed to create system.' }, { status: 500 });
  }
});
