/**
 * Automation Service — Configurable Follow-up Rules
 * 
 * All automations generate draft communications for human approval.
 * Nothing is auto-sent without explicit review.
 */

import { AutomationRule, AutomationAction, AutomationTrigger, AutomationActionStatus } from '@/lib/types';
import { Store, StoreEntity } from './store-service';

// ===== AUTOMATION RULES =====

export const automationRules: AutomationRule[] = [
  {
    id: 'rule-quote-reminder',
    trigger: 'quote_reminder',
    name: 'Quote Follow-up Reminder',
    description: 'Sends a reminder 3 days after a quote is sent without a response.',
    delayHours: 72,
    enabled: true,
    template: `Dear {{contactName}},\n\nWe wanted to follow up on the quote (Ref: {{referenceNumber}}) we sent regarding your energy requirements.\n\nIf you have any questions or would like to discuss the proposal, please don't hesitate to reach out.\n\nBest regards,\n3rd Energy Team`,
    channel: 'email',
  },
  {
    id: 'rule-lead-follow-up',
    trigger: 'lead_follow_up',
    name: 'New Lead Follow-up',
    description: 'Follow up 24 hours after a new lead if no action has been taken.',
    delayHours: 24,
    enabled: true,
    template: `Dear {{contactName}},\n\nThank you for your interest in 3rd Energy's solutions. We received your enquiry (Ref: {{referenceNumber}}) and wanted to reach out personally.\n\nCould you share a convenient time for a brief call to discuss your requirements?\n\nBest regards,\n3rd Energy Team`,
    channel: 'email',
  },
  {
    id: 'rule-abandoned-enquiry',
    trigger: 'abandoned_enquiry',
    name: 'Abandoned Enquiry Recovery',
    description: 'Re-engage leads with no activity for 7 days after initial contact.',
    delayHours: 168,
    enabled: true,
    template: `Dear {{contactName}},\n\nWe noticed your recent enquiry about energy solutions hasn't progressed. We'd love to help find the right solution for your needs.\n\nWould you like to schedule a quick consultation?\n\nBest regards,\n3rd Energy Team`,
    channel: 'email',
  },
  {
    id: 'rule-abandoned-cart',
    trigger: 'abandoned_cart',
    name: 'Abandoned Cart Recovery',
    description: 'Remind customers who left items in their cart after 4 hours.',
    delayHours: 4,
    enabled: true,
    template: `Dear Customer,\n\nYou left some items in your 3rd Energy cart. Your selected power solutions are still available.\n\nComplete your order or contact us if you have any questions about the equipment.\n\nBest regards,\n3rd Energy Team`,
    channel: 'email',
  },
  {
    id: 'rule-installation-followup',
    trigger: 'installation_follow_up',
    name: 'Post-Installation Follow-up',
    description: 'Check in 7 days after installation completion.',
    delayHours: 168,
    enabled: true,
    template: `Dear {{contactName}},\n\nIt has been a week since your system installation. We hope everything is running smoothly.\n\nIf you have any questions about your equipment or need technical support, our team is here to help.\n\nBest regards,\n3rd Energy Technical Team`,
    channel: 'email',
  },
  {
    id: 'rule-review-request',
    trigger: 'review_request',
    name: 'Review & Feedback Request',
    description: 'Request a review 30 days after order completion.',
    delayHours: 720,
    enabled: true,
    template: `Dear {{contactName}},\n\nIt has been a month since your 3rd Energy purchase. We'd love to hear about your experience.\n\nYour feedback helps us improve our products and services for customers like you.\n\nBest regards,\n3rd Energy Team`,
    channel: 'email',
  },
  {
    id: 'rule-reorder-reminder',
    trigger: 'reorder_reminder',
    name: 'Reorder Reminder',
    description: 'Remind petroleum customers to reorder based on estimated consumption.',
    delayHours: 720, // 30 days — configurable per customer
    enabled: true,
    template: `Dear {{contactName}},\n\nBased on your previous order, it may be time to schedule your next fuel delivery.\n\nWould you like to place a reorder or discuss your current requirements?\n\nBest regards,\n3rd Energy Supply Team`,
    channel: 'email',
  },
];

// ===== AUTOMATION ACTION MANAGEMENT =====

const actionsStore = new Store<StoreEntity & Record<string, unknown>>('automation-actions');

function generateActionId(): string {
  return `auto_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

/**
 * Create a new automation action (pending human review).
 */
export async function createAutomationAction(params: {
  ruleId: string;
  trigger: AutomationTrigger;
  entityType: 'lead' | 'order' | 'cart' | 'installation';
  entityId: string;
  contactEmail: string;
  contactName: string;
  referenceNumber?: string;
}): Promise<AutomationAction> {
  const rule = automationRules.find(r => r.id === params.ruleId);
  if (!rule) throw new Error(`Automation rule ${params.ruleId} not found.`);
  if (!rule.enabled) throw new Error(`Automation rule ${params.ruleId} is disabled.`);

  const now = new Date();
  const scheduledFor = new Date(now.getTime() + rule.delayHours * 60 * 60 * 1000);

  // Populate template with available data
  const draftContent = rule.template
    .replace(/\{\{contactName\}\}/g, params.contactName)
    .replace(/\{\{referenceNumber\}\}/g, params.referenceNumber || 'N/A');

  const action: AutomationAction = {
    id: generateActionId(),
    ruleId: params.ruleId,
    trigger: params.trigger,
    entityType: params.entityType,
    entityId: params.entityId,
    contactEmail: params.contactEmail,
    contactName: params.contactName,
    subject: rule.name,
    draftContent,
    status: 'PENDING',
    scheduledFor: scheduledFor.toISOString(),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  await actionsStore.create(action as unknown as StoreEntity & Record<string, unknown>);
  console.log(`[Automation] Created ${rule.name} action for ${params.contactEmail} — scheduled for ${scheduledFor.toISOString()}`);

  return action;
}

/**
 * Get all pending automation actions.
 */
export async function getPendingActions(): Promise<AutomationAction[]> {
  const actions = await actionsStore.list();
  return (actions as unknown as AutomationAction[]).filter(a => a.status === 'PENDING');
}

/**
 * Get all automation actions with optional status filter.
 */
export async function getActions(status?: AutomationActionStatus): Promise<AutomationAction[]> {
  const actions = await actionsStore.list();
  if (status) {
    return (actions as unknown as AutomationAction[]).filter(a => a.status === status);
  }
  return actions as unknown as AutomationAction[];
}

/**
 * Approve an automation action (marks for sending).
 */
export async function approveAction(actionId: string, approvedBy: string): Promise<AutomationAction | null> {
  const updated = await actionsStore.update(actionId, {
    status: 'APPROVED',
    approvedBy,
    approvedAt: new Date().toISOString(),
  });
  if (!updated) return null;
  console.log(`[Automation] Action ${actionId} approved by ${approvedBy}`);
  return updated as unknown as AutomationAction;
}

/**
 * Dismiss an automation action.
 */
export async function dismissAction(actionId: string, dismissedBy: string): Promise<AutomationAction | null> {
  const updated = await actionsStore.update(actionId, {
    status: 'DISMISSED',
    approvedBy: dismissedBy,
    approvedAt: new Date().toISOString(),
  });
  if (!updated) return null;
  console.log(`[Automation] Action ${actionId} dismissed by ${dismissedBy}`);
  return updated as unknown as AutomationAction;
}

/**
 * Update draft content of an action.
 */
export async function updateActionDraft(actionId: string, newContent: string): Promise<AutomationAction | null> {
  const updated = await actionsStore.update(actionId, {
    draftContent: newContent,
  });
  return updated as unknown as AutomationAction | null;
}

/**
 * Get automation rules (for display).
 */
export function getAutomationRules(): AutomationRule[] {
  return automationRules;
}
