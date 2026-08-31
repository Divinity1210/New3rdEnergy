import { NextRequest, NextResponse } from 'next/server';
import { PowerOrder } from '@/lib/types';
import { createLead } from '@/lib/services/lead-service';
import { crmAdapter } from '@/lib/adapters/crm-adapter';
import { notificationAdapter } from '@/lib/adapters/notification-adapter';

// In-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW = 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a minute.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validation
    if (!body.customer?.firstName || !body.customer?.email || !body.customer?.phone) {
      return NextResponse.json(
        { error: 'Customer name, email, and phone number are required.' },
        { status: 400 }
      );
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty. Please add products to place an order.' },
        { status: 400 }
      );
    }

    const subtotal = body.items.reduce(
      (sum: number, item: { unitPrice: number; quantity: number }) =>
        sum + item.unitPrice * (item.quantity || 1),
      0
    );

    const hasIncludedInstallation = body.items.some(
      (item: { packageDetails?: { includesInstallation?: boolean } }) =>
        item.packageDetails?.includesInstallation
    );

    const installationFee =
      body.installationRequested && !hasIncludedInstallation
        ? Math.max(120000, Math.round(subtotal * 0.08))
        : 0;

    const shippingFee = body.fulfillmentType === 'delivery' ? 35000 : 0;
    const total = subtotal + installationFee + shippingFee;

    const orderNumber = `3E-ORD-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const order: PowerOrder = {
      id: `ord_${Date.now()}`,
      orderNumber,
      customer: {
        firstName: body.customer.firstName,
        lastName: body.customer.lastName || '',
        email: body.customer.email,
        phone: body.customer.phone,
        preferredContact: body.customer.preferredContact || 'email',
      },
      items: body.items,
      subtotal,
      shippingFee,
      installationFee,
      total,
      currency: 'NGN',
      fulfillmentType: body.fulfillmentType || 'delivery',
      deliveryAddress: body.deliveryAddress,
      depotLocation: body.depotLocation,
      installationRequested: Boolean(body.installationRequested),
      installationNotes: body.installationNotes,
      paymentMethod: body.paymentMethod || 'bank_transfer',
      paymentStatus: 'PENDING_MOCK',
      orderStatus: 'PROCESSING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Synchronize to CRM & Notification Adapters
    try {
      const lead = createLead({
        contact: order.customer,
        organisation: {
          name: `${order.customer.firstName} ${order.customer.lastName}`,
          industry: 'Power & Solar Customer',
        },
        products: order.items.map((i) => ({
          productId: i.productId,
          productName: i.product.name,
          category: i.product.category,
        })),
        quantity: { value: order.items.length, unit: 'units' },
        location: {
          address: order.deliveryAddress?.address || 'Depot Collection',
          city: order.deliveryAddress?.city || 'Depot',
          state: order.deliveryAddress?.state || 'Lagos',
          country: 'Nigeria',
          deliveryType: order.fulfillmentType,
        },
        deliveryRequirement: `Order #${order.orderNumber} - Total: ₦${total.toLocaleString()}`,
        requestedDate: new Date().toISOString().split('T')[0],
        urgency: 'high',
        notes: `Fulfillment: ${order.fulfillmentType}. Installation requested: ${order.installationRequested}. Payment Method: ${order.paymentMethod}`,
        attachments: [],
        source: 'website_quote',
      });

      await crmAdapter.syncLead(lead);
      await notificationAdapter.sendConfirmation(lead);
      await notificationAdapter.sendOrderNotification(order);

      // Persist to leadsStore for Admin Pipeline and CRM
      const { Store } = await import('@/lib/services/store-service');
      const leadsStore = new Store<any>('leads');
      await leadsStore.create(lead as any);
    } catch (adapterError) {
      console.warn('CRM/Notification sync warning:', adapterError);
    }

    return NextResponse.json({
      success: true,
      message: 'Order created successfully (Phase 2 Sandbox).',
      order,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while placing your order.' },
      { status: 500 }
    );
  }
}
