'use client';

import { AdminLoginGate } from '@/components/admin/AdminLoginGate';
import { AdminLayout, type Tab } from '@/components/admin/AdminLayout';
import { AdminOverview } from '@/components/admin/AdminOverview';
import { AdminSignups } from '@/components/admin/AdminSignups';
import { AdminBookings } from '@/components/admin/AdminBookings';
import { AdminContent } from '@/components/admin/AdminContent';
import { AdminProfile } from '@/components/admin/AdminProfile';

const renderTab = (
  tab: Tab,
  accessKey: string,
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>,
) => {
  switch (tab) {
    case 'overview':
      return <AdminOverview fetchWithAuth={fetchWithAuth} />;
    case 'signups':
      return <AdminSignups accessKey={accessKey} fetchWithAuth={fetchWithAuth} />;
    case 'bookings':
      return <AdminBookings fetchWithAuth={fetchWithAuth} />;
    case 'content':
      return <AdminContent fetchWithAuth={fetchWithAuth} />;
    case 'profile':
      return <AdminProfile fetchWithAuth={fetchWithAuth} />;
  }
};

export default function AdminPage() {
  return (
    <AdminLoginGate>
      <AdminLayout>{renderTab}</AdminLayout>
    </AdminLoginGate>
  );
}
