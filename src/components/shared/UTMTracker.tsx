'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * UTM Tracker — Captures UTM parameters from URL and stores in cookies.
 * 
 * Captures: utm_source, utm_medium, utm_campaign, utm_term, utm_content
 * Storage: Cookie (30-day expiry) for cross-session attribution.
 * 
 * Mount in root layout to track all page views.
 */
export function UTMTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    try {
      const utmSource = searchParams.get('utm_source');
      const utmMedium = searchParams.get('utm_medium');
      const utmCampaign = searchParams.get('utm_campaign');
      const utmTerm = searchParams.get('utm_term');
      const utmContent = searchParams.get('utm_content');

      // Only store if at least one UTM parameter is present
      if (utmSource || utmMedium || utmCampaign) {
        const utmData = {
          source: utmSource || undefined,
          medium: utmMedium || undefined,
          campaign: utmCampaign || undefined,
          term: utmTerm || undefined,
          content: utmContent || undefined,
          capturedAt: new Date().toISOString(),
        };

        // Store as cookie (30 days)
        const expires = new Date();
        expires.setDate(expires.getDate() + 30);
        document.cookie = `3e_utm=${encodeURIComponent(JSON.stringify(utmData))};expires=${expires.toUTCString()};path=/;SameSite=Lax`;

        console.log('[UTM] Captured:', utmData);
      }
    } catch (error) {
      // Non-critical — fail silently
      console.warn('[UTM] Failed to capture UTM data:', error);
    }
  }, [searchParams]);

  return null; // This component renders nothing
}

/**
 * Get stored UTM data from cookie.
 */
export function getStoredUTMData(): Record<string, string> | null {
  try {
    const match = document.cookie.match(/3e_utm=([^;]+)/);
    if (match) {
      return JSON.parse(decodeURIComponent(match[1]));
    }
  } catch {
    // Silent failure
  }
  return null;
}
