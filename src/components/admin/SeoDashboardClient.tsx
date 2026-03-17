'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Globe, RefreshCw, Code, BadgeCheck, Search, ShieldAlert, FileWarning, CheckCircle, SearchCode, Activity, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { SeoSettings } from '@/lib/settings';
import type { SeoHealth } from '@/types/admin';
import { saveSeoSettingsAction } from '@/actions/settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from "@/lib/utils";

interface SeoDashboardClientProps {
    initialSettings: SeoSettings;
    seoHealthData: SeoHealth[];
}

const GlobalSeoTab = ({ initialSettings }: { initialSettings: SeoSettings }) => {
    const { toast } = useToast();
    const [settings, setSettings] = useState<SeoSettings>(initialSettings);
    const [isPending, startTransition] = useTransition();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setSettings(prev => ({ ...prev, [id]: value }));
    }
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            try {
                await saveSeoSettingsAction(settings);
                toast({
                    title: "Settings Saved",
                    description: "Your global SEO settings have been updated.",
                });
            } catch (error) {
                 toast({
                    variant: 'destructive',
                    title: "Error",
                    description: "Failed to save settings.",
                });
            }
        });
    }
    
    return (
         <form className="space-y-10" onSubmit={handleSubmit}>
            <Card className="bg-white/[0.02] border border-white/5 rounded-[40px] saas-shadow overflow-hidden">
                <CardHeader className="p-8 border-b border-white/5">
                    <CardTitle className="text-xl font-black text-white uppercase tracking-tighter leading-none">Meta Configuration</CardTitle>
                    <CardDescription className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-2">Core search engine directives for all site pages</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                    <div className="space-y-3">
                        <Label htmlFor="metaTitleSuffix" className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Meta Title Suffix</Label>
                        <Input id="metaTitleSuffix" value={settings.metaTitleSuffix} onChange={handleInputChange} className="h-12 bg-white/5 border-white/5 rounded-2xl text-white focus:border-primary/50" />
                        <p className="text-[10px] italic text-white/20 font-medium ml-1">Appended to page titles. E.g., &quot;Home {settings.metaTitleSuffix}&quot;</p>
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="metaDescription" className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Global Meta Description</Label>
                        <Textarea id="metaDescription" value={settings.metaDescription} onChange={handleInputChange} className="min-h-[120px] bg-white/5 border-white/5 rounded-2xl text-white focus:border-primary/50 resize-none italic" />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white/[0.02] border border-white/5 rounded-[40px] saas-shadow overflow-hidden">
                <CardHeader className="p-8 border-b border-white/5">
                    <CardTitle className="text-xl font-black text-white uppercase tracking-tighter leading-none">Search Console Verification</CardTitle>
                    <CardDescription className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-2">Verify site ownership with search engines</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                     <Alert className="bg-primary/5 border-primary/20 rounded-2xl text-primary p-6">
                        <BadgeCheck className="h-5 w-5" />
                        <AlertTitle className="text-xs font-black uppercase tracking-widest mb-2">How it works</AlertTitle>
                        <AlertDescription className="text-xs font-medium italic opacity-70">
                            Pasting verification codes here will inject meta tags into the header, allowing search engines to verify your site.
                        </AlertDescription>
                    </Alert>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Label htmlFor="googleVerification" className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Google Search Console</Label>
                            <Input id="googleVerification" placeholder="Enter verification code..." value={settings.googleVerification} onChange={handleInputChange} className="h-12 bg-white/5 border-white/5 rounded-2xl text-white focus:border-primary/50" />
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="bingVerification" className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Bing Webmaster Tools</Label>
                            <Input id="bingVerification" placeholder="Enter verification code..." value={settings.bingVerification} onChange={handleInputChange} className="h-12 bg-white/5 border-white/5 rounded-2xl text-white focus:border-primary/50" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white/[0.02] border border-white/5 rounded-[40px] saas-shadow overflow-hidden">
                <CardHeader className="p-8 border-b border-white/5">
                    <CardTitle className="text-xl font-black text-white uppercase tracking-tighter leading-none">Schema Markup</CardTitle>
                    <CardDescription className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-2">JSON-LD data structures for search engine optimization</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                    <Textarea 
                        id="orgSchema"
                        value={settings.orgSchema}
                        onChange={handleInputChange}
                        rows={10}
                        className="font-mono text-[13px] bg-white/5 border-white/5 rounded-2xl text-primary/80 focus:border-primary/50"
                    />
                </CardContent>
            </Card>
            
            <div className="flex justify-end">
                <Button size="lg" type="submit" disabled={isPending} className="rounded-2xl bg-primary text-black font-black uppercase tracking-widest text-[11px] px-10 h-14 shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                    {isPending && <Loader2 className="mr-3 h-4 w-4 animate-spin" />}
                    Save SEO Settings
                </Button>
            </div>
        </form>
    );
}

const ContentSeoHealthTab = ({ seoHealthData }: { seoHealthData: SeoHealth[] }) => {
    
    const getStatusIcon = (status: SeoHealth['status']) => {
        switch (status) {
            case 'Good': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
            case 'Needs Improvement': return <FileWarning className="w-5 h-5 text-orange-500" />;
            case 'Poor': return <ShieldAlert className="w-5 h-5 text-red-500" />;
        }
    }
    
    return (
        <Card className="bg-white/[0.02] border border-white/5 rounded-[40px] saas-shadow overflow-hidden">
            <CardHeader className="p-8 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40">
                        <SearchCode className="w-6 h-6" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-black text-white uppercase tracking-tighter leading-none">SEO Health</CardTitle>
                        <CardDescription className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-2">Route health analysis and SEO optimization scores</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-8">
                <div className="rounded-[24px] border border-white/5 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-white/[0.02]">
                            <TableRow className="hover:bg-transparent border-white/5">
                                <TableHead className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14 pl-8">Page URL</TableHead>
                                <TableHead className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14">Optimization Score</TableHead>
                                <TableHead className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14">Status</TableHead>
                                <TableHead className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14">Detected Conflicts</TableHead>
                                <TableHead className="text-right text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14 pr-8">Actions</TableHead>
                            </TableRow></TableHeader>
                        <TableBody>
                            {seoHealthData.map(item => (
                                <TableRow key={item.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                                    <TableCell className="pl-8 py-5">
                                        <p className="font-black text-white text-[13px] uppercase tracking-tight truncate max-w-[250px]">{item.title}</p>
                                        <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-0.5">{item.type}</p>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <Progress value={item.seoScore} className="w-24 h-1.5 bg-white/5" />
                                            <span className="text-[11px] font-black text-white/60 tabular-nums">{item.seoScore}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            {getStatusIcon(item.status)}
                                            <span className={cn(
                                                "text-[10px] font-black uppercase tracking-widest",
                                                item.status === 'Good' ? "text-emerald-500" : item.status === 'Poor' ? "text-red-500" : "text-orange-500"
                                            )}>{item.status}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-2">
                                            {item.issues.map((issue, i) => (
                                                <Badge key={i} variant="outline" className="bg-red-500/5 text-red-400 border-red-500/10 font-black text-[8px] uppercase tracking-widest px-2 py-0.5">{issue}</Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <Button variant="ghost" className="h-9 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white font-black text-[9px] uppercase tracking-widest transition-all">Optimize</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}

const CrawlersTab = ({ initialSettings }: { initialSettings: SeoSettings }) => {
    const { toast } = useToast();
    const [settings, setSettings] = useState<SeoSettings>(initialSettings);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
             try {
                await saveSeoSettingsAction(settings);
                toast({ title: "Settings Saved", description: "Your crawler settings have been updated." });
            } catch (error) {
                 toast({ variant: 'destructive', title: "Error", description: "Failed to save settings." });
            }
        });
    }

    return (
         <form className="space-y-10" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-8">
                 <Card className="bg-white/[0.02] border border-white/5 rounded-[40px] saas-shadow overflow-hidden flex flex-col">
                    <CardHeader className="p-8 border-b border-white/5">
                        <CardTitle className="text-xl font-black text-white uppercase tracking-tighter leading-none">Sitemap Management</CardTitle>
                        <CardDescription className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-2">Manage XML map for search engine indexing</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8 flex-1">
                        <div className="space-y-3">
                            <Label htmlFor="sitemap-url" className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Sitemap URL</Label>
                            <Input id="sitemap-url" value="/sitemap.xml" readOnly className="h-12 bg-white/5 border-white/5 rounded-2xl text-white focus:border-primary/50 italic opacity-50" />
                        </div>
                        <Alert className="bg-blue-500/5 border-blue-500/20 rounded-2xl text-blue-400 p-6">
                            <Globe className="h-5 w-5" />
                            <AlertTitle className="text-xs font-black uppercase tracking-widest mb-2">Auto-Generation</AlertTitle>
                            <AlertDescription className="text-xs font-medium italic opacity-70">
                                Sitemap is automatically generated every 24 hours. Manual refresh available.
                            </AlertDescription>
                        </Alert>
                        <Button variant="outline" type="button" className="w-full h-14 rounded-2xl bg-white/5 border-white/5 hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-widest text-white/60">
                            <RefreshCw className="mr-3 h-4 w-4" />
                            Regenerate Sitemap
                        </Button>
                    </CardContent>
                </Card>
                 <Card className="bg-white/[0.02] border border-white/5 rounded-[40px] saas-shadow overflow-hidden">
                    <CardHeader className="p-8 border-b border-white/5">
                        <CardTitle className="text-xl font-black text-white uppercase tracking-tighter leading-none">Robots.txt Configuration</CardTitle>
                        <CardDescription className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-2">Direct permissions for search engines</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <Textarea 
                            id="robotsTxt"
                            value={settings.robotsTxt}
                            onChange={(e) => setSettings(prev => ({ ...prev, robotsTxt: e.target.value }))}
                            rows={10}
                            className="font-mono text-[13px] bg-white/5 border-white/5 rounded-2xl text-primary/80 focus:border-primary/50"
                        />
                    </CardContent>
                </Card>
            </div>
             <div className="flex justify-end">
                <Button size="lg" type="submit" disabled={isPending} className="rounded-2xl bg-primary text-black font-black uppercase tracking-widest text-[11px] px-10 h-14 shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                    {isPending && <Loader2 className="mr-3 h-4 w-4 animate-spin" />}
                    Save Settings
                </Button>
            </div>
        </form>
    );
}

export function SeoDashboardClient({ initialSettings, seoHealthData }: SeoDashboardClientProps) {
    return (
        <Tabs defaultValue="health" className="w-full space-y-10">
            <TabsList className="bg-white/5 border border-white/5 p-1 rounded-2xl h-14">
                <TabsTrigger value="health" className="rounded-xl px-10 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-primary data-[state=active]:text-black transition-all flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5" />
                    SEO Health
                </TabsTrigger>
                <TabsTrigger value="global" className="rounded-xl px-10 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-primary data-[state=active]:text-black transition-all flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5" />
                    Global SEO
                </TabsTrigger>
                <TabsTrigger value="crawlers" className="rounded-xl px-10 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-primary data-[state=active]:text-black transition-all flex items-center gap-2">
                    <Bot className="w-3.5 h-3.5" />
                    Crawlers
                </TabsTrigger>
            </TabsList>
            <TabsContent value="health" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ContentSeoHealthTab seoHealthData={seoHealthData} />
            </TabsContent>
            <TabsContent value="global" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <GlobalSeoTab initialSettings={initialSettings} />
            </TabsContent>
            <TabsContent value="crawlers" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <CrawlersTab initialSettings={initialSettings} />
            </TabsContent>
        </Tabs>
    );
}
