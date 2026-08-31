/**
 * Lead Scoring Service — Explainable & Configurable
 * 
 * Scores leads using transparent, weighted signals.
 * Every score decision is explainable — no opaque or discriminatory logic.
 * 
 * Signals:
 * - Business vs Consumer (org name present)
 * - Budget indicator
 * - Quantity
 * - Urgency
 * - Product interest breadth
 * - Location (service area match)
 * - Engagement signals
 * - Repeat visit
 * - Quote behaviour
 */

import { Lead, LeadScoreSignal, LeadScoreResult, LeadScoreTier } from '@/lib/types';

// ===== SCORING CONFIGURATION =====
// All weights are configurable — no hardcoded opaque decisions.

interface ScoringConfig {
  signal: string;
  description: string;
  maxScore: number;
  evaluate: (lead: Lead, engagement?: EngagementData) => { score: number; reasoning: string };
}

export interface EngagementData {
  pagesVisited?: number;
  timeOnSiteMinutes?: number;
  isRepeatVisit?: boolean;
  completedQuote?: boolean;
  abandonedQuote?: boolean;
  cartItemCount?: number;
  usedAITools?: boolean;
}

// Configurable service areas (placeholder — CMS-ready)
const SERVICE_AREAS = ['Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan', 'Kaduna', 'Benin City', 'Warri', 'Calabar', 'Enugu'];

const scoringSignals: ScoringConfig[] = [
  {
    signal: 'business_type',
    description: 'Business vs Consumer (organisation present)',
    maxScore: 15,
    evaluate: (lead) => {
      if (lead.organisation?.name && lead.organisation.name.length > 2) {
        return { score: 15, reasoning: `Organisation "${lead.organisation.name}" identified — B2B lead.` };
      }
      return { score: 3, reasoning: 'No organisation specified — likely individual consumer.' };
    },
  },
  {
    signal: 'budget_indicator',
    description: 'Budget range or order value signals',
    maxScore: 20,
    evaluate: (lead) => {
      const notes = (lead.notes || '').toLowerCase();
      if (notes.includes('enterprise') || notes.includes('premium') || notes.includes('commercial')) {
        return { score: 20, reasoning: 'Enterprise/premium budget language detected in notes.' };
      }
      if (notes.includes('budget') || notes.includes('affordable') || notes.includes('cheapest')) {
        return { score: 5, reasoning: 'Budget-conscious language detected.' };
      }
      if (lead.quantity?.value > 0) {
        return { score: 12, reasoning: 'Quantity specified — structured procurement intent.' };
      }
      return { score: 8, reasoning: 'No explicit budget signals detected.' };
    },
  },
  {
    signal: 'quantity',
    description: 'Order size and volume signals',
    maxScore: 15,
    evaluate: (lead) => {
      const qty = lead.quantity?.value || 0;
      if (qty >= 10000) return { score: 15, reasoning: `Large volume: ${qty} ${lead.quantity?.unit || 'units'}.` };
      if (qty >= 1000) return { score: 12, reasoning: `Medium volume: ${qty} ${lead.quantity?.unit || 'units'}.` };
      if (qty >= 100) return { score: 8, reasoning: `Small volume: ${qty} ${lead.quantity?.unit || 'units'}.` };
      if (qty > 0) return { score: 5, reasoning: `Minimal volume: ${qty} ${lead.quantity?.unit || 'units'}.` };
      return { score: 0, reasoning: 'No quantity specified.' };
    },
  },
  {
    signal: 'urgency',
    description: 'Customer urgency level',
    maxScore: 25,
    evaluate: (lead) => {
      switch (lead.urgency) {
        case 'critical': return { score: 25, reasoning: 'Critical urgency — immediate action required.' };
        case 'high': return { score: 18, reasoning: 'High urgency — prioritise response.' };
        case 'medium': return { score: 10, reasoning: 'Medium urgency — standard timeline.' };
        case 'low': return { score: 3, reasoning: 'Low urgency — planning stage.' };
        default: return { score: 5, reasoning: 'Urgency not specified — defaulting to medium.' };
      }
    },
  },
  {
    signal: 'product_interest',
    description: 'Breadth of product interest',
    maxScore: 15,
    evaluate: (lead) => {
      const count = lead.products?.length || 0;
      if (count >= 3) return { score: 15, reasoning: `Interested in ${count} products — broad procurement scope.` };
      if (count === 2) return { score: 10, reasoning: `Interested in ${count} products.` };
      if (count === 1) return { score: 6, reasoning: `Single product interest: ${lead.products[0]?.productName || 'unspecified'}.` };
      return { score: 2, reasoning: 'No specific products selected.' };
    },
  },
  {
    signal: 'location_match',
    description: 'Location within service areas',
    maxScore: 10,
    evaluate: (lead) => {
      const city = (lead.location?.city || '').toLowerCase();
      const state = (lead.location?.state || '').toLowerCase();
      const match = SERVICE_AREAS.some(area => 
        city.includes(area.toLowerCase()) || state.includes(area.toLowerCase())
      );
      if (match) return { score: 10, reasoning: `Location "${lead.location?.city || lead.location?.state}" is within configured service areas.` };
      if (city || state) return { score: 5, reasoning: `Location "${city || state}" provided but not in primary service areas.` };
      return { score: 0, reasoning: 'No location provided.' };
    },
  },
  {
    signal: 'engagement',
    description: 'Website engagement signals',
    maxScore: 15,
    evaluate: (_lead, engagement) => {
      if (!engagement) return { score: 0, reasoning: 'No engagement data available.' };
      let score = 0;
      const reasons: string[] = [];

      if (engagement.pagesVisited && engagement.pagesVisited >= 5) {
        score += 5;
        reasons.push(`Visited ${engagement.pagesVisited} pages`);
      }
      if (engagement.timeOnSiteMinutes && engagement.timeOnSiteMinutes >= 3) {
        score += 5;
        reasons.push(`Spent ${engagement.timeOnSiteMinutes} minutes on site`);
      }
      if (engagement.usedAITools) {
        score += 5;
        reasons.push('Used AI tools (planner/concierge)');
      }

      return {
        score: Math.min(score, 15),
        reasoning: reasons.length > 0 ? reasons.join('; ') + '.' : 'Low engagement signals.',
      };
    },
  },
  {
    signal: 'repeat_visit',
    description: 'Returning visitor signal',
    maxScore: 15,
    evaluate: (_lead, engagement) => {
      if (engagement?.isRepeatVisit) {
        return { score: 15, reasoning: 'Returning visitor — previously engaged with the platform.' };
      }
      return { score: 0, reasoning: 'First-time visitor or no repeat data available.' };
    },
  },
  {
    signal: 'quote_behaviour',
    description: 'Quote submission behaviour',
    maxScore: 20,
    evaluate: (_lead, engagement) => {
      if (engagement?.completedQuote) {
        return { score: 20, reasoning: 'Completed and submitted a quote request — high intent.' };
      }
      if (engagement?.abandonedQuote) {
        return { score: 8, reasoning: 'Started but abandoned a quote — possible re-engagement opportunity.' };
      }
      if (engagement?.cartItemCount && engagement.cartItemCount > 0) {
        return { score: 12, reasoning: `${engagement.cartItemCount} items in cart — purchase consideration active.` };
      }
      return { score: 0, reasoning: 'No quote or cart activity detected.' };
    },
  },
];

// ===== SCORING ENGINE =====

/**
 * Score a lead with full signal breakdown.
 * Every decision is transparent and explainable.
 */
export function scoreLead(lead: Lead, engagement?: EngagementData): LeadScoreResult {
  const signals: LeadScoreSignal[] = scoringSignals.map(config => {
    const result = config.evaluate(lead, engagement);
    return {
      signal: config.signal,
      description: config.description,
      score: result.score,
      maxScore: config.maxScore,
      reasoning: result.reasoning,
    };
  });

  const totalScore = signals.reduce((sum, s) => sum + s.score, 0);
  const maxPossibleScore = signals.reduce((sum, s) => sum + s.maxScore, 0);

  // Determine tier
  const percentage = totalScore / maxPossibleScore;
  let tier: LeadScoreTier;
  if (percentage >= 0.6) tier = 'HOT';
  else if (percentage >= 0.35) tier = 'WARM';
  else tier = 'COLD';

  // Build human-readable explanation
  const topSignals = signals
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => s.reasoning);

  const explanation = `Lead scored ${totalScore}/${maxPossibleScore} (${tier}). Key factors: ${topSignals.join(' ')}`;

  return {
    totalScore,
    maxPossibleScore,
    tier,
    signals,
    calculatedAt: new Date().toISOString(),
    explanation,
  };
}
