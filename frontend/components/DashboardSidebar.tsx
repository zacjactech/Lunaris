'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface User {
  email: string;
  displayName?: string;
}

interface DashboardSidebarProps {
  activeView: 'overview' | 'entries' | 'new';
  onViewChange: (view: 'overview' | 'entries' | 'new') => void;
  onLogout: () => void;
  user: User;
  onOpenProfile: () => void;
}

export default function DashboardSidebar({
  activeView,
  onViewChange,
  onLogout,
  user,
  onOpenProfile,
}: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const navItems = [
    {
      id: 'overview' as const,
      label: 'Overview',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      id: 'entries' as const,
      label: 'Reflections',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: 'new' as const,
      label: 'New Entry',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
  ];

  return (
    <motion.aside
      animate={{ width: isCollapsed ? '80px' : '256px' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex flex-col relative hidden md:flex z-20 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(249,250,251,0.95) 100%)',
        backdropFilter: 'blur(10px)',
        borderRight: '1px solid rgba(229, 231, 235, 0.5)',
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.04)'
      }}
    >
      {/* Decorative Nature Pattern Background */}
      <div 
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='150' height='150' viewBox='0 0 150 150' xmlns='http://www.w3.org/2000/svg'%3E%3C!-- Flower --%3E%3Cg transform='translate(40, 40)'%3E%3Ccircle cx='25' cy='25' r='12' fill='%23ec4899' opacity='0.4'/%3E%3Cellipse cx='15' cy='25' rx='8' ry='12' fill='%23f472b6' opacity='0.5' transform='rotate(-30 15 25)'/%3E%3Cellipse cx='35' cy='25' rx='8' ry='12' fill='%23f472b6' opacity='0.5' transform='rotate(30 35 25)'/%3E%3Cellipse cx='25' cy='15' rx='12' ry='8' fill='%23f472b6' opacity='0.5'/%3E%3Cellipse cx='25' cy='35' rx='12' ry='8' fill='%23f472b6' opacity='0.5'/%3E%3Ccircle cx='25' cy='25' r='5' fill='%23fbbf24' opacity='0.6'/%3E%3C/g%3E%3C!-- Leaves --%3E%3Cellipse cx='100' cy='80' rx='8' ry='20' fill='%2310b981' opacity='0.4' transform='rotate(45 100 80)'/%3E%3Cellipse cx='110' cy='90' rx='6' ry='18' fill='%2334d399' opacity='0.4' transform='rotate(-30 110 90)'/%3E%3C!-- Branch --%3E%3Cpath d='M 20 100 Q 30 110 40 100 T 60 100' stroke='%2310b981' stroke-width='2' fill='none' opacity='0.3'/%3E%3C!-- Small flowers --%3E%3Ccircle cx='80' cy='30' r='4' fill='%236366f1' opacity='0.5'/%3E%3Ccircle cx='90' cy='35' r='3' fill='%23818cf8' opacity='0.5'/%3E%3Ccircle cx='30' cy='120' r='3' fill='%2314b8a6' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '150px 150px',
          backgroundRepeat: 'repeat'
        }}
      />
      
      {/* Gradient Accent with Floral Top */}
      <div 
        className="absolute top-0 left-0 right-0 h-40 opacity-25"
        style={{
          background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.2) 0%, transparent 100%)'
        }}
      />
      
      {/* Decorative Flowers at Top */}
      <div 
        className="absolute top-4 right-4 opacity-10"
        style={{
          width: '80px',
          height: '80px',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='40' cy='40' r='15' fill='%23ec4899' opacity='0.5'/%3E%3Ccircle cx='28' cy='40' r='10' fill='%23f472b6' opacity='0.6'/%3E%3Ccircle cx='52' cy='40' r='10' fill='%23f472b6' opacity='0.6'/%3E%3Ccircle cx='40' cy='28' r='10' fill='%23f472b6' opacity='0.6'/%3E%3Ccircle cx='40' cy='52' r='10' fill='%23f472b6' opacity='0.6'/%3E%3Ccircle cx='40' cy='40' r='6' fill='%23fbbf24' opacity='0.7'/%3E%3C/svg%3E")`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Decorative Leaves at Bottom */}
      <div 
        className="absolute bottom-20 left-4 opacity-10"
        style={{
          width: '60px',
          height: '60px',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cellipse cx='30' cy='30' rx='10' ry='25' fill='%2310b981' opacity='0.6' transform='rotate(30 30 30)'/%3E%3Cellipse cx='30' cy='30' rx='10' ry='25' fill='%2334d399' opacity='0.6' transform='rotate(-30 30 30)'/%3E%3Cellipse cx='35' cy='35' rx='8' ry='20' fill='%2310b981' opacity='0.5' transform='rotate(60 35 35)'/%3E%3C/svg%3E")`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Logo */}
      <div className="h-[88px] flex items-center px-6 border-b border-white/50 relative z-10 bg-white/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-accent to-muted rounded-lg flex items-center justify-center flex-shrink-0">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-xl font-semibold text-foreground whitespace-nowrap overflow-hidden"
              >
                Lunaris
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 relative z-10">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            title={isCollapsed ? item.label : undefined}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeView === item.id
                ? 'bg-gradient-to-r from-accent to-indigo-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-emerald-50/50'
            } ${isCollapsed ? 'justify-center' : ''}`}
          >
            <div className="flex-shrink-0">{item.icon}</div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-medium whitespace-nowrap overflow-hidden"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-white/50 relative z-10 bg-white/30 backdrop-blur-sm space-y-2">
        {/* Collapse/Expand Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-gray-600 hover:bg-emerald-50/50 border border-emerald-100/30 ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <div className="flex-shrink-0">
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="font-medium whitespace-nowrap overflow-hidden"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* User Profile */}
        {!isCollapsed && (
          <button
            onClick={onOpenProfile}
            className="w-full bg-gradient-to-br from-emerald-50/50 to-blue-50/50 rounded-xl p-4 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-blue-50 transition-colors cursor-pointer border border-white/50"
            title="Profile Settings"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-muted rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 hover:shadow-lg transition-shadow">
                {(user.displayName || user.email)[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="font-semibold text-foreground text-sm truncate">
                  {user.displayName || user.email.split('@')[0]}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        )}

        {isCollapsed && (
          <button
            onClick={onOpenProfile}
            className="flex justify-center w-full hover:opacity-80 transition-opacity"
            title="Profile Settings"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-muted rounded-full flex items-center justify-center text-white font-semibold text-sm hover:shadow-lg transition-shadow">
              {(user.displayName || user.email)[0].toUpperCase()}
            </div>
          </button>
        )}

        <button
          onClick={onLogout}
          title={isCollapsed ? 'Sign Out' : undefined}
          className={`w-full flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-red-50/50 rounded-lg transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-medium whitespace-nowrap overflow-hidden"
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
