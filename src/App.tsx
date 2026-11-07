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
    title: "Snake Plant Root Rot: Symptoms, Treatment & Recovery Guide",
    description: "Learn how to recognize snake plant root rot, remove badly damaged tissue, repot viable roots or rhizomes, and correct the moisture conditions that caused the problem."
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
    description: "Official podcast of SnakePlantSoil.com. Deep-dive weekly discussions on soil aeration, potting physics, root rot recovery, and resilient houseplant cultivation."
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
                      The Complete Guide to Snake Plant Care
                    </h1>

                    <p className="text-stone-700 text-base md:text-lg leading-relaxed">
                      Choose the right soil. Spot problems early. Keep your snake plant happy for years.
                    </p>

                    <div className="pt-1 md:pt-2">
                      <button 
                        onClick={() => {
                          const el = document.getElementById('field-guide-paths');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                          else navigateToArticle('setup-kits');
                        }}
                        className="inline-flex items-center gap-2 bg-[#1B3B2B] hover:bg-[#122A1E] text-stone-50 px-5 md:px-6 py-2.5 md:py-3 rounded-full text-xs md:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
                        id="hero-start-cta"
                      >
                        <span>Start Here</span>
                        <span className="text-[#9EC4A9]">→</span>
                      </button>
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
                  
                  {/* Path 1: Root Rot Recovery */}
                  <div 
                    onClick={() => navigateToArticle('root-rot')}
                    className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-[#EAE4D8] shadow-sm hover:shadow-md hover:border-[#1A3B29]/30 transition-all flex flex-col justify-between group cursor-pointer relative overflow-hidden"
                    id="path-card-fix-plant"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2 flex-1">
                        <div className="w-9 h-9 rounded-full bg-[#E2EFE5] text-[#1A3B29] flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/></svg>
                        </div>
                        <h2 className="font-serif-editorial text-xl font-bold text-[#142B1E] tracking-tight group-hover:text-[#1A3B29]">
                          Root Rot Recovery
                        </h2>
                        <p className="text-stone-650 text-base leading-snug">
                          Recognize root rot and learn the steps to help your plant recover.
                        </p>
                      </div>
                      <div className="w-[42%] shrink-0 h-32 rounded-xl overflow-hidden border border-[#EAE4D8]">
                        <img 
                          src="/leaf-troubleshoot.jpg" 
                          alt="Snake plant leaf showing yellowing edge symptoms" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#F2ECE1] flex items-center justify-between text-xs font-bold text-[#1A3B29] group-hover:underline">
                      <span>Get Help</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>

                  {/* Path 2: Find the Right Soil */}
                  <div 
                    onClick={() => navigateToArticle('best-soil')}
                    className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-[#EAE4D8] shadow-sm hover:shadow-md hover:border-[#1A3B29]/30 transition-all flex flex-col justify-between group cursor-pointer relative overflow-hidden"
                    id="path-card-right-soil"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2 flex-1">
                        <div className="w-9 h-9 rounded-full bg-[#E2EFE5] text-[#1A3B29] flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M2 20h20c-1.5-5-5-8-10-8s-8.5 3-10 8z"/></svg>
                        </div>
                        <h2 className="font-serif-editorial text-xl font-bold text-[#142B1E] tracking-tight group-hover:text-[#1A3B29]">
                          Find the Right Soil
                        </h2>
                        <p className="text-stone-650 text-base leading-snug">
                          Learn the perfect mix for healthy growth.
                        </p>
                      </div>
                      <div className="w-[42%] shrink-0 h-32 rounded-xl overflow-hidden border border-[#EAE4D8]">
                        <img 
                          src="/soil-mound.jpg" 
                          alt="Mound of rich, dark, aerated potting soil" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#F2ECE1] flex items-center justify-between text-xs font-bold text-[#1A3B29] group-hover:underline">
                      <span>Explore Soil</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>

                  {/* Path 3: Make My Own Mix */}
                  <div 
                    onClick={() => navigateToArticle('diy-mix')}
                    className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-[#EAE4D8] shadow-sm hover:shadow-md hover:border-[#1A3B29]/30 transition-all flex flex-col justify-between group cursor-pointer relative overflow-hidden"
                    id="path-card-diy-mix"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2 flex-1">
                        <div className="w-9 h-9 rounded-full bg-[#E2EFE5] text-[#1A3B29] flex items-center justify-center shrink-0">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                        </div>
                        <h2 className="font-serif-editorial text-xl font-bold text-[#142B1E] tracking-tight group-hover:text-[#1A3B29]">
                          Make My Own Mix
                        </h2>
                        <p className="text-stone-650 text-base leading-snug">
                          Simple recipes for snake plant soil.
                        </p>
                      </div>
                      <div className="w-[42%] shrink-0 h-32 rounded-xl overflow-hidden border border-[#EAE4D8]">
                        <img 
                          src="/mix-bowl.jpg" 
                          alt="Shallow stoneware bowl with gritty potting mix" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#F2ECE1] flex items-center justify-between text-xs font-bold text-[#1A3B29] group-hover:underline">
                      <span>Try It</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
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
                    <span>Expert Tips</span>
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
                    {RANKED_SOIL_PRODUCTS.map((prod) => (
                      <div key={prod.id} className="bg-white border border-stone-200 p-5 rounded-2xl flex flex-col justify-between hover:border-emerald-700/20 transition-all shadow-2xs">
                        <div className="space-y-3">
                          <div className="flex gap-3">
                            <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-stone-50 border border-stone-200 flex items-center justify-center p-1">
                              {prod.hasVerifiedImage && prod.imageUrl ? (
                                <img src={prod.imageUrl} alt={prod.name} className="max-w-full max-h-full object-contain" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-[#24532e] text-white font-bold flex items-center justify-center text-xs">
                                  #{prod.rank}
                                </div>
                              )}
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <span className="w-5 h-5 rounded-full bg-[#24532e] text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                                  {prod.rank}
                                </span>
                                <span className="text-[8px] font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 uppercase block w-fit">
                                  {prod.badge}
                                </span>
                              </div>
                              <span className="text-xs font-bold text-stone-700 block">
                                {prod.award}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-0.5">
                            <div className="text-[9px] font-mono text-stone-400 font-bold uppercase">{prod.brand}</div>
                            <h3 className="font-bold text-stone-900 text-xs leading-snug">
                              {prod.name}
                            </h3>
                          </div>

                          <p className="text-stone-600 text-xs leading-relaxed">
                            {prod.verdict}
                          </p>

                          <div className="text-[10px] border-t border-stone-100 pt-2 space-y-1 font-sans">
                            <div className="flex items-start gap-1 text-stone-700">
                              <span className="text-emerald-700 font-bold">✓</span>
                              <span><strong>Strength:</strong> {prod.strength}</span>
                            </div>
                            <div className="flex items-start gap-1 text-stone-700">
                              <span className="text-amber-600 font-bold">⚠</span>
                              <span><strong>Limitation:</strong> {prod.limitation}</span>
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
                            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:underline inline-flex items-center gap-1 group/btn"
                          >
                            <span>Read Ranking</span>
                            <span className="text-[10px] group-hover/btn:translate-x-0.5 transition-transform">→</span>
                          </a>
                          <span className="text-[8px] text-stone-400 font-mono">
                            Rank #{prod.rank}
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

              {/* SECTION: TASTEFUL SNAKE PLANT RADIO FEATURE */}
              <section className="py-14 bg-gradient-to-br from-stone-900 to-emerald-950 text-white relative overflow-hidden" id="homepage-snake-plant-radio">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    
                    <div className="lg:col-span-7 space-y-4 text-left">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-800/80 text-emerald-200 border border-emerald-700/60">
                        <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                        <span>Now Streaming • Snake Plant Radio</span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
                        Deep-Dive Soil Science for Your Ears
                      </h2>

                      <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-xl">
                        Listen to our weekly botanical podcast. We deconstruct common houseplant advice, 
                        explore soil oxygenation physics, and help you keep your Sansevieria rot-free.
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                          onClick={() => navigateToArticle('radio')}
                          className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs transition-all shadow-xs flex items-center gap-2 cursor-pointer"
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
                          className="px-4 py-2.5 rounded-lg bg-stone-800/90 hover:bg-stone-800 text-stone-200 font-bold text-xs transition-all border border-stone-700 flex items-center gap-1.5"
                        >
                          <span>Spotify Feed</span>
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </a>
                      </div>
                    </div>

                    <div className="lg:col-span-5 bg-stone-850/90 border border-stone-700/80 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
                      <div className="flex items-center justify-between border-b border-stone-750 pb-3">
                        <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                          Featured Episode #1
                        </span>
                        <span className="text-[10px] font-mono text-stone-400">
                          5 min
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-display font-bold text-white leading-snug">
                        Why Your Snake Plant Is Dying (It's Probably Water)
                      </h3>

                      <p className="text-stone-400 text-xs leading-relaxed line-clamp-2">
                        Overwatering kills more snake plants than anything else. Maya and Jordan walk through the five-step recovery protocol that can save your plant.
                      </p>

                      <div className="pt-2">
                        <button
                          onClick={() => navigateToArticle('radio/why-your-snake-plant-is-dying')}
                          className="w-full py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                          id="home-episode-1-cta"
                        >
                          <span>Listen & View Show Notes</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
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
              className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10"
              id="best-soil-page"
            >
              <div className="mb-6">
                <button 
                  onClick={() => navigateToArticle('home')}
                  className="text-xs font-bold text-stone-550 hover:text-stone-900 flex items-center gap-1 focus:outline-none cursor-pointer"
                  id="back-home-best-soil"
                >
                  ← Return to Home Portal
                </button>
              </div>

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
