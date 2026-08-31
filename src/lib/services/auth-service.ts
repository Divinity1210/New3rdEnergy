/**
 * Auth Service — JWT Session Management
 * 
 * Uses Web Crypto API for password hashing (no external dependencies).
 * JWT is implemented as base64-encoded JSON with HMAC-SHA256 signature.
 * 
 * Phase 3: Cookie-based sessions.
 * Future: Swap for NextAuth.js, Clerk, or Auth0.
 */

import { User, Session, UserRole } from '@/lib/types';
import { Store, StoreEntity } from './store-service';

// ===== AUTH CONFIGURATION =====

const AUTH_SECRET = process.env.AUTH_SECRET || 'dev-secret-change-in-production-3rd-energy-2026';
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours
const COOKIE_NAME = '3e_session';

// ===== PASSWORD HASHING =====

/** Hash a password using Web Crypto API (SHA-256 with salt) */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomUUID();
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}:${password}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return `${salt}:${hashHex}`;
}

/** Verify a password against a stored hash */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [salt] = storedHash.split(':');
  if (!salt) return false;
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}:${password}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return storedHash === `${salt}:${hashHex}`;
}

// ===== JWT OPERATIONS =====

/** Simple JWT-like token: base64(header).base64(payload).hmac_signature */
async function sign(payload: object): Promise<string> {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(AUTH_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(`${header}.${body}`));
  const sigHex = Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${header}.${body}.${sigHex}`;
}

/** Verify and decode a JWT-like token */
async function verify(token: string): Promise<Session | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, body, sigHex] = parts;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(AUTH_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // Reconstruct signature bytes
    const sigBytes = new Uint8Array((sigHex.match(/.{2}/g) || []).map(h => parseInt(h, 16)));
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(`${header}.${body}`));
    if (!valid) return null;

    const payload = JSON.parse(atob(body)) as Session;

    // Check expiration
    if (payload.exp && Date.now() > payload.exp) return null;

    return payload;
  } catch {
    return null;
  }
}

// ===== SESSION MANAGEMENT =====

/** Create a session token for a user */
export async function createSession(user: User): Promise<string> {
  const now = Date.now();
  const session: Session = {
    userId: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    iat: now,
    exp: now + SESSION_DURATION_MS,
  };
  return sign(session);
}

/** Validate a session token */
export async function validateSession(token: string): Promise<Session | null> {
  return verify(token);
}

/** Get session cookie name */
export function getSessionCookieName(): string {
  return COOKIE_NAME;
}

/** Get session cookie options */
export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_DURATION_MS / 1000, // in seconds
  };
}

// ===== USER MANAGEMENT =====

const usersStore = new Store<StoreEntity & Record<string, unknown>>('users');

/** Find a user by email */
export async function findUserByEmail(email: string): Promise<User | null> {
  const users = await usersStore.findBy('email', email.toLowerCase());
  if (users.length === 0) return null;
  return users[0] as unknown as User;
}

/** Find a user by ID */
export async function findUserById(id: string): Promise<User | null> {
  if (id === 'user_admin_root') {
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@3rdenergy.com').trim().toLowerCase();
    const now = new Date().toISOString();
    return {
      id: 'user_admin_root',
      email: adminEmail,
      passwordHash: '',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN' as UserRole,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
  }

  try {
    const user = await usersStore.get(id);
    if (!user) return null;
    return user as unknown as User;
  } catch {
    return null;
  }
}

/** Authenticate a user with email and password */
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const normalisedEmail = email.trim().toLowerCase();
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@3rdenergy.com').trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  // 1. Direct root admin verification (guarantees access in serverless/stateless Lambda environments)
  if (normalisedEmail === adminEmail) {
    // Check if store has an overridden user
    try {
      const user = await findUserByEmail(normalisedEmail);
      if (user && user.passwordHash) {
        const valid = await verifyPassword(password, user.passwordHash);
        if (valid) {
          try { await usersStore.update(user.id, { lastLoginAt: new Date().toISOString() }); } catch { /* ignore */ }
          return user;
        }
      }
    } catch {
      // fallback to environment credential check below
    }

    // Direct password match against configured admin password
    if (password === adminPassword) {
      const now = new Date().toISOString();
      const rootAdmin: User = {
        id: 'user_admin_root',
        email: adminEmail,
        passwordHash: '',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN' as UserRole,
        isActive: true,
        createdAt: now,
        updatedAt: now,
        lastLoginAt: now,
      };
      return rootAdmin;
    }
  }

  // 2. Standard user verification from store
  try {
    const user = await findUserByEmail(normalisedEmail);
    if (!user || !user.isActive) return null;

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) return null;

    // Update last login
    try {
      await usersStore.update(user.id, { lastLoginAt: new Date().toISOString() });
    } catch { /* ignore */ }

    return user;
  } catch (err) {
    console.error('[Auth] Error querying users store:', err);
    return null;
  }
}

/** Seed default admin user if no users exist */
export async function seedDefaultAdmin(): Promise<void> {
  try {
    const existing = await usersStore.list();
    if (existing.length > 0) return;

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@3rdenergy.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const now = new Date().toISOString();
    const passwordHash = await hashPassword(adminPassword);

    const adminUser = {
      id: 'user_admin_root',
      email: adminEmail.toLowerCase(),
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN' as UserRole,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    await usersStore.create(adminUser as StoreEntity & Record<string, unknown>);
    console.log(`[Auth] Default admin user seeded: ${adminEmail}`);
  } catch (err) {
    console.warn('[Auth] Note on admin user seeding in serverless:', err);
  }
}

// Seed on first import
seedDefaultAdmin().catch(() => {});
