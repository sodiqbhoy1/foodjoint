"use client";
import { useEffect, useState } from 'react';

export default function AdminLayout({ children, activePage = 'Home' }) {
  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }
  }, []);

  return (
    <main className="min-h-screen flex bg-gray-50 relative">
      {children}
    </main>
  );
}