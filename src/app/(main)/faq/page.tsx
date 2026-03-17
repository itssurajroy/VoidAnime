'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, Mail, MessageCircle, Zap, Shield, Search as SearchIcon, User, List, BookOpen, Download } from 'lucide-react';
import Link from 'next/link';

const FAQ_CATEGORIES = [
  { id: 'general', label: 'General' },
  { id: 'account', label: 'Account' },
  { id: 'tracking', label: 'Tracking' },
  { id: 'features', label: 'Features' },
  { id: 'technical', label: 'Technical' },
];

const FAQS = [
  {
    category: 'general',
    question: 'What is VoidAnime?',
    answer: 'VoidAnime is a free anime and manga tracking platform that helps you manage your watchlist, discover new series, and connect with other anime fans. Track your progress, set goals, and earn achievements as you build your anime journey.'
  },
  {
    category: 'general',
    question: 'Is VoidAnime free to use?',
    answer: 'Yes! VoidAnime is completely free to use. We offer premium features through our Pro subscription, but all core functionality is available at no cost forever.'
  },
  {
    category: 'general',
    question: 'How do I get started?',
    answer: 'Simply create an account by clicking "Sign In" and choosing to register with email or social login. Once registered, you can start adding anime and manga to your lists, track your progress, and explore new series through our discovery features.'
  },
  {
    category: 'account',
    question: 'How do I reset my password?',
    answer: 'Go to the login page and click "Forgot Password". Enter your email address and we\'ll send you a link to reset your password.'
  },
  {
    category: 'account',
    question: 'Can I change my username?',
    answer: 'Yes! Go to your Profile Settings to change your username. Note that usernames must be unique and can only be changed once every 30 days.'
  },
  {
    category: 'account',
    question: 'How do I delete my account?',
    answer: 'You can delete your account from Profile Settings > Danger Zone. Note that this action is irreversible and all your data will be permanently deleted.'
  },
  {
    category: 'tracking',
    question: 'How do I add anime to my list?',
    answer: 'Search for any anime and click the "Add to List" button. You can choose which list to add it to (Watching, Completed, Planning, Dropped, or Paused) and mark your progress.'
  },
  {
    category: 'tracking',
    question: 'Can I import my list from MyAnimeList or AniList?',
    answer: 'Yes! We support importing your anime list from MyAnimeList and AniList. Go to Settings > Import to connect your accounts and import your existing list.'
  },
  {
    category: 'tracking',
    question: 'How does the tracking work?',
    answer: 'When you mark episodes as watched, your progress is automatically updated. You can also update your status (Watching, Completed, etc.), add scores, and write notes for each title.'
  },
  {
    category: 'features',
    question: 'What are achievements?',
    answer: 'Achievements are badges you earn by completing various milestones on VoidAnime. Watch 100 anime, maintain a 30-day streak, write reviews, and more to unlock achievements and level up your profile.'
  },
  {
    category: 'features',
    question: 'How do I use the anime randomizer?',
    answer: 'The randomizer helps you decide what to watch next. Filter by genre, status, or other criteria, and let fate decide your next binge. Perfect for when you can\'t decide what to watch!'
  },
  {
    category: 'features',
    question: 'Can I download anime episodes?',
    answer: 'Yes! We provide download links for anime episodes. Navigate to any anime\'s detail page and look for the download button. Note: We don\'t host any content - downloads are sourced from third-party providers.'
  },
  {
    category: 'technical',
    question: 'What browsers are supported?',
    answer: 'VoidAnime works best on modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience.'
  },
  {
    category: 'technical',
    question: 'Is my data secure?',
    answer: 'Absolutely. We use industry-standard encryption to protect your data. Your passwords are hashed and we never share your personal information with third parties. See our Privacy Policy for more details.'
  },
  {
    category: 'technical',
    question: 'How do I report a bug or suggest a feature?',
    answer: 'We\'d love to hear from you! Contact us through the Contact page or reach out on social media. We actively consider all feedback and implement many user suggestions.'
  },
];

function FAQItem({ faq, isOpen, onToggle }: { faq: typeof FAQS[0]; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors pr-4">
          {faq.question}
        </span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-anime-primary shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-zinc-500 shrink-0 group-hover:text-anime-primary transition-colors" />
        )}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 pb-5' : 'max-h-0'}`}>
        <p className="text-sm text-zinc-500 leading-relaxed">
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const filteredFaqs = FAQS.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = !searchQuery || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0D0D0D] pt-24 pb-16">
      <div className="w-full px-6 md:px-10 lg:px-16 max-w-4xl mx-auto">
        
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-anime-primary to-anime-secondary mb-6 shadow-lg shadow-anime-primary/30">
            <HelpCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-4">
            Frequently Asked <span className="text-anime-primary">Questions</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Find answers to common questions about VoidAnime. Can&apos;t find what you&apos;re looking for? Contact our support team.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-10">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for answers..."
            className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-500 focus:border-anime-primary focus:outline-none transition-colors"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
              activeCategory === 'all'
                ? 'bg-anime-primary text-white'
                : 'bg-[#1A1A1A] border border-[#2A2A2A] text-zinc-400 hover:text-white'
            }`}
          >
            All
          </button>
          {FAQ_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                activeCategory === cat.id
                  ? 'bg-anime-primary text-white'
                  : 'bg-[#1A1A1A] border border-[#2A2A2A] text-zinc-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQs */}
        <div className="bg-[#1A1A1A]/40 border border-[#2A2A2A] rounded-3xl p-6 md:p-8">
          {filteredFaqs.length > 0 ? (
            <div className="space-y-0">
              {filteredFaqs.map((faq, index) => (
                <FAQItem
                  key={`${faq.category}-${index}`}
                  faq={faq}
                  isOpen={openFaqIndex === index}
                  onToggle={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <SearchIcon className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500">No results found</p>
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 p-8 md:p-12 rounded-[40px] bg-gradient-to-br from-anime-primary/10 to-anime-secondary/10 border border-[#2A2A2A] text-center">
          <h2 className="text-2xl font-heading font-black text-white mb-4">
            Still Have Questions?
          </h2>
          <p className="text-zinc-400 mb-6 max-w-xl mx-auto">
            Our support team is here to help. Reach out to us and we&apos;ll get back to you as soon as possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-anime-primary text-white rounded-xl font-bold hover:shadow-lg hover:shadow-anime-primary/30 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              Contact Support
            </Link>
            <a 
              href="mailto:support@voidanime.online"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-xl font-bold hover:border-white/20 transition-all"
            >
              <Mail className="w-5 h-5" />
              Email Us
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
