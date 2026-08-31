/**
 * Knowledge Base — Central Structured Knowledge Repository
 * 
 * All AI systems retrieve from this knowledge base.
 * Aggregates data from existing product catalogues, education content,
 * and configurable CMS fields for policies and company information.
 * 
 * Supports: products, FAQs, services, policies, installation guides,
 * maintenance guidance, company information, and documents.
 */

import { KBArticle, KBCategory } from '@/lib/types';
import { petroleumProducts } from './petroleum-products';
import { powerProducts, powerPackages } from './power-products';

// ===== KNOWLEDGE BASE ARTICLES =====

const knowledgeArticles: KBArticle[] = [
  // --- Products (generated from existing catalogues) ---
  ...petroleumProducts.map(p => ({
    id: `kb-petrol-${p.id}`,
    title: p.name,
    slug: `petroleum-${p.slug}`,
    category: 'products' as KBCategory,
    content: `${p.description}\n\nFeatures:\n${p.features.map(f => `- ${f}`).join('\n')}\n\nIndustries served: ${p.industries.join(', ')}`,
    summary: p.shortDescription,
    tags: ['petroleum', p.category, ...p.industries],
    isPublic: true,
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })),
  ...powerProducts.map(p => ({
    id: `kb-power-${p.id}`,
    title: p.name,
    slug: `power-${p.slug}`,
    category: 'products' as KBCategory,
    content: `${p.description}\n\nWhy This Product: ${p.whyThisProduct}\nWhat It Does: ${p.whatItDoes}\nWho It Is For: ${p.whoItIsFor}\n\nFeatures:\n${p.features.map(f => `- ${f}`).join('\n')}\n\nWhat It Can Support:\n${p.whatItCanSupport.map(s => `- ${s}`).join('\n')}`,
    summary: p.shortDescription,
    tags: ['power', 'solar', p.category],
    isPublic: true,
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })),
  ...powerPackages.map(p => ({
    id: `kb-package-${p.id}`,
    title: p.name,
    slug: `package-${p.slug}`,
    category: 'products' as KBCategory,
    content: `${p.description}\n\nTier: ${p.tier}\nRating: ${p.ratingKva} kVA\nBattery: ${p.batteryKwh} kWh\nSolar: ${p.solarKwp} kWp\nEstimated Backup: ${p.estimatedBackupHours} hours\nIdeal For: ${p.idealFor}\nIncludes Installation: ${p.includesInstallation ? 'Yes' : 'No'}\nWarranty: ${p.warrantyYears} years`,
    summary: p.tagline,
    tags: ['power', 'solar', 'package', p.tier],
    isPublic: true,
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })),

  // --- FAQs ---
  {
    id: 'kb-faq-delivery',
    title: 'Delivery & Logistics',
    slug: 'delivery-logistics-faq',
    category: 'faqs',
    content: `3rd Energy offers delivery services across Nigeria. Delivery timelines and costs vary by location, product type, and order size. For petroleum products, delivery is typically within 24-72 hours for service areas. For power equipment, standard delivery is 3-7 business days. Express delivery may be available at additional cost. Contact our team for specific delivery quotes.`,
    summary: 'Information about delivery timelines, costs, and service areas.',
    tags: ['delivery', 'logistics', 'shipping'],
    isPublic: true,
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb-faq-ordering',
    title: 'How to Place an Order',
    slug: 'how-to-order-faq',
    category: 'faqs',
    content: `Orders can be placed through our website, by contacting our sales team via phone, email, or WhatsApp. For petroleum products, use our Quote Request form for custom pricing. For power equipment, browse our online catalogue and add items to your cart. All orders are confirmed by our team before processing. Payment options and terms will be communicated during order confirmation.`,
    summary: 'Step-by-step guide to placing orders through various channels.',
    tags: ['ordering', 'how-to', 'payment'],
    isPublic: true,
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb-faq-installation',
    title: 'Installation Services',
    slug: 'installation-services-faq',
    category: 'faqs',
    content: `3rd Energy provides certified installation services for all power and solar equipment. Our installation team conducts a technical site audit before installation to ensure optimal system performance and safety compliance. Installation includes: site assessment, electrical wiring, equipment mounting, system configuration, testing, and handover training. A site inspection booking can be made through our website.`,
    summary: 'Details about certified installation services and the process.',
    tags: ['installation', 'certified', 'site-audit'],
    isPublic: true,
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb-faq-warranty',
    title: 'Warranty & Support',
    slug: 'warranty-support-faq',
    category: 'faqs',
    content: `Warranty terms vary by product and manufacturer. Specific warranty information is listed on each product page. For warranty claims, contact our support team with your order reference number and a description of the issue. Our technical team will assess the claim and arrange repair or replacement as per the manufacturer's warranty terms.`,
    summary: 'Warranty terms and how to make warranty claims.',
    tags: ['warranty', 'support', 'claims'],
    isPublic: true,
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb-faq-solar-sizing',
    title: 'Solar System Sizing Guide',
    slug: 'solar-sizing-guide',
    category: 'faqs',
    content: `Sizing a solar/inverter system requires understanding your daily energy consumption (kWh), peak power demand (kW), desired backup autonomy (hours), and available roof/ground space for solar panels. Use our AI Power Planner tool to input your appliances and get an automated system recommendation. For commercial installations or complex requirements, our technical team can conduct a detailed energy audit. Key considerations: LiFePO4 batteries offer 6000+ cycles vs 500-800 for gel batteries. Solar panel sizing depends on location, orientation, and shading.`,
    summary: 'How to properly size a solar and inverter system for your needs.',
    tags: ['solar', 'sizing', 'energy-audit', 'guide'],
    isPublic: true,
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // --- Services ---
  {
    id: 'kb-service-petroleum',
    title: 'Petroleum Solutions',
    slug: 'petroleum-solutions-service',
    category: 'services',
    content: `3rd Energy provides comprehensive petroleum solutions including: bulk fuel supply (diesel, petrol, LPG), fuel storage tank installation and maintenance, fuel logistics and delivery management, lubricant supply, and fuel management consulting. Our services cover commercial, industrial, construction, healthcare, hospitality, and institutional sectors across Nigeria.`,
    summary: 'Overview of petroleum supply, storage, logistics, and management services.',
    tags: ['petroleum', 'fuel', 'services', 'overview'],
    isPublic: true,
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb-service-power',
    title: 'Power & Solar Solutions',
    slug: 'power-solar-solutions-service',
    category: 'services',
    content: `3rd Energy's Power Platform offers a complete digital power solutions experience. Products include smart hybrid inverters, LiFePO4 lithium batteries, monocrystalline bifacial solar panels, portable power stations, and turnkey installation packages. Services include: AI-powered system sizing, equipment sales, certified nationwide installation, system maintenance, and technical consulting. All equipment is sourced from reputable manufacturers with valid warranties.`,
    summary: 'Complete power and solar product range and installation services.',
    tags: ['power', 'solar', 'inverter', 'battery', 'installation'],
    isPublic: true,
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // --- Company Info (CMS-ready placeholders) ---
  {
    id: 'kb-company-about',
    title: 'About 3rd Energy',
    slug: 'about-3rd-energy',
    category: 'company-info',
    content: `3rd Energy is a trusted energy solutions provider serving commercial and industrial operations across Nigeria. We combine deep energy industry expertise with digital innovation to deliver reliable petroleum supply, smart power solutions, and certified installation services. Our mission is to power businesses through reliable, efficient, and sustainable energy solutions.`,
    summary: 'Company overview and mission statement.',
    tags: ['company', 'about', 'mission'],
    isPublic: true,
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb-company-contact',
    title: 'Contact Information',
    slug: 'contact-information',
    category: 'company-info',
    content: `Contact 3rd Energy through the following channels:\n\n- Website: Contact form at /contact\n- WhatsApp: Available via the chat button on our website\n- Email: advisory@3rdenergy.com\n\nOur team is available during business hours and aims to respond to all enquiries within one business day.`,
    summary: 'Contact channels and response times.',
    tags: ['contact', 'support', 'channels'],
    isPublic: true,
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // --- Policies ---
  {
    id: 'kb-policy-returns',
    title: 'Returns & Refund Policy',
    slug: 'returns-refund-policy',
    category: 'policies',
    content: `Return and refund policies are subject to the specific terms of each product and order. For equipment returns, items must be in original condition and packaging. Contact our support team with your order reference for return authorisation. Refund processing times may vary. This policy may be updated — check our website for the latest terms.`,
    summary: 'General returns and refund policy information.',
    tags: ['returns', 'refund', 'policy'],
    isPublic: true,
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// ===== KNOWLEDGE BASE SEARCH =====

/**
 * Search the knowledge base by query text.
 * Returns ranked results based on title, content, and tag matches.
 */
export function searchKnowledge(query: string, category?: KBCategory): KBArticle[] {
  const normalised = query.toLowerCase();
  const words = normalised.split(/\s+/).filter(w => w.length > 2);

  let articles = knowledgeArticles.filter(a => !a.deletedAt);

  if (category) {
    articles = articles.filter(a => a.category === category);
  }

  // Score each article by relevance
  const scored = articles.map(article => {
    let score = 0;
    const titleLower = article.title.toLowerCase();
    const contentLower = article.content.toLowerCase();
    const summaryLower = article.summary.toLowerCase();
    const tagsLower = article.tags.map(t => t.toLowerCase());

    for (const word of words) {
      if (titleLower.includes(word)) score += 10;
      if (summaryLower.includes(word)) score += 5;
      if (contentLower.includes(word)) score += 2;
      if (tagsLower.some(t => t.includes(word))) score += 8;
    }

    // Exact phrase match bonus
    if (titleLower.includes(normalised)) score += 20;
    if (summaryLower.includes(normalised)) score += 10;

    return { article, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.article);
}

/**
 * Get a single article by ID.
 */
export function getArticle(id: string): KBArticle | null {
  return knowledgeArticles.find(a => a.id === id && !a.deletedAt) || null;
}

/**
 * Get all articles in a category.
 */
export function getArticlesByCategory(category: KBCategory): KBArticle[] {
  return knowledgeArticles.filter(a => a.category === category && !a.deletedAt);
}

/**
 * Get all public articles (for customer-facing AI).
 */
export function getPublicArticles(): KBArticle[] {
  return knowledgeArticles.filter(a => a.isPublic && !a.deletedAt);
}

/**
 * Get all articles (including non-public, for admin).
 */
export function getAllArticles(): KBArticle[] {
  return knowledgeArticles.filter(a => !a.deletedAt);
}

/**
 * Get all unique categories with article counts.
 */
export function getCategoryCounts(): Record<KBCategory, number> {
  const counts: Record<string, number> = {};
  for (const article of knowledgeArticles.filter(a => !a.deletedAt)) {
    counts[article.category] = (counts[article.category] || 0) + 1;
  }
  return counts as Record<KBCategory, number>;
}
