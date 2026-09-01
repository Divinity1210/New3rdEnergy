import { NextRequest, NextResponse } from 'next/server';
import { powerProducts, powerPackages } from '@/lib/data/power-products';
import { petroleumProducts, depotLocations } from '@/lib/data/petroleum-products';
import { createLead } from '@/lib/services/lead-service';
import { crmAdapter } from '@/lib/adapters/crm-adapter';
import { notificationAdapter } from '@/lib/adapters/notification-adapter';
import { formatCurrency, getWhatsAppUrl } from '@/lib/utils';

interface ConciergeRequest {
  message: string;
  division?: 'all' | 'petroleum' | 'solar';
  history?: { sender: 'user' | 'assistant'; content: string }[];
  context?: {
    currentPath?: string;
    productInterest?: string;
    quantity?: number;
    location?: string;
  };
  bookingPayload?: {
    customerName: string;
    email: string;
    phone: string;
    company?: string;
    division: 'petroleum' | 'power';
    product: string;
    quantity?: string;
    location: string;
    notes?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: ConciergeRequest = await request.json();

    // ─────────────────────────────────────────────────────────────
    // 1. HANDLE DIRECT IN-CHAT BOOKING / RFQ SUBMISSION
    // ─────────────────────────────────────────────────────────────
    if (body.bookingPayload) {
      const p = body.bookingPayload;
      if (!p.customerName || !p.phone || !p.email) {
        return NextResponse.json(
          { error: 'Customer name, phone number, and email are required for booking.' },
          { status: 400 }
        );
      }

      const lead = createLead({
        contact: {
          firstName: p.customerName.split(' ')[0] || p.customerName,
          lastName: p.customerName.split(' ').slice(1).join(' ') || '',
          email: p.email,
          phone: p.phone,
          preferredContact: 'phone',
        },
        organisation: {
          name: p.company || `${p.customerName}'s Business`,
          industry: p.division === 'petroleum' ? 'Bulk Petroleum Client' : 'Solar & Power Client',
        },
        products: [
          {
            productId: `concierge-${p.division}`,
            productName: p.product,
            category: p.division === 'petroleum' ? 'petroleum' : 'solar',
          },
        ],
        quantity: { value: 1, unit: p.quantity || 'inquiry' },
        location: {
          address: p.location,
          city: p.location,
          state: p.location.includes('Lagos') ? 'Lagos' : 'Nigeria',
          country: 'Nigeria',
          deliveryType: 'delivery',
        },
        deliveryRequirement: `AI Concierge Lead: ${p.product} (${p.quantity || 'Quote Request'})`,
        requestedDate: new Date().toISOString().split('T')[0],
        urgency: 'high',
        notes: `Submitted via 3E AI Concierge. Division: ${p.division.toUpperCase()}. Notes: ${p.notes || 'None'}`,
        attachments: [],
        source: 'website_quote',
      });

      // Synchronize to CRM, Leads Store, and trigger email to info@3rdenergyservices.com
      try {
        await crmAdapter.syncLead(lead);
        await notificationAdapter.sendConfirmation(lead);

        const { Store } = await import('@/lib/services/store-service');
        const leadsStore = new Store<any>('leads');
        await leadsStore.create(lead as any);
      } catch (e) {
        console.warn('[Concierge Booking] Sync warning:', e);
      }

      const whatsAppText = `Hello 3RD Energy Services Ltd, I just generated an AI Concierge RFQ/Booking for *${p.product}* (Ref: ${lead.referenceNumber}). Name: ${p.customerName}, Phone: ${p.phone}, Location: ${p.location}.`;

      return NextResponse.json({
        success: true,
        isBookingConfirmed: true,
        referenceNumber: lead.referenceNumber,
        whatsAppUrl: getWhatsAppUrl(whatsAppText),
        message:
          `🎉 **Booking & RFQ Submitted Successfully!**\n\n` +
          `• **Reference Number**: \`${lead.referenceNumber}\`\n` +
          `• **Client**: ${p.customerName} (${p.phone})\n` +
          `• **Product / Requirement**: ${p.product}\n` +
          `• **Delivery / Audit Location**: ${p.location}\n\n` +
          `Our technical sales desk has been notified (**info@3rdenergyservices.com**) and an engineer will contact you within **15 minutes**. You can also continue immediately on WhatsApp:`,
      });
    }

    // ─────────────────────────────────────────────────────────────
    // 2. CONVERSATIONAL INTELLIGENCE ACROSS BOTH DIVISIONS
    // ─────────────────────────────────────────────────────────────
    const query = (body.message || '').trim().toLowerCase();
    if (!query) {
      return NextResponse.json({ error: 'Please enter a message.' }, { status: 400 });
    }

    let division = body.division || 'all';
    if (query.includes('diesel') || query.includes('ago') || query.includes('petrol') || query.includes('pms') || query.includes('kerosene') || query.includes('fuel') || query.includes('tanker') || query.includes('depot') || query.includes('litre')) {
      division = 'petroleum';
    } else if (query.includes('solar') || query.includes('inverter') || query.includes('battery') || query.includes('power bank') || query.includes('panel') || query.includes('kva') || query.includes('lifepo4') || query.includes('ac ') || query.includes('fridge')) {
      division = 'solar';
    }

    let responseText = '';
    let suggestedActions: { label: string; href?: string; actionType?: string; payload?: any }[] = [];
    let richCard: any = null;

    // ─── A. PETROLEUM INTELLIGENCE ───
    if (division === 'petroleum' || query.includes('diesel') || query.includes('ago') || query.includes('petrol') || query.includes('fuel')) {
      if (query.includes('price') || query.includes('cost') || query.includes('quote') || query.includes('how much') || query.includes('tanker') || query.includes('33000') || query.includes('45000')) {
        const isAgo = query.includes('diesel') || query.includes('ago') || !query.includes('pms');
        const unitRate = isAgo ? 1050 : 850;
        const productName = isAgo ? 'Automotive Gas Oil (AGO Diesel - Flash Point >66°C)' : 'Premium Motor Spirit (PMS Petrol)';
        const vol33k = 33000 * unitRate;
        const vol45k = 45000 * unitRate;

        responseText =
          `⛽ **Bulk Petroleum Current Indicative Trading Pricing:**\n\n` +
          `• **Product**: ${productName}\n` +
          `• **Indicative Depot Benchmark**: ~**₦${unitRate.toLocaleString()}/Litre** (Depot-gate Lagos/PH/Warri)\n\n` +
          `📦 **Standard Bridging Tanker Load Estimates:**\n` +
          `• **33,000 Litres (Single Axle)**: ~**${formatCurrency(vol33k)}**\n` +
          `• **45,000 Litres (Tri-Axle)**: ~**${formatCurrency(vol45k)}**\n` +
          `• **60,000 Litres (Multi-Compartment)**: ~**${formatCurrency(60000 * unitRate)}**\n\n` +
          `*Guaranteed <50ppm Euro-V Sulphur, electronic dipstick calibration, and 4-hour emergency delivery SLA.*`;

        richCard = {
          type: 'petroleum_quote',
          product: productName,
          unitPrice: unitRate,
          standardVolumes: [
            { volume: '33,000 Litres', total: vol33k },
            { volume: '45,000 Litres', total: vol45k },
          ],
          actionLabel: 'Generate Formal Petroleum RFQ',
        };

        suggestedActions = [
          { label: '📝 Submit Formal Petroleum RFQ', actionType: 'open_rfq_modal', payload: { division: 'petroleum', product: productName } },
          { label: '🚚 Bulk Fuel Logistics Calculator', href: '/solutions/petroleum/calculator' },
          { label: '📊 View Quality Lab Specs', href: '/solutions/petroleum/quality' },
          { label: '💬 Chat with Petroleum Trader', href: getWhatsAppUrl('Hello 3RD Energy Services Ltd, I need an immediate quote for bulk AGO Diesel / PMS supply.') },
        ];
      } else if (query.includes('quality') || query.includes('spec') || query.includes('lab') || query.includes('flash point') || query.includes('sulphur')) {
        responseText =
          `🔬 **3RD Energy Services Ltd — Petroleum Quality Specifications:**\n\n` +
          `• **Density @ 15°C**: 0.820 – 0.860 kg/m³ (ASTM D1298)\n` +
          `• **Flash Point**: >66.0°C (Safe storage & reduced vapor explosion risk)\n` +
          `• **Sulphur Content**: <50 ppm (Ultra-Low Sulphur Diesel / Euro-V compliant)\n` +
          `• **Cetane Index**: >48.0 (Clean combustion, rapid ignition)\n` +
          `• **Water Content & Sediment**: <0.05% Vol (ASTM D2709)\n\n` +
          `*Every batch is certified by independent SGS/Bureau Veritas inspections with sealed waybill tags.*`;

        suggestedActions = [
          { label: 'View Full Lab Analysis Page', href: '/solutions/petroleum/quality' },
          { label: 'Request Certificate of Analysis (COA)', href: '/solutions/petroleum/contact' },
        ];
      } else if (query.includes('depot') || query.includes('storage') || query.includes('terminal') || query.includes('lease')) {
        responseText =
          `🏢 **3RD Energy Storage & Tank Farm Infrastructure:**\n\n` +
          `• **Depots**: Strategic coastal terminals in **Apapa (Lagos), Ibafon, Port Harcourt, Warri, and Calabar**.\n` +
          `• **Total Capacity**: Over **150,000 Metric Tonnes** active storage.\n` +
          `• **Services**: Dedicated tank leasing, throughput agreements, automated custody transfer (LACT), and 24/7 gantry loading racks.`;

        suggestedActions = [
          { label: 'Storage & Terminal Solutions', href: '/solutions/petroleum/storage' },
          { label: 'Contact Terminal Operations', href: '/solutions/petroleum/contact' },
        ];
      } else {
        responseText =
          `⛽ **3RD Energy Services Ltd — Petroleum Trading & Bulk Supply Desk:**\n\n` +
          `We deliver certified **AGO Diesel, PMS Petrol, DPK Kerosene, ATK Jet Fuel, LPFO, and Industrial Lubricants** directly to manufacturing plants, telecoms cell towers, corporate estates, marine vessels, and retail fuel stations.\n\n` +
          `Would you like an immediate bulk tanker quote, quality specification sheet, or logistics dispatch schedule?`;

        suggestedActions = [
          { label: 'Get Instant Diesel Quote (33,000L)', actionType: 'open_rfq_modal', payload: { division: 'petroleum', product: 'Automotive Gas Oil (AGO Diesel)' } },
          { label: 'Explore Petroleum Solutions', href: '/solutions/petroleum' },
          { label: 'Order Bulk Petroleum Tanker', href: '/solutions/petroleum/order' },
        ];
      }
    }

    // ─── B. SOLAR & CLEAN POWER INTELLIGENCE ───
    else if (division === 'solar' || query.includes('solar') || query.includes('inverter') || query.includes('battery') || query.includes('power bank')) {
      if (query.includes('power bank') || query.includes('laptop') || query.includes('portable') || query.includes('station') || query.includes('phone')) {
        responseText =
          `🔋 **Portable Power & Fast-Charge Laptop Power Banks:**\n\n` +
          `• **30,000mAh 65W PD Laptop Power Bank** (₦48,500): Fast-charges MacBook Pro/Air, Dell XPS, HP laptops + 3 mobile devices simultaneously. 16+ hours remote runtime.\n` +
          `• **50,000mAh 100W PD Heavy-Duty Power Bank** (₦78,000): Ultra-high capacity with integrated LED field lamp.\n` +
          `• **600W / 512Wh Portable Solar Generator** (₦265,000): Powers TVs, laptops, Starlink routers, and studio lights with 230V AC socket.\n` +
          `• **1.2kWh / 1200W Portable Power Station** (₦520,000): Powers mini-fridges, blender, clippers, workstations.\n` +
          `• **3-Bulb DC Solar Home Lighting Kit with FM Radio** (₦38,500): 100% off-grid lighting with phone charger.`;

        richCard = {
          type: 'product_recommendation',
          title: '30,000mAh 65W PD Laptop Power Bank',
          price: 48500,
          image: '/images/products/pb-30000mah.jpg',
          href: '/power/products/30000mah-65w-laptop-power-bank',
        };

        suggestedActions = [
          { label: '🛒 Browse All Portable Hardware in Store', href: '/power/products?category=power-stations' },
          { label: 'Order 30,000mAh 65W Laptop Bank', href: '/power/products/30000mah-65w-laptop-power-bank' },
          { label: 'View 1.2kWh Solar Generator', href: '/power/products/1200w-1280wh-portable-power-station' },
        ];
      } else if (query.includes('package') || query.includes('turnkey') || query.includes('home') || query.includes('house') || query.includes('bedroom') || query.includes('cost') || query.includes('price')) {
        responseText =
          `☀️ **Pre-Engineered Turnkey Solar Packages (Inverter + LiFePO4 + PV + Certified Install):**\n\n` +
          `1. **3.5kVA / 5.12kWh Essential Home System** (₦2,850,000):\n` +
          `   • Powers: Refrigerator, 55" TV, 15 lights, 4 ceiling/standing fans, laptops, Wi-Fi router.\n` +
          `   • 4x 550W Monocrystalline PV panels (2.2kWp) + 5.12kWh LiFePO4 battery.\n\n` +
          `2. **5kVA / 10.24kWh Executive Home & Office System** (₦4,950,000) ★ *Most Popular*:\n` +
          `   • Powers: Inverter AC (1.0HP–1.5HP), deep freezer, fridge, smart TVs, water pump, security cameras.\n` +
          `   • 8x 550W Panels (4.4kWp) + 10.24kWh LiFePO4 battery.\n\n` +
          `3. **10kVA / 20.48kWh Commercial Three-Phase System** (₦9,850,000):\n` +
          `   • Powers: Multiple ACs, commercial machinery, diagnostic clinics, fuel station pumps, duplex estates.\n` +
          `   • 16x 550W Panels (8.8kWp) + 20.48kWh Rack Lithium battery.`;

        richCard = {
          type: 'package_recommendation',
          title: '5kVA / 10.24kWh Executive Solar Package',
          price: 4950000,
          specs: '8x 550W Panels • 10.24kWh LiFePO4 • 5-Yr Warranty',
          image: '/images/solar-family-lifestyle.jpg',
          href: '/power/products/5kva-executive-home-package',
        };

        suggestedActions = [
          { label: '⚡ Run Interactive AI Load Planner', href: '/power/planner' },
          { label: '🛠️ Book a Certified Site Inspection Audit', href: '/power/installation' },
          { label: 'View Executive 5kVA Package', href: '/power/products/5kva-executive-home-package' },
          { label: '💬 Chat on WhatsApp with Solar Engineer', href: getWhatsAppUrl('Hello 3RD Energy Services Ltd, I would like to size a Solar Inverter System for my property.') },
        ];
      } else if (query.includes('install') || query.includes('audit') || query.includes('inspection') || query.includes('book')) {
        responseText =
          `🛠️ **Certified Turnkey Solar Installation & Engineering Audit:**\n\n` +
          `Our certified electrical engineers provide full on-site load audits, roof structural analysis, DC surge protection, and neat conduit trunking.\n\n` +
          `Would you like to book a site audit right now for your property?`;

        suggestedActions = [
          { label: '📅 Book Solar Site Audit Now', actionType: 'open_rfq_modal', payload: { division: 'power', product: 'Solar Site Audit & Installation Booking' } },
          { label: 'Open Installation Booking Form', href: '/power/installation' },
        ];
      } else {
        responseText =
          `☀️ **3RD Energy Services Ltd — Solar & Clean Power Concierge:**\n\n` +
          `I can calculate your exact appliance energy loads, recommend the ideal hybrid inverter & LiFePO4 battery package, find the right portable power bank for your laptop, or schedule a certified rooftop installation audit.\n\n` +
          `What equipment or property are you looking to power today?`;

        suggestedActions = [
          { label: '⚡ Size System for my Home (AI Planner)', href: '/power/planner' },
          { label: '🔋 Explore Laptop Power Banks & Generators', href: '/power/products?category=power-stations' },
          { label: '🏡 View 5kVA Executive Home Package', href: '/power/products/5kva-executive-home-package' },
          { label: '📊 Calculate Monthly Fuel Bill Savings', href: '/solutions/power-solar#savings-calculator' },
        ];
      }
    }

    // ─── C. GENERAL / ALL SERVICES INTELLIGENCE ───
    else {
      responseText =
        `👋 **Welcome to 3RD Energy Services Ltd AI Concierge!**\n\n` +
        `I am your 24/7 intelligent assistant for both core operating divisions:\n\n` +
        `1. ⛽ **Petroleum Division**: Bulk AGO Diesel, PMS Petrol, DPK, ATK, bridging logistics (33,000L–60,000L), and terminal tank leasing.\n` +
        `2. ☀️ **Solar & Clean Power Division**: Fast-charge 65W/100W laptop power banks, 3.5kVA–10kVA solar hybrid systems, 6,000-cycle LiFePO4 storage, and certified rooftop installation.\n\n` +
        `How may I assist your business or household today?`;

      suggestedActions = [
        { label: '⛽ Get Bulk Diesel Quote (33,000L)', actionType: 'open_rfq_modal', payload: { division: 'petroleum', product: 'Automotive Gas Oil (AGO Diesel)' } },
        { label: '☀️ Size Solar for My Home (AI Planner)', href: '/power/planner' },
        { label: '🔋 Browse Portable Power Banks & Generators', href: '/power/products?category=power-stations' },
        { label: '💬 Chat with Engineering Trading Desk on WhatsApp', href: getWhatsAppUrl('Hello 3RD Energy Services Ltd, I need assistance with energy solutions.') },
      ];
    }

    return NextResponse.json({
      success: true,
      division,
      response: responseText,
      suggestedActions,
      richCard,
    });
  } catch (error) {
    console.error('[Concierge Unified API] Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred in the AI Concierge.' },
      { status: 500 }
    );
  }
}
