import { ShieldAlert, FileText, Send, Scale, Mail } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'DMCA Policy | VoidAnime',
  description: 'Digital Millennium Copyright Act (DMCA) Takedown Request Requirements for VoidAnime.',
};

export default function DMCAPage() {
  return (
    <div className="min-h-screen bg-[#0B0C10] text-white selection:bg-primary/30 pb-32 relative overflow-hidden">
      {/* ─── ANIMATED BACKGROUND MESH ─── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full animate-pulse-soft" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[150px] rounded-full animate-float" />
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse-soft" style={{ animationDelay: '2s' }} />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
      </div>

      <div className="container max-w-4xl mx-auto px-4 relative z-10 pt-32">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-primary/10 border border-primary/20 mb-6 animate-pulse">
            <ShieldAlert className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
            DMCA <span className="text-primary">Policy</span>
          </h1>
          <p className="text-white/40 text-sm font-medium uppercase tracking-[0.3em]">
            Copyright Infringement Notification
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-8">
          <section className="bg-white/[0.02] backdrop-blur-2xl rounded-[32px] p-8 md:p-10 border border-white/5 saas-shadow">
            <div className="flex items-center gap-4 mb-6">
              <Scale className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-white uppercase tracking-widest">Introduction</h2>
            </div>
            <p className="text-white/60 leading-relaxed italic border-l-2 border-primary/30 pl-6">
              "We take the intellectual property rights of others seriously and require that our Users do the same. 
              The Digital Millennium Copyright Act (DMCA) established a process for addressing claims of copyright infringement. 
              If you own a copyright or have authority to act on behalf of a copyright owner and want to report a claim that 
              a third party is infringing that material on or through VoidAnime's services, please submit a DMCA report, 
              and we will take appropriate action."
            </p>
          </section>

          <section className="bg-white/[0.02] backdrop-blur-2xl rounded-[32px] p-8 md:p-10 border border-white/5 saas-shadow">
            <div className="flex items-center gap-4 mb-8">
              <FileText className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-white uppercase tracking-widest">Report Requirements</h2>
            </div>
            
            <div className="grid gap-6">
              {[
                "A description of the copyrighted work that you claim is being infringed;",
                "A description of the material you claim is infringing and that you want removed or access to which you want disabled and the URL or other location of that material;",
                "Your name, title (if acting as an agent), address, telephone number, and email address;",
                "The following statement: \"I have a good faith belief that the use of the copyrighted material I am complaining of is not authorized by the copyright owner, its agent, or the law (e.g., as a fair use)\";",
                "The following statement: \"The information in this notice is accurate and, under penalty of perjury, I am the owner, or authorized to act on behalf of the owner, of the copyright or of an exclusive right that is allegedly infringed\";",
                "An electronic or physical signature of the owner of the copyright or a person authorized to act on the owner's behalf."
              ].map((req, i) => (
                <div key={i} className="flex gap-5 group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-white/40 group-hover:bg-primary group-hover:text-black group-hover:border-primary transition-all duration-500">
                    {i + 1}
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed pt-1 group-hover:text-white/80 transition-colors">
                    {req}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Action Section */}
          <section className="bg-primary/5 backdrop-blur-2xl rounded-[32px] p-8 md:p-12 border border-primary/10 text-center space-y-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary text-black mb-6">
                <Send className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Submit a Takedown Request</h2>
              <p className="text-white/40 text-sm mb-8 max-w-md mx-auto">
                We will review your DMCA request and take proper actions, including removal of the content from the website.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  href="/contact" 
                  className="w-full sm:w-auto px-10 py-4 bg-primary text-black font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Go to Contact Page
                </Link>
                <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-white/40 font-bold text-[10px] uppercase tracking-widest">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  Legal@VoidAnime.online
                </div>
              </div>
            </div>
          </section>

          <footer className="text-center text-white/20 text-[10px] font-bold uppercase tracking-[0.2em] pt-8">
            © VoidAnime DMCA Department. All rights reserved.
          </footer>
        </div>
      </div>
    </div>
  );
}
