'use client';

import React, { useState, useEffect } from 'react';
import { LoadingState, EmptyState } from '@/components/admin/AdminComponents';

interface KBArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  tags: string[];
  isPublic: boolean;
  isVerified: boolean;
}

export default function AdminKnowledgePage() {
  const [articles, setArticles] = useState<KBArticle[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => { load(); }, [category]);

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('q', search);
      if (category) params.set('category', category);
      const res = await fetch(`/api/admin/knowledge?${params}`);
      if (res.ok) {
        const data = await res.json();
        setArticles(data.articles || []);
        setCategoryCounts(data.categoryCounts || {});
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    load();
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Knowledge Base</h1>
        <p className="admin-page-subtitle">{articles.length} articles — AI assistant uses this to answer customer queries</p>
      </div>

      <div className="admin-filters">
        <form onSubmit={handleSearch} className="admin-search-form">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search knowledge base..." className="admin-search-input" />
          <button type="submit" className="admin-search-btn">Search</button>
        </form>
        <select value={category} onChange={e => setCategory(e.target.value)} className="admin-filter-select">
          <option value="">All Categories</option>
          {Object.entries(categoryCounts).map(([cat, count]) => (
            <option key={cat} value={cat}>{cat} ({count})</option>
          ))}
        </select>
      </div>

      {loading ? <LoadingState message="Loading knowledge base..." /> : articles.length === 0 ? (
        <EmptyState icon="📚" title="No Articles Found" description="Knowledge base articles power the AI assistant." />
      ) : (
        <div className="admin-kb-grid">
          {articles.map(article => (
            <div key={article.id} className="admin-kb-card">
              <div className="admin-kb-header">
                <span className="admin-kb-category">{article.category}</span>
                <div className="admin-kb-badges">
                  {article.isVerified && <span className="admin-kb-verified">✓ Verified</span>}
                  {article.isPublic && <span className="admin-kb-public">Public</span>}
                </div>
              </div>
              <h3 className="admin-kb-title">{article.title}</h3>
              <p className="admin-kb-summary">{article.summary}</p>
              <div className="admin-kb-tags">
                {article.tags.slice(0, 4).map(tag => (
                  <span key={tag} className="admin-kb-tag">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
