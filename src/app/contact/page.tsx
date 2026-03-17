'use client';

import { Mail, Send, MessageSquare, Info, ShieldCheck, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setSubmitting(true);
  };

  return (
    <div className="min-h-screen bg-background py-12 md:py-24 relative overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none z-0">
        <div 
          className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[130%] h-[130%] opacity-[0.08] blur-[140px] rounded-full transition-colors duration-1000"
          style={{ 
            background: `radial-gradient(circle, var(--color-primary) 0%, transparent 70%)`,
          }}
        />
      </div>

      <div className="container max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Info */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-primary/10 border border-primary/20">
                <MessageSquare className="w-7 h-7 text-primary" />
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                Contact <span className="text-primary">Us</span>
              </h1>
              <p className="text-white/40 text-sm font-medium uppercase tracking-[0.3em]">
                Get in touch with the team
              </p>
            </div>

            <p className="text-white/50 text-base leading-relaxed max-w-md italic border-l-2 border-primary/30 pl-6">
              "Please submit your inquiry using the form below and we will get in touch with you shortly."
            </p>

            <div className="space-y-4 pt-4">
              {[
                { icon: Info, title: "General Inquiries", desc: "For help with your account or streaming issues." },
                { icon: ShieldCheck, title: "Legal & DMCA", desc: "For copyright matters and administrative requests." },
                { icon: Mail, title: "Official Support", desc: "Support@VoidAnime.online" }
              ].map((item, i) => (
                <div key={i} className="flex gap-5 p-5 rounded-[24px] bg-white/[0.02] border border-white/5 saas-shadow group hover:bg-white/[0.04] transition-all">
                  <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white/90 text-xs font-black uppercase tracking-widest mb-1">{item.title}</h3>
                    <p className="text-white/30 text-[11px] font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[40px] p-8 md:p-12 border border-white/5 saas-shadow relative overflow-hidden">
              
              {submitted ? (
                <div className="py-20 text-center space-y-6 animate-in zoom-in-95 duration-500">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border border-primary/20 text-primary">
                    <Send className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Message Received</h2>
                  <p className="text-white/40 text-sm max-w-xs mx-auto">
                    Thanks for reaching out! Our team will get back to you as soon as possible.
                  </p>
                  <button 
                    onClick={() => setSubmitting(false)}
                    className="text-[10px] font-black text-primary uppercase tracking-[0.3em] hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">
                      Your email
                    </label>
                    <input 
                      type="email" 
                      required
                      placeholder="name@voidanime.online"
                      className="w-full h-16 px-8 rounded-3xl bg-black/40 border border-white/5 focus:border-primary/50 text-white text-sm outline-none transition-all placeholder:text-white/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">
                      Subject
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="How can we help?"
                      className="w-full h-16 px-8 rounded-3xl bg-black/40 border border-white/5 focus:border-primary/50 text-white text-sm outline-none transition-all placeholder:text-white/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">
                      Message
                    </label>
                    <textarea 
                      required
                      rows={5}
                      placeholder="Tell us more about your inquiry..."
                      className="w-full p-8 rounded-[32px] bg-black/40 border border-white/5 focus:border-primary/50 text-white text-sm outline-none transition-all placeholder:text-white/10 resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full h-16 rounded-3xl bg-primary text-black font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 fill-current" />
                        Send Message
                      </>
                    )}
                  </button>

                  <p className="text-center text-white/20 text-[9px] font-bold uppercase tracking-widest px-8 leading-relaxed">
                    By submitting this form, you agree to our terms of service and privacy policy regarding your submitted data.
                  </p>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
