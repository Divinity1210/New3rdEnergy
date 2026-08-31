// ===== LEAD DATA MODEL =====

export type LeadStatus =
  | 'NEW'
  | 'QUALIFIED'
  | 'QUOTING'
  | 'QUOTE_SENT'
  | 'NEGOTIATION'
  | 'WON'
  | 'LOST'
  | 'CLOSED';

export type LeadUrgency = 'low' | 'medium' | 'high' | 'critical';

export type LeadSource =
  | 'website_quote'
  | 'website_contact'
  | 'website_assistant'
  | 'whatsapp'
  | 'referral'
  | 'direct'
  | 'campaign';

export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle?: string;
  preferredContact?: 'email' | 'phone' | 'whatsapp';
}

export interface OrganisationInfo {
  name: string;
  industry: string;
  size?: string;
  website?: string;
  address?: string;
}

export interface DeliveryLocation {
  address: string;
  city: string;
  state: string;
  country: string;
  postcode?: string;
  deliveryType: 'delivery' | 'collection' | 'flexible';
  accessNotes?: string;
}

export interface ProductSelection {
  productId: string;
  productName: string;
  category: string;
  specifications?: string;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;
  uploadedAt: string;
}

export interface Lead {
  id: string;
  referenceNumber: string;
  contact: ContactInfo;
  organisation: OrganisationInfo;
  industry: string;
  products: ProductSelection[];
  quantity: {
    value: number;
    unit: string;
  };
  location: DeliveryLocation;
  deliveryRequirement: string;
  requestedDate: string;
  urgency: LeadUrgency;
  notes: string;
  attachments: Attachment[];
  source: LeadSource;
  campaign: string;
  status: LeadStatus;
  assignedOwner: string;
  createdAt: string;
  updatedAt: string;
}

// ===== PRODUCT DATA MODEL =====

export interface PetroleumProduct {
  id: string;
  slug: string;
  name: string;
  category: PetroleumCategory;
  description: string;
  shortDescription: string;
  icon: string;
  image: string;
  features: string[];
  specifications: { label: string; value: string }[];
  pricingNote: string;
  minimumOrder?: string;
  deliveryTimeline: string;
  certifications?: string[];
  industries: string[];
  availableForQuote: boolean;
  order: number;
}

export type PetroleumCategory =
  | 'fuel-supply'
  | 'lubricants'
  | 'storage'
  | 'logistics'
  | 'consulting'
  | 'maintenance';

export interface SolutionVertical {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
  comingSoon: boolean;
  products: PetroleumProduct[];
}

// ===== INDUSTRY DATA MODEL =====

export interface Industry {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  icon: string;
  challenges: string[];
  solutions: string[];
  image?: string;
  order: number;
}

// ===== INSIGHTS / CONTENT DATA MODEL =====

export type InsightCategory =
  | 'energy-market'
  | 'petroleum'
  | 'power'
  | 'company-news'
  | 'industry-insights'
  | 'regulation'
  | 'case-studies';

export interface InsightArticle {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  author: {
    name: string;
    role: string;
    image?: string;
  };
  date: string;
  category: InsightCategory;
  featuredImage: string;
  readingTime: number;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  relatedSlugs: string[];
  cta?: {
    text: string;
    href: string;
  };
  featured: boolean;
}

// ===== NAVIGATION DATA MODEL =====

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
  description?: string;
  icon?: string;
  badge?: string;
}

// ===== ANALYTICS DATA MODEL =====

export interface AnalyticsEvent {
  event: string;
  category: string;
  label?: string;
  value?: number;
  metadata?: Record<string, string | number | boolean>;
  timestamp: string;
}

export interface ConversionEvent extends AnalyticsEvent {
  conversionType: 'quote_submit' | 'contact_submit' | 'whatsapp_click' | 'assistant_conversion';
  leadId?: string;
  source?: string;
  campaign?: string;
}

// ===== AI SERVICE TYPES =====

export interface RequirementAnalysis {
  originalInput: string;
  suggestedVertical: string;
  suggestedProducts: string[];
  suggestedIndustry: string;
  extractedQuantity?: string;
  extractedLocation?: string;
  confidence: number;
  reasoning: string;
}

export interface SolutionRecommendation {
  vertical: string;
  products: PetroleumProduct[];
  description: string;
  nextStep: string;
  ctaHref: string;
}

export interface RequirementContext {
  input: string;
  industry?: string;
  vertical?: string;
}

// ===== QUOTE FORM STATE =====

export interface QuoteFormState {
  step: number;
  products: ProductSelection[];
  quantity: { value: number; unit: string };
  location: DeliveryLocation;
  requestedDate: string;
  urgency: LeadUrgency;
  contact: ContactInfo;
  organisation: OrganisationInfo;
  notes: string;
  attachments: File[];
}

// ===== CONTACT FORM =====

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organisation: string;
  subject: string;
  message: string;
  preferredContact: 'email' | 'phone' | 'whatsapp';
}

// ===== CMS-READY CONTENT =====

export interface CMSContent {
  id: string;
  key: string;
  value: string;
  type: 'text' | 'richtext' | 'image' | 'number' | 'link';
  editable: boolean;
  lastUpdated: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  order: number;
}

export interface ProjectShowcase {
  id: string;
  title: string;
  client: string;
  industry: string;
  description: string;
  scope: string[];
  outcomes: string[];
  image: string;
  featured: boolean;
}

// ===== PHASE 2: POWER & SOLAR TYPES =====

export type PowerCategory =
  | 'inverters'
  | 'batteries'
  | 'solar-panels'
  | 'power-stations'
  | 'accessories'
  | 'packages';

export interface PowerProductSpec {
  continuousPower?: string;
  surgePower?: string;
  voltage?: string;
  batteryChemistry?: string;
  capacity?: string;
  efficiency?: string;
  maxSolarInput?: string;
  mpptRange?: string;
  cycles?: string;
  warranty?: string;
  weight?: string;
  dimensions?: string;
  ipRating?: string;
  phase?: 'Single Phase' | 'Three Phase' | 'Split Phase';
}

export interface PowerProduct {
  id: string;
  slug: string;
  name: string;
  category: PowerCategory;
  tagline: string;
  description: string;
  shortDescription: string;
  price: number;
  currency: string;
  image: string;
  inStock: boolean;
  leadTimeDays?: number;
  featured?: boolean;
  specs: PowerProductSpec;
  features: string[];
  whyThisProduct: string;
  whatItDoes: string;
  whoItIsFor: string;
  whatItCanSupport: string[];
  compatibleWith?: string[];
  order: number;
}

export type ApplianceCategory = 'kitchen' | 'living' | 'office' | 'heavy' | 'comfort' | 'other';

export interface Appliance {
  id: string;
  name: string;
  category: ApplianceCategory;
  icon: string;
  defaultWatts: number;
  surgeMultiplier: number;
  typicalHours: number;
  description?: string;
}

export interface SelectedAppliance {
  applianceId: string;
  quantity: number;
  customWatts?: number;
  customHours?: number;
}

export type PowerPriority =
  | 'backup'
  | 'off-grid'
  | 'lower-costs'
  | 'business-continuity';

export type PropertyType =
  | 'home'
  | 'office'
  | 'shop'
  | 'facility'
  | 'other';

export interface PowerSizingInput {
  appliances: SelectedAppliance[];
  dailyHours: number;
  priority: PowerPriority;
  propertyType: PropertyType;
  budgetRange?: 'economy' | 'standard' | 'premium' | 'enterprise';
}

export interface PowerSizingEstimate {
  totalRunningWatts: number;
  totalSurgeWatts: number;
  dailyEnergyKwh: number;
  recommendedInverterKva: number;
  recommendedInverterRange: string;
  recommendedBatteryKwh: number;
  recommendedBatteryRange: string;
  recommendedSolarKwp: number;
  recommendedSolarRange: string;
  autonomyHours: number;
  assumptions: string[];
  matchedProducts: {
    inverter?: PowerProduct;
    battery?: PowerProduct;
    solarPanel?: PowerProduct;
    accessories?: PowerProduct[];
  };
  matchedPackageSlug?: string;
  disclaimer: string;
}

export interface PowerPackage {
  id: string;
  slug: string;
  name: string;
  tier: 'essential' | 'recommended' | 'high-performance' | 'commercial';
  tagline: string;
  description: string;
  image: string;
  ratingKva: number;
  batteryKwh: number;
  solarKwp: number;
  estimatedBackupHours: number;
  idealFor: string;
  inverter: PowerProduct;
  battery: PowerProduct;
  batteryQuantity: number;
  solarPanel?: PowerProduct;
  solarQuantity?: number;
  accessories: PowerProduct[];
  price: number;
  currency: string;
  includesInstallation: boolean;
  warrantyYears: number;
}

export interface CartItem {
  id: string;
  productId: string;
  product: PowerProduct;
  quantity: number;
  selectedVariant?: string;
  unitPrice: number;
  isPackage?: boolean;
  packageDetails?: {
    packageId: string;
    packageName: string;
    includesInstallation: boolean;
  };
}

export interface CartState {
  items: CartItem[];
  installationRequested: boolean;
  installationFeeEstimate: number;
  subtotal: number;
  total: number;
}

export type FulfillmentType = 'delivery' | 'collection';

export interface PowerOrder {
  id: string;
  orderNumber: string;
  customer: ContactInfo;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  installationFee: number;
  total: number;
  currency: string;
  fulfillmentType: FulfillmentType;
  deliveryAddress?: DeliveryLocation;
  depotLocation?: string;
  installationRequested: boolean;
  installationNotes?: string;
  paymentMethod: 'bank_transfer' | 'card' | 'invoice';
  paymentStatus: 'PENDING_MOCK' | 'PAID_MOCK' | 'CONFIRMED';
  orderStatus: 'PROCESSING' | 'CONFIRMED' | 'DISPATCHED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface InstallationRequest {
  id: string;
  referenceNumber: string;
  contact: ContactInfo;
  organisation?: OrganisationInfo;
  propertyType: PropertyType;
  address: string;
  city: string;
  state: string;
  systemType: 'new_purchase' | 'existing_system' | 'upgrade';
  packageOrProducts?: string;
  electricalPhase: 'single-phase' | 'three-phase' | 'uncertain';
  hasGeneratorTransferSwitch: boolean;
  roofType: 'corrugated-iron' | 'aluminum-tin' | 'concrete-deck' | 'clay-tile' | 'ground-mount';
  preferredDate: string;
  siteNotes?: string;
  photoCount?: number;
  status: 'PENDING_AUDIT' | 'SCHEDULED' | 'ASSESSMENT_COMPLETED' | 'INSTALLED';
  createdAt: string;
  updatedAt: string;
}

export interface PowerSavingsInput {
  generatorKva: number;
  dailyGeneratorHours: number;
  fuelPricePerLitre: number;
  monthlyPublicGridBill: number;
  targetSolarOffsetPercent: number;
}

export interface PowerSavingsResult {
  currentMonthlyGeneratorSpend: number;
  currentAnnualGeneratorSpend: number;
  currentAnnualGridSpend: number;
  currentTotalAnnualEnergySpend: number;
  projectedAnnualSolarSpend: number;
  projectedAnnualSavings: number;
  fiveYearSavings: number;
  tenYearSavings: number;
  co2ReductionTonnesPerYear: number;
  assumptions: string[];
  disclaimer: string;
}

export interface ConciergeMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedActions?: { label: string; href?: string; actionType?: string }[];
}

// ===== PHASE 3: AI, CRM & CUSTOMER INTELLIGENCE TYPES =====

// --- Pipeline ---

export type PipelineStage =
  | 'NEW_LEAD'
  | 'QUALIFIED'
  | 'DISCOVERY'
  | 'QUOTE_REQUESTED'
  | 'QUOTE_SENT'
  | 'NEGOTIATION'
  | 'WON'
  | 'LOST'
  | 'CUSTOMER';

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

export const STAGE_COLORS: Record<PipelineStage, string> = {
  NEW_LEAD: '#3b82f6',
  QUALIFIED: '#8b5cf6',
  DISCOVERY: '#6366f1',
  QUOTE_REQUESTED: '#f59e0b',
  QUOTE_SENT: '#f97316',
  NEGOTIATION: '#ef4444',
  WON: '#10b981',
  LOST: '#6b7280',
  CUSTOMER: '#059669',
};

export interface PipelineStageHistory {
  stage: PipelineStage;
  enteredAt: string;
  exitedAt?: string;
  changedBy: string;
  notes?: string;
}

// --- CRM Entities ---

export interface CRMContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle?: string;
  preferredContact?: 'email' | 'phone' | 'whatsapp';
  companyId?: string;
  tags: string[];
  leadIds: string[];
  orderIds: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CRMCompany {
  id: string;
  name: string;
  industry: string;
  size?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  contactIds: string[];
  leadIds: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CRMOpportunity {
  id: string;
  title: string;
  leadId: string;
  contactId: string;
  companyId?: string;
  stage: PipelineStage;
  stageHistory: PipelineStageHistory[];
  estimatedValue: number;
  currency: string;
  probability: number; // 0-100
  expectedCloseDate?: string;
  products: ProductSelection[];
  notes?: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CRMQuote {
  id: string;
  quoteNumber: string;
  opportunityId: string;
  contactId: string;
  companyId?: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
    notes?: string;
  }[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  validUntil: string;
  status: 'DRAFT' | 'SENT' | 'VIEWED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  requiresApproval: boolean;
  approvedBy?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CRMServiceRecord {
  id: string;
  type: 'installation' | 'maintenance' | 'repair' | 'inspection' | 'consultation';
  contactId: string;
  companyId?: string;
  orderId?: string;
  installationId?: string;
  description: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  scheduledDate?: string;
  completedDate?: string;
  assignedTo: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CRMCommunication {
  id: string;
  entityType: 'lead' | 'contact' | 'company' | 'opportunity' | 'order';
  entityId: string;
  direction: 'inbound' | 'outbound';
  channel: 'email' | 'phone' | 'whatsapp' | 'sms' | 'meeting' | 'note' | 'system';
  subject?: string;
  content: string;
  isAIDraft: boolean;
  requiresReview: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
  sentAt?: string;
  createdBy: string;
  createdAt: string;
}

// --- Lead Scoring ---

export interface LeadScoreSignal {
  signal: string;
  description: string;
  score: number;
  maxScore: number;
  reasoning: string;
}

export type LeadScoreTier = 'HOT' | 'WARM' | 'COLD';

export interface LeadScoreResult {
  totalScore: number;
  maxPossibleScore: number;
  tier: LeadScoreTier;
  signals: LeadScoreSignal[];
  calculatedAt: string;
  explanation: string;
}

// --- AI Summaries ---

export interface AILeadSummary {
  leadId: string;
  whatTheyWant: string;
  relevantProducts: string[];
  missingInformation: string[];
  suggestedUrgency: LeadUrgency;
  suggestedNextStep: string;
  classification: string;
  confidence: number;
  reasoning: string;
  requiresHumanReview: boolean;
  generatedAt: string;
}

export interface AIQuoteBrief {
  leadId: string;
  customerSummary: string;
  requirements: string[];
  requestedServices: string[];
  relevantProducts: { productId: string; productName: string; reason: string }[];
  openQuestions: string[];
  quotePrepChecklist: { item: string; completed: boolean }[];
  confidence: number;
  requiresHumanReview: boolean;
  generatedAt: string;
}

export interface AISalesRecommendation {
  leadId: string;
  summary: string;
  recommendedActions: string[];
  suggestedProducts: string[];
  draftResponse: string;
  talkingPoints: string[];
  confidence: number;
  sources: string[];
  requiresHumanReview: boolean;
  generatedAt: string;
}

export interface AIInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'opportunity' | 'risk';
  title: string;
  description: string;
  metric?: string;
  value?: number;
  comparison?: string;
  confidence: number;
  dataPoints: number;
  sources: string[];
  generatedAt: string;
}

// --- Automation ---

export type AutomationTrigger =
  | 'quote_reminder'
  | 'lead_follow_up'
  | 'abandoned_enquiry'
  | 'abandoned_cart'
  | 'installation_follow_up'
  | 'review_request'
  | 'reorder_reminder';

export type AutomationActionStatus = 'PENDING' | 'APPROVED' | 'DISMISSED' | 'SENT' | 'FAILED';

export interface AutomationRule {
  id: string;
  trigger: AutomationTrigger;
  name: string;
  description: string;
  delayHours: number;
  enabled: boolean;
  template: string;
  channel: 'email' | 'whatsapp' | 'sms';
}

export interface AutomationAction {
  id: string;
  ruleId: string;
  trigger: AutomationTrigger;
  entityType: 'lead' | 'order' | 'cart' | 'installation';
  entityId: string;
  contactEmail: string;
  contactName: string;
  subject: string;
  draftContent: string;
  status: AutomationActionStatus;
  scheduledFor: string;
  approvedBy?: string;
  approvedAt?: string;
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
}

// --- Auth & RBAC ---

export type UserRole =
  | 'ADMIN'
  | 'MARKETING'
  | 'SALES'
  | 'TECHNICAL'
  | 'SUPPORT'
  | 'FINANCE'
  | 'READ_ONLY';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface Session {
  userId: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  iat: number;
  exp: number;
}

export type AuditAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'VIEW'
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'APPROVE'
  | 'DISMISS'
  | 'GENERATE_AI'
  | 'EXPORT';

export interface AuditLogEntry {
  id: string;
  userId: string;
  userEmail: string;
  userRole: UserRole;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  details?: string;
  ipAddress: string;
  userAgent?: string;
  timestamp: string;
}

export type Permission = {
  resource: string;
  actions: AuditAction[];
};

// --- Analytics Dashboard ---

export interface DashboardMetrics {
  totalLeads: number;
  qualifiedLeads: number;
  quotesSent: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  quoteConversionRate: number;
  repeatCustomerRate: number;
  aiUsageCount: number;
  periodComparison: {
    leads: number; // percentage change
    orders: number;
    revenue: number;
  };
}

export interface ConversionFunnel {
  stage: string;
  count: number;
  percentage: number;
}

export type AttributionChannel =
  | 'google'
  | 'linkedin'
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'whatsapp'
  | 'direct'
  | 'referral'
  | 'campaign';

export interface ChannelAttribution {
  channel: AttributionChannel;
  leads: number;
  conversions: number;
  revenue: number;
  conversionRate: number;
}

export interface CampaignMetric {
  campaign: string;
  source: AttributionChannel;
  leads: number;
  conversions: number;
  revenue: number;
}

export interface UTMData {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  capturedAt: string;
}

// --- Knowledge Base ---

export type KBCategory =
  | 'products'
  | 'faqs'
  | 'services'
  | 'policies'
  | 'installation-guides'
  | 'maintenance'
  | 'company-info'
  | 'documents';

export interface KBArticle {
  id: string;
  title: string;
  slug: string;
  category: KBCategory;
  content: string;
  summary: string;
  tags: string[];
  isPublic: boolean;
  isVerified: boolean;
  lastVerifiedBy?: string;
  lastVerifiedAt?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

// --- Customer AI Assistant ---

export interface CustomerChatMessage {
  id: string;
  sender: 'customer' | 'assistant';
  content: string;
  confidence?: number;
  sources?: { title: string; articleId?: string; type: 'verified' | 'educational' | 'uncertain' }[];
  suggestedActions?: { label: string; href?: string }[];
  requiresSpecialistReview?: boolean;
  suggestedTicketData?: {
    category: TicketCategory;
    priority: TicketPriority;
    subject: string;
    description: string;
    systemId?: string;
  };
  timestamp: string;
}

export interface CustomerChatSession {
  id: string;
  messages: CustomerChatMessage[];
  utmData?: UTMData;
  createdAt: string;
  updatedAt: string;
}

// ===== PHASE 4: MY ENERGY CUSTOMER PORTAL MODELS =====

export interface CustomerLocation {
  id: string;
  name: string; // e.g. "Victoria Island Headquarters", "Ikeja Logistics Hub", "Lekki Residence"
  address: string;
  city: string;
  state: string;
  country: string;
  isPrimary?: boolean;
  contactPerson?: string;
  contactPhone?: string;
}

export interface CustomerProfile {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  companyName?: string;
  industry?: string;
  jobTitle?: string;
  locations: CustomerLocation[];
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    maintenanceReminders: boolean;
    orderUpdates: boolean;
    ticketResponses: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CustomerUser {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'CUSTOMER';
  isActive: boolean;
  profileId?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface CustomerSession {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER';
  profileId?: string;
  iat: number;
  exp: number;
}

export type SystemHealthStatus = 'OPTIMAL' | 'ATTENTION_REQUIRED' | 'SERVICE_DUE' | 'OFFLINE';

export interface SystemComponent {
  id: string;
  type: 'INVERTER' | 'BATTERY' | 'SOLAR_PANELS' | 'CHARGE_CONTROLLER' | 'MONITORING_HUB' | 'ACCESSORY';
  name: string;
  modelNumber: string;
  serialNumber: string;
  manufacturer: string;
  capacity?: string; // e.g. "10kVA / 48V", "10kWh LiFePO4", "550W x 18 panels"
  warrantyExpiry: string;
  installDate: string;
  status: 'ACTIVE' | 'REPLACED' | 'FAULT';
}

export interface SystemTelemetry {
  lastSyncAt: string;
  currentOutputKw?: number;
  dailyYieldKwh?: number;
  batterySocPercent?: number;
  gridStatus?: 'ONLINE' | 'OUTAGE' | 'GENERATOR';
  estimatedBackupHours?: number;
}

export interface CustomerSystem {
  id: string;
  customerId: string;
  name: string; // e.g. "10kVA Three-Phase Commercial Solar"
  systemType: 'HYBRID_SOLAR' | 'OFF_GRID' | 'BACKUP_INVERTER' | 'DIESEL_HYBRID';
  locationId: string;
  locationName: string;
  installationDate: string;
  installedBy: string;
  totalCapacityKva: number;
  batteryCapacityKwh: number;
  solarCapacityKwp?: number;
  healthStatus: SystemHealthStatus;
  components: SystemComponent[];
  telemetry?: SystemTelemetry;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface ServiceRecord {
  id: string;
  customerId: string;
  systemId: string;
  systemName: string;
  serviceDate: string;
  technicianName: string;
  department: string;
  issueDescription: string;
  workPerformed: string;
  partsReplaced: string[];
  status: 'COMPLETED' | 'SCHEDULED' | 'IN_PROGRESS' | 'FOLLOW_UP_REQUIRED';
  nextRecommendedServiceDate?: string;
  serviceReportUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type MaintenanceIntervalType = 'QUARTERLY_CHECK' | 'SEMI_ANNUAL_INSPECTION' | 'ANNUAL_CERTIFICATION' | 'BATTERY_HEALTH_ANALYSIS' | 'PANEL_CLEANING';

export interface MaintenanceReminder {
  id: string;
  customerId: string;
  systemId: string;
  systemName: string;
  title: string;
  intervalType: MaintenanceIntervalType;
  dueDate: string;
  status: 'UPCOMING' | 'OVERDUE' | 'COMPLETED' | 'DISMISSED';
  isVerified: boolean;
  description: string;
  recommendedAction: string;
  createdAt: string;
  updatedAt: string;
}

export type WarrantyStatus = 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED' | 'CLAIM_IN_PROGRESS';

export interface WarrantyRecord {
  id: string;
  customerId: string;
  systemId?: string;
  productName: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyPeriodMonths: number;
  startDate: string;
  endDate: string;
  status: WarrantyStatus;
  termsSummary: string;
  certificateUrl?: string;
  claimProcedure: string;
  createdAt: string;
  updatedAt: string;
}

export type DocumentType = 'INVOICE' | 'QUOTE' | 'RECEIPT' | 'USER_MANUAL' | 'WARRANTY_CERTIFICATE' | 'SERVICE_REPORT' | 'SINGLE_LINE_DIAGRAM';

export interface DocumentRecord {
  id: string;
  customerId: string;
  systemId?: string;
  type: DocumentType;
  title: string;
  referenceNumber?: string;
  fileUrl: string;
  fileSizeKb: number;
  fileFormat: string; // 'pdf' | 'png' | 'doc'
  issuedDate: string;
  createdAt: string;
  updatedAt: string;
}

export type TicketStatus = 'NEW_REQUEST' | 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_CUSTOMER' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TicketCategory = 'INVERTER_FAULT' | 'BATTERY_ISSUE' | 'SOLAR_OUTPUT' | 'MAINTENANCE_REQUEST' | 'BILLING' | 'GENERAL_INQUIRY';

export interface TicketAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSizeKb: number;
  url: string;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderType: 'CUSTOMER' | 'AGENT' | 'SYSTEM' | 'AI_ASSISTANT';
  content: string;
  attachments?: TicketAttachment[];
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string; // e.g. "3E-TCK-2026-0042"
  customerId: string;
  customerName: string;
  customerEmail: string;
  systemId?: string;
  systemName?: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  subject: string;
  initialDescription: string;
  assignedEngineer?: string;
  messages: TicketMessage[];
  attachments: TicketAttachment[];
  escalatedFromAi?: boolean;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export type CustomerNotificationType = 'SERVICE_REMINDER' | 'ORDER_UPDATE' | 'TICKET_REPLY' | 'MAINTENANCE_DUE' | 'RECOMMENDATION' | 'SYSTEM_ALERT';

export interface CustomerNotification {
  id: string;
  customerId: string;
  type: CustomerNotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ContextualRecommendation {
  id: string;
  customerId: string;
  systemId?: string;
  title: string;
  rationale: string;
  category: 'EXPANSION' | 'MAINTENANCE' | 'STORAGE_UPGRADE' | 'MONITORING';
  suggestedProductSlug?: string;
  estimatedBenefit: string;
  callToAction: {
    label: string;
    href: string;
  };
}

