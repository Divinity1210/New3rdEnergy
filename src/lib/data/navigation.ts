import { NavItem } from '@/lib/types';

// ==========================================
// 1. CORPORATE GROUP NAVIGATION
// ==========================================
export const corporateNavigation: NavItem[] = [
  {
    label: 'About Group',
    href: '/about',
  },
  {
    label: 'Divisions',
    href: '/solutions',
    children: [
      {
        label: '3RD Petroleum',
        href: '/solutions/petroleum',
        description: 'Bulk petroleum distribution, smart storage installations, depot fleet logistics, and commercial fuel supply.',
        icon: 'fuel',
        badge: 'Petroleum Division',
      },
      {
        label: '3RD Power & Solar',
        href: '/solutions/power-solar',
        description: 'Clean energy transition platform — hybrid inverters, LiFePO4 batteries, solar PV arrays, and turnkey engineering.',
        icon: 'sun',
        badge: 'Clean Power Division',
      },
    ],
  },
  {
    label: 'Industries',
    href: '/industries',
  },
  {
    label: 'Projects',
    href: '/projects',
  },
  {
    label: 'Insights & Advisory',
    href: '/insights',
  },
  {
    label: 'Contact Group',
    href: '/contact',
  },
];

// ==========================================
// 2. PETROLEUM STANDALONE NAVIGATION
// ==========================================
export const petroleumNavigation: NavItem[] = [
  {
    label: 'Overview',
    href: '/solutions/petroleum',
  },
  {
    label: 'Fuel Products',
    href: '/solutions/petroleum#products',
    children: [
      {
        label: 'Diesel (AGO) Supply',
        href: '/solutions/petroleum?category=diesel',
        description: 'High-grade Automotive Gas Oil for industrial plants, commercial generators, and heavy fleet.',
        icon: 'fuel',
      },
      {
        label: 'Premium Petrol (PMS)',
        href: '/solutions/petroleum?category=petrol',
        description: 'Quality-certified motor spirit for corporate transport fleets and retail facilities.',
        icon: 'fuel',
      },
      {
        label: 'Commercial LPG',
        href: '/solutions/petroleum?category=lpg',
        description: 'Liquefied petroleum gas for industrial furnaces, thermal manufacturing, and bulk hospitality.',
        icon: 'flame',
      },
      {
        label: 'Industrial Lubricants',
        href: '/solutions/petroleum?category=lubricants',
        description: 'Heavy machinery engine oils, turbine lubricants, and hydraulic fluids.',
        icon: 'droplet',
      },
    ],
  },
  {
    label: 'Storage & Tanks',
    href: '/solutions/petroleum#storage',
  },
  {
    label: 'Fleet Logistics',
    href: '/solutions/petroleum#logistics',
  },
  {
    label: 'Industries Served',
    href: '/industries',
  },
  {
    label: 'Commercial Quote',
    href: '/quote',
  },
];

// ==========================================
// 3. POWER & SOLAR STANDALONE NAVIGATION
// ==========================================
export const powerNavigation: NavItem[] = [
  {
    label: 'Power Hub',
    href: '/solutions/power-solar',
  },
  {
    label: 'Equipment Store',
    href: '/power/products',
    children: [
      {
        label: 'All Power Products',
        href: '/power/products',
        description: 'Browse Tier-1 hybrid inverters, LiFePO4 batteries, solar PV panels, and power stations.',
        icon: 'warehouse',
      },
      {
        label: 'Hybrid Inverters',
        href: '/power/products?category=inverters',
        description: 'Pure sine wave smart inverters (3.5kVA – 50kVA commercial).',
        icon: 'zap',
      },
      {
        label: 'Lithium LiFePO4 Batteries',
        href: '/power/products?category=batteries',
        description: 'High-density rack & wall-mount energy storage (6,000+ lifecycle cycles).',
        icon: 'battery',
      },
      {
        label: 'Turnkey Packages',
        href: '/solutions/power-solar#packages',
        description: 'Complete bundled packages engineered with solar PV arrays and certified installation.',
        icon: 'package',
        badge: 'Turnkey',
      },
    ],
  },
  {
    label: 'AI Sizing Tools',
    href: '/power/planner',
    children: [
      {
        label: 'AI Power Planner',
        href: '/power/planner',
        description: 'Interactive load & runtime sizing engine with verified equipment recommendations.',
        icon: 'zap',
        badge: 'AI Powered',
      },
      {
        label: 'AI System Builder',
        href: '/power/builder',
        description: 'Customize and scale battery capacity, backup hours, and solar array live.',
        icon: 'settings',
      },
      {
        label: 'Power Calculator',
        href: '/power/calculator',
        description: 'Transparent appliance wattage and kWh energy audit calculator.',
        icon: 'calculator',
      },
      {
        label: 'Savings Simulator',
        href: '/power/savings',
        description: 'Compare diesel generator burn costs vs solar hybrid ROI over 1, 5 & 10 years.',
        icon: 'trending-up',
      },
      {
        label: 'AI Product Concierge',
        href: '/power/concierge',
        description: 'Technical equipment compatibility questions answered by our AI energy engineer.',
        icon: 'sparkles',
      },
    ],
  },
  {
    label: 'Certified Installation',
    href: '/power/installation',
  },
  {
    label: 'Solar Education',
    href: '/power/learn',
  },
];

// ==========================================
// 4. FOOTER DEFINITIONS PER ENTITY
// ==========================================

export const corporateFooter = {
  description: 'Powering business through reliable energy solutions. 3RD Energy Group oversees strategic operations across petroleum infrastructure and next-generation clean energy platforms.',
  columns: [
    {
      title: 'Group Holdings',
      links: [
        { label: 'About 3RD Energy', href: '/about' },
        { label: 'Executive Leadership', href: '/about#leadership' },
        { label: 'Corporate Governance', href: '/about#governance' },
        { label: 'Sustainability & ESG', href: '/about#sustainability' },
        { label: 'Group Contact', href: '/contact' },
      ],
    },
    {
      title: 'Operating Divisions',
      links: [
        { label: '3RD Petroleum Division', href: '/solutions/petroleum' },
        { label: '3RD Power & Solar Division', href: '/solutions/power-solar' },
        { label: 'Commercial Fuel Procurement', href: '/quote' },
        { label: 'Solar Equipment Store', href: '/power/products' },
        { label: 'AI Power Sizing Planner', href: '/power/planner' },
      ],
    },
    {
      title: 'Intelligence & Projects',
      links: [
        { label: 'Industry Insights', href: '/insights' },
        { label: 'Energy Infrastructure Projects', href: '/projects' },
        { label: 'Sector Solutions', href: '/industries' },
        { label: 'Advisory & Consulting', href: '/contact' },
      ],
    },
  ],
  socials: [
    { name: 'LinkedIn (Group)', href: 'https://linkedin.com/company/3rdenergy', icon: 'linkedin' },
    { name: 'X / Twitter (Group)', href: 'https://x.com/3rdenergygroup', icon: 'twitter' },
  ],
  contact: {
    email: 'corporate@3rdenergy.com',
    phone: '+234 1 234 5678',
    whatsappText: 'Hello 3RD Energy Group, I would like to make an executive inquiry.',
  },
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Group ESG Charter', href: '/sustainability' },
  ],
};

export const petroleumFooter = {
  description: '3RD Petroleum is the commercial fuel logistics and bulk distribution division of 3RD Energy. Dedicated to uninterrupted fuel supply, smart depot storage, and fleet fueling across Nigeria.',
  columns: [
    {
      title: 'Petroleum Products',
      links: [
        { label: 'Automotive Gas Oil (Diesel)', href: '/solutions/petroleum?category=diesel' },
        { label: 'Premium Motor Spirit (Petrol)', href: '/solutions/petroleum?category=petrol' },
        { label: 'Commercial LPG Supply', href: '/solutions/petroleum?category=lpg' },
        { label: 'Heavy Duty Lubricants', href: '/solutions/petroleum?category=lubricants' },
        { label: 'Request Fuel Quote', href: '/quote' },
      ],
    },
    {
      title: 'Infrastructure & Logistics',
      links: [
        { label: 'Depot Fleet Logistics', href: '/solutions/petroleum#logistics' },
        { label: 'Smart Storage Tank Installation', href: '/solutions/petroleum#storage' },
        { label: 'Tank Cleaning & Bunding', href: '/solutions/petroleum#maintenance' },
        { label: 'Fuel Quality Guarantee', href: '/solutions/petroleum#quality' },
      ],
    },
    {
      title: 'Industries Served',
      links: [
        { label: 'Manufacturing & Plants', href: '/industries/industrial' },
        { label: 'Facility Management', href: '/industries/facility-management' },
        { label: 'Construction & Mining', href: '/industries/construction' },
        { label: 'Commercial Estates', href: '/industries/commercial' },
      ],
    },
  ],
  socials: [
    { name: 'LinkedIn (3RD Petroleum)', href: 'https://linkedin.com/company/3rdenergy-petroleum', icon: 'linkedin' },
    { name: 'X / Twitter (Petroleum Dispatch)', href: 'https://x.com/3rdpetroleum', icon: 'twitter' },
  ],
  contact: {
    email: 'petroleum@3rdenergy.com',
    phone: '+234 1 234 5679',
    dispatchHotline: '+234 800 PETROLEUM',
    whatsappText: 'Hello 3RD Petroleum, I need to order bulk commercial fuel.',
  },
  legal: [
    { label: 'Petroleum Supply Terms', href: '/terms' },
    { label: 'HSE & Safety Standards', href: '/safety' },
    { label: 'Quality Assurance Policy', href: '/compliance' },
  ],
};

export const powerFooter = {
  description: '3RD Power & Solar delivers turnkey clean energy solutions, Tier-1 hybrid inverters, lithium LiFePO4 battery storage, solar PV arrays, and nationwide certified installation.',
  columns: [
    {
      title: 'Clean Energy Products',
      links: [
        { label: 'Hybrid Inverter Store', href: '/power/products?category=inverters' },
        { label: 'Lithium Battery Modules', href: '/power/products?category=batteries' },
        { label: 'Solar PV Panels', href: '/power/products?category=solar' },
        { label: 'Turnkey Solar Packages', href: '/solutions/power-solar#packages' },
        { label: 'Shopping Cart', href: '/power/checkout' },
      ],
    },
    {
      title: 'Engineering & Sizing Tools',
      links: [
        { label: 'AI Power Sizing Planner', href: '/power/planner' },
        { label: 'Live System Builder', href: '/power/builder' },
        { label: 'Appliance Wattage Calculator', href: '/power/calculator' },
        { label: 'Diesel vs. Solar ROI Simulator', href: '/power/savings' },
        { label: 'AI Product Concierge', href: '/power/concierge' },
      ],
    },
    {
      title: 'Installation & Support',
      links: [
        { label: 'Book Certified Site Audit', href: '/power/installation' },
        { label: 'Solar Knowledge & Physics', href: '/power/learn' },
        { label: 'Warranty & RMA Registration', href: '/my-energy/warranty' },
        { label: 'Solar Support Desk', href: '/contact' },
      ],
    },
  ],
  socials: [
    { name: 'LinkedIn (3RD Power)', href: 'https://linkedin.com/company/3rdenergy-power', icon: 'linkedin' },
    { name: 'Instagram (Clean Power)', href: 'https://instagram.com/3rdpowersolar', icon: 'instagram' },
    { name: 'X / Twitter (Solar Tech)', href: 'https://x.com/3rdpowersolar', icon: 'twitter' },
  ],
  contact: {
    email: 'power@3rdenergy.com',
    phone: '+234 1 234 5680',
    engineeringDesk: '+234 800 SOLAR TECH',
    whatsappText: 'Hello 3RD Power & Solar, I would like to size a solar hybrid system for my property.',
  },
  legal: [
    { label: 'Installation Warranty Terms', href: '/terms' },
    { label: 'LiFePO4 Lifecycle Guarantee', href: '/warranty' },
    { label: 'Privacy Policy', href: '/privacy' },
  ],
};

// ==========================================
// BACKWARD COMPATIBILITY EXPORTS
// ==========================================
export const mainNavigation = corporateNavigation;
export const footerNavigation = {
  company: corporateFooter.columns[0].links,
  solutions: corporateFooter.columns[1].links,
  powerPlatform: powerFooter.columns[0].links,
  resources: corporateFooter.columns[2].links,
  legal: corporateFooter.legal,
};

export const WHATSAPP_NUMBER = '+2348000000000';
export const COMPANY_EMAIL = 'advisory@3rdenergy.com';
export const COMPANY_PHONE = '+234 1 234 5678';
