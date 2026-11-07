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
    <footer className="bg-[#0E2015] text-[#D8E6DC] border-t border-[#1A3B29]" id="editorial-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-12 border-b border-[#1A3B29]/70">
          
          {/* Logo & Summary */}
          <div className="md:col-span-5 space-y-4">
            <a 
              href="/"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('home');
              }}
              className="flex items-center gap-2.5 cursor-pointer group shrink-0" 
              id="footer-logo"
            >
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#9EC4A9] transition-transform group-hover:scale-105" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/>
              </svg>
              <span className="font-serif-editorial font-bold text-stone-100 tracking-tight text-lg sm:text-xl">
                SnakePlant<span className="text-[#9EC4A9] font-sans-editorial font-semibold">Soil</span><span className="text-stone-400 font-sans text-xs">.com</span>
              </span>
            </a>
            <p className="text-stone-300 text-sm leading-relaxed max-w-sm">
              Snake Plant Soil provides practical product comparisons, soil guides, and advice on healthy root care. We help owners understand how pot type, light, watering, and soil interact.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-stone-400 font-mono">
              <Globe className="w-3.5 h-3.5 text-[#9EC4A9]" /> Botanical Field Guide Edition
            </div>
          </div>

          {/* Quick Sitemap Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-100">
              Authority Resources
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a 
                  href="/best-snake-plant-soil"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('best-soil');
                  }} 
                  className="text-stone-300 hover:text-white transition-colors"
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
                  className="text-stone-300 hover:text-white transition-colors"
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
                  className="text-stone-300 hover:text-white transition-colors"
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
                  className="text-stone-300 hover:text-white transition-colors"
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
                  className="text-stone-300 hover:text-white transition-colors"
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
                  className="text-stone-300 hover:text-white transition-colors flex items-center gap-1.5"
                  id="foot-link-radio"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9EC4A9] animate-pulse"></span>
                  Snake Plant Radio (Podcast)
                </a>
              </li>
            </ul>
          </div>

          {/* Botanical Trust Standards */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-100 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#9EC4A9]" />
              Practical Soil Standards
            </h4>
            <div className="bg-[#142B1E] p-4 rounded-xl border border-[#1A3B29] space-y-3 text-xs leading-relaxed text-stone-300 font-sans">
              <div>
                <span className="font-bold text-stone-100 block mb-0.5">Rot Prevention Focus</span>
                <p className="text-stone-300">Our soil guides are designed to improve drainage and air circulation around the roots to lower moisture retention.</p>
              </div>
              <div>
                <span className="font-bold text-stone-100 block mb-0.5">Recommended Mix Properties</span>
                <p className="text-stone-300">We compare soil characteristics like aggregate structure, water retention, and drainage to help you find the right fit.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Legal and compliance */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-[#9EC4A9]" />
            <span>© {new Date().getFullYear()} SnakePlantSoil.com. All rights reserved.</span>
          </div>
          <div className="flex gap-4">
            <a href="#affiliate-disclaimer" className="hover:underline hover:text-stone-200">Affiliate Disclosure</a>
            <span className="text-stone-600">|</span>
            <a 
              href="/care-card"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('care-card');
              }}
              className="hover:underline hover:text-stone-200 font-bold text-[#9EC4A9]"
            >
              Free Printable Care Card
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
