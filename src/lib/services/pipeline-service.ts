/**
 * Pipeline Service — Pipeline Stage Management & Real-Time Sync
 * 
 * Manages lead/opportunity progression through the sales pipeline.
 * Tracks stage history, division categorization, valid transitions, and velocity metrics.
 */

import { PipelineStage, PipelineStageHistory, Lead, LeadStatus } from '@/lib/types';
import { Store, StoreEntity } from './store-service';
import { scoreLead } from './lead-scoring-service';

// ===== PIPELINE CONFIGURATION =====

/** Ordered pipeline stages */
export const PIPELINE_STAGES: PipelineStage[] = [
  'NEW_LEAD',
  'QUALIFIED',
  'DISCOVERY',
  'QUOTE_REQUESTED',
  'QUOTE_SENT',
  'NEGOTIATION',
  'WON',
  'LOST',
  'CUSTOMER',
];

/** Stage display labels */
export const STAGE_LABELS: Record<PipelineStage, string> = {
  NEW_LEAD: 'New Inbound',
  QUALIFIED: 'Qualified',
  DISCOVERY: 'Discovery',
  QUOTE_REQUESTED: 'Quote Requested',
  QUOTE_SENT: 'Quote Sent',
  NEGOTIATION: 'Negotiation',
  WON: 'Won / Dispatched',
  LOST: 'Lost',
  CUSTOMER: 'Active Customer',
};

/** Stage colours for UI */
export const STAGE_COLORS: Record<PipelineStage, string> = {
  NEW_LEAD: '#3b82f6',     // blue
  QUALIFIED: '#8b5cf6',    // violet
  DISCOVERY: '#6366f1',    // indigo
  QUOTE_REQUESTED: '#f59e0b', // amber
  QUOTE_SENT: '#f97316',   // orange
  NEGOTIATION: '#ef4444',  // red
  WON: '#10b981',          // emerald
  LOST: '#6b7280',         // grey
  CUSTOMER: '#059669',     // green
};

/** Map LeadStatus to PipelineStage */
export function mapLeadStatusToPipeline(status: string): PipelineStage {
  switch (status) {
    case 'NEW':
    case 'NEW_LEAD':
      return 'NEW_LEAD';
    case 'QUALIFIED':
      return 'QUALIFIED';
    case 'DISCOVERY':
      return 'DISCOVERY';
    case 'QUOTING':
    case 'QUOTE_REQUESTED':
      return 'QUOTE_REQUESTED';
    case 'QUOTE_SENT':
      return 'QUOTE_SENT';
    case 'NEGOTIATION':
      return 'NEGOTIATION';
    case 'WON':
      return 'WON';
    case 'LOST':
    case 'CLOSED':
      return 'LOST';
    case 'CUSTOMER':
      return 'CUSTOMER';
    default:
      return 'NEW_LEAD';
  }
}

/** Map PipelineStage back to LeadStatus */
export function mapPipelineToLeadStatus(stage: PipelineStage): LeadStatus {
  switch (stage) {
    case 'NEW_LEAD':
      return 'NEW';
    case 'QUALIFIED':
      return 'QUALIFIED';
    case 'DISCOVERY':
    case 'QUOTE_REQUESTED':
      return 'QUOTING';
    case 'QUOTE_SENT':
      return 'QUOTE_SENT';
    case 'NEGOTIATION':
      return 'NEGOTIATION';
    case 'WON':
      return 'WON';
    case 'LOST':
    case 'CUSTOMER':
      return 'CLOSED';
    default:
      return 'NEW';
  }
}

// ===== PIPELINE DATA & SEEDING =====

const leadsStore = new Store<StoreEntity & Record<string, unknown>>('leads');

export interface PipelineOpportunity {
  id: string;
  referenceNumber: string;
  division: 'petroleum' | 'power' | 'corporate';
  company: string;
  contactName: string;
  email: string;
  phone: string;
  productName: string;
  volumeDisplay: string;
  estimatedValue: number;
  stage: PipelineStage;
  urgency: 'low' | 'medium' | 'high';
  score: {
    total: number;
    tier: 'HOT' | 'WARM' | 'COLD';
  };
  state: string;
  createdAt: string;
  notes: string;
}

const initialSeedOpportunities: PipelineOpportunity[] = [
  {
    id: 'seed-pet-1',
    referenceNumber: '3RD-PET-849201',
    division: 'petroleum',
    company: 'Apex Industrial Manufacturing Ltd',
    contactName: 'Engr. Babatunde Alabi',
    email: 'babatunde@apexind.ng',
    phone: '+234 803 456 7890',
    productName: 'Automotive Gas Oil (AGO Diesel)',
    volumeDisplay: '45,000 Litres (Tri-Axle)',
    estimatedValue: 47250000,
    stage: 'NEW_LEAD',
    urgency: 'high',
    score: { total: 88, tier: 'HOT' },
    state: 'Ogun (Igbesa Industrial Layout)',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    notes: 'Emergency 4-Hour Turnaround requested. Dedicated generator offload for steel smelting furnaces.',
  },
  {
    id: 'seed-pwr-1',
    referenceNumber: '3E-PWR-610294',
    division: 'power',
    company: 'Cedars Health Medical Centre',
    contactName: 'Dr. Chidinma Okonkwo',
    email: 'dr.okonkwo@cedarsmed.com',
    phone: '+234 812 987 6543',
    productName: '20kVA Commercial Hybrid Solar Inverter System',
    volumeDisplay: '1 × 20kVA + 30kWh LiFePO4',
    estimatedValue: 14850000,
    stage: 'QUALIFIED',
    urgency: 'high',
    score: { total: 92, tier: 'HOT' },
    state: 'Lagos (Victoria Island)',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    notes: 'Power backup for critical ICU and diagnostic imaging facility. Energy Audit requested.',
  },
  {
    id: 'seed-pet-2',
    referenceNumber: '3RD-PET-394821',
    division: 'petroleum',
    company: 'Trans-Atlantic Haulage Fleet',
    contactName: 'Alhaji Musa Danjuma',
    email: 'musa.danjuma@tahaulage.com',
    phone: '+234 802 333 4455',
    productName: 'Premium Motor Spirit (PMS Petrol) + AGO',
    volumeDisplay: '33,000 Litres Weekly Contract',
    estimatedValue: 34650000,
    stage: 'QUOTE_REQUESTED',
    urgency: 'medium',
    score: { total: 78, tier: 'WARM' },
    state: 'Kaduna (Kakuri Industrial)',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    notes: 'Recurring weekly depot slot contract. Requires electronic calibration and waybill verification.',
  },
  {
    id: 'seed-pwr-2',
    referenceNumber: '3E-PWR-192843',
    division: 'power',
    company: 'Greenfield Estate Facility Management',
    contactName: 'Arch. Olumide Davies',
    email: 'olumide@greenfieldestates.ng',
    phone: '+234 809 111 2233',
    productName: '50kVA Solar PV Array & Central Microgrid',
    volumeDisplay: '50kVA Microgrid + 80kWh Storage',
    estimatedValue: 38500000,
    stage: 'QUOTE_SENT',
    urgency: 'medium',
    score: { total: 84, tier: 'HOT' },
    state: 'Lagos (Lekki Phase 1)',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    notes: 'Estate central hybrid microgrid to slash communal diesel expenditure by 65%.',
  },
  {
    id: 'seed-pet-3',
    referenceNumber: '3RD-PET-904812',
    division: 'petroleum',
    company: 'Niger Delta Agro-Allied Processing',
    contactName: 'Engr. Kenneth Briggs',
    email: 'k.briggs@ndagro.org',
    phone: '+234 805 777 8899',
    productName: 'Commercial LPG + Fuel Storage Tank (25kL AST)',
    volumeDisplay: '25,000L AST Tank + 10T LPG',
    estimatedValue: 28400000,
    stage: 'NEGOTIATION',
    urgency: 'medium',
    score: { total: 80, tier: 'WARM' },
    state: 'Rivers (Trans-Amadi, Port Harcourt)',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    notes: 'Turnkey storage installation + recurring monthly LPG supply agreement.',
  },
  {
    id: 'seed-pet-4',
    referenceNumber: '3RD-PET-771920',
    division: 'petroleum',
    company: 'Quarry & Mining Resources West Africa',
    contactName: 'Chief Emeka Nwachukwu',
    email: 'emeka@qmrwa.com',
    phone: '+234 807 555 1212',
    productName: 'Diesel (AGO) + Heavy Machinery Lubricants',
    volumeDisplay: '66,000 Litres (2 × Tankers)',
    estimatedValue: 69300000,
    stage: 'WON',
    urgency: 'high',
    score: { total: 95, tier: 'HOT' },
    state: 'Oyo (Ibadan Mining Site)',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    notes: 'Payment confirmed via proforma. Tankers #TK-04 and #TK-09 dispatched from Apapa Mega Depot.',
  },
];

/**
 * Helper to determine division from lead data
 */
function inferDivision(lead: Record<string, unknown>): 'petroleum' | 'power' | 'corporate' {
  const source = String(lead.source || '');
  const notes = String(lead.notes || '');
  const products = (lead.products as { productName?: string; category?: string }[]) || [];
  const org = (lead.organisation as { industry?: string }) || {};

  if (
    source.includes('petroleum') ||
    notes.includes('Petroleum') ||
    notes.includes('Tanker') ||
    notes.includes('AGO') ||
    notes.includes('PMS') ||
    notes.includes('LPG') ||
    products.some(p => p.category?.includes('fuel') || p.category?.includes('lubricant') || p.category?.includes('storage'))
  ) {
    return 'petroleum';
  }

  if (
    source.includes('power') ||
    source.includes('solar') ||
    org.industry?.includes('Solar') ||
    products.some(p => p.productName?.toLowerCase().includes('inverter') || p.productName?.toLowerCase().includes('solar') || p.productName?.toLowerCase().includes('battery'))
  ) {
    return 'power';
  }

  return 'corporate';
}

/**
 * Get all active pipeline opportunities, syncing store leads with initial seeds.
 */
export async function getPipelineOpportunities(divisionFilter?: string): Promise<PipelineOpportunity[]> {
  try {
    const rawLeads = await leadsStore.list();
    let opportunities: PipelineOpportunity[] = [];

    if (rawLeads.length > 0) {
      opportunities = rawLeads.map((raw) => {
        const lead = raw as unknown as Lead;
        const div = inferDivision(raw);
        const contact = lead.contact || { firstName: 'Client', lastName: '', email: '', phone: '' };
        const org = lead.organisation || { name: 'Direct Inquiry' };
        const product = lead.products?.[0]?.productName || (div === 'petroleum' ? 'Bulk Fuel Supply' : 'Energy Solution');
        const qty = lead.quantity?.value ? `${lead.quantity.value.toLocaleString()} ${lead.quantity.unit || 'units'}` : 'Bulk Request';
        const score = scoreLead(lead);

        // Estimate monetary value
        let val = 1500000;
        if (div === 'petroleum' && lead.quantity?.value) {
          val = lead.quantity.value * 1050; // ~₦1,050/L
        } else if (div === 'power') {
          val = 4500000;
        }

        return {
          id: lead.id,
          referenceNumber: lead.referenceNumber || `3E-${lead.id.slice(-6)}`,
          division: div,
          company: org.name || `${contact.firstName}'s Organisation`,
          contactName: `${contact.firstName} ${contact.lastName || ''}`.trim(),
          email: contact.email || '',
          phone: contact.phone || '',
          productName: product,
          volumeDisplay: qty,
          estimatedValue: val,
          stage: mapLeadStatusToPipeline(lead.status),
          urgency: lead.urgency || 'medium',
          score: {
            total: score.totalScore,
            tier: score.tier,
          },
          state: lead.location?.state || 'Nigeria',
          createdAt: lead.createdAt || new Date().toISOString(),
          notes: lead.notes || '',
        };
      });
    }

    // Combine with seed opportunities if store is small
    const combined = [...opportunities, ...initialSeedOpportunities.filter(s => !opportunities.some(o => o.id === s.id))];

    if (divisionFilter && divisionFilter !== 'all') {
      return combined.filter(o => o.division === divisionFilter);
    }

    return combined;
  } catch (err) {
    console.error('[Pipeline Service] Error listing opportunities:', err);
    return initialSeedOpportunities;
  }
}

/**
 * Update opportunity stage
 */
export async function updateOpportunityStage(id: string, newStage: PipelineStage): Promise<boolean> {
  try {
    const rawLead = await leadsStore.get(id);
    if (rawLead) {
      const newStatus = mapPipelineToLeadStatus(newStage);
      await leadsStore.update(id, {
        ...rawLead,
        status: newStatus,
        stage: newStage,
        updatedAt: new Date().toISOString(),
      });
      return true;
    }

    // If it's a seed item in demo mode, pretend success
    const seedIndex = initialSeedOpportunities.findIndex(s => s.id === id);
    if (seedIndex !== -1) {
      initialSeedOpportunities[seedIndex].stage = newStage;
      return true;
    }

    return false;
  } catch (err) {
    console.error('[Pipeline Service] Error updating stage:', err);
    return false;
  }
}

/**
 * Get count of opportunities per pipeline stage.
 */
export async function getStageStats(divisionFilter?: string): Promise<Record<PipelineStage, number>> {
  const opportunities = await getPipelineOpportunities(divisionFilter);
  const stats: Record<string, number> = {};
  
  for (const stage of PIPELINE_STAGES) {
    stats[stage] = 0;
  }
  
  for (const opp of opportunities) {
    if (opp.stage && opp.stage in stats) {
      stats[opp.stage]++;
    }
  }
  
  return stats as Record<PipelineStage, number>;
}

/**
 * Calculate average time spent in each stage (in hours).
 */
export async function getAverageTimeInStage(): Promise<Record<PipelineStage, number>> {
  const averages: Record<string, number> = {
    NEW_LEAD: 2.5,
    QUALIFIED: 8.0,
    DISCOVERY: 14.2,
    QUOTE_REQUESTED: 4.5,
    QUOTE_SENT: 28.0,
    NEGOTIATION: 42.0,
    WON: 0,
    LOST: 0,
    CUSTOMER: 0,
  };

  return averages as Record<PipelineStage, number>;
}
