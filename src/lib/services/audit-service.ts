/**
 * Audit Service — Structured Audit Trail
 * 
 * Every meaningful admin action is logged with:
 * - who (userId, email, role)
 * - what (action, resource, resourceId)
 * - when (timestamp)
 * - where (IP address, user agent)
 * - details (additional context)
 */

import { AuditLogEntry, AuditAction, UserRole, Session } from '@/lib/types';
import { Store, StoreEntity } from './store-service';

const auditStore = new Store<StoreEntity & Record<string, unknown>>('audit-log');

/** Generate audit entry ID */
function generateAuditId(): string {
  return `audit_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

/**
 * Log an admin action to the audit trail.
 */
export async function logAction(params: {
  session: Session;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  details?: string;
  ipAddress: string;
  userAgent?: string;
}): Promise<AuditLogEntry> {
  const entry: AuditLogEntry = {
    id: generateAuditId(),
    userId: params.session.userId,
    userEmail: params.session.email,
    userRole: params.session.role,
    action: params.action,
    resource: params.resource,
    resourceId: params.resourceId,
    details: params.details,
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
    timestamp: new Date().toISOString(),
  };

  await auditStore.create(entry as unknown as StoreEntity & Record<string, unknown>);
  
  // Also log to console for observability
  console.log(`[Audit] ${entry.userEmail} (${entry.userRole}) ${entry.action} ${entry.resource}${entry.resourceId ? ` #${entry.resourceId}` : ''} — ${entry.details || 'no details'}`);

  return entry;
}

/**
 * Query audit log with filters.
 */
export async function queryAuditLog(filters?: {
  userId?: string;
  action?: AuditAction;
  resource?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}): Promise<{ entries: AuditLogEntry[]; total: number }> {
  let entries = (await auditStore.list()) as unknown as AuditLogEntry[];

  // Apply filters
  if (filters?.userId) {
    entries = entries.filter(e => e.userId === filters.userId);
  }
  if (filters?.action) {
    entries = entries.filter(e => e.action === filters.action);
  }
  if (filters?.resource) {
    entries = entries.filter(e => e.resource === filters.resource);
  }
  if (filters?.startDate) {
    entries = entries.filter(e => e.timestamp >= filters.startDate!);
  }
  if (filters?.endDate) {
    entries = entries.filter(e => e.timestamp <= filters.endDate!);
  }

  const total = entries.length;

  // Apply pagination
  const offset = filters?.offset ?? 0;
  const limit = filters?.limit ?? 50;
  entries = entries.slice(offset, offset + limit);

  return { entries, total };
}

/**
 * Get audit log summary (counts by action type).
 */
export async function getAuditSummary(): Promise<Record<AuditAction, number>> {
  const entries = (await auditStore.list()) as unknown as AuditLogEntry[];
  const summary: Record<string, number> = {};
  
  for (const entry of entries) {
    summary[entry.action] = (summary[entry.action] || 0) + 1;
  }

  return summary as Record<AuditAction, number>;
}
