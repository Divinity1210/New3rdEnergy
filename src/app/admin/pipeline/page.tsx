'use client';

import React, { useState, useEffect } from 'react';
import { LoadingState, EmptyState } from '@/components/admin/AdminComponents';

interface PipelineStage {
  id: string;
  label: string;
  color: string;
  count: number;
  avgHoursInStage: number;
}

export default function AdminPipelinePage() {
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPipeline();
  }, []);

  async function loadPipeline() {
    try {
      const res = await fetch('/api/admin/pipeline');
      if (res.ok) {
        const data = await res.json();
        setStages(data.stages || []);
      }
    } catch (err) {
      console.error('Pipeline load error:', err);
    } finally {
      setLoading(false);
    }
  }

  const totalDeals = stages.reduce((s, st) => s + st.count, 0);

  if (loading) return <LoadingState message="Loading pipeline..." />;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Sales Pipeline</h1>
        <p className="admin-page-subtitle">{totalDeals} total opportunities across {stages.length} stages</p>
      </div>

      {totalDeals === 0 ? (
        <EmptyState icon="🔄" title="Pipeline Empty" description="Opportunities will appear as leads progress through the sales pipeline." />
      ) : (
        <div className="admin-pipeline-board">
          {stages.map(stage => (
            <div key={stage.id} className="admin-pipeline-column">
              <div className="admin-pipeline-header" style={{ borderTopColor: stage.color }}>
                <span className="admin-pipeline-stage-name">{stage.label}</span>
                <span className="admin-pipeline-count" style={{ backgroundColor: `${stage.color}20`, color: stage.color }}>
                  {stage.count}
                </span>
              </div>
              <div className="admin-pipeline-body">
                {stage.count === 0 ? (
                  <div className="admin-pipeline-empty">No items</div>
                ) : (
                  <div className="admin-pipeline-stats">
                    <span className="admin-pipeline-avg">
                      Avg time: {stage.avgHoursInStage > 24 ? `${Math.round(stage.avgHoursInStage / 24)}d` : `${stage.avgHoursInStage}h`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
