"use client";
import { FiHome, FiPackage, FiUsers, FiList, FiLogOut, FiMenu, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useState } from 'react';
import LogoutConfirmModal from '@/components/LogoutConfirmModal';

const links = [
  { name: 'Home', href: '/admin/dashboard', icon: FiHome },
  { name: 'Orders', href: '/admin/orders', icon: FiPackage },
  { name: 'Menu', href: '/admin/menu', icon: FiList },
  { name: 'Riders', href: '/admin/riders', icon: FiUsers },
];

export default function AdminSidebar({ active }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    window.location.href = '/admin/login';
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setIsMobileMenuOpen(false); // Close mobile menu if open
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-md shadow-lg border hover:bg-gray-50 transition-colors"
        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
      >
        {isMobileMenuOpen ? (
          <FiX className="w-5 h-5 text-gray-700" />
        ) : (
          <FiMenu className="w-5 h-5 text-gray-700" />
        )}
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        bg-white shadow-lg
        transform transition-all duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'w-20' : 'w-64'}
        flex flex-col p-4 min-h-screen
      `}>
        {/* Header with collapse button */}
        <div className="flex items-center justify-between mb-6 mt-16 lg:mt-0">
          <div className={`font-bold text-xl text-[var(--brand)] transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
            Admin Panel
          </div>
          
          {/* Collapse/Expand button - hidden on mobile */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block p-2 hover:bg-gray-100 rounded-md transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <FiChevronRight className="w-5 h-5 text-gray-600" />
            ) : (
              <FiChevronLeft className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
        
        <nav className="flex-1">
          {links.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 w-full px-3 py-3 rounded mb-2 text-left hover:bg-[var(--brand)]/10 transition-colors group relative ${
                active === link.name ? 'bg-[var(--brand)]/10 font-semibold' : ''
              }`}
              title={isCollapsed ? link.name : ''}
            >
              <link.icon className="w-5 h-5 text-[var(--brand)] flex-shrink-0" />
              <span className={`text-sm lg:text-base transition-all duration-300 whitespace-nowrap ${
                isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
              }`}>
                {link.name}
              </span>
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="hidden lg:block absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {link.name}
                </div>
              )}
            </a>
          ))}
        </nav>

        {/* Enhanced Logout Button */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <button 
            onClick={handleLogoutClick}
            className="w-full flex items-center gap-3 px-3 py-3 rounded text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group relative"
            title={isCollapsed ? 'Logout' : ''}
          >
            <div className="p-1 rounded group-hover:bg-red-100 transition-colors flex-shrink-0">
              <FiLogOut className="w-5 h-5" />
            </div>
            <span className={`text-sm lg:text-base font-medium transition-all duration-300 whitespace-nowrap ${
              isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
            }`}>
              Logout
            </span>
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="hidden lg:block absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Logout
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  );
}
