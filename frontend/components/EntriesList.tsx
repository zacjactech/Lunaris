'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import axiosInstance from '@/lib/axios';

interface Entry {
  id: string;
  emotion: string;
  note: string;
  createdAt: string;
}

interface EntriesListProps {
  entries: Entry[];
  isLoading: boolean;
  onEntryDeleted?: () => void;
  onEntryUpdated?: () => void;
}

const emotionColors: Record<string, string> = {
  Peaceful: 'bg-blue-100 text-blue-700 border-blue-200',
  Grateful: 'bg-green-100 text-green-700 border-green-200',
  Hopeful: 'bg-teal-100 text-teal-700 border-teal-200',
  Joyful: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Anxious: 'bg-orange-100 text-orange-700 border-orange-200',
  Sad: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  Frustrated: 'bg-red-100 text-red-700 border-red-200',
  Overwhelmed: 'bg-purple-100 text-purple-700 border-purple-200',
  Neutral: 'bg-gray-100 text-gray-700 border-gray-200',
  Reflective: 'bg-pink-100 text-pink-700 border-pink-200',
};

export default function EntriesList({
  entries,
  isLoading,
  onEntryDeleted,
  onEntryUpdated,
}: EntriesListProps) {
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleDelete = async () => {
    if (!selectedEntry || !confirm('Are you sure you want to delete this entry?')) return;

    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/api/entries/${selectedEntry.id}`);
      setSelectedEntry(null);
      if (onEntryDeleted) onEntryDeleted();
    } catch (error) {
      console.error('Failed to delete entry:', error);
      alert('Failed to delete entry. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async () => {
    if (!selectedEntry || !editedNote.trim()) return;

    setIsSaving(true);
    try {
      await axiosInstance.put(`/api/entries/${selectedEntry.id}`, {
        note: editedNote.trim(),
      });
      setIsEditing(false);
      setSelectedEntry(null);
      if (onEntryUpdated) onEntryUpdated();
    } catch (error) {
      console.error('Failed to update entry:', error);
      alert('Failed to update entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full text-center py-16 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50"
      >
        <svg
          className="w-16 h-16 text-gray-300 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-lg text-gray-500">No entries yet — take a moment to reflect.</p>
      </motion.div>
    );
  }

  return (
    <>
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3">
        {entries.map((entry, index) => (
          <motion.button
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.05,
              ease: 'easeOut',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedEntry(entry)}
            className="bg-white/90 backdrop-blur-sm rounded-lg md:rounded-xl shadow-sm p-3 md:p-4 hover:shadow-md transition-all border border-white/50 aspect-square flex flex-col text-left cursor-pointer"
          >
            <span
              className={`px-1.5 md:px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium border w-fit mb-2 md:mb-3 ${
                emotionColors[entry.emotion] || 'bg-gray-100 text-gray-800 border-gray-200'
              }`}
            >
              {entry.emotion}
            </span>

            <p className="text-foreground text-[10px] md:text-xs leading-relaxed flex-1 overflow-hidden line-clamp-3 md:line-clamp-4">
              {entry.note}
            </p>

            <span className="text-[9px] md:text-xs text-gray-400 mt-1 md:mt-2 truncate">
              {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {selectedEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEntry(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/95 backdrop-blur-md rounded-xl md:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] md:max-h-[80vh] overflow-hidden mx-4 border border-white/50"
            >
              <div className="p-4 md:p-6 border-b border-emerald-100/30 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${
                      emotionColors[selectedEntry.emotion] ||
                      'bg-gray-100 text-gray-800 border-gray-200'
                    }`}
                  >
                    {selectedEntry.emotion}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(selectedEntry.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {!isEditing && (
                    <>
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setEditedNote(selectedEntry.note);
                        }}
                        className="p-2 hover:bg-blue-50/80 text-accent rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="p-2 hover:bg-red-50/80 text-red-600 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => {
                      setSelectedEntry(null);
                      setIsEditing(false);
                    }}
                    className="p-2 hover:bg-gray-100/80 rounded-full transition-colors"
                  >
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-180px)] md:max-h-[calc(80vh-180px)]">
                {isEditing ? (
                  <div className="space-y-3 md:space-y-4">
                    <textarea
                      value={editedNote}
                      onChange={(e) => setEditedNote(e.target.value)}
                      className="w-full px-3 md:px-4 py-2 md:py-3 border border-emerald-100/50 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all resize-none bg-white/80 min-h-[150px] md:min-h-[200px] text-sm md:text-base"
                      placeholder="Edit your reflection..."
                    />
                    <div className="flex gap-2 md:gap-3">
                      <button
                        onClick={handleSave}
                        disabled={isSaving || !editedNote.trim()}
                        className="flex-1 bg-gradient-to-r from-accent to-indigo-500 text-white px-3 md:px-4 py-2 rounded-lg hover:shadow-md transition-all disabled:opacity-50 text-sm md:text-base"
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        disabled={isSaving}
                        className="px-3 md:px-4 py-2 border border-gray-300/50 rounded-lg hover:bg-gray-50/80 transition-colors text-sm md:text-base"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-foreground whitespace-pre-wrap break-words leading-relaxed text-sm md:text-base">
                    {selectedEntry.note}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
