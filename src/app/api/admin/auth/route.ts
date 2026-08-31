/**
 * POST /api/admin/auth — Login
 * DELETE /api/admin/auth — Logout
 * GET /api/admin/auth — Check session
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, createSession, validateSession, getSessionCookieName, getSessionCookieOptions } from '@/lib/services/auth-service';
import { logAction } from '@/lib/services/audit-service';
import { cookies } from 'next/headers';

// Rate limiting for login
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkLoginRate(ip: string): boolean {
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
    
    if (!checkLoginRate(ip)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again in 15 minutes.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const user = await authenticateUser(email, password);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Create session token
    const token = await createSession(user);
    
    // Set session cookie
    const cookieStore = await cookies();
    const cookieOptions = getSessionCookieOptions();
    cookieStore.set(getSessionCookieName(), token, cookieOptions);

    // Audit log
    await logAction({
      session: { userId: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName, iat: Date.now(), exp: Date.now() + 8 * 60 * 60 * 1000 },
      action: 'LOGIN',
      resource: 'auth',
      details: `Login from IP ${ip}`,
      ipAddress: ip,
      userAgent: request.headers.get('user-agent') || undefined,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('[Admin Auth] Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(getSessionCookieName())?.value;
    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const session = await validateSession(token);
    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        userId: session.userId,
        email: session.email,
        firstName: session.firstName,
        lastName: session.lastName,
        role: session.role,
      },
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(getSessionCookieName());
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Logout failed.' }, { status: 500 });
  }
}
