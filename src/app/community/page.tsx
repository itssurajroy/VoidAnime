'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Search,
    Plus,
    Zap,
    MessageCircle,
    ChevronRight,
    Filter,
    MoreHorizontal,
    ThumbsUp,
    ShieldCheck,
    Award,
    Hash,
    Users,
    Pin,
    Trash2,
    Loader2,
    EyeOff,
    Eye,
    Flag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCommunity } from '@/hooks/useCommunity';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/hooks/useUserRole';
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

const CATEGORIES = [
    { id: 'all', label: 'All', count: 42502 },
    { id: 'general', label: 'General', count: 12401 },
    { id: 'discussion', label: 'Discussion', count: 8502 },
    { id: 'question', label: 'Question', count: 5201 },
    { id: 'feedback', label: 'Feedback', count: 1204 },
    { id: 'news', label: 'News', count: 850 },
];

const TOP_MEMBERS = [
    { name: "VoidLegend", level: 99, points: "2.5M", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Legend" },
    { name: "JinWoo_Hunter", level: 85, points: "1.2M", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JinWoo" },
    { name: "Mugiwara_Luffy", level: 72, points: "980K", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luffy" },
    { name: "VoidMaster", level: 68, points: "840K", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Master" },
    { name: "Zoro_Solo", level: 65, points: "760K", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoro" },
];

export default function CommunityPage() {
    const [activeTab, setActiveTab] = useState('all');
    const { posts, loading, addPost, deletePost, updatePost, likePost, togglePin, hidePost } = useCommunity(activeTab);
    const { user } = useUser();
    const { toast } = useToast();

    // Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [newCategory, setNewCategory] = useState('general');
    const [newImage, setNewImage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Edit Post State
    const [editingPostId, setEditingPostId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [editImage, setEditImage] = useState('');
    const [isSavingEdit, setIsSavingEdit] = useState(false);

    // Robust admin check
    const { isAdmin } = useUserRole();

    const handleCreatePost = async () => {
        if (!user) {
            toast({ title: 'Authentication Required', description: 'Please login to create a post', variant: 'destructive' });
            return;
        }
        if (!newTitle.trim() || !newContent.trim()) {
            toast({ title: 'Missing Information', description: 'Title and content are required', variant: 'destructive' });
            return;
        }

        setIsSubmitting(true);
        try {
            await addPost(newTitle, newContent, newCategory, isAdmin, newImage.trim() || undefined);
            toast({ title: 'Success', description: 'Post created successfully!' });
            setIsCreateModalOpen(false);
            setNewTitle('');
            setNewContent('');
            setNewImage('');
            setNewCategory('general');
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to create post', variant: 'destructive' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (postId: string) => {
        if (confirm('Are you sure you want to delete this post?')) {
            try {
                await deletePost(postId);
                toast({ title: 'Deleted', description: 'Post removed successfully' });
            } catch (error) {
                toast({ title: 'Error', description: 'Failed to delete post', variant: 'destructive' });
            }
        }
    };

    const handlePin = async (postId: string, currentPinStatus: boolean) => {
        try {
            await togglePin(postId, currentPinStatus);
            toast({ title: 'Success', description: currentPinStatus ? 'Post unpinned' : 'Post pinned' });
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to update pin status', variant: 'destructive' });
        }
    };

    const handleHide = async (postId: string, currentHiddenStatus: boolean) => {
        try {
            await hidePost(postId, !currentHiddenStatus);
            toast({ title: 'Success', description: currentHiddenStatus ? 'Post is now visible' : 'Post is now hidden' });
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to update visibility', variant: 'destructive' });
        }
    };

    return (
        <div className="min-h-screen bg-background text-white">
            {/* Create Post Modal Overlay */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)} />
                    <div className="relative w-full max-w-2xl bg-[#14151a] border border-white/10 rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black uppercase tracking-tighter">Create New <span className="text-primary">Post</span></h2>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-white/40 hover:text-white transition-colors">
                                <Plus className="w-6 h-6 rotate-45" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Title</label>
                                <Input
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="What's on your mind?"
                                    className="bg-black/20 border-white/5 focus:border-primary/50 text-lg font-bold h-14 rounded-xl"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Image URL (Optional)</label>
                                <Input
                                    value={newImage}
                                    onChange={(e) => setNewImage(e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                    className="bg-black/20 border-white/5 focus:border-primary/50 text-sm h-12 rounded-xl"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Category</label>
                                <div className="flex flex-wrap gap-2">
                                    {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setNewCategory(cat.id)}
                                            className={cn(
                                                "px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all border",
                                                newCategory === cat.id
                                                    ? "bg-primary text-black border-primary"
                                                    : "bg-white/5 text-white/40 border-white/5 hover:text-white"
                                            )}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Content</label>
                                <Textarea
                                    value={newContent}
                                    onChange={(e) => setNewContent(e.target.value)}
                                    placeholder="Expand on your topic here..."
                                    className="bg-black/20 border-white/5 focus:border-primary/50 min-h-[150px] rounded-xl resize-none p-4"
                                />
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)} className="uppercase tracking-widest text-[11px] font-black">Cancel</Button>
                                <Button
                                    onClick={handleCreatePost}
                                    disabled={isSubmitting || !newTitle.trim() || !newContent.trim()}
                                    className="bg-primary hover:bg-primary/90 text-black uppercase tracking-widest text-[11px] font-black px-8 rounded-xl"
                                >
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish Post'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Community Hero Header */}
            <div className="relative w-full bg-[#14141d] border-b border-white/5 py-12 lg:py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
                <div className="container max-w-[1400px] mx-auto px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-white/40 text-[12px] font-black uppercase tracking-[0.2em] mb-2">
                                <Link href="/home" className="hover:text-primary transition-colors">Home</Link>
                                <ChevronRight className="w-3 h-3" />
                                <span className="text-white">Community</span>
                            </div>
                            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter font-headline leading-[0.9]">
                                Community <span className="text-primary block">Board</span>
                            </h1>
                            <p className="text-white/40 text-[14px] lg:text-[16px] font-medium max-w-xl leading-relaxed">
                                Share your thoughts, ask questions, and connect with millions of anime fans around the world.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                            <div className="relative flex-1 sm:w-80 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                                <Input
                                    placeholder="Search in community..."
                                    className="h-14 bg-white/5 border-white/5 rounded-2xl pl-12 pr-4 text-white placeholder:text-white/20 focus:border-primary/50 transition-all"
                                />
                            </div>
                            <Button
                                onClick={() => user ? setIsCreateModalOpen(true) : toast({ title: 'Authentication Required', description: 'Please login to post', variant: 'destructive' })}
                                className="h-14 bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest px-8 rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all gap-3"
                            >
                                <Plus className="w-5 h-5" />
                                Create Post
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Feed */}
            <div className="container max-w-[1400px] mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Post Feed */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Navigation Tabs */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/5 pb-6">
                            <div className="flex items-center gap-1 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveTab(cat.id)}
                                        className={cn(
                                            "px-6 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                                            activeTab === cat.id
                                                ? "bg-primary text-black"
                                                : "text-white/40 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-4">
                                <button className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-[11px] font-black uppercase tracking-widest px-4 py-2 bg-white/5 rounded-lg border border-white/5">
                                    <Filter className="w-3 h-3" />
                                    Latest
                                </button>
                            </div>
                        </div>

                        {/* Post List */}
                        <div className="space-y-6">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                                    <p className="text-white/40 font-black uppercase tracking-widest text-xs">Loading Posts...</p>
                                </div>
                            ) : posts.length === 0 ? (
                                <div className="text-center py-20 bg-white/5 border border-white/10 border-dashed rounded-[32px]">
                                    <MessageCircle className="w-12 h-12 text-white/20 mx-auto mb-4" />
                                    <h3 className="text-xl font-black text-white uppercase">No Posts Found</h3>
                                    <p className="text-white/40 text-sm mt-2">Be the first to start a discussion in this category.</p>
                                </div>
                            ) : (
                                posts.filter(post => isAdmin || !post.isHidden).map((post) => {
                                    const isOwner = user?.uid === post.userId;

                                    return (
                                        <div
                                            key={post.id}
                                            className={cn(
                                                "group bg-[#14141d] border border-white/5 rounded-[32px] p-6 lg:p-8 hover:border-primary/20 transition-all duration-500 saas-shadow relative overflow-hidden",
                                                post.isHidden && "opacity-60 grayscale-[0.5] border-orange-500/20"
                                            )}
                                        >
                                            <div className="absolute top-0 left-0 flex flex-col">
                                                {post.isPinned && (
                                                    <div className="bg-primary/10 text-primary px-6 py-1 rounded-br-2xl text-[10px] font-black uppercase tracking-widest border-r border-b border-primary/20 flex items-center gap-2 w-fit">
                                                        <Pin className="w-3 h-3" /> Pinned
                                                    </div>
                                                )}
                                                {post.isHidden && (
                                                    <div className="bg-orange-500/10 text-orange-400 px-6 py-1 rounded-br-2xl text-[10px] font-black uppercase tracking-widest border-r border-b border-orange-500/20 flex items-center gap-2 w-fit">
                                                        <EyeOff className="w-3 h-3" /> Hidden
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex gap-6">
                                                <div className="hidden sm:block flex-shrink-0">
                                                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/5 group-hover:border-primary/30 transition-colors bg-white/5">
                                                        <Image src={post.userAvatar} alt={post.userName} fill className="object-cover" />
                                                    </div>
                                                </div>

                                                <div className="flex-1 space-y-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="sm:hidden relative w-8 h-8 rounded-lg overflow-hidden border border-white/5 bg-white/5">
                                                            <Image src={post.userAvatar} alt={post.userName} fill className="object-cover" />
                                                        </div>
                                                        <span className={cn(
                                                            "text-[12px] font-black uppercase tracking-widest",
                                                            post.isAdmin ? "text-primary" : "text-white/60"
                                                        )}>
                                                            {post.userName}
                                                        </span>
                                                        <span className="text-white/20">•</span>
                                                        <span className="text-white/20 text-[11px] font-bold uppercase">
                                                            {post.createdAt ? (() => {
                                                                try {
                                                                    const date = post.createdAt.toDate ? post.createdAt.toDate() : new Date(post.createdAt);
                                                                    return formatDistanceToNow(date, { addSuffix: true });
                                                                } catch (e) { return 'Just now'; }
                                                            })() : 'Just now'}
                                                        </span>
                                                        <div className="ml-auto flex items-center gap-2">
                                                            {(isOwner || isAdmin) && (
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingPostId(post.id);
                                                                        setEditTitle(post.title);
                                                                        setEditContent(post.content);
                                                                        setEditImage(post.image || '');
                                                                    }}
                                                                    className="text-white/20 hover:text-primary transition-colors p-2"
                                                                    title="Edit"
                                                                >
                                                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                                                </button>
                                                            )}
                                                            {isAdmin && (
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <button className="text-white/20 hover:text-primary transition-colors p-2" title="Moderate">
                                                                            <MoreHorizontal className="w-4 h-4" />
                                                                        </button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end" className="bg-[#1a1b23] border-white/10 rounded-2xl p-2 min-w-[180px] shadow-3xl animate-in fade-in zoom-in-95 duration-200">
                                                                        <DropdownMenuLabel className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] px-3 py-2">Moderation Tools</DropdownMenuLabel>
                                                                        <DropdownMenuItem 
                                                                            onClick={() => handlePin(post.id, post.isPinned)}
                                                                            className="rounded-xl focus:bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/60 p-3 flex items-center gap-3"
                                                                        >
                                                                            <Pin className={cn("w-3.5 h-3.5", post.isPinned && "text-primary fill-primary")} />
                                                                            {post.isPinned ? 'Unpin Post' : 'Pin to Top'}
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem 
                                                                            onClick={() => handleHide(post.id, !!post.isHidden)}
                                                                            className="rounded-xl focus:bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/60 p-3 flex items-center gap-3"
                                                                        >
                                                                            {post.isHidden ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-orange-400" />}
                                                                            {post.isHidden ? 'Unhide Post' : 'Hide from Feed'}
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuSeparator className="bg-white/5 my-1" />
                                                                        <DropdownMenuItem 
                                                                            onClick={() => handleDelete(post.id)}
                                                                            className="rounded-xl focus:bg-red-500/10 text-red-400 focus:text-red-400 text-[10px] font-black uppercase tracking-widest p-3 flex items-center gap-3"
                                                                        >
                                                                            <Trash2 className="w-3.5 h-3.5" />
                                                                            Delete Forever
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            )}
                                                            {!isAdmin && isOwner && (
                                                                <button onClick={() => handleDelete(post.id)} className="text-white/20 hover:text-red-500 transition-colors p-2" title="Delete">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {editingPostId === post.id ? (
                                                        <div className="space-y-4 bg-black/20 p-4 rounded-xl border border-white/5">
                                                            <Input
                                                                value={editTitle}
                                                                onChange={(e) => setEditTitle(e.target.value)}
                                                                placeholder="Post Title"
                                                                className="bg-black/40 border-primary/20 focus:border-primary/50"
                                                            />
                                                            <Input
                                                                value={editImage}
                                                                onChange={(e) => setEditImage(e.target.value)}
                                                                placeholder="Image URL (Optional)"
                                                                className="bg-black/40 border-primary/20 focus:border-primary/50"
                                                            />
                                                            <Textarea
                                                                value={editContent}
                                                                onChange={(e) => setEditContent(e.target.value)}
                                                                placeholder="Post Content"
                                                                className="min-h-[100px] bg-black/40 border-primary/20 focus:border-primary/50"
                                                            />
                                                            <div className="flex justify-end gap-2">
                                                                <Button variant="ghost" size="sm" onClick={() => setEditingPostId(null)} className="h-8 text-[10px] uppercase font-black tracking-widest text-white/40 hover:text-white">Cancel</Button>
                                                                <Button
                                                                    size="sm"
                                                                    disabled={isSavingEdit || !editTitle.trim() || !editContent.trim()}
                                                                    className="h-8 text-[10px] uppercase font-black tracking-widest bg-primary text-black"
                                                                    onClick={async () => {
                                                                        setIsSavingEdit(true);
                                                                        try {
                                                                            await updatePost(post.id, editTitle, editContent, editImage.trim() || undefined);
                                                                            setEditingPostId(null);
                                                                            toast({ title: 'Success', description: 'Post updated successfully' });
                                                                        } catch (e) {
                                                                            toast({ title: 'Error', description: 'Failed to update post', variant: 'destructive' });
                                                                        } finally {
                                                                            setIsSavingEdit(false);
                                                                        }
                                                                    }}
                                                                >
                                                                    {isSavingEdit ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Save Changes'}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-4">
                                                            <div className="space-y-2">
                                                                <Link href={`/community/post/${post.id}`}>
                                                                    <h3 className="text-xl lg:text-2xl font-black text-white group-hover:text-primary transition-colors leading-tight uppercase tracking-tight">
                                                                        {post.title}
                                                                    </h3>
                                                                </Link>
                                                                <p className="text-white/40 text-[14px] leading-relaxed line-clamp-3 font-medium whitespace-pre-wrap">
                                                                    {post.content}
                                                                </p>
                                                            </div>
                                                            {post.image && (
                                                                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/5">
                                                                    <Image src={post.image} alt={post.title} fill className="object-cover" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className="flex flex-wrap items-center gap-6 pt-2">
                                                        <div className="flex items-center gap-2 bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                                                            <Hash className="w-3 h-3 text-primary" />
                                                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">{post.category}</span>
                                                        </div>

                                                        <div className="flex items-center gap-4 text-white/40 text-[12px] font-black">
                                                            <button onClick={() => likePost(post.id)} className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                                                                <ThumbsUp className="w-4 h-4" />
                                                                <span>{post.likes || 0}</span>
                                                            </button>
                                                            <Link href={`/community/post/${post.id}`} className="flex items-center gap-2 hover:text-[#f472b6] transition-colors cursor-pointer">
                                                                <MessageCircle className="w-4 h-4" />
                                                                <span>{post.commentsCount || 0}</span>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="lg:col-span-4 space-y-10">

                        {/* Elite Members Link */}
                        <Link href="/community/super-x" className="block group">
                            <div className="bg-primary/10 border border-primary/20 rounded-[32px] p-6 flex items-center justify-between hover:bg-primary/20 transition-all shadow-lg shadow-primary/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-black shadow-xl shadow-primary/20">
                                        <Zap className="w-6 h-6 fill-current" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-black uppercase tracking-tight text-[15px]">Elite Status</h4>
                                        <p className="text-primary/60 text-[10px] font-black uppercase tracking-widest">Premium Member Perks</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>

                        {/* Community Stats */}
                        <div className="bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 rounded-[40px] p-8 lg:p-10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                <Users className="w-32 h-32 text-primary" />
                            </div>
                            <div className="relative z-10 space-y-6">
                                <div className="space-y-2">
                                    <h4 className="text-white font-black text-2xl uppercase tracking-tighter font-headline">Community <span className="text-primary">Power</span></h4>
                                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest leading-relaxed">
                                        Join our vibrant community of anime enthusiasts.
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <div className="text-3xl font-black text-white font-headline tracking-tighter">1.2M</div>
                                        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Members</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-3xl font-black text-white font-headline tracking-tighter">45K+</div>
                                        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Daily Posts</div>
                                    </div>
                                </div>
                                <Button className="w-full h-12 bg-white text-black hover:bg-white/90 font-black uppercase tracking-widest rounded-xl transition-all shadow-xl active:scale-95">
                                    Join Discord
                                </Button>
                            </div>
                        </div>

                        {/* Top Members */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-3">
                                    <Award className="w-5 h-5 text-[#fbbf24]" />
                                    <h4 className="text-[18px] font-black text-white uppercase tracking-tighter font-headline">Top Members</h4>
                                </div>
                                <Link href="#" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Full Leaderboard</Link>
                            </div>

                            <div className="bg-[#14141d] border border-white/5 rounded-[40px] p-4 saas-shadow">
                                <div className="space-y-1">
                                    {TOP_MEMBERS.map((member, i) => (
                                        <div
                                            key={member.name}
                                            className="flex items-center gap-4 p-4 rounded-3xl hover:bg-white/5 transition-all group"
                                        >
                                            <div className="text-[14px] font-black text-white/20 w-4">{i + 1}</div>
                                            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-white/10">
                                                <Image src={member.avatar} alt={member.name} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-[13px] font-black text-white truncate uppercase tracking-tight">{member.name}</div>
                                                <div className="flex items-center gap-2">
                                                    <div className="text-[10px] font-black text-primary uppercase tracking-widest">LVL {member.level}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[12px] font-black text-white font-headline">{member.points}</div>
                                                <div className="text-[9px] font-black text-white/20 uppercase">Points</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Rules/Guidelines */}
                        <div className="bg-[#14141d] border border-white/5 rounded-[40px] p-8 lg:p-10 saas-shadow space-y-6">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="w-5 h-5 text-primary" />
                                <h4 className="text-[18px] font-black text-white uppercase tracking-tighter font-headline">Guidelines</h4>
                            </div>
                            <div className="space-y-4">
                                {[
                                    "Be respectful to all members.",
                                    "No spoilers in post titles.",
                                    "Use appropriate category tags.",
                                    "No hate speech or harassment.",
                                    "Enjoy the anime experience!"
                                ].map((rule, i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <div className="text-[12px] font-black text-primary/40 group-hover:text-primary transition-colors">0{i + 1}</div>
                                        <p className="text-[13px] text-white/40 font-medium leading-relaxed group-hover:text-white/60 transition-colors">{rule}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}