'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import AudioControl from '@/components/AudioControl';
import axiosInstance from '@/lib/axios';

export interface Entry {
  id: string;
  emotion: string;
  note: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  const fetchEntries = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/api/entries');
      setEntries(response.data);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || 'Failed to load entries');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const handleEntryCreated = () => {
    fetchEntries();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <DashboardLayout
        user={user}
        entries={entries}
        isLoading={isLoading}
        error={error}
        onLogout={logout}
        onEntryCreated={handleEntryCreated}
      />
      <AudioControl />
    </>
  );
}
