import { NextRequest, NextResponse } from 'next/server';
import { defaultAppliances } from '@/lib/data/power-appliances';
import { powerProducts, powerPackages } from '@/lib/data/power-products';
import { PowerSizingInput, PowerSizingEstimate } from '@/lib/types';

/**
 * POST /api/power/planner
 * 
 * Calculates preliminary electrical load, battery storage, and solar requirements
 * based on selected appliances and operating assumptions.
 */

export async function POST(request: NextRequest) {
  try {
    const body: PowerSizingInput = await request.json();

    if (!body.appliances || body.appliances.length === 0) {
      return NextResponse.json(
        { error: 'Please select at least one appliance to calculate your power sizing.' },
        { status: 400 }
      );
    }

    let totalRunningWatts = 0;
    let maxSurgeComponent = 0;
    let dailyWattHours = 0;

    const runtimeMultiplier = Math.max(1, Math.min(24, body.dailyHours || 10));

    body.appliances.forEach((item) => {
      const standardAppliance = defaultAppliances.find((a) => a.id === item.applianceId);
      const watts = item.customWatts || (standardAppliance ? standardAppliance.defaultWatts : 100);
      const surgeMultiplier = standardAppliance ? standardAppliance.surgeMultiplier : 1.5;
      const hours = item.customHours || (standardAppliance ? Math.min(standardAppliance.typicalHours, runtimeMultiplier) : runtimeMultiplier);
      const qty = item.quantity || 1;

      const itemRunning = watts * qty;
      totalRunningWatts += itemRunning;

      const itemSurge = (watts * surgeMultiplier * qty) - itemRunning;
      if (itemSurge > maxSurgeComponent) {
        maxSurgeComponent = itemSurge;
      }

      dailyWattHours += itemRunning * hours;
    });

    // Surge Buffer
    const totalSurgeWatts = totalRunningWatts + maxSurgeComponent;
    const dailyEnergyKwh = Number((dailyWattHours / 1000).toFixed(2));

    // Continuous Inverter Sizing with 25% safety margin
    const requiredInverterWatts = totalRunningWatts * 1.25;
    let recommendedInverterKva = 3.5;
    let recommendedInverterRange = '3.5kVA – 5kVA';

    if (requiredInverterWatts > 7500) {
      recommendedInverterKva = 10.0;
      recommendedInverterRange = '10kVA – 15kVA (Three-Phase)';
    } else if (requiredInverterWatts > 3000) {
      recommendedInverterKva = 5.0;
      recommendedInverterRange = '5kVA – 7.5kVA';
    } else {
      recommendedInverterKva = 3.5;
      recommendedInverterRange = '3.5kVA';
    }

    // Battery Storage Sizing: Required daily autonomy considering 85% DOD for LiFePO4
    const depthOfDischarge = 0.85;
    const batterySafetyMargin = 1.15;
    const estimatedAutonomyKwh = (dailyWattHours / 1000) * batterySafetyMargin / depthOfDischarge;

    let recommendedBatteryKwh = 5.12;
    let recommendedBatteryRange = '5.12kWh (100Ah @ 51.2V)';

    if (estimatedAutonomyKwh > 15) {
      recommendedBatteryKwh = 20.48;
      recommendedBatteryRange = '20.48kWh (400Ah @ 51.2V)';
    } else if (estimatedAutonomyKwh > 7.5) {
      recommendedBatteryKwh = 10.24;
      recommendedBatteryRange = '10.24kWh (200Ah @ 51.2V)';
    } else {
      recommendedBatteryKwh = 5.12;
      recommendedBatteryRange = '5.12kWh (100Ah @ 51.2V)';
    }

    // Solar PV Sizing: Daily energy production factoring 4.5 peak sun hours & 20% system loss
    const peakSunHours = 4.5;
    const systemEfficiency = 0.80;
    const requiredSolarKwp = Number((dailyEnergyKwh / (peakSunHours * systemEfficiency)).toFixed(1));

    let recommendedSolarRange = '2.2kWp – 4.4kWp';
    if (requiredSolarKwp > 6.0) {
      recommendedSolarRange = '7.8kWp – 10.4kWp';
    } else if (requiredSolarKwp > 3.0) {
      recommendedSolarRange = '4.4kWp – 6.6kWp';
    } else {
      recommendedSolarRange = '2.2kWp – 3.3kWp';
    }

    // Match with Actual Catalog Products
    let matchedInverter = powerProducts.find((p) => p.category === 'inverters' && p.specs.continuousPower?.includes('3000W'));
    let matchedBattery = powerProducts.find((p) => p.id === 'bat-5.12kwh-wall');
    let matchedPackage = powerPackages[0];

    if (recommendedInverterKva >= 10.0) {
      matchedInverter = powerProducts.find((p) => p.id === 'inv-10kva-48v-3p');
      matchedBattery = powerProducts.find((p) => p.id === 'bat-10.24kwh-rack');
      matchedPackage = powerPackages.find((pkg) => pkg.tier === 'commercial') || powerPackages[2];
    } else if (recommendedInverterKva >= 5.0) {
      matchedInverter = powerProducts.find((p) => p.id === 'inv-5kva-48v');
      matchedBattery = powerProducts.find((p) => p.id === 'bat-10.24kwh-rack') || powerProducts.find((p) => p.id === 'bat-5.12kwh-wall');
      matchedPackage = powerPackages.find((pkg) => pkg.tier === 'recommended') || powerPackages[1];
    }

    const matchedSolar = powerProducts.find((p) => p.id === 'sp-550w-mono');
    const matchedProtection = powerProducts.find((p) => p.id === 'acc-dc-protection-box');

    const estimate: PowerSizingEstimate = {
      totalRunningWatts: Math.round(totalRunningWatts),
      totalSurgeWatts: Math.round(totalSurgeWatts),
      dailyEnergyKwh,
      recommendedInverterKva,
      recommendedInverterRange,
      recommendedBatteryKwh,
      recommendedBatteryRange,
      recommendedSolarKwp: Math.max(2.2, requiredSolarKwp),
      recommendedSolarRange,
      autonomyHours: runtimeMultiplier,
      assumptions: [
        `Calculated for ${runtimeMultiplier} hours of target daily autonomy.`,
        'Includes 25% continuous safety headroom for inductive motor loads.',
        'Battery storage capacity modeled on 85% safe Depth of Discharge (DOD) LiFePO4 chemistry.',
        'Solar yield modeled on 4.5 average tropical peak sun hours with 80% balance-of-system efficiency.',
      ],
      matchedProducts: {
        inverter: matchedInverter,
        battery: matchedBattery,
        solarPanel: matchedSolar,
        accessories: matchedProtection ? [matchedProtection] : [],
      },
      matchedPackageSlug: matchedPackage?.slug,
      disclaimer:
        'Preliminary planning estimate only. Final system sizing, roof structural analysis, and electrical distribution audits must be confirmed by a qualified 3rd Energy engineer.',
    };

    return NextResponse.json({ success: true, estimate });
  } catch (error) {
    console.error('Error calculating power sizing:', error);
    return NextResponse.json(
      { error: 'An error occurred while calculating your power sizing. Please check your inputs.' },
      { status: 500 }
    );
  }
}
