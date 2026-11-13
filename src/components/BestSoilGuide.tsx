import React from 'react';
import { ArrowRight, Droplets, SlidersHorizontal, Leaf } from 'lucide-react';
import {
  RANKED_SOIL_PRODUCTS,
  DECISION_GUIDE,
  SOIL_RANKINGS_DISCLOSURE,
  getRankedSoilById,
  RankedSoilProduct
} from '../soilRankings';
import { TopicalClusterNav } from './GuideArticles';
import BotanicalSubpageLayout from './BotanicalSubpageLayout';
import { trackEvent } from '../utils/analytics';

interface BestSoilGuideProps {
  onNavigate?: (tab: string) => void;
}

export default function BestSoilGuide({ onNavigate }: BestSoilGuideProps) {
  const breadcrumbs = [
    { label: 'Home', tabId: 'home' },
    { label: 'Soil Guides', tabId: 'setup-kits' },
    { label: 'Best Soil' }
  ];

  const tocItems = [
    { id: 'comparison-table', label: 'Compare at a glance' },
    { id: 'ranked-mixes', label: 'A closer look at each mix' },
    { id: 'decision-guide', label: 'Which mix fits your routine?' },
    { id: 'soil-science', label: 'Soil buying metrics' }
  ];

  const relatedGuides = [
    {
      title: 'Make your own 3-2-1 mix',
      description: 'A simple, effective DIY blend for snake plants.',
      tabId: 'diy-mix',
      image: '/mix-bowl.jpg'
    },
    {
      title: 'Find your soil profile',
      description: 'Learn how drainage, aeration, and moisture work together for healthier snake plants.',
      tabId: 'setup-kits',
      image: '/article-root-rot.jpg'
    }
  ];

  const handleAffiliateClick = (prod: RankedSoilProduct, placement: string) => {
    trackEvent('affiliate_link_clicked', {
      productId: prod.id,
      productName: prod.name,
      placement
    });
  };

  return (
    <BotanicalSubpageLayout
      categoryBadge="COMMERCIAL SOIL GUIDE"
      title="The Best Soils for Snake Plants"
      introSummary="Compare three ready-made mixes and choose what fits your plant and home."
      heroImage="/soil-mound.jpg"
      heroImageAlt="Rich, porous, fast-draining snake plant potting soil on a botanical stone surface"
      breadcrumbs={breadcrumbs}
      calloutBanner={{
        title: 'What snake plants need in a bag',
        description: 'Snake plants demand rapid gravity drainage. Standard commercial houseplant soil holds water for 10–14 days—a major risk factor for drought-adapted rhizomes. A true snake plant mix must dry down within 3–5 days.',
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#235837" strokeWidth="2">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        )
      }}
      tocItems={tocItems}
      relatedGuides={relatedGuides}
      onNavigate={onNavigate}
    >
      <div className="space-y-8" id="buyer-guide-root">
        
        {/* Visible Affiliate Disclosure Banner (placed before first affiliate links) */}
        <div 
          className="bg-[#EAE4D8]/60 border border-[#DCD5C5] rounded-xl px-4 py-2.5 text-xs text-[#2B3B30] flex items-center gap-2"
          id="affiliate-disclosure-banner"
        >
          <span className="font-sans leading-relaxed">
            <strong>Affiliate links:</strong> purchases may earn this site a commission at no extra cost to you.
          </span>
        </div>

        {/* ====================================================
            SECTION 1: QUICK COMPARISON TABLE
            ==================================================== */}
        <section id="comparison-table" className="scroll-mt-24">
          <h2 className="font-serif font-bold text-[#142B1E] text-2xl tracking-tight mb-4">
            Compare at a glance
          </h2>

          {/* Desktop Table */}
          <div className="hidden sm:block bg-white border border-[#E8E2D5] rounded-2xl overflow-hidden shadow-xs mb-8">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="bg-[#142B1E] text-white text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Mix</th>
                  <th className="py-3 px-4">Best fit</th>
                  <th className="py-3 px-4">Considerations</th>
                  <th className="py-3 px-4 text-center w-36">Shop</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D5]">
                {RANKED_SOIL_PRODUCTS.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#142B1E]">
                      #{prod.rank} {prod.name}
                    </td>
                    <td className="py-3.5 px-4 text-stone-700">
                      {prod.bestFitSummary}
                    </td>
                    <td className="py-3.5 px-4 text-stone-700">
                      {prod.considerationSummary}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {prod.affiliateUrl && (
                        <a
                          href={prod.affiliateUrl}
                          target="_blank"
                          rel="sponsored noopener"
                          aria-label={`Check price on Amazon for ${prod.name}`}
                          onClick={() => handleAffiliateClick(prod, 'comparison_table')}
                          className="bg-white hover:bg-[#235837] text-[#235837] hover:text-white border border-[#235837] font-bold text-xs px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1 shadow-2xs whitespace-nowrap cursor-pointer"
                          id={`table-buy-${prod.id}`}
                        >
                          <span>Check Price →</span>
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Comparison List */}
          <div className="sm:hidden space-y-3 mb-6">
            {RANKED_SOIL_PRODUCTS.map((prod) => (
              <div key={prod.id} className="bg-white border border-[#E8E2D5] rounded-xl p-4 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-xs text-[#142B1E]">
                    #{prod.rank} {prod.name}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#235837] bg-[#E2EFE5] px-2 py-0.5 rounded">
                    {prod.bestFitSummary}
                  </span>
                </div>
                <p className="text-xs text-stone-600 m-0 leading-relaxed font-sans">
                  <strong>Consideration:</strong> {prod.considerationSummary}
                </p>
                {prod.affiliateUrl && (
                  <a
                    href={prod.affiliateUrl}
                    target="_blank"
                    rel="sponsored noopener"
                    aria-label={`Check price on Amazon for ${prod.name}`}
                    onClick={() => handleAffiliateClick(prod, 'comparison_table_mobile')}
                    className="w-full bg-white hover:bg-[#235837] text-[#235837] hover:text-white border border-[#235837] font-bold text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-2xs cursor-pointer text-center"
                    id={`mobile-buy-${prod.id}`}
                  >
                    <span>Check Price →</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ====================================================
            SECTION 2: RANKED COMMERCIAL MIXES (CARDS)
            ==================================================== */}
        <section id="ranked-mixes" className="scroll-mt-24 space-y-4">
          <h2 className="font-serif font-bold text-[#142B1E] text-2xl tracking-tight">
            A closer look at each mix
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
            {RANKED_SOIL_PRODUCTS.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl p-5 shadow-xs border border-[#E8E2D5] flex flex-col justify-between hover:border-[#235837]/40 transition-all"
                id={`card-${prod.id}`}
              >
                <div>
                  {/* Rank Badge */}
                  <span className="inline-block bg-[#E2EFE5] text-[#235837] text-xs font-bold font-mono px-2.5 py-0.5 rounded-md mb-2">
                    #{prod.rank}
                  </span>

                  {/* Product Image */}
                  <div className="w-full h-44 rounded-xl overflow-hidden bg-stone-50 border border-[#E8E2D5] my-2.5 flex items-center justify-center p-2">
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="font-serif font-bold text-[#142B1E] text-lg leading-snug mb-3">
                    {prod.name}
                  </h3>

                  {/* Bullet points */}
                  <ul className="space-y-2.5 text-xs text-stone-700 leading-relaxed font-sans mb-4">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#235837] shrink-0 mt-1.5" />
                      <span>
                        <strong>Strengths:</strong> {prod.cardStrengths}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6B7C70] shrink-0 mt-1.5" />
                      <span>
                        <strong>Considerations:</strong> {prod.cardConsiderations}
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Prominent Full-Width Purchase Button */}
                {prod.affiliateUrl && (
                  <div className="pt-2 mt-auto">
                    <a
                      href={prod.affiliateUrl}
                      target="_blank"
                      rel="sponsored noopener"
                      aria-label={`Check price on Amazon for ${prod.name}`}
                      onClick={() => handleAffiliateClick(prod, 'ranked_cards')}
                      className="w-full bg-[#142B1E] hover:bg-[#235837] text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer text-center"
                      id={`card-buy-${prod.id}`}
                    >
                      <span>Check Price on Amazon →</span>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ====================================================
            SECTION 3: DECISION GUIDE
            ==================================================== */}
        <section id="decision-guide" className="scroll-mt-24">
          <div className="bg-[#EAEFEA] border border-[#D5E2D6] rounded-2xl p-6 sm:p-8">
            <h2 className="font-serif font-bold text-[#142B1E] text-2xl tracking-tight mb-5">
              Which mix fits your routine?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {DECISION_GUIDE.map((item) => {
                const targetProd = getRankedSoilById(item.productId);
                return (
                  <div 
                    key={item.id} 
                    className="bg-white rounded-xl p-5 border border-[#D5E2D6] shadow-2xs flex flex-col justify-between"
                  >
                    <div>
                      {/* Icon */}
                      <div className="w-9 h-9 rounded-full bg-[#E2EFE5] flex items-center justify-center mb-3">
                        {item.icon === 'droplet' && <Droplets className="w-4.5 h-4.5 text-[#235837]" />}
                        {item.icon === 'sliders' && <SlidersHorizontal className="w-4.5 h-4.5 text-[#235837]" />}
                        {item.icon === 'leaf' && <Leaf className="w-4.5 h-4.5 text-[#235837]" />}
                      </div>
                      <h3 className="font-serif font-bold text-[#142B1E] text-base leading-snug">
                        {item.question}
                      </h3>
                      <p className="text-xs text-stone-600 leading-relaxed mt-1.5 mb-5 font-sans">
                        {item.explanation}
                      </p>
                    </div>

                    {targetProd?.affiliateUrl && (
                      <a
                        href={targetProd.affiliateUrl}
                        target="_blank"
                        rel="sponsored noopener"
                        aria-label={`Get ${targetProd.name} on Amazon`}
                        onClick={() => handleAffiliateClick(targetProd, 'decision_guide')}
                        className="w-full bg-[#142B1E] hover:bg-[#235837] text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer text-center"
                        id={`decision-buy-${item.id}`}
                      >
                        <span>{item.buttonLabel}</span>
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ====================================================
            SECTION 4: EDUCATIONAL & BUYING METRICS
            ==================================================== */}
        <section id="soil-science" className="scroll-mt-24 space-y-5 text-stone-700 text-sm leading-relaxed">
          <h2 className="font-serif font-bold text-[#142B1E] text-2xl tracking-tight mb-2">
            What Kind of Soil Do Snake Plants Need?
          </h2>
          <p>
            In their native environments across tropical West Africa, snake plants (<em>Sansevieria trifasciata</em>) thrive in rugged, porous terrain where water drains away almost immediately after rainstorms. Snake plants store water inside their thick, fibrous leaves and sturdy underground <strong>rhizomes</strong>. Because these storage structures stay hydrated for weeks, snake plant roots quickly suffocate and rot when trapped in heavy, wet soil. If you suspect your plant is already suffering from waterlogged conditions, follow our{' '}
            <a
              href="/snake-plant-root-rot-guide"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('root-rot');
                }
              }}
              className="text-[#235837] font-bold underline hover:text-[#142B1E]"
            >
              Snake Plant Root Rot Guide
            </a>{' '}
            to inspect symptoms and save viable roots.
          </p>
          <p>
            An ideal snake plant mix balances rapid drainage with enough structure to anchor upright leaves. Standard all-purpose potting soil contains high concentrations of fine peat moss, which settles and stays waterlogged for too long indoors. Selecting a dedicated cactus or succulent mix—or opting for a gritty inorganic substrate—ensures continuous air pockets around the root zone.
          </p>

          <h3 className="font-serif font-bold text-[#142B1E] text-lg tracking-tight mt-6 mb-2">
            Three Vital Soil Metrics to Verify Before Purchasing
          </h3>
          <ul className="space-y-2 list-disc pl-5 font-sans text-xs sm:text-sm text-stone-700">
            <li>
              <strong>The Grain Ratio:</strong> The mix should feel loose and crumbly. If you squeeze a handful of damp mix, it should immediately crumble when you open your palm. If it holds a dense ball, it contains too much unamended peat or clay.
            </li>
            <li>
              <strong>Mineral Amendment Content:</strong> Reliable formulations contain visible percentages of coarse volcanic media—such as <em>perlite</em>, <em>pumice</em>, or <em>calcined clay</em>. These aggregates create permanent air pores that never break down.
            </li>
            <li>
              <strong>Absence of Large Forest Debris:</strong> Budget potting soils often rely on uncomposted softwood bark chips that can harbor fungus gnats and decompose into a soggy sludge that restricts airflow.
            </li>
          </ul>

          {/* Bottom Affiliate Disclosure */}
          <div className="text-center pt-2 pb-4 border-t border-stone-200 mt-6" id="affiliate-disclosure-block">
            <p className="text-[11px] text-stone-600 italic max-w-xl mx-auto leading-relaxed font-sans m-0">
              {SOIL_RANKINGS_DISCLOSURE}
            </p>
          </div>

          <TopicalClusterNav currentTab="best-soil" onNavigate={onNavigate} />
        </section>

      </div>
    </BotanicalSubpageLayout>
  );
}
