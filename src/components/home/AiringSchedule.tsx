'use client';

import { useState, useEffect } from 'react';
import { getSchedule } from '@/services/anime';
import type { ScheduleData } from '@/types';
import Link from 'next/link';
import { Loader2, Calendar, Clock, ChevronRight, ChevronLeft } from 'lucide-react';
import { format, addDays, getDay, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';

type Day = 'SUN' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';
const DAY_MAP: Day[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export function AiringSchedule() {
    const [isClient, setIsClient] = useState(false);
    const [selectedDay, setSelectedDay] = useState<Day>(DAY_MAP[getDay(new Date())]);
    const [schedule, setSchedule] = useState<ScheduleData['scheduledAnimes']>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => { setIsClient(true); }, []);

    useEffect(() => {
        if (!isClient) return;
        async function fetchSchedule() {
            setIsLoading(true);
            const today = new Date();
            const dayIndex = DAY_MAP.indexOf(selectedDay);
            const currentDayIndex = getDay(today);
            const dayDiff = dayIndex - currentDayIndex;
            const targetDate = addDays(today, dayDiff);
            const dateString = format(targetDate, 'yyyy-MM-dd');
            try {
                const res = await getSchedule(dateString);
                setSchedule(res.data?.scheduledAnimes || []);
            } catch {
                setSchedule([]);
            } finally {
                setIsLoading(false);
            }
        }
        fetchSchedule();
    }, [selectedDay, isClient]);

    const handlePrevDay = () => {
        const currentIndex = DAY_MAP.indexOf(selectedDay);
        const nextIndex = (currentIndex - 1 + 7) % 7;
        setSelectedDay(DAY_MAP[nextIndex]);
    };

    const handleNextDay = () => {
        const currentIndex = DAY_MAP.indexOf(selectedDay);
        const nextIndex = (currentIndex + 1) % 7;
        setSelectedDay(DAY_MAP[nextIndex]);
    };

    return (
        <section className="bg-[#0B0C10] rounded-[32px] overflow-hidden border border-white/5 saas-shadow transition-all duration-500 hover:border-primary/20">
            {/* Header */}
            <div className="px-5 sm:px-8 py-4 sm:py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3 shrink-0">
                    <div className="w-1 h-5 sm:h-6 bg-primary rounded-full shadow-[0_0_15px_rgba(244,63,94,0.6)]" />
                    <h3 className="text-lg sm:text-xl font-[900] text-white uppercase tracking-tighter font-headline leading-none">Airing Schedule</h3>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-1">
                        <button 
                            onClick={handlePrevDay}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-90"
                        >
                            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <button 
                            onClick={handleNextDay}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all active:scale-90"
                        >
                            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                    </div>
                    <div className="hidden xs:flex items-center gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-white/5 border border-white/5">
                        <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary animate-pulse" />
                        <span className="text-[9px] sm:text-[10px] font-black text-white/40 uppercase tracking-widest tabular-nums">
                            {isClient && format(new Date(), 'HH:mm')}
                        </span>
                    </div>
                </div>
            </div>

            {/* Day Selector */}
            <div className="p-1 sm:p-2 bg-white/[0.01] border-b border-white/5">
                <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
                    {DAY_MAP.map((day) => {
                        const today = new Date();
                        const dayOfWeek = getDay(today);
                        const dayIndex = DAY_MAP.indexOf(day);
                        const date = addDays(today, dayIndex - dayOfWeek);
                        const isSelected = selectedDay === day;
                        const isToday = isSameDay(date, today);

                        return (
                            <button
                                key={day}
                                onClick={() => setSelectedDay(day)}
                                className={cn(
                                    "flex-1 min-w-[48px] xs:min-w-[54px] sm:min-w-[60px] py-3 sm:py-4 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center transition-all duration-500 relative group overflow-hidden shrink-0",
                                    isSelected ? "bg-primary text-black shadow-xl scale-105 z-10" : "text-white/20 hover:text-white/60 hover:bg-white/5"
                                )}
                            >
                                <span className={cn(
                                    "text-[8px] sm:text-[9px] font-black uppercase tracking-widest mb-0.5 sm:mb-1",
                                    isSelected ? "text-black" : "text-white/20"
                                )}>
                                    {day}
                                </span>
                                <span className="text-[14px] sm:text-[16px] font-black leading-none">
                                    {format(date, 'dd')}
                                </span>
                                {isToday && !isSelected && (
                                    <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-primary" />
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* List */}
            <div className="flex flex-col max-h-[400px] sm:max-h-[500px] overflow-y-auto custom-scrollbar bg-[#0B0C10]">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 sm:py-24 gap-4">
                        <div className="relative">
                            <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-primary" />
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                        </div>
                        <span className="text-white/20 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Loading Schedule</span>
                    </div>
                ) : (schedule && schedule.length > 0) ? (
                    schedule.map((anime, index) => {
                        return (
                            <Link
                                href={`/anime/${anime.id}`}
                                key={anime.id}
                                className="group flex items-center gap-4 sm:gap-6 px-5 sm:px-8 py-4 sm:py-5 hover:bg-white/[0.02] border-b border-white/5 last:border-0 transition-all duration-500"
                            >
                                <div className="flex flex-col items-center justify-center w-14 h-10 sm:w-16 sm:h-12 rounded-lg sm:rounded-xl bg-white/[0.03] border border-white/5 group-hover:border-primary/30 transition-colors shrink-0">
                                    <span className="text-white/80 text-[10px] sm:text-[11px] font-black tabular-nums group-hover:text-primary transition-colors">{anime.time}</span>
                                    <span className="text-[7px] sm:text-[8px] font-black text-white/20 uppercase tracking-widest mt-0.5">EST</span>
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] sm:text-[14px] font-black text-white/90 group-hover:text-primary truncate transition-all duration-500 uppercase tracking-tight leading-tight group-hover:translate-x-1">
                                        {anime.name}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1.5 sm:mt-2">
                                        <div className="w-1 h-1 rounded-full bg-white/10 group-hover:bg-primary/40 transition-colors" />
                                        <span className="text-[8px] sm:text-[9px] font-black text-white/20 uppercase tracking-widest group-hover:text-white/40">Release</span>
                                    </div>
                                </div>

                                <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0 hidden xs:block">
                                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                                </div>
                            </Link>
                        )
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 sm:py-24 text-center px-6 sm:px-8">
                        <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-white/5 mb-4" />
                        <p className="text-[12px] sm:text-[13px] font-black text-white/20 uppercase tracking-widest">No Episodes Scheduled</p>
                        <p className="text-[9px] sm:text-[10px] font-bold text-white/5 uppercase tracking-tighter mt-1">Check back later</p>
                    </div>
                )}
            </div>

        </section>
    );
}
