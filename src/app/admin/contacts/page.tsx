'use client';

import React from 'react';
import { EmptyState } from '@/components/admin/AdminComponents';

export default function AdminContactsPage() {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">CRM Contacts</h1>
        <p className="admin-page-subtitle">Customer and company relationship management</p>
      </div>

      <EmptyState
        icon="👥"
        title="Contacts Coming Soon"
        description="CRM contact records are automatically created from lead submissions and orders. The full contacts view with company associations, communication history, and service records is part of Phase 3 rollout."
      />
    </div>
  );
}
