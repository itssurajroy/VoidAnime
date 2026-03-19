'use client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createBrowserClient } from "@supabase/ssr";
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
);

const welcomeSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters.').max(20, 'Username must be 20 characters or less.'),
});

type WelcomeValues = z.infer<typeof welcomeSchema>;

export default function WelcomePage() {
    const { user, loading } = useSupabaseAuth();
    const router = useRouter();
    const { toast } = useToast();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<WelcomeValues>({
        resolver: zodResolver(welcomeSchema),
    });

    useEffect(() => {
        if (!loading && !user) {
            router.push('/home');
        }
        if (!loading && user && user.user_metadata?.username) {
            router.push('/home');
        }
    }, [user, loading, router]);

    const onSubmit = async (data: WelcomeValues) => {
        if (!user) return;
        try {
            const { error } = await supabase.auth.updateUser({
                data: { username: data.username }
            });
            
            if (error) throw error;
            
            toast({
                title: "Welcome to VoidAnime!",
                description: "Your profile has been set up.",
            });
            router.push('/home');
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error setting up profile",
                description: error.message,
            });
        }
    };
    
    if (loading || !user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Welcome to VoidAnime!</CardTitle>
                    <CardDescription>Let&apos;s set up your profile. Choose a username to get started.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" {...register("username")} placeholder="Your public username"/>
                            {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
                        </div>
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Continue
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
