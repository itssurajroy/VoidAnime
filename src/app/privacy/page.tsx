import { ShieldCheck, Eye, Lock, Database, Globe, UserCheck, Bell, Cookie } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | VoidAnime',
  description: 'Privacy Policy for VoidAnime - Understanding how we protect your data.',
};

export default function PrivacyPage() {
  const sections = [
    {
      id: "1",
      title: "Information Collection",
      icon: Database,
      content: "We collect several different types of information for various purposes to provide and improve our Service to you. This includes:",
      list: [
        "Personal Data: Email address, username, and profile preferences when you create an account.",
        "Usage Data: Information on how the Service is accessed and used (e.g., your IP address, browser type, and time spent on pages).",
        "Tracking & Cookies Data: We use cookies and similar tracking technologies to track activity on our Service and hold certain information."
      ]
    },
    {
      id: "2",
      title: "Use of Data",
      icon: UserCheck,
      content: "VoidAnime uses the collected data for various purposes:",
      list: [
        "To provide and maintain our Service.",
        "To notify you about changes to our Service.",
        "To allow you to participate in interactive features of our Service.",
        "To provide customer support.",
        "To gather analysis or valuable information so that we can improve our Service.",
        "To monitor the usage of our Service.",
        "To detect, prevent and address technical issues."
      ]
    },
    {
      id: "3",
      title: "Cookies and Tracking",
      icon: Cookie,
      content: "Cookies are files with small amount of data which may include an anonymous unique identifier. We use cookies to:",
      list: [
        "Remember your preferences and various settings.",
        "Authenticate users and prevent fraudulent use of user accounts.",
        "Understand user behavior and site traffic patterns."
      ],
      footer: "You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service."
    },
    {
      id: "4",
      title: "Third-Party Services",
      icon: Globe,
      content: "We may employ third-party companies and individuals to facilitate our Service ('Service Providers'), to provide the Service on our behalf, or to perform Service-related services. These include:",
      list: [
        "Firebase (by Google): Used for authentication, database management, and hosting.",
        "Google Analytics: Used to monitor and analyze the use of our Service.",
        "External Player Providers: Such as Megaplay, which may have their own privacy policies regarding data handled within their iframes."
      ]
    },
    {
      id: "5",
      title: "Data Security",
      icon: Lock,
      content: "The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security."
    },
    {
      id: "6",
      title: "Your Rights",
      icon: Eye,
      content: "Depending on your location, you may have the following data protection rights:",
      list: [
        "The right to access, update or delete the information we have on you.",
        "The right of rectification.",
        "The right to object or restrict processing.",
        "The right to data portability."
      ],
      footer: "If you wish to be informed what Personal Data we hold about you or if you want it to be removed from our systems, please contact us."
    },
    {
      id: "7",
      title: "Children's Privacy",
      icon: ShieldCheck,
      content: "Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If you are a parent or guardian and you are aware that your Children has provided us with Personal Data, please contact us."
    },
    {
      id: "8",
      title: "Changes to This Policy",
      icon: Bell,
      content: "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'effective date' at the top of this Privacy Policy."
    }
  ];

  return (
    <div className="min-h-screen bg-background py-12 md:py-24 relative overflow-x-hidden text-zinc-100">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none z-0">
        <div 
          className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[140%] h-[140%] opacity-[0.05] blur-[140px] rounded-full"
          style={{ 
            background: `radial-gradient(circle, var(--color-primary) 0%, transparent 70%)`,
          }}
        />
      </div>

      <div className="container max-w-5xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20 space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-primary/10 border border-primary/20 animate-pulse">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
            Privacy <span className="text-primary">&</span> Security
          </h1>
          <p className="text-white/40 text-sm font-medium uppercase tracking-[0.4em]">
            Effective Date: March 3, 2026
          </p>
        </div>

        {/* Content Sections */}
        <div className="grid gap-8">
          {sections.map((section) => (
            <section 
              key={section.id} 
              className="bg-white/[0.02] backdrop-blur-2xl rounded-[40px] p-8 md:p-12 border border-white/5 saas-shadow group hover:bg-white/[0.04] transition-all duration-500"
            >
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/5 border border-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-black transition-all duration-500">
                  <section.icon className="w-6 h-6" />
                </div>
                
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="text-primary font-black text-2xl tracking-tighter opacity-20">{section.id.padStart(2, '0')}</span>
                    <h2 className="text-xl font-black text-white uppercase tracking-widest">{section.title}</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-white/50 text-sm leading-relaxed">
                      {section.content}
                    </p>
                    
                    {section.list && (
                      <ul className="grid gap-3 pl-4">
                        {section.list.map((item, i) => (
                          <li key={i} className="flex gap-4 items-start text-white/40 text-xs italic">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0 shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.5)]" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.footer && (
                      <p className="text-white/30 text-xs leading-relaxed pt-4 border-t border-white/5 italic">
                        {section.footer}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-20 text-center space-y-4">
          <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.3em]">
            © VoidAnime Security Division. All rights reserved.
          </p>
          <div className="flex justify-center gap-6">
            <Link href="/contact" className="text-[9px] font-black text-white/40 uppercase tracking-widest hover:text-primary transition-colors">Contact Security</Link>
            <Link href="/terms" className="text-[9px] font-black text-white/40 uppercase tracking-widest hover:text-primary transition-colors">Terms of Use</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
