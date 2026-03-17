'use client';

import React, { useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Trash2, PlusCircle, MoreHorizontal, Pencil, Settings2, Palette, Megaphone, Share2, Globe, Link2, Coins } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
    saveSiteConfigAction, 
    saveNavLink, 
    deleteNavLink, 
    saveCryptoDonationAction,
    deleteCryptoDonationAction,
    type ActionResponse 
} from '@/actions/siteConfig';
import type { SiteConfig } from '@/lib/site-config';
import { hslStringToHex } from '@/lib/colors';
import type { CryptoDonation } from '@/types/site';
import type { NavLink as DbNavLink } from '@/types/db';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";


interface SitePageClientProps {
    initialConfig: SiteConfig;
    initialNavLinks: DbNavLink[];
    initialSocialLinks: DbNavLink[];
}

function MainSubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button size="lg" type="submit" disabled={pending} className="rounded-2xl bg-primary text-black font-black uppercase tracking-widest text-[11px] px-10 h-14 shadow-xl shadow-primary/20 hover:scale-105 transition-all">
            {pending && <Loader2 className="mr-3 h-4 w-4 animate-spin" />}
            Save Site Changes
        </Button>
    )
}

function LinkSubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="rounded-xl bg-primary text-black font-black uppercase tracking-widest text-[10px] h-11">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Link
        </Button>
    )
}

function DonationSubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="rounded-xl bg-primary text-black font-black uppercase tracking-widest text-[10px] h-11">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Address
        </Button>
    )
}


export function SitePageClient({ initialConfig, initialNavLinks, initialSocialLinks }: SitePageClientProps) {
    const { toast } = useToast();
    
    const [mainFormState, mainFormAction] = useActionState<ActionResponse, FormData>(saveSiteConfigAction, null);
    const [announcementEnabled, setAnnouncementEnabled] = useState(initialConfig.announcement.enabled);
    
    const [linkFormState, linkFormAction] = useActionState<ActionResponse, FormData>(saveNavLink, null);
    const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
    const [editingLink, setEditingLink] = useState<Partial<DbNavLink> | null>(null);

    const [donationFormState, donationFormAction] = useActionState<ActionResponse, FormData>(saveCryptoDonationAction, null);
    const [isDonationDialogOpen, setIsDonationDialogOpen] = useState(false);
    const [editingDonation, setEditingDonation] = useState<Partial<CryptoDonation> | null>(null);

    React.useEffect(() => {
        if (!mainFormState) return;
        if (mainFormState.success) {
            toast({ title: "Success", description: mainFormState.message });
        } else if (mainFormState.error) {
            toast({ variant: 'destructive', title: "Error", description: mainFormState.error });
        }
    }, [mainFormState, toast]);

    React.useEffect(() => {
        if (!linkFormState) return;
        if (linkFormState.success) {
            toast({ title: "Success", description: linkFormState.message });
            setIsLinkDialogOpen(false);
            setEditingLink(null);
        } else if (linkFormState.error) {
            toast({ variant: 'destructive', title: "Error", description: linkFormState.error });
        }
    }, [linkFormState, toast]);

    React.useEffect(() => {
        if (!donationFormState) return;
        if (donationFormState.success) {
            toast({ title: "Success", description: donationFormState.message });
            setIsDonationDialogOpen(false);
            setEditingDonation(null);
        } else if (donationFormState.error) {
            toast({ variant: 'destructive', title: "Error", description: donationFormState.error });
        }
    }, [donationFormState, toast]);
    
    const handleOpenLinkDialog = (link: Partial<DbNavLink> | null, location: 'HEADER' | 'FOOTER_SOCIAL') => {
        setEditingLink(link ? link : { location });
        setIsLinkDialogOpen(true);
    };

    const handleDeleteLink = async (id: number, location: 'HEADER' | 'FOOTER_SOCIAL') => {
        if (!confirm('Are you sure you want to delete this link?')) return;
        const result = await deleteNavLink(id, location);
        if (result.success) {
            toast({ title: "Success", description: result.message });
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
    }

    const handleOpenDonationDialog = (donation: Partial<CryptoDonation> | null) => {
        setEditingDonation(donation || {});
        setIsDonationDialogOpen(true);
    };

    const handleDeleteDonation = async (id: string) => {
        if (!confirm('Are you sure you want to delete this crypto address?')) return;
        const result = await deleteCryptoDonationAction(id);
        if (result.success) {
            toast({ title: "Success", description: result.message });
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
    }

    return (
        <div className="space-y-12">
            <form action={mainFormAction} className="space-y-10">
                <Card className="bg-white/[0.02] border border-white/5 rounded-[40px] saas-shadow overflow-hidden">
                    <CardHeader className="p-8 border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40">
                                <Settings2 className="w-6 h-6" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-black text-white uppercase tracking-tighter leading-none">Site Identity</CardTitle>
                                <CardDescription className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-2">Configure site name, tagline, and branding assets</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                             <div className="space-y-3">
                                <Label htmlFor="siteName" className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Site Name</Label>
                                <Input id="siteName" name="siteName" defaultValue={initialConfig.siteName} className="h-12 bg-white/5 border-white/5 rounded-2xl text-white focus:border-primary/50" />
                                {mainFormState?.errors?.siteName && <p className="text-xs text-red-400 mt-1 ml-1">{mainFormState.errors.siteName[0]}</p>}
                            </div>
                             <div className="space-y-3">
                                <Label htmlFor="tagline" className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Site Tagline</Label>
                                <Input id="tagline" name="tagline" defaultValue={initialConfig.tagline} className="h-12 bg-white/5 border-white/5 rounded-2xl text-white focus:border-primary/50" />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <Label htmlFor="logoUrl" className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Logo URL</Label>
                                <Input id="logoUrl" name="logoUrl" defaultValue={initialConfig.logoUrl} className="h-12 bg-white/5 border-white/5 rounded-2xl text-white focus:border-primary/50 italic" />
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="faviconUrl" className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Favicon URL</Label>
                                <Input id="faviconUrl" name="faviconUrl" defaultValue={initialConfig.faviconUrl} className="h-12 bg-white/5 border-white/5 rounded-2xl text-white focus:border-primary/50 italic" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/[0.02] border border-white/5 rounded-[40px] saas-shadow overflow-hidden">
                    <CardHeader className="p-8 border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40">
                                <Palette className="w-6 h-6" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-black text-white uppercase tracking-tighter leading-none">Theme Settings</CardTitle>
                                <CardDescription className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-2">Configure the visual appearance of the site</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 grid md:grid-cols-3 gap-8">
                        {[
                            { id: 'primary', label: 'Primary Color', val: initialConfig.theme.primary },
                            { id: 'background', label: 'Background Color', val: initialConfig.theme.background },
                            { id: 'accent', label: 'Accent Color', val: initialConfig.theme.accent }
                        ].map((color) => (
                            <div key={color.id} className="space-y-3">
                                <Label htmlFor={color.id} className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">{color.label}</Label>
                                <div className="relative group">
                                    <Input id={color.id} name={color.id} defaultValue={hslStringToHex(color.val)} className="h-12 pl-14 bg-white/5 border-white/5 rounded-2xl text-white font-mono" />
                                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-8 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                                        <Input 
                                            type="color" 
                                            id={`${color.id}-color-picker`} 
                                            defaultValue={hslStringToHex(color.val)} 
                                            className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer" 
                                            onChange={e => {
                                                const target = document.getElementById(color.id) as HTMLInputElement;
                                                if (target) target.value = e.target.value;
                                            }} 
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="bg-white/[0.02] border border-white/5 rounded-[40px] saas-shadow overflow-hidden">
                    <CardHeader className="p-8 border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40">
                                <Megaphone className="w-6 h-6" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-black text-white uppercase tracking-tighter leading-none">Site Announcement</CardTitle>
                                <CardDescription className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-2">Display a message at the top of all site pages</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                         <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 w-fit">
                            <Switch id="announcementEnabled" name="announcementEnabled" checked={announcementEnabled} onCheckedChange={setAnnouncementEnabled} className="data-[state=checked]:bg-primary" />
                            <Label htmlFor="announcementEnabled" className="text-[10px] font-black text-white/60 uppercase tracking-widest cursor-pointer">Enable Announcement</Label>
                        </div>
                        {announcementEnabled && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                                <Textarea
                                    id="announcementMessage"
                                    name="announcementMessage"
                                    placeholder="Enter announcement message..."
                                    defaultValue={initialConfig.announcement.message}
                                    className="min-h-[100px] bg-white/5 border-white/5 rounded-2xl text-white focus:border-primary/50 resize-none italic"
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-white/[0.02] border border-white/5 rounded-[40px] saas-shadow overflow-hidden">
                    <CardHeader className="p-8 border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40">
                                <Share2 className="w-6 h-6" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-black text-white uppercase tracking-tighter leading-none">Share Counter Override</CardTitle>
                                <CardDescription className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-2">Manually set share counts for social media</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 grid grid-cols-2 lg:grid-cols-5 gap-6">
                        {[
                            { id: 'shareFacebook', label: 'Facebook Shares', def: initialConfig.shareStats?.facebook },
                            { id: 'shareTwitter', label: 'Twitter Shares', def: initialConfig.shareStats?.twitter },
                            { id: 'shareTelegram', label: 'Telegram Shares', def: initialConfig.shareStats?.telegram },
                            { id: 'shareWhatsapp', label: 'WhatsApp Shares', def: initialConfig.shareStats?.whatsapp },
                            { id: 'shareTotal', label: 'Total Shares', def: initialConfig.shareStats?.total }
                        ].map((stat) => (
                            <div key={stat.id} className="space-y-3">
                                <Label htmlFor={stat.id} className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">{stat.label}</Label>
                                <Input id={stat.id} name={stat.id} defaultValue={stat.def} placeholder="e.g. 34.6k" className="h-12 bg-white/5 border-white/5 rounded-2xl text-white focus:border-primary/50 text-center font-black" />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                 <div className="flex justify-end">
                    <MainSubmitButton />
                </div>
            </form>

            {/* Crypto Donations Table */}
            <Card className="bg-white/[0.02] border border-white/5 rounded-[40px] saas-shadow overflow-hidden">
                <CardHeader className="p-8 border-b border-white/5 flex flex-row items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40">
                            <Coins className="w-6 h-6" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-black text-white uppercase tracking-tighter leading-none">Crypto Donations</CardTitle>
                            <CardDescription className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-2">Manage cryptocurrency wallet addresses for donations</CardDescription>
                        </div>
                    </div>
                    <Button type="button" onClick={() => handleOpenDonationDialog(null)} className="rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest h-11 px-6">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Crypto
                    </Button>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="rounded-[24px] border border-white/5 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-white/[0.02]">
                                <TableRow className="hover:bg-transparent border-white/5">
                                    <TableHead className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14 pl-8">Asset</TableHead>
                                    <TableHead className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14">Wallet Address</TableHead>
                                    <TableHead className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14">Network</TableHead>
                                    <TableHead className="text-right text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14 pr-8">Actions</TableHead>
                                </TableRow></TableHeader>
                            <TableBody>
                                {initialConfig.cryptoDonations?.map((crypto) => (
                                    <TableRow key={crypto.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                                        <TableCell className="pl-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-[10px]">{crypto.symbol}</div>
                                                <span className="font-black text-white text-[13px] uppercase tracking-tight">{crypto.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-white/30 text-[11px] font-mono max-w-[200px] truncate">{crypto.address}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-white/5 border-white/10 text-white/40 font-black text-[8px] uppercase tracking-widest">{crypto.network || 'Mainnet'}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-8">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="hover:bg-white/5 rounded-xl"><MoreHorizontal className="h-4 w-4 text-white/40" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-background border-white/10 rounded-2xl min-w-[150px] p-2">
                                                    <DropdownMenuItem onClick={() => handleOpenDonationDialog(crypto)} className="rounded-xl focus:bg-white/5 transition-all text-xs font-black uppercase tracking-widest text-white/60">
                                                        <Pencil className="mr-3 h-3.5 w-3.5" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDeleteDonation(crypto.id)} className="rounded-xl focus:bg-red-500/10 text-red-400 focus:text-red-400 transition-all text-xs font-black uppercase tracking-widest">
                                                        <Trash2 className="mr-3 h-3.5 w-3.5" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {(!initialConfig.cryptoDonations || initialConfig.cryptoDonations.length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-10 text-white/20 text-[10px] font-black uppercase tracking-widest italic">No crypto addresses configured.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Navigation Links Table */}
            <Card className="bg-white/[0.02] border border-white/5 rounded-[40px] saas-shadow overflow-hidden">
                <CardHeader className="p-8 border-b border-white/5 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40">
                            <Globe className="w-6 h-6" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-black text-white uppercase tracking-tighter leading-none">Navigation Menu</CardTitle>
                            <CardDescription className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-2">Manage essential navigation links in the header</CardDescription>
                        </div>
                    </div>
                    <Button type="button" onClick={() => handleOpenLinkDialog(null, 'HEADER')} className="rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest h-11 px-6">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Link
                    </Button>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="rounded-[24px] border border-white/5 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-white/[0.02]">
                                <TableRow className="hover:bg-transparent border-white/5">
                                    <TableHead className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14 pl-8">Link Text</TableHead>
                                    <TableHead className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14">Link URL</TableHead>
                                    <TableHead className="text-right text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14 pr-8">Actions</TableHead>
                                </TableRow></TableHeader>
                            <TableBody>
                                {initialNavLinks.map((link) => (
                                    <TableRow key={link.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                                        <TableCell className="pl-8 py-5 font-black text-white text-[13px] uppercase tracking-tight">{link.text}</TableCell>
                                        <TableCell className="text-white/30 text-[11px] font-mono">{link.url}</TableCell>
                                        <TableCell className="text-right pr-8">
                                             <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="hover:bg-white/5 rounded-xl"><MoreHorizontal className="h-4 w-4 text-white/40" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-background border-white/10 rounded-2xl min-w-[150px] p-2">
                                                    <DropdownMenuItem onClick={() => handleOpenLinkDialog(link, 'HEADER')} className="rounded-xl focus:bg-white/5 transition-all text-xs font-black uppercase tracking-widest text-white/60">
                                                        <Pencil className="mr-3 h-3.5 w-3.5" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDeleteLink(link.id, 'HEADER')} className="rounded-xl focus:bg-red-500/10 text-red-400 focus:text-red-400 transition-all text-xs font-black uppercase tracking-widest">
                                                        <Trash2 className="mr-3 h-3.5 w-3.5" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            
            {/* Social Links Table */}
            <Card className="bg-white/[0.02] border border-white/5 rounded-[40px] saas-shadow overflow-hidden">
                <CardHeader className="p-8 border-b border-white/5 flex flex-row items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40">
                            <Link2 className="w-6 h-6" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-black text-white uppercase tracking-tighter leading-none">Social Links</CardTitle>
                            <CardDescription className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-2">Manage social media links in the footer</CardDescription>
                        </div>
                    </div>
                    <Button type="button" onClick={() => handleOpenLinkDialog(null, 'FOOTER_SOCIAL')} className="rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest h-11 px-6">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Social Link
                    </Button>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="rounded-[24px] border border-white/5 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-white/[0.02]">
                                <TableRow className="hover:bg-transparent border-white/5">
                                    <TableHead className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14 pl-8">Platform</TableHead>
                                    <TableHead className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14">Link URL</TableHead>
                                    <TableHead className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14">Icon Name</TableHead>
                                    <TableHead className="text-right text-[10px] font-black text-white/20 uppercase tracking-[0.2em] h-14 pr-8">Actions</TableHead>
                                </TableRow></TableHeader>
                            <TableBody>
                                {initialSocialLinks.map((link) => (
                                    <TableRow key={link.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                                        <TableCell className="pl-8 py-5 font-black text-white text-[13px] uppercase tracking-tight">{link.text}</TableCell>
                                        <TableCell className="text-white/30 text-[11px] font-mono">{link.url}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-white/5 border-white/10 text-white/40 font-black text-[8px] uppercase tracking-widest">{link.icon}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-8">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="hover:bg-white/5 rounded-xl"><MoreHorizontal className="h-4 w-4 text-white/40" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-background border-white/10 rounded-2xl min-w-[150px] p-2">
                                                    <DropdownMenuItem onClick={() => handleOpenLinkDialog(link, 'FOOTER_SOCIAL')} className="rounded-xl focus:bg-white/5 transition-all text-xs font-black uppercase tracking-widest text-white/60">
                                                        <Pencil className="mr-3 h-3.5 w-3.5" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDeleteLink(link.id, 'FOOTER_SOCIAL')} className="rounded-xl focus:bg-red-500/10 text-red-400 focus:text-red-400 transition-all text-xs font-black uppercase tracking-widest">
                                                        <Trash2 className="mr-3 h-3.5 w-3.5" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Link Dialog */}
            <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
                <DialogContent className="bg-background border-white/10 rounded-[32px] p-8 max-w-md">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-black text-white uppercase tracking-tighter">
                            {editingLink?.id && String(editingLink.id) !== 'new' ? 'Edit' : 'Add'} Link
                        </DialogTitle>
                    </DialogHeader>
                    <form action={linkFormAction} className="space-y-6">
                        <input type="hidden" name="id" value={editingLink?.id || 'new'} />
                        <input type="hidden" name="location" value={editingLink?.location} />

                        <div className="space-y-3">
                            <Label htmlFor="text" className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Link Name</Label>
                            <Input id="text" name="text" defaultValue={editingLink?.text} className="h-12 bg-white/5 border-white/5 rounded-2xl text-white focus:border-primary/50" />
                            {linkFormState?.errors?.text && <p className="text-xs text-red-400 mt-1 ml-1">{linkFormState.errors.text[0]}</p>}
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="url" className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Destination URL</Label>
                            <Input id="url" name="url" defaultValue={editingLink?.url} className="h-12 bg-white/5 border-white/5 rounded-2xl text-white focus:border-primary/50 font-mono" />
                            {linkFormState?.errors?.url && <p className="text-xs text-red-400 mt-1 ml-1">{linkFormState.errors.url[0]}</p>}
                        </div>
                        {editingLink?.location === 'FOOTER_SOCIAL' && (
                             <div className="space-y-3">
                                <Label htmlFor="icon" className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Icon Name (Lucide)</Label>
                                <Input id="icon" name="icon" defaultValue={editingLink?.icon || ''} className="h-12 bg-white/5 border-white/5 rounded-2xl text-white focus:border-primary/50" />
                            </div>
                        )}
                        <DialogFooter className="pt-4 gap-3">
                            <Button variant="outline" type="button" onClick={() => setIsLinkDialogOpen(false)} className="rounded-xl bg-white/5 border-white/5 hover:bg-white/10 text-white/40 h-11 transition-all">Cancel</Button>
                            <LinkSubmitButton />
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Crypto Donation Dialog */}
            <Dialog open={isDonationDialogOpen} onOpenChange={setIsDonationDialogOpen}>
                <DialogContent className="bg-background border-white/10 rounded-[32px] p-8 max-w-md">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-black text-white uppercase tracking-tighter">
                            {editingDonation?.id ? 'Edit' : 'Add'} Crypto Asset
                        </DialogTitle>
                    </DialogHeader>
                    <form action={donationFormAction} className="space-y-6">
                        <input type="hidden" name="id" value={editingDonation?.id || '-1'} />

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <Label htmlFor="name" className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Asset Name</Label>
                                <Input id="name" name="name" placeholder="e.g. Bitcoin" defaultValue={editingDonation?.name} className="h-12 bg-white/5 border-white/5 rounded-2xl text-white focus:border-primary/50" />
                                {donationFormState?.errors?.name && <p className="text-xs text-red-400 mt-1 ml-1">{donationFormState.errors.name[0]}</p>}
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="symbol" className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Symbol</Label>
                                <Input id="symbol" name="symbol" placeholder="e.g. BTC" defaultValue={editingDonation?.symbol} className="h-12 bg-white/5 border-white/5 rounded-2xl text-white focus:border-primary/50" />
                                {donationFormState?.errors?.symbol && <p className="text-xs text-red-400 mt-1 ml-1">{donationFormState.errors.symbol[0]}</p>}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="address" className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Wallet Address</Label>
                            <Input id="address" name="address" defaultValue={editingDonation?.address} className="h-12 bg-white/5 border-white/5 rounded-2xl text-white focus:border-primary/50 font-mono text-xs" />
                            {donationFormState?.errors?.address && <p className="text-xs text-red-400 mt-1 ml-1">{donationFormState.errors.address[0]}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <Label htmlFor="network" className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Network (Optional)</Label>
                                <Input id="network" name="network" placeholder="e.g. BEP20" defaultValue={editingDonation?.network} className="h-12 bg-white/5 border-white/5 rounded-2xl text-white focus:border-primary/50" />
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="qrCodeUrl" className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">QR Code URL (Optional)</Label>
                                <Input id="qrCodeUrl" name="qrCodeUrl" defaultValue={editingDonation?.qrCodeUrl} className="h-12 bg-white/5 border-white/5 rounded-2xl text-white focus:border-primary/50 italic text-xs" />
                            </div>
                        </div>

                        <DialogFooter className="pt-4 gap-3">
                            <Button variant="outline" type="button" onClick={() => setIsDonationDialogOpen(false)} className="rounded-xl bg-white/5 border-white/5 hover:bg-white/10 text-white/40 h-11 transition-all">Cancel</Button>
                            <DonationSubmitButton />
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
