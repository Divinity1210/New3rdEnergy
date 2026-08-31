/**
 * RBAC Service — Role-Based Access Control
 * 
 * Defines roles, permissions, and access control checks.
 * Every denial is explainable for audit logging.
 */

import { UserRole, AuditAction } from '@/lib/types';

// ===== PERMISSION MATRIX =====

/**
 * Maps each role to the resources and actions it can perform.
 * Structure: { [role]: { [resource]: AuditAction[] } }
 */
const permissionMatrix: Record<UserRole, Record<string, AuditAction[]>> = {
  ADMIN: {
    // Admin can do everything
    dashboard: ['VIEW'],
    leads: ['VIEW', 'CREATE', 'UPDATE', 'DELETE', 'EXPORT'],
    contacts: ['VIEW', 'CREATE', 'UPDATE', 'DELETE', 'EXPORT'],
    companies: ['VIEW', 'CREATE', 'UPDATE', 'DELETE', 'EXPORT'],
    opportunities: ['VIEW', 'CREATE', 'UPDATE', 'DELETE'],
    quotes: ['VIEW', 'CREATE', 'UPDATE', 'DELETE', 'APPROVE'],
    orders: ['VIEW', 'CREATE', 'UPDATE', 'DELETE', 'EXPORT'],
    installations: ['VIEW', 'CREATE', 'UPDATE', 'DELETE'],
    automations: ['VIEW', 'CREATE', 'UPDATE', 'APPROVE', 'DISMISS'],
    knowledge: ['VIEW', 'CREATE', 'UPDATE', 'DELETE'],
    ai: ['VIEW', 'GENERATE_AI'],
    audit: ['VIEW', 'EXPORT'],
    users: ['VIEW', 'CREATE', 'UPDATE', 'DELETE'],
    pipeline: ['VIEW', 'UPDATE'],
    insights: ['VIEW', 'GENERATE_AI'],
    settings: ['VIEW', 'UPDATE'],
  },
  MARKETING: {
    dashboard: ['VIEW'],
    leads: ['VIEW', 'EXPORT'],
    contacts: ['VIEW'],
    companies: ['VIEW'],
    opportunities: ['VIEW'],
    knowledge: ['VIEW', 'CREATE', 'UPDATE'],
    ai: ['VIEW', 'GENERATE_AI'],
    pipeline: ['VIEW'],
    insights: ['VIEW', 'GENERATE_AI'],
    automations: ['VIEW', 'CREATE', 'UPDATE'],
  },
  SALES: {
    dashboard: ['VIEW'],
    leads: ['VIEW', 'CREATE', 'UPDATE', 'EXPORT'],
    contacts: ['VIEW', 'CREATE', 'UPDATE'],
    companies: ['VIEW', 'CREATE', 'UPDATE'],
    opportunities: ['VIEW', 'CREATE', 'UPDATE'],
    quotes: ['VIEW', 'CREATE', 'UPDATE'],
    orders: ['VIEW', 'CREATE', 'UPDATE'],
    installations: ['VIEW', 'CREATE', 'UPDATE'],
    automations: ['VIEW', 'APPROVE', 'DISMISS'],
    knowledge: ['VIEW'],
    ai: ['VIEW', 'GENERATE_AI'],
    pipeline: ['VIEW', 'UPDATE'],
    insights: ['VIEW'],
  },
  TECHNICAL: {
    dashboard: ['VIEW'],
    leads: ['VIEW'],
    installations: ['VIEW', 'UPDATE'],
    knowledge: ['VIEW', 'CREATE', 'UPDATE'],
    ai: ['VIEW', 'GENERATE_AI'],
    orders: ['VIEW'],
  },
  SUPPORT: {
    dashboard: ['VIEW'],
    leads: ['VIEW'],
    contacts: ['VIEW', 'UPDATE'],
    companies: ['VIEW'],
    orders: ['VIEW'],
    installations: ['VIEW'],
    knowledge: ['VIEW', 'CREATE', 'UPDATE'],
    ai: ['VIEW', 'GENERATE_AI'],
  },
  FINANCE: {
    dashboard: ['VIEW'],
    leads: ['VIEW'],
    quotes: ['VIEW', 'APPROVE'],
    orders: ['VIEW', 'UPDATE', 'EXPORT'],
    pipeline: ['VIEW'],
    insights: ['VIEW'],
  },
  READ_ONLY: {
    dashboard: ['VIEW'],
    leads: ['VIEW'],
    contacts: ['VIEW'],
    companies: ['VIEW'],
    opportunities: ['VIEW'],
    orders: ['VIEW'],
    pipeline: ['VIEW'],
    knowledge: ['VIEW'],
  },
};

// ===== ACCESS CONTROL =====

/**
 * Check if a role has permission to perform an action on a resource.
 */
export function checkPermission(role: UserRole, resource: string, action: AuditAction): boolean {
  const rolePerms = permissionMatrix[role];
  if (!rolePerms) return false;

  const resourcePerms = rolePerms[resource];
  if (!resourcePerms) return false;

  return resourcePerms.includes(action);
}

/**
 * Get a human-readable denial reason for audit logging.
 */
export function getDenialReason(role: UserRole, resource: string, action: AuditAction): string {
  const rolePerms = permissionMatrix[role];
  if (!rolePerms) {
    return `Role "${role}" is not recognised in the permission matrix.`;
  }

  const resourcePerms = rolePerms[resource];
  if (!resourcePerms) {
    return `Role "${role}" does not have access to the "${resource}" resource.`;
  }

  return `Role "${role}" can access "${resource}" but is not permitted to perform "${action}". Allowed actions: ${resourcePerms.join(', ')}.`;
}

/**
 * Check if a role can access a given admin page.
 */
export function canAccessPage(role: UserRole, page: string): boolean {
  const pageResourceMap: Record<string, string> = {
    '/admin': 'dashboard',
    '/admin/leads': 'leads',
    '/admin/pipeline': 'pipeline',
    '/admin/contacts': 'contacts',
    '/admin/automations': 'automations',
    '/admin/knowledge': 'knowledge',
    '/admin/audit': 'audit',
    '/admin/insights': 'insights',
  };

  const resource = pageResourceMap[page];
  if (!resource) return false;

  return checkPermission(role, resource, 'VIEW');
}

/**
 * Get all accessible resources for a role (for navigation rendering).
 */
export function getAccessibleResources(role: UserRole): string[] {
  const rolePerms = permissionMatrix[role];
  if (!rolePerms) return [];
  return Object.keys(rolePerms);
}

/**
 * Get all roles that have a specific permission.
 */
export function getRolesWithPermission(resource: string, action: AuditAction): UserRole[] {
  const roles: UserRole[] = [];
  for (const [role, perms] of Object.entries(permissionMatrix)) {
    if (perms[resource]?.includes(action)) {
      roles.push(role as UserRole);
    }
  }
  return roles;
}
