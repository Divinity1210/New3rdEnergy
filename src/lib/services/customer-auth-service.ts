/**
 * Customer Auth Service — My Energy Customer Platform
 * 
 * Manages customer sessions, JWT tokens, and isolated customer authentication.
 * Pre-seeds a rich Demo Customer Profile for instant exploration.
 */

import { CustomerUser, CustomerSession, CustomerProfile } from '@/lib/types';
import { 
  customerUsersStore, 
  customerProfilesStore, 
  customerSystemsStore, 
  serviceRecordsStore, 
  maintenanceStore, 
  warrantiesStore, 
  documentsStore, 
  supportTicketsStore, 
  customerNotificationsStore, 
  StoreEntity 
} from './store-service';
import { hashPassword, verifyPassword } from './auth-service';

const CUSTOMER_AUTH_SECRET = process.env.CUSTOMER_AUTH_SECRET || process.env.AUTH_SECRET || 'dev-customer-secret-3rd-energy-2026';
const CUSTOMER_SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
export const CUSTOMER_COOKIE_NAME = '3e_customer_session';

export function getCustomerCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: CUSTOMER_SESSION_DURATION_MS / 1000,
  };
}

// ===== JWT TOKEN OPERATIONS =====

async function signCustomer(payload: object): Promise<string> {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(CUSTOMER_AUTH_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(`${header}.${body}`));
  const sigHex = Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${header}.${body}.${sigHex}`;
}

export async function verifyCustomerToken(token: string): Promise<CustomerSession | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, body, sigHex] = parts;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(CUSTOMER_AUTH_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const sigBytes = new Uint8Array((sigHex.match(/.{2}/g) || []).map(h => parseInt(h, 16)));
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(`${header}.${body}`));
    if (!valid) return null;

    const payload = JSON.parse(atob(body)) as CustomerSession;
    if (payload.exp && Date.now() > payload.exp) return null;

    return payload;
  } catch {
    return null;
  }
}

export async function createCustomerSession(user: CustomerUser): Promise<string> {
  const now = Date.now();
  const session: CustomerSession = {
    userId: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: 'CUSTOMER',
    profileId: user.profileId,
    iat: now,
    exp: now + CUSTOMER_SESSION_DURATION_MS,
  };
  return signCustomer(session);
}

// ===== AUTH & USER METHODS =====

export async function findCustomerByEmail(email: string): Promise<CustomerUser | null> {
  const users = await customerUsersStore.findBy('email', email.trim().toLowerCase());
  if (users.length === 0) return null;
  return users[0] as unknown as CustomerUser;
}

export async function findCustomerById(id: string): Promise<CustomerUser | null> {
  if (id === 'cust_demo_user_01') {
    return getDemoCustomerUser();
  }
  const user = await customerUsersStore.get(id);
  if (!user) return null;
  return user as unknown as CustomerUser;
}

export async function authenticateCustomer(email: string, password: string): Promise<CustomerUser | null> {
  const normalised = email.trim().toLowerCase();
  const demoEmail = 'demo@3rdenergy.com';

  // Demo user instant access (guarantees frictionless demo on Vercel)
  if (normalised === demoEmail && (password === 'demo123' || password === 'demo')) {
    await seedDemoCustomerData();
    return getDemoCustomerUser();
  }

  const user = await findCustomerByEmail(normalised);
  if (!user || !user.isActive) return null;

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return null;

  try {
    await customerUsersStore.update(user.id, { lastLoginAt: new Date().toISOString() });
  } catch { /* ignore on serverless write warning */ }

  return user;
}

export async function registerCustomer(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  companyName?: string;
  industry?: string;
  address?: string;
  city?: string;
  state?: string;
}): Promise<CustomerUser> {
  const normalised = data.email.trim().toLowerCase();
  const existing = await findCustomerByEmail(normalised);
  if (existing) {
    throw new Error('An account with this email already exists.');
  }

  const now = new Date().toISOString();
  const passwordHash = await hashPassword(data.password);
  const userId = `cust_user_${Date.now()}`;
  const profileId = `cust_prof_${Date.now()}`;

  const profile: CustomerProfile = {
    id: profileId,
    userId,
    email: normalised,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    companyName: data.companyName,
    industry: data.industry || 'Commercial',
    locations: [
      {
        id: `loc_${Date.now()}`,
        name: data.companyName ? `${data.companyName} Primary Site` : 'Primary Site',
        address: data.address || 'Address on file',
        city: data.city || 'Lagos',
        state: data.state || 'Lagos State',
        country: 'Nigeria',
        isPrimary: true,
        contactPerson: `${data.firstName} ${data.lastName}`,
        contactPhone: data.phone,
      },
    ],
    notificationPreferences: {
      email: true,
      sms: true,
      whatsapp: true,
      maintenanceReminders: true,
      orderUpdates: true,
      ticketResponses: true,
    },
    createdAt: now,
    updatedAt: now,
  };

  const user: CustomerUser = {
    id: userId,
    email: normalised,
    passwordHash,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    role: 'CUSTOMER',
    isActive: true,
    profileId,
    createdAt: now,
    updatedAt: now,
    lastLoginAt: now,
  };

  await customerProfilesStore.create(profile as StoreEntity & Record<string, unknown>);
  await customerUsersStore.create(user as StoreEntity & Record<string, unknown>);

  // Welcome notification
  await customerNotificationsStore.create({
    id: `notif_${Date.now()}`,
    customerId: userId,
    type: 'ORDER_UPDATE',
    title: 'Welcome to My Energy Platform',
    message: 'Your commercial energy account has been provisioned. Explore your systems, documents, and 24/7 AI assistance.',
    link: '/my-energy',
    isRead: false,
    createdAt: now,
    updatedAt: now,
  } as StoreEntity & Record<string, unknown>);

  return user;
}

// ===== DEMO SEED DATA HELPER =====

function getDemoCustomerUser(): CustomerUser {
  const now = new Date().toISOString();
  return {
    id: 'cust_demo_user_01',
    email: 'demo@3rdenergy.com',
    passwordHash: '',
    firstName: 'Tunde',
    lastName: 'Adeleke',
    phone: '+234 803 555 0192',
    role: 'CUSTOMER',
    isActive: true,
    profileId: 'cust_prof_demo_01',
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: now,
    lastLoginAt: now,
  };
}

export async function seedDemoCustomerData(): Promise<void> {
  const existing = await customerProfilesStore.get('cust_prof_demo_01');
  if (existing) return;

  const now = new Date().toISOString();
  const customerId = 'cust_demo_user_01';

  // 1. Profile
  const profile: CustomerProfile = {
    id: 'cust_prof_demo_01',
    userId: customerId,
    email: 'demo@3rdenergy.com',
    firstName: 'Tunde',
    lastName: 'Adeleke',
    phone: '+234 803 555 0192',
    companyName: 'Apex Health Logistics Nigeria',
    industry: 'Healthcare & Cold Chain Logistics',
    jobTitle: 'Managing Director & Operations Head',
    locations: [
      {
        id: 'loc_vi_hq',
        name: 'Victoria Island Operations Hub',
        address: 'Plot 14B, Adeola Odeku Street',
        city: 'Victoria Island',
        state: 'Lagos State',
        country: 'Nigeria',
        isPrimary: true,
        contactPerson: 'Tunde Adeleke',
        contactPhone: '+234 803 555 0192',
      },
      {
        id: 'loc_ikeja_warehouse',
        name: 'Ikeja Cold Storage Facility',
        address: '12 Commercial Avenue, Ikeja Industrial Estate',
        city: 'Ikeja',
        state: 'Lagos State',
        country: 'Nigeria',
        isPrimary: false,
        contactPerson: 'Engr. Emeka Okoye',
        contactPhone: '+234 802 111 4890',
      },
    ],
    notificationPreferences: {
      email: true,
      sms: true,
      whatsapp: true,
      maintenanceReminders: true,
      orderUpdates: true,
      ticketResponses: true,
    },
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: now,
  };

  // 2. Installed System
  const system: StoreEntity & Record<string, unknown> = {
    id: 'sys_demo_10kva',
    customerId,
    name: '10kVA Three-Phase Commercial Solar & Storage Hub',
    systemType: 'HYBRID_SOLAR',
    locationId: 'loc_vi_hq',
    locationName: 'Victoria Island Operations Hub',
    installationDate: '2026-02-10T11:00:00Z',
    installedBy: '3rd Energy Certified Field Engineering Team #4',
    totalCapacityKva: 10,
    batteryCapacityKwh: 20,
    solarCapacityKwp: 9.9,
    healthStatus: 'OPTIMAL',
    components: [
      {
        id: 'comp_inv_1',
        type: 'INVERTER',
        name: '3rd Energy 10kVA 48V Three-Phase Smart Commercial Inverter',
        modelNumber: '3E-INV-10KVA-3P-48V',
        serialNumber: '3E-SN-2026-INV-99214',
        manufacturer: '3rd Energy Power Systems',
        capacity: '10kVA / 48V (Dual MPPT)',
        warrantyExpiry: '2031-02-10T00:00:00Z',
        installDate: '2026-02-10T11:00:00Z',
        status: 'ACTIVE',
      },
      {
        id: 'comp_bat_1',
        type: 'BATTERY',
        name: '3rd Energy 10.24kWh LiFePO4 Commercial PowerWall Module (Unit 1)',
        modelNumber: '3E-BAT-10KWH-LFP-R48',
        serialNumber: '3E-SN-2026-BAT-88410',
        manufacturer: '3rd Energy Storage Division',
        capacity: '10.24kWh (51.2V 200Ah)',
        warrantyExpiry: '2036-02-10T00:00:00Z',
        installDate: '2026-02-10T11:00:00Z',
        status: 'ACTIVE',
      },
      {
        id: 'comp_bat_2',
        type: 'BATTERY',
        name: '3rd Energy 10.24kWh LiFePO4 Commercial PowerWall Module (Unit 2)',
        modelNumber: '3E-BAT-10KWH-LFP-R48',
        serialNumber: '3E-SN-2026-BAT-88411',
        manufacturer: '3rd Energy Storage Division',
        capacity: '10.24kWh (51.2V 200Ah)',
        warrantyExpiry: '2036-02-10T00:00:00Z',
        installDate: '2026-02-10T11:00:00Z',
        status: 'ACTIVE',
      },
      {
        id: 'comp_pv_1',
        type: 'SOLAR_PANELS',
        name: '3rd Energy 550W Tier-1 Monocrystalline PERC Array (18 Panels)',
        modelNumber: '3E-SP-550W-MONO-HC',
        serialNumber: '3E-SN-2026-PV-ARRAY-18',
        manufacturer: '3rd Energy Tier-1 OEM',
        capacity: '9.9kWp Peak Photovoltaic',
        warrantyExpiry: '2051-02-10T00:00:00Z',
        installDate: '2026-02-10T11:00:00Z',
        status: 'ACTIVE',
      },
      {
        id: 'comp_ems_1',
        type: 'MONITORING_HUB',
        name: '3rd Energy Smart Energy Management Hub (EMS & ATS Controller)',
        modelNumber: '3E-ACC-EMS-LOGGER',
        serialNumber: '3E-SN-2026-EMS-10492',
        manufacturer: '3rd Energy Digital Telemetry',
        capacity: 'Smart IoT Cloud Telemetry & Gen Auto-Start',
        warrantyExpiry: '2029-02-10T00:00:00Z',
        installDate: '2026-02-10T11:00:00Z',
        status: 'ACTIVE',
      },
    ],
    telemetry: {
      lastSyncAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
      currentOutputKw: 6.4,
      dailyYieldKwh: 34.8,
      batterySocPercent: 91,
      gridStatus: 'ONLINE',
      estimatedBackupHours: 16.5,
    },
    notes: 'Three-phase dedicated circuit for vaccine cold-chain refrigeration and IT server room.',
    createdAt: '2026-02-10T11:00:00Z',
    updatedAt: now,
  };

  // 3. Service History
  const serviceRecords: (StoreEntity & Record<string, unknown>)[] = [
    {
      id: 'srv_rec_001',
      customerId,
      systemId: 'sys_demo_10kva',
      systemName: '10kVA Three-Phase Commercial Solar & Storage Hub',
      serviceDate: '2026-02-10T15:30:00Z',
      technicianName: 'Engr. Babatunde Jinadu (Lead Electrical Engineer)',
      department: 'Commercial Commissioning & Field Engineering',
      issueDescription: 'Turnkey Commissioning, Phase Synchronization & Load Testing',
      workPerformed: 'Completed full installation testing, insulation resistance testing (1000V DC), calibrated dual MPPT trackers, configured EMS generator auto-start integration, and conducted 3-hour continuous load stress test.',
      partsReplaced: ['Commissioning Consumables', 'Industrial DC Surge Protectors Type II'],
      status: 'COMPLETED',
      nextRecommendedServiceDate: '2026-08-10T00:00:00Z',
      serviceReportUrl: '/documents/3E-COMMISSIONING-REPORT-SYS-99214.pdf',
      createdAt: '2026-02-10T16:00:00Z',
      updatedAt: '2026-02-10T16:00:00Z',
    },
    {
      id: 'srv_rec_002',
      customerId,
      systemId: 'sys_demo_10kva',
      systemName: '10kVA Three-Phase Commercial Solar & Storage Hub',
      serviceDate: '2026-05-18T10:00:00Z',
      technicianName: 'Engr. Kazeem Balogun',
      department: 'Preventive Asset Maintenance & Calibration',
      issueDescription: 'Quarterly Routine Electrical Inspection & Battery Cell Balancing',
      workPerformed: 'Inspected MC4 connectors, thermal imaging on main AC/DC distribution board (no hot spots detected), cleaned inverter dust filters, verified battery firmware v3.4.1, and checked earth resistance (measured at 1.8 ohms).',
      partsReplaced: ['Inverter Intake Dust Filter Mesh'],
      status: 'COMPLETED',
      nextRecommendedServiceDate: '2026-11-18T00:00:00Z',
      serviceReportUrl: '/documents/3E-MAINTENANCE-Q1-2026-SYS-99214.pdf',
      createdAt: '2026-05-18T12:00:00Z',
      updatedAt: '2026-05-18T12:00:00Z',
    },
  ];

  // 4. Maintenance Reminders
  const maintenanceReminders: (StoreEntity & Record<string, unknown>)[] = [
    {
      id: 'maint_rem_001',
      customerId,
      systemId: 'sys_demo_10kva',
      systemName: '10kVA Three-Phase Commercial Solar & Storage Hub',
      title: 'Semi-Annual Solar Panel Wash & Optical Check',
      intervalType: 'PANEL_CLEANING',
      dueDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'UPCOMING',
      isVerified: true,
      description: 'Harmattan soot and dust accumulation reduction to restore full 9.9kWp peak optical efficiency.',
      recommendedAction: 'Book verified 3rd Energy maintenance crew for specialized deionized water panel cleaning.',
      createdAt: '2026-05-18T12:00:00Z',
      updatedAt: now,
    },
    {
      id: 'maint_rem_002',
      customerId,
      systemId: 'sys_demo_10kva',
      systemName: '10kVA Three-Phase Commercial Solar & Storage Hub',
      title: 'Annual Electrical Safety & Earthing Certification',
      intervalType: 'ANNUAL_CERTIFICATION',
      dueDate: '2027-02-10T00:00:00Z',
      status: 'UPCOMING',
      isVerified: true,
      description: 'Comprehensive annual insulation resistance, grounding mesh verification, and compliance renewal.',
      recommendedAction: 'Schedule formal annual certification inspection.',
      createdAt: '2026-02-10T16:00:00Z',
      updatedAt: now,
    },
  ];

  // 5. Warranties
  const warranties: (StoreEntity & Record<string, unknown>)[] = [
    {
      id: 'war_inv_001',
      customerId,
      systemId: 'sys_demo_10kva',
      productName: '3rd Energy 10kVA Three-Phase Smart Inverter',
      serialNumber: '3E-SN-2026-INV-99214',
      purchaseDate: '2026-02-05T00:00:00Z',
      warrantyPeriodMonths: 60, // 5 Years
      startDate: '2026-02-10T00:00:00Z',
      endDate: '2031-02-10T00:00:00Z',
      status: 'ACTIVE',
      termsSummary: '5-Year Full Comprehensive Replacement Warranty against manufacturer defects and electronic component failure.',
      certificateUrl: '/documents/3E-WARRANTY-CERT-INV-99214.pdf',
      claimProcedure: 'Contact dedicated 3rd Energy priority SLA support with serial number for rapid 48-hour swap.',
      createdAt: '2026-02-10T16:00:00Z',
      updatedAt: now,
    },
    {
      id: 'war_bat_001',
      customerId,
      systemId: 'sys_demo_10kva',
      productName: '3rd Energy 20.48kWh LiFePO4 Dual PowerWall System',
      serialNumber: '3E-SN-2026-BAT-88410 / 88411',
      purchaseDate: '2026-02-05T00:00:00Z',
      warrantyPeriodMonths: 120, // 10 Years
      startDate: '2026-02-10T00:00:00Z',
      endDate: '2036-02-10T00:00:00Z',
      status: 'ACTIVE',
      termsSummary: '10-Year or 6,000 Cycles Performance Warranty retaining >= 80% original capacity at 0.5C discharge rate.',
      certificateUrl: '/documents/3E-WARRANTY-CERT-BAT-88410.pdf',
      claimProcedure: 'Remote battery telemetry audit followed by on-site engineer verification.',
      createdAt: '2026-02-10T16:00:00Z',
      updatedAt: now,
    },
  ];

  // 6. Document Vault
  const documents: (StoreEntity & Record<string, unknown>)[] = [
    {
      id: 'doc_inv_2026_091',
      customerId,
      systemId: 'sys_demo_10kva',
      type: 'INVOICE',
      title: 'Commercial Tax Invoice — Turnkey 10kVA Solar & Battery System',
      referenceNumber: '3E-INV-2026-00914',
      fileUrl: '/documents/3E-TAX-INVOICE-00914.pdf',
      fileSizeKb: 420,
      fileFormat: 'pdf',
      issuedDate: '2026-02-05T00:00:00Z',
      createdAt: '2026-02-05T00:00:00Z',
      updatedAt: now,
    },
    {
      id: 'doc_sld_2026_091',
      customerId,
      systemId: 'sys_demo_10kva',
      type: 'SINGLE_LINE_DIAGRAM',
      title: 'As-Built Single-Line Electrical Schematic & PV String Layout',
      referenceNumber: '3E-ENG-DWG-10KVA-VI',
      fileUrl: '/documents/3E-SCHEMATIC-VI-HQ.pdf',
      fileSizeKb: 1850,
      fileFormat: 'pdf',
      issuedDate: '2026-02-10T00:00:00Z',
      createdAt: '2026-02-10T00:00:00Z',
      updatedAt: now,
    },
    {
      id: 'doc_man_10kva',
      customerId,
      systemId: 'sys_demo_10kva',
      type: 'USER_MANUAL',
      title: '3rd Energy 10kVA 3-Phase Smart Hybrid Inverter Operating Manual',
      referenceNumber: '3E-MAN-INV-10KVA-EN',
      fileUrl: '/documents/3E-OPERATING-MANUAL-10KVA.pdf',
      fileSizeKb: 3400,
      fileFormat: 'pdf',
      issuedDate: '2026-01-01T00:00:00Z',
      createdAt: '2026-02-10T00:00:00Z',
      updatedAt: now,
    },
    {
      id: 'doc_cert_war',
      customerId,
      systemId: 'sys_demo_10kva',
      type: 'WARRANTY_CERTIFICATE',
      title: 'Official 3rd Energy Master Equipment Warranty Certificate',
      referenceNumber: '3E-CERT-WAR-2026-99214',
      fileUrl: '/documents/3E-WARRANTY-CERTIFICATE-MASTER.pdf',
      fileSizeKb: 650,
      fileFormat: 'pdf',
      issuedDate: '2026-02-10T00:00:00Z',
      createdAt: '2026-02-10T00:00:00Z',
      updatedAt: now,
    },
  ];

  // 7. Support Ticket
  const tickets: (StoreEntity & Record<string, unknown>)[] = [
    {
      id: 'tck_demo_001',
      ticketNumber: '3E-TCK-2026-0042',
      customerId,
      customerName: 'Tunde Adeleke (Apex Health Logistics)',
      customerEmail: 'demo@3rdenergy.com',
      systemId: 'sys_demo_10kva',
      systemName: '10kVA Three-Phase Commercial Solar & Storage Hub',
      category: 'MAINTENANCE_REQUEST',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      subject: 'Inquiry regarding scheduled solar panel wash before peak Harmattan season',
      initialDescription: 'Hello, our operations team noticed slight dust build-up on the roof array. Would like to confirm the procedure and date for the upcoming semi-annual maintenance.',
      assignedEngineer: 'Engr. Kazeem Balogun (Service Lead)',
      messages: [
        {
          id: 'tmsg_1',
          ticketId: 'tck_demo_001',
          senderId: customerId,
          senderName: 'Tunde Adeleke',
          senderType: 'CUSTOMER',
          content: 'Hello, our operations team noticed slight dust build-up on the roof array. Would like to confirm the procedure and date for the upcoming semi-annual maintenance.',
          timestamp: '2026-08-20T09:15:00Z',
        },
        {
          id: 'tmsg_2',
          ticketId: 'tck_demo_001',
          senderId: 'engr_kazeem',
          senderName: 'Engr. Kazeem Balogun (3rd Energy)',
          senderType: 'AGENT',
          content: 'Good day Mr. Adeleke, thank you for reaching out. We have logged this request under your maintenance package. Our certified cleaning crew is slated for your Victoria Island hub next week Wednesday at 09:00 AM. We will conduct optical verification and string voltage tests immediately after.',
          timestamp: '2026-08-20T10:45:00Z',
        },
      ],
      attachments: [],
      createdAt: '2026-08-20T09:15:00Z',
      updatedAt: '2026-08-20T10:45:00Z',
    },
  ];

  // 8. Notifications
  const notifications: (StoreEntity & Record<string, unknown>)[] = [
    {
      id: 'notif_demo_1',
      customerId,
      type: 'MAINTENANCE_DUE',
      title: 'Upcoming Maintenance Scheduled',
      message: 'Semi-annual solar array cleaning for your Victoria Island Hub is due in 18 days.',
      link: '/my-energy/maintenance',
      isRead: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: now,
    },
    {
      id: 'notif_demo_2',
      customerId,
      type: 'SYSTEM_ALERT',
      title: 'System Telemetry Optimal',
      message: 'Your 10kVA system generated 34.8 kWh today with 91% battery state of charge.',
      link: '/my-energy/systems/sys_demo_10kva',
      isRead: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: now,
    },
  ];

  try {
    await customerProfilesStore.create(profile as StoreEntity & Record<string, unknown>);
    await customerSystemsStore.create(system);
    for (const s of serviceRecords) await serviceRecordsStore.create(s);
    for (const m of maintenanceReminders) await maintenanceStore.create(m);
    for (const w of warranties) await warrantiesStore.create(w);
    for (const d of documents) await documentsStore.create(d);
    for (const t of tickets) await supportTicketsStore.create(t);
    for (const n of notifications) await customerNotificationsStore.create(n);
  } catch (err) {
    console.warn('[CustomerAuthService] Note on demo seeding:', err);
  }
}
