'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LoadingState, EmptyState } from '@/components/admin/AdminComponents';
import { Icon } from '@/components/ui/Icon';
import { getWhatsAppUrl } from '@/lib/utils';

interface ContactRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  division: 'petroleum' | 'power' | 'corporate';
  state: string;
  totalOrders: number;
  lastActive: string;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [divisionFilter, setDivisionFilter] = useState<'all' | 'petroleum' | 'power'>('all');

  useEffect(() => {
    loadContacts();
  }, []);

  async function loadContacts() {
    try {
      setLoading(true);
      // Pull leads and pipeline opportunities to aggregate contacts
      const res = await fetch('/api/admin/pipeline?division=all');
      if (res.ok) {
        const data = await res.json();
        const opps = data.opportunities || [];

        const mapped: ContactRecord[] = opps.map((o: any) => ({
          id: o.id,
          name: o.contactName,
          email: o.email,
          phone: o.phone,
          company: o.company,
          division: o.division,
          state: o.state,
          totalOrders: o.stage === 'WON' ? 2 : 1,
          lastActive: o.createdAt,
        }));

        setContacts(mapped);
      }
    } catch (err) {
      console.error('Error loading contacts:', err);
    } finally {
      setLoading(false);
    }
  }

  const filteredContacts = contacts.filter((c) => {
    const matchesDiv = divisionFilter === 'all' || c.division === divisionFilter;
    const matchesSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.state.toLowerCase().includes(search.toLowerCase());
    return matchesDiv && matchesSearch;
  });

  if (loading) return <LoadingState message="Loading CRM Contacts Directory..." />;

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">CRM Contacts & Accounts</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Directory of corporate procurement managers, facility engineers, and residential energy clients.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/solutions/petroleum/order"
            target="_blank"
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md shadow-red-600/20"
          >
            + New Bulk Client Order
          </Link>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#121212] border border-neutral-800 rounded-xl p-3 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Division Filter */}
        <div className="flex items-center gap-1.5 w-full md:w-auto">
          {[
            { id: 'all', label: 'All Contacts' },
            { id: 'petroleum', label: '🛢️ Petroleum Clients' },
            { id: 'power', label: '☀️ Solar Clients' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDivisionFilter(tab.id as 'all' | 'petroleum' | 'power')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                divisionFilter === tab.id
                  ? 'bg-neutral-700 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search contact, company, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-500/50"
          />
          <div className="absolute left-2.5 top-2 text-neutral-500">
            <Icon name="search" size={13} />
          </div>
        </div>
      </div>

      {/* Contacts Table */}
      {filteredContacts.length === 0 ? (
        <EmptyState
          icon="👥"
          title="No Contacts Found"
          description="Contacts will be automatically indexed as inquiries and bulk orders are received."
        />
      ) : (
        <div className="bg-[#0f0f0f] border border-neutral-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#141414] border-b border-neutral-800 text-neutral-400 font-mono uppercase text-[11px]">
                <tr>
                  <th className="py-3.5 px-6 font-semibold">Contact & Company</th>
                  <th className="py-3.5 px-6 font-semibold">Division</th>
                  <th className="py-3.5 px-6 font-semibold">Direct Communication</th>
                  <th className="py-3.5 px-6 font-semibold">State / Location</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filteredContacts.map((c) => {
                  const isPet = c.division === 'petroleum';

                  return (
                    <tr key={c.id} className="hover:bg-neutral-900/40 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                              isPet ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                            }`}
                          >
                            {c.name.charAt(0)}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-white block">{c.name}</span>
                            <span className="text-xs text-neutral-400">{c.company}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            isPet
                              ? 'bg-red-950/60 text-red-400 border border-red-500/30'
                              : 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {isPet ? '🛢️ 3RD Petroleum' : '☀️ Power & Solar'}
                        </span>
                      </td>

                      <td className="py-4 px-6 font-mono text-xs">
                        <div className="text-white">{c.phone || '—'}</div>
                        <div className="text-neutral-500 text-[11px]">{c.email}</div>
                      </td>

                      <td className="py-4 px-6 text-neutral-300">
                        {c.state}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {c.phone && (
                            <a
                              href={`tel:${c.phone}`}
                              className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
                              title="Call"
                            >
                              <Icon name="phone" size={13} />
                            </a>
                          )}
                          {c.phone && (
                            <a
                              href={getWhatsAppUrl(`Hello ${c.name}, this is 3rd Energy reaching out regarding your energy account.`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-400 flex items-center justify-center transition-colors border border-emerald-500/30"
                              title="WhatsApp"
                            >
                              <Icon name="whatsapp" size={13} />
                            </a>
                          )}
                          <Link
                            href={`/admin/leads/${c.id}`}
                            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] font-semibold transition-colors"
                          >
                            Details →
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
