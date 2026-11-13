import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trees, Beaker, HeartPulse, Layers, Compass, HelpCircle, 
  ChevronRight, Check, AlertTriangle, Info, Search, 
  Sparkles, Award, Star, ArrowRight, ShieldCheck, HelpCircle as QuestionIcon, Plus, Minus,
  ExternalLink, Radio, Headphones
} from 'lucide-react';

import Navigation from './components/Navigation';
import Footer from './components/Footer';
import AIAnswerCards from './components/AIAnswerCards';
import ProductSection from './components/ProductSection';
import SoilMixDiagram from './components/SoilMixDiagram';
import LeadMagnet from './components/LeadMagnet';
import SoilSetupKit from './components/SoilSetupKit';
import RadioHub from './components/RadioHub';
import EpisodeDetail from './components/EpisodeDetail';
import { getEpisodes } from './episodes';

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
import { RANKED_SOIL_PRODUCTS } from './soilRankings';
import { trackPageView } from './utils/analytics';


const HERO_CARE_TIPS = [
  { icon: '🌱', label: 'Soil', value: 'Fast-Draining • 40% Perlite Blend' },
  { icon: '💧', label: 'Water', value: 'Every 2–4 Weeks' },
  { icon: '☀️', label: 'Light', value: 'Bright Indirect Light' },
  { icon: '⚱️', label: 'Pot', value: 'Terracotta or Ceramic with Drainage' },
  { icon: '🌡️', label: 'Temp', value: '65–85°F (18–29°C)' },
];

const PAGE_METADATA: Record<string, { title: string; description: string }> = {
  home: {
    title: "Snake Plant Soil Guide, Diagnosis & Care | SnakePlantSoil.com",
    description: "Find the right soil for your snake plant, diagnose drainage problems, make a DIY mix, recover from root rot, and choose the right pot with practical guides and tools."
  },
  'setup-kits': {
    title: "Snake Plant Soil Diagnosis & Custom Recommendations | SnakePlantSoil.com",
    description: "Troubleshoot your snake plant's leaves, pot, and watering conditions. Get a recommended commercial soil profile and fit check."
  },
  'best-soil': {
    title: "The 3 Best Soils for Snake Plants: Buyer's Guide | SnakePlantSoil.com",
    description: "Compare the 3 best commercial soil mixes for snake plants. Learn what improves drainage, avoid common potting mistakes, and reduce root rot risk."
  },
  'diy-mix': {
    title: "DIY Snake Plant Soil Mix Recipe (3-2-1 Ratio) | SnakePlantSoil.com",
    description: "Our signature 3-2-1 gritty recipe. Learn how to mix potting soil, perlite, and coarse sand for the absolute ultimate home mix."
  },
  'root-rot': {
    title: "Snake Plant Root Rot: Symptoms, Recovery Steps & Treatment",
    description: "Identify snake plant root rot early. Learn the key symptoms—mushy roots, foul odor, and yellow leaves—plus a 5-step recovery guide to save your plant."
  },
  'best-pots': {
    title: "Best Pots for Snake Plants: Size, Material & Drainage Guide",
    description: "Discover the best pots for snake plants. Compare terracotta, ceramic, and plastic containers, choose an appropriate pot size, and learn practical drainage rules."
  },
  'care-guide': {
    title: "Snake Plant Care Guide: Watering, Light, Soil & Indoor Care",
    description: "Learn how to care for a snake plant indoors, including watering, light, soil, pots, seasonal care, fertilizer, and common signs of plant stress."
  },
  radio: {
    title: "Snake Plant Radio | Soil Science, Drainage & Care Podcast",
    description: "Official podcast of SnakePlantSoil.com. Deep-dive weekly discussions on soil aeration, container choices, root rot recovery, and resilient houseplant cultivation."
  },
  faq: {
    title: "Snake Plant Potting & Care FAQs | SnakePlantSoil.com",
    description: "Straightforward answers to common questions about watering frequency, soil amendments, pot sizes, and rot prevention."
  },
  about: {
    title: "About SnakePlantSoil.com | Practical Plant Care Guides",
    description: "Learn why SnakePlantSoil.com was created, how our guides and interactive tools work, and how to reach us."
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
      case 'radio':
      case 'podcast':
        return 'radio';
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
        if (cleanPath.startsWith('radio/')) {
          return cleanPath;
        }
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
        if (normalizedTab === 'radio') {
          targetPath = '/radio';
        } else if (normalizedTab.startsWith('radio/')) {
          targetPath = `/${normalizedTab}`;
        } else {
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

  // Handle hash scrolling on direct load or tab navigation (e.g. /about#affiliate-disclosure)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash) {
      const targetId = hash.replace(/^#/, '');
      const timer = setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [faqSearchQuery, setFaqSearchQuery] = useState<string>('');
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

  const episodes = useMemo(() => getEpisodes(), []);
  const activeEpisode = useMemo(() => {
    if (activeTab.startsWith('radio/')) {
      const epSlug = activeTab.replace(/^radio\//, '');
      return episodes.find(e => e.slug === epSlug || e.id === `episode-${epSlug}`);
    }
    return null;
  }, [episodes, activeTab]);

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
    } else if (activeEpisode) {
      title = `${activeEpisode.title} | Snake Plant Radio`;
      description = activeEpisode.description;
      canonicalUrl = `https://snakeplantsoil.com/radio/${activeEpisode.slug}`;
    } else if (activeTab === 'radio') {
      title = PAGE_METADATA.radio.title;
      description = PAGE_METADATA.radio.description;
      canonicalUrl = 'https://snakeplantsoil.com/radio';
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

    // Trigger GA4 page_view after document.title and canonical link are fully set
    trackPageView(window.location.pathname, title);
  }, [activeTab, activeDynamicArticle, activeEpisode]);

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

  // Filter FAQs based on in-page query
  const filteredFAQs = useMemo(() => {
    if (!faqSearchQuery.trim()) return FAQ_ITEMS;
    const q = faqSearchQuery.toLowerCase();
    return FAQ_ITEMS.filter(faq => 
      faq.question.toLowerCase().includes(q) || 
      faq.answer.toLowerCase().includes(q) ||
      faq.category.toLowerCase().includes(q)
    );
  }, [faqSearchQuery]);

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
        onNavigate={navigateToArticle}
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
              
              {/* ====================================================
                  BOTANICAL FIELD GUIDE HERO (SINGLE H1 FOR ALL VIEWPORTS)
                  ==================================================== */}
              <section className="relative bg-[#FAF7F2] border-b border-[#EAE4D8] overflow-hidden" id="hero-botanical-field-guide">
                
                {/* Desktop Room Photography Background (Hidden on Mobile) */}
                <div className="hidden md:block absolute inset-0 pointer-events-none">
                  <img 
                    src="/hero-botanical-room.jpg" 
                    alt="Bright room featuring a snake plant in a stoneware pot on a wooden table" 
                    className="w-full h-full object-cover object-right-top" 
                    loading="eager" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/95 to-transparent w-full md:w-[68%] lg:w-[58%]" />
                </div>

                {/* Main Hero Content Container (Shared across Mobile & Desktop) */}
                <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 pt-7 pb-6 md:py-20 flex flex-col justify-center min-h-0 md:min-h-[500px] lg:min-h-[560px]">
                  <div className="max-w-xl space-y-4 md:space-y-5 text-left">
                    <div className="flex items-center gap-2 md:gap-2.5">
                      <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-[#235837]">HEALTHY ROOTS. THRIVING PLANTS.</span>
                      <div className="w-8 md:w-12 h-0.5 bg-[#8BA894]/70 rounded-full"></div>
                    </div>

                    {/* Single Exposed Homepage H1 for All Viewports and Screen Readers */}
                    <h1 className="font-serif-editorial text-[28px] sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-[#142B1E] tracking-tight leading-[1.14] sm:leading-[1.12]">
                      Find the Right Soil for Your Snake Plant
                    </h1>

                    <p className="text-stone-700 text-base md:text-lg leading-relaxed">
                      Compare ready-made mixes, follow a DIY recipe, or get help choosing for your conditions.
                    </p>

                    <div className="pt-1 md:pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
                      <a 
                        href="/best-snake-plant-soil"
                        onClick={(e) => {
                          e.preventDefault();
                          navigateToArticle('best-soil');
                        }}
                        className="inline-flex items-center gap-2 bg-[#1B3B2B] hover:bg-[#122A1E] text-stone-50 px-5 md:px-6 py-2.5 md:py-3 rounded-full text-xs md:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
                        id="hero-compare-soils-cta"
                      >
                        <span>Compare Soil Mixes</span>
                        <span className="text-[#9EC4A9]">→</span>
                      </a>
                      <a 
                        href="/diy-snake-plant-soil-mix"
                        onClick={(e) => {
                          e.preventDefault();
                          navigateToArticle('diy-mix');
                        }}
                        className="inline-flex items-center gap-1.5 text-xs md:text-sm font-bold text-[#1A3B29] hover:text-[#122A1E] px-3.5 py-2.5 rounded-full hover:bg-[#EAE4D8]/50 transition-all cursor-pointer"
                        id="hero-diy-mix-link"
                      >
                        <span>Make Your Own Mix</span>
                        <span className="text-[#235837]">→</span>
                      </a>
                    </div>

                    {/* Compact, Full-Width Plant Photograph for Mobile Only (195px tall, clean crop, zero white fade) */}
                    <div className="block md:hidden relative w-full h-[195px] rounded-xl overflow-hidden shadow-xs border border-[#EAE4D8] mt-3">
                      <img 
                        src="/hero-botanical-mobile.jpg" 
                        alt="Snake plant in minimalist stoneware pot" 
                        className="w-full h-full object-cover object-center" 
                        loading="eager" 
                      />
                    </div>
                  </div>
                </div>

              </section>

              {/* ====================================================
                  THREE PROMINENT BOTANICAL FEATURE CARDS
                  ==================================================== */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 md:-mt-20 lg:-mt-24 relative z-20" id="field-guide-paths">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  
                  {/* Card 1: Compare Ready-Made Soils */}
                  <div 
                    onClick={() => navigateToArticle('best-soil')}
                    className="relative bg-white rounded-2xl md:rounded-3xl border border-[#EAE4D8] shadow-sm hover:shadow-md hover:border-[#1A3B29]/30 transition-all group cursor-pointer overflow-hidden min-h-[175px] sm:min-h-[190px] md:min-h-[205px] flex items-center"
                    id="path-card-compare-soils"
                  >
                    {/* Left Content Column */}
                    <div className="relative z-10 w-[58%] sm:w-[56%] md:w-[57%] p-5 sm:p-6 space-y-2.5 sm:space-y-3">
                      <div className="w-9 h-9 rounded-full bg-[#E2EFE5] text-[#1A3B29] flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M2 20h20c-1.5-5-5-8-10-8s-8.5 3-10 8z"/></svg>
                      </div>
                      <h2 className="font-serif-editorial text-lg sm:text-xl font-bold text-[#142B1E] tracking-tight group-hover:text-[#1A3B29] leading-snug">
                        Compare Ready-Made Soils
                      </h2>
                      <p className="text-stone-650 text-sm sm:text-base leading-relaxed">
                        Compare top commercial mixes and find what fits your routine.
                      </p>
                      <div className="pt-0.5">
                        <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1A3B29] group-hover:underline">
                          <span>Compare Soils</span>
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </span>
                      </div>
                    </div>

                    {/* Right 45% Flush Photography with Left Gradient Blend */}
                    <div className="absolute right-0 top-0 bottom-0 w-[45%] sm:w-[46%] md:w-[45%] h-full pointer-events-none overflow-hidden">
                      <div className="absolute inset-y-0 left-0 w-8 sm:w-12 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
                      <img 
                        src="/soil-mound.jpg" 
                        alt="Mound of rich, dark, aerated potting soil" 
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                  </div>

                  {/* Card 2: Make Your Own Mix */}
                  <div 
                    onClick={() => navigateToArticle('diy-mix')}
                    className="relative bg-white rounded-2xl md:rounded-3xl border border-[#EAE4D8] shadow-sm hover:shadow-md hover:border-[#1A3B29]/30 transition-all group cursor-pointer overflow-hidden min-h-[175px] sm:min-h-[190px] md:min-h-[205px] flex items-center"
                    id="path-card-diy-mix"
                  >
                    {/* Left Content Column */}
                    <div className="relative z-10 w-[58%] sm:w-[56%] md:w-[57%] p-5 sm:p-6 space-y-2.5 sm:space-y-3">
                      <div className="w-9 h-9 rounded-full bg-[#E2EFE5] text-[#1A3B29] flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                      </div>
                      <h2 className="font-serif-editorial text-lg sm:text-xl font-bold text-[#142B1E] tracking-tight group-hover:text-[#1A3B29] leading-snug">
                        Make Your Own Mix
                      </h2>
                      <p className="text-stone-650 text-sm sm:text-base leading-relaxed">
                        Simple recipes for fast-draining snake plant soil.
                      </p>
                      <div className="pt-0.5">
                        <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1A3B29] group-hover:underline">
                          <span>Try It</span>
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </span>
                      </div>
                    </div>

                    {/* Right 45% Flush Photography with Left Gradient Blend */}
                    <div className="absolute right-0 top-0 bottom-0 w-[45%] sm:w-[46%] md:w-[45%] h-full pointer-events-none overflow-hidden">
                      <div className="absolute inset-y-0 left-0 w-8 sm:w-12 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
                      <img 
                        src="/mix-bowl.jpg" 
                        alt="Shallow stoneware bowl with gritty potting mix" 
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                  </div>

                  {/* Card 3: Help Me Choose */}
                  <div 
                    onClick={() => navigateToArticle('setup-kits')}
                    className="relative bg-white rounded-2xl md:rounded-3xl border border-[#EAE4D8] shadow-sm hover:shadow-md hover:border-[#1A3B29]/30 transition-all group cursor-pointer overflow-hidden min-h-[175px] sm:min-h-[190px] md:min-h-[205px] flex items-center"
                    id="path-card-help-me-choose"
                  >
                    {/* Left Content Column */}
                    <div className="relative z-10 w-[58%] sm:w-[56%] md:w-[57%] p-5 sm:p-6 space-y-2.5 sm:space-y-3">
                      <div className="w-9 h-9 rounded-full bg-[#E2EFE5] text-[#1A3B29] flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/></svg>
                      </div>
                      <h2 className="font-serif-editorial text-lg sm:text-xl font-bold text-[#142B1E] tracking-tight group-hover:text-[#1A3B29] leading-snug">
                        Help Me Choose
                      </h2>
                      <p className="text-stone-650 text-sm sm:text-base leading-relaxed">
                        Answer a few questions to get a personalized recommendation.
                      </p>
                      <div className="pt-0.5">
                        <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1A3B29] group-hover:underline">
                          <span>Get Help</span>
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </span>
                      </div>
                    </div>

                    {/* Right 45% Flush Photography with Left Gradient Blend */}
                    <div className="absolute right-0 top-0 bottom-0 w-[45%] sm:w-[46%] md:w-[45%] h-full pointer-events-none overflow-hidden">
                      <div className="absolute inset-y-0 left-0 w-8 sm:w-12 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
                      <img 
                        src="/leaf-troubleshoot.jpg" 
                        alt="Snake plant leaf showing care checkup symptoms" 
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                  </div>

                </div>
              </section>

              {/* ====================================================
                  VISUAL EXPLANATIONS: ROOTS & 3-2-1 MIX
                  ==================================================== */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6" id="roots-and-mix-section">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Left: Healthy vs. Rotting Roots */}
                  <div className="lg:col-span-7 bg-[#163524] rounded-2xl p-6 sm:p-7 text-white shadow-sm flex flex-col justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div className="space-y-2.5 max-w-xs text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#9EC4A9]">KNOW YOUR ROOTS</span>
                          <div className="w-10 h-0.5 bg-[#8BA894]/70 rounded-full"></div>
                        </div>
                        <h3 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-white leading-tight">
                          Healthy vs. Rotting Roots
                        </h3>
                        <p className="text-stone-300 text-base leading-relaxed">
                          Know the difference. Save your plant.
                        </p>
                        <div className="pt-2">
                          <button 
                            onClick={() => navigateToArticle('root-rot')}
                            className="bg-[#C4DCC8] hover:bg-[#B3D3B8] text-[#142B1E] font-bold text-xs px-4 py-2 rounded-full transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <span>See the Guide</span>
                            <span>→</span>
                          </button>
                        </div>
                      </div>

                      {/* Side-by-side Root Photos */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="relative w-28 sm:w-32 h-36 rounded-xl overflow-hidden border border-[#235837] shadow-inner">
                          <img 
                            src="/healthy-roots.jpg" 
                            alt="Firm pale healthy snake plant roots and rhizome" 
                            className="w-full h-full object-cover" 
                          />
                          <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-emerald-950/90 text-emerald-200 text-[10px] font-bold py-0.5 px-1.5 rounded-full text-center border border-emerald-600/50 flex items-center justify-center gap-1">
                            <span className="text-emerald-400 font-bold">✓</span> Healthy
                          </div>
                        </div>
                        <div className="relative w-28 sm:w-32 h-36 rounded-xl overflow-hidden border border-[#235837] shadow-inner">
                          <img 
                            src="/rotting-roots.jpg" 
                            alt="Dark mushy decaying roots affected by root rot" 
                            className="w-full h-full object-cover" 
                          />
                          <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-rose-950/90 text-rose-200 text-[10px] font-bold py-0.5 px-1.5 rounded-full text-center border border-rose-600/50 flex items-center justify-center gap-1">
                            <span className="text-rose-400 font-bold">✕</span> Rotting
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: The 3-2-1 Soil Mix */}
                  <div className="lg:col-span-5 bg-[#F2EDE4] rounded-2xl p-6 sm:p-7 border border-[#E5DFD3] shadow-sm flex flex-col justify-between text-left">
                    <div className="space-y-1.5">
                      <h3 className="font-serif-editorial text-2xl font-bold text-[#142B1E]">
                        The 3-2-1 Soil Mix
                      </h3>
                      <p className="text-stone-600 text-sm">
                        The perfect blend for snake plants.
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-1 sm:gap-3 py-4 my-auto text-center">
                      <div className="space-y-1.5">
                        <div className="w-14 h-14 sm:w-18 sm:h-18 mx-auto rounded-full overflow-hidden border border-[#DFD8CC] shadow-2xs">
                          <img src="/pile-soil.jpg" alt="Standard potting soil pile" className="w-full h-full object-cover" />
                        </div>
                        <div className="font-bold text-xs text-[#142B1E]">3 Parts</div>
                        <div className="text-[10px] sm:text-[11px] text-stone-500">Potting Soil</div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="w-14 h-14 sm:w-18 sm:h-18 mx-auto rounded-full overflow-hidden border border-[#DFD8CC] shadow-2xs">
                          <img src="/pile-perlite.jpg" alt="Horticultural perlite pile" className="w-full h-full object-cover" />
                        </div>
                        <div className="font-bold text-xs text-[#142B1E]">2 Parts</div>
                        <div className="text-[10px] sm:text-[11px] text-stone-500">Perlite</div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="w-14 h-14 sm:w-18 sm:h-18 mx-auto rounded-full overflow-hidden border border-[#DFD8CC] shadow-2xs">
                          <img src="/pile-sand.jpg" alt="Coarse sand pile" className="w-full h-full object-cover" />
                        </div>
                        <div className="font-bold text-xs text-[#142B1E]">1 Part</div>
                        <div className="text-[10px] sm:text-[11px] text-stone-500">Sand</div>
                      </div>
                    </div>

                    <div>
                      <button 
                        onClick={() => navigateToArticle('diy-mix')}
                        className="bg-[#1B3B2B] hover:bg-[#122A1E] text-stone-50 font-bold text-xs px-5 py-2.5 rounded-full shadow-xs hover:shadow-sm transition-all inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Learn the Recipe</span>
                        <span className="text-[#9EC4A9]">→</span>
                      </button>
                    </div>
                  </div>

                </div>
              </section>

              {/* ====================================================
                  TRUST / BENEFITS STRIP (PURE SVG ICONS)
                  ==================================================== */}
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-[#EAE4D8] text-sm text-[#142B1E] font-medium">
                  <div className="flex items-center justify-center gap-2.5">
                    <svg className="w-5 h-5 text-[#235837]" viewBox="0 0 24 24" fill="currentColor"><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/></svg>
                    <span>Practical Tips</span>
                  </div>
                  <div className="flex items-center justify-center gap-2.5">
                    <svg className="w-5 h-5 text-[#235837]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                    <span>Easy Guides</span>
                  </div>
                  <div className="flex items-center justify-center gap-2.5">
                    <svg className="w-5 h-5 text-[#235837]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                    <span>Healthy Plants</span>
                  </div>
                  <div className="flex items-center justify-center gap-2.5">
                    <svg className="w-5 h-5 text-[#235837]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    <span>A Greener Home</span>
                  </div>
                </div>
              </div>

              {/* ====================================================
                  THREE PHOTO-LED ARTICLE CARDS
                  ==================================================== */}
              <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="featured-field-articles">
                <div className="text-center max-w-xl mx-auto mb-10">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#235837] bg-[#E2EFE5] px-2.5 py-1 rounded-full">
                    PRACTICAL FIELD GUIDES
                  </span>
                  <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#142B1E] tracking-tight mt-2.5">
                    Essential Guides for Healthy Plants
                  </h2>
                  <p className="text-stone-650 text-sm mt-1.5">
                    Practical, science-backed guidance for repotting, pot selection, and root rot prevention.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Article 1: Root Rot */}
                  <div 
                    onClick={() => navigateToArticle('root-rot')}
                    className="bg-white rounded-2xl border border-[#EAE4D8] overflow-hidden shadow-xs hover:shadow-md hover:border-[#1A3B29]/30 transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="h-48 w-full overflow-hidden bg-stone-100">
                        <img 
                          src="/article-root-rot.jpg" 
                          alt="Trimming and repotting a plant affected by root rot" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                      </div>
                      <div className="p-5 space-y-2 text-left">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 bg-rose-50 px-2 py-0.5 rounded">
                          PROBLEM SOLVER
                        </span>
                        <h3 className="font-serif-editorial text-lg font-bold text-[#142B1E] group-hover:text-[#1A3B29] leading-snug">
                          How to Spot &amp; Treat Snake Plant Root Rot
                        </h3>
                        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
                          Learn the early warning signs of soggy soil and mushy roots before damage spreads.
                        </p>
                      </div>
                    </div>
                    <div className="px-5 pb-5 pt-2 text-xs font-bold text-[#1A3B29] group-hover:underline flex items-center justify-between border-t border-[#F2ECE1] mt-3">
                      <span>Read Guide</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>

                  {/* Article 2: Best Pots */}
                  <div 
                    onClick={() => navigateToArticle('best-pots')}
                    className="bg-white rounded-2xl border border-[#EAE4D8] overflow-hidden shadow-xs hover:shadow-md hover:border-[#1A3B29]/30 transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="h-48 w-full overflow-hidden bg-stone-100">
                        <img 
                          src="/article-best-pots.jpg" 
                          alt="Terracotta pots on wooden shelf with good drainage" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                      </div>
                      <div className="p-5 space-y-2 text-left">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#235837] bg-[#E2EFE5] px-2 py-0.5 rounded">
                          POT SELECTION
                        </span>
                        <h3 className="font-serif-editorial text-lg font-bold text-[#142B1E] group-hover:text-[#1A3B29] leading-snug">
                          Why Unglazed Terracotta Saves Snake Plants
                        </h3>
                        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
                          Discover how breathable clay prevents moisture buildup and aeration issues at the root level.
                        </p>
                      </div>
                    </div>
                    <div className="px-5 pb-5 pt-2 text-xs font-bold text-[#1A3B29] group-hover:underline flex items-center justify-between border-t border-[#F2ECE1] mt-3">
                      <span>Read Guide</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>

                  {/* Article 3: Daily Care */}
                  <div 
                    onClick={() => navigateToArticle('care-guide')}
                    className="bg-white rounded-2xl border border-[#EAE4D8] overflow-hidden shadow-xs hover:shadow-md hover:border-[#1A3B29]/30 transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="h-48 w-full overflow-hidden bg-stone-100">
                        <img 
                          src="/article-care-guide.jpg" 
                          alt="Healthy snake plant receiving natural living room light" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                      </div>
                      <div className="p-5 space-y-2 text-left">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#235837] bg-[#E2EFE5] px-2 py-0.5 rounded">
                          CARE ROUTINE
                        </span>
                        <h3 className="font-serif-editorial text-lg font-bold text-[#142B1E] group-hover:text-[#1A3B29] leading-snug">
                          Seasonal Watering &amp; Soil Dry-Down Times
                        </h3>
                        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
                          Master the soak-and-dry cycle to keep your Sansevieria happy through summer and winter.
                        </p>
                      </div>
                    </div>
                    <div className="px-5 pb-5 pt-2 text-xs font-bold text-[#1A3B29] group-hover:underline flex items-center justify-between border-t border-[#F2ECE1] mt-3">
                      <span>Read Guide</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>

                </div>
              </section>

              {/* ====================================================
                  BEAT 4: COMPACT SOIL DIAGNOSIS & FIVE PROFILES
                  ==================================================== */}
              <section className="py-14 bg-[#F7F4EE] border-t border-b border-[#EAE4D8] relative overflow-hidden" id="homepage-soil-diagnosis">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="text-center max-w-2xl mx-auto mb-10">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#235837] bg-[#E2EFE5] px-2.5 py-1 rounded-full">
                      SOIL CHECK &amp; MATCHING
                    </span>
                    <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#142B1E] tracking-tight mt-2.5">
                      How the Soil Check Works
                    </h2>
                    <p className="text-stone-650 text-sm mt-2 leading-relaxed">
                      Answer a few questions about your plant, pot, and room conditions to find your matching soil profile and compare suitable options.
                    </p>
                  </div>

                  {/* 3 Step Progression */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
                    <div className="bg-white/95 rounded-2xl p-5 border border-[#EAE4D8] shadow-xs flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="w-8 h-8 rounded-full bg-[#E2EFE5] text-[#1A3B29] font-bold text-xs flex items-center justify-center">
                          01
                        </div>
                        <h3 className="font-serif-editorial font-bold text-base text-[#142B1E]">
                          Tell Us What You See
                        </h3>
                        <p className="text-stone-650 text-xs sm:text-sm leading-relaxed">
                          Answer a few questions about the leaves, soil, pot material, and growing conditions.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/95 rounded-2xl p-5 border border-[#EAE4D8] shadow-xs flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="w-8 h-8 rounded-full bg-[#E2EFE5] text-[#1A3B29] font-bold text-xs flex items-center justify-center">
                          02
                        </div>
                        <h3 className="font-serif-editorial font-bold text-base text-[#142B1E]">
                          Find Your Soil Profile
                        </h3>
                        <p className="text-stone-650 text-xs sm:text-sm leading-relaxed">
                          We match those conditions to one of our five established botanical soil profiles below.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/95 rounded-2xl p-5 border border-[#EAE4D8] shadow-xs flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="w-8 h-8 rounded-full bg-[#E2EFE5] text-[#1A3B29] font-bold text-xs flex items-center justify-center">
                          03
                        </div>
                        <h3 className="font-serif-editorial font-bold text-base text-[#142B1E]">
                          Compare Ready-Made Soils
                        </h3>
                        <p className="text-stone-650 text-xs sm:text-sm leading-relaxed">
                          Review suitable commercial options, including their practical strengths and limitations.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Five Soil Profiles Visible Grid */}
                  <div className="space-y-4">
                    <div className="text-center max-w-xl mx-auto">
                      <h3 className="font-serif-editorial text-xl font-bold text-[#142B1E]">
                        The Five Soil Profiles
                      </h3>
                      <p className="text-stone-600 text-xs mt-1">
                        Explore the characteristics of our primary profiles. Run the soil check to see which one fits your plant.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {SOIL_PROFILES.map((profile) => {
                        let conciseDesc = '';
                        if (profile.id === 'fast-drain') {
                          conciseDesc = 'For soil that stays wet too long, humid rooms, nonporous pots, or frequent watering habits.';
                        } else if (profile.id === 'everyday-balance') {
                          conciseDesc = 'For healthy plants, routine repotting, and typical indoor lighting and average humidity.';
                        } else if (profile.id === 'dry-home') {
                          conciseDesc = 'For plants in dry rooms, heated air, breathable terracotta pots, or infrequent watering habits.';
                        } else if (profile.id === 'recovery') {
                          conciseDesc = 'For repotting after mushy roots or damaged rhizomes have been properly pruned and calloused.';
                        } else if (profile.id === 'propagation') {
                          conciseDesc = 'For rooted leaf cuttings, young pups, and small starters in shallow containers.';
                        }

                        return (
                          <div 
                            key={profile.id}
                            className="bg-white rounded-2xl p-5 border border-[#EAE4D8] space-y-3 hover:border-[#1A3B29]/30 transition-all flex flex-col justify-between shadow-2xs"
                          >
                            <div className="space-y-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#235837] bg-[#E2EFE5] px-2 py-0.5 rounded w-fit block">
                                Soil Profile
                              </span>
                              <h4 className="font-serif-editorial font-bold text-base text-[#142B1E]">
                                {profile.name}
                              </h4>
                              <p className="text-stone-650 text-xs sm:text-sm leading-relaxed">
                                {conciseDesc}
                              </p>
                            </div>

                            <button
                              onClick={() => navigateToArticle('setup-kits')}
                              className="w-full bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-[#EAE4D8] text-[#142B1E] py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                            >
                              <span>See If This Fits My Plant</span>
                              <span className="text-[#235837]">→</span>
                            </button>
                          </div>
                        );
                      })}

                      {/* 6th Interactive Tool CTA Card */}
                      <div className="bg-[#142B1E] text-stone-50 rounded-2xl p-5 border border-[#235837] flex flex-col justify-between shadow-xs">
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9EC4A9]">
                            Interactive Diagnosis
                          </span>
                          <h4 className="font-serif-editorial font-bold text-lg text-white leading-snug">
                            Not Sure Which Profile Fits?
                          </h4>
                          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                            Take our 2-minute diagnostic check to assess leaf firmness, drainage, and light.
                          </p>
                        </div>

                        <button
                          onClick={() => navigateToArticle('setup-kits')}
                          className="w-full bg-[#C4DCC8] hover:bg-[#B3D3B8] text-[#142B1E] font-bold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-4 shadow-xs"
                          id="compact-soil-check-cta"
                        >
                          <span>Find My Soil Profile</span>
                          <span>→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* ====================================================
                  BEAT 5: COMPARE READY-MADE SOILS (COMMERCIAL MIXES)
                  ==================================================== */}
              <section className="py-14 bg-[#FAF7F2] border-b border-[#EAE4D8]" id="homepage-ready-made-soils">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center max-w-xl mx-auto mb-10">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#235837] bg-[#E2EFE5] px-2.5 py-1 rounded-full">
                      COMMERCIAL COMPARISON
                    </span>
                    <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#142B1E] tracking-tight mt-2.5">
                      Compare Ready-Made Soils
                    </h2>
                    <p className="text-stone-650 text-sm mt-1.5">
                      An editorial overview of recommended commercial soil mixes from our catalog, matching their qualities to different home conditions.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {RANKED_SOIL_PRODUCTS.map((prod) => (
                      <div key={prod.id} className="bg-white border border-[#EAE4D8] p-5 rounded-2xl flex flex-col justify-between hover:border-[#1A3B29]/30 transition-all shadow-xs">
                        <div className="space-y-3">
                          <div className="flex gap-3 items-center">
                            <div className="w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#EAE4D8] flex items-center justify-center p-1">
                              {prod.hasVerifiedImage && prod.imageUrl ? (
                                <img src={prod.imageUrl} alt={prod.name} className="max-w-full max-h-full object-contain" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-[#1B3B2B] text-white font-bold flex items-center justify-center text-xs">
                                  #{prod.rank}
                                </div>
                              )}
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <span className="w-5 h-5 rounded-full bg-[#1B3B2B] text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                                  {prod.rank}
                                </span>
                                <span className="text-[9px] font-bold uppercase text-[#235837] bg-[#E2EFE5] px-1.5 py-0.5 rounded">
                                  {prod.badge}
                                </span>
                              </div>
                              <span className="text-xs font-bold text-stone-700 block">
                                {prod.award}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-0.5">
                            <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">{prod.brand}</div>
                            <h3 className="font-serif-editorial font-bold text-[#142B1E] text-base leading-snug">
                              {prod.name}
                            </h3>
                          </div>

                          <p className="text-stone-650 text-xs sm:text-sm leading-relaxed">
                            {prod.verdict}
                          </p>

                          <div className="text-xs border-t border-[#F2ECE1] pt-3 space-y-1.5">
                            <div className="flex items-start gap-1.5 text-stone-700">
                              <span className="text-[#235837] font-bold">✓</span>
                              <span><strong>Strength:</strong> {prod.strength}</span>
                            </div>
                            <div className="flex items-start gap-1.5 text-stone-700">
                              <span className="text-amber-700 font-bold">⚠</span>
                              <span><strong>Limitation:</strong> {prod.limitation}</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 flex items-center justify-between border-t border-[#F2ECE1] mt-4">
                          <a
                            href="/best-snake-plant-soil"
                            onClick={(e) => {
                              e.preventDefault();
                              navigateToArticle('best-soil');
                            }}
                            className="text-xs font-bold text-[#1A3B29] hover:underline inline-flex items-center gap-1 group/btn"
                          >
                            <span>Read Ranking</span>
                            <span className="group-hover/btn:translate-x-0.5 transition-transform">→</span>
                          </a>
                          <span className="text-[10px] text-stone-400 font-bold">
                            Rank #{prod.rank}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-center">
                    <button
                      onClick={() => navigateToArticle('best-soil')}
                      className="inline-flex items-center gap-2 bg-[#1B3B2B] hover:bg-[#122A1E] text-stone-50 font-bold px-6 py-3 rounded-full text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
                      id="view-all-commercial-btn"
                    >
                      <span>Compare All Ready-Made Soils</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#9EC4A9]" />
                    </button>
                  </div>
                </div>
              </section>

              {/* ====================================================
                  BEAT 6: SNAKE PLANT RADIO FEATURE (BOTANICAL STYLING)
                  ==================================================== */}
              <section className="py-14 bg-[#FAF7F2] border-b border-[#EAE4D8]" id="homepage-snake-plant-radio">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="bg-[#142B1E] text-stone-50 rounded-3xl p-7 sm:p-10 border border-[#235837] shadow-sm relative overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                      
                      <div className="lg:col-span-7 space-y-4 text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#235837] text-[#C4DCC8]">
                          <Radio className="w-3.5 h-3.5 text-[#9EC4A9] animate-pulse" />
                          <span>Now Streaming • Snake Plant Radio</span>
                        </div>

                        <h2 className="font-serif-editorial text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                          Deep-Dive Soil Science for Your Ears
                        </h2>

                        <p className="text-stone-300 text-sm leading-relaxed max-w-xl">
                          Listen to our weekly care podcast. We break down common houseplant advice, 
                          explore soil aeration and drainage, and help you keep your Sansevieria rot-free.
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-2">
                          <button
                            onClick={() => navigateToArticle('radio')}
                            className="px-5 py-2.5 rounded-full bg-[#C4DCC8] hover:bg-[#B3D3B8] text-[#142B1E] font-bold text-xs transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                            id="home-radio-hub-cta"
                          >
                            <Headphones className="w-4 h-4" />
                            <span>Explore Snake Plant Radio</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                          
                          <a 
                            href="https://open.spotify.com/show/6XOicuhWNSvmswXniqX4Yu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-stone-200 font-bold text-xs transition-all border border-white/20 flex items-center gap-1.5"
                          >
                            <span>Spotify Feed</span>
                            <ExternalLink className="w-3 h-3 opacity-70" />
                          </a>
                        </div>
                      </div>

                      <div className="lg:col-span-5 bg-[#0E2015] border border-[#235837] rounded-2xl p-5 sm:p-6 space-y-3.5 shadow-md">
                        <div className="flex items-center justify-between border-b border-[#235837] pb-3">
                          <span className="text-[11px] font-bold text-[#9EC4A9] uppercase tracking-wider">
                            Featured Episode #1
                          </span>
                          <span className="text-[10px] text-stone-400 font-medium">
                            5 min
                          </span>
                        </div>

                        <h3 className="font-serif-editorial text-lg font-bold text-white leading-snug">
                          Why Your Snake Plant Is Dying (It's Probably Water)
                        </h3>

                        <p className="text-stone-400 text-xs sm:text-sm leading-relaxed line-clamp-2">
                          Overwatering kills more snake plants than anything else. Maya and Jordan walk through the five-step recovery protocol that can save your plant.
                        </p>

                        <div className="pt-2">
                          <button
                            onClick={() => navigateToArticle('radio/why-your-snake-plant-is-dying')}
                            className="w-full py-2.5 rounded-xl bg-[#235837] hover:bg-[#1A452B] text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                            id="home-episode-1-cta"
                          >
                            <span>Listen &amp; View Show Notes</span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#9EC4A9]" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </section>

              {/* ====================================================
                  BEAT 7: COMMON SOIL QUESTIONS & CARE DIRECTORY
                  ==================================================== */}
              <section className="py-16 bg-[#FAF7F2]" id="homepage-faq-accordions">
                <div className="max-w-4xl mx-auto px-4 md:px-6">
                  
                  <div className="text-center mb-10">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#235837] bg-[#E2EFE5] px-2.5 py-1 rounded-full">
                      PRACTICAL ANSWERS
                    </span>
                    <h2 className="font-serif-editorial text-2xl md:text-3xl font-bold text-[#142B1E] tracking-tight mt-2.5">
                      Common Soil Questions
                    </h2>
                    <p className="text-stone-650 text-sm mt-1.5">
                      Read clear explanations about snake plant watering cycles, container drainage, and soil additives.
                    </p>
                  </div>

                  <div className="space-y-3 bg-white p-6 sm:p-7 rounded-2xl border border-[#EAE4D8] shadow-xs mb-14">
                    {FAQ_ITEMS.slice(0, 3).map((faq) => {
                      const expanded = !!faqExpanded[faq.id];
                      return (
                        <div 
                          key={faq.id}
                          className="border-b border-[#F2ECE1] last:border-0 pb-3.5 last:pb-0"
                          id={`faq-item-collapsible-${faq.id}`}
                        >
                          <button
                            onClick={() => toggleFaq(faq.id)}
                            className="w-full text-left py-3 font-serif-editorial font-bold text-[#142B1E] text-sm sm:text-base flex justify-between items-center hover:text-[#235837] transition-colors focus:outline-none cursor-pointer"
                            id={`faq-toggle-btn-${faq.id}`}
                          >
                            <span className="flex items-center gap-2.5 pr-3">
                              <span className="w-2 h-2 rounded-full bg-[#235837] shrink-0" />
                              {faq.question}
                            </span>
                            <span className="text-stone-400 text-xs font-bold shrink-0 ml-2">
                              {expanded ? <Minus className="w-4 h-4 text-[#235837]" /> : <Plus className="w-4 h-4 text-stone-500" />}
                            </span>
                          </button>
                          
                          {expanded && (
                            <div className="pl-4 pb-2 text-stone-650 text-xs sm:text-sm leading-relaxed font-sans" id={`faq-answer-collapsible-${faq.id}`}>
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    <div className="pt-4 text-center border-t border-[#F2ECE1]">
                      <button
                        onClick={() => navigateToArticle('faq')}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1A3B29] hover:underline cursor-pointer"
                        id="view-all-faq-btn-home"
                      >
                        <span>View All Potting &amp; Care FAQs</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Complete Care Guide Directory Strip */}
                  <div className="border-t border-[#EAE4D8] pt-10">
                    <div className="text-center mb-6">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#235837]">
                        COMPLETE GUIDE DIRECTORY
                      </span>
                      <h3 className="font-serif-editorial text-xl font-bold text-[#142B1E] mt-1">
                        Additional Field Guides &amp; Resources
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Guide 1: Fertilizer */}
                      <div 
                        onClick={() => navigateToArticle('best-fertilizer-for-snake-plant-soil')}
                        className="bg-white p-4 rounded-xl border border-[#EAE4D8] hover:border-[#1A3B29]/30 transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
                      >
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold uppercase text-[#235837] bg-[#E2EFE5] px-1.5 py-0.5 rounded">
                            Nutrients
                          </span>
                          <h4 className="font-serif-editorial font-bold text-sm text-[#142B1E] group-hover:text-[#1A3B29]">
                            Snake Plant Fertilizer Guide
                          </h4>
                          <p className="text-stone-500 text-xs">
                            Low-nitrogen feeding schedules for gritty soil.
                          </p>
                        </div>
                        <span className="text-[#1A3B29] font-bold text-xs group-hover:translate-x-0.5 transition-transform ml-2">→</span>
                      </div>

                      {/* Guide 2: Winter Watering */}
                      <div 
                        onClick={() => navigateToArticle('winter-watering-guide')}
                        className="bg-white p-4 rounded-xl border border-[#EAE4D8] hover:border-[#1A3B29]/30 transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
                      >
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold uppercase text-[#235837] bg-[#E2EFE5] px-1.5 py-0.5 rounded">
                            Seasonal Care
                          </span>
                          <h4 className="font-serif-editorial font-bold text-sm text-[#142B1E] group-hover:text-[#1A3B29]">
                            Winter Watering Guide
                          </h4>
                          <p className="text-stone-500 text-xs">
                            Cold dormancy and extended dry-down cycles.
                          </p>
                        </div>
                        <span className="text-[#1A3B29] font-bold text-xs group-hover:translate-x-0.5 transition-transform ml-2">→</span>
                      </div>

                      {/* Guide 3: Full FAQ Knowledgebase */}
                      <div 
                        onClick={() => navigateToArticle('faq')}
                        className="bg-white p-4 rounded-xl border border-[#EAE4D8] hover:border-[#1A3B29]/30 transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
                      >
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold uppercase text-[#235837] bg-[#E2EFE5] px-1.5 py-0.5 rounded">
                            Knowledgebase
                          </span>
                          <h4 className="font-serif-editorial font-bold text-sm text-[#142B1E] group-hover:text-[#1A3B29]">
                            Exhaustive Care FAQ
                          </h4>
                          <p className="text-stone-500 text-xs">
                            Searchable library of answers for soil and pot queries.
                          </p>
                        </div>
                        <span className="text-[#1A3B29] font-bold text-xs group-hover:translate-x-0.5 transition-transform ml-2">→</span>
                      </div>

                      {/* Guide 4: About Site */}
                      <div 
                        onClick={() => navigateToArticle('about')}
                        className="bg-white p-4 rounded-xl border border-[#EAE4D8] hover:border-[#1A3B29]/30 transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
                      >
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold uppercase text-[#235837] bg-[#E2EFE5] px-1.5 py-0.5 rounded">
                            Our Mission
                          </span>
                          <h4 className="font-serif-editorial font-bold text-sm text-[#142B1E] group-hover:text-[#1A3B29]">
                            About SnakePlantSoil.com
                          </h4>
                          <p className="text-stone-500 text-xs">
                            Why we built this site and what you can find here.
                          </p>
                        </div>
                        <span className="text-[#1A3B29] font-bold text-xs group-hover:translate-x-0.5 transition-transform ml-2">→</span>
                      </div>
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
              className="w-full"
              id="setup-kits-page"
            >
              <SoilSetupKit onNavigate={navigateToArticle} />
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
              className="w-full"
              id="best-soil-page"
            >
              <BestSoilArticle onNavigate={navigateToArticle} />
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
              className="w-full"
              id="diy-mix-page"
            >
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
              className="w-full"
              id="root-rot-page"
            >
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
              className="w-full"
              id="best-pots-page"
            >
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
              className="w-full"
              id="care-guide-page"
            >
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
              className="w-full bg-[#FAF7F2] min-h-screen py-10 md:py-16 font-sans"
              id="faq-page"
            >
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs */}
                <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-[#5C6E60]">
                  <a href="/" onClick={(e) => { e.preventDefault(); navigateToArticle('home'); }} className="hover:text-[#142B1E] transition-colors cursor-pointer">Home</a>
                  <span>/</span>
                  <span className="text-[#142B1E] font-medium">FAQ</span>
                </nav>

                <div className="mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#E2EFE5] text-[#235837] border border-[#C2DEC9] mb-2.5">
                    <QuestionIcon className="w-4 h-4 text-[#235837]" /> Structured FAQ Catalog
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#142B1E] tracking-tight mt-1">
                    Snake Plant Questions
                  </h1>
                  <p className="text-[#4D5D53] text-sm sm:text-base mt-2 leading-relaxed font-sans">
                    Practical, science-backed answers to the most common questions about snake plant soil blends, watering techniques, drainage requirements, and root rot prevention.
                  </p>
                </div>

                {/* In-page FAQ Filter Bar */}
                <div className="bg-white p-4 rounded-2xl border border-[#E8E2D5] mb-6 space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-[#235837] shrink-0" />
                    <input
                      type="text"
                      placeholder="Filter questions in this FAQ list (e.g. root rot, terracotta, watering)..."
                      value={faqSearchQuery}
                      onChange={(e) => setFaqSearchQuery(e.target.value)}
                      className="w-full text-xs sm:text-sm py-1 px-2 bg-transparent focus:outline-none text-[#142B1E] placeholder-stone-400 font-sans"
                      id="faq-filter-input"
                    />
                    {faqSearchQuery && (
                      <button 
                        onClick={() => setFaqSearchQuery('')}
                        className="text-xs text-[#5C6E60] hover:text-[#142B1E] px-2 py-1 rounded cursor-pointer font-bold"
                        aria-label="Clear FAQ filter"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <div className="text-[11px] text-[#7C8D80] border-t border-[#F0EBE1] pt-2 flex items-center justify-between">
                    <span>Note: This search filters the questions listed below. To search the whole site for guides and articles, use the header search.</span>
                    {faqSearchQuery.trim() !== '' && (
                      <span className="font-bold text-[#235837] shrink-0 ml-2">{filteredFAQs.length} matching</span>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredFAQs.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl border border-dashed border-[#D5CDBD] bg-white">
                      <p className="text-[#5C6E60] text-sm">No specific FAQ items found matching "{faqSearchQuery}".</p>
                      <button 
                        onClick={() => setFaqSearchQuery('')}
                        className="mt-3 text-xs text-[#235837] font-bold bg-[#F3EFE6] px-3.5 py-2 rounded-xl hover:bg-[#E8E2D5] cursor-pointer transition-colors"
                        id="reset-faq-query"
                      >
                        Reset Filter
                      </button>
                    </div>
                  ) : (
                    filteredFAQs.map((faq) => {
                      return (
                        <div 
                          key={faq.id} 
                          className="bg-white rounded-2xl border border-[#E8E2D5] p-6 shadow-xs flex flex-col justify-between"
                          id={`faq-article-container-${faq.id}`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-4">
                              <span className="text-[10px] uppercase font-mono font-bold text-[#4A5D4E] bg-[#F3EFE6] border border-[#E8E2D5] px-2.5 py-0.5 rounded tracking-wider shrink-0">
                                Category: {faq.category}
                              </span>
                            </div>
                            
                            <h3 className="text-base sm:text-lg font-serif font-bold text-[#142B1E] mt-4 flex items-center gap-2">
                              <span className="w-1.5 h-6 bg-[#235837] rounded-full shrink-0" />
                              {faq.question}
                            </h3>

                            {/* Direct Quotable Answer */}
                            <p className="text-[#4D5D53] text-sm leading-relaxed mt-2.5 pl-3.5 border-l-2 border-[#235837] italic font-sans">
                              "{faq.answer}"
                            </p>
                          </div>

                          <div className="mt-8 pt-4 border-t border-[#F0EBE1] flex flex-wrap gap-2 items-center justify-between text-[11px] text-[#6B7C70]">
                            <span>SnakePlantSoil.com Care Answers</span>
                            <a 
                              href="/soil-calculator" 
                              onClick={(e) => { e.preventDefault(); navigateToArticle('calculator'); }}
                              className="text-[#235837] font-medium hover:underline cursor-pointer"
                            >
                              DIY Mix Calculator &rarr;
                            </a>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="mt-12 p-6 rounded-2xl bg-white border border-[#E8E2D5] shadow-xs max-w-2xl mx-auto text-center space-y-3">
                  <Award className="w-8 h-8 text-[#235837] mx-auto" />
                  <h4 className="font-serif font-bold text-[#142B1E] text-base">Have a snake plant care question?</h4>
                  <p className="text-xs text-[#5C6E60] leading-relaxed">
                    We are regularly updating our care guides and soil resources. Send your questions or suggestions to <strong>hello@snakeplantsoil.com</strong>!
                  </p>
                </div>
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
              className="w-full"
              id="care-card-page"
            >
              <LeadMagnet onNavigate={navigateToArticle} />
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div
              key="about-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="w-full bg-[#FAF7F2] min-h-screen py-10 md:py-16 font-sans"
              id="about-page"
            >
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Breadcrumbs */}
                <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#5C6E60]">
                  <a href="/" onClick={(e) => { e.preventDefault(); navigateToArticle('home'); }} className="hover:text-[#142B1E] transition-colors cursor-pointer">Home</a>
                  <span>/</span>
                  <span className="text-[#142B1E] font-medium">About</span>
                </nav>

                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E2D5] shadow-xs space-y-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#E2EFE5] text-[#235837] border border-[#C2DEC9]">
                    Practical Plant Care
                  </span>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#142B1E] tracking-tight">
                    About SnakePlantSoil.com
                  </h1>
                  <p className="text-[#4D5D53] text-sm sm:text-base leading-relaxed">
                    Our mission is to help snake plant owners keep their plants thriving with clear soil recipes, container advice, and practical care guides.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-[#E8E2D5] shadow-xs space-y-2.5">
                    <h2 className="text-base font-serif font-bold text-[#142B1E]">Why We Built This Site</h2>
                    <p className="text-xs text-[#4D5D53] leading-relaxed">
                      SnakePlantSoil.com was created to replace contradictory gardening advice with clear, practical guidance. Snake plants thrive when potting media drains thoroughly and roots receive adequate air. Our goal is to make healthy plant care simple and approachable for everyday plant owners.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-[#E8E2D5] shadow-xs space-y-2.5">
                    <h2 className="text-base font-serif font-bold text-[#142B1E]">What You Can Find Here</h2>
                    <p className="text-xs text-[#4D5D53] leading-relaxed">
                      Browse step-by-step DIY potting soil recipes, compare commercial cactus and succulent mixes with ingredient breakdowns, calculate pot volumes, or run through our interactive soil diagnosis tool to find the right drainage balance for your home.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-[#E8E2D5] shadow-xs space-y-2.5">
                    <h2 className="text-base font-serif font-bold text-[#142B1E]">Guides & Snake Plant Radio</h2>
                    <p className="text-xs text-[#4D5D53] leading-relaxed">
                      Explore in-depth articles on repotting, winter watering, and root rot recovery, or listen to Snake Plant Radio for conversational audio deep dives into drainage, airflow, and container selection.
                    </p>
                  </div>
                </div>

                {/* Dedicated Affiliate Disclosure Section */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E2D5] shadow-xs space-y-4" id="affiliate-disclosure">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#E2EFE5] text-[#235837] border border-[#C2DEC9]">
                    <ShieldCheck className="w-4 h-4 text-[#235837]" /> Affiliate Disclosure & Transparency
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#142B1E] tracking-tight">
                    Affiliate Disclosure & Advertising Relationships
                  </h2>
                  <div className="text-xs sm:text-sm text-[#4D5D53] leading-relaxed space-y-3 font-sans">
                    <p>
                      SnakePlantSoil.com is an independent educational plant care publication supported by our readers. Some links to commercial products—including potting mixes, mineral amendments, and containers—are affiliate links.
                    </p>
                    <p>
                      We participate in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by linking to Amazon.com. When you click an Amazon product link and complete a purchase, we may earn an advertising referral commission at exactly zero additional cost to you.
                    </p>
                    <p>
                      Our editorial recommendations, potting mix ratings, and care guides are guided strictly by plant health and drainage principles. We do not accept sponsored product placements or manufacturer incentives that compromise our independent evaluations.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeDynamicArticle && (
            <motion.div
              key="dynamic-article-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="w-full"
              id={`dynamic-article-page-${activeDynamicArticle.slug}`}
            >
              <DynamicArticleView article={activeDynamicArticle} onNavigate={navigateToArticle} />
            </motion.div>
          )}

          {/* ====================================================
              VIEW RADIO: PODCAST HUB
              ==================================================== */}
          {activeTab === 'radio' && (
            <motion.div
              key="radio-hub-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              id="radio-page"
            >
              <RadioHub onNavigate={navigateToArticle} />
            </motion.div>
          )}

          {/* ====================================================
              VIEW RADIO: EPISODE DETAIL
              ==================================================== */}
          {activeEpisode && (
            <motion.div
              key={`episode-view-${activeEpisode.slug}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              id={`episode-detail-${activeEpisode.slug}`}
            >
              <EpisodeDetail episode={activeEpisode} onNavigate={navigateToArticle} />
            </motion.div>
          )}

          {/* Fallback View if tab is not a known static tab and dynamic article is not found */}
          {!['home', 'setup-kits', 'best-soil', 'diy-mix', 'root-rot', 'best-pots', 'care-guide', 'faq', 'care-card', 'about', 'radio'].includes(activeTab) && !activeDynamicArticle && !activeEpisode && (
            <motion.div
              key="not-found-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="w-full bg-[#FAF7F2] min-h-[70vh] flex items-center justify-center py-16 px-4 font-sans"
              id="not-found-page"
            >
              <div className="max-w-md w-full bg-white rounded-2xl border border-[#E8E2D5] p-8 text-center space-y-4 shadow-xs">
                <div className="w-16 h-16 bg-[#E2EFE5] text-[#235837] rounded-2xl flex items-center justify-center mx-auto text-xl font-bold font-serif border border-[#C2DEC9]">
                  404
                </div>
                <h1 className="text-2xl font-serif font-bold text-[#142B1E] tracking-tight">Article or Guide Not Found</h1>
                <p className="text-[#4D5D53] text-sm leading-relaxed">
                  The requested guide link could not be located. Browse our main botanical resources or search for care definitions below.
                </p>
                <div className="pt-2">
                  <button 
                    onClick={() => navigateToArticle('home')}
                    className="bg-[#235837] hover:bg-[#1A4329] text-white font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-xs cursor-pointer"
                    id="return-home-from-404"
                  >
                    ← Return to Home Portal
                  </button>
                </div>
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
