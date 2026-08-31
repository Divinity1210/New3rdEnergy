/**
 * Lead Service
 * 
 * Handles lead creation, validation, reference number generation,
 * and storage abstraction. Phase 1 uses in-memory/file storage.
 * Future phases will integrate with CRM adapters.
 */

import { Lead, LeadStatus, ContactInfo, OrganisationInfo, ProductSelection, DeliveryLocation, LeadUrgency, LeadSource, ContactFormData } from '@/lib/types';

// Reference number generator
function generateReferenceNumber(): string {
  const prefix = '3E';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// Generate unique ID
function generateId(): string {
  return `lead_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

export function createLead(params: {
  contact: ContactInfo;
  organisation: OrganisationInfo;
  products: ProductSelection[];
  quantity: { value: number; unit: string };
  location: DeliveryLocation;
  deliveryRequirement: string;
  requestedDate: string;
  urgency: LeadUrgency;
  notes: string;
  attachments: { id: string; fileName: string; fileSize: number; fileType: string; url: string }[];
  source: LeadSource;
  campaign?: string;
}): Lead {
  const now = new Date().toISOString();
  
  return {
    id: generateId(),
    referenceNumber: generateReferenceNumber(),
    contact: params.contact,
    organisation: params.organisation,
    industry: params.organisation.industry,
    products: params.products,
    quantity: params.quantity,
    location: params.location,
    deliveryRequirement: params.deliveryRequirement,
    requestedDate: params.requestedDate,
    urgency: params.urgency,
    notes: params.notes,
    attachments: params.attachments.map(a => ({ ...a, uploadedAt: now })),
    source: params.source,
    campaign: params.campaign || '',
    status: 'NEW' as LeadStatus,
    assignedOwner: '',
    createdAt: now,
    updatedAt: now,
  };
}

export function createContactLead(params: ContactFormData): Lead {
  const now = new Date().toISOString();

  return {
    id: generateId(),
    referenceNumber: generateReferenceNumber(),
    contact: {
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email,
      phone: params.phone,
      preferredContact: params.preferredContact,
    },
    organisation: {
      name: params.organisation,
      industry: '',
    },
    industry: '',
    products: [],
    quantity: { value: 0, unit: '' },
    location: {
      address: '',
      city: '',
      state: '',
      country: '',
      deliveryType: 'flexible',
    },
    deliveryRequirement: '',
    requestedDate: '',
    urgency: 'medium',
    notes: `Subject: ${params.subject}\n\n${params.message}`,
    attachments: [],
    source: 'website_contact',
    campaign: '',
    status: 'NEW',
    assignedOwner: '',
    createdAt: now,
    updatedAt: now,
  };
}

// Status transition validation
const validTransitions: Record<LeadStatus, LeadStatus[]> = {
  NEW: ['QUALIFIED', 'CLOSED'],
  QUALIFIED: ['QUOTING', 'CLOSED'],
  QUOTING: ['QUOTE_SENT', 'CLOSED'],
  QUOTE_SENT: ['NEGOTIATION', 'WON', 'LOST'],
  NEGOTIATION: ['WON', 'LOST'],
  WON: ['CLOSED'],
  LOST: ['CLOSED'],
  CLOSED: [],
};

export function canTransition(from: LeadStatus, to: LeadStatus): boolean {
  return validTransitions[from]?.includes(to) ?? false;
}

export function updateLeadStatus(lead: Lead, newStatus: LeadStatus): Lead {
  if (!canTransition(lead.status, newStatus)) {
    throw new Error(`Cannot transition from ${lead.status} to ${newStatus}`);
  }
  return {
    ...lead,
    status: newStatus,
    updatedAt: new Date().toISOString(),
  };
}

// Lead summary for email notifications
export function generateLeadSummary(lead: Lead): string {
  const products = lead.products.map(p => p.productName).join(', ') || 'Not specified';
  const quantity = lead.quantity.value > 0 ? `${lead.quantity.value} ${lead.quantity.unit}` : 'Not specified';
  
  return `
═══════════════════════════════════════════
  NEW LEAD — ${lead.referenceNumber}
═══════════════════════════════════════════

CONTACT
  Name: ${lead.contact.firstName} ${lead.contact.lastName}
  Email: ${lead.contact.email}
  Phone: ${lead.contact.phone}
  Preferred Contact: ${lead.contact.preferredContact || 'Not specified'}

ORGANISATION
  Company: ${lead.organisation.name}
  Industry: ${lead.organisation.industry || 'Not specified'}

REQUIREMENTS
  Products: ${products}
  Quantity: ${quantity}
  Delivery: ${lead.location.deliveryType}
  Location: ${[lead.location.address, lead.location.city, lead.location.state, lead.location.country].filter(Boolean).join(', ')}
  Requested Date: ${lead.requestedDate || 'Flexible'}
  Urgency: ${lead.urgency.toUpperCase()}

NOTES
  ${lead.notes || 'None'}

ATTACHMENTS
  ${lead.attachments.length > 0 ? lead.attachments.map(a => a.fileName).join('\n  ') : 'None'}

SOURCE: ${lead.source}
SUBMITTED: ${new Date(lead.createdAt).toLocaleString()}
═══════════════════════════════════════════
  `.trim();
}
