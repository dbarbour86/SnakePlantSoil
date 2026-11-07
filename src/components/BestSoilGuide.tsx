import React from 'react';
import { Info, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react';
import {
  RANKED_SOIL_PRODUCTS,
  DECISION_GUIDE,
  SOIL_RANKINGS_DISCLOSURE
} from '../soilRankings';
import { TopicalClusterNav } from './GuideArticles';
import BotanicalSubpageLayout from './BotanicalSubpageLayout';

interface BestSoilGuideProps {
  onNavigate?: (tab: string) => void;
}

export default function BestSoilGuide({ onNavigate }: BestSoilGuideProps) {
  const breadcrumbs = [
    { label: 'Home', tabId: 'home' },
    { label: 'Soil Guide', tabId: 'setup-kits' },
    { label: 'Best Soils' }
  ];

  const tocItems = [
    { id: 'comparison-table', label: 'Quick comparison table' },
    { id: 'ranked-mixes', label: 'Ranked commercial mixes' },
    { id: 'decision-guide', label: 'Decision guide' },
    { id: 'soil-science', label: 'Soil buying metrics' }
  ];

  const relatedGuides = [
    {
      title: 'Make your own mix',
      description: 'A simple, balanced DIY soil mix that keeps roots healthy and prevents excess moisture.',
      tabId: 'diy-mix',
      image: '/mix-bowl.jpg'
    },
    {
      title: 'Root rot signs & recovery',
      description: 'Learn how proper drainage prevents yellowing leaves and mushy roots.',
      tabId: 'root-rot',
      image: '/article-root-rot.jpg'
    }
  ];

  return (
    <BotanicalSubpageLayout
      categoryBadge="COMMERCIAL SOIL GUIDE"
      title="The Best Soil for Snake Plants: Top Mixes Compared"
      introSummary="An editorial comparison of the top commercial succulent and cactus soil mixes. We compare drainage rates, particle chunkiness, and moisture retention."
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
        
        {/* ====================================================
            SECTION 1: QUICK COMPARISON TABLE
            ==================================================== */}
        <section id="comparison-table" className="scroll-mt-24">
          <h2 className="font-serif font-bold text-[#142B1E] text-2xl tracking-tight mb-2">
            Quick comparison table
          </h2>
          <p className="font-sans text-stone-600 text-sm mb-4 leading-relaxed">
            Here is how the top commercial mixes compare based on mineral structure, drainage speed, and ease of use:
          </p>

          {/* Desktop Table */}
          <div className="hidden sm:block bg-white border border-[#E8E2D5] rounded-2xl overflow-hidden shadow-xs mb-8">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="bg-[#F8F5EE] border-b border-[#E8E2D5] text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-16">Rank</th>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Primary Media</th>
                  <th className="py-3.5 px-4">Drainage</th>
                  <th className="py-3.5 px-4 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D5]">
                {RANKED_SOIL_PRODUCTS.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-6 h-6 rounded-full bg-[#142B1E] text-white font-bold text-xs flex items-center justify-center">
                        {prod.rank}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-stone-900">{prod.name}</div>
                      <div className="text-[11px] text-stone-500">{prod.badge}</div>
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      {prod.baseComposition}
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      {prod.dryingCharacteristics}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-[#142B1E]">
                      {prod.priceEstimate || '$$$'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Comparison List (eliminates horizontal overflow) */}
          <div className="sm:hidden space-y-2.5 mb-6">
            {RANKED_SOIL_PRODUCTS.map((prod) => (
              <div key={prod.id} className="bg-white border border-[#E8E2D5] rounded-xl p-3.5 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#142B1E] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {prod.rank}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#142B1E] leading-snug">{prod.name}</div>
                    <div className="text-[11px] text-stone-500 leading-tight">{prod.dryingCharacteristics}</div>
                  </div>
                </div>
                {prod.affiliateUrl && (
                  <a
                    href={prod.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#235837] hover:underline shrink-0 ml-2"
                  >
                    View →
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ====================================================
            SECTION 2: RANKED COMMERCIAL MIXES
            ==================================================== */}
        <section id="ranked-mixes" className="scroll-mt-24 space-y-6">
          <div>
            <h2 className="font-serif font-bold text-[#142B1E] text-2xl tracking-tight mb-2">
              Ranked commercial mixes
            </h2>
            <p className="font-sans text-stone-600 text-sm leading-relaxed">
              Detailed specifications and grounded evaluations for each ranked substrate:
            </p>
          </div>

          <div className="space-y-6">
            {RANKED_SOIL_PRODUCTS.map((prod) => {
              const isFirst = prod.rank === 1;
              return (
                <div
                  key={prod.id}
                  className={`bg-white rounded-2xl p-5 sm:p-6 shadow-xs border transition-all ${
                    isFirst ? 'border-2 border-[#235837] relative' : 'border border-[#E8E2D5]'
                  }`}
                  id={`card-${prod.id}`}
                >
                  {/* Top Bar: Badge + Rating */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-block bg-[#142B1E] text-[#9EC4A9] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full font-sans">
                      #{prod.rank} {prod.badge}
                    </span>
                    <span className="text-xs font-bold text-amber-800 flex items-center gap-1 font-sans">
                      ★ {prod.rating || '4.8'}
                    </span>
                  </div>

                  {/* Title & Brand */}
                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider font-sans block">
                      {prod.brand}
                    </span>
                    <h3 className="font-serif font-bold text-[#142B1E] text-lg sm:text-xl leading-snug">
                      {prod.name}
                    </h3>
                  </div>

                  {/* Body Content Grid: Image + Description */}
                  <div className="grid grid-cols-1 sm:grid-cols-[110px_1fr] gap-4 items-start mb-4">
                    {prod.imageUrl ? (
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-stone-50 border border-stone-200 p-2 flex items-center justify-center shrink-0 mx-auto sm:mx-0 overflow-hidden">
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-[#FAF7F2] border border-[#E8E2D5] flex flex-col items-center justify-center shrink-0 mx-auto sm:mx-0">
                        <span className="font-serif text-2xl font-bold text-[#235837]">#{prod.rank}</span>
                        <span className="text-[9px] uppercase tracking-wider text-stone-500 font-bold">Gritty Mix</span>
                      </div>
                    )}
                    <div className="space-y-3 font-sans text-xs text-stone-600 leading-relaxed">
                      <p className="m-0 text-stone-700">
                        {prod.verdict}
                      </p>
                      
                      {/* Specs Row */}
                      <div className="bg-[#FAF7F2] border border-[#EAE3D5] rounded-xl p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <strong className="text-stone-800 uppercase text-[9px] tracking-wider block">Base Composition:</strong>
                          <span className="text-stone-600">{prod.baseComposition}</span>
                        </div>
                        <div>
                          <strong className="text-stone-800 uppercase text-[9px] tracking-wider block">Drying Time:</strong>
                          <span className="text-stone-600">{prod.dryingCharacteristics}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pros & Cons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs font-sans">
                    <div className="flex items-start gap-1.5 text-stone-700">
                      <span className="text-[#235837] font-bold">✓</span>
                      <span>{prod.strength}</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-stone-700">
                      <span className="text-amber-800 font-bold">⚠</span>
                      <span>{prod.limitation}</span>
                    </div>
                  </div>

                  {/* Purchase Button */}
                  {prod.affiliateUrl && (
                    <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between flex-wrap gap-2">
                      <span className="text-[11px] text-stone-600 font-sans">Verified commercial formula</span>
                      <a
                        href={prod.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#142B1E] hover:bg-[#235837] text-white font-bold text-xs px-4 py-2 rounded-xl inline-flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                        id={`card-buy-${prod.id}`}
                      >
                        <span>{prod.buttonLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ====================================================
            SECTION 3: DECISION GUIDE
            ==================================================== */}
        <section id="decision-guide" className="scroll-mt-24">
          <div className="bg-[#142B1E] text-white rounded-2xl p-6 sm:p-7 shadow-sm">
            <h3 className="font-serif font-bold text-white text-lg sm:text-xl mb-4 leading-snug">
              Decision Guide: Which Soil Should You Buy?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {DECISION_GUIDE.map((item, idx) => (
                <div key={idx} className="bg-white/10 border border-white/15 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] text-[#9EC4A9] font-bold uppercase tracking-wider font-sans block mb-1">
                      {item.question}
                    </span>
                    <h4 className="font-serif font-bold text-white text-sm mb-2">
                      {item.choice}
                    </h4>
                    <p className="text-xs text-stone-200 leading-relaxed font-sans m-0">
                      {item.explanation}
                    </p>
                  </div>
                </div>
              ))}
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
            In their native environments across tropical West Africa, snake plants (<em>Sansevieria trifasciata</em>) thrive in rugged, porous terrain where water drains away almost immediately after rainstorms. Snake plants store water inside their thick, fibrous leaves and sturdy underground <strong>rhizomes</strong>. Because these storage structures stay hydrated for weeks, snake plant roots quickly suffocate and rot when trapped in heavy, wet soil.
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

          {/* Extension Citation Box */}
          <div className="bg-[#E5ECE4] rounded-xl p-4 border border-[#D6E2D5] flex gap-3 my-4">
            <Info className="w-4 h-4 text-[#235837] shrink-0 mt-0.5" />
            <div className="text-xs text-stone-800 leading-relaxed font-sans">
              <strong>Horticultural Extension Reference:</strong> Research published by the{' '}
              <a
                href="https://edis.ifas.ufl.edu/publication/EP027"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-bold text-[#142B1E] hover:text-[#235837]"
              >
                University of Florida IFAS Extension (Sansevieria Production Guide)
              </a>{' '}
              confirms that porous, well-aerated potting media is essential for <em>Sansevieria</em> root vigor. Fast-draining substrates prevent the anaerobic environment where fungal root pathogens thrive.
            </div>
          </div>

          {/* Affiliate Disclosure */}
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
