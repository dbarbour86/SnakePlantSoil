import React, { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';

export interface TocItem {
  id: string;
  label: string;
}

export interface RelatedGuide {
  title: string;
  description: string;
  tabId: string;
  image: string;
}

export interface BreadcrumbItem {
  label: string;
  tabId?: string;
}

export interface BotanicalSubpageLayoutProps {
  categoryBadge: string;
  title: string;
  introSummary: string;
  heroImage: string;
  heroImageAlt: string;
  breadcrumbs: BreadcrumbItem[];
  calloutBanner: {
    title: string;
    description: string;
    icon?: React.ReactNode;
  };
  tocItems: TocItem[];
  relatedGuides: RelatedGuide[];
  onNavigate?: (tab: string) => void;
  children: React.ReactNode;
}

export default function BotanicalSubpageLayout({
  categoryBadge,
  title,
  introSummary,
  heroImage,
  heroImageAlt,
  breadcrumbs,
  calloutBanner,
  tocItems,
  relatedGuides,
  onNavigate,
  children
}: BotanicalSubpageLayoutProps) {
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [activeTocId, setActiveTocId] = useState<string>(tocItems[0]?.id || '');

  const handleTocClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveTocId(id);
    setMobileTocOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-[#FAF7F2] text-[#292524] w-full py-6 sm:py-8 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Trail */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1.5 text-xs text-stone-500 font-sans flex-wrap">
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <li key={index} className="flex items-center gap-1.5">
                  {index > 0 && <span className="text-stone-400">/</span>}
                  {item.tabId && !isLast ? (
                    <button
                      onClick={() => onNavigate?.(item.tabId!)}
                      className="hover:text-[#142B1E] hover:underline focus:outline-none cursor-pointer transition-colors"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <span className={isLast ? "text-stone-800 font-semibold" : ""}>
                      {item.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Article Hero */}
        <header className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-6 md:gap-8 items-center mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-[11px] font-bold tracking-widest text-[#235837] uppercase font-sans">
                {categoryBadge}
              </span>
              <span className="inline-block w-10 h-px bg-[#A3C2A9]" aria-hidden="true" />
            </div>
            <h1 className="font-serif font-bold text-[#142B1E] text-2.5xl sm:text-3.5xl md:text-4xl leading-[1.18] tracking-tight mb-3">
              {title}
            </h1>
            <p className="font-sans text-stone-600 text-sm sm:text-base leading-relaxed">
              {introSummary}
            </p>
          </div>
          <div className="aspect-[16/10] sm:aspect-[16/11] rounded-2xl overflow-hidden bg-stone-100 border border-[#E8E2D5] shadow-xs">
            <img
              src={heroImage}
              alt={heroImageAlt}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        </header>

        {/* Editorial Callout Banner */}
        <div className="bg-[#E5ECE4] border border-[#D6E2D5] rounded-2xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 shadow-2xs">
          {calloutBanner.icon && (
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#D1DFD0] flex items-center justify-center shrink-0">
              {calloutBanner.icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-serif font-bold text-[#142B1E] text-base sm:text-lg mb-1 leading-snug">
              {calloutBanner.title}
            </h3>
            <p className="font-sans text-stone-700 text-xs sm:text-sm leading-relaxed mb-0">
              {calloutBanner.description}
            </p>
          </div>
        </div>

        {/* Content Layout Grid (Sidebar TOC + Main Content) */}
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 md:gap-12 items-start mb-6">
          
          {/* Mobile TOC Accordion */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileTocOpen(!mobileTocOpen)}
              className="w-full flex items-center justify-between bg-white border border-[#E8E2D5] rounded-xl px-4 py-3 text-xs font-bold text-[#142B1E] shadow-2xs cursor-pointer"
              aria-expanded={mobileTocOpen}
            >
              <span>On this page</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mobileTocOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileTocOpen && (
              <div className="mt-2 bg-white border border-[#E8E2D5] rounded-xl p-3 shadow-sm space-y-2">
                {tocItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => handleTocClick(e, item.id)}
                    className="block text-xs font-sans text-stone-600 hover:text-[#142B1E] py-1 border-b border-stone-100 last:border-0"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Sticky Sidebar TOC */}
          <aside className="hidden md:block sticky top-24 space-y-3">
            <div className="text-xs font-bold text-[#142B1E] tracking-tight uppercase font-sans">
              On this page
            </div>
            <nav className="border-l-2 border-[#E8E2D5] pl-3 space-y-2.5">
              {tocItems.map((item) => {
                const isActive = activeTocId === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => handleTocClick(e, item.id)}
                    className={`block text-xs font-sans transition-colors leading-snug ${
                      isActive 
                        ? 'text-[#142B1E] font-bold -ml-[14px] pl-3 border-l-2 border-[#235837]' 
                        : 'text-stone-500 hover:text-[#142B1E]'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </aside>

          {/* Main Article Content */}
          <main className="min-w-0 font-sans text-[#292524] text-[15px] leading-[1.65]">
            {children}
          </main>

        </div>

        {/* Related Guides Section */}
        {relatedGuides.length > 0 && (
          <section className="border-t border-[#EAE3D5] pt-6 mt-4">
            <h3 className="font-serif font-bold text-[#142B1E] text-xl mb-1">
              Related guides
            </h3>
            <p className="font-sans text-xs text-stone-500 mb-5">
              Keep your snake plant thriving with these helpful guides.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedGuides.map((guide, idx) => (
                <div
                  key={idx}
                  onClick={() => onNavigate?.(guide.tabId)}
                  className="bg-white border border-[#E8E2D5] rounded-2xl overflow-hidden flex hover:border-[#235837] hover:shadow-md transition-all cursor-pointer group shadow-2xs"
                >
                  <div className="w-24 sm:w-28 shrink-0 aspect-[4/3] bg-stone-100 overflow-hidden">
                    <img
                      src={guide.image}
                      alt={guide.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      <h4 className="font-serif font-bold text-[#142B1E] text-sm group-hover:text-[#235837] transition-colors mb-1 line-clamp-1">
                        {guide.title}
                      </h4>
                      <p className="font-sans text-xs text-stone-600 leading-snug line-clamp-2 m-0">
                        {guide.description}
                      </p>
                    </div>
                    <div className="flex justify-end mt-2">
                      <span className="text-xs font-bold text-[#235837] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
