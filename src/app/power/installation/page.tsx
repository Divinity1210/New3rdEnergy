'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { PropertyType } from '@/lib/types';

export default function InstallationEnquiryPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organisationName: '',
    propertyType: 'home' as PropertyType,
    address: '',
    city: '',
    state: 'Lagos',
    systemType: 'new_purchase',
    packageOrProducts: 'Executive 5kVA Solar Hybrid System',
    electricalPhase: 'single-phase',
    hasGeneratorTransferSwitch: true,
    roofType: 'aluminum-tin',
    preferredDate: '',
    siteNotes: '',
    photoCount: 0,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successReference, setSuccessReference] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.phone || !formData.address || !formData.city) {
      setError('Please fill in all required contact and location fields.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/installations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
          },
          organisation: formData.organisationName ? { name: formData.organisationName, industry: 'Commercial Installation' } : undefined,
          propertyType: formData.propertyType,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          systemType: formData.systemType,
          packageOrProducts: formData.packageOrProducts,
          electricalPhase: formData.electricalPhase,
          hasGeneratorTransferSwitch: formData.hasGeneratorTransferSwitch,
          roofType: formData.roofType,
          preferredDate: formData.preferredDate,
          siteNotes: formData.siteNotes,
          photoCount: formData.photoCount,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit installation request.');
      }

      setSuccessReference(data.installation.referenceNumber);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred while submitting.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-neutral-950 text-white min-h-screen pt-32 pb-24 lg:pt-40">
      <div className="container-wide max-w-4xl">
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-solar-500/10 border border-solar-500/20 text-solar-400 text-xs font-semibold">
            <Icon name="hard-hat" size={14} />
            Nationwide Turnkey Installation
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white">
            Request Certified <span className="text-solar-400">Solar Installation.</span>
          </h1>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto">
            Book our certified electrical and solar engineering team for comprehensive site audits, distribution board integration, lightning surge protection, and commissioning.
          </p>
        </div>

        {/* Success Confirmation State */}
        {successReference ? (
          <div className="p-8 sm:p-12 rounded-lg bg-neutral-900 border border-green-500/40 text-center space-y-6 animate-fade-in shadow-xl">
            <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 flex items-center justify-center mx-auto">
              <Icon name="check-circle" size={40} />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Installation Request Booked!</h2>
              <p className="text-sm text-neutral-300 max-w-lg mx-auto leading-relaxed">
                Thank you, <strong>{formData.firstName}</strong>. Your installation site audit reference is:
              </p>
              <div className="inline-block py-2 px-6 rounded-lg bg-black/60 border border-solar-500/30 text-solar-400 font-mono font-bold text-lg tracking-wider">
                {successReference}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white/[0.03] border border-white/10 max-w-md mx-auto text-xs text-neutral-300 space-y-1 text-left">
              <p><strong>Site Location:</strong> {formData.address}, {formData.city}, {formData.state}</p>
              <p><strong>System:</strong> {formData.packageOrProducts}</p>
              <p><strong>Next Step:</strong> Our regional engineering supervisor will call you within 24 hours to confirm date and roof access.</p>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <Link
                href="/solutions/power-solar"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-primary-600 to-amber-500 text-white font-bold text-xs"
              >
                Return to Power Platform
              </Link>
            </div>
          </div>
        ) : (
          /* Form Container */
          <form
            onSubmit={handleSubmit}
            className="p-8 sm:p-12 rounded-lg bg-neutral-900/90 border border-white/10 backdrop-blur-md shadow-xl space-y-8"
          >
            {error && (
              <div className="p-4 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center justify-between">
                <span>{error}</span>
                <button type="button" onClick={() => setError(null)} className="text-red-400 p-1">
                  <Icon name="x" size={14} />
                </button>
              </div>
            )}

            {/* Section 1: Customer Contact Info */}
            <div className="space-y-4">
              <h2 className="font-heading font-bold text-lg text-white border-b border-white/10 pb-3 flex items-center gap-2">
                <Icon name="target" size={18} className="text-solar-400" />
                1. Contact & Organisation
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1.5">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                    placeholder="e.g. Samuel"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1.5">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                    placeholder="e.g. Adeleke"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                    placeholder="samuel@company.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1.5">Phone Number (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                    placeholder="+234 800 000 0000"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1.5">Company / Facility Name (Optional)</label>
                <input
                  type="text"
                  value={formData.organisationName}
                  onChange={(e) => setFormData({ ...formData, organisationName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                  placeholder="e.g. Apex Industrial Logistics Ltd."
                />
              </div>
            </div>

            {/* Section 2: Site Location */}
            <div className="space-y-4">
              <h2 className="font-heading font-bold text-lg text-white border-b border-white/10 pb-3 flex items-center gap-2">
                <Icon name="warehouse" size={18} className="text-solar-400" />
                2. Site Location & Property
              </h2>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1.5">Property Type</label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as PropertyType })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                  >
                    <option value="home">Residential Home / Villa</option>
                    <option value="office">Corporate Office</option>
                    <option value="shop">Retail Store / Supermarket</option>
                    <option value="facility">Industrial Plant / Factory</option>
                    <option value="other">Other Commercial Facility</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-neutral-300 block mb-1.5">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                    placeholder="e.g. Plot 14, Victoria Island Extension"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1.5">City / Town *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                    placeholder="e.g. Lekki / Ikeja"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1.5">State *</label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Lagos">Lagos</option>
                    <option value="Abuja (FCT)">Abuja (FCT)</option>
                    <option value="Rivers (Port Harcourt)">Rivers (Port Harcourt)</option>
                    <option value="Ogun">Ogun</option>
                    <option value="Oyo (Ibadan)">Oyo (Ibadan)</option>
                    <option value="Delta">Delta</option>
                    <option value="Kano">Kano</option>
                    <option value="Kaduna">Kaduna</option>
                    <option value="Edo">Edo</option>
                    <option value="Other">Other State</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Electrical & Roof Infrastructure */}
            <div className="space-y-4">
              <h2 className="font-heading font-bold text-lg text-white border-b border-white/10 pb-3 flex items-center gap-2">
                <Icon name="settings" size={18} className="text-solar-400" />
                3. Electrical & Roof Infrastructure
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1.5">Electrical Phase</label>
                  <select
                    value={formData.electricalPhase}
                    onChange={(e) => setFormData({ ...formData, electricalPhase: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                  >
                    <option value="single-phase">Single Phase (230V)</option>
                    <option value="three-phase">Three Phase (400V Industrial)</option>
                    <option value="uncertain">Unsure / Need Engineer to Verify</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1.5">Roof Structure Type</label>
                  <select
                    value={formData.roofType}
                    onChange={(e) => setFormData({ ...formData, roofType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                  >
                    <option value="aluminum-tin">Aluminum / Longspan Corrugated Sheet</option>
                    <option value="concrete-deck">Flat Concrete Slab Deck</option>
                    <option value="clay-tile">Clay / Stone-Coated Roofing Tiles</option>
                    <option value="ground-mount">Ground-Mount Space Available</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1.5">System Scope</label>
                  <select
                    value={formData.systemType}
                    onChange={(e) => setFormData({ ...formData, systemType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                  >
                    <option value="new_purchase">Turnkey 3rd Energy Package Installation</option>
                    <option value="existing_system">Installation of Client-Supplied Equipment</option>
                    <option value="upgrade">System Upgrade & Additional Solar Panels</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1.5">Target System / Package</label>
                  <input
                    type="text"
                    value={formData.packageOrProducts}
                    onChange={(e) => setFormData({ ...formData, packageOrProducts: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                    placeholder="e.g. 5kVA Inverter + 10kWh LiFePO4"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1.5">Preferred Site Audit Date</label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={formData.hasGeneratorTransferSwitch}
                      onChange={(e) => setFormData({ ...formData, hasGeneratorTransferSwitch: e.target.checked })}
                      className="rounded text-amber-500 focus:ring-amber-400 bg-neutral-800 border-white/20"
                    />
                    <span className="text-neutral-300">Property has an existing Generator Transfer Switch / ATS</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1.5">Site Notes & Special Instructions</label>
                <textarea
                  rows={3}
                  value={formData.siteNotes}
                  onChange={(e) => setFormData({ ...formData, siteNotes: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                  placeholder="Describe your distribution board location, roof height, gate access, or specific requirements..."
                />
              </div>
            </div>

            {/* Submit Action Button */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-neutral-400">
                ⚡ Certified engineers · Full insurance · 5-year workmanship guarantee
              </p>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-10 py-4 rounded-md bg-solar-600 text-white font-bold text-xs sm:text-sm hover:opacity-95 transition-opacity shadow-xl shadow-primary-950/50 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Submitting Request...
                  </>
                ) : (
                  <>
                    <Icon name="hard-hat" size={16} />
                    Confirm Site Audit Request
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
