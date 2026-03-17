'use client';

import { useState, useEffect } from 'react';
import { getEpisodeSources } from '@/services/anime';
import { 
    Download, AlertCircle, ArrowLeft, Loader2, HardDrive, 
    MessageCircle, Sparkles, CheckCircle2, ShieldCheck, 
    Zap, Languages, Activity, Info, FileVideo, FileText,
    Settings2, Server, Gauge, MousePointer2, ShieldAlert
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { EpisodeServersData } from '@/types';

interface DownloadClientProps {
  epId: string;
  rawEpId: string;
  animeId: string;
  animeName: string;
  poster: string;
  epNumber: number;
  epTitle: string;
  durationStr: string;
  category: string;
  availableServers: EpisodeServersData | null;
}

interface QualityOption {
  quality: string;
  bandwidth: number;
  sizeBytes: number;
  url: string;
  referer: string;
  serverName: string;
}

interface SubtitleTrack {
  lang: string;
  url: string;
  default?: boolean;
}

interface CategoryData {
    qualities: QualityOption[];
    subtitles: SubtitleTrack[];
    loading: boolean;
    error: string;
    serverUsed: string;
}

export function DownloadClient({ epId, rawEpId, animeId, animeName, poster, epNumber, epTitle, durationStr, category, availableServers }: DownloadClientProps) {
  const [data, setData] = useState<Record<string, CategoryData>>({
      sub: { qualities: [], subtitles: [], loading: false, error: '', serverUsed: '' },
      dub: { qualities: [], subtitles: [], loading: false, error: '', serverUsed: '' },
      raw: { qualities: [], subtitles: [], loading: false, error: '', serverUsed: '' }
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let isMounted = true;
    
    async function fetchCategory(cat: string) {
        let servers = availableServers?.[cat as keyof EpisodeServersData];
        
        // Fallback Defaults
        if (!Array.isArray(servers) || servers.length === 0) {
            servers = [
                { serverName: 'hd-2' } as any,
                { serverName: 'megacloud' } as any,
                { serverName: 'hd-1' } as any,
                { serverName: 'streamsb' } as any
            ];
        }
        
        setData(prev => ({ ...prev, [cat]: { ...prev[cat], loading: true, error: '' } }));
        
        try {
            let res: any = null;
            let usedServer = '';
            const idCandidates = [epId, rawEpId].filter((v, i, a) => v && a.indexOf(v) === i);

            outerLoop: for (const id of idCandidates) {
                for (const srv of servers as any[]) {
                    try {
                        const candidateRes = await getEpisodeSources(id, srv.serverName, cat);
                        if (candidateRes.data && candidateRes.data.sources?.length) {
                            res = candidateRes;
                            usedServer = srv.serverName;
                            break outerLoop;
                        }
                    } catch (e) { continue; }
                }
            }

            if (!res || !res.data || !res.data.sources?.length) throw new Error("Sources unavailable for this version.");

            const sourceData = res.data;
            const subTracks = (sourceData.tracks || sourceData.subtitles || [])
                .filter((t: any) => t.lang !== "thumbnails" && t.url)
                .map((t: any) => ({ lang: t.lang || 'English', url: t.url, default: t.default }));

            const mainSource = sourceData.sources[0];
            let options: QualityOption[] = [];

            if (!mainSource.isM3U8) {
                options = [{ quality: 'Original', bandwidth: 0, sizeBytes: 0, url: mainSource.url, referer: sourceData.headers?.Referer || '', serverName: usedServer }];
            } else {
                const m3u8Res = await fetch(`/api/proxy?url=${encodeURIComponent(mainSource.url)}&referer=${encodeURIComponent(sourceData.headers?.Referer || 'https://hianime.to/')}`);
                if (m3u8Res.ok) {
                    const m3u8Text = await m3u8Res.text();
                    let durationSec = 24 * 60;
                    const durationMatch = durationStr.match(/(\d+)m/);
                    if (durationMatch) durationSec = parseInt(durationMatch[1], 10) * 60;

                    const lines = m3u8Text.split(/\r?\n/);
                    for (let i = 0; i < lines.length; i++) {
                        const line = lines[i];
                        if (line.startsWith('#EXT-X-STREAM-INF')) {
                            const bwMatch = line.match(/BANDWIDTH=(\d+)/);
                            const resMatch = line.match(/RESOLUTION=\d+x(\d+)/);
                            if (bwMatch && resMatch) {
                                const bandwidth = parseInt(bwMatch[1], 10);
                                options.push({ 
                                    quality: resMatch[1], 
                                    bandwidth, 
                                    sizeBytes: (bandwidth / 8) * durationSec, 
                                    url: mainSource.url,
                                    referer: sourceData.headers?.Referer || '',
                                    serverName: usedServer
                                });
                            }
                        }
                    }
                }
            }

            options.sort((a, b) => (parseInt(b.quality) || 0) - (parseInt(a.quality) || 0));
            if (options.length === 0) options.push({ quality: 'Original', bandwidth: 0, sizeBytes: 0, url: mainSource.url, referer: sourceData.headers?.Referer || '', serverName: usedServer });

            if (isMounted) {
                setData(prev => ({
                    ...prev,
                    [cat]: { qualities: options, subtitles: subTracks, loading: false, error: '', serverUsed: usedServer }
                }));
            }
        } catch (err: any) {
            if (isMounted) {
                setData(prev => ({
                    ...prev,
                    [cat]: { ...prev[cat], loading: false, error: err.message }
                }));
            }
        }
    }

    const categoriesToFetch = ['sub', 'dub', 'raw'];
    categoriesToFetch.forEach(fetchCategory);

    return () => { isMounted = false; };
  }, [epId, rawEpId, durationStr, availableServers]);

  const formatSize = (bytes: number) => {
      if (bytes === 0) return 'Variable';
      const mb = bytes / (1024 * 1024);
      if (mb > 1024) return (mb / 1024).toFixed(2) + ' GB';
      return mb.toFixed(1) + ' MB';
  };

  const handleDownload = (q: QualityOption, cat: string) => {
      const qVal = parseInt(q.quality) ? q.quality : '';
      const downloadUrl = `/api/download?url=${encodeURIComponent(q.url)}&name=${encodeURIComponent(`${animeName} Ep ${epNumber} [${cat.toUpperCase()}]`)}&referer=${encodeURIComponent(q.referer)}${qVal ? `&quality=${qVal}` : ''}`;
      window.location.href = downloadUrl;
  };

  const handleSubtitleDownload = (s: SubtitleTrack, referer: string) => {
    const subtitleUrl = `/api/subtitle?url=${encodeURIComponent(s.url)}&lang=${encodeURIComponent(s.lang)}&name=${encodeURIComponent(`${animeName}-Ep-${epNumber}`)}&referer=${encodeURIComponent(referer)}`;
    window.location.href = subtitleUrl;
  };

  const activeCategories = ['sub', 'dub', 'raw'].filter(cat => data[cat].qualities.length > 0 || data[cat].loading);
  const activeSidebarData = data[activeCategories[0] || 'sub'];

  return (
    <div className="min-h-screen bg-[#06070a] flex flex-col p-4 md:p-8 lg:p-12 relative overflow-hidden selection:bg-primary selection:text-black">
        {/* Cinematic Backdrop */}
        <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay z-10" />
            <div className="absolute inset-0 z-0 opacity-20">
                <Image src={poster} alt="Backdrop" fill className="object-cover blur-[140px] scale-150 rotate-6" priority />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#06070a]/40 via-[#06070a]/90 to-[#06070a]" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto space-y-8 md:space-y-12">
            {/* Header Navigation */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <Link href={`/watch/${animeId}?ep=${epId}&category=${category}`}>
                    <Button variant="ghost" className="h-11 md:h-12 px-5 md:px-6 rounded-[18px] md:rounded-[20px] bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all uppercase tracking-[0.2em] text-[9px] md:text-[10px] font-black group border border-white/5">
                        <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-1 transition-transform" />
                        Return to Player
                    </Button>
                </Link>
                <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6">
                    <div className="hidden sm:flex items-center gap-4 text-white/20">
                        <div className="h-px w-8 md:w-12 bg-white/10" />
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] italic">Download Hub</span>
                        <div className="h-px w-8 md:w-12 bg-white/10" />
                    </div>
                    <div className="bg-primary/10 border border-primary/20 px-4 md:px-5 py-2 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-3">
                        <Activity className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary animate-pulse" />
                        <span className="text-primary text-[9px] md:text-[10px] font-black uppercase tracking-widest italic">Connection Stable</span>
                    </div>
                </div>
            </motion.div>

            {/* Anime Title Display */}
            <div className="space-y-4 md:space-y-6 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3">
                    <Badge className="bg-primary text-black text-[8px] md:text-[9px] font-black px-3 md:px-4 py-1 rounded-full uppercase tracking-[0.2em]">Episode {epNumber}</Badge>
                    <Badge variant="outline" className="bg-white/5 border-white/10 text-white/40 text-[8px] md:text-[9px] font-black px-3 md:px-4 py-1 rounded-full uppercase tracking-widest italic">{durationStr} Playback</Badge>
                </div>
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-[1000] text-white uppercase tracking-tighter italic leading-[0.9] drop-shadow-2xl">{animeName}</h1>
                <p className="text-white/30 text-sm md:text-lg lg:text-xl font-bold italic border-l-2 border-primary/20 pl-4 md:pl-8 max-w-3xl mx-auto md:mx-0">{epTitle}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_350px] gap-8 md:gap-10">
                {/* ─── UNIFIED VERSION GRID ─── */}
                <div className="space-y-8 md:space-y-12">
                    {['sub', 'dub', 'raw'].map((cat) => {
                        const catData = data[cat];
                        if (catData.qualities.length === 0 && !catData.loading) return null;

                        return (
                            <motion.div 
                                key={cat} 
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6 md:space-y-8"
                            >
                                <div className="flex items-center justify-between border-b border-white/5 pb-4 md:pb-6">
                                    <div className="flex items-center gap-4 md:gap-5">
                                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-[20px] md:rounded-3xl bg-white/5 flex items-center justify-center border border-white/10 shadow-2xl shrink-0">
                                            {cat === 'dub' ? <Languages className="w-6 h-6 md:w-7 md:h-7 text-primary" /> : <MessageCircle className="w-6 h-6 md:w-7 md:h-7 text-primary" />}
                                        </div>
                                        <div className="text-left space-y-0.5 md:space-y-1">
                                            <h2 className="text-white font-[1000] uppercase tracking-[0.2em] md:tracking-[0.3em] text-base md:text-lg italic leading-none">{cat === 'sub' ? 'Subtitled' : cat === 'dub' ? 'Dubbed' : 'Raw'}</h2>
                                            <p className="text-white/20 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] italic">Status: {catData.loading ? 'Scanning...' : 'Available'}</p>
                                        </div>
                                    </div>
                                    {!catData.loading && (
                                        <div className="hidden sm:flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                                            <Server className="w-3.5 h-3.5 text-white/20" />
                                            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{catData.serverUsed.toUpperCase()} CDN</span>
                                        </div>
                                    )}
                                </div>

                                {catData.loading ? (
                                    <div className="bg-white/[0.02] border border-white/5 rounded-[32px] md:rounded-[40px] p-12 md:p-16 flex flex-col items-center gap-4 md:gap-6">
                                        <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-primary animate-spin" />
                                        <p className="text-white/20 text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] animate-pulse italic text-center">Connecting to download provider...</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                        {catData.qualities.map((q, i) => (
                                            <motion.button
                                                key={`vid-${cat}-${i}`}
                                                whileHover={{ scale: 1.01, translateY: -2 }}
                                                onClick={() => handleDownload(q, cat)}
                                                className="group relative flex items-center justify-between p-5 md:p-8 rounded-[28px] md:rounded-[36px] bg-white/[0.03] border border-white/5 hover:border-primary/40 hover:bg-primary/[0.02] transition-all duration-500 text-left overflow-hidden shadow-2xl"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                                
                                                <div className="flex items-center gap-4 md:gap-8 relative z-10">
                                                    <div className={cn(
                                                        "w-14 h-14 md:w-20 md:h-20 rounded-[20px] md:rounded-[28px] flex flex-col items-center justify-center transition-all duration-500 border shrink-0",
                                                        parseInt(q.quality) >= 720 ? "bg-primary text-black border-primary shadow-[0_0_20px_rgba(147,51,234,0.3)]" : "bg-white/5 text-white/40 border-white/10 group-hover:bg-white/10"
                                                    )}>
                                                        <span className="text-base md:text-2xl font-[1000] tracking-tighter leading-none">{q.quality === 'Original' ? 'MAX' : `${q.quality}p`}</span>
                                                        <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest mt-0.5 md:mt-1 opacity-60">{parseInt(q.quality) >= 720 ? 'HD' : 'SD'}</span>
                                                    </div>
                                                    <div className="space-y-1 md:space-y-2 min-w-0">
                                                        <h4 className="text-white font-black uppercase tracking-widest text-sm md:text-2xl italic group-hover:text-primary transition-colors leading-none truncate">
                                                            {q.quality === 'Original' ? 'Highest Quality' : `${q.quality}p Video`}
                                                        </h4>
                                                        <div className="flex items-center gap-2 md:gap-4 text-white/20 overflow-hidden">
                                                            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 md:gap-2 italic shrink-0">
                                                                <ShieldCheck className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary/40" />
                                                                MP4
                                                            </span>
                                                            <div className="w-1 h-1 rounded-full bg-white/10 shrink-0" />
                                                            <span className="text-white font-black text-[9px] md:text-sm tabular-nums tracking-tighter shrink-0">
                                                                {formatSize(q.sizeBytes)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-[18px] md:rounded-[24px] bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-black group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 border border-white/5 group-hover:border-primary relative z-10 shadow-2xl shrink-0">
                                                    <Download className="w-5 h-5 md:w-7 md:h-7" />
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                )}

                                {/* Subtitles per version */}
                                {catData.subtitles.length > 0 && cat === 'sub' && (
                                    <div className="space-y-4 md:space-y-6 pt-2">
                                        <div className="flex items-center gap-3 md:gap-4 border-b border-white/5 pb-4 md:pb-6">
                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-[16px] md:rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 shrink-0">
                                                <FileText className="w-5 h-5 md:w-6 md:h-6 text-white/40" />
                                            </div>
                                            <div className="text-left">
                                                <h3 className="text-white font-[1000] uppercase tracking-[0.2em] md:tracking-[0.3em] text-[11px] md:text-[13px] italic leading-none mb-1">Available Subtitles</h3>
                                                <p className="text-white/20 text-[8px] md:text-[9px] font-black uppercase tracking-widest italic">SRT Format</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
                                            {catData.subtitles.map((s, i) => (
                                                <button
                                                    key={`sub-${i}`}
                                                    onClick={() => handleSubtitleDownload(s, catData.qualities[0]?.referer || '')}
                                                    className="group flex items-center justify-center gap-2 md:gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/[0.01] border border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white"
                                                >
                                                    <FileText className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                                    <span className="truncate">{s.lang}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* ─── SIDEBAR ─── */}
                <aside className="space-y-6 md:space-y-8">
                    <div className="bg-[#12131a] rounded-[32px] md:rounded-[48px] border border-white/5 p-6 md:p-8 space-y-8 md:space-y-10 shadow-3xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                        
                        <div className="space-y-6 md:space-y-8">
                            <div className="flex items-center gap-3 md:gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-[16px] md:rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                                    <Gauge className="w-5 h-5 md:w-6 md:h-6 text-white/40" />
                                </div>
                                <h3 className="text-[13px] md:text-base font-black uppercase tracking-widest text-white/80 italic">Technical Details</h3>
                            </div>

                            <div className="space-y-3 md:space-y-4">
                                {[
                                    { label: 'Latency', value: '14ms', icon: Activity },
                                    { label: 'Security', value: 'SSL AES-256', icon: ShieldCheck },
                                    { label: 'Speed', value: 'Optimized', icon: Zap },
                                    { label: 'Provider', value: activeSidebarData.serverUsed.toUpperCase() || 'Scanning...', icon: Server }
                                ].map((stat, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 md:p-5 rounded-2xl md:rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
                                        <div className="flex items-center gap-3 md:gap-4">
                                            <stat.icon className="w-3 h-3 md:w-4 md:h-4 text-white/20" />
                                            <span className="text-[8px] md:text-[10px] font-black text-white/30 uppercase tracking-widest">{stat.label}</span>
                                        </div>
                                        <span className="text-[8px] md:text-[10px] font-black text-white/60 uppercase tracking-widest italic">{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-primary/5 border border-primary/10 p-6 md:p-8 rounded-[28px] md:rounded-[40px] space-y-3 md:space-y-4 relative overflow-hidden">
                            <div className="flex items-start gap-4 md:gap-5">
                                <Info className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0 mt-0.5 md:mt-1" />
                                <div className="space-y-1 md:space-y-2">
                                    <h4 className="text-[9px] md:text-[11px] font-black text-primary uppercase tracking-[0.3em] italic">Usage Note</h4>
                                    <p className="text-white/30 text-[10px] md:text-[12px] font-bold leading-relaxed italic">
                                        For best performance, use <span className="text-white/50">VLC Player</span> for playback.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 md:p-8 rounded-[28px] md:rounded-[40px] bg-white/[0.02] border border-white/5 space-y-3 md:space-y-4 text-center group/speed cursor-pointer hover:bg-white/[0.04] transition-all">
                            <MousePointer2 className="w-5 h-5 md:w-6 md:h-6 text-white/10 mx-auto group-hover/speed:text-primary group-hover/speed:scale-110 transition-all" />
                            <div className="space-y-0.5 md:space-y-1">
                                <p className="text-white/20 text-[8px] md:text-[10px] font-black uppercase tracking-widest">Connection Status</p>
                                <p className="text-white font-black uppercase tracking-tighter text-base md:text-2xl italic leading-none">Tunnel Stable</p>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 md:px-10 text-center space-y-4 md:space-y-6 pb-8 md:pb-0">
                        <div className="flex items-center justify-center gap-4 md:gap-6 opacity-20">
                            <div className="h-px w-full bg-white" />
                            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white shrink-0" />
                            <div className="h-px w-full bg-white" />
                        </div>
                        <p className="text-[8px] md:text-[10px] font-black text-white/10 uppercase tracking-[0.6em] md:tracking-[0.8em] italic leading-loose">
                            Fast & Secure Downloads
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    </div>
  );
}
