import { NextRequest, NextResponse } from 'next/server';
import { powerProducts, powerPackages } from '@/lib/data/power-products';

interface ConciergeQuery {
  message: string;
  history?: { sender: 'user' | 'assistant'; content: string }[];
  context?: {
    currentProductId?: string;
    propertyType?: string;
    budget?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: ConciergeQuery = await request.json();
    const query = (body.message || '').trim().toLowerCase();

    if (!query) {
      return NextResponse.json(
        { error: 'Please enter a question for the Power Concierge.' },
        { status: 400 }
      );
    }

    let responseText = '';
    let suggestedActions: { label: string; href?: string; actionType?: string }[] = [];

    // Rule-bounded Knowledge Intelligence Engine
    if (
      query.includes('battery') &&
      (query.includes('inverter') || query.includes('work with') || query.includes('compatible'))
    ) {
      responseText =
        '**Battery & Inverter Compatibility Guide:**\n\n' +
        '• **3.5kVA / 24V Inverter**: Requires a **24V battery bank**. You can pair it with 2x 200Ah 12V Gel Batteries in series, or a 24V Lithium module.\n\n' +
        '• **5kVA / 48V Inverter**: Requires a **48V / 51.2V battery bank**. We recommend the **3rd Energy 5.12kWh Wall-Mount LiFePO4** or the **10.24kWh Commercial Rack Battery** via CAN/RS485 direct BMS communication.\n\n' +
        '• **10kVA 3-Phase Inverter**: Requires a 48V high-current busbar bank. We recommend dual **10.24kWh LiFePO4 Rack packs (20.48kWh total)** for continuous heavy commercial cycling.';
      suggestedActions = [
        { label: 'View 5.12kWh LiFePO4 Battery', href: '/power/products/5.12kwh-lifepo4-wall-mount-battery' },
        { label: 'View 5kVA Hybrid Inverter', href: '/power/products/5kva-48v-smart-hybrid-inverter' },
        { label: 'Speak with an Engineer', href: '/contact' },
      ];
    } else if (
      query.includes('lithium') ||
      query.includes('gel') ||
      query.includes('lead acid') ||
      query.includes('chemistry') ||
      query.includes('lifepo4')
    ) {
      responseText =
        '**Lithium (LiFePO4) vs. Deep Cycle Gel Batteries:**\n\n' +
        '• **Lifespan**: Lithium LiFePO4 delivers **6,000+ cycles** (12–15 years of daily use) vs. **800–1,500 cycles** (2–3 years) for Gel batteries.\n\n' +
        '• **Usable Energy (DOD)**: You can safely discharge Lithium to **80%–90%** of its rating daily without damage. Gel batteries should only be discharged to **50%** to avoid rapid degradation.\n\n' +
        '• **Charge Speed & Weight**: Lithium charges 3x faster (2–3 hours vs 8–10 hours) and weighs 70% less with zero toxic fumes.';
      suggestedActions = [
        { label: 'Read Battery Guide', href: '/power/learn' },
        { label: 'Browse Lithium Batteries', href: '/power/products' },
      ];
    } else if (
      query.includes('ac') ||
      query.includes('air conditioner') ||
      query.includes('freezer') ||
      query.includes('pump')
    ) {
      responseText =
        '**Powering Heavy Appliances (ACs, Pumps & Freezers):**\n\n' +
        '• To power a **1.0HP – 1.5HP Inverter Air Conditioner**, you need a minimum of a **5kVA / 48V Hybrid Inverter** and a **5.12kWh to 10.24kWh Lithium Battery**.\n\n' +
        '• Water pumps (0.5HP–1HP) experience an inductive motor startup surge of 3x to 4x their rated wattage. The 5kVA and 10kVA inverters handle these surges without tripping.';
      suggestedActions = [
        { label: 'Run AI Power Planner', href: '/power/planner' },
        { label: 'View Executive 5kVA Solar Package', href: '/power/products' },
      ];
    } else if (
      query.includes('solar panel') ||
      query.includes('how many panel') ||
      query.includes('sun') ||
      query.includes('pv')
    ) {
      responseText =
        '**Solar Panel Array Sizing:**\n\n' +
        '• In tropical West Africa, each **550W Tier-1 Monocrystalline Panel** generates approximately **2.2 to 2.8 kWh** of clean electricity per day.\n\n' +
        '• A typical residential setup uses **6 to 8 panels (3.3kWp – 4.4kWp)** to fully recharge a 5.12kWh–10kWh battery bank while simultaneously powering daytime household loads.';
      suggestedActions = [
        { label: 'Open Power Calculator', href: '/power/calculator' },
        { label: 'View 550W Solar Panel', href: '/power/products/550w-tier1-monocrystalline-perc-panel' },
      ];
    } else if (
      query.includes('generator') ||
      query.includes('fuel') ||
      query.includes('save') ||
      query.includes('cost')
    ) {
      responseText =
        '**Generator Replacement & Cost Savings:**\n\n' +
        '• Operating a 10kVA diesel generator for 8 hours daily costs millions annually in fuel, oil, and servicing.\n\n' +
        '• A **3rd Energy 5kVA / 10.24kWh Solar Hybrid System** typically pays for itself within **18 to 24 months** in fuel savings alone, while providing silent 24/7 power with zero generator noise or emissions.';
      suggestedActions = [
        { label: 'Launch Savings Simulator', href: '/power/savings' },
        { label: 'Design Custom System', href: '/power/builder' },
      ];
    } else if (query.includes('package') || query.includes('system') || query.includes('recommend')) {
      const pkg = powerPackages[1];
      responseText =
        `**Recommended Turnkey System:**\n\n` +
        `Our most popular solution is the **${pkg.name}**.\n\n` +
        `• **Rating**: ${pkg.ratingKva}kVA Inverter + ${pkg.batteryKwh}kWh Lithium LiFePO4 Storage + ${pkg.solarKwp}kWp Solar Panels\n` +
        `• **Ideal For**: ${pkg.idealFor}\n` +
        `• **Includes**: Turnkey nationwide installation, surge protection, and 5-year warranty.`;
      suggestedActions = [
        { label: 'Customize in System Builder', href: '/power/builder' },
        { label: 'Request Installation', href: '/power/installation' },
      ];
    } else {
      responseText =
        'I am the 3rd Energy **AI Power Concierge**. I can answer equipment compatibility, battery sizing, inverter specifications, and solar requirements.\n\n' +
        'For specialized commercial engineering audits or bespoke single/three-phase facility reviews, our technical engineering team is standing by.';
      suggestedActions = [
        { label: 'Launch AI Power Planner', href: '/power/planner' },
        { label: 'Speak to a Technical Specialist', href: '/contact' },
        { label: 'Browse Power Catalogue', href: '/power/products' },
      ];
    }

    return NextResponse.json({
      success: true,
      response: {
        text: responseText,
        suggestedActions,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error in concierge response:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please speak directly with a technical specialist.' },
      { status: 500 }
    );
  }
}
