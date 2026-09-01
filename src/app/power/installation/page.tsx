'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { PropertyType } from '@/lib/types';
import { getWhatsAppUrl } from '@/lib/utils';

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
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen pt-32 pb-24 lg:pt-40">
      <div className="container-wide max-w-4xl">
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-sm">
            <Icon name="tool" size={14} className="text-emerald-600" />
            3RD ENERGY SERVICES LTD · CERTIFIED ENGINEERING
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-slate-950 tracking-tight">
            Book Certified <span className="text-emerald-700">Solar Installation.</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Book our certified engineering team for on-site load audits, DB board integration, DC surge protection, and turnkey commissioning.
          </p>
        </div>

        {/* Success Confirmation State */}
        {successReference ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-emerald-200 text-center space-y-6 animate-fade-in shadow-xl">
            <div className="w-20 h-20 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
              <Icon name="check" size={40} />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-heading font-extrabold text-slate-950">Site Audit Request Booked!</h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
                Thank you, <strong>{formData.firstName}</strong>. Your installation site audit reference is:
              </p>
              <div className="inline-block py-2.5 px-6 rounded-2xl bg-slate-900 text-emerald-400 font-mono font-bold text-lg tracking-wider shadow-sm">
                {successReference}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 max-w-md mx-auto text-xs text-slate-700 space-y-1.5 text-left">
              <p><strong>Premises Location:</strong> {formData.address}, {formData.city}, {formData.state}</p>
              <p><strong>System Configuration:</strong> {formData.packageOrProducts}</p>
              <p><strong>Next Step:</strong> Our regional engineering supervisor will call you within 24 hours to confirm date and rooftop access.</p>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <Link
                href="/solutions/power-solar"
                className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-md shadow-emerald-600/20"
              >
                Return to Solar Hub
              </Link>
            </div>
          </div>
        ) : (
          /* Form Container */
          <form
            onSubmit={handleSubmit}
            className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-8"
          >
            {error && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
                <span>{error}</span>
                <button type="button" onClick={() => setError(null)} className="text-red-400 p-1">
                  <Icon name="x" size={14} />
                </button>
              </div>
            )}

            {/* Section 1: Customer Contact Info */}
            <div className="space-y-4">
              <h2 className="font-heading font-bold text-base text-slate-950 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Icon name="user" size={18} className="text-emerald-600" />
                1. Contact & Organisation
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
                    placeholder="e.g. Samuel"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
                    placeholder="e.g. Adeleke"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
                    placeholder="samuel@company.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">Phone Number (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
                    placeholder="+234..."
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Organization / Facility Name (Optional)</label>
                <input
                  type="text"
                  value={formData.organisationName}
                  onChange={(e) => setFormData({ ...formData, organisationName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
                  placeholder="e.g. Acme Microfinance Bank"
                />
              </div>
            </div>

            {/* Section 2: Property & Location */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h2 className="font-heading font-bold text-base text-slate-950 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Icon name="truck" size={18} className="text-emerald-600" />
                2. Site & Installation Address
              </h2>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Street Address / Estate *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
                  placeholder="e.g. 14 Admiralty Way, Lekki Phase 1"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
                    placeholder="e.g. Lekki"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">State *</label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none"
                  >
                    {['Lagos', 'Abuja (FCT)', 'Rivers (Port Harcourt)', 'Ogun', 'Oyo (Ibadan)', 'Delta', 'Kano', 'Enugu', 'Edo', 'Other State'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <p className="text-[11px] text-slate-500">
                🔒 Direct submission to 3RD Energy Services Ltd engineering queue.
              </p>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Icon name="loader" size={16} className="animate-spin" />
                    Submitting Request...
                  </>
                ) : (
                  <>
                    <Icon name="check" size={16} />
                    Book Certified Installation Audit
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
