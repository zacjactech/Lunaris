'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { startOfMonth, startOfWeek, isAfter } from 'date-fns';
import { Entry } from '@/app/page';

interface DashboardStatsProps {
  entries: Entry[];
  isLoading: boolean;
}

export default function DashboardStats({ entries, isLoading }: DashboardStatsProps) {
  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const weekStart = startOfWeek(now);

    const thisMonth = entries.filter((e) => isAfter(new Date(e.createdAt), monthStart));
    const thisWeek = entries.filter((e) => isAfter(new Date(e.createdAt), weekStart));

    // Count emotions
    const emotionCounts: Record<string, number> = {};
    entries.forEach((entry) => {
      emotionCounts[entry.emotion] = (emotionCounts[entry.emotion] || 0) + 1;
    });

    const topEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0];

    return {
      thisMonth: thisMonth.length,
      thisWeek: thisWeek.length,
      total: entries.length,
      topEmotion: topEmotion ? topEmotion[0] : 'N/A',
      streak: calculateStreak(entries),
    };
  }, [entries]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 md:p-6 animate-pulse border border-white/50">
            <div className="h-4 bg-emerald-100/50 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-emerald-100/50 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      label: 'This Month',
      value: stats.thisMonth,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'This Week',
      value: stats.thisWeek,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      label: 'Top Emotion',
      value: stats.topEmotion,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Current Streak',
      value: `${stats.streak} days`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        </svg>
      ),
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
      {statCards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white/90 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow border border-white/50"
        >
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className={`p-2 md:p-3 rounded-lg ${card.bgColor}`}>
              <div className={card.iconColor}>{card.icon}</div>
            </div>
          </div>
          <p className="text-xs md:text-sm text-gray-600 mb-1">{card.label}</p>
          <p className="text-lg md:text-2xl font-semibold text-foreground truncate">{card.value}</p>
        </motion.div>
      ))}
    </div>
  );
}

function calculateStreak(entries: Entry[]): number {
  if (entries.length === 0) return 0;

  const sortedDates = entries
    .map((e) => new Date(e.createdAt).toDateString())
    .filter((date, index, self) => self.indexOf(date) === index)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let streak = 0;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
    return 0;
  }

  let currentDate = new Date();
  for (const dateStr of sortedDates) {
    const entryDate = new Date(dateStr);
    const diffDays = Math.floor(
      (currentDate.getTime() - entryDate.getTime()) / 86400000
    );

    if (diffDays <= 1) {
      streak++;
      currentDate = entryDate;
    } else {
      break;
    }
  }

  return streak;
}
