'use client';

import { useState } from "react";
import type { AdProvider, AdPlacement, AdCampaign, AdRule } from '@/types/db';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, PauseCircle, PlayCircle, Trash2, Pencil } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { ProviderForm } from "./ProviderForm";
import { useToast } from "@/hooks/use-toast";
import { deleteAdProvider } from "@/actions/ads";

type AdsClientProps = {
    initialProviders: AdProvider[];
    initialPlacements: AdPlacement[];
    initialCampaigns: (AdCampaign & { provider: AdProvider, rules: AdRule[] })[];
}

const CampaignStatusBadge = ({ status }: { status: AdCampaign['status'] }) => {
    const variant = {
        'ACTIVE': 'default',
        'PAUSED': 'secondary',
        'ENDED': 'outline',
        'DRAFT': 'destructive',
    }[status] || 'secondary';
    
    return <Badge variant={variant as any}>{status}</Badge>
}

export function AdsClient({ initialProviders, initialPlacements, initialCampaigns }: AdsClientProps) {
    const [providers, setProviders] = useState<AdProvider[]>(initialProviders);
    const [isProviderDialogOpen, setIsProviderDialogOpen] = useState(false);
    const [editingProvider, setEditingProvider] = useState<AdProvider | null>(null);
    const { toast } = useToast();

    const handleEditProvider = (provider: AdProvider) => {
        setEditingProvider(provider);
        setIsProviderDialogOpen(true);
    }

    const handleNewProvider = () => {
        setEditingProvider(null);
        setIsProviderDialogOpen(true);
    }
    
    const handleDeleteProvider = async (id: string) => {
        if (!confirm('Are you sure you want to delete this provider?')) return;
        
        const result = await deleteAdProvider(id);
        if (result.success) {
            toast({ title: 'Success', description: result.message });
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
    }
    
    return (
        <div className="grid gap-8">
            {/* Ad Campaigns */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Ad Campaigns</CardTitle>
                            <CardDescription>Monitor and manage active and scheduled ad campaigns.</CardDescription>
                        </div>
                        <Button size="sm">
                            <PlusCircle className="mr-2 h-4 w-4" /> New Campaign
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Campaign</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Budget</TableHead>
                                <TableHead>Rules</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow></TableHeader>
                        <TableBody>
                            {initialCampaigns.map((campaign) => {
                                const budgetProgress = campaign.budgetTotal ? (campaign.budgetUsed / campaign.budgetTotal) * 100 : 0;
                                return (
                                    <TableRow key={campaign.id}>
                                        <TableCell>
                                            <p className="font-medium">{campaign.name}</p>
                                            <p className="text-xs text-muted-foreground">{campaign.provider.name}</p>
                                        </TableCell>
                                        <TableCell><CampaignStatusBadge status={campaign.status} /></TableCell>
                                        <TableCell>{campaign.priority}</TableCell>
                                        <TableCell>
                                             <div className="flex flex-col gap-1.5">
                                                {campaign.budgetType === 'CAPPED' && campaign.budgetTotal ? (
                                                    <>
                                                        <Progress value={budgetProgress} className="h-2 w-32" />
                                                        <p className="text-xs text-muted-foreground">
                                                            ${campaign.budgetUsed.toLocaleString()} / ${campaign.budgetTotal.toLocaleString()}
                                                        </p>
                                                    </>
                                                ) : <Badge variant="outline">Unlimited</Badge>}
                                            </div>
                                        </TableCell>
                                        <TableCell>{campaign.rules.length} rule(s)</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal /></Button></DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" />Edit Rules</DropdownMenuItem>
                                                    {campaign.status === 'ACTIVE' && <DropdownMenuItem><PauseCircle className="mr-2 h-4 w-4" />Pause</DropdownMenuItem>}
                                                    {campaign.status === 'PAUSED' && <DropdownMenuItem><PlayCircle className="mr-2 h-4 w-4" />Resume</DropdownMenuItem>}
                                                    <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Ad Providers */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Ad Providers</CardTitle>
                            <CardDescription>The ad networks or services you are integrated with.</CardDescription>
                        </div>
                         <Button size="sm" onClick={handleNewProvider}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Provider
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Provider Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow></TableHeader>
                        <TableBody>
                            {providers.map((provider) => (
                                <TableRow key={provider.id}>
                                    <TableCell className="font-medium">{provider.name}</TableCell>
                                    <TableCell><Badge variant="outline">{provider.type}</Badge></TableCell>
                                    <TableCell>
                                        <Badge variant={provider.isActive ? "default" : "secondary"}>
                                            {provider.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal/></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => handleEditProvider(provider)}>
                                                    <Pencil className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteProvider(provider.id)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            
            <ProviderForm 
                isOpen={isProviderDialogOpen} 
                setIsOpen={setIsProviderDialogOpen} 
                provider={editingProvider}
            />

             {/* Ad Placements */}
             <Card>
                <CardHeader>
                     <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Ad Placements</CardTitle>
                            <CardDescription>Define where ads will appear on your site.</CardDescription>
                        </div>
                        <Button size="sm">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Placement
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Placement Name</TableHead>
                                <TableHead>Slot Key</TableHead>
                                <TableHead>Device</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow></TableHeader>
                        <TableBody>
                            {initialPlacements.map((placement) => (
                                <TableRow key={placement.id}>
                                    <TableCell className="font-medium">{placement.name}</TableCell>
                                    <TableCell className="font-mono text-xs">{placement.slotKey}</TableCell>
                                    <TableCell><Badge variant="outline">{placement.deviceTarget}</Badge></TableCell>
                                    <TableCell>
                                         <Badge variant={placement.isActive ? "default" : "secondary"}>
                                            {placement.isActive ? "Enabled" : "Disabled"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">Edit</Button>
                                        <Button variant="ghost" size="sm" className="text-destructive">Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
