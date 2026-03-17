'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useKeyPress } from '@/hooks/useKeyPress';

const statusSchema = z.object({
  status: z.enum(['WATCHING', 'COMPLETED', 'DROPPED', 'PLANNING', 'PAUSED']),
  progress: z.number().min(0),
  score: z.number().min(0).max(10),
  notes: z.string().optional(),
  rewatches: z.number().min(0).default(0),
  language: z.enum(['SUB', 'DUB', 'BOTH']).default('SUB'),
});

type StatusFormValues = z.infer<typeof statusSchema>;

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  animeId: number;
  animeTitle: string;
  totalEpisodes?: number;
  initialData?: Partial<StatusFormValues>;
  onSave: (data: StatusFormValues) => Promise<void>;
}

export function StatusModal({ isOpen, onClose, animeId, animeTitle, totalEpisodes, initialData, onSave }: StatusModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<StatusFormValues>({
    resolver: zodResolver(statusSchema) as any,
    defaultValues: {
      status: initialData?.status || 'PLANNING',
      progress: initialData?.progress || 0,
      score: initialData?.score || 0,
      notes: initialData?.notes || '',
      rewatches: initialData?.rewatches || 0,
      language: initialData?.language || 'SUB',
    }
  });

  useScrollLock(isOpen);
  useKeyPress('Escape', onClose);

  if (!isOpen) return null;

  const onSubmit = async (data: StatusFormValues) => {
    setIsSubmitting(true);
    try {
      await onSave(data);
      onClose();
    } catch (error) {
      console.error("Failed to save status", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-[#161616] p-6 sm:p-8 shadow-2xl border border-[#2A2A2A] z-10"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 id="modal-title" className="text-xl sm:text-2xl font-black font-heading text-white">Edit Entry</h2>
              <button onClick={onClose} className="rounded-full p-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-[#212121] text-zinc-400 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="mb-8 text-sm text-zinc-400">Updating: <strong className="text-anime-primary">{animeTitle}</strong></p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Status</label>
                  <select {...register('status')} className="w-full rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] p-3.5 min-h-[44px] text-sm text-white focus:border-anime-primary outline-none transition-all">
                    <option value="WATCHING">Watching</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="PAUSED">Paused</option>
                    <option value="DROPPED">Dropped</option>
                    <option value="PLANNING">Planning</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Language</label>
                  <select {...register('language')} className="w-full rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] p-3.5 min-h-[44px] text-sm text-white focus:border-anime-primary outline-none transition-all">
                    <option value="SUB">Subbed</option>
                    <option value="DUB">Dubbed</option>
                    <option value="BOTH">Both</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
                    Progress {totalEpisodes ? `(/ ${totalEpisodes})` : ''}
                  </label>
                  <input 
                    type="number" 
                    min="0"
                    {...register('progress', { valueAsNumber: true })} 
                    className="w-full rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] p-3.5 min-h-[44px] text-sm text-white focus:border-anime-primary outline-none transition-all"
                  />
                  {errors.progress && <p className="text-red-400 text-[10px] mt-1 ml-1">{errors.progress.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Score (0-10)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    min="0"
                    max="10"
                    {...register('score', { valueAsNumber: true })} 
                    className="w-full rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] p-3.5 min-h-[44px] text-sm text-white focus:border-anime-primary outline-none transition-all"
                  />
                  {errors.score && <p className="text-red-400 text-[10px] mt-1 ml-1">{errors.score.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Notes</label>
                <textarea 
                  {...register('notes')} 
                  rows={3}
                  className="w-full rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] p-3.5 min-h-[80px] text-sm text-white focus:border-anime-primary outline-none transition-all resize-none"
                  placeholder="Your thoughts..."
                />
              </div>

              <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pb-8 sm:pb-0">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 min-h-[44px] text-sm font-bold text-zinc-400 hover:text-white transition-colors border border-[#2A2A2A] sm:border-transparent rounded-2xl sm:rounded-none"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full sm:w-auto rounded-2xl bg-anime-primary px-8 py-3.5 min-h-[44px] text-sm font-black uppercase tracking-widest text-white hover:bg-anime-secondary transition-all disabled:opacity-50 shadow-lg shadow-anime-primary/20"
                >
                  {isSubmitting ? 'Syncing...' : 'Save Entry'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
