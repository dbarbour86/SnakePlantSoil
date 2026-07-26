import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trees, Beaker, HeartPulse, Layers, Compass, HelpCircle, 
  ChevronRight, Check, AlertTriangle, Info, Search, 
  Sparkles, Award, Star, ArrowRight, ShieldCheck, HelpCircle as QuestionIcon, Plus, Minus
} from 'lucide-react';

import Navigation from './components/Navigation';
import Footer from './components/Footer';
import AIAnswerCards from './components/AIAnswerCards';
import ProductSection from './components/ProductSection';
import SoilMixDiagram from './components/SoilMixDiagram';
import LeadMagnet from './components/LeadMagnet';
import SoilSetupKit from './components/SoilSetupKit';

import { 
  BestSoilArticle, 
  DIYMixArticle, 
  RootRotArticle, 
  BestPotsArticle, 
  CareGuideArticle 
} from './components/GuideArticles';

import { CONTENT_GUIDES, STATIC_GUIDES, FAQ_ITEMS } from './data';
import { getDynamicArticles } from './content';
import routeManifest from './generated-manifest.json';
import DynamicArticleView from './components/DynamicArticle';


const HERO_CARE_TIPS = [
  { icon: '🌱', label: 'Soil', value: 'Fast-Draining • 40% Perlite Blend' },
  { icon: '💧', label: 'Water', value: 'Every 2–4 Weeks' },
  { icon: '☀️', label: 'Light', value: 'Bright Indirect Light' },
  { icon: '⚱️', label: 'Pot', value: 'Terracotta or Ceramic with Drainage' },
  { icon: '🌡️', label: 'Temp', value: '65–85°F (18–29°C)' },
];

const PAGE_METADATA: Record<string, { title: string; description: string }> = {
  home: {
    title: "The Best Soil for Snake Plants — Optimal DIY Recipe & Care Guide",
    description: "Ultimate master botanical guide to selecting, mixing, and buying the absolute best soil for snake plants (Sansevieria). Get our golden ratio DIY recipe."
  },
  'setup-kits': {
    title: "Snake Plant Soil Mix Setup Kit Builder | SnakePlantSoil.com",
    description: "Custom potting component calculator. Choose your pot size and design the perfect quick-draining soil mix with our custom kit builder."
  },
  'best-soil': {
    title: "Best Commercial Soils for Snake Plants | SnakePlantSoil.com",
    description: "Honest, editorial review of the top 4 commercial succulent and cactus mixes tested specifically for Sansevieria drainage."
  },
  'diy-mix': {
    title: "DIY Snake Plant Soil Mix Recipe (3-2-1 Ratio) | SnakePlantSoil.com",
    description: "Our signature 3-2-1 gritty recipe. Learn how to mix potting soil, perlite, and coarse sand for the absolute ultimate home mix."
  },
  'root-rot': {
    title: "How to Identify & Save Snake Plant Root Rot | SnakePlantSoil.com",
    description: "How to identify, treat, and surgically recover a snake plant suffering from mushy leaves, soggy stems, or black rhizomes."
  },
  'best-pots': {
    title: "Best Pots for Snake Plants (Breathable Terracotta) | SnakePlantSoil.com",
    description: "Why breathable porous clay terracotta is king. A deep dive of container sizes, drainage holes, and aesthetic pot recommendations."
  },
  'care-guide': {
    title: "Seasonal Snake Plant Care & Watering Masterclass | SnakePlantSoil.com",
    description: "Mastering the 'Soak and Dry' watering cycle, seasonal routines, winter dryness tactics, and light level placements."
  },
  faq: {
    title: "Snake Plant Potting & Care FAQs | SnakePlantSoil.com",
    description: "Botanist-verified answers to common questions about watering frequency, soil amendments, pot sizes, and rot prevention."
  },
  'care-card': {
    title: "Free Printable Snake Plant Care Card Generator | SnakePlantSoil.com",
    description: "Generate a custom PDF care card with your snake plant's name, optimal watering frequency, and sunlight requirements."
  },
  'not-found': {
    title: "404 - Guide Not Found | SnakePlantSoil.com",
    description: "The requested snake plant care page could not be located."
  }
};

export default function App() {
  // Map URL paths to actual sub-tab IDs for robust SEO & Deep Linking without 404s
  const getTabFromPath = (path: string): string => {
    const cleanPath = path.replace(/^\//, '').split('?')[0].split('#')[0];
    switch (cleanPath) {
      case 'setup-kits':
        return 'setup-kits';
      case 'best-soil':
      case 'best-snake-plant-soil':
        return 'best-soil';
      case 'diy-mix':
      case 'diy-snake-plant-soil-mix':
        return 'diy-mix';
      case 'root-rot':
      case 'snake-plant-root-rot-guide':
        return 'root-rot';
      case 'best-pots':
      case 'best-pots-for-snake-plants':
        return 'best-pots';
      case 'care-guide':
      case 'snake-plant-care-guide':
        return 'care-guide';
      case 'care-card':
      case 'faq':
        return cleanPath;
      case '':
      case 'home':
        return 'home';
      default: {
        const isDynamic = routeManifest.dynamic.includes(cleanPath) || routeManifest.dynamic.includes(cleanPath.replace(/^dynamic-/, ''));
        if (isDynamic) {
          return cleanPath.replace(/^dynamic-/, '');
        }
        return 'not-found';
      }
    }
  };

  const [activeTab, setActiveTabState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return getTabFromPath(window.location.pathname);
    }
    return 'home';
  });

  const setActiveTab = (tab: string) => {
    const normalizedTab = getTabFromPath(tab);
    setActiveTabState(normalizedTab);
    if (typeof window !== 'undefined') {
      let targetPath = '/';
      if (normalizedTab !== 'home') {
        const dynamicMatch = dynamicArticles.find(
          a => a.slug === tab || a.id === tab || a.slug === normalizedTab
        );
        if (dynamicMatch) {
          targetPath = `/${dynamicMatch.slug}`;
        } else {
          const staticMatch = STATIC_GUIDES.find(s => s.id === normalizedTab || s.slug === tab || s.id === tab);
          targetPath = `/${staticMatch ? staticMatch.slug : normalizedTab}`;
        }
      }
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ tab: normalizedTab }, '', targetPath);
      }
    }
  };

  // Listen for back/forward browser navigation events to update standard tab context
  useEffect(() => {
    const handlePopState = () => {
      const tab = getTabFromPath(window.location.pathname);
      setActiveTabState(tab);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [faqExpanded, setFaqExpanded] = useState<{ [key: string]: boolean }>({});
  const [heroTipIndex, setHeroTipIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroTipIndex((prev) => (prev + 1) % HERO_CARE_TIPS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const dynamicArticles = useMemo(() => getDynamicArticles(), []);
  const activeDynamicArticle = useMemo(() => {
    return dynamicArticles.find(
      art => art.slug === activeTab || art.id === activeTab || art.slug === activeTab.replace(/^dynamic-/, '')
    );
  }, [dynamicArticles, activeTab]);

  // Dynamic Title, Description, and Canonical Tag Manager
  useEffect(() => {
    let title = PAGE_METADATA.home.title;
    let description = PAGE_METADATA.home.description;
    let canonicalUrl = 'https://snakeplantsoil.com/';
    let is404 = activeTab === 'not-found';

    if (activeDynamicArticle) {
      title = `${activeDynamicArticle.title} | SnakePlantSoil.com`;
      description = activeDynamicArticle.shortDescription;
      canonicalUrl = `https://snakeplantsoil.com/${activeDynamicArticle.slug}`;
    } else if (PAGE_METADATA[activeTab]) {
      title = PAGE_METADATA[activeTab].title;
      description = PAGE_METADATA[activeTab].description;
      if (activeTab !== 'home') {
        const staticMatch = STATIC_GUIDES.find(s => s.id === activeTab);
        const slug = staticMatch ? staticMatch.slug : activeTab;
        canonicalUrl = `https://snakeplantsoil.com/${slug}`;
      }
    } else {
      is404 = true;
      title = PAGE_METADATA['not-found'].title;
      description = PAGE_METADATA['not-found'].description;
    }

    // Set Document Title
    document.title = title;

    // Set Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Set Canonical Link
    let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
    if (is404) {
      if (link) {
        link.remove();
      }
    } else {
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonicalUrl);
    }
  }, [activeTab, activeDynamicArticle]);

  const toggleFaq = (id: string) => {
    setFaqExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val.trim() !== '' && activeTab !== 'faq' && activeTab !== 'home') {
      // Auto toggle to FAQ or search tab context so users see matched answers
    }
  };

  // Filter FAQs based on query
  const filteredFAQs = useMemo(() => {
    if (!searchQuery.trim()) return FAQ_ITEMS;
    const q = searchQuery.toLowerCase();
    return FAQ_ITEMS.filter(faq => 
      faq.question.toLowerCase().includes(q) || 
      faq.answer.toLowerCase().includes(q) ||
      faq.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Navigate to specified article helper
  const navigateToArticle = (id: string) => {
    setActiveTab(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Reset search
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between" id="root-container">
      
      {/* Editorial Responsive Header */}
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onSearchChange={handleSearchChange}
        searchQuery={searchQuery}
      />

      {/* Main Body Grid */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          
          {/* ====================================================
              VIEW A: MAIN HOMEPAGE WRAPPER
              ==================================================== */}
          {activeTab === 'home' && (
            <motion.div
              key="home-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="space-y-0"
              id="homepage-view"
            >
              
              {/* Modern Minimal Hero Section */}
              <section className="bg-white border-b border-stone-200 overflow-hidden" id="hero-heading-block">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  
                  {/* Hero Left Content */}
                  <div className="lg:col-span-7 space-y-6 text-left max-w-2xl">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-150">
                      <ShieldCheck className="w-3.5 h-3.5" /> 100% Expert-Backed Soil & Care Guides
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-mono font-extrabold text-stone-900 tracking-tight leading-[1.1]" id="hero-main-title">
                      The Best Soil for <span className="text-emerald-800 decoration-emerald-800 underline decoration-wavy">Snake Plants</span> — Explained Simply
                    </h1>
                    <p className="text-stone-600 text-sm sm:text-base leading-relaxed pl-1">
                      Beginner-friendly soil guides, drainage tips, care advice, and trusted recommendations to help your snake plants thrive. Learn how to calibrate mineral grittiness and avoid root-rotting moisture traps.
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-3 pt-2 pl-1">
                      <button 
                        onClick={() => navigateToArticle('setup-kits')}
                        className="bg-emerald-800 text-stone-50 hover:bg-emerald-950 px-6 py-3 rounded-lg text-xs font-bold font-sans transition-all shadow-sm flex items-center gap-2"
                        id="hero-cta-setup-kits"
                      >
                        <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
                        <span>Build Custom Setup Kit</span>
                      </button>
                      <button 
                        onClick={() => navigateToArticle('best-soil')}
                        className="bg-stone-100 text-stone-800 hover:bg-stone-200 px-6 py-3 rounded-lg text-xs font-bold font-sans transition-all border border-stone-250 flex items-center gap-2"
                        id="hero-cta-best-soil"
                      >
                        <span>Best Soils</span>
                      </button>
                      <button 
                        onClick={() => navigateToArticle('diy-mix')}
                        className="bg-stone-100 text-stone-800 hover:bg-stone-200 px-6 py-3 rounded-lg text-xs font-bold font-sans transition-all border border-stone-250 flex items-center gap-2"
                        id="hero-cta-diy"
                      >
                        <span>DIY Recipe</span>
                      </button>
                    </div>

                    {/* SEO schema & citations micro badge */}
                    <div className="pt-2 flex items-center gap-4 text-xs text-stone-450 border-t border-stone-100">
                      <div>• Indexed by <span className="font-bold text-stone-700">Academic Databases</span></div>
                      <div>• Rated <span className="font-bold text-emerald-800">Crawlable Specs</span></div>
                      <div>• Verified <span className="font-bold text-stone-700">Pure Botany</span></div>
                    </div>
                  </div>

                  {/* Hero Right Image Graphic */}
                  <div className="lg:col-span-5 relative" id="hero-graphic-image-box">
                    <div className="absolute inset-0 bg-emerald-800/5 rounded-3xl -rotate-2 transform scale-102" />
                    <a 
                      href="https://www.amazon.com/Terracotta-Drainage-Cylinder-Planter-587-42-0/dp/B08QYLP91Q?th=1&tag=snakeplantsoi-20"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative border border-stone-200 bg-stone-100 rounded-3xl overflow-hidden shadow-md aspect-4/3 sm:aspect-square block group cursor-pointer"
                      id="hero-affiliate-image-link"
                    >
                      <img 
                        src="/terracotta-cylinder-planter.png"
                        alt="Terracotta Cylinder Planter Pot with Drainage" 
                        className="w-full h-full object-cover select-none transition-transform duration-300 group-hover:scale-102"
                      />
                      <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-stone-150/50 shadow-sm overflow-hidden min-h-[46px] flex items-center">
                        <div className="flex items-center gap-2.5 w-full">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse shrink-0" />
                          <div className="flex-1 overflow-hidden">
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={heroTipIndex}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.35, ease: 'easeOut' }}
                                className="text-[11px] font-mono font-bold text-stone-750 uppercase tracking-tight flex items-center gap-1.5 truncate"
                              >
                                <span className="text-xs shrink-0">{HERO_CARE_TIPS[heroTipIndex].icon}</span>
                                <span className="text-emerald-900 font-extrabold shrink-0">{HERO_CARE_TIPS[heroTipIndex].label}:</span>
                                <span className="text-stone-700 truncate">{HERO_CARE_TIPS[heroTipIndex].value}</span>
                              </motion.div>
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>

                </div>
              </section>

              {/* SECTION 2: QUICK ANSWERS (Botanical Fact Deck) */}
              <AIAnswerCards />

              {/* COMPREHENSIVE LEAD MAGNET PROMOTION SECTION */}
              <section className="bg-emerald-950 text-stone-100 py-12 px-4 shadow-inner" id="cta-lead-magnet-banner">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  <div className="md:col-span-8 space-y-3.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] uppercase font-mono font-bold bg-emerald-900 text-emerald-300 border border-emerald-800">
                      🌿 Interactive Botanical Care Card Maker
                    </span>
                    <h3 className="text-xl sm:text-2xl font-display font-black tracking-tight leading-tight">
                      Free Printable Care Card & Custom Watering Schedule
                    </h3>
                    <p className="text-emerald-100/90 text-xs sm:text-sm max-w-xl leading-relaxed">
                      Stop guessing or relying on standard calendars. Feed our calculation matrix your pot type, light level, and active season to generate a custom-tailored care card ready to tape alongside your pots in exchange for your email!
                    </p>
                  </div>
                  <div className="md:col-span-4 flex justify-start md:justify-end">
                    <button
                      onClick={() => navigateToArticle('care-card')}
                      className="w-full md:w-auto bg-stone-50 hover:bg-white text-emerald-900 px-6 py-3.5 rounded-xl font-bold font-sans text-xs transition-all shadow-md flex items-center justify-center gap-2"
                      id="home-trigger-lead-magnet"
                    >
                      <span>Create Free Custom Care Card</span>
                      <Sparkles className="w-4 h-4 text-emerald-700 animate-pulse" />
                    </button>
                  </div>
                </div>
              </section>

              {/* SECTION 3: FEATURED GUIDES GRID */}
              <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="featured-guides">
                <div className="text-center max-w-xl mx-auto mb-10">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-805 bg-emerald-100/50 px-2.5 py-1 rounded font-bold">
                    In-depth Authority Materials
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-sans font-bold text-stone-900 tracking-tight mt-2.5">
                    Browse Our Specialist Soil & Care Guides
                  </h2>
                  <p className="text-stone-550 text-sm mt-1.5">
                    Select a curated topic block below to explore advanced water transport science, soil porosity, and troubleshooting guidelines.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {CONTENT_GUIDES.map((guide) => {
                    const targetTab = guide.slug || guide.id;
                    const iconName = guide.iconName || guide.id;
                    return (
                      <div
                        key={guide.id}
                        onClick={() => navigateToArticle(targetTab)}
                        className="bg-white p-6 rounded-2xl border border-stone-200 hover:border-emerald-700/40 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group"
                        id={`guide-card-${guide.id}`}
                      >
                        <div className="space-y-3">
                          <div className="w-10 h-10 rounded-xl bg-stone-100 group-hover:bg-emerald-50 text-stone-700 group-hover:text-emerald-800 flex items-center justify-center transition-colors">
                            {iconName === 'Trees' || iconName === 'best-soil' ? <Trees className="w-5 h-5" /> :
                             iconName === 'Beaker' || iconName === 'diy-mix' ? <Beaker className="w-5 h-5" /> :
                             iconName === 'HeartPulse' || iconName === 'root-rot' ? <HeartPulse className="w-5 h-5" /> :
                             iconName === 'Layers' || iconName === 'best-pots' ? <Layers className="w-5 h-5" /> :
                             <Compass className="w-5 h-5" />}
                          </div>
                          <div>
                            <span className="text-[10px] font-mono font-bold text-stone-400 capitalize bg-stone-50 px-1.5 py-0.5 rounded">
                              {guide.category.replace('-', ' ')}
                            </span>
                            <h3 className="font-bold text-base text-stone-900 mt-1.5 tracking-tight group-hover:text-emerald-850">
                              {guide.title}
                            </h3>
                            <p className="text-stone-500 text-xs mt-1.5 leading-relaxed line-clamp-2">
                              {guide.shortDescription}
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-mono text-stone-400 font-medium">
                          <span>{guide.readTime}</span>
                          <span className="text-emerald-800 font-bold group-hover:underline flex items-center gap-1">
                            Read Guide <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* INTERACTIVE SETUP KIT PROMOTION BLOCK */}
              <section className="py-12 bg-gradient-to-br from-emerald-900 to-stone-900 text-stone-100 border-t border-b border-emerald-950 animate-fade-in" id="homepage-setup-kits-banner">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-8 space-y-3">
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-300 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded">
                        <Sparkles className="w-3.5 h-3.5 animate-pulse text-emerald-450" /> Interactive Shopping Tool
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight">
                        Perfect Mix & Container Kit Builder
                      </h2>
                      <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
                        Are you ready to repot your snake plant? Select your goal (such as simple pre-mix, golden ratio 3-2-1 recipe, or root rot recovery) and your exact plant height. Our algorithm will compile a custom recommended materials list with verified, high-drainage direct Amazon and nursery buying links!
                      </p>
                    </div>
                    <div className="lg:col-span-4 flex lg:justify-end">
                      <button
                        onClick={() => navigateToArticle('setup-kits')}
                        className="w-full lg:w-auto bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-stone-950 font-bold font-sans text-xs px-6 py-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 uppercase tracking-wider"
                        id="home-promo-setup-kits-btn"
                      >
                        <span>Build Custom Kit Setup</span>
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 4 — INTERACTIVE SOIL COLUMN DIAGRAM */}
              <section className="py-12 bg-stone-100/50 border-t border-b border-stone-200" id="soil-layering-breakdown">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center max-w-2xl mx-auto mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-stone-905 tracking-tight">
                      Visualize the Soil Composition Ratios
                    </h2>
                    <p className="text-stone-500 text-xs mt-1.5">
                      Understanding how inorganic minerals isolate water from organic matters is crucial. Click a raw tier inside the visual model to analyze its botanical properties.
                    </p>
                  </div>
                  <SoilMixDiagram />
                </div>
              </section>

              {/* SECTION 5 — DETAILED PRODUCT RECOMMENDATIONS (AFFILIATE SITES) */}
              <ProductSection />

              {/* SECTION 6 — BEGINNER CARE TIPS METRIC */}
              <section className="py-16 bg-white border-t border-stone-200" id="beginner-care-tips-box">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    <div className="lg:col-span-5 space-y-4">
                      <span className="text-emerald-850 font-bold text-xs uppercase tracking-wider font-mono">
                        Beginner Care Strategy
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-bold font-sans text-stone-900 tracking-tight leading-none">
                        Four Non-Negotiable Snake Plant Rules
                      </h2>
                      <p className="text-stone-550 text-sm leading-relaxed">
                        90% of snake plant fatalities occur because beginners treat them like standard tropical soft plants. Adopt these minimal physical checks to secure their moisture margins.
                      </p>
                      
                      <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl flex gap-3 text-xs leading-relaxed text-stone-600">
                        <Info className="w-5 h-5 text-emerald-805 shrink-0 mt-0.5" />
                        <div>
                          <strong>Horticultural Fact:</strong> In dark rooms, snake plants lose up to 92% of their natural evaporation capacity. If your soil doesn’t dry completely within 7 days, shift position or halt all watering vectors!
                        </div>
                      </div>
                    </div>

                    {/* Simple Tips Grid */}
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                      
                      {/* Tip 1 */}
                      <div className="p-5 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:shadow-xs transition-all">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center mb-3">01</div>
                        <h4 className="font-bold text-sm text-stone-900 mb-1">Ditch Calendars: Use the Chopstick Test</h4>
                        <p className="text-xs text-stone-550 leading-relaxed">
                          Never water on a weekly cycle. Push a raw wood chopstick deep into the soil. If it returns with dark spots or damp particles, the soil is damp inside.
                        </p>
                      </div>

                      {/* Tip 2 */}
                      <div className="p-5 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:shadow-xs transition-all">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center mb-3">02</div>
                        <h4 className="font-bold text-sm text-stone-900 mb-1">Diligently Check Leaf Turgor</h4>
                        <p className="text-xs text-stone-550 leading-relaxed">
                          Healthy leaves behave like firm swords. Squeeze the leaf midsection; if it feels soft or displays subtle structural wrinkles, it has exhausted its water reservoirs and is finally ready for a soak.
                        </p>
                      </div>

                      {/* Tip 3 */}
                      <div className="p-5 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:shadow-xs transition-all">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center mb-3">03</div>
                        <h4 className="font-bold text-sm text-stone-900 mb-1">Avoid the Dark Corner Trap</h4>
                        <p className="text-xs text-stone-550 leading-relaxed">
                          Low light stops photosynthesis. Without sun, the plant consumes no soil water. Placed in dim areas, only water the substrate once every 8 to 10 weeks to prevent slow rot.
                        </p>
                      </div>

                      {/* Tip 4 */}
                      <div className="p-5 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:shadow-xs transition-all">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center justify-center mb-3">04</div>
                        <h4 className="font-bold text-sm text-stone-900 mb-1">Drain the Pot Saucer</h4>
                        <p className="text-xs text-stone-550 leading-relaxed">
                          Water deeply, but never let the bottom of your clay pot sit in static standing water inside the decor plate. Empty the tray completely 20 minutes after watering.
                        </p>
                      </div>

                    </div>

                  </div>
                </div>
              </section>

              {/* SECTION 7 — FAQ PREVIEW BOX */}
              <section className="py-16 bg-stone-50 border-t border-stone-200" id="homepage-faq-accordions">
                <div className="max-w-4xl mx-auto px-4 md:px-6">
                  
                  <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-sans font-bold text-stone-90) tracking-tight">
                      Frequently Asked Soil Questions
                    </h2>
                    <p className="text-stone-500 text-xs mt-1">
                      Check verified structural rules about soil materials, Miracle-Gro qualities, low light survival, and more.
                    </p>
                  </div>

                  <div className="space-y-3 bg-white p-6 rounded-2xl border border-stone-250 shadow-xs">
                    {FAQ_ITEMS.slice(0, 5).map((faq) => {
                      const expanded = !!faqExpanded[faq.id];
                      return (
                        <div 
                          key={faq.id}
                          className="border-b border-stone-100 last:border-0 pb-3 last:pb-0"
                          id={`faq-item-collapsible-${faq.id}`}
                        >
                          <button
                            onClick={() => toggleFaq(faq.id)}
                            className="w-full text-left py-3 font-bold text-stone-900 text-xs sm:text-sm flex justify-between items-center hover:text-emerald-800 transition-colors focus:outline-none"
                            id={`faq-toggle-btn-${faq.id}`}
                          >
                            <span className="flex items-center gap-2">
                              <QuestionIcon className="w-4 h-4 text-emerald-700 shrink-0" />
                              {faq.question}
                            </span>
                            <span className="font-mono text-stone-400 text-xs font-bold shrink-0 ml-2">
                              {expanded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            </span>
                          </button>
                          
                          {expanded && (
                            <div className="pl-6 pb-2 text-xs text-stone-605 leading-relaxed" id={`faq-answer-collapsible-${faq.id}`}>
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    <div className="pt-4 text-center">
                      <button
                        onClick={() => navigateToArticle('faq')}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:underline hover:text-emerald-950"
                        id="view-all-faq-btn-home"
                      >
                        <span>View All FAQ Questions & Structured Answers</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              </section>

            </motion.div>
          )}

          {/* ====================================================
              VIEW S: SOIL SETUP & CART BUILDER KITS
              ==================================================== */}
          {activeTab === 'setup-kits' && (
            <motion.div
              key="setup-kits-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
              id="setup-kits-page"
            >
              <div className="mb-6">
                <button 
                  onClick={() => navigateToArticle('home')}
                  className="text-xs font-bold text-stone-550 hover:text-stone-900 flex items-center gap-1 focus:outline-none"
                  id="back-home-setup-kits"
                >
                  ← Return to Home Portal
                </button>
              </div>

              <SoilSetupKit />
            </motion.div>
          )}

          {/* ====================================================
              VIEW B: BEST COMMERCIAL SOILS
              ==================================================== */}
          {activeTab === 'best-soil' && (
            <motion.div
              key="best-soil-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
              id="best-soil-page"
            >
              <div className="mb-6">
                <button 
                  onClick={() => navigateToArticle('home')}
                  className="text-xs font-bold text-stone-550 hover:text-stone-900 flex items-center gap-1 focus:outline-none"
                  id="back-home-best-soil"
                >
                  ← Return to Home Portal
                </button>
              </div>

              <BestSoilArticle onNavigate={navigateToArticle} />
              
              <div className="pt-8 border-t border-stone-200 mt-12">
                <ProductSection />
              </div>
            </motion.div>
          )}

          {/* ====================================================
              VIEW C: DIY RECIPE WITH CALCULATOR
              ==================================================== */}
          {activeTab === 'diy-mix' && (
            <motion.div
              key="diy-mix-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
              id="diy-mix-page"
            >
              <div className="mb-6">
                <button 
                  onClick={() => navigateToArticle('home')}
                  className="text-xs font-bold text-stone-550 hover:text-stone-900 flex items-center gap-1 focus:outline-none"
                  id="back-home-diy"
                >
                  ← Return to Home Portal
                </button>
              </div>

              <DIYMixArticle onNavigate={navigateToArticle} />
            </motion.div>
          )}

          {/* ====================================================
              VIEW D: ROOT ROT DETAILED INTERACTIVE GUIDE
              ==================================================== */}
          {activeTab === 'root-rot' && (
            <motion.div
              key="root-rot-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
              id="root-rot-page"
            >
              <div className="mb-6">
                <button 
                  onClick={() => navigateToArticle('home')}
                  className="text-xs font-bold text-stone-550 hover:text-stone-900 flex items-center gap-1 focus:outline-none"
                  id="back-home-root-rot"
                >
                  ← Return to Home Portal
                </button>
              </div>

              <RootRotArticle onNavigate={navigateToArticle} />
            </motion.div>
          )}

          {/* ====================================================
              VIEW E: CONTAINER SIZING AND POT SCIENCE
              ==================================================== */}
          {activeTab === 'best-pots' && (
            <motion.div
              key="best-pots-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
              id="best-pots-page"
            >
              <div className="mb-6">
                <button 
                  onClick={() => navigateToArticle('home')}
                  className="text-xs font-bold text-stone-550 hover:text-stone-900 flex items-center gap-1 focus:outline-none"
                  id="back-home-best-pots"
                >
                  ← Return to Home Portal
                </button>
              </div>

              <BestPotsArticle onNavigate={navigateToArticle} />
            </motion.div>
          )}

          {/* ====================================================
              VIEW F: COMPLETE CARE AND WATERING
              ==================================================== */}
          {activeTab === 'care-guide' && (
            <motion.div
              key="care-guide-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
              id="care-guide-page"
            >
              <div className="mb-6">
                <button 
                  onClick={() => navigateToArticle('home')}
                  className="text-xs font-bold text-stone-550 hover:text-stone-900 flex items-center gap-1 focus:outline-none"
                  id="back-home-care"
                >
                  ← Return to Home Portal
                </button>
              </div>

              <CareGuideArticle onNavigate={navigateToArticle} />
            </motion.div>
          )}

          {/* ====================================================
              VIEW G: ALL FAQ DIRECT DECK WITH SEARCH
              ==================================================== */}
          {activeTab === 'faq' && (
            <motion.div
              key="faq-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
              id="faq-page"
            >
              <div className="mb-6">
                <button 
                  onClick={() => navigateToArticle('home')}
                  className="text-xs font-bold text-stone-550 hover:text-stone-900 flex items-center gap-1 focus:outline-none"
                  id="back-home-faq"
                >
                  ← Return to Home Portal
                </button>
              </div>

              <div className="mb-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-850 mb-2">
                  <QuestionIcon className="w-4.5 h-4.5" /> Structured FAQ Catalog
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-stone-950 tracking-tight mt-1">
                  Exhaustive Botanical Knowledgebase
                </h2>
                <p className="text-stone-600 text-sm mt-1.5">
                  Our raw FAQ lists are engineered with optimized heading elements and direct answers designed to be indexable by third-party search engines. Use the page search bar above to drill down instantly.
                </p>
              </div>

              {/* Dynamic Filter Search Feedback Box */}
              {searchQuery.trim() !== '' && (
                <div className="bg-emerald-50 text-emerald-800 text-xs p-3.5 rounded-xl border border-emerald-100 mb-6 flex justify-between items-center">
                  <span>Filtered questions matching "<strong>{searchQuery}</strong>": found <strong>{filteredFAQs.length}</strong> results.</span>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="underline font-bold hover:text-emerald-950 ml-2 text-emerald-850 shrink-0"
                    id="clear-search-faq"
                  >
                    Reset Filter
                  </button>
                </div>
              )}

              <div className="space-y-4">
                {filteredFAQs.length === 0 ? (
                  <div className="p-8 text-center rounded-xl border border-dashed border-stone-200 bg-white">
                    <p className="text-stone-650 text-sm">No specific FAQ items found matching "{searchQuery}".</p>
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="mt-3 text-xs text-emerald-800 font-bold bg-stone-100 px-3.5 py-2 rounded-lg hover:bg-stone-200"
                      id="reset-faq-query"
                    >
                      Reset Filter
                    </button>
                  </div>
                ) : (
                  filteredFAQs.map((faq) => {
                    const expanded = faqExpanded[faq.id] ?? true; // defaults to expanded!
                    return (
                      <div 
                        key={faq.id} 
                        className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between"
                        id={`faq-article-container-${faq.id}`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-4">
                            <span className="text-[9px] uppercase font-mono font-bold text-white bg-stone-900 px-2 py-0.5 rounded tracking-widest shrink-0">
                              Category: {faq.category}
                            </span>
                            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-emerald-805 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0 border border-emerald-100">
                              Verified
                            </span>
                          </div>
                          
                          <h3 className="text-base sm:text-lg font-bold text-stone-955 mt-4 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-emerald-800 rounded-full shrink-0" />
                            {faq.question}
                          </h3>

                          {/* Direct Quotable Answer */}
                          <p className="text-stone-701 text-sm leading-relaxed mt-2.5 pl-3.5 border-l-2 border-stone-200 italic font-sans">
                            "{faq.answer}"
                          </p>
                        </div>

                        <div className="mt-8 pt-4 border-t border-stone-100 flex flex-wrap gap-2 items-center justify-between text-[11px] text-stone-450">
                          <span>Verified by SnakePlantSoil.com Greenhouse Trial Systems</span>
                          <span className="font-mono text-emerald-800 font-bold">Schema Class: FAQPage</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="mt-12 p-6 rounded-2xl bg-white border border-stone-200 shadow-xs max-w-2xl mx-auto text-center space-y-4">
                <Award className="w-8 h-8 text-amber-500 mx-auto" />
                <h4 className="font-bold text-stone-900">Have a customized agricultural soil question?</h4>
                <p className="text-xs text-stone-605 leading-relaxed">
                  We are constantly expanding our sitemaps and catalog decks. Send us your botanical inquiries or pot dimensions at <strong>hello@snakeplantsoil.com</strong>, and we will update our data schemas!
                </p>
              </div>

            </motion.div>
          )}

          {/* ====================================================
              VIEW H: PRINTABLE CUSTOM CARE CARD GENERATOR (LEAD MAGNET)
              ==================================================== */}
          {activeTab === 'care-card' && (
            <motion.div
              key="care-card-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
              id="care-card-page"
            >
              <div className="mb-6">
                <button 
                  onClick={() => navigateToArticle('home')}
                  className="text-xs font-bold text-stone-550 hover:text-stone-900 flex items-center gap-1 focus:outline-none"
                  id="back-home-care-card-magnet"
                >
                  ← Return to Home Portal
                </button>
              </div>

              <LeadMagnet />
            </motion.div>
          )}

          {activeDynamicArticle && (
            <motion.div
              key="dynamic-article-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
              id={`dynamic-article-page-${activeDynamicArticle.slug}`}
            >
              <div className="mb-6">
                <button 
                  onClick={() => navigateToArticle('home')}
                  className="text-xs font-bold text-stone-550 hover:text-stone-900 flex items-center gap-1 focus:outline-none"
                  id="back-home-dynamic"
                >
                  ← Return to Home Portal
                </button>
              </div>

              <DynamicArticleView article={activeDynamicArticle} onNavigate={navigateToArticle} />
            </motion.div>
          )}

          {/* Fallback View if tab is not a known static tab and dynamic article is not found */}
          {!['home', 'setup-kits', 'best-soil', 'diy-mix', 'root-rot', 'best-pots', 'care-guide', 'faq', 'care-card'].includes(activeTab) && !activeDynamicArticle && (
            <motion.div
              key="not-found-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4"
              id="not-found-page"
            >
              <div className="w-16 h-16 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold font-mono border border-emerald-200">
                404
              </div>
              <h2 className="text-2xl font-bold font-sans text-stone-900 tracking-tight">Article or Guide Not Found</h2>
              <p className="text-stone-600 text-sm max-w-md mx-auto leading-relaxed">
                The requested guide link could not be located. Browse our main botanical resources or search for care definitions below.
              </p>
              <div className="pt-2">
                <button 
                  onClick={() => navigateToArticle('home')}
                  className="bg-emerald-800 hover:bg-emerald-950 text-white font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-sm"
                  id="return-home-from-404"
                >
                  ← Return to Home Portal
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Modern sitemap footer */}
      <Footer setActiveTab={setActiveTab} />

    </div>
  );
}
