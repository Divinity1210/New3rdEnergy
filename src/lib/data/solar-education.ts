export interface SolarGuide {
  id: string;
  slug: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  icon: string;
  content: string;
  keyTakeaways: string[];
}

export const solarGuides: SolarGuide[] = [
  {
    id: 'inverter-vs-generator',
    slug: 'inverter-vs-generator-comparison',
    title: 'Inverter vs. Diesel Generator: The True Total Cost of Ownership',
    category: 'Economics & Sizing',
    readTime: '6 min read',
    summary: 'A mathematical comparison of operating expenditures, fuel logistics, maintenance intervals, and noise pollution between traditional generators and modern solar-hybrid systems.',
    icon: 'zap',
    content: `
### The Hidden Expense of Generator Power
While a traditional diesel or petrol generator carries a lower initial purchase price, the operational expenditure (fuel, servicing, engine rebuilds, oil replacements) quickly overtakes the upfront cost within 6 to 14 months of daily operation.

### Key Comparative Metrics
1. **Fuel Costs**: At prevailing diesel and petrol tariffs, running a 10kVA generator for 8 hours daily costs millions annually in pure fuel burn. A solar-hybrid system produces clean energy with zero marginal fuel cost.
2. **Maintenance Frequency**: Internal combustion engines require oil changes every 200–250 hours (roughly every 3–4 weeks for heavy users) and top-end overhauls every 2,500 hours. Solid-state inverters and Lithium batteries have zero moving parts and require only periodic terminal inspections.
3. **Noise & Fumes**: Solar-battery systems are 100% silent and emit zero toxic carbon monoxide or particulate matter into residential or office air.
4. **Instantaneous Switching**: Generators require manual cranking or ATS warm-up delays (15–60 seconds). A hybrid inverter switches in under 10 milliseconds, preventing computers and routers from rebooting.
    `.trim(),
    keyTakeaways: [
      'Solar-hybrid systems typically break even against generator fuel costs within 18–24 months.',
      'Hybrid inverters eliminate 100% of power-cut flicker and voltage surges.',
      'A combined solar + generator configuration allows the generator to run only during peak battery recharging windows at optimal 80% engine load.',
    ],
  },
  {
    id: 'how-batteries-work',
    slug: 'lithium-lifepo4-vs-gel-batteries',
    title: 'How Batteries Work: Lithium LiFePO4 vs. Deep-Cycle Gel & Lead-Acid',
    category: 'Battery Technology',
    readTime: '7 min read',
    summary: 'Understanding the chemistry, depth of discharge (DOD), cycle life, and thermal characteristics of modern energy storage systems.',
    icon: 'warehouse',
    content: `
### Chemistry Comparison: LiFePO4 vs VRLA Gel
Energy storage technology has undergone a massive leap. Understanding battery chemistry prevents costly premature battery bank failures.

### 1. Depth of Discharge (DOD)
* **Lithium Iron Phosphate (LiFePO4)**: Can be safely discharged to 80%–90% of its rated capacity daily without shortening its lifespan. A 5.12kWh battery delivers 4.6kWh of usable energy.
* **Lead-Acid / Gel Batteries**: Discharging beyond 50% DOD drastically shortens cycle life. A 200Ah (2.4kWh) gel battery only yields 1.2kWh of safe usable energy per cycle.

### 2. Lifespan and Cycle Count
* **LiFePO4**: Typically rated for 6,000+ cycles at 80% DOD. In daily cycling, this equates to 12 to 15+ years of reliable service.
* **Tubular / Gel**: Rated for 800 to 1,500 cycles. With daily deep cycling, replacements are usually required every 18 to 36 months.

### 3. Charging Speed & Efficiency
Lithium batteries accept high charge currents (0.5C to 1C), charging from 0% to 100% in 2 to 3 hours with 98% round-trip efficiency. Gel batteries take 8 to 10 hours with 85% efficiency due to high internal resistance and absorption stages.
    `.trim(),
    keyTakeaways: [
      'LiFePO4 provides 3x to 5x longer life than Gel batteries, delivering lower lifetime cost per kilowatt-hour stored.',
      'Lithium batteries require zero water topping, emit no explosive hydrogen gas, and include digital BMS protection.',
      'Always match inverter charging voltages precisely to the battery manufacturer specifications.',
    ],
  },
  {
    id: 'solar-sizing-demystified',
    slug: 'how-solar-sizing-works-guide',
    title: 'Solar Sizing Demystified: How to Calculate Inverter, Battery & PV Array',
    category: 'Engineering & Sizing',
    readTime: '8 min read',
    summary: 'A step-by-step engineering walkthrough on sizing continuous loads, surge allowances, battery autonomy, and solar panel kilowatt-peak generation.',
    icon: 'sun',
    content: `
### The Three Pillars of Power Sizing

### Step 1: Sizing the Inverter (Continuous & Surge Watts)
List all appliances that may run concurrently. Sum their continuous running wattage (e.g., 2,500W). Add a 25% safety buffer for expansion (3,125W). Factor in inductive motor surge multipliers (compressors, water pumps have 3x–5x inrush current for 2 seconds). Choose an inverter with continuous rating ≥ 3.5kVA or 5kVA.

### Step 2: Sizing Battery Capacity (Kilowatt-Hours)
Multiply each appliance's running wattage by its daily operational hours to determine total daily energy in watt-hours (Wh). For example, 1,000W running for 8 hours = 8,000Wh (8kWh). Divide by the battery depth-of-discharge (e.g., 85% for Lithium) = ~9.4kWh required battery capacity.

### Step 3: Sizing the Solar Panel Array (kWp)
In West Africa, average peak sun hours range between 4.5 and 5.5 hours per day. To produce 10kWh of daily energy, divide 10kWh by 4.5 hours = 2.2kWp minimum solar array. Factoring 20% system losses (dust, temperature coefficient, cable resistance), install approx. 2.8kWp to 3.3kWp (6x 550W panels).
    `.trim(),
    keyTakeaways: [
      'Inverter rating (kVA) dictates how much power you can draw at any single instant.',
      'Battery size (kWh) dictates how long you can sustain that power in the dark.',
      'Solar array rating (kWp) dictates how fast you can replenish your batteries and offset daytime grid power.',
    ],
  },
  {
    id: 'backup-vs-offgrid',
    slug: 'backup-vs-offgrid-solar-systems',
    title: 'Backup Systems vs. True Off-Grid: Choosing the Right Architecture',
    category: 'System Architecture',
    readTime: '5 min read',
    summary: 'Differences in design, battery autonomy buffers, and capital requirements between grid-tied backup setups and 100% autonomous off-grid installations.',
    icon: 'target',
    content: `
### Understanding the Operational Distinction

### 1. Hybrid Backup Systems (Grid / Generator Connected)
Designed for properties that have access to public utility grid power or a backup generator. The battery bank is sized for 6 to 14 hours of autonomy during outages. Solar energy offsets expensive grid bills during daylight hours, while grid/generator serves as an emergency fallback when prolonged rain occurs. This is the most cost-effective architecture for 90% of urban enterprises.

### 2. True Off-Grid Systems (Zero External Utility)
Required for remote farms, telecommunication masts, island resorts, and rural industrial depots where no public grid exists. Off-grid systems require a minimum of 2 to 3 days of autonomy (cloudy day reserve) and larger solar PV arrays paired with an automatic generator backup to guarantee 99.9% uptime 365 days a year.
    `.trim(),
    keyTakeaways: [
      'Hybrid backup provides the highest return on investment in urban and suburban locations.',
      'Off-grid systems require generous battery sizing to survive multi-day rainfall without blackouts.',
      'Smart generator auto-start integration gives off-grid systems 100% reliability with minimal fuel burn.',
    ],
  },
  {
    id: 'battery-lifespan-maintenance',
    slug: 'battery-lifespan-and-maintenance-tips',
    title: 'Maximizing Battery Lifespan: Thermal Management & Operating Best Practices',
    category: 'Maintenance & Care',
    readTime: '6 min read',
    summary: 'How ambient room temperature, charge cutoff voltages, and C-rates influence the lifespan of your lithium and gel battery banks.',
    icon: 'settings',
    content: `
### Key Factors Influencing Battery Degradation

1. **Ambient Operating Temperature**: For every 10°C rise above 25°C, lead-acid battery life is cut in half. While Lithium LiFePO4 tolerates heat much better, maintaining an insulated, ventilated battery room at 20°C–25°C ensures maximum 15-year service life.
2. **Proper BMS Protocol Matching**: Never run Lithium batteries on generic "lead-acid" voltage profiles. Ensure closed-loop communication (CAN / RS485) between the inverter and the battery BMS so the inverter receives precise per-cell charge limits.
3. **Avoid Extended 0% State of Charge**: Never leave discharged batteries sitting at 0% for days. Always configure low-voltage disconnect (LVD) thresholds so the system shuts down safely before reaching destructive deep discharge levels.
    `.trim(),
    keyTakeaways: [
      'Keep battery banks in well-ventilated, shaded rooms away from direct solar heat.',
      'Ensure inverters are paired via digital BMS communication for real-time voltage balancing.',
      'Schedule bi-annual terminal torque checks and dust cleaning on all electrical cabinets.',
    ],
  },
  {
    id: 'top-installation-mistakes',
    slug: 'common-solar-installation-mistakes-to-avoid',
    title: 'Top 5 Solar Installation Mistakes (And How to Avoid Them)',
    category: 'Safety & Quality',
    readTime: '7 min read',
    summary: 'Undersized DC cables, missing lightning surge protection, incorrect roof azimuth orientation, and non-certified installers.',
    icon: 'shield',
    content: `
### Critical Pitfalls in Solar Deployments

### 1. Undersized DC Wiring
Solar DC cables carry high current at low or medium voltages. Using standard AC electrical wire instead of certified, double-insulated, UV-resistant solar PV DC cable causes massive voltage drops, overheating, and serious fire hazards.

### 2. Omission of DC Surge Protection (SPDs) and Earthing
Direct and indirect lightning strikes induce severe transient voltages across roof solar arrays. Certified installations must include Class II DC surge arrestors and a dedicated copper earth rod with <5 Ohms ground resistance.

### 3. Sub-Optimal Roof Tilt and Orientation
In Nigeria and West Africa (Northern Hemisphere close to equator), solar panels should face due South at a 10°–15° tilt angle. Installing panels flat causes dust accumulation that degrades power yield by 20%–35%.

### 4. Overloading Inverter Neutral Line
In mixed installations, sharing neutral lines across inverter and non-inverter circuits causes backfeed currents that destroy inverter power boards.

### 5. Lack of Quality Verification & Testing
Always demand commissioning test sheets showing Voc (Open Circuit Voltage), Isc (Short Circuit Current), and insulation resistance before energizing your system.
    `.trim(),
    keyTakeaways: [
      'Always use certified solar DC cabling, MC4 connectors, and dedicated DC circuit breakers.',
      'Never skip surge protection devices (SPDs) and earthing rods.',
      'Choose certified engineering contractors who provide formal commissioning reports and post-installation warranties.',
    ],
  },
];

export const solarFaqs = [
  {
    q: 'Can a solar system power my air conditioner and deep freezer?',
    a: 'Yes. A properly sized 5kVA or 10kVA hybrid system with adequate Lithium battery storage (10kWh+) and sufficient solar PV panels (4kWp+) easily powers modern inverter air conditioners, deep freezers, and refrigerators concurrently.',
  },
  {
    q: 'What happens when it rains for several days in a row?',
    a: 'Solar panels still generate 15%–30% of their rated output from diffuse ambient daylight during cloudy or rainy weather. When solar output is insufficient, your hybrid inverter automatically pulls top-up power from the utility grid or commands a backup generator to run for a short charging window.',
  },
  {
    q: 'How long do Lithium LiFePO4 batteries actually last?',
    a: 'High-grade LiFePO4 batteries are rated for 6,000 cycles at 80% depth of discharge. If cycled once daily, they deliver 12 to 15+ years of reliable service with minimal capacity degradation.',
  },
  {
    q: 'Can I start with an inverter and battery now and add solar panels later?',
    a: 'Yes. All 3rd Energy hybrid inverters are designed as modular platforms. You can install an inverter and battery bank today for instant emergency backup, and add rooftop solar panel arrays whenever you are ready to produce your own energy.',
  },
  {
    q: 'Does 3rd Energy provide certified installation services?',
    a: 'Yes. We offer nationwide turnkey installation delivered by certified electrical and solar power engineers. Every turnkey installation includes distribution board rewiring, surge protection, earthing, commissioning, and full post-installation support.',
  },
];
