import { Trees, ShieldCheck, Mail, Globe, Sparkles, BookOpen } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export default function Footer({ setActiveTab }: FooterProps) {
  const handleNavClick = (id: string) => {
    setActiveTab(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-850" id="editorial-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-12 border-b border-stone-800">
          
          {/* Logo & Summary */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick('home')} id="footer-logo">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-stone-50 flex items-center justify-center font-bold">
                S
              </div>
              <span className="font-bold text-stone-100 tracking-tight text-base">
                SnakePlantSoil<span className="text-emerald-500">.com</span>
              </span>
            </div>
            <p className="text-stone-450 text-xs leading-relaxed max-w-sm">
              SnakePlantSoil.com is an independent academic botanical resource designed to explain drainage ratios, container mechanics, and Sansevieria recovery procedures simply. Our research is structured for high citation indexing.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-mono">
              <Globe className="w-3.5 h-3.5" /> Earthy-Green Minimal theme v1.07
            </div>
          </div>

          {/* Quick Sitemap Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-100">
              Authority Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => handleNavClick('best-soil')} 
                  className="text-stone-400 hover:text-white transition-colors"
                  id="foot-link-best-soil"
                >
                  Best Soil Recommendations
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('diy-mix')} 
                  className="text-stone-400 hover:text-white transition-colors"
                  id="foot-link-diy-mix"
                >
                  Golden Rule 3-2-1 DIY Mix
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('root-rot')} 
                  className="text-stone-400 hover:text-white transition-colors"
                  id="foot-link-root-rot"
                >
                  Surgical Root Rot Guide
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('best-pots')} 
                  className="text-stone-400 hover:text-white transition-colors"
                  id="foot-link-best-pots"
                >
                  Best Sizing & Pots Guide
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('care-guide')} 
                  className="text-stone-400 hover:text-white transition-colors"
                  id="foot-link-care-guide"
                >
                  Seasonal Care Masterclass
                </button>
              </li>
            </ul>
          </div>

          {/* Botanical Trust Standards */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-100 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Botanical Care Standards
            </h4>
            <div className="bg-stone-850 p-4 rounded-xl border border-stone-800 space-y-3 text-[11px] leading-relaxed text-stone-400 font-sans">
              <div>
                <span className="font-bold text-stone-200 block mb-0.5">🌿 100% Rot Prevention Focus</span>
                <p className="text-stone-450">Our soil recipes and potting guides are engineered specifically around Sansevieria rhizome mechanics to prevent water stagnation.</p>
              </div>
              <div>
                <span className="font-bold text-stone-200 block mb-0.5">🧪 Tested Drainage Ratios</span>
                <p className="text-stone-450">Every soil recommendation is evaluated for dry-down speed, inorganic grit ratio, and pH neutrality.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Legal and compliance */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>© {new Date().getFullYear()} SnakePlantSoil.com. All professional botanical rights reserved.</span>
          </div>
          <div className="flex gap-4">
            <a href="#affiliate-disclaimer" className="hover:underline hover:text-stone-300">Affiliate Disclosure</a>
            <span className="text-stone-700">|</span>
            <button onClick={() => handleNavClick('care-card')} className="hover:underline hover:text-stone-300 font-bold text-emerald-500">Free Printable Care Card</button>
          </div>
        </div>

      </div>
    </footer>
  );
}
