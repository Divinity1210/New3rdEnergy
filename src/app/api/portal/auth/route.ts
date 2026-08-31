/**
 * POST /api/portal/auth — Customer Login / Register / Demo Login
 * GET /api/portal/auth — Customer Session Check
 * DELETE /api/portal/auth — Customer Logout
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  authenticateCustomer, 
  registerCustomer, 
  createCustomerSession, 
  verifyCustomerToken, 
  CUSTOMER_COOKIE_NAME, 
  getCustomerCookieOptions, 
  findCustomerById,
  seedDemoCustomerData
} from '@/lib/services/customer-auth-service';
import { customerProfilesStore } from '@/lib/services/store-service';
import { cookies } from 'next/headers';

// Rate limiting for customer auth
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60 * 1000;

function checkRate(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_ATTEMPTS) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!checkRate(ip)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again in 15 minutes.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { action = 'login', email, password, firstName, lastName, phone, companyName, isDemo } = body;

    // Handle 1-click Demo Customer login
    if (isDemo || (email === 'demo@3rdenergy.com' && (password === 'demo123' || password === 'demo'))) {
      await seedDemoCustomerData();
      const demoUser = await authenticateCustomer('demo@3rdenergy.com', 'demo123');
      if (!demoUser) {
        return NextResponse.json({ error: 'Demo account initializing. Please retry.' }, { status: 500 });
      }

      const token = await createCustomerSession(demoUser);
      const cookieStore = await cookies();
      cookieStore.set(CUSTOMER_COOKIE_NAME, token, getCustomerCookieOptions());

      return NextResponse.json({
        success: true,
        user: {
          id: demoUser.id,
          email: demoUser.email,
          firstName: demoUser.firstName,
          lastName: demoUser.lastName,
          role: 'CUSTOMER',
        },
      });
    }

    // Handle Registration
    if (action === 'register') {
      if (!email || !password || !firstName || !lastName || !phone) {
        return NextResponse.json(
          { error: 'Please provide all required fields (First name, Last name, Email, Phone, Password).' },
          { status: 400 }
        );
      }

      if (password.length < 6) {
        return NextResponse.json(
          { error: 'Password must be at least 6 characters.' },
          { status: 400 }
        );
      }

      const user = await registerCustomer({
        email,
        password,
        firstName,
        lastName,
        phone,
        companyName,
      });

      const token = await createCustomerSession(user);
      const cookieStore = await cookies();
      cookieStore.set(CUSTOMER_COOKIE_NAME, token, getCustomerCookieOptions());

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: 'CUSTOMER',
        },
      });
    }

    // Handle Standard Login
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const user = await authenticateCustomer(email, password);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password. You can also use the 1-click Demo Account.' },
        { status: 401 }
      );
    }

    const token = await createCustomerSession(user);
    const cookieStore = await cookies();
    cookieStore.set(CUSTOMER_COOKIE_NAME, token, getCustomerCookieOptions());

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: 'CUSTOMER',
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Authentication system error.';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(CUSTOMER_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const session = await verifyCustomerToken(token);
    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const user = await findCustomerById(session.userId);
    const profiles = session.userId ? await customerProfilesStore.findBy('userId', session.userId) : [];
    const profile = profiles[0] || null;

    return NextResponse.json({
      authenticated: true,
      user: {
        userId: session.userId,
        email: session.email,
        firstName: session.firstName,
        lastName: session.lastName,
        role: 'CUSTOMER',
        profile,
        phone: user?.phone || '',
      },
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(CUSTOMER_COOKIE_NAME);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Logout failed.' }, { status: 500 });
  }
}
