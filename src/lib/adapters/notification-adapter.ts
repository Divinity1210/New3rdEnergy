/**
 * Notification Adapter — Abstraction Layer
 * 
 * Phase 1: Console/log notifications + email template generation
 * Future: Transactional email (Resend/SendGrid), WhatsApp Business API, SMS
 */

import { Lead } from '@/lib/types';
import { generateLeadSummary } from '@/lib/services/lead-service';

// ===== NOTIFICATION ADAPTER INTERFACE =====

export interface NotificationAdapter {
  /** Notify the sales team about a new lead */
  sendLeadNotification(lead: Lead): Promise<void>;
  
  /** Send confirmation to the customer */
  sendConfirmation(lead: Lead): Promise<void>;
}

// ===== PHASE 1: CONSOLE NOTIFICATION =====

export class ConsoleNotificationAdapter implements NotificationAdapter {
  async sendLeadNotification(lead: Lead): Promise<void> {
    const summary = generateLeadSummary(lead);
    console.log(`\n[NOTIFICATION] New Lead Received\n${summary}\n`);
    
    // In production Phase 1, this would also queue an email
    // via the /api/notify endpoint
  }

  async sendConfirmation(lead: Lead): Promise<void> {
    console.log(`[NOTIFICATION] Confirmation sent to ${lead.contact.email} — Ref: ${lead.referenceNumber}`);
  }
}

// ===== EMAIL TEMPLATE GENERATION =====

export function generateLeadEmailHTML(lead: Lead): string {
  const products = lead.products.map(p => p.productName).join(', ') || 'Not specified';
  const quantity = lead.quantity.value > 0 ? `${lead.quantity.value} ${lead.quantity.unit}` : 'Not specified';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Lead — ${lead.referenceNumber}</title>
  <style>
    body { font-family: 'Inter', Arial, sans-serif; background: #f1f5f9; padding: 32px; margin: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .header { background: linear-gradient(135deg, #b91c1c, #ea580c); color: white; padding: 24px 32px; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 700; }
    .header p { margin: 4px 0 0; opacity: 0.9; font-size: 14px; }
    .body { padding: 32px; }
    .section { margin-bottom: 24px; }
    .section h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin: 0 0 12px; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0; }
    .field { margin-bottom: 8px; }
    .field .label { font-weight: 600; color: #334155; display: inline; }
    .field .value { color: #1e293b; display: inline; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; }
    .badge-new { background: #dbeafe; color: #1d4ed8; }
    .badge-urgency { background: #fef3c7; color: #92400e; }
    .footer { padding: 16px 32px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Lead Received</h1>
      <p>Reference: ${lead.referenceNumber} • ${new Date(lead.createdAt).toLocaleDateString()}</p>
    </div>
    <div class="body">
      <div class="section">
        <h2>Contact Information</h2>
        <div class="field"><span class="label">Name: </span><span class="value">${lead.contact.firstName} ${lead.contact.lastName}</span></div>
        <div class="field"><span class="label">Email: </span><span class="value">${lead.contact.email}</span></div>
        <div class="field"><span class="label">Phone: </span><span class="value">${lead.contact.phone}</span></div>
        <div class="field"><span class="label">Organisation: </span><span class="value">${lead.organisation.name}</span></div>
      </div>
      <div class="section">
        <h2>Requirements</h2>
        <div class="field"><span class="label">Products: </span><span class="value">${products}</span></div>
        <div class="field"><span class="label">Quantity: </span><span class="value">${quantity}</span></div>
        <div class="field"><span class="label">Delivery: </span><span class="value">${lead.location.deliveryType}</span></div>
        <div class="field"><span class="label">Location: </span><span class="value">${[lead.location.city, lead.location.state, lead.location.country].filter(Boolean).join(', ') || 'Not specified'}</span></div>
        <div class="field"><span class="label">Requested Date: </span><span class="value">${lead.requestedDate || 'Flexible'}</span></div>
        <div class="field"><span class="label">Urgency: </span><span class="badge badge-urgency">${lead.urgency.toUpperCase()}</span></div>
      </div>
      ${lead.notes ? `
      <div class="section">
        <h2>Additional Notes</h2>
        <p style="color: #334155; white-space: pre-wrap;">${lead.notes}</p>
      </div>` : ''}
      <div class="section">
        <h2>Source</h2>
        <div class="field"><span class="label">Channel: </span><span class="value">${lead.source}</span></div>
        <div class="field"><span class="label">Status: </span><span class="badge badge-new">${lead.status}</span></div>
      </div>
    </div>
    <div class="footer">
      3rd Energy Digital Platform • This is an automated notification
    </div>
  </div>
</body>
</html>
  `.trim();
}

// ===== FACTORY =====

export function createNotificationAdapter(): NotificationAdapter {
  // Future: switch based on environment variable
  // const provider = process.env.NOTIFICATION_PROVIDER;
  return new ConsoleNotificationAdapter();
}

export const notificationAdapter = createNotificationAdapter();
