/**
 * Notification Adapter — Email & Dispatch Alerts
 * 
 * Configured for info@3rdenergyservices.com notification dispatch across:
 * - Inbound petroleum & solar leads
 * - Bulk fuel & equipment orders
 * - Pipeline deal transitions
 * - Customer contact enquiries
 */

import { Lead, PowerOrder } from '@/lib/types';
import { generateLeadSummary } from '@/lib/services/lead-service';

export const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'info@3rdenergyservices.com';
export const SENDER_EMAIL = process.env.SENDER_EMAIL || '3RD Energy Dispatch <notifications@3rdenergyservices.com>';

export interface NotificationAdapter {
  sendLeadNotification(lead: Lead): Promise<void>;
  sendOrderNotification(order: PowerOrder): Promise<void>;
  sendStageChangeNotification(opp: { referenceNumber: string; company: string; contactName: string; stage: string; estimatedValue: number }): Promise<void>;
  sendConfirmation(lead: Lead): Promise<void>;
}

/**
 * Universal email dispatcher (Resend API / SMTP Webhook / Logging)
 */
async function dispatchEmail(payload: { to: string; subject: string; html: string; text?: string }) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: SENDER_EMAIL,
          to: payload.to,
          subject: payload.subject,
          html: payload.html,
          text: payload.text,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.warn(`[EMAIL DISPATCH WARNING] Resend API error (${res.status}): ${errorText}`);
      } else {
        console.log(`[EMAIL DISPATCH SUCCESS] Email transmitted to ${payload.to} — Subject: ${payload.subject}`);
      }
    } catch (err) {
      console.error(`[EMAIL DISPATCH ERROR] Failed to send via Resend API:`, err);
    }
  } else {
    // Fallback development/sandbox logger
    console.log(`\n======================================================`);
    console.log(`✉️ [TRANSACTIONAL EMAIL TO: ${payload.to}]`);
    console.log(`SUBJECT: ${payload.subject}`);
    console.log(`TIMESTAMP: ${new Date().toISOString()}`);
    console.log(`======================================================\n`);
  }
}

export class ProductionNotificationAdapter implements NotificationAdapter {
  async sendLeadNotification(lead: Lead): Promise<void> {
    const summary = generateLeadSummary(lead);
    const html = generateLeadEmailHTML(lead);
    const subject = `[ALERT] New ${lead.source.includes('petroleum') ? '🛢️ 3RD Petroleum' : '⚡ 3RD Energy'} Opportunity — ${lead.referenceNumber} (${lead.organisation.name})`;

    await dispatchEmail({
      to: ADMIN_NOTIFICATION_EMAIL,
      subject,
      html,
      text: summary,
    });
  }

  async sendOrderNotification(order: PowerOrder): Promise<void> {
    const subject = `[ORDER CONFIRMED] ${order.orderNumber} — ₦${order.total.toLocaleString()} from ${order.customer.firstName} ${order.customer.lastName}`;
    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="font-family: Arial, sans-serif; background: #0c0c0c; color: #ffffff; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background: #141414; border: 1px solid #333; border-radius: 12px; padding: 24px;">
    <div style="border-bottom: 2px solid #ef4444; padding-bottom: 12px; margin-bottom: 20px;">
      <h2 style="color: #ef4444; margin: 0;">3RD ENERGY GROUP — NEW ORDER</h2>
      <p style="color: #888; margin: 4px 0 0; font-size: 12px;">Order Ref: ${order.orderNumber}</p>
    </div>
    <div style="margin-bottom: 20px;">
      <p><strong>Customer:</strong> ${order.customer.firstName} ${order.customer.lastName}</p>
      <p><strong>Email:</strong> ${order.customer.email}</p>
      <p><strong>Phone:</strong> ${order.customer.phone}</p>
      <p><strong>Total Amount:</strong> ₦${order.total.toLocaleString()}</p>
      <p><strong>Fulfillment:</strong> ${order.fulfillmentType}</p>
      <p><strong>Delivery Address:</strong> ${order.deliveryAddress?.address || 'N/A'}, ${order.deliveryAddress?.state || 'N/A'}</p>
    </div>
    <div style="border-top: 1px solid #222; padding-top: 16px; font-size: 12px; color: #666;">
      Logged automatically for info@3rdenergyservices.com dispatch management.
    </div>
  </div>
</body>
</html>
    `;

    await dispatchEmail({
      to: ADMIN_NOTIFICATION_EMAIL,
      subject,
      html,
      text: `New order ${order.orderNumber} placed for ₦${order.total.toLocaleString()}`,
    });
  }

  async sendStageChangeNotification(opp: { referenceNumber: string; company: string; contactName: string; stage: string; estimatedValue: number }): Promise<void> {
    const subject = `[PIPELINE UPDATE] ${opp.referenceNumber} moved to ${opp.stage} — ${opp.company}`;
    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="font-family: Arial, sans-serif; background: #f8fafc; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px;">
    <h3 style="color: #1e293b; margin: 0 0 12px;">Pipeline Stage Progression</h3>
    <p>Opportunity <strong>${opp.referenceNumber}</strong> for <strong>${opp.company}</strong> (${opp.contactName}) has been updated to stage <strong style="color: #ef4444;">${opp.stage}</strong>.</p>
    <p>Estimated Value: ₦${opp.estimatedValue.toLocaleString()}</p>
    <p style="font-size: 12px; color: #64748b; margin-top: 24px;">3RD Energy Intelligence System</p>
  </div>
</body>
</html>
    `;

    await dispatchEmail({
      to: ADMIN_NOTIFICATION_EMAIL,
      subject,
      html,
      text: `Opportunity ${opp.referenceNumber} moved to ${opp.stage}`,
    });
  }

  async sendConfirmation(lead: Lead): Promise<void> {
    const subject = `Thank you for contacting 3RD Energy — Reference #${lead.referenceNumber}`;
    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${subject}</title></head>
<body style="font-family: Arial, sans-serif; background: #0c0c0c; color: #ffffff; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background: #141414; border: 1px solid #333; border-radius: 12px; padding: 24px;">
    <h2 style="color: #ef4444; margin: 0 0 12px;">3RD ENERGY GROUP</h2>
    <p>Dear ${lead.contact.firstName},</p>
    <p>Your commercial energy inquiry has been received (Ref: <strong>${lead.referenceNumber}</strong>). An operations officer has been assigned and will contact you promptly.</p>
    <p style="color: #888; font-size: 12px; margin-top: 24px;">Dispatch Desk: +234 1 234 5679 | info@3rdenergyservices.com</p>
  </div>
</body>
</html>
    `;

    if (lead.contact.email) {
      await dispatchEmail({
        to: lead.contact.email,
        subject,
        html,
        text: `Your inquiry has been received. Reference #${lead.referenceNumber}`,
      });
    }
  }
}

// ===== EMAIL TEMPLATE GENERATOR =====

export function generateLeadEmailHTML(lead: Lead): string {
  const products = lead.products.map(p => p.productName).join(', ') || 'Not specified';
  const quantity = lead.quantity.value > 0 ? `${lead.quantity.value.toLocaleString()} ${lead.quantity.unit}` : 'Not specified';
  const isPetroleum = lead.source.includes('petroleum') || lead.notes.includes('Petroleum') || lead.notes.includes('Tanker');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Lead — ${lead.referenceNumber}</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #0a0a0a; color: #e5e5e5; padding: 32px; margin: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #141414; border-radius: 12px; overflow: hidden; border: 1px solid #262626; }
    .header { background: ${isPetroleum ? 'linear-gradient(135deg, #991b1b, #dc2626)' : 'linear-gradient(135deg, #065f46, #059669)'}; color: white; padding: 24px 32px; }
    .header h1 { margin: 0; font-size: 18px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    .header p { margin: 6px 0 0; opacity: 0.9; font-size: 13px; font-family: monospace; }
    .body { padding: 32px; font-size: 13px; line-height: 1.6; }
    .section { margin-bottom: 24px; }
    .section h2 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #a3a3a3; margin: 0 0 12px; padding-bottom: 6px; border-bottom: 1px solid #262626; }
    .field { margin-bottom: 8px; }
    .field .label { font-weight: 600; color: #737373; display: inline-block; width: 140px; }
    .field .value { color: #ffffff; font-weight: 500; }
    .badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; font-family: monospace; }
    .badge-urgency { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); }
    .notes-box { background: #000000; border: 1px solid #262626; border-radius: 8px; padding: 12px; font-family: monospace; font-size: 12px; color: #d4d4d4; white-space: pre-wrap; }
    .footer { padding: 16px 32px; background: #0a0a0a; border-top: 1px solid #262626; font-size: 11px; color: #525252; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${isPetroleum ? '🛢️ 3RD Petroleum Lead' : '☀️ 3RD Power & Solar Lead'}</h1>
      <p>REF: ${lead.referenceNumber} • DATE: ${new Date(lead.createdAt).toLocaleString()}</p>
    </div>
    <div class="body">
      <div class="section">
        <h2>Client Profile</h2>
        <div class="field"><span class="label">Contact Name:</span><span class="value">${lead.contact.firstName} ${lead.contact.lastName}</span></div>
        <div class="field"><span class="label">Corporate Email:</span><span class="value">${lead.contact.email}</span></div>
        <div class="field"><span class="label">Phone / WhatsApp:</span><span class="value">${lead.contact.phone}</span></div>
        <div class="field"><span class="label">Organisation:</span><span class="value">${lead.organisation.name}</span></div>
      </div>
      <div class="section">
        <h2>Procurement Specifications</h2>
        <div class="field"><span class="label">Product Grade:</span><span class="value">${products}</span></div>
        <div class="field"><span class="label">Volume / Sizing:</span><span class="value">${quantity}</span></div>
        <div class="field"><span class="label">Discharge / Delivery:</span><span class="value">${lead.location.deliveryType}</span></div>
        <div class="field"><span class="label">Location / State:</span><span class="value">${[lead.location.address, lead.location.city, lead.location.state, lead.location.country].filter(Boolean).join(', ')}</span></div>
        <div class="field"><span class="label">Urgency:</span><span class="badge badge-urgency">${lead.urgency.toUpperCase()}</span></div>
      </div>
      ${lead.notes ? `
      <div class="section">
        <h2>Operational Notes & Payload</h2>
        <div class="notes-box">${lead.notes}</div>
      </div>` : ''}
      <div class="section">
        <h2>Channel Source</h2>
        <div class="field"><span class="label">Channel:</span><span class="value">${lead.source}</span></div>
        <div class="field"><span class="label">Initial Stage:</span><span class="value">${lead.status}</span></div>
      </div>
    </div>
    <div class="footer">
      Automated dispatch alert transmitted to <strong>${ADMIN_NOTIFICATION_EMAIL}</strong>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export const notificationAdapter = new ProductionNotificationAdapter();
