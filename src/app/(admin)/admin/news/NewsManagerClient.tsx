'use client';

import React, { useState } from 'react';
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
import { Loader2, Trash2, PlusCircle, MoreHorizontal, Pencil, Eye, CheckCircle2, XCircle, Search, Newspaper, Send, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveNewsAction, deleteNewsAction } from '@/actions/news';
import type { NewsItem } from '@/types';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface NewsManagerClientProps {
    initialNews: NewsItem[];
}

export default function NewsManagerClient({ initialNews }: NewsManagerClientProps) {
    const { toast } = useToast();
    const [news, setNews] = useState<NewsItem[]>(initialNews);
    const [isDialogOpen, setIsLinkDialogOpen] = useState(false);
    const [editingNews, setEditingNews] = useState<Partial<NewsItem> | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    
    // Editor State
    const [content, setContent] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    const handleOpenDialog = (item: NewsItem | null) => {
        const defaultNews: Partial<NewsItem> = item || {
            title: '',
            slug: '',
            description: '',
            content: '',
            type: 'article',
            status: 'draft',
            tags: [],
            seoTitle: '',
            seoDescription: '',
            thumbnailText: ['', ''],
            gradient: 'from-zinc-800 to-zinc-900',
            image: '',
        };
        
        setEditingNews(defaultNews);
        setContent(defaultNews.content || '');
        setTags(defaultNews.tags || []);
        setTagInput('');
        setIsPreviewMode(false);
        setIsLinkDialogOpen(true);
    };

    const handleDeleteNews = async (id: string) => {
        if (!confirm('Are you sure you want to delete this article?')) return;
        
        const result = await deleteNewsAction(id);
        if (result.success) {
            setNews(prev => prev.filter(item => item.id !== id));
            toast({ title: "Success", description: "Article deleted." });
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
    };

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSaveNews = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);
        
        const formData = new FormData(e.currentTarget);
        const data: Partial<NewsItem> = {
            ...editingNews,
            title: formData.get('title') as string,
            slug: formData.get('slug') as string,
            description: formData.get('description') as string,
            content: content,
            status: formData.get('status') as any,
            tags: tags,
            seoTitle: formData.get('seoTitle') as string,
            seoDescription: formData.get('seoDescription') as string,
            image: formData.get('image') as string,
            gradient: formData.get('gradient') as string,
            type: formData.get('type') as any,
            thumbnailText: [
                formData.get('thumb1') as string,
                formData.get('thumb2') as string,
            ]
        };

        const result = await saveNewsAction(data);
        setIsSaving(false);

        if (result.success) {
            toast({ title: "Success", description: "Article saved successfully." });
            setIsLinkDialogOpen(false);
            window.location.reload();
        } else {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        }
    };

    return (
        <div className="space-y-6">
            <Card className="bg-white/[0.02] border-white/5">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-black uppercase tracking-tighter">Content Studio</CardTitle>
                        <CardDescription className="text-white/40">Manage blog posts, announcements, and news.</CardDescription>
                    </div>
                    <Button onClick={() => handleOpenDialog(null)} className="font-bold uppercase tracking-widest text-xs">
                        <PlusCircle className="mr-2 h-4 w-4" /> New Article
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="rounded-xl border border-white/10 overflow-hidden bg-background/50">
                        <Table>
                            <TableHeader className="bg-white/5">
                                <TableRow className="hover:bg-transparent border-white/10">
                                    <TableHead className="font-black uppercase tracking-widest text-[10px] text-white/40">Title</TableHead>
                                    <TableHead className="font-black uppercase tracking-widest text-[10px] text-white/40">Status</TableHead>
                                    <TableHead className="font-black uppercase tracking-widest text-[10px] text-white/40">Date</TableHead>
                                    <TableHead className="text-right w-[100px] font-black uppercase tracking-widest text-[10px] text-white/40">Actions</TableHead>
                                </TableRow></TableHeader>
                            <TableBody>
                                {news.length > 0 ? news.map((item) => (
                                    <TableRow key={item.id} className="border-white/10 hover:bg-white/[0.02]">
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-white truncate max-w-[300px]">{item.title}</span>
                                                <span className="text-[10px] text-white/40 font-mono mt-1">/{item.slug || 'no-slug'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn(
                                                "font-black text-[9px] uppercase tracking-widest",
                                                item.status === 'published' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : 
                                                item.status === 'archived' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                                "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                            )}>
                                                {item.status || 'draft'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-white/40 text-xs font-medium">
                                            {format(new Date(item.createdAt), 'MMM dd, yyyy')}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="hover:bg-white/10 hover:text-white"><MoreHorizontal className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-zinc-950 border-white/10 rounded-xl">
                                                    <DropdownMenuItem onClick={() => handleOpenDialog(item)} className="cursor-pointer font-bold text-xs focus:bg-white/10 focus:text-white">
                                                        <Pencil className="mr-2 h-3.5 w-3.5" /> Edit Article
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDeleteNews(item.id)} className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-400 font-bold text-xs">
                                                        <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-20">
                                            <div className="flex flex-col items-center gap-2">
                                                <Newspaper className="h-8 w-8 text-white/20 mb-2" />
                                                <span className="font-black uppercase tracking-widest text-white/40 text-xs">No Content Found</span>
                                                <span className="text-white/20 text-[10px]">Your studio is empty. Create a new article to get started.</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsLinkDialogOpen}>
                <DialogContent className="max-w-5xl h-[90vh] p-0 flex flex-col bg-zinc-950 border-white/10 rounded-[32px] overflow-hidden">
                    <DialogHeader className="p-6 border-b border-white/5 shrink-0 bg-background/50">
                        <DialogTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                            {editingNews?.id ? 'Edit Article' : 'New Article'}
                            {editingNews?.status && (
                                <Badge variant="outline" className="bg-white/5 text-white/60 border-white/10 ml-2">
                                    {editingNews.status}
                                </Badge>
                            )}
                        </DialogTitle>
                    </DialogHeader>
                    
                    <form onSubmit={handleSaveNews} className="flex-1 flex flex-col min-h-0">
                        <Tabs defaultValue="content" className="flex-1 flex flex-col min-h-0">
                            <div className="px-6 pt-4 shrink-0 bg-background/30">
                                <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl">
                                    <TabsTrigger value="content" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                                        <Pencil className="w-3.5 h-3.5" />
                                        Content
                                    </TabsTrigger>
                                    <TabsTrigger value="publishing" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                                        <Send className="w-3.5 h-3.5" />
                                        Publishing
                                    </TabsTrigger>
                                    <TabsTrigger value="seo" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                                        <Search className="w-3.5 h-3.5" />
                                        SEO Meta
                                    </TabsTrigger>
                                    <TabsTrigger value="appearance" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                                        <Image className="w-3.5 h-3.5" />
                                        Appearance
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                                {/* CONTENT TAB */}
                                <TabsContent value="content" className="m-0 space-y-6 h-full flex flex-col">
                                    <div className="space-y-2 shrink-0">
                                        <Label htmlFor="title" className="text-xs font-black uppercase tracking-widest text-white/60">Article Title</Label>
                                        <Input id="title" name="title" defaultValue={editingNews?.title} required placeholder="The Next Generation of Streaming..." className="text-lg font-bold h-14 bg-white/5 border-white/10" />
                                    </div>
                                    <div className="space-y-2 shrink-0">
                                        <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-white/60">Excerpt / Subtitle</Label>
                                        <Textarea id="description" name="description" defaultValue={editingNews?.description} required placeholder="A brief hook for the article card..." rows={2} className="bg-white/5 border-white/10 resize-none" />
                                    </div>
                                    
                                    <div className="flex-1 flex flex-col space-y-2 min-h-[400px]">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs font-black uppercase tracking-widest text-white/60">Main Content (Markdown)</Label>
                                            <Button 
                                                type="button" 
                                                variant="ghost" 
                                                size="sm" 
                                                onClick={() => setIsPreviewMode(!isPreviewMode)}
                                                className="h-8 text-[10px] font-bold uppercase tracking-widest"
                                            >
                                                {isPreviewMode ? <><Pencil className="w-3 h-3 mr-2" /> Edit Source</> : <><Eye className="w-3 h-3 mr-2" /> Live Preview</>}
                                            </Button>
                                        </div>
                                        {isPreviewMode ? (
                                            <div className="flex-1 border border-white/10 rounded-xl p-6 bg-white/[0.02] overflow-y-auto prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-white/10">
                                                {content ? (
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                                                ) : (
                                                    <div className="text-white/20 italic">Nothing to preview...</div>
                                                )}
                                            </div>
                                        ) : (
                                            <Textarea 
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                                placeholder="## Write your amazing content here...&#10;&#10;Supports **Markdown**, links, lists, and more." 
                                                className="flex-1 bg-white/5 border-white/10 font-mono text-sm leading-relaxed p-4 resize-none" 
                                            />
                                        )}
                                    </div>
                                </TabsContent>

                                {/* PUBLISHING TAB */}
                                <TabsContent value="publishing" className="m-0 space-y-6">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="status" className="text-xs font-black uppercase tracking-widest text-white/60">Status</Label>
                                                <Select name="status" defaultValue={editingNews?.status || 'draft'}>
                                                    <SelectTrigger className="bg-white/5 border-white/10">
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="draft">Draft (Hidden)</SelectItem>
                                                        <SelectItem value="published">Published (Live)</SelectItem>
                                                        <SelectItem value="archived">Archived</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label htmlFor="type" className="text-xs font-black uppercase tracking-widest text-white/60">Content Type</Label>
                                                <Select name="type" defaultValue={editingNews?.type || 'article'}>
                                                    <SelectTrigger className="bg-white/5 border-white/10">
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="article">Full Article</SelectItem>
                                                        <SelectItem value="megaphone">Platform Announcement</SelectItem>
                                                        <SelectItem value="rss">External RSS Sync</SelectItem>
                                                        <SelectItem value="default">Quick Update</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-black uppercase tracking-widest text-white/60">Tags & Categories</Label>
                                                <div className="flex gap-2">
                                                    <Input 
                                                        value={tagInput}
                                                        onChange={(e) => setTagInput(e.target.value)}
                                                        onKeyDown={handleAddTag}
                                                        placeholder="Press Enter to add tag..."
                                                        className="bg-white/5 border-white/10"
                                                    />
                                                    <Button type="button" variant="secondary" onClick={() => handleAddTag({ key: 'Enter', preventDefault: () => {} } as any)}>Add</Button>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mt-3 p-3 min-h-[60px] bg-white/[0.02] border border-white/5 rounded-xl">
                                                    {tags.length > 0 ? tags.map(tag => (
                                                        <Badge key={tag} variant="secondary" className="bg-white/10 hover:bg-white/20 text-xs py-1 px-3 flex items-center gap-2">
                                                            {tag}
                                                            <XCircle className="w-3 h-3 cursor-pointer hover:text-red-400" onClick={() => handleRemoveTag(tag)} />
                                                        </Badge>
                                                    )) : (
                                                        <span className="text-xs text-white/20 italic self-center">No tags added</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* SEO TAB */}
                                <TabsContent value="seo" className="m-0 space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="slug" className="text-xs font-black uppercase tracking-widest text-white/60">URL Slug / Permalink</Label>
                                        <div className="flex">
                                            <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-white/10 bg-white/5 text-white/40 text-sm font-mono">
                                                /news/
                                            </span>
                                            <Input id="slug" name="slug" defaultValue={editingNews?.slug} placeholder="leave-empty-to-auto-generate" className="rounded-l-none bg-white/5 border-white/10 font-mono" />
                                        </div>
                                        <p className="text-[10px] text-white/40 mt-1">Leave blank to auto-generate from title.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="seoTitle" className="text-xs font-black uppercase tracking-widest text-white/60">SEO Title</Label>
                                        <Input id="seoTitle" name="seoTitle" defaultValue={editingNews?.seoTitle} placeholder="Overrides article title for search engines" className="bg-white/5 border-white/10" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="seoDescription" className="text-xs font-black uppercase tracking-widest text-white/60">SEO Meta Description</Label>
                                        <Textarea id="seoDescription" name="seoDescription" defaultValue={editingNews?.seoDescription} placeholder="Brief summary for Google search results..." rows={3} className="bg-white/5 border-white/10" />
                                    </div>
                                    
                                    <Card className="bg-black/50 border-white/10 overflow-hidden">
                                        <CardHeader className="p-4 border-b border-white/5 bg-white/5">
                                            <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                                <Search className="w-3 h-3 text-blue-400" /> Search Engine Preview
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4 space-y-1">
                                            <div className="text-xs text-white/60 flex items-center gap-2 font-mono">
                                                <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">Ad</span> https://yourdomain.com/news/<span className="text-white">slug-preview</span>
                                            </div>
                                            <div className="text-lg text-[#8ab4f8] font-medium hover:underline cursor-pointer">
                                                SEO Title Preview or Article Title
                                            </div>
                                            <div className="text-sm text-[#bdc1c6] leading-snug">
                                                This is how your article might appear in search engine results. Write a compelling description to increase click-through rates.
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* APPEARANCE TAB */}
                                <TabsContent value="appearance" className="m-0 space-y-8">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="image" className="text-xs font-black uppercase tracking-widest text-white/60">Cover Image URL</Label>
                                            <Input id="image" name="image" defaultValue={editingNews?.image} placeholder="https://..." className="bg-white/5 border-white/10" />
                                            <p className="text-[10px] text-white/40">Used as the hero image and Open Graph thumbnail.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-6 border-t border-white/5">
                                        <div className="flex flex-col">
                                            <Label className="text-xs font-black uppercase tracking-widest text-white/60">Fallback Gradient Card</Label>
                                            <p className="text-[10px] text-white/40 mt-1 mb-4">If no image is provided, these settings create a stylish CSS gradient card.</p>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="gradient" className="text-[10px] font-bold text-white/60">Tailwind Gradient Classes</Label>
                                                <Input id="gradient" name="gradient" defaultValue={editingNews?.gradient || 'from-zinc-800 to-zinc-900'} placeholder="e.g., from-fuchsia-900 to-rose-900" className="bg-white/5 border-white/10 font-mono text-xs" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-bold text-white/60">Corner Text 1</Label>
                                                    <Input name="thumb1" defaultValue={editingNews?.thumbnailText?.[0]} placeholder="NEW" className="bg-white/5 border-white/10" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-bold text-white/60">Corner Text 2</Label>
                                                    <Input name="thumb2" defaultValue={editingNews?.thumbnailText?.[1]} placeholder="FEATURE" className="bg-white/5 border-white/10" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                            </div>
                            
                            <DialogFooter className="p-6 border-t border-white/5 shrink-0 bg-background/50 flex justify-between sm:justify-between items-center w-full">
                                <Button variant="ghost" type="button" onClick={() => setIsLinkDialogOpen(false)} className="text-white/60 hover:text-white hover:bg-white/10 uppercase text-xs font-bold tracking-widest px-6">
                                    Discard Changes
                                </Button>
                                <Button type="submit" disabled={isSaving} size="lg" className="rounded-xl font-black uppercase tracking-widest px-8 shadow-lg shadow-primary/20">
                                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-5 w-5" />}
                                    {editingNews?.id ? 'Save Changes' : 'Publish Now'}
                                </Button>
                            </DialogFooter>
                        </Tabs>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
