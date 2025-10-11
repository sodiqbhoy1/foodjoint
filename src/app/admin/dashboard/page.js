"use client";
import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import DashboardHome from '@/components/admin/DashboardHome';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }
    // fetch orders
    fetch('/api/orders').then(r => r.json()).then(d => {
      if (d.ok) setOrders(d.orders || []);
    });
  }, []);

  return (
    <AdminLayout activePage="Home">
      <AdminSidebar active="Home" />
      <section className="flex-1 p-4 md:p-6 lg:p-8 lg:ml-0">
        <DashboardHome orders={orders} />
      </section>
    </AdminLayout>
  );
}
