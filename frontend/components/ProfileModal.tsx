'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '@/lib/axios';
import { format } from 'date-fns';

interface User {
  email: string;
  displayName?: string;
}

interface Entry {
  createdAt: string;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onLogout: () => void;
  entries?: Entry[];
}

export default function ProfileModal({ isOpen, onClose, user, onLogout, entries = [] }: ProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [stats, setStats] = useState({
    totalEntries: 0,
    currentStreak: 0,
    longestStreak: 0,
    memberSince: new Date(),
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Fetch user stats
  const fetchStats = useCallback(async () => {
    try {
      setIsLoadingStats(true);
      const response = await axiosInstance.get('/users/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      // Use fallback data if API fails
      setStats({
        totalEntries: entries?.length || 0,
        currentStreak: 0,
        longestStreak: 0,
        memberSince: new Date(),
      });
    } finally {
      setIsLoadingStats(false);
    }
  }, [entries]);

  useEffect(() => {
    if (isOpen) {
      fetchStats();
    }
  }, [isOpen, fetchStats]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axiosInstance.put('/users/profile', {
        displayName: displayName.trim() || undefined,
      });
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
      // Optionally refresh the page or update context
      window.location.reload();
    } catch (error: unknown) {
      setSuccessMessage('Failed to update profile');
      console.error('Profile update error:', error);
    } finally {
      setIsSaving(false);
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
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-white/50"
          >
            {/* Header */}
            <div className="relative p-6 bg-gradient-to-br from-accent via-indigo-500 to-muted text-white">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl font-bold border-4 border-white/30">
                  {(user.displayName || user.email)[0].toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">
                    {user.displayName || user.email.split('@')[0]}
                  </h2>
                  <p className="text-white/80 text-sm">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Success Message */}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-emerald-50/80 backdrop-blur-sm border border-emerald-200/50 rounded-lg"
                >
                  <p className="text-sm text-emerald-600">{successMessage}</p>
                </motion.div>
              )}

              {/* Profile Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Profile Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Display Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-3 border border-emerald-100/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-all bg-white/80"
                      placeholder="Enter your name"
                    />
                  ) : (
                    <p className="text-foreground">{user.displayName || 'Not set'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <p className="text-gray-600">{user.email}</p>
                </div>

                {isEditing ? (
                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex-1 bg-gradient-to-r from-accent via-indigo-500 to-muted text-white px-4 py-2 rounded-lg hover:shadow-md transition-all disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                      className="px-4 py-2 border border-gray-300/50 rounded-lg hover:bg-gray-50/80 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-gradient-to-r from-accent to-indigo-500 text-white rounded-lg hover:shadow-md transition-all"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Stats */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Your Journey</h3>
                {isLoadingStats ? (
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="bg-gradient-to-br from-emerald-50/50 to-blue-50/50 rounded-xl p-4 border border-white/50 animate-pulse">
                        <div className="h-4 bg-emerald-100/50 rounded w-2/3 mb-2"></div>
                        <div className="h-6 bg-emerald-100/50 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-emerald-50/50 to-blue-50/50 rounded-xl p-4 border border-white/50">
                      <p className="text-sm text-gray-600 mb-1">Total Entries</p>
                      <p className="text-2xl font-semibold text-foreground">{stats.totalEntries}</p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50/50 to-blue-50/50 rounded-xl p-4 border border-white/50">
                      <p className="text-sm text-gray-600 mb-1">Current Streak</p>
                      <p className="text-2xl font-semibold text-foreground">{stats.currentStreak} days</p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50/50 to-blue-50/50 rounded-xl p-4 border border-white/50">
                      <p className="text-sm text-gray-600 mb-1">Longest Streak</p>
                      <p className="text-2xl font-semibold text-foreground">{stats.longestStreak} days</p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50/50 to-blue-50/50 rounded-xl p-4 border border-white/50">
                      <p className="text-sm text-gray-600 mb-1">Member Since</p>
                      <p className="text-sm font-semibold text-foreground">
                        {format(new Date(stats.memberSince), 'MMMM yyyy')}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Settings</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-white/80 rounded-lg border border-white/50">
                    <div>
                      <p className="font-medium text-foreground">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive daily reflection reminders</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/80 rounded-lg border border-white/50">
                    <div>
                      <p className="font-medium text-foreground">Dark Mode</p>
                      <p className="text-sm text-gray-600">Switch to dark theme</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-accent rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50/50 rounded-lg transition-colors border border-red-200/50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
