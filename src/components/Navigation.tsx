import { useState } from 'react';
import { Menu, X, BookOpen, Droplet, Sliders, HeartPulse, Search, Sparkles } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
}

export default function Navigation({ activeTab, setActiveTab, onSearchChange, searchQuery }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'setup-kits', label: 'Mix & Pot Kits' },
    { id: 'best-soil', label: 'Best Soils' },
    { id: 'diy-mix', label: 'DIY Recipe' },
    { id: 'root-rot', label: 'Root Rot Protocol' },
    { id: 'best-pots', label: 'Optimal Pots' },
    { id: 'care-guide', label: 'Watering & Care' },
    { id: 'care-card', label: 'Free Care Card' },
    { id: 'faq', label: 'FAQ' }
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Branding */}
          <div 
            onClick={() => handleNavClick('home')} 
            className="flex items-center gap-2.5 cursor-pointer group"
            id="brand-logo"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-stone-50 flex items-center justify-center font-bold shadow-sm transition-all group-hover:bg-emerald-900">
              S
            </div>
            <div>
              <span className="font-bold text-stone-900 tracking-tight text-base sm:text-lg block">
                SnakePlantSoil<span className="text-emerald-850">.com</span>
              </span>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-emerald-800 block leading-none">
                Authority Botanical Guide
              </span>
            </div>
          </div>

          {/* Desktop Navigation Link Toggles */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.filter(item => item.id !== 'home').map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === item.id 
                    ? 'bg-emerald-800/10 text-emerald-800' 
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
                id={`nav-link-${item.id}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mini Search Form */}
          {onSearchChange && (
            <div className="hidden md:flex items-center relative max-w-xs w-full mr-2 lg:mr-0 pl-4">
              <span className="absolute left-7 text-stone-400">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                placeholder="Search definitions or soils..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:bg-white placeholder-stone-400 font-sans transition-all"
                id="search-input-header"
              />
            </div>
          )}

          {/* Mobile Hamburguer Toggle */}
          <div className="flex items-center lg:hidden gap-3">
            {onSearchChange && (
              <div className="relative w-36 sm:w-48">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400">
                  <Search className="w-3 h-3" />
                </span>
                <input
                  type="text"
                  placeholder="Query..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full text-xs pl-7 pr-2 py-1.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:bg-white"
                  id="search-input-mobile"
                />
              </div>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-lg transition-colors focus:outline-none"
              aria-label="Toggle navigation"
              id="mobile-nav-toggle-btn"
            >
              {isOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu Overlays */}
      {isOpen && (
        <div className="lg:hidden border-t border-stone-100 bg-white/95 backdrop-blur-md py-4 px-4 space-y-1 shadow-inner h-max" id="mobile-nav-list-drawer">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === item.id 
                  ? 'bg-emerald-800 text-white' 
                  : 'text-stone-705 hover:bg-stone-50 hover:text-stone-950'
              }`}
              id={`mobile-nav-link-${item.id}`}
            >
              <span>{item.label}</span>
              {activeTab === item.id && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
