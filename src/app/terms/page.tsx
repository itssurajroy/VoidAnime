import { FileText, ShieldCheck, Scale, Info, Globe, Gavel } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms and Conditions | VoidAnime',
  description: 'Website Terms and Conditions of Use for VoidAnime.',
};

export default function TermsPage() {
  const sections = [
    {
      id: "1",
      title: "Terms",
      icon: Globe,
      content: "By accessing this Website, accessible from your current domain, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site. The materials contained in this Website are protected by copyright and trade mark law."
    },
    {
      id: "2",
      title: "Use License",
      icon: FileText,
      content: "Permission is granted to temporarily download one copy of the materials on VoidAnime's Website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:",
      list: [
        "modify or copy the materials;",
        "use the materials for any commercial purpose or for any public display;",
        "attempt to reverse engineer any software contained on VoidAnime's Website;",
        "remove any copyright or other proprietary notations from the materials; or",
        "transferring the materials to another person or \"mirror\" the materials on any other server."
      ],
      footer: "This will let VoidAnime to terminate upon violations of any of these restrictions. Upon termination, your viewing right will also be terminated and you should destroy any downloaded materials in your possession whether it is printed or electronic format."
    },
    {
      id: "3",
      title: "Disclaimer",
      icon: ShieldCheck,
      content: "All the materials on VoidAnime's Website are provided \"as is\". VoidAnime makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, VoidAnime does not make any representations concerning the accuracy or reliability of the use of the materials on its Website or otherwise relating to such materials or any sites linked to this Website."
    },
    {
      id: "4",
      title: "Limitations",
      icon: Scale,
      content: "VoidAnime or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on VoidAnime's Website, even if VoidAnime or an authorize representative of this Website has been notified, orally or written, of the possibility of such damage. Some jurisdiction does not allow limitations on implied warranties or limitations of liability for incidental damages, these limitations may not apply to you."
    },
    {
      id: "5",
      title: "Revisions and Errata",
      icon: Info,
      content: "The materials appearing on VoidAnime's Website may include technical, typographical, or photographic errors. VoidAnime will not promise that any of the materials in this Website are accurate, complete, or current. VoidAnime may change the materials contained on its Website at any time without notice. VoidAnime does not make any commitment to update the materials."
    },
    {
      id: "6",
      title: "Links",
      icon: Globe,
      content: "VoidAnime has not reviewed all of the sites linked to its Website and is not responsible for the contents of any such linked site. The presence of any link does not imply endorsement by VoidAnime of the site. The use of any linked website is at the user’s own risk."
    },
    {
      id: "7",
      title: "Site Terms of Use Modifications",
      icon: Gavel,
      content: "VoidAnime may revise these Terms of Use for its Website at any time without prior notice. By using this Website, you are agreeing to be bound by the current version of these Terms and Conditions of Use."
    },
    {
      id: "8",
      title: "Your Privacy",
      icon: ShieldCheck,
      content: "Please read our Privacy Policy.",
      link: "/privacy"
    },
    {
      id: "9",
      title: "Governing Law",
      icon: Gavel,
      content: "Any claim related to VoidAnime's Website shall be governed by the laws of our operating jurisdiction without regards to its conflict of law provisions."
    }
  ];

  return (
    <div className="min-h-screen bg-background py-12 md:py-24 relative overflow-x-hidden">
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
            <Gavel className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
            Terms <span className="text-primary">&</span> Conditions
          </h1>
          <p className="text-white/40 text-sm font-medium uppercase tracking-[0.4em]">
            Website Terms of Use
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

                    {section.link && (
                      <Link 
                        href={section.link}
                        className="inline-block px-6 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all"
                      >
                        Read Privacy Policy
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-20 text-center space-y-4">
          <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.3em]">
            © VoidAnime Legal Department. All rights reserved.
          </p>
          <div className="flex justify-center gap-6">
            <Link href="/contact" className="text-[9px] font-black text-white/40 uppercase tracking-widest hover:text-primary transition-colors">Contact Support</Link>
            <Link href="/dmca" className="text-[9px] font-black text-white/40 uppercase tracking-widest hover:text-primary transition-colors">DMCA Policy</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
