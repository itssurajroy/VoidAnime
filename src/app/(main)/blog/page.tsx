'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Clock, Eye, ArrowRight, Sparkles, Loader2, PenLine } from 'lucide-react';
import { getBlogPosts, getFeaturedPosts, BlogPost } from '@/lib/firebase/firestore';

const SAMPLE_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'top-anime-2024',
    title: 'Top 10 Anime of 2024 You Need to Watch',
    excerpt: 'From thrilling action series to heartwarming slice of life, discover the best anime that defined this year.',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=800',
    author: 'VoidAnime Team',
    authorImage: '',
    category: 'Recommendations',
    tags: ['anime', 'top 10', '2024'],
    publishedAt: '2024-12-15',
    readTime: 8,
    featured: true,
    views: 12500
  },
  {
    id: '2',
    slug: 'beginner-guide-anime',
    title: 'The Ultimate Beginner\'s Guide to Anime',
    excerpt: 'New to anime? This comprehensive guide covers everything from where to start to understanding different genres.',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    author: 'VoidAnime Team',
    authorImage: '',
    category: 'Guides',
    tags: ['beginner', 'guide', 'tutorial'],
    publishedAt: '2024-11-20',
    readTime: 12,
    featured: true,
    views: 28000
  },
  {
    id: '3',
    slug: 'winter-2025-preview',
    title: 'Winter 2025 Anime Season Preview',
    excerpt: 'Get ready for the new year with our comprehensive preview of the most anticipated winter anime releases.',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1519682577862-22b62b24e491?w=800',
    author: 'VoidAnime Team',
    authorImage: '',
    category: 'Seasonal',
    tags: ['winter', '2025', 'season', 'preview'],
    publishedAt: '2025-01-01',
    readTime: 10,
    featured: true,
    views: 8500
  },
  {
    id: '4',
    slug: 'anime-vs-manga-differences',
    title: 'Anime vs Manga: What\'s the Difference?',
    excerpt: 'Understanding the relationship between anime and manga, and which medium might be right for you.',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800',
    author: 'VoidAnime Team',
    authorImage: '',
    category: 'Guides',
    tags: ['anime', 'manga', 'differences'],
    publishedAt: '2024-10-10',
    readTime: 6,
    featured: false,
    views: 15200
  },
  {
    id: '5',
    slug: 'sololeveling-episode-1-recap',
    title: 'Solo Leveling: A Deep Dive into the Anime Phenomenon',
    excerpt: 'Explore why Solo Leveling became a global sensation and what makes its adaptation so special.',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800',
    author: 'VoidAnime Team',
    authorImage: '',
    category: 'Reviews',
    tags: ['solo leveling', 'review', 'analysis'],
    publishedAt: '2024-09-25',
    readTime: 15,
    featured: false,
    views: 42000
  },
  {
    id: '6',
    slug: 'best-romance-anime',
    title: '8 Best Romance Anime That Will Melt Your Heart',
    excerpt: 'From childhood friends to unexpected encounters, these romance anime series are must-watches.',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800',
    author: 'VoidAnime Team',
    authorImage: '',
    category: 'Recommendations',
    tags: ['romance', 'top list', 'romantic'],
    publishedAt: '2024-08-14',
    readTime: 7,
    featured: false,
    views: 31000
  }
];

const CATEGORIES = [
  { value: 'all', label: 'All Posts' },
  { value: 'guides', label: 'Guides' },
  { value: 'seasonal', label: 'Seasonal' },
  { value: 'recommendations', label: 'Recommendations' },
  { value: 'reviews', label: 'Reviews' },
  { value: 'news', label: 'News' },
];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    async function fetchPosts() {
      try {
        const [allPosts, featured] = await Promise.all([
          getBlogPosts(50),
          getFeaturedPosts()
        ]);
        
        if (allPosts.length === 0) {
          setPosts(SAMPLE_POSTS);
          setFeaturedPosts(SAMPLE_POSTS.filter(p => p.featured));
        } else {
          setPosts(allPosts);
          setFeaturedPosts(featured);
        }
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
        setPosts(SAMPLE_POSTS);
        setFeaturedPosts(SAMPLE_POSTS.filter(p => p.featured));
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const filteredPosts = category === 'all' 
    ? posts 
    : posts.filter(p => p.category.toLowerCase() === category.toLowerCase());

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] pt-24 pb-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-anime-primary animate-spin" />
          <p className="text-zinc-400">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-24 pb-16">
      <div className="w-full px-6 md:px-10 lg:px-16 max-w-7xl mx-auto">
        
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-anime-primary to-anime-secondary mb-6 shadow-lg shadow-anime-primary/30">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-4">
            VoidAnime <span className="text-anime-primary">Blog</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Guides, recommendations, and insights for anime fans. Stay updated with the latest trends and discover your next favorite series.
          </p>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-heading font-black text-white mb-6 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-anime-primary" />
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <Link 
                  key={post.id} 
                  href={`/blog/${post.slug}`}
                  className="group relative rounded-3xl overflow-hidden bg-[#1A1A1A] border border-[#2A2A2A] hover:border-anime-primary/30 transition-all"
                >
                  <div className="aspect-video relative">
                    {post.coverImage ? (
                      <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-anime-primary/20 to-anime-secondary/20" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="inline-block px-2 py-1 bg-anime-primary text-white text-xs font-bold rounded-full mb-2">
                      {post.category}
                    </span>
                    <h3 className="text-xl font-bold text-white group-hover:text-anime-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-zinc-400 text-sm mt-2 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                category === cat.value
                  ? 'bg-anime-primary text-white'
                  : 'bg-[#1A1A1A] border border-[#2A2A2A] text-zinc-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Link 
                key={post.id} 
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-3xl overflow-hidden bg-[#1A1A1A] border border-[#2A2A2A] hover:border-anime-primary/30 transition-all"
              >
                <div className="aspect-video relative">
                  {post.coverImage ? (
                    <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-anime-primary/10 to-anime-secondary/10" />
                  )}
                </div>
                <div className="flex-1 p-6 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-[#2A2A2A] text-zinc-400 text-xs font-bold rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-anime-primary transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-zinc-500 text-sm line-clamp-2 mb-4 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <PenLine className="w-3 h-3" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime} min read
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-zinc-500 mb-2">No articles yet</h3>
            <p className="text-zinc-600">Check back soon for new content!</p>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-20 p-8 md:p-12 rounded-[40px] bg-gradient-to-br from-anime-primary/10 to-anime-secondary/10 border border-[#2A2A2A] text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-black text-white mb-4">
            Never Miss an Article
          </h2>
          <p className="text-zinc-400 mb-6 max-w-xl mx-auto">
            Subscribe to our newsletter and get the latest anime guides, recommendations, and seasonal previews delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] text-white placeholder-zinc-500 focus:outline-none focus:border-anime-primary"
            />
            <button className="px-6 py-3 rounded-2xl bg-anime-primary text-white font-bold hover:shadow-lg hover:shadow-anime-primary/30 transition-all">
              Subscribe
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
