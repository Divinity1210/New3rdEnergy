/**
 * Customer Portal Service — My Energy Platform
 * 
 * Provides unified queries and data aggregation for customer systems,
 * service history, maintenance schedules, warranty tracking, document vault,
 * and contextual, non-aggressive commercial recommendations.
 */

import { 
  CustomerSystem, 
  ServiceRecord, 
  MaintenanceReminder, 
  WarrantyRecord, 
  DocumentRecord, 
  ContextualRecommendation, 
  Order, 
  InstallationProject, 
  CustomerProfile
} from '@/lib/types';
import { 
  customerSystemsStore, 
  serviceRecordsStore, 
  maintenanceStore, 
  warrantiesStore, 
  documentsStore, 
  ordersStore, 
  installationsStore, 
  supportTicketsStore,
  customerProfilesStore,
  customerNotificationsStore,
  StoreEntity
} from './store-service';
import { seedDemoCustomerData } from './customer-auth-service';

export interface CustomerDashboardData {
  profile: CustomerProfile | null;
  systems: CustomerSystem[];
  totalInstalledKva: number;
  totalBatteryKwh: number;
  activeSolarKwp: number;
  recentServiceRecords: ServiceRecord[];
  upcomingMaintenance: MaintenanceReminder[];
  activeWarranties: WarrantyRecord[];
  recentOrders: Order[];
  activeInstallations: InstallationProject[];
  openTicketsCount: number;
  unreadNotificationsCount: number;
  recommendations: ContextualRecommendation[];
}

export async function getCustomerDashboardSummary(customerId: string): Promise<CustomerDashboardData> {
  // Ensure demo data is available if demo user
  if (customerId === 'cust_demo_user_01') {
    await seedDemoCustomerData();
  }

  const [
    profileRaw,
    systemsRaw,
    servicesRaw,
    maintenanceRaw,
    warrantiesRaw,
    ticketsRaw,
    notificationsRaw,
    ordersRaw,
    installationsRaw,
  ] = await Promise.all([
    customerProfilesStore.findBy('userId', customerId),
    customerSystemsStore.findBy('customerId', customerId),
    serviceRecordsStore.findBy('customerId', customerId),
    maintenanceStore.findBy('customerId', customerId),
    warrantiesStore.findBy('customerId', customerId),
    supportTicketsStore.findBy('customerId', customerId),
    customerNotificationsStore.findBy('customerId', customerId),
    ordersStore.list(),
    installationsStore.list(),
  ]);

  const profile = (profileRaw[0] as unknown as CustomerProfile) || null;
  const systems = systemsRaw as unknown as CustomerSystem[];
  const services = servicesRaw as unknown as ServiceRecord[];
  const maintenance = maintenanceRaw as unknown as MaintenanceReminder[];
  const warranties = warrantiesRaw as unknown as WarrantyRecord[];
  const unreadNotifications = notificationsRaw.filter(n => !n.isRead);
  const openTickets = ticketsRaw.filter(t => t.status !== 'CLOSED' && t.status !== 'RESOLVED');

  // Match orders by customer ID or email
  const customerEmail = profile?.email?.toLowerCase();
  const customerOrders = (ordersRaw as unknown as Order[]).filter(o => 
    (o as unknown as { customerId?: string }).customerId === customerId || 
    (customerEmail && o.customer?.email?.toLowerCase() === customerEmail)
  );

  const customerInstallations = (installationsRaw as unknown as InstallationProject[]).filter(i =>
    (i as unknown as { customerId?: string }).customerId === customerId ||
    (customerEmail && (i as unknown as { contactEmail?: string }).contactEmail?.toLowerCase() === customerEmail)
  );

  // Compute aggregated totals
  const totalInstalledKva = systems.reduce((sum, s) => sum + (s.totalCapacityKva || 0), 0);
  const totalBatteryKwh = systems.reduce((sum, s) => sum + (s.batteryCapacityKwh || 0), 0);
  const activeSolarKwp = systems.reduce((sum, s) => sum + (s.solarCapacityKwp || 0), 0);

  // Contextual smart recommendations based on actual customer systems
  const recommendations = generateContextualRecommendations(systems, maintenance);

  return {
    profile,
    systems,
    totalInstalledKva,
    totalBatteryKwh,
    activeSolarKwp,
    recentServiceRecords: services.slice(0, 5),
    upcomingMaintenance: maintenance.filter(m => m.status === 'UPCOMING').slice(0, 5),
    activeWarranties: warranties.filter(w => w.status === 'ACTIVE'),
    recentOrders: customerOrders.slice(0, 5),
    activeInstallations: customerInstallations.slice(0, 5),
    openTicketsCount: openTickets.length,
    unreadNotificationsCount: unreadNotifications.length,
    recommendations,
  };
}

export async function getCustomerSystems(customerId: string): Promise<CustomerSystem[]> {
  if (customerId === 'cust_demo_user_01') await seedDemoCustomerData();
  const raw = await customerSystemsStore.findBy('customerId', customerId);
  return raw as unknown as CustomerSystem[];
}

export async function getCustomerSystemById(customerId: string, systemId: string): Promise<CustomerSystem | null> {
  if (customerId === 'cust_demo_user_01') await seedDemoCustomerData();
  const system = await customerSystemsStore.get(systemId);
  if (!system || (system as unknown as CustomerSystem).customerId !== customerId) {
    return null;
  }
  return system as unknown as CustomerSystem;
}

export async function getCustomerServiceHistory(customerId: string, systemId?: string): Promise<ServiceRecord[]> {
  if (customerId === 'cust_demo_user_01') await seedDemoCustomerData();
  const records = await serviceRecordsStore.findBy('customerId', customerId);
  const typed = records as unknown as ServiceRecord[];
  if (systemId) {
    return typed.filter(r => r.systemId === systemId);
  }
  return typed;
}

export async function getCustomerMaintenance(customerId: string): Promise<MaintenanceReminder[]> {
  if (customerId === 'cust_demo_user_01') await seedDemoCustomerData();
  const records = await maintenanceStore.findBy('customerId', customerId);
  return records as unknown as MaintenanceReminder[];
}

export async function getCustomerWarranties(customerId: string): Promise<WarrantyRecord[]> {
  if (customerId === 'cust_demo_user_01') await seedDemoCustomerData();
  const records = await warrantiesStore.findBy('customerId', customerId);
  return records as unknown as WarrantyRecord[];
}

export async function getCustomerDocuments(customerId: string): Promise<DocumentRecord[]> {
  if (customerId === 'cust_demo_user_01') await seedDemoCustomerData();
  const records = await documentsStore.findBy('customerId', customerId);
  return records as unknown as DocumentRecord[];
}

export async function createServiceRequest(customerId: string, data: {
  systemId: string;
  systemName: string;
  preferredDate: string;
  issueDescription: string;
  contactPhone: string;
}): Promise<ServiceRecord> {
  const now = new Date().toISOString();
  const record: ServiceRecord = {
    id: `srv_req_${Date.now()}`,
    customerId,
    systemId: data.systemId,
    systemName: data.systemName,
    serviceDate: data.preferredDate || now,
    technicianName: 'To be assigned by 3rd Energy Operations',
    department: 'Commercial Field Support',
    issueDescription: data.issueDescription,
    workPerformed: 'Service inspection requested by customer. Pending engineering dispatch.',
    partsReplaced: [],
    status: 'SCHEDULED',
    createdAt: now,
    updatedAt: now,
  };

  await serviceRecordsStore.create(record as StoreEntity & Record<string, unknown>);

  // Also create a notification
  await customerNotificationsStore.create({
    id: `notif_${Date.now()}`,
    customerId,
    type: 'SERVICE_REMINDER',
    title: 'Service Request Confirmed',
    message: `Your service request for ${data.systemName} has been logged. An engineer will confirm scheduling.`,
    link: '/my-energy/service-history',
    isRead: false,
    createdAt: now,
    updatedAt: now,
  } as StoreEntity & Record<string, unknown>);

  return record;
}

// ===== SMART CONTEXTUAL RECOMMENDATION ENGINE =====

function generateContextualRecommendations(
  systems: CustomerSystem[],
  maintenance: MaintenanceReminder[]
): ContextualRecommendation[] {
  const recommendations: ContextualRecommendation[] = [];

  // Check battery storage ratio
  const totalKva = systems.reduce((s, sys) => s + (sys.totalCapacityKva || 0), 0);
  const totalKwh = systems.reduce((s, sys) => s + (sys.batteryCapacityKwh || 0), 0);

  if (totalKva >= 10 && totalKwh < 30) {
    recommendations.push({
      id: 'rec_storage_ext',
      customerId: systems[0]?.customerId || '',
      systemId: systems[0]?.id,
      title: 'Commercial Nighttime Autonomy Extension',
      rationale: `Your current 10kVA system operates with ${totalKwh}kWh storage. Adding an auxiliary 10.24kWh LiFePO4 module will increase total nighttime autonomy by ~6.5 hours during peak grid outages.`,
      category: 'STORAGE_UPGRADE',
      suggestedProductSlug: '10kwh-commercial-lifepo4-battery',
      estimatedBenefit: '+6.5 Hours Extended Night Backup',
      callToAction: {
        label: 'View Compatible Battery Module',
        href: '/power/products/10kwh-commercial-lifepo4-battery',
      },
    });
  }

  // Check optical cleaniness / harmattan reminder
  const hasPanelMaint = maintenance.some(m => m.intervalType === 'PANEL_CLEANING' && m.status === 'UPCOMING');
  if (hasPanelMaint) {
    recommendations.push({
      id: 'rec_clean_optic',
      customerId: systems[0]?.customerId || '',
      systemId: systems[0]?.id,
      title: 'Maximize Daily Photovoltaic Yield',
      rationale: 'Harmattan atmospheric soot reduces solar harvest by up to 18%. Scheduling certified deionized panel washing restores peak 9.9kWp generation.',
      category: 'MAINTENANCE',
      estimatedBenefit: 'Restore up to 18% Solar Output',
      callToAction: {
        label: 'Confirm Maintenance Slot',
        href: '/my-energy/maintenance',
      },
    });
  }

  // Monitoring Hub suggestion if not present
  const hasEms = systems.some(sys => sys.components.some(c => c.type === 'MONITORING_HUB'));
  if (!hasEms && systems.length > 0) {
    recommendations.push({
      id: 'rec_ems_hub',
      customerId: systems[0]?.customerId || '',
      title: 'Smart Generator Automation & Diesel Telemetry',
      rationale: 'Integrate the 3rd Energy Smart EMS Hub to automate generator start/stop thresholds based on live battery SOC and fuel level telemetry.',
      category: 'MONITORING',
      suggestedProductSlug: 'smart-ems-telemetry-logger',
      estimatedBenefit: 'Save up to 35% on Diesel Generator Fuel',
      callToAction: {
        label: 'Explore Smart EMS Hub',
        href: '/power/products/smart-ems-telemetry-logger',
      },
    });
  }

  return recommendations;
}
