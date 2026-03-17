'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import type { AdProvider } from '@/types/db';
import { saveAdProvider } from '@/actions/ads';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface ProviderFormProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    provider: AdProvider | null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const initialState = {
    errors: {},
    message: null,
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Provider
        </Button>
    )
}

export function ProviderForm({ isOpen, setIsOpen, provider }: ProviderFormProps) {
     
    const [state, formAction] = useActionState(saveAdProvider, null);
    const { toast } = useToast();
    
    useEffect(() => {
        if (!state) return;
        if (state.success) {
            toast({ title: "Success", description: state.message });
            setIsOpen(false);
        } else if (state.error) {
            toast({ variant: 'destructive', title: "Error", description: state.error });
        }
    }, [state, toast, setIsOpen]);
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{provider ? 'Edit' : 'Create'} Ad Provider</DialogTitle>
                    <DialogDescription>
                        Manage the details for this ad provider.
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction} className="space-y-4">
                    <input type="hidden" name="id" id="id" value={provider?.id || 'new'} />
                    
                    <div>
                        <Label htmlFor="name">Provider Name</Label>
                        <Input id="name" name="name" defaultValue={provider?.name} />
                        {state?.errors?.name && <p className="text-sm text-destructive mt-1">{state.errors.name[0]}</p>}
                    </div>

                    <div>
                        <Label htmlFor="type">Provider Type</Label>
                        <Select name="type" defaultValue={provider?.type}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="NETWORK">Network</SelectItem>
                                <SelectItem value="DIRECT">Direct</SelectItem>
                                <SelectItem value="HOUSE">House</SelectItem>
                            </SelectContent>
                        </Select>
                         {state?.errors?.type && <p className="text-sm text-destructive mt-1">{state.errors.type[0]}</p>}
                    </div>
                    
                    <div>
                        <Label htmlFor="config">Configuration (JSON)</Label>
                        <Textarea id="config" name="config" rows={4} defaultValue={provider?.config ? JSON.stringify(provider.config, null, 2) : ''} />
                         {state?.errors?.config && <p className="text-sm text-destructive mt-1">{state.errors.config[0]}</p>}
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch id="isActive" name="isActive" defaultChecked={provider?.isActive ?? true} />
                        <Label htmlFor="isActive">Active</Label>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <SubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
