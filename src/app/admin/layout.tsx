'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminComponents';
import { UserRole } from '@/lib/types';

interface UserData {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    // Don't check session on login page — prevents infinite redirect
    if (isLoginPage) {
      setLoading(false);
      return;
    }
    checkSession();
  }, [isLoginPage]);

  async function checkSession() {
    try {
      const res = await fetch('/api/admin/auth');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setUser(data.user);
        } else {
          router.push('/admin/login');
        }
      } else {
        router.push('/admin/login');
      }
    } catch {
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch { /* ignore */ }
    router.push('/admin/login');
  }

  // Login page renders without the admin shell
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="admin-boot-screen">
        <div className="admin-boot-spinner" />
        <p className="admin-boot-text">Initialising 3E Admin...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="admin-shell">
      <AdminSidebar
        userRole={user.role}
        userName={`${user.firstName} ${user.lastName}`}
        onLogout={handleLogout}
      />
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <h2 className="admin-topbar-title">3rd Energy Intelligence Platform</h2>
          </div>
          <div className="admin-topbar-right">
            <span className="admin-topbar-role">{user.role}</span>
            <span className="admin-topbar-user">{user.firstName}</span>
          </div>
        </header>
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
}
