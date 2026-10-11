import React from 'react';
import { Trees, Sliders, Info, ExternalLink, ArrowRight } from 'lucide-react';
import {
  RANKED_SOIL_PRODUCTS,
  DECISION_GUIDE,
  SOIL_RANKINGS_DISCLOSURE
} from '../soilRankings';
import { TopicalClusterNav } from './GuideArticles';

interface BestSoilGuideProps {
  onNavigate?: (tab: string) => void;
}

export default function BestSoilGuide({ onNavigate }: BestSoilGuideProps) {
  const topPick = RANKED_SOIL_PRODUCTS[0];

  return (
    <article className="max-w-3xl mx-auto text-stone-800 leading-relaxed font-sans" id="buyer-guide-root">
      
      {/* ====================================================
          SECTION A: PAGE INTRODUCTION
          ==================================================== */}
      <header className="mb-8">
        <span className="inline-block px-3 py-1 text-[11px] font-bold font-mono tracking-wider text-[#24532e] bg-[#e3ece0] rounded-full uppercase mb-3">
          BUYER GUIDE
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#193b22] tracking-tight leading-tight mb-3">
          The 3 Best Soils for Snake Plants
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          Ranked by drainage speed, ease of use, and how well they prevent the #1 killer of snake plants: overwatering. Editorial selections tested against real-world indoor growing conditions.
        </p>
      </header>

      {/* ====================================================
          SECTION B: FEATURED WINNER PANEL (#1 Top Pick)
          ==================================================== */}
      <section className="bg-[#24532e] text-white rounded-2xl p-5 sm:p-7 shadow-sm mb-8" id="featured-winner-panel">
        <div className="flex items-start gap-4 sm:gap-6">
          <div className="text-3xl sm:text-5xl font-black text-[#7bb883] shrink-0 pt-0.5 leading-none select-none">
            #1
          </div>
          <div className="space-y-1.5 flex-1 min-w-0">
            <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-[#a3d6ab] uppercase block">
              OUR TOP PICK
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {topPick.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#e0efe2] leading-relaxed pt-1">
              {topPick.featuredBlurb || topPick.verdict}
            </p>
          </div>
        </div>
      </section>

      {/* ====================================================
          SECTION C: QUICK COMPARISON TABLE
          ==================================================== */}
      <section className="bg-[#f4f6f1] border border-stone-200/80 rounded-2xl p-4 sm:p-6 mb-10 shadow-2xs" id="quick-comparison-table">
        <div className="grid grid-cols-12 text-[11px] font-mono font-bold text-stone-500 uppercase tracking-wider pb-3 border-b border-stone-200/80 mb-1 px-1">
          <div className="col-span-2 sm:col-span-1">RANK</div>
          <div className="col-span-6 sm:col-span-8">SOIL</div>
          <div className="col-span-4 sm:col-span-3 text-right">PRICING</div>
        </div>

        <div className="divide-y divide-stone-200/60">
          {RANKED_SOIL_PRODUCTS.map((prod) => (
            <div key={prod.id} className="grid grid-cols-12 items-center py-3.5 gap-2 px-1">
              {/* Rank Badge */}
              <div className="col-span-2 sm:col-span-1">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#24532e] text-white font-bold text-xs sm:text-sm flex items-center justify-center shadow-2xs">
                  {prod.rank}
                </div>
              </div>

              {/* Product Info */}
              <div className="col-span-6 sm:col-span-8 pr-2">
                <div className="font-bold text-stone-900 text-xs sm:text-sm leading-snug">
                  {prod.name}
                </div>
                <span className="inline-block bg-[#dbe8d8] text-[#24532e] text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1">
                  {prod.badge}
                </span>
              </div>

              {/* Action Button */}
              <div className="col-span-4 sm:col-span-3 flex justify-end">
                {prod.affiliateUrl ? (
                  <a
                    href={prod.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#d97706] hover:bg-[#b45309] text-white font-semibold text-xs px-3 sm:px-4 py-2 rounded-lg flex items-center gap-1 transition-colors shadow-2xs cursor-pointer shrink-0"
                    id={`table-buy-${prod.id}`}
                  >
                    <span>{prod.tableButtonLabel}</span>
                    <span className="font-bold text-xs">→</span>
                  </a>
                ) : (
                  <span className="text-xs text-stone-400 font-mono">Verified Pick</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================
          SECTION D: INDIVIDUAL RANKED PRODUCT CARDS
          ==================================================== */}
      <section className="space-y-6 sm:space-y-8 mb-10" id="individual-product-cards">
        {RANKED_SOIL_PRODUCTS.map((prod) => (
          <div
            key={prod.id}
            className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5"
            id={`card-${prod.id}`}
          >
            {/* Header: Rank + Name + Badge */}
            <div className="flex items-start gap-3.5 sm:gap-4">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#24532e] text-white font-bold text-sm sm:text-base flex items-center justify-center shrink-0 shadow-2xs">
                {prod.rank}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug">
                  {prod.name}
                </h3>
                <span className="inline-block bg-[#e5efe3] text-[#24532e] text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1">
                  {prod.badge}
                </span>
              </div>
            </div>

            {/* Product Image Panel (only if verified asset exists) */}
            {prod.hasVerifiedImage && prod.imageUrl && (
              <div className="flex items-center gap-4 pt-1">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center p-2 shrink-0 overflow-hidden">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="text-xs text-stone-500 font-mono space-y-1">
                  <div><strong>Brand:</strong> {prod.brand}</div>
                  <div><strong>Composition:</strong> {prod.baseComposition}</div>
                  <div><strong>Drying:</strong> {prod.dryingCharacteristics}</div>
                </div>
              </div>
            )}

            {/* Verdict */}
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              <strong className="text-stone-900 font-bold">Verdict:</strong> {prod.verdict}
            </p>

            {/* Strength and Limitation Split Box */}
            <div className="bg-[#f8f9f6] border border-stone-200/70 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div>
                <div className="flex items-center gap-1.5 font-bold text-[#1e612f] uppercase text-[11px] tracking-wide">
                  <span>✓</span>
                  <span>Strength</span>
                </div>
                <p className="text-stone-700 text-xs mt-1 leading-snug">
                  {prod.strength}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 font-bold text-[#c25e1a] uppercase text-[11px] tracking-wide">
                  <span>⚠</span>
                  <span>Limitation</span>
                </div>
                <p className="text-stone-700 text-xs mt-1 leading-snug">
                  {prod.limitation}
                </p>
              </div>
            </div>

            {/* Purchase Action Button */}
            {prod.affiliateUrl && (
              <div className="pt-1">
                <a
                  href={prod.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-lg inline-flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                  id={`card-buy-${prod.id}`}
                >
                  <span>{prod.buttonLabel}</span>
                  <span className="font-bold">→</span>
                </a>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* ====================================================
          SECTION E: WHICH SOIL IS RIGHT FOR YOU?
          ==================================================== */}
      <section className="bg-[#f9faf7] border border-stone-200 rounded-2xl p-6 sm:p-7 mb-8 space-y-3.5 shadow-2xs" id="decision-guide-section">
        <h3 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
          Which one is right for you?
        </h3>
        <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700">
          {DECISION_GUIDE.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 leading-relaxed">
              <span className="text-stone-400 font-bold shrink-0">→</span>
              <div>
                <strong className="text-stone-900">{item.question}</strong>
                <span className="mx-1 text-stone-400">→</span>
                <strong className="text-[#24532e]">{item.choice}</strong>. {item.explanation}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ====================================================
          SECTION F: AFFILIATE DISCLOSURE
          ==================================================== */}
      <div className="text-center pt-2 pb-8 border-b border-stone-200 mb-10" id="affiliate-disclosure-block">
        <p className="text-[11px] sm:text-xs text-stone-400 italic max-w-xl mx-auto leading-relaxed">
          {SOIL_RANKINGS_DISCLOSURE}
        </p>
      </div>

      {/* ====================================================
          SECTION G: PRESERVED EDUCATIONAL CONTENT
          ==================================================== */}
      <section className="space-y-8 text-stone-700 text-sm leading-relaxed" id="educational-content-section">
        
        {/* User Intent Navigation Bar */}
        <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl mb-8">
          <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase tracking-wider block mb-2">
            Explore Related Soil Options
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-sans">
            <a
              href="/diy-snake-plant-soil-mix"
              onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('diy-mix'); } }}
              className="p-2.5 bg-white border border-stone-200 rounded-lg font-bold text-stone-800 hover:text-emerald-800 hover:border-emerald-300 text-center transition-all flex flex-col justify-center items-center gap-0.5"
              id="intent-link-diy"
            >
              <span>DIY Soil Mix</span>
              <span className="text-[10px] font-mono font-normal text-stone-400">3-2-1 recipe &amp; calculator</span>
            </a>
            <a
              href="/snake-plant-root-rot-guide"
              onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('root-rot'); } }}
              className="p-2.5 bg-white border border-stone-200 rounded-lg font-bold text-stone-800 hover:text-emerald-800 hover:border-emerald-300 text-center transition-all flex flex-col justify-center items-center gap-0.5"
              id="intent-link-rot"
            >
              <span>Root Rot Guide</span>
              <span className="text-[10px] font-mono font-normal text-stone-400">Rot rescue protocol</span>
            </a>
            <a
              href="/soil-diagnosis"
              onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('setup-kits'); } }}
              className="p-2.5 bg-white border border-stone-200 rounded-lg font-bold text-stone-800 hover:text-emerald-800 hover:border-emerald-300 text-center transition-all flex flex-col justify-center items-center gap-0.5"
              id="intent-link-diagnosis"
            >
              <span>Soil Diagnostic Quiz</span>
              <span className="text-[10px] font-mono font-normal text-stone-400">Interactive assessment</span>
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight mb-3">
            What Kind of Soil Do Snake Plants Need?
          </h2>
          <p className="mb-3">
            In their native environments across tropical West Africa, snake plants (<em>Sansevieria trifasciata</em>) thrive in rugged, porous terrain where water drains away almost immediately after rainstorms. Snake plants store water inside their thick, fibrous leaves and sturdy underground <strong>rhizomes</strong>. Because these storage structures stay hydrated for weeks, snake plant roots quickly suffocate and rot when trapped in heavy, wet soil.
          </p>
          <p>
            An ideal snake plant mix balances rapid drainage with enough structure to anchor upright leaves. Standard all-purpose potting soil contains high concentrations of fine peat moss, which settles and stays waterlogged for too long indoors. Selecting a dedicated cactus or succulent mix—or opting for a gritty inorganic substrate—ensures continuous air pockets around the root zone.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold text-stone-900 tracking-tight mb-3">
            Three Vital Soil Metrics to Verify Before Purchasing
          </h3>
          <p className="mb-3">
            If you are evaluating commercial succulent mixes at a garden center or nursery, check the packaging and ingredient list for these critical physical characteristics:
          </p>
          <ul className="space-y-2.5 list-disc pl-5">
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
        </div>

        {/* University Extension Citation Callout */}
        <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100 flex gap-3.5 my-6">
          <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-950 leading-relaxed">
            <strong>Horticultural Extension Reference:</strong> Research published by the{' '}
            <a
              href="https://edis.ifas.ufl.edu/publication/EP027"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-bold hover:text-emerald-900"
            >
              University of Florida IFAS Extension (Sansevieria Production Guide)
            </a>{' '}
            confirms that porous, well-aerated potting media is essential for <em>Sansevieria</em> root vigor. Fast-draining substrates prevent the anaerobic environment where fungal root pathogens thrive.
          </div>
        </div>

        {/* Internal Linking & Related Guides Section */}
        <div className="border-t border-stone-200 pt-6 mt-8 space-y-3">
          <h4 className="text-sm font-bold text-stone-900">Related Snake Plant Guides</h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            Prefer to mix your own soil at home? Follow our step-by-step{' '}
            <a 
              href="/diy-snake-plant-soil-mix"
              onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('diy-mix'); } }}
              className="text-emerald-800 font-bold underline hover:text-emerald-950 focus:outline-none cursor-pointer"
            >
              DIY Snake Plant Soil Mix Recipe
            </a>{' '}
            with our custom batch calculator. If your plant is suffering from soggy soil or mushy leaves, consult our emergency{' '}
            <a 
              href="/snake-plant-root-rot-guide"
              onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('root-rot'); } }}
              className="text-rose-700 font-bold underline hover:text-rose-900 focus:outline-none cursor-pointer"
            >
              Snake Plant Root Rot Guide
            </a>{' '}
            for immediate rescue steps. For pot material and drainage advice, explore our{' '}
            <a 
              href="/best-pots-for-snake-plants"
              onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('best-pots'); } }}
              className="text-emerald-800 font-bold underline hover:text-emerald-950 focus:outline-none cursor-pointer"
            >
              Best Pots for Snake Plants
            </a>.
          </p>
        </div>

        <TopicalClusterNav currentTab="best-soil" onNavigate={onNavigate} />
      </section>

    </article>
  );
}
