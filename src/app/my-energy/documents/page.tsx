'use client';

import React, { useEffect, useState } from 'react';
import { 
  PortalHeader, 
  DocumentCard, 
  PortalLoadingState, 
  PortalErrorState 
} from '@/components/portal/PortalComponents';
import { DocumentRecord } from '@/lib/types';

export default function DocumentVaultPage() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [filtered, setFiltered] = useState<DocumentRecord[]>([]);
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/portal/documents');
        if (!res.ok) throw new Error('Failed to load documents.');
        const data = await res.json();
        const docs = data.documents || [];
        setDocuments(docs);
        setFiltered(docs);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error loading documents.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    let list = [...documents];
    if (selectedType !== 'ALL') {
      list = list.filter(d => d.type === selectedType);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(d => 
        d.title.toLowerCase().includes(q) || 
        d.referenceNumber?.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q)
      );
    }
    setFiltered(list);
  }, [selectedType, searchQuery, documents]);

  const categories = [
    { label: 'All Documents', value: 'ALL' },
    { label: 'Invoices & Receipts', value: 'INVOICE' },
    { label: 'Single-Line Diagrams', value: 'SINGLE_LINE_DIAGRAM' },
    { label: 'Operating Manuals', value: 'USER_MANUAL' },
    { label: 'Warranty Certificates', value: 'WARRANTY_CERTIFICATE' },
  ];

  return (
    <>
      <PortalHeader title="Document Vault" />

      <div className="portal-container">
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc', margin: '0 0 4px' }}>
            Facility Energy Document Repository
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
            Centralised access to commercial tax invoices, engineering schematics, OEM user manuals, and compliance certificates.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedType(cat.value)}
                className={`portal-btn ${selectedType === cat.value ? 'portal-btn-primary' : 'portal-btn-secondary'}`}
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <input
            type="text"
            className="portal-input"
            style={{ width: '240px', padding: '8px 12px', fontSize: '12px' }}
            placeholder="Search documents..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <PortalLoadingState label="Retrieving document vault files..." />
        ) : error ? (
          <PortalErrorState message={error} />
        ) : filtered.length === 0 ? (
          <div className="portal-card" style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📁</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc' }}>No Documents Found</div>
            <p style={{ fontSize: '13px', color: '#64748b' }}>No documents matched your selected filter.</p>
          </div>
        ) : (
          <div className="portal-grid-2">
            {filtered.map(doc => (
              <DocumentCard key={doc.id} doc={doc} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
