'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '@/lib/axios';

const EMOTIONS = [
  'Peaceful',
  'Grateful',
  'Hopeful',
  'Joyful',
  'Anxious',
  'Sad',
  'Frustrated',
  'Overwhelmed',
  'Neutral',
  'Reflective',
];

interface EmotionFormProps {
  onEntryCreated?: () => void;
}

export default function EmotionForm({ onEntryCreated }: EmotionFormProps) {
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedEmotion || !note.trim()) {
      setError('Please select an emotion and write a note');
      return;
    }

    setIsLoading(true);

    try {
      await axiosInstance.post('/api/entries', {
        emotion: selectedEmotion,
        note: note.trim(),
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

      // Clear form
      setSelectedEmotion('');
      setNote('');

      // Notify parent
      if (onEntryCreated) {
        onEntryCreated();
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || 'Failed to create entry');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="w-full bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-8 space-y-6 border border-white/50"
    >
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          How are you feeling?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {EMOTIONS.map((emotion) => (
            <motion.button
              key={emotion}
              type="button"
              onClick={() => setSelectedEmotion(emotion)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-4 py-3 rounded-xl font-medium transition-all ${
                selectedEmotion === emotion
                  ? 'bg-gradient-to-br from-accent to-indigo-500 text-white shadow-md'
                  : 'bg-white/80 text-foreground hover:bg-white border border-emerald-100/50'
              }`}
              disabled={isLoading}
            >
              {emotion}
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="note" className="block text-sm font-medium text-foreground mb-2">
          What&apos;s on your mind?
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="How are you feeling?"
          rows={4}
          maxLength={5000}
          className="w-full px-4 py-3 border border-emerald-100/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all resize-none bg-white/80"
          disabled={isLoading}
          required
        />
        <p className="mt-1 text-sm text-gray-500">{note.length}/5000 characters</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 bg-emerald-50/80 backdrop-blur-sm border border-emerald-200/50 rounded-lg"
        >
          <p className="text-sm text-emerald-600">Entry created successfully!</p>
        </motion.div>
      )}

      <button
        type="submit"
        disabled={isLoading || !selectedEmotion || !note.trim()}
        className="w-full bg-gradient-to-r from-accent via-indigo-500 to-muted text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Saving...' : 'Save Reflection'}
      </button>
    </motion.form>
  );
}
