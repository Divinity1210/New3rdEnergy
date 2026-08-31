/**
 * GET /api/portal/profile — Get customer profile & multi-site locations
 * PUT /api/portal/profile — Update customer personal, company, or notification settings
 */

import { NextRequest, NextResponse } from 'next/server';
import { withCustomerAuth } from '@/lib/middleware/customer-auth-middleware';
import { customerProfilesStore, StoreEntity } from '@/lib/services/store-service';
import { CustomerProfile } from '@/lib/types';
import { seedDemoCustomerData } from '@/lib/services/customer-auth-service';

export const GET = withCustomerAuth(async (_req, { session }) => {
  try {
    if (session.userId === 'cust_demo_user_01') await seedDemoCustomerData();
    const profiles = await customerProfilesStore.findBy('userId', session.userId);
    const profile = profiles[0] || null;
    return NextResponse.json({ profile });
  } catch (error) {
    console.error('[Portal Profile GET API] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch customer profile.' }, { status: 500 });
  }
});

export const PUT = withCustomerAuth(async (req: NextRequest, { session }) => {
  try {
    const body = await req.json();
    const { firstName, lastName, phone, companyName, industry, jobTitle, locations, notificationPreferences } = body;

    const profiles = await customerProfilesStore.findBy('userId', session.userId);
    const existing = profiles[0] as unknown as CustomerProfile;

    const now = new Date().toISOString();
    let updatedProfile: CustomerProfile;

    if (existing) {
      const updated = await customerProfilesStore.update(existing.id, {
        firstName: firstName ?? existing.firstName,
        lastName: lastName ?? existing.lastName,
        phone: phone ?? existing.phone,
        companyName: companyName ?? existing.companyName,
        industry: industry ?? existing.industry,
        jobTitle: jobTitle ?? existing.jobTitle,
        locations: locations ?? existing.locations,
        notificationPreferences: notificationPreferences ?? existing.notificationPreferences,
        updatedAt: now,
      });
      updatedProfile = updated as unknown as CustomerProfile;
    } else {
      const newProf: CustomerProfile = {
        id: `cust_prof_${Date.now()}`,
        userId: session.userId,
        email: session.email,
        firstName: firstName || session.firstName,
        lastName: lastName || session.lastName,
        phone: phone || '',
        companyName,
        industry,
        jobTitle,
        locations: locations || [],
        notificationPreferences: notificationPreferences || {
          email: true,
          sms: true,
          whatsapp: true,
          maintenanceReminders: true,
          orderUpdates: true,
          ticketResponses: true,
        },
        createdAt: now,
        updatedAt: now,
      };
      await customerProfilesStore.create(newProf as StoreEntity & Record<string, unknown>);
      updatedProfile = newProf;
    }

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error('[Portal Profile PUT API] Error:', error);
    return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 });
  }
});
