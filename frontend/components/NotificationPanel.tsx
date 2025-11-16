'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: 'reminder' | 'achievement' | 'streak' | 'tip';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface Entry {
  createdAt: string;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  entries: Entry[];
  onNotificationsRead?: (notificationIds: string[]) => void;
}

export default function NotificationPanel({ isOpen, onClose, entries, onNotificationsRead }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Generate notifications based on real data
  useEffect(() => {
    if (!isOpen) return;

    const generateNotifications = () => {
    const newNotifications: Notification[] = [];

    // Calculate streak
    const sortedDates = entries
      .map((e) => new Date(e.createdAt).toDateString())
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let currentStreak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (sortedDates.length > 0 && (sortedDates[0] === today || sortedDates[0] === yesterday)) {
      let currentDate = new Date();
      for (const dateStr of sortedDates) {
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

    // Streak notifications
    if (currentStreak >= 7 && currentStreak % 7 === 0) {
      newNotifications.push({
        id: `streak-${currentStreak}`,
        type: 'streak',
        title: `${currentStreak}-Day Streak! 🔥`,
        message: `You've been consistent for ${currentStreak} days! Keep up the great work.`,
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        read: false,
      });
    } else if (currentStreak >= 3) {
      newNotifications.push({
        id: `streak-${currentStreak}`,
        type: 'streak',
        title: `${currentStreak}-Day Streak! 🔥`,
        message: `You're on a roll! ${currentStreak} days of consistent reflection.`,
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        read: false,
      });
    }

    // Check if user hasn't journaled today
    const hasJournaledToday = sortedDates[0] === today;
    if (!hasJournaledToday) {
      newNotifications.push({
        id: 'reminder-today',
        type: 'reminder',
        title: 'Time to Reflect',
        message: 'Take a moment to check in with your emotions today.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        read: false,
      });
    }

    // Achievement notifications based on total entries
    const totalEntries = entries.length;
    const milestones = [5, 10, 25, 50, 100, 200];
    const recentMilestone = milestones.find(m => totalEntries >= m && totalEntries < m + 5);
    
    if (recentMilestone) {
      newNotifications.push({
        id: `achievement-${recentMilestone}`,
        type: 'achievement',
        title: 'Milestone Reached! 🎉',
        message: `You've completed ${recentMilestone} journal entries. Amazing progress!`,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        read: totalEntries > recentMilestone + 2,
      });
    }

    // Mindfulness tips (rotate through different tips)
    const tips = [
      'Try the 5-4-3-2-1 grounding technique when feeling anxious.',
      'Take three deep breaths before starting your day.',
      'Notice five things you can see around you right now.',
      'Practice gratitude for one small thing today.',
      'Observe your thoughts without judgment.',
    ];
    const tipIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % tips.length;
    
    newNotifications.push({
      id: `tip-${tipIndex}`,
      type: 'tip',
      title: 'Mindfulness Tip',
      message: tips[tipIndex],
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
      read: true,
    });

      setNotifications(newNotifications);
    };

    generateNotifications();
  }, [isOpen, entries]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
    if (onNotificationsRead) {
      onNotificationsRead([id]);
    }
  };

  const markAllAsRead = () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    if (onNotificationsRead && unreadIds.length > 0) {
      onNotificationsRead(unreadIds);
    }
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'streak':
        return (
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            </svg>
          </div>
        );
      case 'reminder':
        return (
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        );
      case 'achievement':
        return (
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
        );
      case 'tip':
        return (
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, x: 300 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ scale: 0.9, opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden border border-white/50"
          >
            {/* Header */}
            <div className="p-6 border-b border-emerald-100/30 bg-gradient-to-r from-emerald-50/50 to-blue-50/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-foreground">Notifications</h2>
                  {unreadCount > 0 && (
                    <span className="px-2 py-1 bg-gradient-to-r from-accent to-indigo-500 text-white text-xs font-semibold rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100/80 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-accent hover:underline font-medium"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
              {notifications.length === 0 ? (
                <div className="p-12 text-center">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <p className="text-gray-500">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-emerald-100/30">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className={`p-4 hover:bg-emerald-50/30 transition-colors cursor-pointer ${
                        !notification.read ? 'bg-blue-50/30' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        {getIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-semibold text-foreground text-sm">
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-accent rounded-full flex-shrink-0 mt-1"></span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">
                              {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="text-xs text-red-500 hover:text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
