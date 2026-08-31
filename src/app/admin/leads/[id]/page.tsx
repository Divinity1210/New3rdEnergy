'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { LeadScoreBadge, StageBadge, AIDraftBanner, LoadingState, ErrorState } from '@/components/admin/AdminComponents';

interface LeadDetail {
  lead: Record<string, unknown>;
  score: {
    totalScore: number;
    maxPossibleScore: number;
    tier: 'HOT' | 'WARM' | 'COLD';
    explanation: string;
    signals: { signal: string; description: string; score: number; maxScore: number; reasoning: string }[];
  };
  aiSummary: {
    whatTheyWant: string;
    relevantProducts: string[];
    missingInformation: string[];
    suggestedNextStep: string;
    classification: string;
    confidence: number;
    requiresHumanReview: boolean;
  };
}

interface AIDraft {
  salesContext: {
    summary: string;
    recommendedActions: string[];
    suggestedProducts: string[];
    draftResponse: string;
    talkingPoints: string[];
    confidence: number;
  };
  quoteBrief: {
    customerSummary: string;
    requirements: string[];
    openQuestions: string[];
    quotePrepChecklist: { item: string; completed: boolean }[];
  };
}

export default function AdminLeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [data, setData] = useState<LeadDetail | null>(null);
  const [aiDraft, setAiDraft] = useState<AIDraft | null>(null);
  const [loading, setLoading] = useState(true);
  const [draftLoading, setDraftLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLead();
  }, [id]);

  async function loadLead() {
    try {
      const res = await fetch(`/api/admin/leads/${id}`);
      if (!res.ok) throw new Error('Failed to load lead');
      setData(await res.json());
    } catch (err) {
      setError('Failed to load lead details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function generateAIDraft() {
    setDraftLoading(true);
    try {
      const res = await fetch(`/api/admin/leads/${id}/ai-draft`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to generate draft');
      setAiDraft(await res.json());
    } catch (err) {
      console.error('AI Draft error:', err);
    } finally {
      setDraftLoading(false);
    }
  }

  if (loading) return <LoadingState message="Loading lead details..." />;
  if (error) return <ErrorState message={error} onRetry={loadLead} />;
  if (!data) return null;

  const lead = data.lead as Record<string, unknown>;
  const contact = lead.contact as Record<string, unknown> || {};
  const org = lead.organisation as Record<string, unknown> || {};

  return (
    <div className="admin-page">
      <button onClick={() => router.back()} className="admin-back-btn">← Back to Leads</button>

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Lead: {lead.referenceNumber as string}</h1>
          <p className="admin-page-subtitle">
            {contact.firstName as string} {contact.lastName as string} — {org.name as string || 'No organisation'}
          </p>
        </div>
        <div className="admin-header-actions">
          <LeadScoreBadge tier={data.score.tier} score={data.score.totalScore} />
          <StageBadge stage={lead.status as string} />
        </div>
      </div>

      {/* Two column: Lead Info + AI Summary */}
      <div className="admin-two-col">
        {/* Contact & Lead Info */}
        <div className="admin-section">
          <h2 className="admin-section-title">Lead Information</h2>
          <div className="admin-detail-grid">
            <div className="admin-detail-item">
              <span className="admin-detail-label">Name</span>
              <span className="admin-detail-value">{contact.firstName as string} {contact.lastName as string}</span>
            </div>
            <div className="admin-detail-item">
              <span className="admin-detail-label">Email</span>
              <span className="admin-detail-value">{contact.email as string}</span>
            </div>
            <div className="admin-detail-item">
              <span className="admin-detail-label">Phone</span>
              <span className="admin-detail-value">{contact.phone as string || '—'}</span>
            </div>
            <div className="admin-detail-item">
              <span className="admin-detail-label">Organisation</span>
              <span className="admin-detail-value">{org.name as string || '—'}</span>
            </div>
            <div className="admin-detail-item">
              <span className="admin-detail-label">Industry</span>
              <span className="admin-detail-value">{org.industry as string || '—'}</span>
            </div>
            <div className="admin-detail-item">
              <span className="admin-detail-label">Urgency</span>
              <span className={`admin-urgency admin-urgency-${lead.urgency as string}`}>{lead.urgency as string}</span>
            </div>
          </div>
          {lead.notes && (
            <div className="admin-notes-section">
              <h3 className="admin-section-subtitle">Notes</h3>
              <p className="admin-notes-text">{lead.notes as string}</p>
            </div>
          )}
        </div>

        {/* AI Summary */}
        <div className="admin-section">
          <h2 className="admin-section-title">🧠 AI Lead Summary</h2>
          <AIDraftBanner />
          <div className="admin-ai-summary">
            <div className="admin-ai-field">
              <span className="admin-ai-field-label">What They Want</span>
              <p>{data.aiSummary.whatTheyWant}</p>
            </div>
            <div className="admin-ai-field">
              <span className="admin-ai-field-label">Classification</span>
              <p>{data.aiSummary.classification}</p>
            </div>
            <div className="admin-ai-field">
              <span className="admin-ai-field-label">Suggested Next Step</span>
              <p className="admin-ai-nextstep">{data.aiSummary.suggestedNextStep}</p>
            </div>
            {data.aiSummary.missingInformation.length > 0 && (
              <div className="admin-ai-field">
                <span className="admin-ai-field-label">Missing Information</span>
                <ul className="admin-ai-list">
                  {data.aiSummary.missingInformation.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="admin-ai-field">
              <span className="admin-ai-field-label">Confidence</span>
              <p>{Math.round(data.aiSummary.confidence * 100)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="admin-section">
        <h2 className="admin-section-title">Score Breakdown ({data.score.totalScore}/{data.score.maxPossibleScore})</h2>
        <div className="admin-score-breakdown">
          {data.score.signals.map(signal => (
            <div key={signal.signal} className="admin-signal-row">
              <div className="admin-signal-info">
                <span className="admin-signal-name">{signal.description}</span>
                <span className="admin-signal-reasoning">{signal.reasoning}</span>
              </div>
              <div className="admin-signal-score">
                <div className="admin-signal-bar">
                  <div className="admin-signal-fill" style={{ width: `${(signal.score / signal.maxScore) * 100}%` }} />
                </div>
                <span className="admin-signal-value">{signal.score}/{signal.maxScore}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Draft Generation */}
      <div className="admin-section">
        <h2 className="admin-section-title">🤖 AI Sales Assistant</h2>
        {!aiDraft ? (
          <div className="admin-ai-cta">
            <p>Generate AI-powered sales context, talking points, and a draft response for this lead.</p>
            <button
              onClick={generateAIDraft}
              disabled={draftLoading}
              className="admin-ai-generate-btn"
            >
              {draftLoading ? 'Generating...' : '🧠 Generate AI Draft'}
            </button>
          </div>
        ) : (
          <div className="admin-ai-draft">
            <AIDraftBanner />

            <div className="admin-ai-field">
              <span className="admin-ai-field-label">Summary</span>
              <p>{aiDraft.salesContext.summary}</p>
            </div>

            <div className="admin-ai-field">
              <span className="admin-ai-field-label">Recommended Actions</span>
              <ol className="admin-ai-list">
                {aiDraft.salesContext.recommendedActions.map((action, i) => (
                  <li key={i}>{action}</li>
                ))}
              </ol>
            </div>

            <div className="admin-ai-field">
              <span className="admin-ai-field-label">Talking Points</span>
              <ul className="admin-ai-list">
                {aiDraft.salesContext.talkingPoints.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>

            <div className="admin-ai-field">
              <span className="admin-ai-field-label">Draft Response (for review)</span>
              <pre className="admin-ai-draft-text">{aiDraft.salesContext.draftResponse}</pre>
            </div>

            {aiDraft.quoteBrief && (
              <>
                <h3 className="admin-section-subtitle">Quote Preparation Brief</h3>
                <div className="admin-ai-field">
                  <span className="admin-ai-field-label">Open Questions</span>
                  <ul className="admin-ai-list">
                    {aiDraft.quoteBrief.openQuestions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
                <div className="admin-ai-field">
                  <span className="admin-ai-field-label">Quote Checklist</span>
                  <ul className="admin-ai-checklist">
                    {aiDraft.quoteBrief.quotePrepChecklist.map((item, i) => (
                      <li key={i} className={item.completed ? 'admin-check-done' : 'admin-check-pending'}>
                        {item.completed ? '✅' : '⬜'} {item.item}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
