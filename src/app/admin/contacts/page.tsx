'use client';

import React, { useState, useEffect, useRef } from 'react';
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

  // CSV Import State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<{ total: number; success: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadContacts();
  }, []);

  async function loadContacts() {
    try {
      setLoading(true);
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

  function handleDownloadSampleCSV() {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Contact Name,Company,Email,Phone,Division,State,Product Requirement,Volume\n' +
      'Engr. Kunle Adeyemi,Dangote Sugar Refinery,kunle@dangotesugar.com,+2348031234567,petroleum,Lagos (Apapa),Automotive Gas Oil (AGO),45000\n' +
      'Dr. Maryam Bello,Apex Diagnostics,m.bello@apexdiag.ng,+2348029876543,power,Abuja (Garki),15kVA Solar Inverter System,1\n' +
      'Alhaji Sani Garba,Northern Logistics Fleet,sani@nlogistics.ng,+2348055554433,petroleum,Kano (Bompai),Premium Motor Spirit (PMS),33000\n';

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', '3rd_energy_client_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter((l) => l.trim().length > 0);
        if (lines.length <= 1) {
          alert('CSV file is empty or missing data rows.');
          setImporting(false);
          return;
        }

        // Process rows (skip header)
        const rows = lines.slice(1);
        let successCount = 0;

        for (const row of rows) {
          const cols = row.split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
          if (cols.length >= 4) {
            const [name, company, email, phone, division = 'petroleum', state = 'Lagos', product = 'AGO Diesel', volume = '33000'] = cols;
            const names = name.split(' ');

            await fetch('/api/leads', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contact: {
                  firstName: names[0] || 'Client',
                  lastName: names.slice(1).join(' ') || '',
                  email: email || `contact_${Date.now()}@domain.com`,
                  phone: phone || '+2348000000000',
                },
                organisation: {
                  name: company || 'Corporate Account',
                  industry: division === 'petroleum' ? 'Petroleum Haulage / Industrial' : 'Commercial Facility',
                },
                products: [
                  {
                    productId: product.toLowerCase().replace(/\s+/g, '-'),
                    productName: product,
                    category: division === 'petroleum' ? 'fuel_bulk' : 'solar_inverter',
                  },
                ],
                quantity: {
                  value: parseInt(volume, 10) || 33000,
                  unit: division === 'petroleum' ? 'Litres' : 'Units',
                },
                location: {
                  address: 'Industrial Facility',
                  city: state,
                  state,
                  country: 'Nigeria',
                  deliveryType: 'delivery',
                },
                urgency: 'high',
                notes: `[Bulk CSV Ingested Account] Corporate Roster`,
                source: `csv_import_${division}`,
              }),
            });
            successCount++;
          }
        }

        setImportResults({ total: rows.length, success: successCount });
        loadContacts();
      } catch (err) {
        console.error('Error importing CSV:', err);
        alert('Failed to parse CSV file. Please ensure correct formatting.');
      } finally {
        setImporting(false);
      }
    };

    reader.readAsText(file);
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
          <button
            onClick={() => {
              setImportResults(null);
              setIsImportModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-neutral-700 cursor-pointer"
          >
            <Icon name="download" size={13} />
            Bulk CSV Import
          </button>
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

                      <td className="py-4 px-6 text-neutral-300">{c.state}</td>

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

      {/* Bulk CSV Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-neutral-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Bulk CSV Client Import</h3>
                <p className="text-xs text-neutral-400">Import corporate accounts directly into CRM & Pipeline</p>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-neutral-300">1. Download Template</span>
                  <button
                    onClick={handleDownloadSampleCSV}
                    className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Icon name="download" size={12} />
                    Download CSV Template
                  </button>
                </div>
                <p className="text-[11px] text-neutral-500">
                  Headers required: <code>Contact Name, Company, Email, Phone, Division, State, Product Requirement, Volume</code>
                </p>
              </div>

              <div className="p-6 border-2 border-dashed border-neutral-800 rounded-xl text-center space-y-3 hover:border-neutral-700 transition-colors">
                <input
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
                  <Icon name="download" size={20} />
                </div>
                <div>
                  <button
                    type="button"
                    disabled={importing}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-md shadow-red-600/20"
                  >
                    {importing ? 'Processing & Ingesting...' : 'Select CSV File to Upload'}
                  </button>
                </div>
                <p className="text-[11px] text-neutral-500">Supports standard .csv format with UTF-8 encoding</p>
              </div>

              {importResults && (
                <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 space-y-1">
                  <span className="font-bold block">✓ Import Complete!</span>
                  <p>Successfully processed and ingested {importResults.success} of {importResults.total} corporate accounts into the CRM & Pipeline.</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
