/**
 * Pipeline Service — Pipeline Stage Management
 * 
 * Manages lead/opportunity progression through the sales pipeline.
 * Tracks stage history, valid transitions, and velocity metrics.
 */

import { PipelineStage, PipelineStageHistory } from '@/lib/types';
import { Store, StoreEntity } from './store-service';

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
  NEW_LEAD: 'New Lead',
  QUALIFIED: 'Qualified',
  DISCOVERY: 'Discovery',
  QUOTE_REQUESTED: 'Quote Requested',
  QUOTE_SENT: 'Quote Sent',
  NEGOTIATION: 'Negotiation',
  WON: 'Won',
  LOST: 'Lost',
  CUSTOMER: 'Customer',
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

/** Valid stage transitions */
const validTransitions: Record<PipelineStage, PipelineStage[]> = {
  NEW_LEAD: ['QUALIFIED', 'LOST'],
  QUALIFIED: ['DISCOVERY', 'QUOTE_REQUESTED', 'LOST'],
  DISCOVERY: ['QUOTE_REQUESTED', 'LOST'],
  QUOTE_REQUESTED: ['QUOTE_SENT', 'LOST'],
  QUOTE_SENT: ['NEGOTIATION', 'WON', 'LOST'],
  NEGOTIATION: ['WON', 'LOST'],
  WON: ['CUSTOMER'],
  LOST: ['NEW_LEAD'], // Allow re-opening lost leads
  CUSTOMER: [], // Terminal state
};

// ===== PIPELINE OPERATIONS =====

/**
 * Check if a stage transition is valid.
 */
export function canTransitionStage(from: PipelineStage, to: PipelineStage): boolean {
  return validTransitions[from]?.includes(to) ?? false;
}

/**
 * Get valid next stages from current stage.
 */
export function getNextStages(current: PipelineStage): PipelineStage[] {
  return validTransitions[current] || [];
}

/**
 * Create a new stage history entry.
 */
export function createStageEntry(stage: PipelineStage, changedBy: string, notes?: string): PipelineStageHistory {
  return {
    stage,
    enteredAt: new Date().toISOString(),
    changedBy,
    notes,
  };
}

/**
 * Transition to a new stage, updating the history array.
 */
export function transitionStage(
  currentStage: PipelineStage,
  newStage: PipelineStage,
  history: PipelineStageHistory[],
  changedBy: string,
  notes?: string
): { stage: PipelineStage; history: PipelineStageHistory[] } {
  if (!canTransitionStage(currentStage, newStage)) {
    throw new Error(`Invalid transition from ${currentStage} to ${newStage}. Valid: ${getNextStages(currentStage).join(', ')}`);
  }

  // Close the current stage entry
  const updatedHistory = history.map(entry => {
    if (entry.stage === currentStage && !entry.exitedAt) {
      return { ...entry, exitedAt: new Date().toISOString() };
    }
    return entry;
  });

  // Add new stage entry
  updatedHistory.push(createStageEntry(newStage, changedBy, notes));

  return { stage: newStage, history: updatedHistory };
}

// ===== PIPELINE METRICS =====

const opportunitiesStore = new Store<StoreEntity & Record<string, unknown>>('opportunities');

/**
 * Get count of opportunities per pipeline stage.
 */
export async function getStageStats(): Promise<Record<PipelineStage, number>> {
  const opportunities = await opportunitiesStore.list();
  const stats: Record<string, number> = {};
  
  for (const stage of PIPELINE_STAGES) {
    stats[stage] = 0;
  }
  
  for (const opp of opportunities) {
    const stage = (opp as Record<string, unknown>).stage as string;
    if (stage && stage in stats) {
      stats[stage]++;
    }
  }
  
  return stats as Record<PipelineStage, number>;
}

/**
 * Calculate average time spent in each stage (in hours).
 */
export async function getAverageTimeInStage(): Promise<Record<PipelineStage, number>> {
  const opportunities = await opportunitiesStore.list();
  const stageTimes: Record<string, number[]> = {};
  
  for (const stage of PIPELINE_STAGES) {
    stageTimes[stage] = [];
  }

  for (const opp of opportunities) {
    const history = (opp as Record<string, unknown>).stageHistory as PipelineStageHistory[] | undefined;
    if (!history) continue;

    for (const entry of history) {
      if (entry.enteredAt && entry.exitedAt) {
        const hours = (new Date(entry.exitedAt).getTime() - new Date(entry.enteredAt).getTime()) / (1000 * 60 * 60);
        if (stageTimes[entry.stage]) {
          stageTimes[entry.stage].push(hours);
        }
      }
    }
  }

  const averages: Record<string, number> = {};
  for (const [stage, times] of Object.entries(stageTimes)) {
    averages[stage] = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  }

  return averages as Record<PipelineStage, number>;
}
