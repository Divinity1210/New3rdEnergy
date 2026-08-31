/**
 * Customer Auth Middleware — API Protection for My Energy Customer Portal
 * 
 * Verifies the customer session token (from cookie or Authorization Bearer header
 * for future native iOS/Android mobile clients).
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyCustomerToken, CUSTOMER_COOKIE_NAME } from '@/lib/services/customer-auth-service';
import { CustomerSession } from '@/lib/types';

export type AuthenticatedCustomerHandler = (
  request: NextRequest,
  context: { session: CustomerSession; params?: Record<string, string> }
) => Promise<NextResponse>;

export function withCustomerAuth(handler: AuthenticatedCustomerHandler) {
  return async (request: NextRequest, routeContext?: { params?: Promise<Record<string, string>> }) => {
    try {
      // 1. Check cookie first (Web portal)
      let token = request.cookies.get(CUSTOMER_COOKIE_NAME)?.value;

      // 2. Check Authorization Bearer header (for mobile apps / API clients)
      if (!token) {
        const authHeader = request.headers.get('authorization');
        if (authHeader?.startsWith('Bearer ')) {
          token = authHeader.substring(7);
        }
      }

      if (!token) {
        return NextResponse.json(
          { error: 'Customer authentication required. Please sign in to My Energy.', code: 'UNAUTHORIZED' },
          { status: 401 }
        );
      }

      const session = await verifyCustomerToken(token);
      if (!session) {
        return NextResponse.json(
          { error: 'Customer session expired or invalid. Please sign in again.', code: 'SESSION_EXPIRED' },
          { status: 401 }
        );
      }

      const resolvedParams = routeContext?.params ? await routeContext.params : undefined;
      return handler(request, { session, params: resolvedParams });
    } catch (error) {
      console.error('[CustomerAuthMiddleware] Error:', error);
      return NextResponse.json(
        { error: 'Customer authentication system error.', code: 'INTERNAL_ERROR' },
        { status: 500 }
      );
    }
  };
}
