/**
 * CRM Adapter — Interface Pattern
 * 
 * Phase 1: LocalCRMAdapter (in-memory / file-based)
 * Future: HubSpotAdapter, SalesforceAdapter, ZohoAdapter, DynamicsAdapter
 * 
 * The adapter pattern allows swapping CRM implementations without
 * changing business logic or presentation code.
 */

import { Lead, ContactInfo, LeadStatus } from '@/lib/types';

// ===== CRM ADAPTER INTERFACE =====

export interface CRMAdapter {
  /** Create or update a contact in the CRM */
  createContact(contact: ContactInfo): Promise<string>;
  
  /** Create a deal/opportunity from a lead */
  createDeal(lead: Lead): Promise<string>;
  
  /** Update deal status */
  updateDealStatus(dealId: string, status: LeadStatus): Promise<void>;
  
  /** Sync a lead to the CRM (creates contact + deal) */
  syncLead(lead: Lead): Promise<{ contactId: string; dealId: string }>;
  
  /** Check CRM connectivity */
  healthCheck(): Promise<boolean>;
}

// ===== PHASE 1: LOCAL CRM ADAPTER =====

export class LocalCRMAdapter implements CRMAdapter {
  private contacts: Map<string, ContactInfo & { id: string }> = new Map();
  private deals: Map<string, { id: string; leadId: string; status: LeadStatus }> = new Map();

  async createContact(contact: ContactInfo): Promise<string> {
    const id = `contact_${Date.now()}`;
    this.contacts.set(id, { ...contact, id });
    console.log(`[LocalCRM] Contact created: ${id} — ${contact.firstName} ${contact.lastName}`);
    return id;
  }

  async createDeal(lead: Lead): Promise<string> {
    const dealId = `deal_${Date.now()}`;
    this.deals.set(dealId, { id: dealId, leadId: lead.id, status: lead.status });
    console.log(`[LocalCRM] Deal created: ${dealId} — ${lead.referenceNumber}`);
    return dealId;
  }

  async updateDealStatus(dealId: string, status: LeadStatus): Promise<void> {
    const deal = this.deals.get(dealId);
    if (deal) {
      deal.status = status;
      this.deals.set(dealId, deal);
      console.log(`[LocalCRM] Deal ${dealId} status updated to: ${status}`);
    }
  }

  async syncLead(lead: Lead): Promise<{ contactId: string; dealId: string }> {
    const contactId = await this.createContact(lead.contact);
    const dealId = await this.createDeal(lead);
    return { contactId, dealId };
  }

  async healthCheck(): Promise<boolean> {
    return true;
  }
}

// ===== FUTURE: HUBSPOT ADAPTER (SKELETON) =====
/*
export class HubSpotCRMAdapter implements CRMAdapter {
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async createContact(contact: ContactInfo): Promise<string> {
    // POST to HubSpot Contacts API
    throw new Error('Not implemented');
  }

  async createDeal(lead: Lead): Promise<string> {
    // POST to HubSpot Deals API
    throw new Error('Not implemented');
  }

  async updateDealStatus(dealId: string, status: LeadStatus): Promise<void> {
    // PATCH to HubSpot Deals API
    throw new Error('Not implemented');
  }

  async syncLead(lead: Lead): Promise<{ contactId: string; dealId: string }> {
    const contactId = await this.createContact(lead.contact);
    const dealId = await this.createDeal(lead);
    return { contactId, dealId };
  }

  async healthCheck(): Promise<boolean> {
    // GET HubSpot API status
    throw new Error('Not implemented');
  }
}
*/

// ===== CRM FACTORY =====

export type CRMProvider = 'local' | 'hubspot' | 'salesforce' | 'zoho' | 'dynamics';

export function createCRMAdapter(provider: CRMProvider = 'local'): CRMAdapter {
  switch (provider) {
    case 'local':
      return new LocalCRMAdapter();
    // Future implementations:
    // case 'hubspot': return new HubSpotCRMAdapter(process.env.HUBSPOT_API_KEY!);
    // case 'salesforce': return new SalesforceCRMAdapter(process.env.SF_TOKEN!);
    default:
      return new LocalCRMAdapter();
  }
}

// Default instance
export const crmAdapter = createCRMAdapter();
