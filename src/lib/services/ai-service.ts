/**
 * AI Service — Abstraction Layer
 * 
 * Phase 1: Rule-based keyword matching implementation
 * Phase 3: Extended with lead qualification, sales context, quote brief,
 *          insight generation, and customer query handling.
 * Future: Replace with LLM integration (Gemini, GPT, etc.)
 * 
 * The interface is designed to be implementation-agnostic.
 * Any AI provider can be plugged in by implementing the AIService interface.
 * 
 * All AI outputs include:
 * - confidence score
 * - reasoning/explanation
 * - source attribution
 * - requiresHumanReview flag
 */

import { 
  RequirementAnalysis, 
  SolutionRecommendation, 
  RequirementContext, 
  Lead, 
  AILeadSummary, 
  AIQuoteBrief, 
  AISalesRecommendation, 
  AIInsight, 
  DashboardMetrics, 
  CustomerChatMessage,
  CustomerSystem 
} from '@/lib/types';
import { petroleumProducts } from '@/lib/data/petroleum-products';
import { powerProducts } from '@/lib/data/power-products';
import { searchKnowledge } from '@/lib/data/knowledge-base';

// ===== AI SERVICE INTERFACE =====
// Future implementations: GeminiAIService, OpenAIService, etc.

export interface AIServiceInterface {
  analyseRequirement(input: string): Promise<RequirementAnalysis>;
  recommendSolution(context: RequirementContext): Promise<SolutionRecommendation>;
  generateQuoteBrief?(input: string): Promise<string>;
  classifyLead?(input: string): Promise<string>;
  // Phase 3 extensions
  qualifyLead(lead: Lead): Promise<AILeadSummary>;
  prepareSalesContext(lead: Lead): Promise<AISalesRecommendation>;
  prepareQuoteBrief(lead: Lead): Promise<AIQuoteBrief>;
  generateInsights(metrics: DashboardMetrics): Promise<AIInsight[]>;
  answerCustomerQuery(query: string): Promise<CustomerChatMessage>;
  answerCustomerSystemQuery(
    query: string, 
    context?: { systems?: CustomerSystem[]; customerName?: string; customerEmail?: string }
  ): Promise<CustomerChatMessage>;
}

// ===== PHASE 1: RULE-BASED IMPLEMENTATION =====

// Keyword maps for matching
const verticalKeywords: Record<string, string[]> = {
  petroleum: [
    'fuel', 'diesel', 'petrol', 'gasoline', 'lpg', 'gas', 'oil', 'lubricant',
    'petroleum', 'kerosene', 'tank', 'storage', 'refuel', 'generator',
    'genset', 'backup power', 'fuel supply', 'fuel delivery', 'bulk fuel',
  ],
  'power-solar': [
    'solar', 'power', 'electricity', 'inverter', 'battery', 'panel',
    'renewable', 'grid', 'off-grid', 'photovoltaic', 'pv', 'watt',
    'kilowatt', 'megawatt', 'energy storage', 'clean energy',
  ],
};

const productKeywords: Record<string, string[]> = {
  'diesel-supply': ['diesel', 'agr', 'red diesel', 'derv'],
  'petrol-supply': ['petrol', 'gasoline', 'unleaded', 'premium fuel'],
  'lpg-supply': ['lpg', 'propane', 'butane', 'gas bottle', 'cooking gas'],
  'lubricants': ['lubricant', 'oil', 'grease', 'hydraulic', 'engine oil', 'gear oil'],
  'fuel-storage': ['tank', 'storage', 'bund', 'container', 'installation'],
  'fuel-logistics': ['delivery', 'transport', 'logistics', 'distribution', 'fleet'],
  'fuel-management': ['management', 'consulting', 'audit', 'optimis', 'cost', 'saving'],
  'tank-maintenance': ['cleaning', 'maintenance', 'inspection', 'repair', 'contamination'],
};

const industryKeywords: Record<string, string[]> = {
  commercial: ['office', 'retail', 'hotel', 'restaurant', 'shop', 'mall', 'commercial', 'business'],
  industrial: ['factory', 'manufacturing', 'plant', 'industrial', 'production', 'warehouse'],
  'facility-management': ['facility', 'facilities', 'property', 'estate', 'campus', 'site management'],
  institutional: ['hospital', 'school', 'university', 'government', 'council', 'public', 'nhs'],
  construction: ['construction', 'building', 'site', 'mining', 'excavation', 'infrastructure'],
};

function matchKeywords(input: string, keywords: string[]): number {
  const normalised = input.toLowerCase();
  let matches = 0;
  for (const keyword of keywords) {
    if (normalised.includes(keyword)) {
      matches++;
    }
  }
  return matches;
}

function extractQuantity(input: string): string | undefined {
  const patterns = [
    /(\d+[\d,]*)\s*(litres?|liters?|gallons?|tonnes?|barrels?|units?)/i,
    /(\d+[\d,]*)\s*(l|gal|t|bbl)\b/i,
  ];
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) return match[0];
  }
  return undefined;
}

function extractLocation(input: string): string | undefined {
  const locationIndicators = ['in ', 'at ', 'near ', 'around ', 'located in ', 'based in '];
  const normalised = input.toLowerCase();
  for (const indicator of locationIndicators) {
    const index = normalised.indexOf(indicator);
    if (index !== -1) {
      const after = input.substring(index + indicator.length).trim();
      const locationEnd = after.search(/[.,;!?]/);
      return locationEnd > 0 ? after.substring(0, locationEnd).trim() : after.split(' ').slice(0, 4).join(' ');
    }
  }
  return undefined;
}

export class RuleBasedAIService implements AIServiceInterface {
  async analyseRequirement(input: string): Promise<RequirementAnalysis> {
    // Match vertical
    let bestVertical = 'petroleum';
    let bestVerticalScore = 0;
    
    for (const [vertical, keywords] of Object.entries(verticalKeywords)) {
      const score = matchKeywords(input, keywords);
      if (score > bestVerticalScore) {
        bestVertical = vertical;
        bestVerticalScore = score;
      }
    }

    // Match products
    const matchedProducts: string[] = [];
    for (const [productId, keywords] of Object.entries(productKeywords)) {
      if (matchKeywords(input, keywords) > 0) {
        matchedProducts.push(productId);
      }
    }

    // Default to general fuel supply if no specific product matched
    if (matchedProducts.length === 0 && bestVertical === 'petroleum') {
      matchedProducts.push('diesel-supply');
    }

    // Match industry
    let bestIndustry = '';
    let bestIndustryScore = 0;
    for (const [industry, keywords] of Object.entries(industryKeywords)) {
      const score = matchKeywords(input, keywords);
      if (score > bestIndustryScore) {
        bestIndustry = industry;
        bestIndustryScore = score;
      }
    }

    // Extract structured fields
    const quantity = extractQuantity(input);
    const location = extractLocation(input);

    // Calculate confidence
    const totalSignals = bestVerticalScore + matchedProducts.length + (bestIndustryScore > 0 ? 1 : 0) + (quantity ? 1 : 0) + (location ? 1 : 0);
    const confidence = Math.min(totalSignals / 5, 1);

    // Build reasoning
    const reasons: string[] = [];
    if (bestVerticalScore > 0) reasons.push(`Identified ${bestVertical} requirement`);
    if (matchedProducts.length > 0) reasons.push(`Matched products: ${matchedProducts.join(', ')}`);
    if (bestIndustry) reasons.push(`Industry context: ${bestIndustry}`);
    if (quantity) reasons.push(`Quantity detected: ${quantity}`);
    if (location) reasons.push(`Location detected: ${location}`);
    if (reasons.length === 0) reasons.push('General energy enquiry detected — defaulting to petroleum solutions');

    return {
      originalInput: input,
      suggestedVertical: bestVertical,
      suggestedProducts: matchedProducts,
      suggestedIndustry: bestIndustry,
      extractedQuantity: quantity,
      extractedLocation: location,
      confidence,
      reasoning: reasons.join('. ') + '.',
    };
  }

  async recommendSolution(context: RequirementContext): Promise<SolutionRecommendation> {
    const analysis = await this.analyseRequirement(context.input);
    
    const matchedProducts = petroleumProducts.filter(
      p => analysis.suggestedProducts.includes(p.id)
    );

    const vertical = analysis.suggestedVertical === 'power-solar' 
      ? 'Power & Solar Solutions' 
      : 'Petroleum Solutions';

    return {
      vertical,
      products: matchedProducts.length > 0 ? matchedProducts : petroleumProducts.slice(0, 3),
      description: `Based on your description, we recommend exploring our ${vertical}. ${matchedProducts.length > 0 ? `Specifically, our ${matchedProducts.map(p => p.name).join(' and ')} services may be relevant.` : 'Our team can help identify the best solution for your needs.'}`,
      nextStep: 'Request a quote or speak to our team to discuss your specific requirements.',
      ctaHref: analysis.suggestedVertical === 'power-solar' ? '/solutions/power-solar' : '/quote',
    };
  }

  // ===== PHASE 3: AI LEAD QUALIFIER =====

  async qualifyLead(lead: Lead): Promise<AILeadSummary> {
    const analysis = await this.analyseRequirement(lead.notes || '');
    const products = lead.products?.map(p => p.productName) || [];
    const allProducts = [...products, ...analysis.suggestedProducts];

    // Identify missing information
    const missingInfo: string[] = [];
    if (!lead.contact?.phone) missingInfo.push('Phone number not provided');
    if (!lead.organisation?.name || lead.organisation.name.length < 3) missingInfo.push('Organisation name missing or incomplete');
    if (!lead.organisation?.industry) missingInfo.push('Industry not specified');
    if (!lead.quantity?.value || lead.quantity.value === 0) missingInfo.push('Quantity/volume not specified');
    if (!lead.location?.city) missingInfo.push('Location/city not provided');
    if (!lead.requestedDate) missingInfo.push('Requested delivery date not specified');
    if (products.length === 0 && analysis.suggestedProducts.length === 0) missingInfo.push('No specific products identified');

    // Build what-they-want summary
    const wantParts: string[] = [];
    if (products.length > 0) wantParts.push(`Interested in: ${products.join(', ')}`);
    if (lead.quantity?.value) wantParts.push(`Quantity: ${lead.quantity.value} ${lead.quantity.unit}`);
    if (lead.location?.city) wantParts.push(`Location: ${lead.location.city}, ${lead.location.state}`);
    if (lead.notes) wantParts.push(`Notes: ${lead.notes.substring(0, 200)}`);
    const whatTheyWant = wantParts.length > 0 ? wantParts.join('. ') : 'Enquiry details not yet clarified — follow up recommended.';

    // Determine next step
    let suggestedNextStep = 'Review lead details and assign to appropriate sales representative.';
    if (missingInfo.length >= 3) {
      suggestedNextStep = 'Contact customer to gather missing information before proceeding with qualification.';
    } else if (lead.urgency === 'critical' || lead.urgency === 'high') {
      suggestedNextStep = 'Priority response required — contact customer within 2 hours.';
    } else if (allProducts.length > 0) {
      suggestedNextStep = 'Prepare product availability check and draft a preliminary quote.';
    }

    const classification = analysis.suggestedVertical === 'power-solar' ? 'Power & Solar' : 'Petroleum';

    return {
      leadId: lead.id,
      whatTheyWant,
      relevantProducts: allProducts,
      missingInformation: missingInfo,
      suggestedUrgency: lead.urgency || 'medium',
      suggestedNextStep,
      classification,
      confidence: analysis.confidence,
      reasoning: analysis.reasoning,
      requiresHumanReview: true,
      generatedAt: new Date().toISOString(),
    };
  }

  // ===== PHASE 3: AI SALES CONTEXT =====

  async prepareSalesContext(lead: Lead): Promise<AISalesRecommendation> {
    const analysis = await this.analyseRequirement(lead.notes || '');
    const contactName = `${lead.contact?.firstName || ''} ${lead.contact?.lastName || ''}`.trim() || 'the customer';
    const orgName = lead.organisation?.name || 'their organisation';

    // Suggest products based on analysis
    const suggestedProducts = analysis.suggestedProducts.length > 0
      ? analysis.suggestedProducts
      : (analysis.suggestedVertical === 'power-solar'
          ? powerProducts.slice(0, 3).map(p => p.name)
          : petroleumProducts.slice(0, 3).map(p => p.name));

    // Build recommended actions
    const actions: string[] = [
      'Review customer requirements and confirm product availability.',
    ];
    if (lead.urgency === 'critical' || lead.urgency === 'high') {
      actions.unshift('PRIORITY: Respond within 2 hours — customer marked request as ' + lead.urgency + '.');
    }
    if (!lead.contact?.phone) {
      actions.push('Obtain customer phone number for faster communication.');
    }
    if (lead.quantity?.value && lead.quantity.value > 0) {
      actions.push(`Confirm stock/supply availability for ${lead.quantity.value} ${lead.quantity.unit}.`);
    }
    actions.push('Prepare and send personalised quote within 24 hours.');

    // Talking points
    const talkingPoints: string[] = [
      `Address ${contactName} by name and reference their ${orgName} requirement.`,
      `Highlight relevant product capabilities for their industry${lead.organisation?.industry ? ` (${lead.organisation.industry})` : ''}.`,
      'Clarify delivery timeline and logistics options.',
      'Mention installation services if relevant (Power & Solar).',
      'Ask about ongoing/recurring supply needs for long-term relationship.',
    ];

    // Generate draft response
    const draftResponse = `Dear ${contactName},\n\nThank you for reaching out to 3rd Energy regarding your energy requirements${lead.organisation?.name ? ` for ${lead.organisation.name}` : ''}.\n\nBased on your enquiry, I'd like to discuss how our ${analysis.suggestedVertical === 'power-solar' ? 'power and solar solutions' : 'petroleum supply services'} can meet your needs.${lead.quantity?.value ? ` I've noted your requirement for ${lead.quantity.value} ${lead.quantity.unit}.` : ''}\n\nCould we schedule a brief call to discuss the specifics? I'm available at your convenience.\n\nBest regards,\n[Sales Representative Name]\n3rd Energy`;

    return {
      leadId: lead.id,
      summary: `${contactName} from ${orgName} — ${analysis.suggestedVertical === 'power-solar' ? 'Power/Solar' : 'Petroleum'} enquiry. ${lead.urgency === 'critical' || lead.urgency === 'high' ? 'HIGH PRIORITY.' : ''}`,
      recommendedActions: actions,
      suggestedProducts,
      draftResponse,
      talkingPoints,
      confidence: analysis.confidence,
      sources: ['Lead form submission', 'Product catalogue', 'AI requirement analysis'],
      requiresHumanReview: true,
      generatedAt: new Date().toISOString(),
    };
  }

  // ===== PHASE 3: AI QUOTE BRIEF =====

  async prepareQuoteBrief(lead: Lead): Promise<AIQuoteBrief> {
    const analysis = await this.analyseRequirement(lead.notes || '');
    const contactName = `${lead.contact?.firstName || ''} ${lead.contact?.lastName || ''}`.trim();

    // Requirements extraction
    const requirements: string[] = [];
    if (lead.products?.length > 0) {
      requirements.push(`Products: ${lead.products.map(p => p.productName).join(', ')}`);
    }
    if (lead.quantity?.value) {
      requirements.push(`Volume: ${lead.quantity.value} ${lead.quantity.unit}`);
    }
    if (lead.location?.city) {
      requirements.push(`Delivery to: ${lead.location.city}, ${lead.location.state}`);
    }
    if (lead.requestedDate) {
      requirements.push(`Requested by: ${lead.requestedDate}`);
    }
    if (lead.location?.deliveryType) {
      requirements.push(`Fulfilment: ${lead.location.deliveryType}`);
    }

    // Relevant products with reasons
    const relevantProducts = analysis.suggestedProducts.map(productId => {
      const petroProduct = petroleumProducts.find(p => p.id === productId);
      const powerProduct = powerProducts.find(p => p.id === productId);
      const product = petroProduct || powerProduct;
      return {
        productId,
        productName: product?.name || productId,
        reason: `Matched based on requirement analysis (confidence: ${Math.round(analysis.confidence * 100)}%).`,
      };
    });

    // Open questions
    const openQuestions: string[] = [];
    if (!lead.quantity?.value) openQuestions.push('What quantity/volume is required?');
    if (!lead.requestedDate) openQuestions.push('When is the delivery/installation needed?');
    if (!lead.location?.city) openQuestions.push('Where should the delivery be made?');
    if (analysis.suggestedVertical === 'power-solar') {
      openQuestions.push('What is the customer\'s current power situation (generator, grid, off-grid)?');
      openQuestions.push('Has a site assessment been conducted?');
    } else {
      openQuestions.push('Is this a one-time or recurring supply requirement?');
      openQuestions.push('Does the customer have existing storage facilities?');
    }

    // Quote preparation checklist
    const checklist = [
      { item: 'Customer requirements confirmed', completed: requirements.length >= 3 },
      { item: 'Products identified and availability checked', completed: relevantProducts.length > 0 },
      { item: 'Delivery logistics assessed', completed: !!lead.location?.city },
      { item: 'Pricing validated (not auto-generated)', completed: false },
      { item: 'Terms and conditions attached', completed: false },
      { item: 'Internal approval obtained (if required)', completed: false },
      { item: 'Quote document prepared and reviewed', completed: false },
    ];

    return {
      leadId: lead.id,
      customerSummary: `${contactName}${lead.organisation?.name ? ` from ${lead.organisation.name}` : ''}${lead.organisation?.industry ? ` (${lead.organisation.industry})` : ''} — ${analysis.suggestedVertical === 'power-solar' ? 'Power & Solar' : 'Petroleum'} requirement.`,
      requirements,
      requestedServices: analysis.suggestedProducts,
      relevantProducts,
      openQuestions,
      quotePrepChecklist: checklist,
      confidence: analysis.confidence,
      requiresHumanReview: true,
      generatedAt: new Date().toISOString(),
    };
  }

  // ===== PHASE 3: AI INSIGHT ENGINE =====

  async generateInsights(metrics: DashboardMetrics): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];
    const now = new Date().toISOString();

    // Only generate insights based on real data
    if (metrics.totalLeads > 0) {
      if (metrics.periodComparison.leads > 10) {
        insights.push({
          id: `insight_leads_growth_${Date.now()}`,
          type: 'trend',
          title: 'Lead Volume Growing',
          description: `Lead volume has increased by ${metrics.periodComparison.leads.toFixed(0)}% compared to the previous period. This suggests increased market interest or effective marketing campaigns.`,
          metric: 'leads',
          value: metrics.totalLeads,
          comparison: `+${metrics.periodComparison.leads.toFixed(0)}%`,
          confidence: 0.85,
          dataPoints: metrics.totalLeads,
          sources: ['Lead database', 'Period comparison'],
          generatedAt: now,
        });
      } else if (metrics.periodComparison.leads < -10) {
        insights.push({
          id: `insight_leads_decline_${Date.now()}`,
          type: 'risk',
          title: 'Lead Volume Declining',
          description: `Lead volume has decreased by ${Math.abs(metrics.periodComparison.leads).toFixed(0)}% compared to the previous period. Review marketing channels and campaign performance.`,
          metric: 'leads',
          value: metrics.totalLeads,
          comparison: `${metrics.periodComparison.leads.toFixed(0)}%`,
          confidence: 0.85,
          dataPoints: metrics.totalLeads,
          sources: ['Lead database', 'Period comparison'],
          generatedAt: now,
        });
      }

      // Quote conversion insight
      if (metrics.quotesSent > 0 && metrics.quoteConversionRate < 20) {
        insights.push({
          id: `insight_conversion_low_${Date.now()}`,
          type: 'opportunity',
          title: 'Quote Conversion Below Target',
          description: `Quote-to-order conversion rate is ${metrics.quoteConversionRate.toFixed(1)}%. Industry benchmark is typically 20-30%. Consider reviewing quote follow-up processes and pricing competitiveness.`,
          metric: 'quoteConversionRate',
          value: metrics.quoteConversionRate,
          comparison: 'Below 20% target',
          confidence: 0.75,
          dataPoints: metrics.quotesSent,
          sources: ['Quote database', 'Order database'],
          generatedAt: now,
        });
      }

      // AI usage correlation
      if (metrics.aiUsageCount > 0) {
        insights.push({
          id: `insight_ai_usage_${Date.now()}`,
          type: 'trend',
          title: 'AI Tools Active',
          description: `AI tools have been used ${metrics.aiUsageCount} times this period. Customers using the Power Planner and AI Concierge may have higher conversion intent.`,
          metric: 'aiUsageCount',
          value: metrics.aiUsageCount,
          confidence: 0.65,
          dataPoints: metrics.aiUsageCount,
          sources: ['AI usage logs'],
          generatedAt: now,
        });
      }

      // Average order value insight
      if (metrics.totalOrders > 0 && metrics.averageOrderValue > 0) {
        insights.push({
          id: `insight_aov_${Date.now()}`,
          type: 'trend',
          title: 'Average Order Value',
          description: `Average order value is ₦${metrics.averageOrderValue.toLocaleString()}. ${metrics.periodComparison.revenue > 0 ? 'Revenue trending positively.' : 'Monitor for pricing or volume changes.'}`,
          metric: 'averageOrderValue',
          value: metrics.averageOrderValue,
          confidence: 0.8,
          dataPoints: metrics.totalOrders,
          sources: ['Order database'],
          generatedAt: now,
        });
      }
    }

    return insights;
  }

  // ===== PHASE 3: CUSTOMER AI ASSISTANT =====

  async answerCustomerQuery(query: string): Promise<CustomerChatMessage> {
    // Search the knowledge base for relevant articles
    const results = searchKnowledge(query);
    const topResults = results.slice(0, 3);

    let content: string;
    let confidence: number;
    const sources: CustomerChatMessage['sources'] = [];

    if (topResults.length > 0) {
      // Build response from knowledge base
      const primaryArticle = topResults[0];
      content = primaryArticle.summary;

      // Enrich with additional context if available
      if (topResults.length > 1) {
        content += `\n\nYou may also find these helpful:\n${topResults.slice(1).map(a => `• ${a.title}: ${a.summary}`).join('\n')}`;
      }

      // Add source attribution
      for (const article of topResults) {
        sources.push({
          title: article.title,
          articleId: article.id,
          type: article.isVerified ? 'verified' : 'educational',
        });
      }

      confidence = topResults.length >= 2 ? 0.85 : 0.65;
    } else {
      // No knowledge base match — provide a helpful fallback
      content = 'I don\'t have specific information about that topic in our knowledge base. For detailed enquiries, I\'d recommend contacting our team directly — they can provide personalised assistance for your requirements.';
      confidence = 0.3;
      sources.push({
        title: 'General guidance',
        type: 'uncertain',
      });
    }

    // Add safety note for anything that could be business-critical
    const sensitiveTerms = ['price', 'cost', 'warranty', 'guarantee', 'refund', 'contract', 'legal', 'safety'];
    const hasSensitiveTerm = sensitiveTerms.some(term => query.toLowerCase().includes(term));
    if (hasSensitiveTerm) {
      content += '\n\n⚠️ Please note: For specific pricing, warranty terms, and contractual matters, please contact our sales team for the most current and accurate information.';
      confidence = Math.min(confidence, 0.5);
    }

    return {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      sender: 'assistant',
      content,
      confidence,
      sources,
      suggestedActions: [
        { label: 'Contact Sales Team', href: '/contact' },
        { label: 'Request a Quote', href: '/quote' },
        ...(topResults.some(r => r.category === 'products') ? [{ label: 'Browse Products', href: '/power/products' }] : []),
      ],
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Phase 4: Context-aware customer system diagnostics & troubleshooting.
   * Leverages customer's registered hardware and knowledge base.
   * Strictly avoids unsafe instructions and enforces specialist escalation when required.
   */
  async answerCustomerSystemQuery(
    query: string,
    context?: { systems?: CustomerSystem[]; customerName?: string; customerEmail?: string }
  ): Promise<CustomerChatMessage> {
    const qLower = query.toLowerCase();
    const primarySystem = context?.systems?.[0];
    const systemName = primarySystem?.name || 'Commercial Energy System';
    const inverter = primarySystem?.components.find(c => c.type === 'INVERTER');
    const battery = primarySystem?.components.find(c => c.type === 'BATTERY');
    const pv = primarySystem?.components.find(c => c.type === 'SOLAR_PANELS');

    const sources: { title: string; articleId?: string; type: 'verified' | 'educational' | 'uncertain' }[] = [];
    let content = '';
    let confidence = 0.85;
    let requiresSpecialistReview = false;
    let suggestedTicketData: CustomerChatMessage['suggestedTicketData'];

    // 1. CRITICAL SAFETY & HAZARD DETECTION
    const hazardTerms = ['smoke', 'burning', 'spark', 'shock', 'smell', 'bypass', 'hot to touch', 'swollen', 'water', 'fire'];
    const isHazard = hazardTerms.some(t => qLower.includes(t));

    if (isHazard) {
      requiresSpecialistReview = true;
      content = `🚨 **A SPECIALIST SHOULD REVIEW THIS IMMEDIATELY.**\n\n` +
        `Safety Notice for **${systemName}**:\n` +
        `Based on your description mentioning potential thermal or electrical hazards, **do NOT touch exposed cabling, do NOT open the inverter casing, and avoid direct contact with battery terminals.**\n\n` +
        `**Recommended Immediate Steps:**\n` +
        `1. Keep the equipment area well-ventilated and clear of personnel.\n` +
        `2. If safe and accessible, isolate the AC breaker on your main distribution board.\n` +
        `3. Our emergency field engineering team has been alerted for priority dispatch.`;

      suggestedTicketData = {
        category: 'INVERTER_FAULT',
        priority: 'URGENT',
        subject: `URGENT Safety Inspection: ${systemName}`,
        description: `Customer reported critical symptom: "${query}". Automated specialist escalation triggered.`,
        systemId: primarySystem?.id,
      };

      sources.push({ title: '3rd Energy High-Voltage Safety Protocol', type: 'verified' });

      return {
        id: `msg_ai_${Date.now()}`,
        sender: 'assistant',
        content,
        confidence: 0.95,
        sources,
        requiresSpecialistReview,
        suggestedTicketData,
        suggestedActions: [
          { label: 'Create Priority Service Ticket', href: '/my-energy/support' },
          { label: 'Direct WhatsApp Emergency Line', href: 'https://wa.me/2348000000000' },
        ],
        timestamp: new Date().toISOString(),
      };
    }

    // 2. INVERTER NOISE / BUZZING
    if (qLower.includes('noise') || qLower.includes('buzz') || qLower.includes('sound') || qLower.includes('hum') || qLower.includes('fan')) {
      content = `Diagnosis for your **${inverter?.name || 'Inverter System'}** (SN: \`${inverter?.serialNumber || 'Registered'}\`):\n\n` +
        `• **High-Frequency Humming:** Normal during peak solar conversion or heavy inductive load operation (transformers and toroidal chokes).\n` +
        `• **High-Speed Fan Noise:** High-speed cooling fans automatically throttle up when internal heatsink temperature exceeds 45°C. This is normal protection behavior.\n` +
        `• **Abnormal Clicking / Rapid Relaying:** If your inverter is rapidly clicking without switching to battery or grid, the AC input voltage may be fluctuating outside the acceptable 170V–260V window.\n\n` +
        `**What you can check safely:** Verify that the inverter intake air vents are clean and not blocked by dust or debris.`;

      if (qLower.includes('loud') || qLower.includes('grinding') || qLower.includes('screech')) {
        requiresSpecialistReview = true;
        content += `\n\n⚠️ **A SPECIALIST SHOULD REVIEW THIS.** Unusual grinding or high-pitch screeching suggests mechanical fan bearing wear or internal component stress.`;
        suggestedTicketData = {
          category: 'INVERTER_FAULT',
          priority: 'MEDIUM',
          subject: `Abnormal Fan/Component Noise on ${inverter?.name || 'Inverter'}`,
          description: `Customer query: "${query}". Requesting engineer fan inspection.`,
          systemId: primarySystem?.id,
        };
      }

      sources.push({ title: 'Hybrid Inverter Thermal & Acoustic Profile', type: 'verified' });
      sources.push({ title: 'Routine Inverter Intake Maintenance', type: 'verified' });
    }

    // 3. BACKUP TIME / RUNTIME CONCERNS
    else if (qLower.includes('backup') || qLower.includes('runtime') || qLower.includes('discharge') || qLower.includes('drain') || qLower.includes('die') || qLower.includes('hour')) {
      const batteryCapacity = primarySystem?.batteryCapacityKwh || 20;
      content = `Battery Autonomy Analysis for your **${battery?.name || 'Lithium Storage System'}** (${batteryCapacity}kWh capacity):\n\n` +
        `Your system provides approximately **${primarySystem?.telemetry?.estimatedBackupHours || 14} hours** of autonomy under standard commercial base load (~1.2 kW).\n\n` +
        `**Key Factors That Reduce Backup Duration:**\n` +
        `1. **Heavy Inductive Loads:** Air conditioners, deep freezers, electric water heaters, or pumping machines drawing 3x–5x starting surge current.\n` +
        `2. **Insufficient Day Charging:** Overcast weather or dust accumulation on your ${pv?.capacity || 'solar array'} preventing full 100% daily recharge.\n` +
        `3. **Cut-off Voltage Settings:** LiFePO4 battery protection cuts off at 20% State of Charge (DoD limit) to preserve 6,000+ cycle lifespan.\n\n` +
        `💡 **Recommendation:** Review your active circuits to ensure non-essential heavy appliances are routed to non-critical sub-distribution boards.`;

      sources.push({ title: 'LiFePO4 Commercial Storage Depth-of-Discharge Guidelines', type: 'verified' });
    }

    // 4. MAINTENANCE & SERVICE INQUIRIES
    else if (qLower.includes('maintenance') || qLower.includes('service') || qLower.includes('clean') || qLower.includes('checkup') || qLower.includes('inspection')) {
      content = `Maintenance Schedule for **${systemName}**:\n\n` +
        `• **Semi-Annual Solar Panel Wash:** Certified deionized water wash to remove Harmattan particulate build-up and restore optical efficiency.\n` +
        `• **Annual Electrical & Earth Resistance Audit:** Comprehensive insulation resistance (1000V DC) and earthing loop check.\n` +
        `• **Quarterly Inverter Filter Clean:** Dust mesh cleaning to ensure unobstructed thermal airflow.\n\n` +
        `You have verified service records on file. You can view all upcoming dates in your **Maintenance Hub** or request a technician visit directly.`;

      sources.push({ title: '3rd Energy Scheduled Asset Care Protocols', type: 'verified' });
    }

    // 5. ERROR CODES & FAULTS
    else if (qLower.includes('error') || qLower.includes('fault') || qLower.includes('code') || qLower.includes('red light') || qLower.includes('alarm') || qLower.includes('f0') || qLower.includes('f5')) {
      requiresSpecialistReview = true;
      content = `⚠️ **A SPECIALIST SHOULD REVIEW THIS.**\n\n` +
        `Standard Diagnostic Interpretation for **${inverter?.name || 'Smart Inverter'}**:\n\n` +
        `• **F08 / Over-Temperature Fault:** Internal heatsink temperature high. Inverter auto-protects by shutting down output until cooled.\n` +
        `• **F51 / Overload Trip:** Total connected load exceeded ${primarySystem?.totalCapacityKva || 10}kVA surge capacity. Disconnect heavy equipment and restart.\n` +
        `• **F58 / Low Battery Voltage:** Battery bank reached lower threshold. System will resume once solar or grid charging commences.\n\n` +
        `If the fault code persists after load reduction, our engineering team can review diagnostic logs and dispatch a field specialist.`;

      suggestedTicketData = {
        category: 'INVERTER_FAULT',
        priority: 'HIGH',
        subject: `Persistent Error Code / Inverter Alarm: ${systemName}`,
        description: `Customer reported fault query: "${query}". Requesting diagnostic verification.`,
        systemId: primarySystem?.id,
      };

      sources.push({ title: '3rd Energy Smart Inverter Fault Code Reference', type: 'verified' });
    }

    // 6. GENERAL KNOWLEDGE BASE FALLBACK
    else {
      const kbResults = searchKnowledge(query, 3);
      if (kbResults.length > 0) {
        content = `Regarding your enquiry on **${systemName}**:\n\n` +
          kbResults.map(r => `**${r.title}:** ${r.summary}`).join('\n\n') +
          `\n\nWould you like more details on this topic or assistance from your assigned account engineer?`;

        for (const k of kbResults) {
          sources.push({ title: k.title, articleId: k.id, type: k.isVerified ? 'verified' : 'educational' });
        }
      } else {
        content = `I have received your question regarding **${systemName}**.\n\n` +
          `To ensure you receive accurate and safe technical guidance tailored to your installation, you can log a quick support ticket or request an engineer callback.`;
        sources.push({ title: '3rd Energy Customer Engineering Knowledge Base', type: 'uncertain' });
        confidence = 0.5;
      }
    }

    return {
      id: `msg_ai_${Date.now()}`,
      sender: 'assistant',
      content,
      confidence,
      sources,
      requiresSpecialistReview,
      suggestedTicketData,
      suggestedActions: requiresSpecialistReview
        ? [
            { label: 'Create Service Ticket', href: '/my-energy/support' },
            { label: 'Schedule Routine Service', href: '/my-energy/service-history' },
          ]
        : [
            { label: 'View System Details', href: `/my-energy/systems/${primarySystem?.id || ''}` },
            { label: 'Check Maintenance Schedule', href: '/my-energy/maintenance' },
            { label: 'Explore Document Vault', href: '/my-energy/documents' },
          ],
      timestamp: new Date().toISOString(),
    };
  }
}

// Singleton instance
export const aiService: AIServiceInterface = new RuleBasedAIService();
