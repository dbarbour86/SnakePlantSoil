import { Trees, ShieldCheck, Mail, Globe, Sparkles, BookOpen } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export default function Footer({ setActiveTab }: FooterProps) {
  const handleNavClick = (id: string) => {
    setActiveTab(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tabToSlugMap: Record<string, string> = {
    'home': '',
    'setup-kits': 'soil-diagnosis',
    'best-soil': 'best-snake-plant-soil',
    'diy-mix': 'diy-snake-plant-soil-mix',
    'root-rot': 'snake-plant-root-rot-guide',
    'best-pots': 'best-pots-for-snake-plants',
    'care-guide': 'snake-plant-care-guide',
    'faq': 'faq',
    'care-card': 'care-card',
    'about': 'about'
  };


  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-850" id="editorial-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-12 border-b border-stone-800">
          
          {/* Logo & Summary */}
          <div className="md:col-span-5 space-y-4">
            <a 
              href="/"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('home');
              }}
              className="flex items-center gap-2 cursor-pointer" 
              id="footer-logo"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-stone-50 flex items-center justify-center font-bold">
                S
              </div>
              <span className="font-bold text-stone-100 tracking-tight text-base">
                SnakePlantSoil<span className="text-emerald-500">.com</span>
              </span>
            </a>
            <p className="text-stone-450 text-xs leading-relaxed max-w-sm">
              Snake Plant Soil Lab provides practical product comparisons, soil guides, and updates on our development of a future specialized snake plant soil mix. We help owners understand how pot type, light, watering, and soil interact.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-mono">
              <Globe className="w-3.5 h-3.5" /> Earthy-Green Minimal theme v1.08
            </div>
          </div>

          {/* Quick Sitemap Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-100">
              Authority Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a 
                  href="/best-snake-plant-soil"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('best-soil');
                  }} 
                  className="text-stone-400 hover:text-white transition-colors"
                  id="foot-link-best-soil"
                >
                  Best Soil Recommendations
                </a>
              </li>
              <li>
                <a 
                  href="/diy-snake-plant-soil-mix"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('diy-mix');
                  }} 
                  className="text-stone-400 hover:text-white transition-colors"
                  id="foot-link-diy-mix"
                >
                  DIY Snake Plant Soil Mix
                </a>
              </li>
              <li>
                <a 
                  href="/snake-plant-root-rot-guide"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('root-rot');
                  }} 
                  className="text-stone-400 hover:text-white transition-colors"
                  id="foot-link-root-rot"
                >
                  Root Rot and Soggy Soil Guide
                </a>
              </li>
              <li>
                <a 
                  href="/best-pots-for-snake-plants"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('best-pots');
                  }} 
                  className="text-stone-400 hover:text-white transition-colors"
                  id="foot-link-best-pots"
                >
                  Pots and Drainage Sizing Guide
                </a>
              </li>
              <li>
                <a 
                  href="/snake-plant-care-guide"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('care-guide');
                  }} 
                  className="text-stone-400 hover:text-white transition-colors"
                  id="foot-link-care-guide"
                >
                  Watering and Care Guide
                </a>
              </li>
              <li>
                <a 
                  href="/radio"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('radio');
                  }} 
                  className="text-stone-400 hover:text-white transition-colors flex items-center gap-1.5"
                  id="foot-link-radio"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Snake Plant Radio (Podcast)
                </a>
              </li>
            </ul>
          </div>

          {/* Botanical Trust Standards */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-100 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Practical Soil Standards
            </h4>
            <div className="bg-stone-850 p-4 rounded-xl border border-stone-800 space-y-3 text-[11px] leading-relaxed text-stone-400 font-sans">
              <div>
                <span className="font-bold text-stone-200 block mb-0.5">🌿 Rot Prevention Focus</span>
                <p className="text-stone-450">Our soil guides are designed to improve drainage and air circulation around the roots to lower moisture retention.</p>
              </div>
              <div>
                <span className="font-bold text-stone-200 block mb-0.5">🧪 Recommended Mix Properties</span>
                <p className="text-stone-450">We compare soil characteristics like aggregate structure, water retention, and pH to help you find the right fit.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Legal and compliance */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>© {new Date().getFullYear()} SnakePlantSoil.com. All rights reserved.</span>
          </div>
          <div className="flex gap-4">
            <a href="#affiliate-disclaimer" className="hover:underline hover:text-stone-300">Affiliate Disclosure</a>
            <span className="text-stone-700">|</span>
            <a 
              href="/care-card"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('care-card');
              }}
              className="hover:underline hover:text-stone-300 font-bold text-emerald-500"
            >
              Free Printable Care Card
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
