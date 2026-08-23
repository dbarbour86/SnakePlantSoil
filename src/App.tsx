import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trees, Beaker, HeartPulse, Layers, Compass, HelpCircle, 
  ChevronRight, Check, AlertTriangle, Info, Search, 
  Sparkles, Award, Star, ArrowRight, ShieldCheck, HelpCircle as QuestionIcon, Plus, Minus,
  ExternalLink
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
import { SOIL_PROFILES, COMMERCIAL_PRODUCTS } from './diagnosticConfig';


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
    title: "Snake Plant Soil Diagnosis & Custom Recommendations | SnakePlantSoil.com",
    description: "Troubleshoot your snake plant's leaves, pot, and watering conditions. Get a recommended commercial soil profile and fit check."
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
  about: {
    title: "About Our Practical Soil Research | SnakePlantSoil.com",
    description: "Learn about Snake Plant Soil Lab's mission to simplify plant care, pot, light and watering mechanics, and future soil mix trials."
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
      case 'soil-diagnosis':
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
      case 'faq':
        return 'faq';
      case 'about':
        return 'about';
      case 'care-card':
        return 'care-card';
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
        } else if (normalizedTab === 'setup-kits') {
          targetPath = '/soil-diagnosis';
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
        if (activeTab === 'setup-kits') {
          canonicalUrl = 'https://snakeplantsoil.com/soil-diagnosis';
        } else {
          const staticMatch = STATIC_GUIDES.find(s => s.id === activeTab);
          const slug = staticMatch ? staticMatch.slug : activeTab;
          canonicalUrl = `https://snakeplantsoil.com/${slug}`;
        }
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
              
              {/* Hero Section */}
              <section className="bg-white border-b border-stone-200 overflow-hidden shadow-2xs" id="hero-heading-block">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  
                  {/* Hero Left Content */}
                  <div className="lg:col-span-7 space-y-5 text-left max-w-2xl">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-mono font-bold bg-emerald-50 text-emerald-805 border border-emerald-100 uppercase tracking-wider">
                      🌿 Built specifically for snake plants
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-mono font-extrabold text-stone-900 tracking-tight leading-[1.1]" id="hero-main-title">
                      Your Snake Plant Is <span className="text-emerald-850 decoration-emerald-850 underline decoration-wavy">Telling You Something.</span>
                    </h1>
                    <p className="text-stone-600 text-xs sm:text-sm leading-relaxed pl-0.5">
                      Tell us what the leaves, soil and growing conditions are doing. We’ll help you identify the soil profile that best fits your plant and compare suitable ready-made options.
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button 
                        onClick={() => navigateToArticle('setup-kits')}
                        className="bg-emerald-800 text-stone-50 hover:bg-emerald-950 px-5 py-2.5 rounded-lg text-xs font-bold font-sans transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                        id="hero-cta-setup-kits"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                        <span>Find My Soil Profile</span>
                      </button>
                      <button 
                        onClick={() => navigateToArticle('best-soil')}
                        className="bg-stone-100 text-stone-850 hover:bg-stone-200 px-5 py-2.5 rounded-lg text-xs font-bold font-sans transition-all border border-stone-250 flex items-center gap-2 cursor-pointer"
                        id="hero-cta-best-soil"
                      >
                        <span>Compare Ready-Made Soils</span>
                      </button>
                    </div>

                    <div className="pt-3 flex items-center gap-4 text-[10px] sm:text-xs text-stone-450 border-t border-stone-100">
                      <div>• Answer a few questions</div>
                      <div>• Find the right soil type</div>
                      <div>• Practical guidance for real homes</div>
                    </div>
                  </div>

                  {/* Hero Right Graphic - Snake Plant Image + Overlay Card */}
                  <div className="lg:col-span-5 relative" id="hero-graphic-image-box">
                    {/* Snake Plant Image */}
                    <div className="relative w-full aspect-4/3 sm:aspect-square lg:aspect-4/3 rounded-3xl overflow-hidden border border-stone-200 shadow-sm bg-stone-100">
                      <img 
                        src="/hero-snake-plant.png" 
                        alt="Healthy snake plant in a terracotta pot with well-drained soil in a naturally lit room" 
                        className="w-full h-full object-cover"
                        loading="eager"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent" />
                    </div>

                    {/* Layered Soil Profile Preview Card (Partially overlapping) */}
                    <div className="absolute -bottom-4 -left-4 md:-left-6 max-w-[260px] sm:max-w-[280px] border border-stone-200 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg text-left space-y-2.5 hidden sm:block">
                      <div className="flex items-center justify-between border-b border-stone-100 pb-1.5">
                        <span className="text-[8px] font-mono font-bold text-emerald-805 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 uppercase">
                          Profile Preview
                        </span>
                        <span className="text-[8px] font-mono text-stone-400">
                          everyday-balance
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        Everyday Balance
                      </h3>
                      <p className="text-stone-500 text-[10px] leading-relaxed">
                        A balanced organic-mineral mix. Best for average indoor conditions.
                      </p>
                      
                      <div className="flex items-center justify-between text-[9px] text-stone-600 border-t border-stone-100 pt-2 font-mono">
                        <span>Dry-down: 3-5 days</span>
                        <button
                          onClick={() => navigateToArticle('setup-kits')}
                          className="text-emerald-800 hover:text-emerald-950 font-bold hover:underline cursor-pointer"
                        >
                          Find My Profile →
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </section>

              {/* SECTION 2: HOW IT WORKS */}
              <section className="py-14 bg-sage-50 border-t border-b border-sage-100 relative overflow-hidden" id="homepage-how-it-works">
                {/* Subtle organic dot background texture */}
                <div className="absolute inset-0 bg-soil-texture pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="text-center max-w-2xl mx-auto mb-10">
                    <span className="text-[10px] sm:text-xs font-mono font-bold text-emerald-805 uppercase tracking-widest block mb-2">
                      HOW IT WORKS
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                      How the Soil Check Works
                    </h2>
                    <p className="text-stone-650 text-xs sm:text-sm mt-2 leading-relaxed">
                      Answer a few questions, find your soil profile and compare ready-made options that fit your plant’s conditions.
                    </p>
                  </div>

                  <div className="relative">
                    {/* Directional Progression Lines: Vertical on mobile, Horizontal on desktop */}
                    <div className="absolute left-[44px] md:left-[15%] md:right-[15%] top-10 bottom-10 md:bottom-auto md:top-[44px] w-0 md:w-auto h-full md:h-0 border-l border-dashed md:border-l-0 md:border-t border-emerald-800/15 z-0" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                      {/* Step 1 */}
                      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 motion-safe:transform-none flex flex-col justify-between h-full">
                        <div className="space-y-4">
                          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-800 font-mono font-bold text-sm flex items-center justify-center border border-emerald-100/50 shadow-2xs">
                            01
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-display font-bold text-xs sm:text-sm uppercase tracking-wider text-stone-900">
                              TELL US WHAT YOU SEE
                            </h3>
                            <p className="text-stone-600 text-xs sm:text-[13px] leading-relaxed">
                              Answer a few questions about the leaves, soil, pot and growing conditions.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 motion-safe:transform-none flex flex-col justify-between h-full">
                        <div className="space-y-4">
                          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-800 font-mono font-bold text-sm flex items-center justify-center border border-emerald-100/50 shadow-2xs">
                            02
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-display font-bold text-xs sm:text-sm uppercase tracking-wider text-stone-900">
                              FIND YOUR SOIL PROFILE
                            </h3>
                            <p className="text-stone-600 text-xs sm:text-[13px] leading-relaxed">
                              We’ll match those conditions to one of five practical soil profiles.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 motion-safe:transform-none flex flex-col justify-between h-full">
                        <div className="space-y-4">
                          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-800 font-mono font-bold text-sm flex items-center justify-center border border-emerald-100/50 shadow-2xs">
                            03
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-display font-bold text-xs sm:text-sm uppercase tracking-wider text-stone-900">
                              COMPARE READY-MADE SOILS
                            </h3>
                            <p className="text-stone-600 text-xs sm:text-[13px] leading-relaxed">
                              See suitable commercial options, including their strengths and limitations.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Centered CTA */}
                  <div className="mt-10 flex justify-center">
                    <button
                      onClick={() => navigateToArticle('setup-kits')}
                      className="bg-emerald-800 text-stone-50 hover:bg-emerald-950 px-6 py-3 rounded-lg text-xs font-bold font-sans transition-all shadow-xs flex items-center gap-1.5 cursor-pointer hover:shadow-md"
                      id="how-it-works-cta"
                    >
                      <span>Find My Soil Profile</span>
                      <span className="text-emerald-300">→</span>
                    </button>
                  </div>
                </div>
              </section>

              {/* SECTION 3: SOIL PROFILE PREVIEW LIST */}
              <section className="py-12 bg-white" id="homepage-soil-profiles-preview">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center max-w-xl mx-auto mb-8">
                    <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
                      The Five Soil Profiles
                    </h2>
                    <p className="text-stone-500 text-xs mt-1.5">
                      Explore the characteristics of our five primary soil profiles. Click to run the soil check and find which profile fits your plant.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SOIL_PROFILES.map((profile) => {
                      let conciseDesc = '';
                      if (profile.id === 'fast-drain') {
                        conciseDesc = 'For soil that stays wet too long, humid homes or frequent watering.';
                      } else if (profile.id === 'everyday-balance') {
                        conciseDesc = 'For healthy plants, routine repotting and average indoor conditions.';
                      } else if (profile.id === 'dry-home') {
                        conciseDesc = 'For soil that dries very quickly, dry rooms or breathable terracotta pots.';
                      } else if (profile.id === 'recovery') {
                        conciseDesc = 'For repotting after damaged roots or rhizomes have been properly addressed.';
                      } else if (profile.id === 'propagation') {
                        conciseDesc = 'For rooted cuttings, young plants and smaller containers.';
                      }

                      return (
                        <div 
                          key={profile.id}
                          className="border border-stone-200 p-5 rounded-2xl bg-stone-50/45 space-y-4 hover:border-emerald-700/30 transition-all flex flex-col justify-between"
                        >
                          <div className="space-y-2">
                            <span className="text-[8px] font-mono font-bold text-emerald-808 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 block w-fit">
                              Profile Spec
                            </span>
                            <h3 className="font-mono font-bold text-stone-900 text-xs uppercase tracking-wide">
                              {profile.name}
                            </h3>
                            <p className="text-stone-550 text-xs leading-relaxed">
                              {conciseDesc}
                            </p>
                          </div>

                          <button
                            onClick={() => navigateToArticle('setup-kits')}
                            className="w-full bg-white border border-stone-200 hover:bg-stone-50 text-stone-750 py-2 rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <span>See If This Fits My Plant</span>
                            <span>→</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* SECTION 4: BEST READY-MADE SOILS PREVIEW */}
              <section className="py-10 bg-stone-100/50 border-t border-b border-stone-200" id="homepage-ready-made-soils">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center max-w-xl mx-auto mb-8">
                    <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
                      Compare Ready-Made Soils
                    </h2>
                    <p className="text-stone-500 text-xs mt-1.5">
                      An editorial overview of recommended commercial soil mixes from our catalog, matching their qualities to different home conditions.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {COMMERCIAL_PRODUCTS.slice(0, 3).map((prod) => (
                      <div key={prod.id} className="bg-white border border-stone-200 p-5 rounded-2xl flex flex-col justify-between hover:border-emerald-700/20 transition-all">
                        <div className="space-y-3">
                          <div className="flex gap-3">
                            <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-stone-50 border border-stone-200 flex items-center justify-center p-1">
                              <img src={prod.imageUrl} alt={prod.name} className="max-w-full max-h-full object-contain" />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[8px] font-mono font-bold text-emerald-805 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 uppercase block w-fit">
                                BEST FOR
                              </span>
                              <span className="text-xs font-bold text-stone-705">
                                {prod.id === 'bonsai-jack-gritty' ? 'Fast drainage' :
                                 prod.id === 'hoffman-succulent' ? 'Balanced potting' :
                                 prod.id === 'espoma-cactus' ? 'Organic roots' : 'Budget potting'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-0.5">
                            <div className="text-[9px] font-mono text-stone-400 font-bold uppercase">{prod.brand}</div>
                            <h3 className="font-bold text-stone-900 text-xs leading-snug">
                              {prod.name}
                            </h3>
                          </div>

                          <p className="text-stone-550 text-xs leading-relaxed">
                            {prod.id === 'bonsai-jack-gritty' 
                              ? 'Very gritty and fast draining, but its largely mineral structure may require different watering and feeding habits.'
                              : prod.id === 'hoffman-succulent'
                              ? 'Ready-to-use organic-mineral mix with perlite, but holds more moisture than gritty mixes and requires strict dry periods.'
                              : prod.id === 'espoma-cactus'
                              ? 'Active Mycorrhizae root stimulator base, though its organic peat humus retention demands careful watering checks.'
                              : 'Highly affordable local option, but its fine peat content is prone to dry compaction if left unwatered.'
                            }
                          </p>

                          <div className="text-[10px] border-t border-stone-100 pt-2 space-y-1 font-sans">
                            <div className="flex items-start gap-1 text-stone-605">
                              <span className="text-emerald-700 font-bold">✓</span>
                              <span><strong>Strength:</strong> {prod.strengths[0]}</span>
                            </div>
                            <div className="flex items-start gap-1 text-stone-605">
                              <span className="text-amber-600 font-bold">⚠</span>
                              <span><strong>Limitation:</strong> {prod.limitations[0]}</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 flex items-center justify-between border-t border-stone-100 mt-4">
                          <a
                            href="/best-snake-plant-soil"
                            onClick={(e) => {
                              e.preventDefault();
                              navigateToArticle('best-soil');
                            }}
                            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:underline inline-flex items-center gap-0.5"
                          >
                            <span>View Review</span>
                            <span>→</span>
                          </a>
                          <span className="text-[8px] text-stone-400 font-mono italic">
                            *Affiliate link
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-center">
                    <button
                      onClick={() => navigateToArticle('best-soil')}
                      className="inline-flex items-center gap-1 bg-emerald-800 hover:bg-emerald-950 text-white font-bold px-5 py-2.5 rounded-lg text-xs transition-colors shadow-xs cursor-pointer"
                      id="view-all-commercial-btn"
                    >
                      <span>Compare Ready-Made Soils</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </section>

              {/* SECTION 5: USEFUL GUIDES */}
              <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="featured-guides">
                <div className="text-center max-w-xl mx-auto mb-10">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-805 bg-emerald-100/50 px-2.5 py-1 rounded font-bold">
                    Practical Soil Manuals
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-sans font-bold text-stone-900 tracking-tight mt-2.5">
                    Useful Soil &amp; Potting Guides
                  </h2>
                  <p className="text-stone-550 text-sm mt-1.5">
                    Browse our guides to learn about soil ingredients, root rot recovery, breathable containers, and seasonal watering checks.
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

              {/* SECTION 6: FUTURE SOILS WAITLIST INVITATION */}
              <section className="bg-emerald-950 text-stone-100 py-12 px-4" id="homepage-waitlist-block">
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  <div className="md:col-span-7 space-y-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] uppercase font-mono font-bold bg-emerald-900 text-emerald-300 border border-emerald-805">
                      🌿 Custom Soil Research
                    </span>
                    <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">
                      We’re Developing Soil Specifically for Snake Plants
                    </h2>
                    <p className="text-emerald-100/90 text-xs leading-relaxed">
                      We’re researching ready-made soil options and learning which conditions cause snake plant owners the most trouble. Your soil check will help guide what we develop.
                    </p>
                  </div>
                  <div className="md:col-span-5 bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-white tracking-tight">Help Shape What We Make</h3>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        Complete the soil check to help us understand what snake plant owners actually need.
                      </p>
                    </div>
                    <button
                      onClick={() => navigateToArticle('setup-kits')}
                      className="w-full bg-stone-50 hover:bg-white text-emerald-950 font-bold px-5 py-2.5 rounded-xl font-sans text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      id="home-trigger-waitlist"
                    >
                      <span>Find My Soil Profile</span>
                      <ArrowRight className="w-4 h-4 text-emerald-900" />
                    </button>
                  </div>
                </div>
              </section>

              {/* SECTION 7: FAQ PREVIEW */}
              <section className="py-16 bg-stone-50 border-t border-stone-200" id="homepage-faq-accordions">
                <div className="max-w-4xl mx-auto px-4 md:px-6">
                  
                  <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-sans font-bold text-stone-900 tracking-tight">
                      Common Soil Questions
                    </h2>
                    <p className="text-stone-550 text-xs mt-1">
                      Read clear explanations about snake plant watering cycles, container drainage, and soil additives.
                    </p>
                  </div>

                  <div className="space-y-3 bg-white p-6 rounded-2xl border border-stone-250 shadow-xs">
                    {FAQ_ITEMS.slice(0, 3).map((faq) => {
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
                            <div className="pl-6 pb-2 text-xs text-stone-605 leading-relaxed font-sans" id={`faq-answer-collapsible-${faq.id}`}>
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
                        <span>View All Potting &amp; Care FAQs</span>
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

          {activeTab === 'about' && (
            <motion.div
              key="about-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
              id="about-page"
            >
              <div className="mb-6">
                <button 
                  onClick={() => navigateToArticle('home')}
                  className="text-xs font-bold text-stone-550 hover:text-stone-900 flex items-center gap-1 focus:outline-none"
                  id="back-home-about"
                >
                  ← Return to Home Portal
                </button>
              </div>

              <article className="prose prose-stone max-w-none text-stone-705 leading-relaxed space-y-6">
                <div className="bg-gradient-to-br from-emerald-50 to-stone-100 p-6 rounded-2xl border border-stone-200 mb-8">
                  <h2 className="text-xl md:text-2xl font-mono font-bold text-stone-900 tracking-tight mt-0 flex items-center gap-2">
                    About Snake Plant Soil Lab
                  </h2>
                  <p className="text-stone-600 text-xs mt-2 mb-0 leading-relaxed">
                    Our mission is to help snake plant owners understand how pot type, light, watering habits, and soil characteristics interact.
                  </p>
                </div>

                <h3 className="text-sm font-mono font-bold text-stone-900 mt-6 uppercase tracking-wider">Our Approach to Plant Care</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Snake Plant Soil Lab was founded to replace confusing, overly complex plant advice with straightforward, practical resources. We believe that caring for plants shouldn't require advanced botanical degrees. By examining the basic mechanics of how materials hold and release water, any beginner can grow resilient, healthy snake plants.
                </p>
                
                <h3 className="text-sm font-mono font-bold text-stone-900 mt-6 uppercase tracking-wider">Practical Product Comparisons</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  We compile independent product reviews and organize potting soil characteristics into distinct categories. Every catalog product is annotated with disclosed ingredients, price indicators, and best-use conditions to help you make informed buying decisions.
                </p>

                <h3 className="text-sm font-mono font-bold text-stone-900 mt-6 uppercase tracking-wider">Future Soil Blends Research</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  We are currently documenting the development of our own line of future snake plant soil profiles. We are researching recipes designed specifically for different homes, containers, and watering habits to make repotting as easy as possible.
                </p>
              </article>
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
          {!['home', 'setup-kits', 'best-soil', 'diy-mix', 'root-rot', 'best-pots', 'care-guide', 'faq', 'care-card', 'about'].includes(activeTab) && !activeDynamicArticle && (
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
