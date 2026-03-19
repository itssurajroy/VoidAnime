'use client';

import React, { useState, type ReactNode, isValidElement } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Loader2, LogIn, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

const signUpSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, 'Password is required'),
});

type SignUpValues = z.infer<typeof signUpSchema>;
type LoginValues = z.infer<typeof loginSchema>;

interface AuthTriggerProps {
    children?: React.ReactNode;
    mode?: 'login' | 'signup';
}

export function AuthTrigger({ children, mode = 'login' }: AuthTriggerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();
    const { signIn, signUp, resetPassword, loading: authLoading } = useSupabaseAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(mode);
    const [isLoading, setIsLoading] = useState(false);
    const [isResetLoading, setIsResetLoading] = useState(false);

    const { register: registerLogin, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors } } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });
    const { register: registerSignUp, handleSubmit: handleSignUpSubmit, formState: { errors: signUpErrors } } = useForm<SignUpValues>({ resolver: zodResolver(signUpSchema) });

    const onLogin = async (data: LoginValues) => {
        setIsLoading(true);
        try {
            await signIn(data.email, data.password);
            toast({ title: "Logged in successfully!" });
            setIsOpen(false);
            router.push('/home');
        } catch (error: any) {
            let description = 'An unexpected error occurred. Please try again.';
            if (error.message?.includes('Invalid login credentials')) {
                description = 'Invalid email or password. Please try again.';
            } else if (error.message?.includes('User not found')) {
                description = 'Invalid email or password. Please try again.';
            } else if (error.message) {
                description = error.message;
            }
            toast({ variant: 'destructive', title: 'Login Failed', description });
        } finally {
            setIsLoading(false);
        }
    };

    const onSignUp = async (data: SignUpValues) => {
        setIsLoading(true);
        try {
            await signUp(data.email, data.password);
            toast({ title: "Account created! Please check your email to verify." });
            setIsOpen(false);
            router.push('/home');
        } catch (error: any) {
            let description = 'An unexpected error occurred. Please try again.';
            if (error.message?.includes('User already registered')) {
                description = 'An account with this email address already exists.';
            } else if (error.message) {
                description = error.message;
            }
            toast({ variant: 'destructive', title: 'Sign Up Failed', description });
        } finally {
            setIsLoading(false);
        }
    };

    const [resetEmail, setResetEmail] = useState('');
    const [showResetForm, setShowResetForm] = useState(false);

    const handlePasswordReset = async () => {
        if (!showResetForm) {
            setShowResetForm(true);
            return;
        }
        if (!resetEmail.trim()) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please enter your email address.' });
            return;
        }
        setIsResetLoading(true);
        try {
            await resetPassword(resetEmail.trim());
            toast({ title: "Password Reset Email Sent", description: "Check your inbox for instructions." });
            setShowResetForm(false);
            setResetEmail('');
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message || "Failed to send reset email" });
        } finally {
            setIsResetLoading(false);
        }
    }

    const handleOpenChange = (open: boolean) => {
        if (open) {
            setActiveTab(mode);
        }
        setIsOpen(open);
    }

    const child = React.Children.toArray(children).find(isValidElement) as React.ReactElement | undefined;
    
    if (!child) {
        return null; 
    }

    const trigger = React.cloneElement(child as any, {
        onClick: (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            handleOpenChange(true);
            if ((child as any).props.onClick) {
                (child as any).props.onClick(e);
            }
        },
    });

    return (
        <>
            {trigger}
            <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                 <DialogContent className="sm:max-w-md bg-[#0B0C10] border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
                    <DialogHeader>
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                            <LogIn className="w-8 h-8" />
                        </div>
                        <DialogTitle className="text-center text-2xl font-black uppercase tracking-tighter text-white">Welcome back</DialogTitle>
                        <DialogDescription className="text-center text-white/40 text-[13px] font-medium">
                            Access your personalized dashboard and library.
                        </DialogDescription>
                    </DialogHeader>
                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full mt-4">
                        <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10 p-1 rounded-2xl h-12">
                            <TabsTrigger value="login" className="flex items-center gap-2 py-2 px-4 data-[state=active]:bg-primary data-[state=active]:text-black rounded-xl transition-all font-black uppercase text-[10px] tracking-widest">
                                <LogIn className="w-3.5 h-3.5" />
                                Login
                            </TabsTrigger>
                            <TabsTrigger value="signup" className="flex items-center gap-2 py-2 px-4 data-[state=active]:bg-primary data-[state=active]:text-black rounded-xl transition-all font-black uppercase text-[10px] tracking-widest">
                                <UserPlus className="w-3.5 h-3.5" />
                                Sign Up
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="login" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4 pt-6">
                                <div className="space-y-2">
                                    <Label htmlFor="login-email" className="text-[10px] font-black uppercase tracking-widest text-white/20">Email Address</Label>
                                    <Input id="login-email" {...registerLogin("email")} placeholder="name@voidanime.online" className="h-12 bg-white/5 border-white/5 rounded-xl focus:border-primary/50 transition-all" />
                                    {loginErrors.email && <p className="text-xs text-red-500 font-bold uppercase tracking-tight">{loginErrors.email.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="login-password" title="Password" className="text-[10px] font-black uppercase tracking-widest text-white/20">Password</Label>
                                    <Input id="login-password" type="password" {...registerLogin("password")} className="h-12 bg-white/5 border-white/5 rounded-xl focus:border-primary/50 transition-all" />
                                    {loginErrors.password && <p className="text-xs text-red-500 font-bold uppercase tracking-tight">{loginErrors.password.message}</p>}
                                </div>
                                {showResetForm && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <Label htmlFor="reset-email" className="text-[10px] font-black uppercase tracking-widest text-white/20">Your Email Address</Label>
                                        <Input 
                                            id="reset-email" 
                                            type="email" 
                                            value={resetEmail}
                                            onChange={(e) => setResetEmail(e.target.value)}
                                            placeholder="Enter your email" 
                                            className="h-12 bg-white/5 border-white/5 rounded-xl focus:border-primary/50 transition-all" 
                                        />
                                    </div>
                                )}
                                <Button type="submit" className="w-full h-12 rounded-xl bg-primary text-black font-black uppercase tracking-widest text-[11px] shadow-xl shadow-primary/10 hover:bg-primary/90 transition-all active:scale-[0.98]" disabled={isLoading || isResetLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {showResetForm ? 'Send Reset Link' : 'Login'}
                                </Button>
                                <div className="text-center">
                                    <Button type="button" variant="link" className="p-0 h-auto text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-primary transition-colors" onClick={handlePasswordReset} disabled={isResetLoading}>
                                        {isResetLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        {showResetForm ? 'Cancel' : 'Forgot Password?'}
                                    </Button>
                                </div>
                            </form>
                        </TabsContent>
                        <TabsContent value="signup" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <form onSubmit={handleSignUpSubmit(onSignUp)} className="space-y-4 pt-6">
                                <div className="space-y-2">
                                    <Label htmlFor="signup-email" className="text-[10px] font-black uppercase tracking-widest text-white/20">Email Address</Label>
                                    <Input id="signup-email" {...registerSignUp("email")} placeholder="name@voidanime.online" className="h-12 bg-white/5 border-white/5 rounded-xl focus:border-primary/50 transition-all" />
                                    {signUpErrors.email && <p className="text-xs text-red-500 font-bold uppercase tracking-tight">{signUpErrors.email.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-password" title="Password" className="text-[10px] font-black uppercase tracking-widest text-white/20">Password</Label>
                                    <Input id="signup-password" type="password" {...registerSignUp("password")} className="h-12 bg-white/5 border-white/5 rounded-xl focus:border-primary/50 transition-all" />
                                    {signUpErrors.password && <p className="text-xs text-red-500 font-bold uppercase tracking-tight">{signUpErrors.password.message}</p>}
                                </div>
                                <p className="text-[10px] text-white/20 font-medium leading-relaxed uppercase tracking-wider text-center px-4">
                                    By signing up, you agree to our <span className="text-white/40 font-bold">Terms</span> and <span className="text-white/40 font-bold">Privacy Policy</span>.
                                </p>
                                <Button type="submit" className="w-full h-12 rounded-xl bg-primary text-black font-black uppercase tracking-widest text-[11px] shadow-xl shadow-primary/10 hover:bg-primary/90 transition-all active:scale-[0.98]" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Account
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>
        </>
    );
}
