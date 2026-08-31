/**
 * Auth Middleware — API Route Protection
 * 
 * Wraps API route handlers with authentication and role-based access control.
 * Extracts session from cookie, validates JWT, and checks role permissions.
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateSession, getSessionCookieName } from '@/lib/services/auth-service';
import { checkPermission, getDenialReason } from '@/lib/services/rbac-service';
import { Session, UserRole, AuditAction } from '@/lib/types';

export interface AuthenticatedRequest extends NextRequest {
  session: Session;
}

type AuthenticatedHandler = (
  request: NextRequest,
  context: { session: Session; params?: Record<string, string> }
) => Promise<NextResponse>;

/**
 * Wrap an API handler with authentication and optional role/permission checks.
 * 
 * Usage:
 *   export const GET = withAuth(handler, ['ADMIN', 'SALES']);
 *   export const POST = withAuth(handler, ['ADMIN'], 'leads', 'CREATE');
 */
export function withAuth(
  handler: AuthenticatedHandler,
  allowedRoles?: UserRole[],
  resource?: string,
  action?: AuditAction
) {
  return async (request: NextRequest, routeContext?: { params?: Promise<Record<string, string>> }) => {
    try {
      // Extract session token from cookie
      const cookieName = getSessionCookieName();
      const token = request.cookies.get(cookieName)?.value;

      if (!token) {
        return NextResponse.json(
          { error: 'Authentication required. Please log in.', code: 'UNAUTHORIZED' },
          { status: 401 }
        );
      }

      // Validate session
      const session = await validateSession(token);
      if (!session) {
        return NextResponse.json(
          { error: 'Session expired or invalid. Please log in again.', code: 'SESSION_EXPIRED' },
          { status: 401 }
        );
      }

      // Check role restrictions
      if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(session.role)) {
          return NextResponse.json(
            { 
              error: `Access denied. Your role (${session.role}) does not have permission to access this resource.`,
              code: 'FORBIDDEN',
            },
            { status: 403 }
          );
        }
      }

      // Check specific permission
      if (resource && action) {
        if (!checkPermission(session.role, resource, action)) {
          const reason = getDenialReason(session.role, resource, action);
          return NextResponse.json(
            { error: reason, code: 'FORBIDDEN' },
            { status: 403 }
          );
        }
      }

      // Resolve route params if present
      const resolvedParams = routeContext?.params ? await routeContext.params : undefined;

      // Call the authenticated handler
      return handler(request, { session, params: resolvedParams });
    } catch (error) {
      console.error('[Auth Middleware] Error:', error);
      return NextResponse.json(
        { error: 'Authentication system error.', code: 'INTERNAL_ERROR' },
        { status: 500 }
      );
    }
  };
}

/**
 * Helper to get client IP from request headers.
 */
export function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

/**
 * Helper to get user agent from request.
 */
export function getUserAgent(request: NextRequest): string {
  return request.headers.get('user-agent') || 'unknown';
}
