'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// ===== ICON COMPONENT =====
// Inline SVG icons to avoid external dependencies.
// Extensible — add new icons as needed.

const iconPaths: Record<string, React.ReactNode> = {
  fuel: (
    <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0H5m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 6.5h6M9 11h6m-6 4.5h6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  flame: (
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  droplets: (
    <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05zM16.7 19.85c3.08 0 5.57-2.54 5.57-5.67 0-1.62-.79-3.15-2.38-4.45S16.71 6.63 16.3 4.6c-.41 2.03-1.59 3.95-3.2 5.24s-2.38 2.83-2.38 4.45c.01 3.07 2.5 5.56 5.58 5.56z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  truck: (
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2m10 0H9m5 0h2m0 0a2 2 0 1 0 4 0m-4 0a2 2 0 1 1 4 0M9 18a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m9-13h2l3 4v5h-2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  warehouse: (
    <path d="M22 20V8l-10-6L2 8v12M2 20h20M6 12h4m-4 4h4m4-4h4m-4 4h4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  wrench: (
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  chart: (
    <path d="M3 3v18h18M7 16l4-4 4 4 6-6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  building: (
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2M10 6h4M10 10h4M10 14h4M10 18h4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  factory: (
    <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16zM17 18h1M12 18h1M7 18h1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  settings: (
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  landmark: (
    <path d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2l8 5H4l8-5z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  hardhat: (
    <path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2zM10 15V6.5a3.5 3.5 0 0 1 7 0V15M4 15v-5a8 8 0 0 1 16 0v5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  'hard-hat': (
    <path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2zM10 15V6.5a3.5 3.5 0 0 1 7 0V15M4 15v-5a8 8 0 0 1 16 0v5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  sun: (
    <><circle cx="12" cy="12" r="4" strokeWidth="1.5" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" strokeWidth="1.5" strokeLinecap="round" /></>
  ),
  'arrow-right': (
    <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  'chevron-right': (
    <path d="M9 18l6-6-6-6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  'chevron-down': (
    <path d="M6 9l6 6 6-6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  check: (
    <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  ),
  tag: (
    <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><line x1="7" y1="7" x2="7.01" y2="7" strokeWidth="1.5" strokeLinecap="round" /></>
  ),
  'tag-label': (
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  package: (
    <><path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></>
  ),
  check: (
    <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  ),
  x: (
    <path d="M18 6L6 18M6 6l12 12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  menu: (
    <path d="M4 12h16M4 6h16M4 18h16" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  phone: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  mail: (
    <><rect x="2" y="4" width="20" height="16" rx="2" strokeWidth="1.5" /><path d="M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></>
  ),
  'map-pin': (
    <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" strokeWidth="1.5" /><circle cx="12" cy="10" r="3" strokeWidth="1.5" /></>
  ),
  clock: (
    <><circle cx="12" cy="12" r="10" strokeWidth="1.5" /><path d="M12 6v6l4 2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></>
  ),
  upload: (
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  file: (
    <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></>
  ),
  sparkles: (
    <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  shield: (
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  users: (
    <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="9" cy="7" r="4" strokeWidth="1.5" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></>
  ),
  target: (
    <><circle cx="12" cy="12" r="10" strokeWidth="1.5" /><circle cx="12" cy="12" r="6" strokeWidth="1.5" /><circle cx="12" cy="12" r="2" strokeWidth="1.5" /></>
  ),
  zap: (
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  'message-circle': (
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  whatsapp: (
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" fill="currentColor" strokeWidth="0" />
  ),
  'external-link': (
    <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></>
  ),
  search: (
    <><circle cx="11" cy="11" r="8" strokeWidth="1.5" /><path d="M21 21l-4.35-4.35" strokeWidth="1.5" strokeLinecap="round" /></>
  ),
  'bar-chart': (
    <path d="M12 20V10M18 20V4M6 20v-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  calendar: (
    <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="1.5" /><path d="M16 2v4M8 2v4M3 10h18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></>
  ),
  globe: (
    <><circle cx="12" cy="12" r="10" strokeWidth="1.5" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" strokeWidth="1.5" /></>
  ),
  handshake: (
    <path d="M11 17a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1zM2 7l4.41-2.94A2 2 0 0 1 7.52 4h1.96a2 2 0 0 1 1.37.54L14 7M22 7l-4.41-2.94A2 2 0 0 0 16.48 4h-1.96a2 2 0 0 0-1.37.54L10 7M6 12V7h12v5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  'clipboard-list': (
    <><rect x="8" y="2" width="8" height="4" rx="1" ry="1" strokeWidth="1.5" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 11h4M12 16h4M8 11h.01M8 16h.01" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></>
  ),
  'trending-up': (
    <path d="M22 7l-8.5 8.5-5-5L2 17" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  droplet: (
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  grid: (
    <><rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="1.5" /><rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="1.5" /><rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="1.5" /><rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="1.5" /></>
  ),
  'shield-check': (
    <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M9 12l2 2 4-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></>
  ),
  'file-text': (
    <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></>
  ),
  'arrow-up-right': (
    <path d="M7 17L17 7M7 7h10v10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  filter: (
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  'book-open': (
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  'share-2': (
    <><circle cx="18" cy="5" r="3" strokeWidth="1.5" /><circle cx="6" cy="12" r="3" strokeWidth="1.5" /><circle cx="18" cy="19" r="3" strokeWidth="1.5" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" strokeWidth="1.5" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" strokeWidth="1.5" /></>
  ),
  'check-circle': (
    <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><polyline points="22 4 12 14.01 9 11.01" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></>
  ),
  calculator: (
    <><rect x="4" y="2" width="16" height="20" rx="2" strokeWidth="1.5" /><line x1="8" y1="6" x2="16" y2="6" strokeWidth="1.5" /><line x1="16" y1="14" x2="16" y2="18" strokeWidth="1.5" /><path d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M8 18h.01M12 18h.01" strokeWidth="2" strokeLinecap="round" /></>
  ),
  gauge: (
    <><path d="M12 14l4-4" strokeWidth="1.5" strokeLinecap="round" /><path d="M3.34 19a10 10 0 1 1 17.32 0" strokeWidth="1.5" strokeLinecap="round" /></>
  ),
  activity: (
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  flask: (
    <path d="M9 3h6M10 9l-5.8 9.7a2 2 0 0 0 1.7 3h12.2a2 2 0 0 0 1.7-3L14 9V3h-4v6z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  download: (
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  sliders: (
    <><line x1="4" y1="21" x2="4" y2="14" strokeWidth="1.5" /><line x1="4" y1="10" x2="4" y2="3" strokeWidth="1.5" /><line x1="12" y1="21" x2="12" y2="12" strokeWidth="1.5" /><line x1="12" y1="8" x2="12" y2="3" strokeWidth="1.5" /><line x1="20" y1="21" x2="20" y2="16" strokeWidth="1.5" /><line x1="20" y1="12" x2="20" y2="3" strokeWidth="1.5" /><line x1="1" y1="14" x2="7" y2="14" strokeWidth="1.5" /><line x1="9" y1="8" x2="15" y2="8" strokeWidth="1.5" /><line x1="17" y1="16" x2="23" y2="16" strokeWidth="1.5" /></>
  ),
  layers: (
    <><polygon points="12 2 2 7 12 12 22 7 12 2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><polyline points="2 17 12 22 22 17" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><polyline points="2 12 12 17 22 12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></>
  ),
  'alert-triangle': (
    <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><line x1="12" y1="9" x2="12" y2="13" strokeWidth="1.5" /><line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2" strokeLinecap="round" /></>
  ),
};

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 24, className, strokeWidth }: IconProps) {
  const path = iconPaths[name];
  if (!path) return null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth || 1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('shrink-0', className)}
      aria-hidden="true"
    >
      {path}
    </svg>
  );
}
