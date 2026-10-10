import { useState } from 'react';
import { Menu, X, Search } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
}

export default function Navigation({ activeTab, setActiveTab, onSearchChange, searchQuery }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Map tabs to paths
  const tabToSlugMap: Record<string, string> = {
    'home': '',
    'setup-kits': 'soil-diagnosis',
    'best-soil': 'best-snake-plant-soil',
    'diy-mix': 'diy-snake-plant-soil-mix',
    'root-rot': 'snake-plant-root-rot-guide',
    'best-pots': 'best-pots-for-snake-plants',
    'care-guide': 'snake-plant-care-guide',
    'radio': 'radio',
    'faq': 'faq',
    'care-card': 'care-card',
    'about': 'about'
  };

  // Main desktop links (streamlined & clean)
  const desktopNavItems = [
    { id: 'best-soil', label: 'Best Soils' },
    { id: 'diy-mix', label: 'DIY Mix' },
    { id: 'root-rot', label: 'Soil Problems' },
    { id: 'care-guide', label: 'Care Guides' },
    { id: 'radio', label: 'Radio' },
    { id: 'about', label: 'About' },
    { id: 'faq', label: 'FAQ' }
  ];

  // Full set for mobile drawer
  const allNavItems = [
    { id: 'home', label: 'Home' },
    { id: 'setup-kits', label: 'Diagnose My Plant' },
    { id: 'best-soil', label: 'Best Soils' },
    { id: 'diy-mix', label: 'DIY Mix' },
    { id: 'root-rot', label: 'Soil Problems' },
    { id: 'care-guide', label: 'Care Guides' },
    { id: 'radio', label: 'Snake Plant Radio' },
    { id: 'about', label: 'About' },
    { id: 'faq', label: 'FAQ' }
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          
          {/* Logo Branding */}
          <a 
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }} 
            className="flex items-center gap-2 cursor-pointer group shrink-0"
            id="brand-logo"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-stone-50 flex items-center justify-center font-bold text-sm shadow-xs transition-all group-hover:bg-emerald-950">
              S
            </div>
            <span className="font-bold text-stone-900 tracking-tight text-base sm:text-lg">
              SnakePlantSoil<span className="text-emerald-800">.com</span>
            </span>
          </a>

          {/* Desktop Navigation Link Toggles (Slim & Spacious) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {desktopNavItems.map((item) => (
              <a
                key={item.id}
                href={"/" + tabToSlugMap[item.id]}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === item.id 
                    ? 'bg-stone-100 text-stone-900 shadow-xs' 
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
                id={`nav-link-${item.id}`}
              >
                {item.label}
              </a>
            ))}
            <a
              href="/soil-diagnosis"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('setup-kits');
              }}
              className="ml-2 bg-emerald-800 hover:bg-emerald-900 text-stone-50 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs shrink-0"
              id="nav-link-diagnose-cta"
            >
              Find Your Soil Profile
            </a>
          </nav>

          {/* Mini Search Form & Mobile Toggle */}
          <div className="flex items-center gap-3">
            {onSearchChange && (
              <div className="relative w-36 sm:w-44 lg:w-52">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400">
                  <Search className="w-3.5 h-3.5" />
                </span>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:bg-white placeholder-stone-400 font-sans transition-all"
                  id="search-input-header"
                />
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-1.5 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-lg transition-colors focus:outline-none"
              aria-label="Toggle navigation"
              id="mobile-nav-toggle-btn"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu Overlays */}
      {isOpen && (
        <div className="md:hidden border-t border-stone-100 bg-white/95 backdrop-blur-md py-3 px-4 space-y-1 shadow-md" id="mobile-nav-list-drawer">
          {allNavItems.map((item) => (
            <a
              key={item.id}
              href={"/" + tabToSlugMap[item.id]}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.id);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === item.id || (activeTab === 'setup-kits' && item.id === 'setup-kits')
                  ? 'bg-emerald-800 text-white' 
                  : 'text-stone-700 hover:bg-stone-50 hover:text-stone-950'
              }`}
              id={`mobile-nav-link-${item.id}`}
            >
              <span>{item.label}</span>
              {(activeTab === item.id || (activeTab === 'setup-kits' && item.id === 'setup-kits')) && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
