/**
 * Analytics Service — Abstraction Layer
 * 
 * Phase 1: Console logging implementation
 * Future: Swap in Plausible, Umami, GA4, or custom analytics
 */

import { AnalyticsEvent, ConversionEvent } from '@/lib/types';

// ===== ANALYTICS SERVICE INTERFACE =====

export interface AnalyticsServiceInterface {
  trackPageView(page: string, metadata?: Record<string, string>): void;
  trackEvent(event: AnalyticsEvent): void;
  trackConversion(conversion: ConversionEvent): void;
  identify?(userId: string, traits?: Record<string, string>): void;
}

// ===== EVENT NAMES CONSTANTS =====

export const ANALYTICS_EVENTS = {
  // Page views
  PAGE_VIEW: 'page_view',
  
  // Solutions
  SOLUTION_VIEW: 'solution_view',
  PRODUCT_VIEW: 'product_view',
  PRODUCT_CLICK: 'product_click',
  
  // Quote engine
  QUOTE_STARTED: 'quote_started',
  QUOTE_STEP_COMPLETED: 'quote_step_completed',
  QUOTE_SUBMITTED: 'quote_submitted',
  QUOTE_ABANDONED: 'quote_abandoned',
  
  // Contact
  CONTACT_FORM_SUBMIT: 'contact_form_submit',
  WHATSAPP_CLICK: 'whatsapp_click',
  
  // AI Assistant
  ASSISTANT_USED: 'energy_assistant_used',
  ASSISTANT_CONVERSION: 'energy_assistant_conversion',
  
  // Navigation
  CTA_CLICK: 'cta_click',
  NAV_CLICK: 'nav_click',
  
  // Content
  INSIGHT_VIEW: 'insight_view',
  INSIGHT_SHARE: 'insight_share',
} as const;

// ===== PHASE 1: CONSOLE ANALYTICS =====

class ConsoleAnalyticsService implements AnalyticsServiceInterface {
  private isDev = process.env.NODE_ENV === 'development';

  trackPageView(page: string, metadata?: Record<string, string>): void {
    if (this.isDev) {
      console.log(`[Analytics] Page View: ${page}`, metadata || '');
    }
    // Future: Send to analytics provider
  }

  trackEvent(event: AnalyticsEvent): void {
    if (this.isDev) {
      console.log(`[Analytics] Event: ${event.event}`, {
        category: event.category,
        label: event.label,
        value: event.value,
        metadata: event.metadata,
      });
    }
    // Future: Send to analytics provider
  }

  trackConversion(conversion: ConversionEvent): void {
    if (this.isDev) {
      console.log(`[Analytics] Conversion: ${conversion.conversionType}`, {
        leadId: conversion.leadId,
        source: conversion.source,
        campaign: conversion.campaign,
      });
    }
    // Future: Send to analytics provider with enhanced data
  }

  identify(userId: string, traits?: Record<string, string>): void {
    if (this.isDev) {
      console.log(`[Analytics] Identify: ${userId}`, traits || '');
    }
    // Future: Send to analytics provider
  }
}

// Singleton
export const analytics: AnalyticsServiceInterface = new ConsoleAnalyticsService();

// Helper to create event objects
export function createEvent(
  eventName: string,
  category: string,
  label?: string,
  metadata?: Record<string, string | number | boolean>
): AnalyticsEvent {
  return {
    event: eventName,
    category,
    label,
    metadata,
    timestamp: new Date().toISOString(),
  };
}
