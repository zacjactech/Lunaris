'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EmotionForm from './EmotionForm';
import EntriesList from './EntriesList';
import DashboardStats from './DashboardStats';
import DashboardSidebar from './DashboardSidebar';
import ProfileModal from './ProfileModal';
import NotificationPanel from './NotificationPanel';
import { Entry } from '@/app/page';

interface User {
  email: string;
  displayName?: string;
}

interface DashboardLayoutProps {
  user: User;
  entries: Entry[];
  isLoading: boolean;
  error: string;
  onLogout: () => void;
  onEntryCreated: () => void;
}

export default function DashboardLayout({
  user,
  entries,
  isLoading,
  error,
  onLogout,
  onEntryCreated,
}: DashboardLayoutProps) {
  const [activeView, setActiveView] = useState<'overview' | 'entries' | 'new'>('overview');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Calculate unread notifications count
  const unreadNotificationsCount = useMemo(() => {
    // Check if user hasn't journaled today
    const sortedDates = entries
      .map((e) => new Date(e.createdAt).toDateString())
      .filter((date, index, self) => self.indexOf(date) === index);
    const today = new Date().toDateString();
    const hasJournaledToday = sortedDates.includes(today);
    
    // Calculate streak
    let currentStreak = 0;
    const yesterday = new Date(new Date().getTime() - 86400000).toDateString();
    if (sortedDates.length > 0 && (sortedDates[0] === today || sortedDates[0] === yesterday)) {
      let currentDate = new Date();
      const sorted = sortedDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      for (const dateStr of sorted) {
        const entryDate = new Date(dateStr);
        const diffDays = Math.floor((currentDate.getTime() - entryDate.getTime()) / 86400000);
        if (diffDays <= 1) {
          currentStreak++;
          currentDate = entryDate;
        } else {
          break;
        }
      }
    }
    
    let count = 0;
    if (!hasJournaledToday) count++; // Reminder notification
    if (currentStreak >= 3) count++; // Streak notification
    
    return count;
  }, [entries]);

  const displayName = user.displayName || user.email.split('@')[0];
  const firstName = displayName.split(' ')[0];

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden relative">
      {/* Main Background with Nature Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
        {/* Large Botanical Illustrations */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='400' viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3C!-- Large Flower 1 --%3E%3Cg transform='translate(50, 50)'%3E%3Ccircle cx='50' cy='50' r='25' fill='%23ec4899' opacity='0.3'/%3E%3Cellipse cx='30' cy='50' rx='20' ry='30' fill='%23f472b6' opacity='0.4' transform='rotate(-30 30 50)'/%3E%3Cellipse cx='70' cy='50' rx='20' ry='30' fill='%23f472b6' opacity='0.4' transform='rotate(30 70 50)'/%3E%3Cellipse cx='50' cy='30' rx='30' ry='20' fill='%23f472b6' opacity='0.4'/%3E%3Cellipse cx='50' cy='70' rx='30' ry='20' fill='%23f472b6' opacity='0.4'/%3E%3Ccircle cx='50' cy='50' r='12' fill='%23fbbf24' opacity='0.6'/%3E%3C/g%3E%3C!-- Leaves --%3E%3Cg transform='translate(250, 150)'%3E%3Cellipse cx='0' cy='0' rx='15' ry='40' fill='%2310b981' opacity='0.3' transform='rotate(45)'/%3E%3Cellipse cx='0' cy='0' rx='15' ry='40' fill='%2334d399' opacity='0.3' transform='rotate(-45)'/%3E%3Cellipse cx='20' cy='20' rx='12' ry='35' fill='%2310b981' opacity='0.25' transform='rotate(20)'/%3E%3C/g%3E%3C!-- Large Flower 2 --%3E%3Cg transform='translate(300, 280)'%3E%3Ccircle cx='40' cy='40' r='20' fill='%236366f1' opacity='0.3'/%3E%3Cellipse cx='25' cy='40' rx='18' ry='25' fill='%23818cf8' opacity='0.4' transform='rotate(-40 25 40)'/%3E%3Cellipse cx='55' cy='40' rx='18' ry='25' fill='%23818cf8' opacity='0.4' transform='rotate(40 55 40)'/%3E%3Cellipse cx='40' cy='25' rx='25' ry='18' fill='%23818cf8' opacity='0.4'/%3E%3Cellipse cx='40' cy='55' rx='25' ry='18' fill='%23818cf8' opacity='0.4'/%3E%3Ccircle cx='40' cy='40' r='10' fill='%23fbbf24' opacity='0.6'/%3E%3C/g%3E%3C!-- Small Flowers --%3E%3Ccircle cx='150' cy='300' r='8' fill='%23f472b6' opacity='0.4'/%3E%3Ccircle cx='170' cy='310' r='6' fill='%23ec4899' opacity='0.4'/%3E%3Ccircle cx='160' cy='290' r='7' fill='%23f9a8d4' opacity='0.4'/%3E%3C!-- Botanical Stems --%3E%3Cpath d='M 100 200 Q 120 220 100 250' stroke='%2310b981' stroke-width='3' fill='none' opacity='0.3'/%3E%3Cpath d='M 320 100 Q 340 130 330 160' stroke='%2334d399' stroke-width='2' fill='none' opacity='0.3'/%3E%3C/svg%3E")`,
            backgroundSize: '400px 400px',
            backgroundPosition: 'center'
          }}
        />
        {/* Detailed Floral Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3C!-- Repeating Flower Pattern --%3E%3Cg%3E%3Ccircle cx='30' cy='30' r='8' fill='%23ec4899' opacity='0.5'/%3E%3Ccircle cx='22' cy='30' r='5' fill='%23f472b6' opacity='0.6'/%3E%3Ccircle cx='38' cy='30' r='5' fill='%23f472b6' opacity='0.6'/%3E%3Ccircle cx='30' cy='22' r='5' fill='%23f472b6' opacity='0.6'/%3E%3Ccircle cx='30' cy='38' r='5' fill='%23f472b6' opacity='0.6'/%3E%3Ccircle cx='30' cy='30' r='3' fill='%23fbbf24' opacity='0.7'/%3E%3C!-- Leaf --%3E%3Cellipse cx='60' cy='60' rx='6' ry='15' fill='%2310b981' opacity='0.4' transform='rotate(30 60 60)'/%3E%3Cellipse cx='70' cy='70' rx='5' ry='12' fill='%2334d399' opacity='0.4' transform='rotate(-20 70 70)'/%3E%3C!-- Small dots --%3E%3Ccircle cx='90' cy='30' r='2' fill='%236366f1' opacity='0.5'/%3E%3Ccircle cx='30' cy='90' r='2' fill='%2314b8a6' opacity='0.5'/%3E%3Ccircle cx='90' cy='90' r='2' fill='%23ec4899' opacity='0.5'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '120px 120px'
          }}
        />
        {/* Organic Shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/40 to-pink-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-emerald-200/40 to-teal-200/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl" />
        {/* Corner Botanical Decorations */}
        <div 
          className="absolute top-0 left-0 w-64 h-64 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 0 0 Q 50 50 0 100 Q 50 50 100 0' fill='%2310b981' opacity='0.6'/%3E%3Ccircle cx='40' cy='40' r='15' fill='%23f472b6' opacity='0.5'/%3E%3Ccircle cx='30' cy='30' r='8' fill='%23fbbf24' opacity='0.6'/%3E%3C/svg%3E")`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <div 
          className="absolute bottom-0 right-0 w-64 h-64 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 200 200 Q 150 150 200 100 Q 150 150 100 200' fill='%236366f1' opacity='0.6'/%3E%3Ccircle cx='160' cy='160' r='15' fill='%23ec4899' opacity='0.5'/%3E%3Ccircle cx='170' cy='170' r='8' fill='%23fbbf24' opacity='0.6'/%3E%3C/svg%3E")`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
          }}
        />
      </div>

      {/* Sidebar - Desktop */}
      <DashboardSidebar
        activeView={activeView}
        onViewChange={setActiveView}
        onLogout={onLogout}
        user={user}
        onOpenProfile={() => setShowProfile(true)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full overflow-hidden relative z-10">
        {/* Header */}
        <header className="bg-white/70 backdrop-blur-md border-b border-white/50 shadow-sm z-10 h-[88px] flex-shrink-0">
          <div className="px-4 md:px-8 h-full flex items-center">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="md:hidden p-2 hover:bg-emerald-50/50 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-xl md:text-3xl font-semibold text-foreground">
                    Hello, {firstName}!
                  </h1>
                  <p className="text-gray-600 mt-1 text-xs md:text-sm hidden sm:block">
                    Explore your emotional journey and mindfulness practice
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                {/* Notification Icon */}
                <button 
                  onClick={() => setShowNotifications(true)}
                  className="p-2 hover:bg-emerald-50/50 rounded-full transition-colors relative"
                  title="Notifications"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {/* Notification Badge */}
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center px-1">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileMenu(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
            >
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="w-64 h-full shadow-2xl relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(249,250,251,0.98) 100%)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                {/* Mobile Menu Nature Pattern */}
                <div 
                  className="absolute inset-0 opacity-[0.1]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='150' height='150' viewBox='0 0 150 150' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 10 C 30 10, 20 25, 20 40 C 20 55, 35 65, 50 70 C 65 65, 80 55, 80 40 C 80 25, 70 10, 50 10 Z M 50 30 C 45 30, 40 35, 40 40 C 40 45, 45 50, 50 50 C 55 50, 60 45, 60 40 C 60 35, 55 30, 50 30 Z' fill='%2310b981' opacity='0.3'/%3E%3Ccircle cx='25' cy='75' r='3' fill='%236366f1' opacity='0.4'/%3E%3Ccircle cx='75' cy='25' r='2' fill='%23ec4899' opacity='0.4'/%3E%3Ccircle cx='85' cy='85' r='2.5' fill='%2314b8a6' opacity='0.4'/%3E%3C/svg%3E")`,
                    backgroundSize: '100px 100px',
                    backgroundRepeat: 'repeat'
                  }}
                />
                <div className="p-6 border-b border-white/50 relative z-10 bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-accent to-muted rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                      </div>
                      <span className="text-xl font-semibold text-foreground">Lunaris</span>
                    </div>
                    <button onClick={() => setShowMobileMenu(false)} className="p-2 hover:bg-emerald-50/50 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <nav className="p-4 space-y-2 relative z-10">
                  {[
                    { id: 'overview' as const, label: 'Overview', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
                    { id: 'entries' as const, label: 'Reflections', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                    { id: 'new' as const, label: 'New Entry', icon: 'M12 4v16m8-8H4' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveView(item.id);
                        setShowMobileMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        activeView === item.id ? 'bg-gradient-to-r from-accent to-indigo-500 text-white shadow-md' : 'text-gray-600 hover:bg-emerald-50/50'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/50 bg-gradient-to-t from-white/80 to-transparent backdrop-blur-sm relative z-10">
                  <button
                    onClick={() => {
                      setShowProfile(true);
                      setShowMobileMenu(false);
                    }}
                    className="w-full bg-gradient-to-br from-emerald-50/50 to-blue-50/50 rounded-xl p-3 mb-3 border border-white/50 hover:from-emerald-50 hover:to-blue-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-accent to-muted rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {(user.displayName || user.email)[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0 overflow-hidden text-left">
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
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-gray-600 hover:bg-red-50/50 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span className="text-sm font-medium">Sign Out</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Modal */}
        <ProfileModal
          isOpen={showProfile}
          onClose={() => setShowProfile(false)}
          user={user}
          onLogout={onLogout}
          entries={entries}
        />

        {/* Notification Panel */}
        <NotificationPanel
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          entries={entries}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {activeView === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <DashboardStats entries={entries} isLoading={isLoading} />

              {error && (
                <div className="p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="lg:col-span-3 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">Recent Reflections</h2>
                    {entries.length > 10 && (
                      <button
                        onClick={() => setActiveView('entries')}
                        className="text-accent hover:underline text-sm font-medium"
                      >
                        View all →
                      </button>
                    )}
                  </div>
                  <EntriesList
                    entries={entries.slice(0, 10)}
                    isLoading={isLoading}
                    onEntryDeleted={onEntryCreated}
                    onEntryUpdated={onEntryCreated}
                  />
                </div>

                <div className="space-y-4 md:space-y-6">
                  <QuickActionCard onNewEntry={() => setActiveView('new')} />
                  <MindfulnessTip />
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'entries' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-foreground">All Reflections</h2>
                <button
                  onClick={() => setActiveView('new')}
                  className="px-4 py-2 bg-gradient-to-r from-accent to-indigo-500 text-white rounded-lg hover:shadow-md transition-all"
                >
                  New Entry
                </button>
              </div>
              <EntriesList
                entries={entries}
                isLoading={isLoading}
                onEntryDeleted={onEntryCreated}
                onEntryUpdated={onEntryCreated}
              />
            </motion.div>
          )}

          {activeView === 'new' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="max-w-4xl">
                <h2 className="text-2xl font-semibold text-foreground mb-6">New Reflection</h2>
                <EmotionForm
                  onEntryCreated={() => {
                    onEntryCreated();
                    setActiveView('overview');
                  }}
                />
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}

function QuickActionCard({ onNewEntry }: { onNewEntry: () => void }) {
  return (
    <div className="bg-gradient-to-br from-accent via-indigo-500 to-muted rounded-xl p-6 text-white shadow-md border border-white/20">
      <h3 className="text-lg font-semibold mb-2">Take a Moment</h3>
      <p className="text-sm opacity-90 mb-4">
        Pause and reflect on your current state
      </p>
      <button
        onClick={onNewEntry}
        className="w-full bg-white/95 text-accent px-4 py-2 rounded-lg font-medium hover:shadow-lg hover:bg-white transition-all"
      >
        New Reflection
      </button>
    </div>
  );
}

function MindfulnessTip() {
  const [randomTip] = useState(() => {
    const tips = [
      "Take three deep breaths before starting your day",
      "Notice five things you can see around you",
      "Practice gratitude for one small thing today",
      "Take a mindful walk without your phone",
      "Observe your thoughts without judgment",
    ];
    const randomIndex = Math.floor(Math.random() * tips.length);
    return tips[randomIndex];
  });

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="font-semibold text-foreground">Daily Tip</h3>
      </div>
      <p className="text-sm text-gray-600">{randomTip}</p>
    </div>
  );
}
