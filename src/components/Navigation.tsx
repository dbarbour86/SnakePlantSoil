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
    <header className="sticky top-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EAE4D8]">
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
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#1A3B29] transition-transform group-hover:scale-105" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 1.5C13.8 6.5 14.5 13.5 13.5 22.5H10.5C9.5 13.5 10.2 6.5 12 1.5ZM11.1 5.8H12.9V6.6H11.1V5.8ZM10.8 9.5H13.2V10.3H10.8V9.5ZM10.7 13.2H13.3V14H10.7V13.2ZM10.8 16.8H13.2V17.6H10.8V16.8ZM6.5 5.8C8 10 9 15.5 10.8 21.5H8.8C7.3 16 6 11.5 6.5 5.8ZM6.8 10H8.2V10.8H6.8V10ZM7.2 13.8H9V14.6H7.2V13.8ZM7.9 17.5H9.7V18.3H7.9V17.5ZM17.5 5.8C16 10 15 15.5 13.2 21.5H15.2C16.7 16 18 11.5 17.5 5.8ZM15.8 10H17.2V10.8H15.8V10ZM15 13.8H16.8V14.6H15V13.8ZM14.3 17.5H16.1V18.3H14.3V17.5Z"/>
            </svg>
            <span className="font-serif-editorial font-bold text-[#142B1E] tracking-tight text-lg sm:text-xl">
              SnakePlant<span className="text-[#235837] font-sans-editorial font-semibold">Soil</span><span className="text-stone-400 font-sans text-xs">.com</span>
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
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === item.id 
                    ? 'bg-[#EFE9DD] text-[#142B1E] shadow-2xs font-bold' 
                    : 'text-stone-600 hover:text-[#142B1E] hover:bg-[#F3EEE3]'
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
              className="ml-2 bg-[#1B3B2B] hover:bg-[#122A1E] text-stone-50 px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs hover:shadow-sm shrink-0"
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
                  className="w-full text-xs pl-8 pr-3 py-1.5 bg-white/90 border border-[#E0D9CB] rounded-full focus:outline-none focus:ring-1 focus:ring-[#1A3B29] focus:bg-white placeholder-stone-400 font-sans transition-all"
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
        <div className="md:hidden border-t border-[#EAE4D8] bg-[#FAF7F2]/98 backdrop-blur-md py-3 px-4 space-y-1 shadow-md" id="mobile-nav-list-drawer">
          {allNavItems.map((item) => (
            <a
              key={item.id}
              href={"/" + tabToSlugMap[item.id]}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.id);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-between ${
                activeTab === item.id || (activeTab === 'setup-kits' && item.id === 'setup-kits')
                  ? 'bg-[#1B3B2B] text-white font-bold shadow-xs' 
                  : 'text-stone-700 hover:bg-[#EFE9DD] hover:text-[#142B1E]'
              }`}
              id={`mobile-nav-link-${item.id}`}
            >
              <span>{item.label}</span>
              {(activeTab === item.id || (activeTab === 'setup-kits' && item.id === 'setup-kits')) && <span className="w-1.5 h-1.5 rounded-full bg-[#BEDFC7]" />}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
