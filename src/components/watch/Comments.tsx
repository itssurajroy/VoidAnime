'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useComments } from '@/hooks/useComments';
import { useUser } from '@/firebase';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Send, Trash2, Edit2, Loader2, Heart, Reply, MoreHorizontal, Smile, ShieldAlert, XCircle } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ONE_PIECE_EMOJIS, EmojiRenderer } from './OnePieceEmojis';
import { SPAM_GUIDELINES } from '@/lib/spam-guard';

interface CommentsSectionProps {
  animeId: string;
  animeTitle: string;
}

export function CommentsSection({ animeId, animeTitle }: CommentsSectionProps) {
  const { user } = useUser();
  const { comments, loading, addComment, deleteComment, updateComment, likeComment, spamError, setSpamError } = useComments(animeId);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const { userRole } = useUserRole();

  const isAdmin = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'].includes(userRole);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    await addComment(newComment, animeTitle);
    setNewComment('');
  };

  const handleReply = async (commentId: string) => {
    if (!replyContent.trim() || !user) return;
    await addComment(replyContent, animeTitle, commentId);
    setReplyTo(null);
    setReplyContent('');
  };

  const addEmoji = (emojiName: string) => {
    setNewComment(prev => prev + ` :${emojiName}: `);
  };

  const addEmojiToReply = (emojiName: string) => {
    setReplyContent(prev => prev + ` :${emojiName}: `);
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-6 sm:pb-8">
        <div className="flex items-center gap-5">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl sm:rounded-[20px] bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(244,63,94,0.15)] border border-primary/20 transition-transform hover:scale-110">
            <MessageCircle className="w-5 h-5 sm:w-7 sm:h-7 fill-current" />
          </div>
          <div>
            <h3 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tighter leading-none">Community Comments</h3>
            <p className="text-white/20 text-[11px] font-black uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {comments.length} Comments
            </p>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="h-10 px-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest transition-all gap-2 text-white/40 hover:text-white w-full sm:w-auto justify-center">
              <ShieldAlert className="w-4 h-4 text-primary" />
              Spam Guidelines
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0B0C10] border-white/10 rounded-[24px] sm:rounded-[40px] max-w-[calc(100vw-2rem)] sm:max-w-xl p-4 sm:p-8 backdrop-blur-3xl shadow-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <DialogClose asChild>
                  <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all mb-2">
                    <XCircle className="w-5 h-5" />
                  </button>
                </DialogClose>
              </div>
              <DialogTitle className="text-xl sm:text-3xl font-black text-white uppercase tracking-tighter">Community Guidelines</DialogTitle>
              <DialogDescription className="text-white/40 text-sm font-medium">
                To maintain a high-quality streaming community, we enforce strict guidelines on automated or repetitive behavior.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-8 space-y-4">
              {SPAM_GUIDELINES.map((rule, idx) => (
                <div key={idx} className="p-3 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/[0.03] border border-white/5 space-y-2 group hover:bg-white/[0.06] transition-all">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-2">
                      <span className="text-primary/40">#{idx + 1}</span>
                      {rule.title}
                    </h4>
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border",
                      rule.severity === 'High' ? "text-red-400 border-red-400/20 bg-red-400/10" :
                        rule.severity === 'Medium' ? "text-yellow-400 border-yellow-400/20 bg-yellow-400/10" :
                          "text-blue-400 border-blue-400/20 bg-blue-400/10"
                    )}>
                      {rule.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/30 font-medium leading-relaxed uppercase tracking-wide">{rule.description}</p>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Comment Input */}
      {user ? (
        <div className="space-y-4">
          {spamError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-red-500" />
                <p className="text-[11px] font-black text-red-500 uppercase tracking-widest">{spamError}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSpamError(null)} className="h-8 w-8 p-0 rounded-lg hover:bg-red-500/10 text-red-500">
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
          )}
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-600/30 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[32px]" />
            <div className="relative bg-white/[0.03] border border-white/10 rounded-[20px] sm:rounded-[32px] p-2 sm:p-3 flex flex-col gap-3 backdrop-blur-3xl saas-shadow group-focus-within:border-primary/30 transition-all duration-500">
              <Textarea
                placeholder="Contribute to the conversation..."
                value={newComment}
                onChange={(e) => {
                  setNewComment(e.target.value);
                  if (spamError) setSpamError(null);
                }}
                className="min-h-[80px] sm:min-h-[120px] bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-white/10 text-[13px] sm:text-[15px] font-medium resize-none px-3 sm:px-6 pt-3 sm:pt-6 custom-scrollbar"
              />
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-2 sm:px-4 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                    <Avatar className="w-7 h-7 border border-white/10 shadow-lg">
                      <AvatarImage src={user.photoURL || ''} />
                      <AvatarFallback className="bg-primary/20 text-primary text-[9px] font-black">{user.displayName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest truncate max-w-[150px] hidden sm:inline">Signed in as {user.displayName}</span>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button type="button" variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white/5 text-white/40 hover:text-primary">
                        <Smile className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="grid grid-cols-5 gap-2 p-3 bg-background border-white/10 rounded-2xl backdrop-blur-3xl">
                      {ONE_PIECE_EMOJIS.map((emoji) => (
                        <button
                          key={emoji.name}
                          type="button"
                          onClick={() => addEmoji(emoji.name)}
                          className="w-10 h-10 p-1.5 hover:bg-white/5 rounded-lg transition-transform hover:scale-110"
                          title={emoji.name}
                        >
                          {emoji.svg}
                        </button>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="h-12 px-8 rounded-2xl bg-primary text-black font-black uppercase tracking-widest text-[11px] shadow-[0_15px_30px_-5px_rgba(244,63,94,0.4)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale w-full sm:w-auto"
                >
                  <Send className="w-4 h-4 mr-2.5" />
                  Post Comment
                </Button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white/[0.02] border border-white/5 border-dashed rounded-[20px] sm:rounded-[32px] p-6 sm:p-12 text-center space-y-6 saas-shadow">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-2 opacity-20">
            <MessageCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <p className="text-white/60 text-lg font-black uppercase tracking-tight">Login Required</p>
            <p className="text-white/20 text-sm font-medium italic">Sign in to your account to join the global discussion.</p>
          </div>
          <Link href="/welcome">
            <Button className="rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[11px] px-8 h-12 hover:bg-white/90 shadow-xl transition-all hover:-translate-y-1">Login to Join</Button>
          </Link>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6 opacity-30">
            <div className="relative">
              <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
              <Loader2 className="w-10 h-10 animate-spin text-primary relative" />
            </div>
            <p className="text-[11px] font-black uppercase tracking-[0.4em] animate-pulse">Loading Comments...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.length === 0 ? (
              <div className="py-20 text-center space-y-4 opacity-20">
                <p className="text-[10px] font-black uppercase tracking-[0.5em]">No comments yet</p>
                <p className="text-sm italic font-medium">Be the first to leave a mark on this series.</p>
              </div>
            ) : comments.map((comment) => (
              <div key={comment.id} className="group relative bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-primary/20 rounded-[20px] sm:rounded-[32px] p-4 sm:p-8 transition-all duration-700 saas-shadow">
                <div className="flex gap-3 sm:gap-6">
                  {/* Avatar */}
                  <div className="shrink-0 pt-1">
                    <div className="relative">
                      <Avatar className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl border-2 border-white/5 shadow-2xl transition-transform group-hover:scale-105">
                        <AvatarImage src={comment.userAvatar || ''} />
                        <AvatarFallback className="bg-white/5 text-white/20 font-black text-lg">{comment.userName?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg bg-emerald-500/20 border-2 border-[#0B0C10] flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                      </div>
                    </div>
                  </div>

                  {/* Comment Content */}
                  <div className="flex-1 min-w-0 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Link href={`/profile/${comment.userName}`} className="text-[15px] font-black uppercase tracking-tight text-white hover:text-primary transition-colors">
                          {comment.userName}
                        </Link>
                        <div className="w-1.5 h-1.5 rounded-full bg-white/5" />
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.1em]">
                          {formatDistanceToNow(comment.createdAt?.toDate() || new Date())} ago
                        </span>
                        {comment.editCount && comment.editCount > 0 && (
                          <span className="text-[9px] font-black text-primary/40 uppercase tracking-widest italic font-serif">Edited</span>
                        )}
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2.5 hover:bg-white/5 rounded-xl text-white/10 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background border-white/10 rounded-2xl p-2 min-w-[160px] backdrop-blur-3xl shadow-2xl">
                          {(user?.uid === comment.userId || isAdmin) && (
                            <>
                              <DropdownMenuItem className="rounded-xl focus:bg-white/5 transition-all text-[10px] font-black uppercase tracking-widest py-3 cursor-pointer">
                                <Edit2 className="w-3.5 h-3.5 mr-3 text-blue-400" /> Edit Comment
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => deleteComment(comment.id)}
                                className="rounded-xl focus:bg-red-500/10 text-red-400 focus:text-red-400 transition-all text-[10px] font-black uppercase tracking-widest py-3 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5 mr-3" /> Delete Comment
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem className="rounded-xl focus:bg-white/5 transition-all text-[10px] font-black uppercase tracking-widest py-3 cursor-pointer">
                            Report Content
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="text-white/70 text-[15px] leading-relaxed font-medium selection:bg-primary selection:text-black">
                      <EmojiRenderer content={comment.content} />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-8 pt-2">
                      <button
                        onClick={() => likeComment(comment.id)}
                        className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-primary transition-all group/btn"
                      >
                        <Heart className="w-4 h-4 transition-transform group-hover/btn:scale-125" />
                        <span className="group-hover/btn:translate-x-1 transition-transform">Like</span>
                      </button>
                      <button
                        onClick={() => setReplyTo(comment.id)}
                        className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-primary transition-all group/btn"
                      >
                        <Reply className="w-4 h-4 transition-transform group-hover/btn:rotate-12" />
                        <span className="group-hover/btn:translate-x-1 transition-transform">Reply</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Reply Box */}
                {replyTo === comment.id && (
                  <div className="mt-4 sm:mt-8 ml-0 sm:ml-20 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="bg-white/[0.03] rounded-[24px] p-3 flex flex-col gap-3 border border-primary/20 backdrop-blur-3xl saas-shadow">
                      <Textarea
                        autoFocus
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder={`Reply to ${comment.userName}...`}
                        className="min-h-[100px] bg-transparent border-none focus-visible:ring-0 text-white text-[14px] resize-none px-4 pt-4"
                      />
                      <div className="flex justify-between items-center p-2 border-t border-white/5">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button type="button" variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white/5 text-white/40 hover:text-primary">
                              <Smile className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="grid grid-cols-5 gap-2 p-3 bg-background border-white/10 rounded-2xl backdrop-blur-3xl">
                            {ONE_PIECE_EMOJIS.map((emoji) => (
                              <button
                                key={emoji.name}
                                type="button"
                                onClick={() => addEmojiToReply(emoji.name)}
                                className="w-10 h-10 p-1.5 hover:bg-white/5 rounded-lg transition-transform hover:scale-110"
                                title={emoji.name}
                              >
                                {emoji.svg}
                              </button>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="flex gap-3">
                          <Button variant="ghost" size="sm" onClick={() => setReplyTo(null)} className="text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/5">Cancel</Button>
                          <Button onClick={() => handleReply(comment.id)} size="sm" className="bg-primary text-black text-[10px] font-black uppercase tracking-widest h-9 px-6 rounded-xl shadow-lg shadow-primary/20">Post Reply</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
