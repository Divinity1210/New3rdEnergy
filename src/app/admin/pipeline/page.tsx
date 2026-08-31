'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LoadingState, EmptyState } from '@/components/admin/AdminComponents';
import { Icon } from '@/components/ui/Icon';
import { formatCurrency, getWhatsAppUrl } from '@/lib/utils';
import { PipelineStage, PIPELINE_STAGES, STAGE_LABELS, STAGE_COLORS } from '@/lib/types';

interface Opportunity {
  id: string;
  referenceNumber: string;
  division: 'petroleum' | 'power' | 'corporate';
  company: string;
  contactName: string;
  email: string;
  phone: string;
  productName: string;
  volumeDisplay: string;
  estimatedValue: number;
  stage: PipelineStage;
  urgency: 'low' | 'medium' | 'high';
  score: {
    total: number;
    tier: 'HOT' | 'WARM' | 'COLD';
  };
  state: string;
  createdAt: string;
  notes: string;
}

interface StageInfo {
  id: PipelineStage;
  label: string;
  color: string;
  count: number;
  avgHoursInStage: number;
}

export default function AdminPipelinePage() {
  const [stages, setStages] = useState<StageInfo[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [divisionFilter, setDivisionFilter] = useState<'all' | 'petroleum' | 'power'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Manual Deal Creation Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creatingDeal, setCreatingDeal] = useState(false);
  const [formData, setFormData] = useState({
    division: 'petroleum' as 'petroleum' | 'power',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    state: 'Lagos',
    productName: 'Automotive Gas Oil (AGO Diesel)',
    quantityValue: 33000,
    quantityUnit: 'Litres',
    estimatedValue: 34650000,
    stage: 'NEW_LEAD' as PipelineStage,
    urgency: 'high' as 'low' | 'medium' | 'high',
    notes: '',
  });

  useEffect(() => {
    loadPipeline();
  }, [divisionFilter]);

  async function loadPipeline() {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/pipeline?division=${divisionFilter}`);
      if (res.ok) {
        const data = await res.json();
        setStages(data.stages || []);
        setOpportunities(data.opportunities || []);
      }
    } catch (err) {
      console.error('Pipeline load error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleMoveStage(oppId: string, newStage: PipelineStage) {
    setUpdatingId(oppId);
    try {
      const res = await fetch('/api/admin/pipeline', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunityId: oppId, newStage }),
      });

      if (res.ok) {
        setOpportunities((prev) =>
          prev.map((o) => (o.id === oppId ? { ...o, stage: newStage } : o))
        );
        loadPipeline();
      }
    } catch (err) {
      console.error('Error updating stage:', err);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleCreateDeal(e: React.FormEvent) {
    e.preventDefault();
    setCreatingDeal(true);

    try {
      const payload = {
        contact: {
          firstName: formData.firstName || 'Client',
          lastName: formData.lastName || '',
          email: formData.email,
          phone: formData.phone,
        },
        organisation: {
          name: formData.company || `${formData.firstName}'s Organisation`,
          industry: formData.division === 'petroleum' ? 'Manufacturing / Haulage' : 'Commercial Facility',
        },
        products: [
          {
            productId: formData.productName.toLowerCase().replace(/\s+/g, '-'),
            productName: formData.productName,
            category: formData.division === 'petroleum' ? 'fuel_bulk' : 'solar_inverter',
          },
        ],
        quantity: {
          value: Number(formData.quantityValue),
          unit: formData.quantityUnit,
        },
        location: {
          address: 'Industrial Site / Facility',
          city: formData.state,
          state: formData.state,
          country: 'Nigeria',
          deliveryType: 'delivery',
        },
        urgency: formData.urgency,
        notes: `[Manual Sales Desk Entry] ${formData.notes}`,
        source: `admin_manual_${formData.division}`,
      };

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({
          division: 'petroleum',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: '',
          state: 'Lagos',
          productName: 'Automotive Gas Oil (AGO Diesel)',
          quantityValue: 33000,
          quantityUnit: 'Litres',
          estimatedValue: 34650000,
          stage: 'NEW_LEAD',
          urgency: 'high',
          notes: '',
        });
        loadPipeline();
      } else {
        alert('Failed to save manual deal. Please check fields.');
      }
    } catch (err) {
      console.error('Error creating manual deal:', err);
    } finally {
      setCreatingDeal(false);
    }
  }

  const filteredOpportunities = opportunities.filter((opp) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      opp.company.toLowerCase().includes(q) ||
      opp.contactName.toLowerCase().includes(q) ||
      opp.referenceNumber.toLowerCase().includes(q) ||
      opp.productName.toLowerCase().includes(q) ||
      opp.state.toLowerCase().includes(q)
    );
  });

  const totalDeals = filteredOpportunities.length;
  const totalPipelineValue = filteredOpportunities.reduce((sum, o) => sum + (o.estimatedValue || 0), 0);

  // Group by stage
  const oppsByStage: Record<PipelineStage, Opportunity[]> = {
    NEW_LEAD: [],
    QUALIFIED: [],
    DISCOVERY: [],
    QUOTE_REQUESTED: [],
    QUOTE_SENT: [],
    NEGOTIATION: [],
    WON: [],
    LOST: [],
    CUSTOMER: [],
  };

  filteredOpportunities.forEach((opp) => {
    if (oppsByStage[opp.stage]) {
      oppsByStage[opp.stage].push(opp);
    } else {
      oppsByStage.NEW_LEAD.push(opp);
    }
  });

  // Visible Kanban stages
  const visibleStages: PipelineStage[] = [
    'NEW_LEAD',
    'QUALIFIED',
    'QUOTE_REQUESTED',
    'QUOTE_SENT',
    'NEGOTIATION',
    'WON',
    'LOST',
  ];

  if (loading && opportunities.length === 0) {
    return <LoadingState message="Loading sales pipeline & deals..." />;
  }

  return (
    <div className="admin-page">
      {/* Top Header & Metrics */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Commercial Sales Pipeline</h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Sync & Alert Enabled
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Managing <strong className="text-white">{totalDeals} active opportunities</strong> worth{' '}
            <strong className="text-emerald-400">{formatCurrency(totalPipelineValue)}</strong>. All entries notify <span className="text-neutral-300 underline">info@3rdenergyservices.com</span>.
          </p>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={loadPipeline}
            className="px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-neutral-700 cursor-pointer"
          >
            <Icon name="activity" size={13} />
            Refresh
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-red-600/20 cursor-pointer"
          >
            <Icon name="plus" size={13} />
            + Add Manual Deal / Phone Order
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#121212] border border-neutral-800 rounded-xl p-3 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Division Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full md:w-auto">
          {[
            { id: 'all', label: 'All Divisions', icon: 'layers' },
            { id: 'petroleum', label: '🛢️ 3RD Petroleum', icon: 'fuel' },
            { id: 'power', label: '☀️ 3RD Power & Solar', icon: 'sun' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDivisionFilter(tab.id as 'all' | 'petroleum' | 'power')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                divisionFilter === tab.id
                  ? 'bg-neutral-700 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search company, contact, ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-500/50"
          />
          <div className="absolute left-2.5 top-2 text-neutral-500">
            <Icon name="search" size={13} />
          </div>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="overflow-x-auto pb-6">
        <div className="flex gap-4 min-w-[1280px]">
          {visibleStages.map((stageKey) => {
            const stageDeals = oppsByStage[stageKey] || [];
            const stageColor = STAGE_COLORS[stageKey] || '#6b7280';
            const stageTotalValue = stageDeals.reduce((sum, o) => sum + (o.estimatedValue || 0), 0);

            return (
              <div
                key={stageKey}
                className="w-80 shrink-0 bg-[#0f0f0f] border border-neutral-800/80 rounded-xl flex flex-col max-h-[calc(100vh-250px)]"
              >
                {/* Column Header */}
                <div
                  className="p-3.5 border-b border-neutral-800 flex items-center justify-between"
                  style={{ borderTop: `3px solid ${stageColor}` }}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{STAGE_LABELS[stageKey]}</span>
                      <span
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold"
                        style={{ backgroundColor: `${stageColor}25`, color: stageColor }}
                      >
                        {stageDeals.length}
                      </span>
                    </div>
                    {stageTotalValue > 0 && (
                      <span className="text-[10px] font-mono text-neutral-400 block mt-0.5">
                        {formatCurrency(stageTotalValue)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Deal Cards Container */}
                <div className="p-3 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                  {stageDeals.length === 0 ? (
                    <div className="py-8 text-center text-neutral-600 text-xs font-mono">
                      No opportunities
                    </div>
                  ) : (
                    stageDeals.map((opp) => {
                      const isPetroleum = opp.division === 'petroleum';
                      const isUpdating = updatingId === opp.id;

                      return (
                        <div
                          key={opp.id}
                          className={`p-3.5 bg-[#141414] border border-neutral-800/90 rounded-xl hover:border-neutral-700 transition-all duration-200 shadow-sm space-y-3 ${
                            isUpdating ? 'opacity-50 pointer-events-none' : ''
                          }`}
                        >
                          {/* Card Top: Division Badge & Ref */}
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider ${
                                isPetroleum
                                  ? 'bg-red-950/60 text-red-400 border border-red-500/30'
                                  : 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                              }`}
                            >
                              <Icon name={isPetroleum ? 'fuel' : 'sun'} size={10} />
                              {isPetroleum ? 'Petroleum' : 'Power & Solar'}
                            </span>
                            <span className="text-[10px] font-mono text-neutral-500">
                              {opp.referenceNumber}
                            </span>
                          </div>

                          {/* Company & Contact */}
                          <div>
                            <h4 className="text-sm font-bold text-white line-clamp-1">{opp.company}</h4>
                            <p className="text-xs text-neutral-400 mt-0.5 flex items-center gap-1">
                              <span>{opp.contactName}</span>
                              <span className="text-neutral-600">•</span>
                              <span className="text-neutral-500 text-[11px]">{opp.state}</span>
                            </p>
                          </div>

                          {/* Product & Volume Readout */}
                          <div className="bg-black/40 border border-neutral-800/60 p-2.5 rounded-lg text-xs font-mono">
                            <span className="text-neutral-400 block text-[10px] uppercase">Requirement</span>
                            <div className="text-white font-bold truncate">{opp.productName}</div>
                            <div className="text-emerald-400 text-[11px] font-bold mt-0.5">
                              {opp.volumeDisplay}
                            </div>
                          </div>

                          {/* Deal Value & Lead Score */}
                          <div className="flex items-center justify-between pt-1">
                            <div>
                              <span className="text-[10px] text-neutral-500 block uppercase font-mono">Est. Value</span>
                              <span className="text-xs font-mono font-bold text-white">
                                {formatCurrency(opp.estimatedValue)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {opp.urgency === 'high' && (
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-500/30 font-bold">
                                  🚨 Urgent
                                </span>
                              )}
                              <span
                                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                                  opp.score.tier === 'HOT'
                                    ? 'bg-red-500/20 text-red-400'
                                    : opp.score.tier === 'WARM'
                                    ? 'bg-amber-500/20 text-amber-400'
                                    : 'bg-neutral-800 text-neutral-400'
                                }`}
                              >
                                {opp.score.tier} ({opp.score.total})
                              </span>
                            </div>
                          </div>

                          {/* Card Footer: Quick Actions & Stage Mover */}
                          <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1">
                              {opp.phone && (
                                <a
                                  href={`tel:${opp.phone}`}
                                  className="w-7 h-7 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
                                  title={`Call ${opp.phone}`}
                                >
                                  <Icon name="phone" size={12} />
                                </a>
                              )}
                              {opp.phone && (
                                <a
                                  href={getWhatsAppUrl(`Hello ${opp.contactName}, this is 3rd Energy regarding your quote ${opp.referenceNumber} for ${opp.productName}.`)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-7 h-7 rounded bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-400 flex items-center justify-center transition-colors border border-emerald-500/30"
                                  title="WhatsApp"
                                >
                                  <Icon name="whatsapp" size={12} />
                                </a>
                              )}
                              <Link
                                href={`/admin/leads/${opp.id}`}
                                className="w-7 h-7 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
                                title="View Lead Details & AI Assistant"
                              >
                                <Icon name="sparkles" size={12} />
                              </Link>
                            </div>

                            <select
                              value={opp.stage}
                              onChange={(e) => handleMoveStage(opp.id, e.target.value as PipelineStage)}
                              className="px-2 py-1 bg-neutral-900 border border-neutral-700 rounded text-[11px] font-mono text-neutral-300 focus:outline-none focus:border-red-500 cursor-pointer"
                            >
                              {PIPELINE_STAGES.map((s) => (
                                <option key={s} value={s}>
                                  → {STAGE_LABELS[s]}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Opportunity Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#141414] border border-neutral-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Create Manual Opportunity / Phone Order</h3>
                <p className="text-xs text-neutral-400">Triggers real-time email dispatch to info@3rdenergyservices.com</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDeal} className="space-y-4">
              {/* Division Selector */}
              <div>
                <label className="text-xs font-mono text-neutral-400 block mb-1.5">Energy Division</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, division: 'petroleum', productName: 'Automotive Gas Oil (AGO Diesel)', quantityUnit: 'Litres' })}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      formData.division === 'petroleum'
                        ? 'bg-red-950/60 text-red-400 border-red-500/50'
                        : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                    }`}
                  >
                    <Icon name="fuel" size={14} />
                    🛢️ 3RD Petroleum
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, division: 'power', productName: '20kVA Commercial Hybrid Solar Inverter', quantityUnit: 'Units' })}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      formData.division === 'power'
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/50'
                        : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                    }`}
                  >
                    <Icon name="sun" size={14} />
                    ☀️ 3RD Power & Solar
                  </button>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1">Contact Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Babatunde Alabi"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1">Company / Facility *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Industrial Ltd"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="babatunde@company.ng"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+234 803 000 0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Product and Volume */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-mono text-neutral-400 block mb-1">Product Requirement</label>
                  <input
                    type="text"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1">Volume / Qty</label>
                  <input
                    type="number"
                    value={formData.quantityValue}
                    onChange={(e) => setFormData({ ...formData, quantityValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1">Delivery State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1">Urgency</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="high">🚨 Emergency / Urgent</option>
                    <option value="medium">Standard (24-48h)</option>
                    <option value="low">Flexible Planning</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-neutral-400 block mb-1">Operational Notes / Special Specs</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Tanker offload at Generator Farm 2, requires 30m discharge hose and water paste check."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingDeal}
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-lg shadow-red-600/20 cursor-pointer"
                >
                  {creatingDeal ? 'Transmitting...' : '✓ Ingest Deal & Trigger Alerts'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
