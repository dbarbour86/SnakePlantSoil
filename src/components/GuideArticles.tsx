import { useState } from 'react';
import { 
  Trees, Beaker, HeartPulse, Layers, Compass, 
  HelpCircle, ChevronRight, Check, AlertCircle, Info,
  Search, Sliders, Droplet, Sun, Wind, Thermometer,
  ShieldCheck, RefreshCw, AlertTriangle, ArrowRight,
  ShoppingBag, ExternalLink
} from 'lucide-react';
import InteractiveCalculator from './InteractiveCalculator';

export interface ArticleProps {
  onNavigate?: (tab: string) => void;
}

const CLUSTER_STEPS = [
  { id: 'best-soil', title: '1. Best Soils', desc: 'Evaluating pre-mixes' },
  { id: 'diy-mix', title: '2. DIY Mix', desc: 'The 3-2-1 recipe' },
  { id: 'root-rot', title: '3. Root Rot', desc: 'Surgical rescue' },
  { id: 'care-guide', title: '4. Watering', desc: 'Soak & dry manual' },
  { id: 'best-pots', title: '5. Best Pots', desc: 'Terracotta science' },
  { id: 'setup-kits', title: '6. Repotting Kit', desc: 'Custom shop builder' }
];

export function TopicalClusterNav({ currentTab, onNavigate }: { currentTab: string; onNavigate?: (tab: string) => void }) {
  if (!onNavigate) return null;
  return (
    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 mt-12 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5 mt-0">
            <Compass className="w-4.5 h-4.5 text-emerald-800" /> Complete Snake Plant Cultivation Journey
          </h4>
          <p className="text-[11px] text-stone-500 mt-0.5">
            Greenhouse-verified topical cluster map. Tap any step to skip directly to other core guides:
          </p>
        </div>
        <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-150 shrink-0 w-max">
          Topical Cluster Map
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 pt-2">
        {CLUSTER_STEPS.map((step) => {
          const isActive = step.id === currentTab;
          return (
            <button
              key={step.id}
              onClick={() => onNavigate(step.id)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                isActive
                  ? 'border-emerald-800 bg-emerald-50/45 text-stone-900 shadow-xs ring-1 ring-emerald-800/35'
                  : 'border-stone-200 bg-white hover:border-emerald-800/30 text-stone-700'
              }`}
              id={`cluster-step-${step.id}`}
            >
              <span className={`text-[11px] font-bold ${isActive ? 'text-emerald-805' : 'text-stone-900'}`}>
                {step.title}
              </span>
              <span className="text-[9px] text-stone-400 mt-1 leading-tight">
                {step.desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// SUBMODULE 1: BEST COMMERCIAL SOILS PAGE
// ----------------------------------------------------
export function BestSoilArticle({ onNavigate }: ArticleProps) {
  const comparisonData = [
    { name: "Hoffman Organic Succulent", base: "Organic peat & sand base", aeration: "Perlite & limestone", drainage: "Faster drying", retention: "Moderate", verdict: "Convenient ready-to-use commercial option." },
    { name: "Espoma Organic Cactus Mix", base: "Peat humus & organic base", aeration: "Perlite & Myco-tone", drainage: "Moderate drying", retention: "Moderate-High", verdict: "Organic bio-active formula; requires thorough dry periods." },
    { name: "Bonsai Jack Gritty Mix #111", base: "Calcined clay & pine bark", aeration: "Coarse pumice grit", drainage: "Very fast drying", retention: "Low", verdict: "Mineral-dominant mix for humid homes or rot recovery." },
    { name: "Unamended Standard Potting Soil", base: "Fine sphagnum peat moss", aeration: "Low (compacts easily)", drainage: "Slow drying", retention: "High", verdict: "⚠️ Retains water too long; amend with perlite before using." }
  ];

  return (
    <article className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-6">
      
      {/* Intro Header */}
      <div className="bg-gradient-to-br from-emerald-50 to-stone-100 p-6 rounded-2xl border border-stone-200 mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-stone-900 tracking-tight mt-0 flex items-center gap-2">
          <Trees className="w-6 h-6 text-emerald-800" />
          Best Soil for Snake Plants: Commercial Mixes &amp; Buyer's Guide
        </h1>
        <p className="text-stone-600 text-sm mt-2 mb-0">
          Find the right ready-made soil mix for your snake plant, compare popular commercial options, and learn key drainage ingredients to keep root systems healthy.
        </p>
      </div>

      {/* Direct Quick Answer Callout */}
      <div className="bg-emerald-50/80 border border-emerald-200/80 p-5 rounded-2xl text-stone-700 text-sm leading-relaxed mb-6" id="quick-answer-box">
        <h3 className="font-bold text-emerald-950 text-base mt-0 mb-1 flex items-center gap-2">
          <span>🌱 Quick Answer</span>
        </h3>
        <p className="m-0 text-stone-800">
          For most snake plants, a loose, fast-draining cactus or succulent potting mix is a practical starting point. Look for mixes containing coarse aeration materials such as perlite or pumice, and avoid dense mixes that remain wet around the roots for long periods.
        </p>
      </div>

      {/* User Intent Navigation Bar */}
      <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl mb-8">
        <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase tracking-wider block mb-2">Explore Your Soil Options</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-sans">
          <a
            href="#commercial-comparison"
            className="p-2.5 bg-white border border-stone-200 rounded-lg font-bold text-stone-800 hover:text-emerald-800 hover:border-emerald-300 text-center transition-all flex flex-col justify-center items-center gap-0.5"
            id="intent-link-commercial"
          >
            <span>Compare Commercial Soils</span>
            <span className="text-[10px] font-mono font-normal text-stone-400">See ready-made mixes</span>
          </a>
          <a
            href="/diy-snake-plant-soil-mix"
            onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('diy-mix'); } }}
            className="p-2.5 bg-white border border-stone-200 rounded-lg font-bold text-stone-800 hover:text-emerald-800 hover:border-emerald-300 text-center transition-all flex flex-col justify-center items-center gap-0.5"
            id="intent-link-diy"
          >
            <span>DIY Snake Plant Soil Mix</span>
            <span className="text-[10px] font-mono font-normal text-stone-400">3-2-1 recipe &amp; calculator</span>
          </a>
          <a
            href="/snake-plant-root-rot-guide"
            onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('root-rot'); } }}
            className="p-2.5 bg-white border border-stone-200 rounded-lg font-bold text-stone-800 hover:text-emerald-800 hover:border-emerald-300 text-center transition-all flex flex-col justify-center items-center gap-0.5"
            id="intent-link-rot"
          >
            <span>Snake Plant Root Rot Guide</span>
            <span className="text-[10px] font-mono font-normal text-stone-400">Rot rescue protocol</span>
          </a>
          <a
            href="/soil-diagnosis"
            onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('setup-kits'); } }}
            className="p-2.5 bg-white border border-stone-200 rounded-lg font-bold text-stone-800 hover:text-emerald-800 hover:border-emerald-300 text-center transition-all flex flex-col justify-center items-center gap-0.5"
            id="intent-link-diagnosis"
          >
            <span>Check My Snake Plant Soil</span>
            <span className="text-[10px] font-mono font-normal text-stone-400">Soil diagnostic quiz</span>
          </a>
        </div>
      </div>

      <h2 className="text-lg font-bold text-stone-900 mt-6">What Kind of Soil Do Snake Plants Need?</h2>
      <p>
        In their natural habitats across tropical West Africa, snake plants (<em>Sansevieria trifasciata</em>) grow in gritty, porous soils that drain quickly after rain. Snake plants store water in their thick, upright leaves and underground <strong>rhizomes</strong>. Because these storage organs hold moisture for weeks, snake plant roots are susceptible to rotting if left in stagnant water.
      </p>
      <p>
        Good snake plant soil must balance rapid drainage with enough moisture retention to support the roots. Standard all-purpose potting soil contains high proportions of fine peat moss, which can compact over time and remain wet for too long indoors. Selecting a commercial cactus or succulent mix—or amending standard soil with coarse grit—ensures air pockets remain open around the roots.
      </p>

      {/* Attributes Comparison */}
      <div className="my-8" id="commercial-comparison">
        <h3 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-emerald-800" />
          Commercial Soil Options Comparison
        </h3>
        <div className="overflow-x-auto border border-stone-200 rounded-xl shadow-sm bg-white">
          <table className="min-w-full divide-y divide-stone-200 text-sm">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-stone-900 uppercase tracking-wider text-[11px]">Commercial Mix Option</th>
                <th className="px-4 py-3 text-left font-bold text-stone-900 uppercase tracking-wider text-[11px]">Base Composition</th>
                <th className="px-4 py-3 text-left font-bold text-stone-900 uppercase tracking-wider text-[11px]">Aeration Media</th>
                <th className="px-4 py-3 text-left font-bold text-stone-900 uppercase tracking-wider text-[11px]">Drying Characteristics</th>
                <th className="px-4 py-3 text-left font-bold text-stone-900 uppercase tracking-wider text-[11px]">Best Use / Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {comparisonData.map((soil, idx) => (
                <tr key={idx} className={soil.name.includes("Unamended") ? "bg-amber-50/40 hover:bg-amber-50" : "hover:bg-stone-50"}>
                  <td className="px-4 py-3 font-semibold text-stone-900">{soil.name}</td>
                  <td className="px-4 py-3 text-stone-600 text-xs">{soil.base}</td>
                  <td className="px-4 py-3 text-stone-600 text-xs">{soil.aeration}</td>
                  <td className="px-4 py-3 font-mono text-xs text-emerald-850 font-bold">{soil.drainage}</td>
                  <td className="px-4 py-3 text-xs text-stone-600 italic">{soil.verdict}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <h3 className="text-lg font-bold text-stone-900">Three Vital Soil Metrics to Verify Before Purchasing</h3>
      <p>
        If you are analyzing commercial succulent options at your local nursery, flip the bag over and audit the ingredients panel. The formula should conform to the following properties:
      </p>
      <ul className="space-y-2 list-disc pl-5">
        <li>
          <strong>The Grain Ratio:</strong> The mix should feel grainy. If you squeeze a handful of moist soil, it should instantly fall apart when you release your hand. If it retains a firm ball shape, it has too much clay/peat.
        </li>
        <li>
          <strong>Mineral Amendment Content:</strong> Reliable mixes specify high percentages of inert volcanic media—look for <em>perlite</em>, <em>pumice</em>, or <em>expanded shale</em>. These white or gray nuggets provide physical structure.
        </li>
        <li>
          <strong>Absence of Huge Forest Logs:</strong> Many cheap compost blends use un-composted softwood lumber chips which mold easily container-side, inviting fungus gnats and shifting soil pH acidically.
        </li>
      </ul>

      {/* Sourced University Extension Citation Callout */}
      <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex gap-3 my-6">
        <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-900 leading-relaxed">
          <strong>Horticultural Extension Reference:</strong> Research published by the{' '}
          <a
            href="https://edis.ifas.ufl.edu/publication/EP027"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-bold hover:text-emerald-950"
          >
            University of Florida IFAS Extension (Sansevieria Production Guide)
          </a>{' '}
          recommends porous, well-draining potting media with good aeration for commercial and indoor <em>Sansevieria</em> cultivation. Soil mixes should allow water to pass through cleanly to prevent anaerobic pathogen development around rhizomes.
        </div>
      </div>

      <h3 className="text-lg font-bold text-stone-900">Selecting the Right Soil Mix</h3>
      <p>
        For most home environments, selecting a dedicated commercial mix like <strong>Espoma Organic Cactus Mix</strong> or <strong>Hoffman Succulent Soil</strong> provides a convenient, well-buffered foundation. If growing in humid conditions or plastic pots, amending with extra perlite or pumice provides additional airflow.
      </p>

      {/* Inline Recommended Soils Grid */}
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 my-8 space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-bold text-stone-900 mt-0 flex items-center gap-1.5 uppercase tracking-wide">
            <ShoppingBag className="w-4.5 h-4.5 text-emerald-805" /> Recommended Commercial Mixes &amp; Ingredients
          </h4>
          <span className="text-[10px] font-mono font-bold text-stone-400 italic">Affiliate Referral</span>
        </div>
        <p className="text-xs text-stone-550 leading-relaxed mb-0">
          These commercial soil options and amendments are widely used for potting indoor snake plants:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          
          <div className="bg-white p-4 rounded-lg border border-stone-200 flex flex-col justify-between text-xs hover:border-emerald-800/30 transition-all shadow-xs">
            <div className="space-y-1.5">
              <span className="text-[9px] font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded uppercase border border-emerald-150">Hoffman Premium</span>
              <strong className="block text-stone-900 font-bold">Organic Cactus &amp; Succulent Mix</strong>
              <p className="text-[11px] text-stone-500 leading-relaxed">Ready to use out of the box. Provides an excellent peat-neutral and limestone buffered sandy foundation.</p>
            </div>
            <a 
              href="https://www.amazon.com/s?k=Hoffman+Organic+Cactus+and+Succulent+Soil+Mix&tag=snakeplantsoi-20" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center justify-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2 px-3 rounded text-[10px] uppercase font-sans transition-all"
            >
              <span>Get on Amazon</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="bg-white p-4 rounded-lg border border-stone-200 flex flex-col justify-between text-xs hover:border-emerald-800/30 transition-all shadow-xs">
            <div className="space-y-1.5">
              <span className="text-[9px] font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded uppercase border border-emerald-150">Espoma Organic</span>
              <strong className="block text-stone-900 font-bold">Cactus &amp; Succulent Soil Mix</strong>
              <p className="text-[11px] text-stone-500 leading-relaxed">Infused with active Myco-tone microbes that promote extensive cellular root nutrient and water transport networks.</p>
            </div>
            <a 
              href="https://www.amazon.com/s?k=Espoma+Organic+Cactus+and+Succulent+Soil+Mix&tag=snakeplantsoi-20" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center justify-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2 px-3 rounded text-[10px] uppercase font-sans transition-all"
            >
              <span>Get on Amazon</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>
      </div>

      {/* Internal Linking & Related Guides Section */}
      <div className="border-t border-stone-250/60 pt-6 mt-10 space-y-3">
        <h4 className="text-sm font-bold text-stone-900 mt-0">Related Snake Plant Guides</h4>
        <p className="text-xs text-stone-600 leading-relaxed mt-1">
          Looking to mix your own custom soil at home? Follow our step-by-step{' '}
          <a 
            href="/diy-snake-plant-soil-mix"
            onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('diy-mix'); } }}
            className="text-emerald-805 font-bold underline hover:text-emerald-950 focus:outline-none cursor-pointer"
          >
            DIY Snake Plant Soil Mix Recipe
          </a>{' '}
          with our custom volume calculator. If your plant is showing soft, yellowing leaves or root damage, consult our emergency{' '}
          <a 
            href="/snake-plant-root-rot-guide"
            onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('root-rot'); } }}
            className="text-rose-700 font-bold underline hover:text-rose-900 focus:outline-none cursor-pointer"
          >
            Snake Plant Root Rot Guide
          </a>{' '}
          for step-by-step root recovery. For guidance on pot selection, read our guide on the{' '}
          <a 
            href="/best-pots-for-snake-plants"
            onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('best-pots'); } }}
            className="text-emerald-805 font-bold underline hover:text-emerald-950 focus:outline-none cursor-pointer"
          >
            Best Pots for Snake Plants
          </a>.
        </p>
      </div>

      <TopicalClusterNav currentTab="best-soil" onNavigate={onNavigate} />

    </article>
  );
}


// ----------------------------------------------------
// SUBMODULE 2: DIY SNAKE PLANT SOIL MIX PAGE
// ----------------------------------------------------
export function DIYMixArticle({ onNavigate }: ArticleProps) {
  return (
    <article className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-6">
      
      <div className="bg-gradient-to-br from-emerald-50 to-stone-100 p-6 rounded-2xl border border-stone-200 mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-stone-900 tracking-tight mt-0 flex items-center gap-2">
          <Beaker className="w-6 h-6 text-emerald-800" />
          The Ultimate Golden Ratio 3-2-1 DIY Soil Recipe
        </h1>
        <p className="text-stone-600 text-sm mt-2 mb-0">
          Save money and give your plants professional premium drainage. Follow our tested, highly-replicated formula to blend your own sterile custom substrate at home.
        </p>
      </div>

      <p>
        If you have more than three plants, buying specialized small bags of boutique succulent soil becomes highly expensive. Mixing your own substrate is incredibly rewarding, clean, and allows you to custom-calibrate weights for tall, top-heavy leaves.
      </p>

      <h3 className="text-lg font-bold text-stone-900">Our Classical Blueprint: The 3-2-1 Recipe</h3>
      <p>
        Through years of commercial propagation, botanical gardens rely on what we call the <strong>3-2-1 Formula</strong>. This easy-to-remember parts-based method guarantees spectacular results:
      </p>

      {/* Golden Ratio Presentation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
        <div className="bg-stone-50 border border-stone-200 p-5 rounded-xl text-center shadow-xs">
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 font-bold text-sm flex items-center justify-center mx-auto mb-2">3x</div>
          <h4 className="font-bold text-stone-900 text-sm mb-1">Standard Potting Soil</h4>
          <p className="text-xs text-stone-500">Provides basic organic nutrition and moisture anchoring.</p>
        </div>
        <div className="bg-stone-50 border border-stone-200 p-5 rounded-xl text-center shadow-xs">
          <div className="w-10 h-10 rounded-full bg-slate-200 text-stone-800 font-bold text-sm flex items-center justify-center mx-auto mb-2">2x</div>
          <h4 className="font-bold text-stone-900 text-sm mb-1">Horticultural Perlite</h4>
          <p className="text-xs text-stone-500">Volcanic glass that keeps the mix lightweight & airy.</p>
        </div>
        <div className="bg-stone-50 border border-stone-200 p-5 rounded-xl text-center shadow-xs">
          <div className="w-10 h-10 rounded-full bg-yellow-100 text-amber-950 font-bold text-sm flex items-center justify-center mx-auto mb-2 font-mono">1x</div>
          <h4 className="font-bold text-stone-900 text-sm mb-1">Coarse Silica Sand</h4>
          <p className="text-xs text-stone-500">Adds gravity drainage speed and heavy base weight.</p>
        </div>
      </div>

      <h3 className="text-lg font-bold text-stone-900 mt-8 mb-4">Run Live Soil Mix Simulations</h3>
      <p>
        Use our interactive calculator below to adjust dry component volumes and check calculated scores dynamically before mixing:
      </p>
      
      {/* Interactive Soil mix Simulator Embed */}
      <div className="my-6">
        <InteractiveCalculator />
      </div>

      <h3 className="text-lg font-bold text-stone-900 mt-10">Step-by-Step DIY Preparation Method</h3>
      <ol className="space-y-3 list-decimal pl-5 text-sm">
        <li>
          <strong>Gather Your Measuring Cup:</strong> Any scoop container will work. A standard plastic nursery pot makes an ideal volumetric "part" cup.
        </li>
        <li>
          <strong>Sift out wood chips:</strong> Dump your base standard potting soil through a metal kitchen mesh if it contains huge logs. This retains fine clean particles.
        </li>
        <li>
          <strong>Blend dry:</strong> In a large clean bucket, add 3 scoops of potting soil, 2 scoops of perlite, and 1 scoop of coarse sand. Stir carefully with a hand trowel.
        </li>
        <li>
          <strong>Dampen slightly:</strong> Mist the dry mix with clean water before repotting. This suppresses any perlite dust and creates a comfortable, ready humidity.
        </li>
      </ol>

      <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 text-xs text-amber-900 my-6">
        <strong>⚠️ Crucial warning:</strong> Never use fine playground sand or beach sand. Fine-grained play sand fills soil channels completely, cementing together like mortar when mixed with compost, choking roots immediately.
      </div>

      {/* Recommended Silica Sand card */}
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 text-xs">
        <div className="flex-grow space-y-1">
          <span className="text-[9px] font-mono font-bold text-amber-850 bg-amber-50 px-1.5 py-0.5 rounded uppercase border border-amber-200">Recommended Amendment</span>
          <h4 className="font-bold text-stone-900 text-xs mt-1 mb-0 flex items-center gap-1">
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-800" /> Perfect Plants Coarse Horticultural Sand
          </h4>
          <p className="text-[11px] text-stone-550 leading-relaxed mb-0">
            Washed and coarse-grained silica sand explicitly sized to create permanent channel voids for gravity water flow. Heavy anchor weight prevents tall plants from leaning.
          </p>
        </div>
        <a 
          href="https://www.amazon.com/s?k=Coarse+Horticultural+Silica+Sand+Perfect+Plants&tag=snakeplantsoi-20" 
          target="_blank" 
          rel="noopener noreferrer"
          className="shrink-0 bg-stone-900 hover:bg-emerald-800 text-white font-bold py-2 px-4 rounded font-sans uppercase tracking-wide text-[10px] flex items-center gap-1.5 transition-all shadow-xs"
        >
          <span>Get Sand on Amazon</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Internal Linking Topical Cluster Section */}
      <div className="border-t border-stone-250/60 pt-6 mt-10">
        <h4 className="text-sm font-bold text-stone-900 mt-0">Next Steps in the Soil Cluster</h4>
        <p className="text-xs text-stone-600 leading-relaxed mt-1">
          Even with the perfect soil mix, overwatering and lack of aeration can quickly lead to root decay. Bypass traditional care and jump straight to our{' '}
          <button 
            onClick={() => onNavigate?.('root-rot')} 
            className="text-rose-700 font-bold underline hover:text-rose-900 focus:outline-none cursor-pointer"
          >
            Surgical Root Rot Diagnostics & Rescue Guide
          </button>{' '}
          to learn how to trim decaying root tissues, or check out our comprehensive{' '}
          <button 
            onClick={() => onNavigate?.('care-guide')} 
            className="text-emerald-805 font-bold underline hover:text-emerald-950 focus:outline-none cursor-pointer"
          >
            Seasonal Watering & Care Manual
          </button>{' '}
          to master the "soak-and-dry" container cycle.
        </p>
      </div>

      <TopicalClusterNav currentTab="diy-mix" onNavigate={onNavigate} />

    </article>
  );
}


// ----------------------------------------------------
// SUBMODULE 3: SNAKE PLANT ROOT ROT DIAGNOSTIC GUIDE
// ----------------------------------------------------
export function RootRotArticle({ onNavigate }: ArticleProps) {
  const [symptoms, setSymptoms] = useState({
    drooping: false,
    yellow: false,
    mushyBase: false,
    smell: false,
    soilSoggy: false
  });

  const getSymptomCount = () => {
    return Object.values(symptoms).filter(Boolean).length;
  };

  const getTriageResult = () => {
    const count = getSymptomCount();
    if (count === 0) return { title: "Healthy Foliage — Low Rot Risk", color: "text-emerald-700", bg: "bg-emerald-50", desc: "No immediate symptoms of root decay detected. Maintain a regular dry-down cycle between waterings as standard upkeep." };
    if (count <= 2) return { title: "Early Moisture Stress — Recovery Potential High", color: "text-yellow-750", bg: "bg-yellow-50", desc: "Minor moisture overload detected. Cease watering immediately and allow the soil column to dry out completely throughout the root zone before watering again." };
    if (count <= 4) return { title: "Active Rot Suspected — Immediate Care Needed", color: "text-orange-700", bg: "bg-orange-50", desc: "Root decay is likely progressing. Unpot the plant, inspect the root system, prune away dark mushy tissue with disinfected tools, allow cut surfaces to dry, and repot in fresh fast-draining mix." };
    return { title: "Severe Damage — Leaf Propagation Recommended", color: "text-rose-700", bg: "bg-rose-50", desc: "Extensive root system breakdown. If no firm rhizome tissue remains, cut firm, healthy leaf sections well above any discolored areas to propagate new plants in fresh, well-aerated media." };
  };

  const triage = getTriageResult();

  return (
    <article className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-6">
      
      {/* Intro Header */}
      <div className="bg-gradient-to-br from-rose-50 to-stone-100 p-6 rounded-2xl border border-rose-150 mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-rose-950 tracking-tight mt-0 flex items-center gap-2">
          <HeartPulse className="w-6 h-6 text-rose-700 shrink-0" />
          Snake Plant Root Rot: Symptoms, Treatment &amp; Recovery
        </h1>
        <p className="text-stone-600 text-sm mt-2 mb-0">
          Learn how to recognize snake plant root rot, remove badly damaged tissue, repot viable roots or rhizomes, and correct the moisture conditions that caused the problem.
        </p>
      </div>

      {/* Direct Quick Answer Callout */}
      <div className="bg-emerald-50/80 border border-emerald-200/80 p-5 rounded-2xl text-stone-700 text-sm leading-relaxed mb-6" id="quick-answer-box">
        <h3 className="font-bold text-emerald-950 text-base mt-0 mb-1 flex items-center gap-2">
          <span>🌱 Quick Answer</span>
        </h3>
        <p className="m-0 text-stone-800">
          Snake plant root rot is commonly associated with persistently wet, poorly aerated growing media. Affected roots or rhizomes may become soft, dark, discolored, or deteriorated. Recovery usually involves removing the plant from wet soil, trimming clearly damaged tissue with clean tools, repotting viable tissue in fresh fast-draining mix, and correcting future watering conditions.
        </p>
      </div>

      {/* User Intent Navigation Bar */}
      <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl mb-8">
        <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase tracking-wider block mb-2">Root Rot Navigation &amp; Care Guides</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-sans">
          <a
            href="#diagnosis-section"
            className="p-2.5 bg-white border border-stone-200 rounded-lg font-bold text-stone-800 hover:text-emerald-800 hover:border-emerald-300 text-center transition-all flex flex-col justify-center items-center gap-0.5"
            id="intent-link-diagnosis-section"
          >
            <span>Confirm Symptoms</span>
            <span className="text-[10px] font-mono font-normal text-stone-400">Rot vs other causes</span>
          </a>
          <a
            href="/diy-snake-plant-soil-mix"
            onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('diy-mix'); } }}
            className="p-2.5 bg-white border border-stone-200 rounded-lg font-bold text-stone-800 hover:text-emerald-800 hover:border-emerald-300 text-center transition-all flex flex-col justify-center items-center gap-0.5"
            id="intent-link-diy-mix"
          >
            <span>DIY Soil Recipe</span>
            <span className="text-[10px] font-mono font-normal text-stone-400">3-2-1 fast-draining soil</span>
          </a>
          <a
            href="/best-snake-plant-soil"
            onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('best-soil'); } }}
            className="p-2.5 bg-white border border-stone-200 rounded-lg font-bold text-stone-800 hover:text-emerald-800 hover:border-emerald-300 text-center transition-all flex flex-col justify-center items-center gap-0.5"
            id="intent-link-best-soil"
          >
            <span>Best Commercial Soil</span>
            <span className="text-[10px] font-mono font-normal text-stone-400">Compare pre-made mixes</span>
          </a>
          <a
            href="/best-pots-for-snake-plants"
            onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('best-pots'); } }}
            className="p-2.5 bg-white border border-stone-200 rounded-lg font-bold text-stone-800 hover:text-emerald-800 hover:border-emerald-300 text-center transition-all flex flex-col justify-center items-center gap-0.5"
            id="intent-link-pots"
          >
            <span>Breathable Pots</span>
            <span className="text-[10px] font-mono font-normal text-stone-400">Terracotta &amp; drainage</span>
          </a>
        </div>
      </div>

      <h2 className="text-lg font-bold text-stone-900 mt-6" id="diagnosis-section">Diagnosing Snake Plant Root Rot vs. Other Leaf Problems</h2>
      <p>
        Because snake plants store water in their thick leaves and rhizomes, underground root damage does not always appear immediately on the surface. However, yellowing or drooping leaves alone do not prove a plant has root rot. Before taking drastic action, confirm whether the underlying root system is actually affected.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-rose-50/60 border border-rose-200 p-4 rounded-xl space-y-2">
          <h3 className="text-sm font-bold text-rose-950 mt-0 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-700" /> Primary Indicators of Root Rot
          </h3>
          <ul className="text-xs text-stone-700 space-y-1.5 pl-4 list-disc mb-0">
            <li><strong>Persistently wet soil:</strong> Soil remains damp or cold weeks after the last watering.</li>
            <li><strong>Soft, translucent leaf bases:</strong> The lower stem near the soil line is mushy or brown.</li>
            <li><strong>Deteriorated root tissue:</strong> Roots appear dark brown or black, slimy, hollow, or slough off easily.</li>
            <li><strong>Foul odor:</strong> A noticeable sour or decaying smell emanates from the root zone.</li>
            <li><strong>Crown collapse:</strong> Stems lean sharply outward from a mushy or unstable base.</li>
          </ul>
        </div>

        <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-2">
          <h3 className="text-sm font-bold text-stone-900 mt-0 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-stone-600" /> Alternative Non-Rot Causes
          </h3>
          <ul className="text-xs text-stone-700 space-y-1.5 pl-4 list-disc mb-0">
            <li><strong>Underwatering:</strong> Leaves may wrinkle or feel leathery, but roots remain dry, firm, and fibrous.</li>
            <li><strong>Cold Draft Injury:</strong> Cold air exposure below 50°F causes water-soaked, soft spots without wet soil overload.</li>
            <li><strong>Physical Damage:</strong> Bent or cracked leaf blades while root bases remain firm and green.</li>
            <li><strong>Normal Aging:</strong> Single oldest outer leaf yellowing slowly while inner leaves remain firm.</li>
          </ul>
        </div>
      </div>

      {/* Interactive Symptom Checker */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs my-6">
        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5 uppercase tracking-wide mt-0 mb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-800" /> Root Rot Symptom Assessment Tool
        </h3>
        <p className="text-xs text-stone-500 mb-4">
          Select any physical symptoms currently present on your snake plant to evaluate potential root condition:
        </p>

        <div className="space-y-2.5">
          <label className="flex items-center gap-3 text-xs text-stone-700 cursor-pointer p-2 rounded hover:bg-stone-50 select-none">
            <input 
              type="checkbox" 
              checked={symptoms.drooping} 
              onChange={() => setSymptoms(s => ({...s, drooping: !s.drooping}))}
              className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-700 border-stone-300"
            />
            <span>Leaves are falling outward or bending limply instead of standing upright</span>
          </label>
          <label className="flex items-center gap-3 text-xs text-stone-700 cursor-pointer p-2 rounded hover:bg-stone-50 select-none">
            <input 
              type="checkbox" 
              checked={symptoms.yellow} 
              onChange={() => setSymptoms(s => ({...s, yellow: !s.yellow}))}
              className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-700 border-stone-300"
            />
            <span>Leaves are fading to pale lime-green or displaying splotchy yellowing</span>
          </label>
          <label className="flex items-center gap-3 text-xs text-stone-700 cursor-pointer p-2 rounded hover:bg-stone-50 select-none">
            <input 
              type="checkbox" 
              checked={symptoms.mushyBase} 
              onChange={() => setSymptoms(s => ({...s, mushyBase: !s.mushyBase}))}
              className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-700 border-stone-300"
            />
            <span>Leaf bases near the soil line feel soft, soggy, or dark brown when touched</span>
          </label>
          <label className="flex items-center gap-3 text-xs text-stone-700 cursor-pointer p-2 rounded hover:bg-stone-50 select-none">
            <input 
              type="checkbox" 
              checked={symptoms.smell} 
              onChange={() => setSymptoms(s => ({...s, smell: !s.smell}))}
              className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-700 border-stone-300"
            />
            <span>The root zone or soil emits a sour or decaying odor</span>
          </label>
          <label className="flex items-center gap-3 text-xs text-stone-700 cursor-pointer p-2 rounded hover:bg-stone-50 select-none">
            <input 
              type="checkbox" 
              checked={symptoms.soilSoggy} 
              onChange={() => setSymptoms(s => ({...s, soilSoggy: !s.soilSoggy}))}
              className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-700 border-stone-300"
            />
            <span>Soil remains cold and wet weeks after the last watering</span>
          </label>
        </div>

        {/* Triage Calculator Output */}
        <div className={`mt-6 p-4 rounded-xl border ${triage.bg} transition-all duration-300`}>
          <span className="text-[10px] font-mono font-bold tracking-widest text-stone-400 uppercase block mb-1">Assessment Output</span>
          <h4 className={`font-bold text-sm my-0 ${triage.color}`}>{triage.title}</h4>
          <p className="text-xs text-stone-650 leading-relaxed mt-2 mb-0">{triage.desc}</p>
        </div>
      </div>

      <h2 className="text-lg font-bold text-stone-900 mt-6">Step-by-Step Root Rot Recovery Protocol</h2>
      <p>
        If your snake plant shows clear signs of root decay, leaving it in waterlogged soil will allow damage to progress. Follow these practical steps to inspect and care for the root system:
      </p>

      <div className="space-y-5 my-6">
        <div className="flex gap-3 bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</div>
          <div className="space-y-1">
            <strong className="text-sm text-stone-900 block">Remove Plant from Wet Soil &amp; Inspect Roots</strong>
            <p className="text-xs text-stone-650 leading-relaxed m-0">
              Gently slide the snake plant out of its pot. Remove loose wet soil from around the root ball to inspect the rhizomes and roots. If soil is heavily compacted, optional gentle rinsing with lukewarm water can help expose underground structures for visual inspection.
            </p>
          </div>
        </div>

        <div className="flex gap-3 bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</div>
          <div className="space-y-1">
            <strong className="text-sm text-stone-900 block">Prune Damaged Tissue with Clean Tools</strong>
            <p className="text-xs text-stone-650 leading-relaxed m-0">
              Disinfect sharp pruning shears using 70% or higher isopropyl alcohol to avoid introducing contaminants. Trim away clearly soft, black, slimy, or hollow root tissue back to firm, healthy white or orange root or rhizome material. Retain all firm, healthy tissue.
            </p>
          </div>
        </div>

        <div className="flex gap-3 bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</div>
          <div className="space-y-1">
            <strong className="text-sm text-stone-900 block">Allow Cut Surfaces to Air-Dry</strong>
            <p className="text-xs text-stone-650 leading-relaxed m-0">
              Allow freshly cut surfaces to dry in a warm, well-ventilated area before repotting when appropriate, rather than returning freshly cut tissue immediately to persistently wet media. This gives open wounds time to form a dry, protective callus.
            </p>
          </div>
        </div>

        <div className="flex gap-3 bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">4</div>
          <div className="space-y-1">
            <strong className="text-sm text-stone-900 block">Disinfect Container &amp; Repot in Fresh Soil</strong>
            <p className="text-xs text-stone-650 leading-relaxed m-0">
              If reusing a container, clean off soil debris and disinfect hard surfaces. A 10% household bleach solution (1 part bleach to 9 parts water) may be used for appropriate hard containers. Repot into a clean pot with functional drainage holes filled with fresh, fast-draining cactus/succulent potting mix. Do not reuse old, waterlogged soil.
            </p>
          </div>
        </div>

        <div className="flex gap-3 bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">5</div>
          <div className="space-y-1">
            <strong className="text-sm text-stone-900 block">Adjust Post-Repotting Water Management</strong>
            <p className="text-xs text-stone-650 leading-relaxed m-0">
              Do not soak the new soil immediately after repotting trimmed roots. Future watering should depend on medium dryness, root condition, pot material, temperature, light, and humidity, ensuring the plant is never returned to persistently wet conditions.
            </p>
          </div>
        </div>
      </div>

      {/* Authoritative Extension Citation Box */}
      <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex gap-3 my-6">
        <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-900 leading-relaxed">
          <strong>Horticultural Extension Guidance:</strong> For tool sanitation, university extensions recommend 70% or higher isopropyl alcohol on clean cutting blades. For reusable hard containers,{' '}
          <a
            href="https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-minnesota/how-clean-and-disinfect-gardening-tools-and-containers"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-bold hover:text-emerald-950"
          >
            University of Minnesota Extension
          </a>{' '}
          recommends scrubbing off organic soil debris and soaking hard containers in a 10% household bleach solution (1 part bleach to 9 parts water). 
          <em className="block mt-1 text-[11px] text-emerald-850 font-normal">
            Safety note: Use plain household bleach, follow label directions, never mix bleach with other household chemicals, rinse and dry pots thoroughly, and keep bleach solutions away from living plant tissue.
          </em>
        </div>
      </div>

      {/* Internal Linking Related Guides Section */}
      <div className="border-t border-stone-250/60 pt-6 mt-10 space-y-3">
        <h3 className="text-sm font-bold text-stone-900 mt-0">Related Snake Plant Guides</h3>
        <p className="text-xs text-stone-600 leading-relaxed mt-1">
          Looking for an optimal fast-draining potting soil? Mix your own using our step-by-step{' '}
          <a 
            href="/diy-snake-plant-soil-mix"
            onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('diy-mix'); } }}
            className="text-emerald-805 font-bold underline hover:text-emerald-950 focus:outline-none cursor-pointer"
          >
            DIY Snake Plant Soil Recipe (3-2-1 Ratio)
          </a>{' '}
          or compare popular pre-made options in our{' '}
          <a 
            href="/best-snake-plant-soil"
            onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('best-soil'); } }}
            className="text-emerald-805 font-bold underline hover:text-emerald-950 focus:outline-none cursor-pointer"
          >
            Best Soil for Snake Plants Buyer's Guide
          </a>. 
          To prevent future moisture buildup, choose breathable terracotta pots from our{' '}
          <a 
            href="/best-pots-for-snake-plants"
            onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('best-pots'); } }}
            className="text-emerald-805 font-bold underline hover:text-emerald-950 focus:outline-none cursor-pointer"
          >
            Best Pots for Snake Plants Guide
          </a>, 
          or evaluate your plant's setup using our interactive{' '}
          <a 
            href="/soil-diagnosis"
            onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('setup-kits'); } }}
            className="text-emerald-805 font-bold underline hover:text-emerald-950 focus:outline-none cursor-pointer"
          >
            Soil Diagnosis Quiz
          </a>.
        </p>
      </div>

      <TopicalClusterNav currentTab="root-rot" onNavigate={onNavigate} />

    </article>
  );
}


// ----------------------------------------------------
// SUBMODULE 4: BEST POTS FOR SNAKE PLANTS PAGE
// ----------------------------------------------------
export function BestPotsArticle({ onNavigate }: ArticleProps) {
  const [foliageHeight, setFoliageHeight] = useState<number>(12);
  const [currentPot, setCurrentPot] = useState<number>(6);

  const calculateTargetPot = () => {
    const recommendedDiameter = currentPot + 1;
    
    return {
      diameter: Math.max(4, Math.min(currentPot + 2, recommendedDiameter)),
      depth: Math.round(recommendedDiameter * 0.9),
      repotVerdict: foliageHeight > currentPot * 3.5 
        ? "Container Sizing Guidance: Your plant is tall and may become top-heavy. Stepping up 1 to 2 inches in pot diameter or choosing a heavy terracotta vessel will help stabilize the plant safely."
        : "Container Sizing Guidance: The size and weight of your current vessel are well-balanced for your plant height. No immediate container expansion needed unless roots are tightly bound."
    };
  };

  const potRec = calculateTargetPot();

  return (
    <article className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-6">
      
      {/* Intro Header */}
      <div className="bg-gradient-to-br from-emerald-50 to-stone-100 p-6 rounded-2xl border border-stone-200 mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-stone-950 tracking-tight mt-0 flex items-center gap-2">
          <Layers className="w-6 h-6 text-emerald-800 shrink-0" />
          Best Pots for Snake Plants: Size, Material &amp; Drainage Guide
        </h1>
        <p className="text-stone-600 text-sm mt-2 mb-0">
          Discover the best pots for snake plants. Compare terracotta, ceramic, and plastic containers, choose an appropriate pot size, and learn practical drainage rules.
        </p>
      </div>

      {/* Direct Quick Answer Callout */}
      <div className="bg-emerald-50/80 border border-emerald-200/80 p-5 rounded-2xl text-stone-700 text-sm leading-relaxed mb-6" id="quick-answer-box">
        <h3 className="font-bold text-emerald-950 text-base mt-0 mb-1 flex items-center gap-2">
          <span>🌱 Quick Answer</span>
        </h3>
        <p className="m-0 text-stone-800">
          A good snake plant pot has functional drainage and is appropriately sized for the plant's root system. Unglazed terracotta can help potting mix lose moisture through its porous walls, while plastic and glazed ceramic retain moisture differently and can also work well with appropriate soil and watering. Avoid unnecessarily oversized containers that leave a large volume of wet potting mix around a relatively small root system.
        </p>
      </div>

      {/* User Intent Navigation Bar */}
      <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl mb-8">
        <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase tracking-wider block mb-2">Pot Selection Navigation &amp; Care Guides</span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-sans">
          <a
            href="#sizing-calculator"
            className="p-2.5 bg-white border border-stone-200 rounded-lg font-bold text-stone-800 hover:text-emerald-800 hover:border-emerald-300 text-center transition-all flex flex-col justify-center items-center gap-0.5"
            id="intent-link-sizing-calculator"
          >
            <span>Choose Pot Size</span>
            <span className="text-[10px] font-mono font-normal text-stone-400">Sizing guide</span>
          </a>
          <a
            href="#material-comparison"
            className="p-2.5 bg-white border border-stone-200 rounded-lg font-bold text-stone-800 hover:text-emerald-800 hover:border-emerald-300 text-center transition-all flex flex-col justify-center items-center gap-0.5"
            id="intent-link-material-comparison"
          >
            <span>Compare Materials</span>
            <span className="text-[10px] font-mono font-normal text-stone-400">Terracotta vs ceramic</span>
          </a>
          <a
            href="#drainage-rules"
            className="p-2.5 bg-white border border-stone-200 rounded-lg font-bold text-stone-800 hover:text-emerald-800 hover:border-emerald-300 text-center transition-all flex flex-col justify-center items-center gap-0.5"
            id="intent-link-drainage-rules"
          >
            <span>Drainage Rules</span>
            <span className="text-[10px] font-mono font-normal text-stone-400">Holes &amp; gravel myth</span>
          </a>
          <a
            href="/best-snake-plant-soil"
            onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('best-soil'); } }}
            className="p-2.5 bg-white border border-stone-200 rounded-lg font-bold text-stone-800 hover:text-emerald-800 hover:border-emerald-300 text-center transition-all flex flex-col justify-center items-center gap-0.5"
            id="intent-link-best-soil"
          >
            <span>Best Soil Mixes</span>
            <span className="text-[10px] font-mono font-normal text-stone-400">Commercial mixes</span>
          </a>
          <a
            href="/diy-snake-plant-soil-mix"
            onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('diy-mix'); } }}
            className="p-2.5 bg-white border border-stone-200 rounded-lg font-bold text-stone-800 hover:text-emerald-800 hover:border-emerald-300 text-center transition-all flex flex-col justify-center items-center gap-0.5 col-span-2 sm:col-span-1"
            id="intent-link-diy-mix"
          >
            <span>DIY Soil Recipe</span>
            <span className="text-[10px] font-mono font-normal text-stone-400">3-2-1 recipe</span>
          </a>
        </div>
      </div>

      <h2 className="text-lg font-bold text-stone-900 mt-6" id="material-comparison">Comparing Pot Materials: Terracotta, Ceramic &amp; Plastic</h2>
      <p>
        Container materials interact directly with your potting soil, indoor humidity, temperature, and watering frequency. Choosing the right container material helps maintain balanced moisture levels for snake plant roots:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-6">
        <div className="p-4 rounded-xl border border-stone-200 bg-white shadow-xs space-y-2">
          <span className="text-xs font-bold text-emerald-800 font-mono block uppercase">1. Unglazed Terracotta (Porous Clay)</span>
          <p className="text-xs text-stone-650 leading-relaxed m-0">
            Porous unglazed clay allows moisture to transpire through container walls as well as from the surface, helping soil dry more evenly. The heavy weight of clay provides excellent stability for tall, upright foliage. However, soil may dry faster in arid environments, and natural mineral deposits (efflorescence) can form on outer walls over time.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-stone-200 bg-white shadow-xs space-y-2">
          <span className="text-xs font-bold text-amber-800 font-mono block uppercase">2. Glazed Ceramic</span>
          <p className="text-xs text-stone-650 leading-relaxed m-0">
            Glazed ceramic surfaces seal moisture inside, preventing wall evaporation so soil dries primarily from the top surface down. Glazed pots are heavy and stable, working very well when equipped with functional bottom drainage holes and paired with a fast-draining, well-aerated potting mix.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-stone-200 bg-white shadow-xs space-y-2">
          <span className="text-xs font-bold text-stone-600 font-mono block uppercase">3. Plastic Containers &amp; Liners</span>
          <p className="text-xs text-stone-650 leading-relaxed m-0">
            Plastic containers are lightweight, durable, inexpensive, and nonporous. They retain soil moisture longer than unglazed clay and allow easy unpotting for root inspection. Because lightweight plastic can tip under tall leaves, placing a plastic nursery pot inside a heavy decorative outer cachepot provides both drainage and stability.
          </p>
        </div>
      </div>

      <h2 className="text-lg font-bold text-stone-900 mt-6" id="sizing-calculator">How to Choose the Right Pot Size for a Snake Plant</h2>
      <p>
        Root-ball size and condition should take priority over foliage height when choosing the next container. Plant height is useful primarily for considering physical stability and tipping risk. Modest increases in container size are commonly used when repotting houseplants, but always inspect the root system, avoid unnecessarily large increases in soil volume, and consider your potting mix characteristics.
      </p>

      {/* Sizing Calculator Custom Visual Tool */}
      <div className="bg-stone-50 p-6 rounded-xl border border-stone-200 my-6" id="sizing-calculator-box">
        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5 uppercase tracking-wide mt-0 mb-3">
          <Sliders className="w-4 h-4 text-emerald-850" /> Suggested Pot Sizing Guide
        </h3>
        <p className="text-xs text-stone-500 mb-4">
          Adjust the sliders below to explore a suggested container diameter and depth starting point based on plant height and current pot size:
        </p>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Foliage Height from Soil Line:</span>
              <span className="font-mono text-emerald-800">{foliageHeight} inches</span>
            </div>
            <input 
              type="range" 
              min={4} 
              max={48} 
              value={foliageHeight} 
              onChange={(e) => setFoliageHeight(parseInt(e.target.value))}
              className="w-full accent-emerald-800 bg-stone-200"
              id="foliage-height-slider"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Current Pot Diameter:</span>
              <span className="font-mono text-emerald-800">{currentPot} inches</span>
            </div>
            <input 
              type="range" 
              min={3} 
              max={16} 
              value={currentPot} 
              onChange={(e) => setCurrentPot(parseInt(e.target.value))}
              className="w-full accent-emerald-800 bg-stone-200"
              id="current-pot-slider"
            />
          </div>
        </div>

        {/* Output */}
        <div className="bg-white border border-stone-200 p-4 rounded-xl mt-4 text-xs font-sans space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-stone-400 uppercase tracking-widest text-[9px] block">Suggested Pot Range</span>
              <span className="text-stone-900 font-bold text-sm block mt-0.5">{potRec.diameter} Inches</span>
              <span className="text-[10px] text-stone-500">Step up modestly (1–2") to match root mass expansion.</span>
            </div>
            <div>
              <span className="text-stone-400 uppercase tracking-widest text-[9px] block">Suggested Pot Depth</span>
              <span className="text-stone-900 font-bold text-sm block mt-0.5">{potRec.depth} Inches</span>
              <span className="text-[10px] text-stone-500">Moderate shallow depth matches horizontal rhizomes.</span>
            </div>
          </div>
          <div className="border-t border-stone-100 pt-2 text-stone-650 leading-relaxed text-[11px]">
            <strong>Sizing Advice:</strong> {potRec.repotVerdict}
          </div>
        </div>
      </div>

      <h2 className="text-lg font-bold text-stone-900 mt-6" id="drainage-rules">Practical Container Drainage Rules</h2>
      <ul className="space-y-3 list-decimal pl-5 text-sm">
        <li>
          <strong>Ensure Functional Bottom Drainage:</strong> Containers used for direct planting should allow excess irrigation water to escape through open drainage holes. Avoid planting directly into sealed vessels without drainage.
        </li>
        <li>
          <strong>The Gravel Layer Myth:</strong> Adding gravel or pebbles beneath potting mix in a container without a drainage hole does not substitute for real drainage. Instead, it creates a perched water table that holds saturated soil higher in the container, closer to early roots.
        </li>
        <li>
          <strong>Saucer &amp; Cachepot Care:</strong> After watering and allowing excess water to drain, do not leave the planted container standing in collected water in a saucer or decorative cachepot. If using a decorative outer pot without drainage, keep the plant in a draining nursery liner and empty any accumulated water from the cachepot after watering.
        </li>
      </ul>

      {/* Recommended Terracotta Pot card */}
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 text-xs my-6">
        <div className="flex-grow space-y-1">
          <span className="text-[9px] font-mono font-bold text-amber-850 bg-amber-50 px-1.5 py-0.5 rounded uppercase border border-amber-200">Recommended Container Option</span>
          <h3 className="font-bold text-stone-900 text-xs mt-1 mb-0 flex items-center gap-1">
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-800" /> Classic Italian Terracotta Clay Pot (8-Inch)
          </h3>
          <p className="text-[11px] text-stone-600 leading-relaxed mb-0">
            Natural unglazed clay allows moisture to transpire cleanly through side-walls while heavy weight stabilizes tall upright leaves. Ideal for growers looking for breathable containers with bottom drainage.
          </p>
        </div>
        <a 
          href="https://www.amazon.com/s?k=8+Inch+Terracotta+Clay+Pot+Deroma&tag=snakeplantsoi-20" 
          target="_blank" 
          rel="noopener noreferrer"
          className="shrink-0 bg-stone-900 hover:bg-emerald-800 text-white font-bold py-2 px-4 rounded font-sans uppercase tracking-wide text-[10px] flex items-center gap-1.5 transition-all shadow-xs"
        >
          <span>Get Pot on Amazon</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Authoritative Extension Citation Box */}
      <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex gap-3 my-6">
        <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-900 leading-relaxed">
          <strong>Horticultural Extension Guidance:</strong> For container selection and sanitation,{' '}
          <a
            href="https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-minnesota/how-clean-and-disinfect-gardening-tools-and-containers"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-bold hover:text-emerald-950"
          >
            University of Minnesota Extension
          </a>{' '}
          recommends selecting containers with functional drainage holes and thoroughly cleaning reusable pots before repotting. For commercial <em>Sansevieria</em> production guidelines,{' '}
          <a
            href="https://edis.ifas.ufl.edu/publication/EP042"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-bold hover:text-emerald-950"
          >
            University of Florida IFAS Extension
          </a>{' '}
          emphasizes well-drained media and well-aerated container environments to prevent root rot pathogens.
        </div>
      </div>

      {/* Internal Linking Related Guides Section */}
      <div className="border-t border-stone-250/60 pt-6 mt-10 space-y-3">
        <h3 className="text-sm font-bold text-stone-900 mt-0">Related Snake Plant Guides</h3>
        <p className="text-xs text-stone-600 leading-relaxed mt-1">
          Looking for an optimal fast-draining potting soil to pair with your new container? Mix your own using our step-by-step{' '}
          <a 
            href="/diy-snake-plant-soil-mix"
            onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('diy-mix'); } }}
            className="text-emerald-805 font-bold underline hover:text-emerald-950 focus:outline-none cursor-pointer"
          >
            DIY Snake Plant Soil Recipe (3-2-1 Ratio)
          </a>{' '}
          or compare popular commercial options in our{' '}
          <a 
            href="/best-snake-plant-soil"
            onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('best-soil'); } }}
            className="text-emerald-805 font-bold underline hover:text-emerald-950 focus:outline-none cursor-pointer"
          >
            Best Soil for Snake Plants Buyer's Guide
          </a>. 
          If your plant is currently in wet soil showing soft or yellow leaves, read our{' '}
          <a 
            href="/snake-plant-root-rot-guide"
            onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('root-rot'); } }}
            className="text-emerald-805 font-bold underline hover:text-emerald-950 focus:outline-none cursor-pointer"
          >
            Snake Plant Root Rot Guide
          </a>, 
          or evaluate your plant's setup using our interactive{' '}
          <a 
            href="/soil-diagnosis"
            onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('setup-kits'); } }}
            className="text-emerald-805 font-bold underline hover:text-emerald-950 focus:outline-none cursor-pointer"
          >
            Soil Diagnosis Quiz
          </a>.
        </p>
      </div>

      <TopicalClusterNav currentTab="best-pots" onNavigate={onNavigate} />

    </article>
  );
}


// ----------------------------------------------------
// SUBMODULE 5: SNAKE PLANT COMPLETE CARE & WATERING GUIDE
// ----------------------------------------------------
export function CareGuideArticle({ onNavigate }: ArticleProps) {
  const [season, setSeason] = useState<'spring' | 'summer' | 'fall' | 'winter'>('spring');

  const seasonalRoutine = {
    spring: {
      frequency: "Every 14 to 18 Days",
      growth: "Active new pup shoots forming. Roots absorbing water rapidly.",
      light: "Bright indirect morning light is ideal. Sills warming up.",
      tip: "Excellent window to add organic liquid fertilizer diluted to 25% capacity."
    },
    summer: {
      frequency: "Every 10 to 14 Days",
      growth: "Peak vegetative growth. Faster soil drying due to house heat.",
      light: "Protect from intense hot afternoon window sun which sunburns stems.",
      tip: "Water early in the morning so excess moisture evaporates by afternoon heat."
    },
    fall: {
      frequency: "Every 21 to 28 Days",
      growth: "Growth scaling down. Evaporation rate slows as temp drops.",
      light: "Maximize natural light. Move plant closer to brighter south sills.",
      tip: "Cease all fertilizing activities. Begin checking soil with wood chopsticks."
    },
    winter: {
      frequency: "Every 35 to 45 Days (Or Less!)",
      growth: "Deep physiological dormancy. Metabolic activities stop completely.",
      light: "Gently wipe leaf blades with a moist cloth to clear dust and capture max sun.",
      tip: "Absolute danger zone! When in doubt, withhold water. Cold damp soil is fatal."
    }
  };

  return (
    <article className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-6">
      
      <div className="bg-gradient-to-br from-emerald-50 to-stone-100 p-6 rounded-2xl border border-stone-200 mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-stone-900 tracking-tight mt-0 flex items-center gap-2">
          <Compass className="w-6 h-6 text-emerald-800" />
          The Complete Care & 'Soak and Dry' Watering Masterclass
        </h1>
        <p className="text-stone-650 text-sm mt-2 mb-0">
          Decipher watering frequencies based on seasonal changes, room humidity levels, and modern botanical guidelines.
        </p>
      </div>

      <p>
        "How often should I water my snake plant?" resides as the most frequent question in agricultural forums. The correct botanical response is never date-based. Watering schedules depend on seasonal temperature, moisture evaporation scales, container porosity, and available sunlight.
      </p>

      <h3 className="text-lg font-bold text-stone-900">Mastering the 'Soak and Dry' Botanical Cycle</h3>
      <p>
        In arid grasslands, snake plants thrive under sparse tropical downpours followed by prolonged bone-dry periods. This defines our watering strategy:
      </p>
      <ul className="space-y-4 list-none pl-0">
        <li className="bg-stone-50 border border-stone-100 p-4 rounded-xl">
          <span className="font-bold text-stone-900 text-sm flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Phase 1: Heavy Drenching ("Soak")
          </span>
          <p className="text-xs text-stone-600 mt-1 leading-relaxed">
            Pour water slowly around the base of the plant until it flows completely out of the bottom drainage hole. This ensures that every dry dirt crevice is humidified and dry soil channels are thoroughly opened.
          </p>
        </li>
        <li className="bg-stone-50 border border-stone-100 p-4 rounded-xl">
          <span className="font-bold text-stone-900 text-sm flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Phase 2: Absolute Aeration ("Dry")
          </span>
          <p className="text-xs text-stone-600 mt-1 leading-relaxed">
            Allow the soil column to dry out completely—from the surface crust all the way to the bottom nursery liner. The soil must feel 100% bone-dry before you pour even a single drop of water again.
          </p>
        </li>
      </ul>

      {/* Interactive Seasonal Watering Matrix */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs my-6">
        <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5 uppercase tracking-wide mb-3">
          <Sun className="w-4.5 h-4.5 text-amber-500" /> Seasonal Watering & Care Planner
        </h4>
        <p className="text-xs text-stone-500 mb-4">
          Select the current season to fetch verified care adjustments:
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {(['spring', 'summer', 'fall', 'winter'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSeason(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                season === s 
                  ? 'bg-stone-900 text-white shadow-xs' 
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
              id={`season-btn-${s}`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Output */}
        <div className="bg-stone-50 p-4 rounded-lg border border-stone-150 space-y-2.5 text-xs">
          <div className="flex justify-between items-center bg-white px-3 py-2 rounded-md border border-stone-100">
            <span className="font-semibold text-stone-750">Watering Target:</span>
            <span className="font-mono font-bold text-emerald-850 bg-emerald-50 px-2 py-0.5 rounded">{seasonalRoutine[season].frequency}</span>
          </div>
          <div>
            <span className="font-bold text-stone-905 block">Physiological Stage:</span>
            <p className="text-stone-600 text-[11px] mt-0.5">{seasonalRoutine[season].growth}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="bg-white p-2.5 rounded-md border border-stone-100">
              <span className="font-bold text-stone-905 text-[10px] uppercase block tracking-wider text-amber-800">Light Guidance</span>
              <p className="text-[11px] text-stone-500 mt-0.5">{seasonalRoutine[season].light}</p>
            </div>
            <div className="bg-white p-2.5 rounded-md border border-stone-100">
              <span className="font-bold text-stone-905 text-[10px] uppercase block tracking-wider text-emerald-800">Direct Tip</span>
              <p className="text-[11px] text-stone-500 mt-0.5">{seasonalRoutine[season].tip}</p>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-bold text-stone-900">Light Spectrum: The Fuel for Evaporation</h3>
      <p>
        While marketed as low-light survivors, snake plants biologically crave <strong>bright indirect light</strong>. Sunlight powers photosynthesis, prompting leaves to consume soil water. If placed in a dark interior powder room, the plant's metabolic activity slows to near-zero, meaning stagnant water in the soil has no avenue to escape via tissue transpiration, severely increasing root rot risk.
      </p>

      {/* Internal Linking Topical Cluster Section */}
      <div className="border-t border-stone-250/60 pt-6 mt-10">
        <h4 className="text-sm font-bold text-stone-900 mt-0">Next Steps in the Soil Cluster</h4>
        <p className="text-xs text-stone-600 leading-relaxed mt-1">
          Watering frequencies and evaporation ratios are heavily controlled by container material physics. Discover why materials matter in our{' '}
          <button 
            onClick={() => onNavigate?.('best-pots')} 
            className="text-emerald-805 font-bold underline hover:text-emerald-950 focus:outline-none cursor-pointer"
          >
            Best Pots for Snake Plants Guide
          </button>, 
          or compile your customized agricultural materials checklist using our interactive{' '}
          <button 
            onClick={() => onNavigate?.('setup-kits')} 
            className="text-emerald-805 font-bold underline hover:text-emerald-950 focus:outline-none cursor-pointer"
          >
            Perfect Soil & Repotting Kit Builder
          </button>.
        </p>
      </div>

      <TopicalClusterNav currentTab="care-guide" onNavigate={onNavigate} />

    </article>
  );
}
