/**
 * GET /api/portal/notifications — List customer in-app notifications
 * PATCH /api/portal/notifications — Mark notification as read (or mark all read)
 */

import { NextRequest, NextResponse } from 'next/server';
import { withCustomerAuth } from '@/lib/middleware/customer-auth-middleware';
import { customerNotificationsStore } from '@/lib/services/store-service';
import { CustomerNotification } from '@/lib/types';
import { seedDemoCustomerData } from '@/lib/services/customer-auth-service';

export const GET = withCustomerAuth(async (_req, { session }) => {
  try {
    if (session.userId === 'cust_demo_user_01') await seedDemoCustomerData();
    const raw = await customerNotificationsStore.findBy('customerId', session.userId);
    const notifications = raw as unknown as CustomerNotification[];
    // Sort newest first
    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('[Portal Notifications GET API] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications.' }, { status: 500 });
  }
});

export const PATCH = withCustomerAuth(async (req: NextRequest, { session }) => {
  try {
    const body = await req.json();
    const { notificationId, markAll } = body;

    if (markAll) {
      const raw = await customerNotificationsStore.findBy('customerId', session.userId);
      for (const n of raw) {
        if (!n.isRead) {
          await customerNotificationsStore.update(n.id, { isRead: true });
        }
      }
      return NextResponse.json({ success: true, message: 'All notifications marked as read.' });
    }

    if (notificationId) {
      const updated = await customerNotificationsStore.update(notificationId, { isRead: true });
      return NextResponse.json({ success: true, notification: updated });
    }

    return NextResponse.json({ error: 'notificationId or markAll required.' }, { status: 400 });
  } catch (error) {
    console.error('[Portal Notifications PATCH API] Error:', error);
    return NextResponse.json({ error: 'Failed to update notification.' }, { status: 500 });
  }
});
