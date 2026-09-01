import { NextRequest, NextResponse } from 'next/server';
import { withAuth, getClientIP, getUserAgent } from '@/lib/middleware/auth-middleware';
import { Store } from '@/lib/services/store-service';
import { logAction } from '@/lib/services/audit-service';
import { PowerOrder, Session } from '@/lib/types';
import { notificationAdapter } from '@/lib/adapters/notification-adapter';

const ordersStore = new Store<PowerOrder & { id: string }>('orders');

// Seed orders if store is empty
const seedOrders: PowerOrder[] = [
  {
    id: 'ord_seed_1',
    orderNumber: '3E-ORD-2026-849201',
    customer: {
      firstName: 'Alhaji Musa',
      lastName: 'Danjuma',
      email: 'musa.danjuma@tahaulage.com',
      phone: '+234 802 333 4455',
      preferredContact: 'phone',
    },
    items: [
      {
        id: 'item_1',
        productId: 'pkg-executive-5kva',
        product: {
          id: 'pkg-executive-5kva',
          slug: '5kva-executive-home-package',
          name: '5kVA / 10.24kWh Executive Home & Office Solar Package',
          category: 'packages',
          tagline: 'Turnkey Solar System with 8x 550W Panels & 10.24kWh LiFePO4',
          description: 'Full turnkey solar installation',
          price: 4950000,
          currency: 'NGN',
          image: '/images/solar-family-lifestyle.jpg',
          inStock: true,
          specs: { capacity: '10.24kWh', continuousPower: '5000W' },
          features: ['5-Yr Warranty', '0ms UPS Switchover'],
          order: 1,
        },
        quantity: 1,
        unitPrice: 4950000,
        isPackage: true,
        packageDetails: {
          name: '5kVA Executive Package',
          ratingKva: 5,
          batteryKwh: 10.24,
          includesInstallation: true,
        },
      },
    ],
    subtotal: 4950000,
    shippingFee: 0,
    installationFee: 0,
    total: 4950000,
    currency: 'NGN',
    fulfillmentType: 'delivery',
    deliveryAddress: {
      address: 'Plot 14, Victoria Garden City (VGC)',
      city: 'Lekki',
      state: 'Lagos',
      country: 'Nigeria',
    },
    installationRequested: true,
    installationNotes: 'Standard 2-storey duplex roof. Pre-wired inverter changeover available.',
    paymentMethod: 'bank_transfer',
    paymentStatus: 'PAID',
    orderStatus: 'PROCESSING',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'ord_seed_2',
    orderNumber: '3E-ORD-2026-319482',
    customer: {
      firstName: 'Chidi',
      lastName: 'Okonkwo',
      email: 'chidi.dev@techhub.ng',
      phone: '+234 812 345 6789',
      preferredContact: 'email',
    },
    items: [
      {
        id: 'item_2',
        productId: 'pb-30000mah-65w',
        product: {
          id: 'pb-30000mah-65w',
          slug: '30000mah-65w-laptop-power-bank',
          name: '30,000mAh 65W PD Fast-Charge Laptop Power Bank',
          category: 'power-stations',
          tagline: 'High-speed Type-C PD charging for MacBooks and smartphones',
          description: 'Portable laptop power bank',
          price: 48500,
          currency: 'NGN',
          image: '/images/products/pb-30000mah.jpg',
          inStock: true,
          specs: { capacity: '30,000mAh / 111Wh' },
          features: ['65W PD Fast Charge'],
          order: 2,
        },
        quantity: 2,
        unitPrice: 48500,
      },
    ],
    subtotal: 97000,
    shippingFee: 35000,
    installationFee: 0,
    total: 132000,
    currency: 'NGN',
    fulfillmentType: 'delivery',
    deliveryAddress: {
      address: '24 Commercial Avenue, Sabo',
      city: 'Yaba',
      state: 'Lagos',
      country: 'Nigeria',
    },
    installationRequested: false,
    paymentMethod: 'card',
    paymentStatus: 'PAID',
    orderStatus: 'COMPLETED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
];

async function getHandler(request: NextRequest, { session }: { session: Session }) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    await logAction({
      session,
      action: 'VIEW',
      resource: 'orders',
      details: 'Viewed admin orders list',
      ipAddress: getClientIP(request),
      userAgent: getUserAgent(request),
    });

    const storedOrders = await ordersStore.list();
    let allOrders = storedOrders.length > 0 ? storedOrders : seedOrders;

    // Filter by status if provided
    if (status && status !== 'ALL') {
      allOrders = allOrders.filter((o) => o.orderStatus === status || o.paymentStatus === status);
    }

    // Filter by search query
    if (search) {
      const q = search.toLowerCase();
      allOrders = allOrders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customer.firstName.toLowerCase().includes(q) ||
          o.customer.lastName.toLowerCase().includes(q) ||
          o.customer.email.toLowerCase().includes(q) ||
          o.customer.phone.toLowerCase().includes(q)
      );
    }

    const totalOrders = allOrders.length;
    const totalRevenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    return NextResponse.json({
      orders: allOrders,
      totalOrders,
      totalRevenue,
    });
  } catch (error) {
    console.error('[Admin Orders API] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders.' }, { status: 500 });
  }
}

async function patchHandler(request: NextRequest, { session }: { session: Session }) {
  try {
    const body = await request.json();
    const { orderId, orderStatus, paymentStatus } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const order = await ordersStore.get(orderId);
    if (!order) {
      // Check seed orders
      const seed = seedOrders.find((o) => o.id === orderId);
      if (seed) {
        if (orderStatus) seed.orderStatus = orderStatus;
        if (paymentStatus) seed.paymentStatus = paymentStatus;
        seed.updatedAt = new Date().toISOString();
        return NextResponse.json({ success: true, order: seed });
      }
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const updates: Partial<PowerOrder> = {
      updatedAt: new Date().toISOString(),
    };
    if (orderStatus) updates.orderStatus = orderStatus;
    if (paymentStatus) updates.paymentStatus = paymentStatus;

    const updated = await ordersStore.update(orderId, updates);

    await logAction({
      session,
      action: 'UPDATE',
      resource: 'orders',
      details: `Updated order ${orderId} (status: ${orderStatus || 'unchanged'}, payment: ${paymentStatus || 'unchanged'})`,
      ipAddress: getClientIP(request),
      userAgent: getUserAgent(request),
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error('[Admin Orders Patch API] Error:', error);
    return NextResponse.json({ error: 'Failed to update order.' }, { status: 500 });
  }
}

export const GET = withAuth(getHandler, ['ADMIN', 'SALES', 'FINANCE', 'SUPPORT', 'TECHNICAL', 'READ_ONLY']);
export const PATCH = withAuth(patchHandler, ['ADMIN', 'SALES', 'FINANCE']);
