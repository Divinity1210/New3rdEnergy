import { Industry } from '@/lib/types';

/**
 * Industries Data
 * 
 * CMS-READY: These should be managed through a CMS in future phases.
 * PLACEHOLDER: Descriptions should be verified against actual 3rd Energy market segments.
 */
export const industries: Industry[] = [
  {
    id: 'commercial',
    slug: 'commercial',
    name: 'Commercial',
    description: 'Energy solutions designed for commercial businesses including retail, hospitality, office complexes, and commercial estates. We understand the operational demands of commercial enterprises and provide reliable fuel supply, cost management, and energy consulting to keep your business running efficiently.',
    shortDescription: 'Reliable energy for retail, hospitality, and commercial enterprises.',
    icon: 'building',
    image: '/images/industry-commercial.jpg',
    challenges: [
      'Unpredictable fuel costs',
      'Supply reliability concerns',
      'Managing multiple energy sources',
      'Regulatory compliance requirements',
    ],
    solutions: [
      'Scheduled fuel delivery with predictable pricing',
      'Dedicated account management',
      'Multi-site supply coordination',
      'Compliance support and documentation',
    ],
    order: 1,
  },
  {
    id: 'industrial',
    slug: 'industrial',
    name: 'Industrial',
    description: 'Heavy-duty energy supply for manufacturing plants, processing facilities, and industrial operations. We provide the scale, reliability, and technical expertise needed to support continuous industrial operations with uninterrupted fuel supply and storage solutions.',
    shortDescription: 'Heavy-duty energy for manufacturing and industrial operations.',
    icon: 'factory',
    image: '/images/industry-industrial.jpg',
    challenges: [
      'High-volume fuel requirements',
      'Continuous operation demands',
      'Storage and safety compliance',
      'Cost management at scale',
    ],
    solutions: [
      'Bulk fuel supply with flexible scheduling',
      'Industrial storage system design and installation',
      'Safety-certified handling and delivery',
      'Volume-based pricing and consumption analytics',
    ],
    order: 2,
  },
  {
    id: 'facility-management',
    slug: 'facility-management',
    name: 'Facility Management',
    description: 'Comprehensive energy partnerships for facility management companies overseeing multiple properties and sites. We simplify fuel procurement, delivery coordination, and consumption tracking across your portfolio.',
    shortDescription: 'Multi-site energy management for FM companies.',
    icon: 'settings',
    image: '/images/industry-facility.jpg',
    challenges: [
      'Coordinating supply across multiple sites',
      'Budget forecasting and control',
      'Vendor consolidation',
      'Reporting and accountability',
    ],
    solutions: [
      'Centralised procurement and billing',
      'Multi-site delivery scheduling',
      'Consumption reporting dashboards',
      'Single point of contact for all energy needs',
    ],
    order: 3,
  },
  {
    id: 'institutional',
    slug: 'institutional',
    name: 'Institutional',
    description: 'Energy solutions for government agencies, educational institutions, healthcare facilities, and other public sector organisations. We provide transparent procurement processes, compliant delivery, and reliable supply for mission-critical operations.',
    shortDescription: 'Transparent energy supply for public sector and institutions.',
    icon: 'landmark',
    image: '/images/industry-institutional.jpg',
    challenges: [
      'Procurement compliance requirements',
      'Budget constraints and transparency',
      'Mission-critical supply reliability',
      'Long-term contract management',
    ],
    solutions: [
      'Compliant procurement processes',
      'Transparent pricing and billing',
      'Priority supply guarantees',
      'Long-term partnership frameworks',
    ],
    order: 4,
  },
  {
    id: 'construction',
    slug: 'construction',
    name: 'Construction & Mining',
    description: 'On-site fuel supply and mobile refuelling services for construction projects, mining operations, and large-scale infrastructure developments. We deliver directly to your site with flexible scheduling to match project timelines.',
    shortDescription: 'On-site fuelling for construction and mining projects.',
    icon: 'hardhat',
    image: '/images/industry-construction.jpg',
    challenges: [
      'Remote site access',
      'Variable demand patterns',
      'Multiple equipment types',
      'Environmental compliance',
    ],
    solutions: [
      'Mobile refuelling services',
      'On-site storage solutions',
      'Flexible delivery scheduling',
      'Environmental compliance support',
    ],
    order: 5,
  },
];
