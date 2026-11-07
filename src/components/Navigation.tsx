import { useState, useRef, useEffect } from 'react';
import { Menu, X, Search, ChevronRight } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNavigate?: (id: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

interface SearchItem {
  id: string;
  title: string;
  category: string;
  snippet: string;
  keywords: string[];
}

const SEARCH_CATALOG: SearchItem[] = [
  {
    id: 'best-soil',
    title: "Best Soils for Snake Plants (Buyer's Guide)",
    category: "Product Guide",
    snippet: "Compare commercial succulent mixes, ingredients, and drainage speeds including Bonsai Jack, Hoffman, and Espoma.",
    keywords: ["best soil", "commercial", "store-bought", "bonsai jack", "hoffman", "espoma", "drainage", "premixed", "cactus mix", "succulent soil", "buy", "ranked"]
  },
  {
    id: 'diy-mix',
    title: "DIY Snake Plant Soil Mix (3-2-1 Recipe)",
    category: "Recipe & Calculator",
    snippet: "Learn the golden 3-2-1 ratio formula: 3 parts potting soil, 2 parts perlite or pumice, and 1 part coarse sand with batch calculator.",
    keywords: ["diy mix", "recipe", "3-2-1", "perlite", "pumice", "coarse sand", "batch calculator", "make soil", "ratio", "mineral grit", "formula"]
  },
  {
    id: 'root-rot',
    title: "Snake Plant Root Rot: Symptoms, Treatment & Recovery",
    category: "Plant Health",
    snippet: "Spot mushy leaves, dark smelly roots, and overwatering symptoms early, with root trimming and repotting steps.",
    keywords: ["root rot", "yellow leaves", "mushy", "overwatering", "smell", "fungus", "triage", "trimming", "recovery", "dying", "brown", "treatment"]
  },
  {
    id: 'best-pots',
    title: "Best Pots for Snake Plants: Sizing, Material & Drainage",
    category: "Container Science",
    snippet: "Terracotta vs glazed ceramic vs plastic, drainage hole essentials, and rootbound pot sizing rules.",
    keywords: ["pot", "pots", "terracotta", "ceramic", "plastic", "drainage hole", "pot size", "repotting container", "saucer", "transpiration"]
  },
  {
    id: 'care-guide',
    title: "Snake Plant Care Guide: Watering, Light & Soil",
    category: "Care Guide",
    snippet: "Essential indoor care covering indirect light, seasonal watering adjustments, temperature, and propagation.",
    keywords: ["care guide", "watering", "light", "low light", "general care", "temperature", "indoor care", "beginner", "sunlight"]
  },
  {
    id: 'setup-kits',
    title: "Snake Plant Soil Diagnosis & Fit Check",
    category: "Diagnostic Tool",
    snippet: "Answer 4 questions to evaluate your watering habits, pot type, and environmental drainage risk profile.",
    keywords: ["diagnosis", "soil diagnosis", "quiz", "tool", "fit check", "test", "calculator", "assessment", "risk profile", "check"]
  },
  {
    id: 'care-card',
    title: "Printable Snake Plant Care Card Generator",
    category: "Interactive Tool",
    snippet: "Create and print a customized one-page botanical care reference card for your home or plant sitters.",
    keywords: ["care card", "printable", "print", "sheet", "pdf", "instructions", "plant sitter", "card"]
  },
  {
    id: 'faq',
    title: "Snake Plant Questions & Answers (FAQ)",
    category: "Knowledgebase",
    snippet: "Frequently asked questions covering soil pH, fertilizing, repotting seasons, and watering frequency.",
    keywords: ["faq", "questions", "answers", "how often", "fertilizer", "frequency", "soil ph", "repot", "questions"]
  },
  {
    id: 'about',
    title: "About SnakePlantSoil.com & Editorial Standards",
    category: "Editorial",
    snippet: "Why we created this site, practical plant care guidance, and affiliate transparency disclosures.",
    keywords: ["about", "editorial", "disclosure", "affiliate disclosure", "mission", "contact", "standards"]
  },
  {
    id: 'radio',
    title: "Snake Plant Radio Hub",
    category: "Podcast",
    snippet: "Audio episodes discussing soil drainage, root aeration, container choices, and snake plant care.",
    keywords: ["radio", "podcast", "audio", "episodes", "listen", "spotify", "stream"]
  },
  {
    id: 'radio/why-your-snake-plant-is-dying',
    title: "Ep. 1: Why Your Snake Plant Is Dying (It's Probably Water)",
    category: "Podcast Episode",
    snippet: "How overwatering causes root suffocation and the 5-step recovery guide to save rotting plants.",
    keywords: ["why dying", "episode 1", "podcast", "overwatering", "oxygen", "rot recovery"]
  },
  {
    id: 'radio/the-3-2-1-soil-recipe',
    title: "Ep. 2: The 3-2-1 Soil Recipe: Mix Your Own Like a Pro",
    category: "Podcast Episode",
    snippet: "Why bagged soils suffocate roots, how mineral grit creates air channels, and the squeeze test.",
    keywords: ["episode 2", "3-2-1 recipe", "podcast", "mixing", "aeration"]
  },
  {
    id: 'radio/store-bought-soil-that-wont-kill-your-plant',
    title: "Ep. 3: Store-Bought Soil That Won't Kill Your Plant",
    category: "Podcast Episode",
    snippet: "Evaluating commercial cactus mixes, label checks, and avoiding dangerous moisture-control brands.",
    keywords: ["episode 3", "store bought", "commercial", "brands", "labels"]
  },
  {
    id: 'radio/terracotta-vs-ceramic-vs-plastic',
    title: "Ep. 4: Terracotta vs Ceramic vs Plastic: The Pot Episode",
    category: "Podcast Episode",
    snippet: "How container porosity affects soil moisture, drainage rules, and pot sizing guidelines.",
    keywords: ["episode 4", "pot episode", "terracotta", "transpiration"]
  },
  {
    id: 'radio/the-soak-and-dry-watering-method',
    title: "Ep. 5: The Soak-and-Dry Watering Method",
    category: "Podcast Episode",
    snippet: "Ditching rigid watering schedules in favor of deep soil moisture checks and seasonal changes.",
    keywords: ["episode 5", "soak and dry", "watering method", "deep moisture"]
  },
  {
    id: 'winter-watering-guide',
    title: "Winter Watering Guide for Snake Plants",
    category: "Care Guide",
    snippet: "Seasonal care guide for cold months, reduced light, indoor heating, and dormancy moisture checks.",
    keywords: ["winter", "winter watering", "dormancy", "cold", "seasonal", "heating"]
  },
  {
    id: 'best-fertilizer-for-snake-plant-soil',
    title: "Best Fertilizer for Snake Plants",
    category: "Care Guide",
    snippet: "NPK ratios, organic vs synthetic feeding, timing during active growing seasons, and preventing fertilizer burn.",
    keywords: ["fertilizer", "fertilizing", "plant food", "npk", "nutrients", "feeding"]
  }
];

export default function Navigation({ activeTab, setActiveTab, onNavigate, searchQuery, onSearchChange }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery || '');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Synchronize incoming searchQuery if provided
  useEffect(() => {
    if (searchQuery !== undefined && searchQuery !== localQuery) {
      setLocalQuery(searchQuery);
    }
  }, [searchQuery]);

  // Click outside listener to dismiss search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const desktopNavItems = [
    { id: 'best-soil', label: 'Best Soils' },
    { id: 'diy-mix', label: 'DIY Mix' },
    { id: 'root-rot', label: 'Soil Problems' },
    { id: 'care-guide', label: 'Care Guides' },
    { id: 'radio', label: 'Radio' },
    { id: 'about', label: 'About' },
    { id: 'faq', label: 'FAQ' }
  ];

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
    if (onNavigate) {
      onNavigate(id);
    } else {
      setActiveTab(id);
    }
    setIsOpen(false);
    setIsSearchOpen(false);
    setLocalQuery('');
    if (onSearchChange) onSearchChange('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Perform multi-keyword search
  const trimmed = localQuery.trim().toLowerCase();
  const searchResults = trimmed
    ? SEARCH_CATALOG.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(trimmed);
        const snippetMatch = item.snippet.toLowerCase().includes(trimmed);
        const categoryMatch = item.category.toLowerCase().includes(trimmed);
        const keywordMatch = item.keywords.some(k => k.toLowerCase().includes(trimmed));
        return titleMatch || snippetMatch || categoryMatch || keywordMatch;
      })
    : [];

  const handleSearchInput = (val: string) => {
    setLocalQuery(val);
    setIsSearchOpen(true);
    setSelectedIndex(-1);
    if (onSearchChange) onSearchChange(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isSearchOpen || searchResults.length === 0) {
      if (e.key === 'Enter' && searchResults.length > 0) {
        e.preventDefault();
        handleNavClick(searchResults[0].id);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const targetItem = selectedIndex >= 0 ? searchResults[selectedIndex] : searchResults[0];
      if (targetItem) {
        handleNavClick(targetItem.id);
      }
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
    }
  };

  const clearSearch = () => {
    setLocalQuery('');
    setIsSearchOpen(false);
    setSelectedIndex(-1);
    if (onSearchChange) onSearchChange('');
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EAE4D8]" id="site-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 gap-3">
          
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

          {/* Desktop Navigation Link Toggles */}
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

          {/* Site-Wide Search Form & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3" ref={searchContainerRef}>
            <div className="relative w-36 sm:w-48 lg:w-60">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                placeholder="Search guides, soil mixes..."
                value={localQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                onKeyDown={handleKeyDown}
                className="w-full text-xs pl-8 pr-7 py-1.5 bg-white/90 border border-[#E0D9CB] rounded-full focus:outline-none focus:ring-1 focus:ring-[#1A3B29] focus:bg-white placeholder-stone-400 font-sans transition-all"
                id="search-input-header"
                aria-label="Search guides, articles, and podcast episodes"
              />
              {localQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5 rounded-full cursor-pointer"
                  aria-label="Clear search"
                  id="search-clear-btn"
                >
                  <X className="w-3 h-3" />
                </button>
              )}

              {/* Desktop Interactive Search Results Dropdown */}
              {isSearchOpen && localQuery.trim().length > 0 && (
                <div 
                  className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-72 sm:w-84 md:w-96 bg-white rounded-2xl border border-[#E8E2D5] shadow-xl overflow-hidden z-50 text-left font-sans animate-in fade-in slide-in-from-top-1 duration-150"
                  id="search-results-dropdown"
                >
                  <div className="p-2 border-b border-[#F0EBE1] bg-[#FAF7F2] flex items-center justify-between text-[11px] font-mono text-[#5C6E60] px-3">
                    <span>{searchResults.length} {searchResults.length === 1 ? 'match' : 'matches'} found</span>
                    <span>Use ↑↓ to navigate, Enter to select</span>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-[#F0EBE1]">
                    {searchResults.length > 0 ? (
                      searchResults.map((item, idx) => (
                        <div
                          key={item.id}
                          onClick={() => handleNavClick(item.id)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={`p-3 cursor-pointer transition-colors ${
                            selectedIndex === idx ? 'bg-[#E2EFE5]/60 text-[#142B1E]' : 'hover:bg-[#FAF7F2]'
                          }`}
                          id={`search-result-${idx}`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#235837] bg-[#E2EFE5] px-1.5 py-0.5 rounded">
                              {item.category}
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                          </div>
                          <div className="text-xs font-bold text-[#142B1E] leading-snug">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-[#5C6E60] line-clamp-2 mt-1 leading-relaxed">
                            {item.snippet}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-5 text-center space-y-1.5" id="search-no-results">
                        <p className="text-xs font-bold text-[#142B1E] m-0">
                          No results found for "{localQuery}"
                        </p>
                        <p className="text-[11px] text-[#5C6E60] m-0 leading-relaxed">
                          Try searching for <strong>root rot</strong>, <strong>3-2-1 mix</strong>, <strong>perlite</strong>, <strong>terracotta</strong>, or <strong>watering</strong>.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

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
        <div className="md:hidden border-t border-[#EAE4D8] bg-[#FAF7F2]/98 backdrop-blur-md py-3 px-4 space-y-3 shadow-md" id="mobile-nav-list-drawer">
          {/* Mobile Search Box */}
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              placeholder="Search guides, recipes..."
              value={localQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full text-xs pl-8 pr-7 py-2 bg-white border border-[#E0D9CB] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1A3B29] placeholder-stone-400 font-sans"
              id="mobile-search-input"
              aria-label="Search guides and podcast"
            />
            {localQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 rounded-full cursor-pointer"
                aria-label="Clear mobile search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Mobile Search Results */}
            {localQuery.trim().length > 0 && (
              <div className="mt-2 bg-white rounded-xl border border-[#E8E2D5] shadow-lg overflow-hidden divide-y divide-[#F0EBE1] max-h-60 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((item, idx) => (
                    <div
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className="p-3 hover:bg-[#FAF7F2] cursor-pointer"
                    >
                      <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#235837] mb-0.5">
                        {item.category}
                      </div>
                      <div className="text-xs font-bold text-[#142B1E] leading-snug">
                        {item.title}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center space-y-1">
                    <p className="text-xs font-bold text-[#142B1E] m-0">No results found for "{localQuery}"</p>
                    <p className="text-[10px] text-[#5C6E60] m-0">Try searching for root rot, 3-2-1 mix, or pots.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-1 pt-1">
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
        </div>
      )}
    </header>
  );
}
