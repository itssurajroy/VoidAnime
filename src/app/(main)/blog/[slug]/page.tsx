'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Clock, Eye, ArrowLeft, Loader2, PenLine, Calendar, Share2, Twitter } from 'lucide-react';
import { getBlogPostBySlug, incrementBlogPostViews, BlogPost } from '@/lib/firebase/firestore';

function BlogPostContent({ slug }: { slug: string }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const data = await getBlogPostBySlug(slug);
        if (data) {
          setPost(data);
          incrementBlogPostViews(data.id).catch(console.error);
        }
      } catch (error) {
        console.error('Failed to fetch blog post:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] pt-24 pb-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-anime-primary animate-spin" />
          <p className="text-zinc-400">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return notFound();
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <article className="min-h-screen bg-[#0D0D0D] pt-24 pb-16">
      <div className="w-full px-6 md:px-10 lg:px-16 max-w-4xl mx-auto">
        
        {/* Back Button */}
        <Link 
          href="/blog"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-12">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-anime-primary text-white text-sm font-bold rounded-full">
              {post.category}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-white mb-6 leading-tight">
            {post.title}
          </h1>
          
          <p className="text-xl text-zinc-400 mb-8 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Author & Meta */}
          <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-[#2A2A2A]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-anime-primary to-anime-secondary flex items-center justify-center">
                <span className="text-white font-bold">
                  {post.author.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-white">{post.author}</p>
                <div className="flex items-center gap-3 text-sm text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(post.publishedAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime} min read
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-auto">
              <button className="p-2 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] text-zinc-400 hover:text-white hover:border-anime-primary transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://voidanime.online/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] text-zinc-400 hover:text-white hover:border-anime-primary transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative aspect-video mb-12 rounded-3xl overflow-hidden">
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          <div 
            className="text-zinc-300 leading-relaxed space-y-6"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-[#2A2A2A]">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-[#1A1A1A] border border-[#2A2A2A] text-zinc-400 text-sm rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author Box */}
        <div className="mt-12 p-8 rounded-3xl bg-[#1A1A1A]/40 border border-[#2A2A2A]">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-anime-primary to-anime-secondary flex items-center justify-center shrink-0">
              <span className="text-2xl text-white font-bold">
                {post.author.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">Written by {post.author}</h3>
              <p className="text-zinc-400 text-sm">
                Anime enthusiast and writer at VoidAnime. Passionate about sharing knowledge and helping the community discover amazing content.
              </p>
            </div>
          </div>
        </div>

        {/* More Articles */}
        <div className="mt-16">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-anime-primary text-white font-bold hover:shadow-lg hover:shadow-anime-primary/30 transition-all"
          >
            View All Articles
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Link>
        </div>

      </div>
    </article>
  );
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0D0D0D] pt-24 pb-16 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-anime-primary animate-spin" />
      </div>
    }>
      <BlogPostContent slug={decodeURIComponent(slug)} />
    </Suspense>
  );
}
