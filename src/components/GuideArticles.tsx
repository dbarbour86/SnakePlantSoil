import { useState } from 'react';
import { 
  Trees, Beaker, HeartPulse, Layers, Compass, 
  HelpCircle, ChevronRight, Check, AlertCircle, Info,
  Search, Sliders, Droplet, Sun, Wind, Thermometer,
  ShieldCheck, RefreshCw, AlertTriangle, ArrowRight,
  ShoppingBag, ExternalLink, CheckCircle2, Radio
} from 'lucide-react';
import InteractiveCalculator from './InteractiveCalculator';

export interface ArticleProps {
  onNavigate?: (tab: string) => void;
}

const CLUSTER_STEPS = [
  { id: 'best-soil', title: '1. Best Soils', desc: 'Evaluating pre-mixes' },
  { id: 'diy-mix', title: '2. DIY Mix', desc: 'The 3-2-1 recipe' },
  { id: 'root-rot', title: '3. Root Rot', desc: 'Symptoms & recovery' },
  { id: 'care-guide', title: '4. Watering', desc: 'Soak & dry manual' },
  { id: 'best-pots', title: '5. Best Pots', desc: 'Terracotta science' },
  { id: 'setup-kits', title: '6. Soil Diagnosis', desc: 'Fit check & quiz' }
];

export function TopicalClusterNav({ currentTab, onNavigate }: { currentTab: string; onNavigate?: (tab: string) => void }) {
  if (!onNavigate) return null;
  return (
    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 mt-12 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5 mt-0">
            <Compass className="w-4.5 h-4.5 text-[#235837]" /> Core Snake Plant Care Guides
          </h4>
          <p className="text-[11px] text-stone-500 mt-0.5">
            Tap any step to jump directly to our core guides and tools:
          </p>
        </div>
        <span className="text-[10px] font-mono font-bold text-[#235837] bg-white px-2 py-0.5 rounded border border-[#C2DEC9] shrink-0 w-max">
          Quick Navigation
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

import BestSoilGuide from './BestSoilGuide';
import BotanicalSubpageLayout from './BotanicalSubpageLayout';

// ----------------------------------------------------
// SUBMODULE 1: BEST COMMERCIAL SOILS PAGE
// ----------------------------------------------------
export function BestSoilArticle({ onNavigate }: ArticleProps) {
  return <BestSoilGuide onNavigate={onNavigate} />;
}


// ----------------------------------------------------
// SUBMODULE 2: DIY SNAKE PLANT SOIL MIX PAGE
// ----------------------------------------------------
export function DIYMixArticle({ onNavigate }: ArticleProps) {
  const breadcrumbs = [
    { label: 'Home', tabId: 'home' },
    { label: 'DIY Mix', tabId: 'diy-mix' },
    { label: '3-2-1 Recipe' }
  ];

  const tocItems = [
    { id: 'ratio-breakdown', label: '3-2-1 ingredient breakdown' },
    { id: 'live-simulator', label: 'Interactive mix calculator' },
    { id: 'mixing-process', label: 'Step-by-step mixing process' },
    { id: 'squeeze-test', label: 'The moisture squeeze test' }
  ];

  const relatedGuides = [
    {
      title: 'Compare ready-made soils',
      description: 'See our editorial rankings of top commercial succulent mixes.',
      tabId: 'best-soil',
      image: '/soil-mound.jpg'
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
      categoryBadge="DIY FORMULATION GUIDE"
      title="The 3-2-1 Snake Plant Soil Recipe: Perfect DIY Mix"
      introSummary="Save money and give your plants custom aeration. Learn how to combine basic potting soil, horticultural perlite, and coarse sand in the golden ratio."
      heroImage="/mix-bowl.jpg"
      heroImageAlt="Botanical bowl of mixed DIY snake plant soil components"
      breadcrumbs={breadcrumbs}
      calloutBanner={{
        title: "The Golden Ratio: 3 Parts Soil, 2 Parts Perlite, 1 Part Sand",
        description: "This simple volumetric ratio creates permanent aeration channels that resist compaction, helping excess moisture drain freely while keeping tall foliage anchored.",
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#235837" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
        )
      }}
      tocItems={tocItems}
      relatedGuides={relatedGuides}
      onNavigate={onNavigate}
    >
      <div className="space-y-8" id="diy-recipe-root">
        {/* Intro Body */}
        <p className="text-stone-700 leading-relaxed font-sans m-0">
          If you have more than three plants, buying specialized small bags of boutique succulent soil becomes highly expensive. Mixing your own substrate is incredibly rewarding, clean, and allows you to custom-calibrate weights for tall, top-heavy leaves.
        </p>

        {/* Section 1: 3-2-1 Ingredient Breakdown */}
        <section id="ratio-breakdown" className="scroll-mt-24 space-y-4">
          <h2 className="font-serif font-bold text-[#142B1E] text-2xl tracking-tight mb-2">
            The 3-2-1 Ingredient Breakdown
          </h2>
          <p className="font-sans text-stone-600 text-sm leading-relaxed">
            Measure by volume (not by weight), using any simple container such as a standard plastic nursery pot or measuring cup:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 3 Parts Soil */}
            <div className="bg-white border border-[#E8E2D5] rounded-2xl p-4 shadow-xs flex flex-col items-center text-center">
              <span className="bg-[#E5ECE4] text-[#235837] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-3 font-sans">
                3 Parts (50%)
              </span>
              <div className="w-full aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-stone-100 border border-stone-200/60">
                <img src="/pile-soil.jpg" alt="Standard potting soil" className="w-full h-full object-cover" />
              </div>
              <h4 className="font-serif font-bold text-[#142B1E] text-sm mb-1">Standard Potting Soil</h4>
              <p className="font-sans text-xs text-stone-600 leading-snug m-0">
                Clean organic base providing mild nutrient holding and moisture anchoring.
              </p>
            </div>

            {/* 2 Parts Perlite */}
            <div className="bg-white border border-[#E8E2D5] rounded-2xl p-4 shadow-xs flex flex-col items-center text-center">
              <span className="bg-[#E5ECE4] text-[#235837] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-3 font-sans">
                2 Parts (33%)
              </span>
              <div className="w-full aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-stone-100 border border-stone-200/60">
                <img src="/pile-perlite.jpg" alt="Horticultural perlite" className="w-full h-full object-cover" />
              </div>
              <h4 className="font-serif font-bold text-[#142B1E] text-sm mb-1">Horticultural Perlite</h4>
              <p className="font-sans text-xs text-stone-600 leading-snug m-0">
                Expanded volcanic glass that prevents compaction and creates oxygen pockets.
              </p>
            </div>

            {/* 1 Part Sand */}
            <div className="bg-white border border-[#E8E2D5] rounded-2xl p-4 shadow-xs flex flex-col items-center text-center">
              <span className="bg-[#E5ECE4] text-[#235837] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-3 font-sans">
                1 Part (17%)
              </span>
              <div className="w-full aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-stone-100 border border-stone-200/60">
                <img src="/pile-sand.jpg" alt="Coarse silica sand" className="w-full h-full object-cover" />
              </div>
              <h4 className="font-serif font-bold text-[#142B1E] text-sm mb-1">Coarse Silica Sand</h4>
              <p className="font-sans text-xs text-stone-600 leading-snug m-0">
                Heavy, coarse washed sand that speeds gravity drainage and anchors tall plants.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Interactive Mix Calculator */}
        <section id="live-simulator" className="scroll-mt-24 space-y-4">
          <h2 className="font-serif font-bold text-[#142B1E] text-2xl tracking-tight mb-2">
            Interactive Mix Calculator
          </h2>
          <p className="font-sans text-stone-600 text-sm leading-relaxed">
            Adjust dry component volumes below to check calculated aeration and drainage scores before mixing:
          </p>
          <div className="bg-white border border-[#E8E2D5] rounded-2xl p-5 sm:p-6 shadow-xs">
            <InteractiveCalculator />
          </div>
        </section>

        {/* Section 3: Step-by-Step Mixing Process */}
        <section id="mixing-process" className="scroll-mt-24 space-y-4">
          <h2 className="font-serif font-bold text-[#142B1E] text-2xl tracking-tight mb-2">
            Step-by-step mixing process
          </h2>
          <p className="font-sans text-stone-600 text-sm leading-relaxed">
            Follow this simple process to blend a clean, uniform batch in under 5 minutes:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-[#E8E2D5] rounded-2xl p-4 shadow-xs">
              <div className="w-6 h-6 rounded-full bg-[#142B1E] text-white text-xs font-bold flex items-center justify-center mb-3">
                1
              </div>
              <h4 className="font-serif font-bold text-[#142B1E] text-sm mb-1">Measure dry parts</h4>
              <p className="font-sans text-xs text-stone-600 leading-relaxed m-0">
                Scoop 3 parts potting soil, 2 parts perlite, and 1 part sand into a bucket or shallow potting bin.
              </p>
            </div>

            <div className="bg-white border border-[#E8E2D5] rounded-2xl p-4 shadow-xs">
              <div className="w-6 h-6 rounded-full bg-[#142B1E] text-white text-xs font-bold flex items-center justify-center mb-3">
                2
              </div>
              <h4 className="font-serif font-bold text-[#142B1E] text-sm mb-1">Blend thoroughly</h4>
              <p className="font-sans text-xs text-stone-600 leading-relaxed m-0">
                Turn the mix with a trowel or gloved hands until the white perlite and sand are uniformly distributed with no clumps.
              </p>
            </div>

            <div className="bg-white border border-[#E8E2D5] rounded-2xl p-4 shadow-xs">
              <div className="w-6 h-6 rounded-full bg-[#142B1E] text-white text-xs font-bold flex items-center justify-center mb-3">
                3
              </div>
              <h4 className="font-serif font-bold text-[#142B1E] text-sm mb-1">The squeeze test</h4>
              <p className="font-sans text-xs text-stone-600 leading-relaxed m-0">
                Lightly dampen a handful and squeeze. When you open your palm, the ball should immediately crumble freely.
              </p>
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 text-xs text-amber-900 my-4 font-sans leading-relaxed">
            <strong>⚠️ Crucial warning:</strong> Never use fine playground sand or beach sand. Fine-grained play sand fills soil channels completely, cementing together like mortar when mixed with compost, choking roots immediately.
          </div>

          {/* Recommended Silica Sand card */}
          <div className="bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 text-xs font-sans">
            <div className="flex-grow space-y-1">
              <span className="text-[9px] font-mono font-bold text-amber-850 bg-amber-50 px-1.5 py-0.5 rounded uppercase border border-amber-200">Recommended Amendment</span>
              <h4 className="font-bold text-stone-900 text-xs mt-1 mb-0 flex items-center gap-1">
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-800" /> Perfect Plants Coarse Horticultural Sand
              </h4>
              <p className="text-[11px] text-stone-600 leading-relaxed mb-0">
                Washed and coarse-grained silica sand explicitly sized to create permanent channel voids for gravity water flow. Heavy anchor weight prevents tall plants from leaning.
              </p>
              <div className="text-[10px] text-stone-400 mt-2">
                Affiliate disclosure: Purchases made through Amazon links may earn us an advertising commission at zero cost to you.
              </div>
            </div>
            <a 
              href="https://www.amazon.com/s?k=coarse+horticultural+sand+for+plants&tag=snakeplantsoi-20" 
              target="_blank" 
              rel="noopener noreferrer"
              className="shrink-0 bg-[#142B1E] hover:bg-[#235837] text-white font-bold py-2 px-4 rounded-xl font-sans uppercase tracking-wide text-[10px] flex items-center gap-1.5 transition-all shadow-xs"
            >
              <span>Search Coarse Sand on Amazon</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </section>

        {/* Section 4: Squeeze Test Callout */}
        <section id="squeeze-test" className="scroll-mt-24 space-y-3">
          <h2 className="font-serif font-bold text-[#142B1E] text-2xl tracking-tight mb-2">
            The moisture squeeze test
          </h2>
          <p className="font-sans text-stone-600 text-sm leading-relaxed">
            The easiest way to verify your mix is the <strong>hand squeeze test</strong>:
          </p>
          <div className="bg-[#E5ECE4] border border-[#D6E2D5] rounded-xl p-4 font-sans text-xs text-stone-700 leading-relaxed">
            Take a handful of your finished dry mix, mist it with a few sprays of water until barely damp, and squeeze tightly in your fist. When you open your hand, a soil with correct aeration will fall apart in crumbs without forming a clay-like muddy ball. If it stays clumped, add another scoop of perlite or pumice.
          </div>
        </section>

        <TopicalClusterNav currentTab="diy-mix" onNavigate={onNavigate} />
      </div>
    </BotanicalSubpageLayout>
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
    if (count === 0) return { title: "Healthy Foliage — Low Rot Risk", color: "text-emerald-800", bg: "bg-emerald-50", desc: "No immediate symptoms of root decay detected. Maintain a regular dry-down cycle between waterings as standard upkeep." };
    if (count <= 2) return { title: "Early Moisture Stress — Recovery Potential High", color: "text-amber-800", bg: "bg-amber-50", desc: "Minor moisture overload detected. Cease watering immediately and allow the soil column to dry out completely throughout the root zone before watering again." };
    if (count <= 4) return { title: "Active Rot Suspected — Immediate Care Needed", color: "text-orange-800", bg: "bg-orange-50", desc: "Root decay is likely progressing. Unpot the plant, inspect the root system, prune away dark mushy tissue with disinfected tools, allow cut surfaces to dry, and repot in fresh fast-draining mix." };
    return { title: "Severe Damage — Leaf Propagation Recommended", color: "text-rose-800", bg: "bg-rose-50", desc: "Extensive root system breakdown. If no firm rhizome tissue remains, cut firm, healthy leaf sections well above any discolored areas to propagate new plants in fresh, well-aerated media." };
  };

  const triage = getTriageResult();

  const breadcrumbs = [
    { label: 'Home', tabId: 'home' },
    { label: 'Care Guides', tabId: 'care-guide' },
    { label: 'Root Rot' }
  ];

  const tocItems = [
    { id: 'symptoms-section', label: 'Signs of root rot' },
    { id: 'visual-comparison', label: 'Healthy vs. rotting roots' },
    { id: 'recovery-protocol', label: 'A step-by-step recovery guide' },
    { id: 'aftercare', label: 'Aftercare tips' }
  ];

  const relatedGuides = [
    {
      title: 'Choose the right soil',
      description: 'See what makes a great soil for snake plants and how to pick the best option.',
      tabId: 'best-soil',
      image: '/soil-mound.jpg'
    },
    {
      title: 'Make your own mix',
      description: 'A simple, balanced DIY soil mix that keeps roots healthy and prevents excess moisture.',
      tabId: 'diy-mix',
      image: '/mix-bowl.jpg'
    }
  ];

  return (
    <BotanicalSubpageLayout
      categoryBadge="PLANT HEALTH GUIDE"
      title="Snake Plant Root Rot: Symptoms, Treatment & Recovery"
      introSummary="Learn how to recognize snake plant root rot, remove badly damaged tissue, repot viable roots or rhizomes, and correct the moisture conditions that caused the problem."
      heroImage="/article-root-rot.jpg"
      heroImageAlt="Botanical workspace with snake plant roots and repotting tools"
      breadcrumbs={breadcrumbs}
      calloutBanner={{
        title: 'Start with the roots',
        description: "Root rot is a common issue for snake plants, usually caused by too much moisture or soil that stays wet too long. A quick check of the roots tells you what's going on and whether your plant can recover.",
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#1A3B29' }}>
            <path fillRule="evenodd" clipRule="evenodd" d="M12 1.5C13.8 6.5 14.5 13.5 13.5 22.5H10.5C9.5 13.5 10.2 6.5 12 1.5ZM6.5 5.8C8 10 9 15.5 10.8 21.5H8.8C7.3 16 6 11.5 6.5 5.8ZM17.5 5.8C16 10 15 15.5 13.2 21.5H15.2C16.7 16 18 11.5 17.5 5.8Z"/>
          </svg>
        )
      }}
      tocItems={tocItems}
      relatedGuides={relatedGuides}
      onNavigate={onNavigate}
    >
      <div className="space-y-8" id="root-rot-guide-root">
        {/* Contextual Audio Deep Dive Callout */}
        <div className="bg-white border border-[#E8E2D5] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E5ECE4] text-[#142B1E] flex items-center justify-center shrink-0 mt-0.5">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-stone-900 block font-sans">Listen to Snake Plant Radio: Episode #1</span>
              <span className="text-xs text-stone-500 font-sans">Early warning signs of overwatering and a 5-step root rot recovery guide.</span>
            </div>
          </div>
          <a
            href="/radio/why-your-snake-plant-is-dying"
            onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('radio/why-your-snake-plant-is-dying'); } }}
            className="text-xs font-bold text-[#235837] hover:text-[#142B1E] flex items-center gap-1.5 shrink-0 hover:underline font-sans"
          >
            <span>Listen to Episode</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Section 1: Signs of Root Rot */}
        <section id="symptoms-section" className="scroll-mt-24 space-y-4">
          <h2 className="font-serif font-bold text-[#142B1E] text-2xl tracking-tight mb-2">
            Signs of root rot
          </h2>
          <p className="font-sans text-stone-600 text-sm leading-relaxed">
            Look for a combination of changes, such as soft or yellowing leaves, a plant that feels loose in the pot, or a musty, wet smell from the soil. The most reliable sign is the condition of the roots.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 font-sans text-xs">
            <div className="bg-rose-50/70 border border-rose-200/80 p-4 rounded-xl space-y-2">
              <h3 className="text-xs font-bold text-rose-950 mt-0 flex items-center gap-1.5 uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4 text-rose-700" /> Primary Indicators of Root Rot
              </h3>
              <ul className="text-stone-700 space-y-1.5 pl-4 list-disc mb-0">
                <li><strong>Persistently wet soil:</strong> Remains damp or cold weeks after watering.</li>
                <li><strong>Soft leaf bases:</strong> Lower stem near soil is mushy or brown.</li>
                <li><strong>Deteriorated root tissue:</strong> Roots appear dark, slimy, or slough off.</li>
                <li><strong>Foul odor:</strong> Sour or decaying smell from the root zone.</li>
                <li><strong>Crown collapse:</strong> Stems lean outward from an unstable base.</li>
              </ul>
            </div>

            <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-2">
              <h3 className="text-xs font-bold text-stone-900 mt-0 flex items-center gap-1.5 uppercase tracking-wide">
                <Info className="w-4 h-4 text-stone-600" /> Alternative Non-Rot Causes
              </h3>
              <ul className="text-stone-700 space-y-1.5 pl-4 list-disc mb-0">
                <li><strong>Underwatering:</strong> Leaves wrinkle or feel leathery, but roots remain dry and firm.</li>
                <li><strong>Cold Draft Injury:</strong> Cold air exposure below 50°F causes water-soaked spots.</li>
                <li><strong>Physical Damage:</strong> Bent or cracked leaf blades with firm root bases.</li>
                <li><strong>Normal Aging:</strong> Single oldest outer leaf yellowing slowly.</li>
              </ul>
            </div>
          </div>

          {/* Interactive Symptom Checker */}
          <div className="bg-white rounded-2xl border border-[#E8E2D5] p-5 shadow-xs my-6 font-sans">
            <h3 className="text-xs font-bold text-stone-900 flex items-center gap-1.5 uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4 text-[#235837]" /> Root Rot Symptom Assessment Tool
            </h3>
            <p className="text-xs text-stone-500 mb-3">
              Select any physical symptoms currently present on your snake plant to evaluate potential root condition:
            </p>

            <div className="space-y-2">
              <label className="flex items-center gap-3 text-xs text-stone-700 cursor-pointer p-2 rounded-lg hover:bg-stone-50 select-none">
                <input 
                  type="checkbox" 
                  checked={symptoms.drooping} 
                  onChange={() => setSymptoms(s => ({...s, drooping: !s.drooping}))}
                  className="w-4 h-4 rounded text-[#235837] focus:ring-[#235837] border-stone-300"
                />
                <span>Leaves are falling outward or bending limply instead of standing upright</span>
              </label>
              <label className="flex items-center gap-3 text-xs text-stone-700 cursor-pointer p-2 rounded-lg hover:bg-stone-50 select-none">
                <input 
                  type="checkbox" 
                  checked={symptoms.yellow} 
                  onChange={() => setSymptoms(s => ({...s, yellow: !s.yellow}))}
                  className="w-4 h-4 rounded text-[#235837] focus:ring-[#235837] border-stone-300"
                />
                <span>Leaves are fading to pale lime-green or displaying splotchy yellowing</span>
              </label>
              <label className="flex items-center gap-3 text-xs text-stone-700 cursor-pointer p-2 rounded-lg hover:bg-stone-50 select-none">
                <input 
                  type="checkbox" 
                  checked={symptoms.mushyBase} 
                  onChange={() => setSymptoms(s => ({...s, mushyBase: !s.mushyBase}))}
                  className="w-4 h-4 rounded text-[#235837] focus:ring-[#235837] border-stone-300"
                />
                <span>Leaf bases near the soil line feel soft, soggy, or dark brown when touched</span>
              </label>
              <label className="flex items-center gap-3 text-xs text-stone-700 cursor-pointer p-2 rounded-lg hover:bg-stone-50 select-none">
                <input 
                  type="checkbox" 
                  checked={symptoms.smell} 
                  onChange={() => setSymptoms(s => ({...s, smell: !s.smell}))}
                  className="w-4 h-4 rounded text-[#235837] focus:ring-[#235837] border-stone-300"
                />
                <span>The root zone or soil emits a sour or decaying odor</span>
              </label>
              <label className="flex items-center gap-3 text-xs text-stone-700 cursor-pointer p-2 rounded-lg hover:bg-stone-50 select-none">
                <input 
                  type="checkbox" 
                  checked={symptoms.soilSoggy} 
                  onChange={() => setSymptoms(s => ({...s, soilSoggy: !s.soilSoggy}))}
                  className="w-4 h-4 rounded text-[#235837] focus:ring-[#235837] border-stone-300"
                />
                <span>Soil remains cold and wet weeks after the last watering</span>
              </label>
            </div>

            <div className={`mt-4 p-4 rounded-xl border ${triage.bg} transition-all duration-300`}>
              <span className="text-[10px] font-mono font-bold tracking-widest text-stone-400 uppercase block mb-1">Assessment Output</span>
              <h4 className={`font-bold text-sm my-0 ${triage.color}`}>{triage.title}</h4>
              <p className="text-xs text-stone-600 leading-relaxed mt-1 mb-0">{triage.desc}</p>
            </div>
          </div>
        </section>

        {/* Section 2: Visual Comparison Box */}
        <section id="visual-comparison" className="scroll-mt-24">
          <div className="bg-[#142B1E] text-white rounded-2xl p-5 sm:p-7 shadow-sm">
            <h3 className="font-serif font-bold text-white text-lg sm:text-xl mb-4 leading-snug">
              Healthy roots vs. rotting roots
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Healthy Roots */}
              <div className="bg-white/10 border border-white/15 rounded-xl p-3 sm:p-4 flex flex-col items-center">
                <div className="w-full aspect-[4/3] rounded-lg overflow-hidden mb-3 bg-black/20">
                  <img src="/healthy-roots.jpg" alt="Healthy snake plant roots" className="w-full h-full object-cover" />
                </div>
                <span className="bg-white text-[#142B1E] text-xs font-bold px-3 py-1 rounded-full font-sans shadow-xs">
                  Healthy: firm and pale
                </span>
              </div>

              {/* Rotting Roots */}
              <div className="bg-white/10 border border-white/15 rounded-xl p-3 sm:p-4 flex flex-col items-center">
                <div className="w-full aspect-[4/3] rounded-lg overflow-hidden mb-3 bg-black/20">
                  <img src="/rotting-roots.jpg" alt="Rotting snake plant roots" className="w-full h-full object-cover" />
                </div>
                <span className="bg-white text-[#142B1E] text-xs font-bold px-3 py-1 rounded-full font-sans shadow-xs">
                  Rotting: dark and mushy
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Recovery Action Guide */}
        <section id="recovery-protocol" className="scroll-mt-24 space-y-4">
          <h2 className="font-serif font-bold text-[#142B1E] text-2xl tracking-tight mb-2">
            A step-by-step recovery guide
          </h2>
          <p className="font-sans text-stone-600 text-sm leading-relaxed">
            If you've found root rot, act quickly. Many snake plants can recover with a little cleanup and a fresh start.
          </p>

          {/* Action-Specific Step Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div className="bg-white border border-[#E8E2D5] rounded-2xl p-4 shadow-xs flex flex-col">
              <div className="relative w-full aspect-[16/11] rounded-xl overflow-hidden mb-3 bg-stone-100 border border-stone-200/60">
                <img src="/step-inspect-roots.jpg" alt="Inspect the roots" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-[#235837] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                  1
                </div>
              </div>
              <h4 className="font-serif font-bold text-[#142B1E] text-sm mb-1">Inspect the roots</h4>
              <p className="font-sans text-xs text-stone-600 leading-relaxed m-0">
                Take the plant out of its pot and brush away the soil. Look for firm, light-colored roots versus soft, dark, or mushy ones.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-[#E8E2D5] rounded-2xl p-4 shadow-xs flex flex-col">
              <div className="relative w-full aspect-[16/11] rounded-xl overflow-hidden mb-3 bg-stone-100 border border-stone-200/60">
                <img src="/step-trim-roots.jpg" alt="Remove damaged roots" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-[#235837] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                  2
                </div>
              </div>
              <h4 className="font-serif font-bold text-[#142B1E] text-sm mb-1">Remove damaged roots</h4>
              <p className="font-sans text-xs text-stone-600 leading-relaxed m-0">
                Use clean, sharp scissors to trim away any dark, soft, or mushy roots. Keep the firm, healthy roots intact.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-[#E8E2D5] rounded-2xl p-4 shadow-xs flex flex-col">
              <div className="relative w-full aspect-[16/11] rounded-xl overflow-hidden mb-3 bg-stone-100 border border-stone-200/60">
                <img src="/step-repot-plant.jpg" alt="Repot in fresh mix" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-[#235837] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                  3
                </div>
              </div>
              <h4 className="font-serif font-bold text-[#142B1E] text-sm mb-1">Repot in fresh mix</h4>
              <p className="font-sans text-xs text-stone-600 leading-relaxed m-0">
                Place the plant in a pot with drainage holes and a well-draining snake plant mix. Water lightly, then let the soil dry out before watering again.
              </p>
            </div>
          </div>

          {/* Full Protocol Detailed Steps */}
          <div className="space-y-3 pt-2 font-sans text-xs text-stone-700">
            <div className="bg-white p-4 rounded-xl border border-[#E8E2D5] shadow-2xs">
              <strong className="text-stone-900 block mb-1">Step 4: Allow Cut Surfaces to Air-Dry (Callus Formation)</strong>
              <p className="m-0 leading-relaxed text-stone-600">
                Allow freshly cut surfaces to dry in a warm, well-ventilated area for 12–24 hours before repotting. This gives open wounds time to form a dry, protective callus to prevent fungal re-entry.
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#E8E2D5] shadow-2xs">
              <strong className="text-stone-900 block mb-1">Step 5: Disinfect Container &amp; Adjust Post-Repotting Water</strong>
              <p className="m-0 leading-relaxed text-stone-600">
                If reusing the pot, scrub off organic debris and soak in a 10% household bleach solution. Repot into fresh fast-draining cactus/succulent mix. Keep watering minimal for the first 2–3 weeks while new root hairs establish.
              </p>
            </div>
          </div>

          {/* University Extension Guidance */}
          <div className="bg-[#E5ECE4] rounded-xl p-4 border border-[#D6E2D5] flex gap-3 my-4 font-sans text-xs">
            <Info className="w-4 h-4 text-[#235837] shrink-0 mt-0.5" />
            <div className="text-stone-800 leading-relaxed">
              <strong>Horticultural Extension Guidance:</strong> For tool sanitation, university extensions recommend 70% or higher isopropyl alcohol on cutting blades. For reusable containers,{' '}
              <a
                href="https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-minnesota/how-clean-and-disinfect-gardening-tools-and-containers"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-bold text-[#142B1E] hover:text-[#235837]"
              >
                University of Minnesota Extension
              </a>{' '}
              recommends scrubbing off soil debris and soaking hard containers in a 10% household bleach solution. Rinse thoroughly before repotting.
            </div>
          </div>
        </section>

        {/* Section 4: Aftercare Tips */}
        <section id="aftercare" className="scroll-mt-24 space-y-3">
          <h2 className="font-serif font-bold text-[#142B1E] text-2xl tracking-tight mb-2">
            Aftercare tips
          </h2>
          <p className="font-sans text-stone-700 text-sm leading-relaxed">
            After repotting, place the snake plant in bright, indirect light. Avoid direct midday sun which can scorch stressed leaves. Keep watering minimal for the first 2–3 weeks while new root hairs develop.
          </p>
          <p className="font-sans text-stone-700 text-sm leading-relaxed">
            For best long-term prevention, use a mineral-dominant soil mix like our{' '}
            <button
              onClick={() => onNavigate?.('diy-mix')}
              className="text-[#235837] font-bold underline hover:text-[#142B1E] cursor-pointer"
            >
              3-2-1 DIY Soil Recipe
            </button>{' '}
            or choose an unglazed porous pot from our{' '}
            <button
              onClick={() => onNavigate?.('best-pots')}
              className="text-[#235837] font-bold underline hover:text-[#142B1E] cursor-pointer"
            >
              Terracotta Pot Guide
            </button>.
          </p>
        </section>

        <TopicalClusterNav currentTab="root-rot" onNavigate={onNavigate} />
      </div>
    </BotanicalSubpageLayout>
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

  const breadcrumbs = [
    { label: 'Home', tabId: 'home' },
    { label: 'Care Guides', tabId: 'care-guide' },
    { label: 'Best Pots' }
  ];

  const tocItems = [
    { id: 'material-comparison', label: 'Comparing pot materials' },
    { id: 'sizing-calculator', label: 'Suggested pot sizing guide' },
    { id: 'drainage-rules', label: 'Practical drainage rules' },
    { id: 'recommended-option', label: 'Recommended container option' }
  ];

  const relatedGuides = [
    {
      title: 'Choose the right soil',
      description: 'See what makes a great commercial succulent soil and compare top-ranked mixes.',
      tabId: 'best-soil',
      image: '/soil-mound.jpg'
    },
    {
      title: 'Make your own mix',
      description: 'A simple, balanced DIY 3-2-1 soil mix that keeps roots healthy and aerated.',
      tabId: 'diy-mix',
      image: '/mix-bowl.jpg'
    }
  ];

  return (
    <BotanicalSubpageLayout
      categoryBadge="POT & CONTAINER SCIENCE"
      title="Best Pots for Snake Plants: Size, Material & Drainage Guide"
      introSummary="Discover the best pots for snake plants. Compare terracotta, ceramic, and plastic containers, choose an appropriate pot size, and learn practical drainage rules."
      heroImage="/hero-botanical-room.jpg"
      heroImageAlt="Snake plant in an unglazed terracotta pot in a sunlit room"
      breadcrumbs={breadcrumbs}
      calloutBanner={{
        title: "Good drainage and appropriate sizing are essential",
        description: "A good snake plant pot has functional drainage and is appropriately sized for the root system. Porous terracotta allows moisture to escape through container walls, while glazed ceramic and plastic retain moisture longer.",
        icon: <Layers className="w-4 h-4 text-[#235837]" />
      }}
      tocItems={tocItems}
      relatedGuides={relatedGuides}
      onNavigate={onNavigate}
    >
      <div className="space-y-8 text-stone-700 leading-relaxed font-sans text-sm sm:text-base">

        {/* Section 1: Material Comparison */}
        <section id="material-comparison" className="scroll-mt-24 space-y-4">
          <h2 className="font-serif font-bold text-[#142B1E] text-2xl tracking-tight mb-2">
            Comparing Pot Materials: Terracotta, Ceramic &amp; Plastic
          </h2>
          <p className="font-sans text-stone-600 text-sm leading-relaxed">
            Container materials interact directly with your potting soil, indoor humidity, temperature, and watering frequency. Choosing the right container material helps maintain balanced moisture levels for snake plant roots:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            <div className="p-4 rounded-xl border border-[#E8E2D5] bg-white shadow-2xs space-y-2">
              <span className="text-xs font-bold text-[#235837] uppercase tracking-wider block font-sans">
                1. Unglazed Terracotta (Porous Clay)
              </span>
              <p className="text-xs text-stone-600 leading-relaxed m-0 font-sans">
                Porous unglazed clay allows moisture to transpire through container walls as well as from the surface, helping soil dry more evenly. The heavy weight of clay provides excellent stability for tall, upright foliage. However, soil may dry faster in arid environments, and natural mineral deposits (efflorescence) can form on outer walls over time.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#E8E2D5] bg-white shadow-2xs space-y-2">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block font-sans">
                2. Glazed Ceramic
              </span>
              <p className="text-xs text-stone-600 leading-relaxed m-0 font-sans">
                Glazed ceramic surfaces seal moisture inside, preventing wall evaporation so soil dries primarily from the top surface down. Glazed pots are heavy and stable, working very well when equipped with functional bottom drainage holes and paired with a fast-draining, well-aerated potting mix.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#E8E2D5] bg-white shadow-2xs space-y-2">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block font-sans">
                3. Plastic Containers &amp; Liners
              </span>
              <p className="text-xs text-stone-600 leading-relaxed m-0 font-sans">
                Plastic containers are lightweight, durable, inexpensive, and nonporous. They retain soil moisture longer than unglazed clay and allow easy unpotting for root inspection. Because lightweight plastic can tip under tall leaves, placing a plastic nursery pot inside a heavy decorative outer cachepot provides both drainage and stability.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Sizing Calculator */}
        <section id="sizing-calculator" className="scroll-mt-24 space-y-4">
          <h2 className="font-serif font-bold text-[#142B1E] text-2xl tracking-tight mb-2">
            How to Choose the Right Pot Size for a Snake Plant
          </h2>
          <p className="font-sans text-stone-600 text-sm leading-relaxed">
            Root-ball size and condition should take priority over foliage height when choosing the next container. Plant height is useful primarily for considering physical stability and tipping risk. Modest increases in container size are commonly used when repotting houseplants, but always inspect the root system, avoid unnecessarily large increases in soil volume, and consider your potting mix characteristics.
          </p>

          <div className="bg-[#F4F1EA] p-5 sm:p-6 rounded-2xl border border-[#E8E2D5] shadow-xs my-4" id="sizing-calculator-box">
            <h3 className="font-serif font-bold text-[#142B1E] text-lg flex items-center gap-2 mb-2">
              <Sliders className="w-4 h-4 text-[#235837]" /> Suggested Pot Sizing Guide
            </h3>
            <p className="text-xs text-stone-600 mb-4 font-sans">
              Adjust the sliders below to explore a suggested container diameter and depth starting point based on plant height and current pot size:
            </p>

            <div className="space-y-4 bg-white p-4 sm:p-5 rounded-xl border border-[#E8E2D5]">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 font-sans">
                  <span className="text-stone-800">Foliage Height from Soil Line:</span>
                  <span className="font-bold text-[#235837]">{foliageHeight} inches</span>
                </div>
                <input 
                  type="range" 
                  min={4} 
                  max={48} 
                  value={foliageHeight} 
                  onChange={(e) => setFoliageHeight(parseInt(e.target.value))}
                  className="w-full accent-[#235837] bg-stone-200 cursor-pointer"
                  id="foliage-height-slider"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1 font-sans">
                  <span className="text-stone-800">Current Pot Diameter:</span>
                  <span className="font-bold text-[#235837]">{currentPot} inches</span>
                </div>
                <input 
                  type="range" 
                  min={3} 
                  max={16} 
                  value={currentPot} 
                  onChange={(e) => setCurrentPot(parseInt(e.target.value))}
                  className="w-full accent-[#235837] bg-stone-200 cursor-pointer"
                  id="current-pot-slider"
                />
              </div>
            </div>

            {/* Output Metric Cards */}
            <div className="bg-white border border-[#E8E2D5] p-4 rounded-xl mt-4 text-xs font-sans space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#FAF7F2] p-3 rounded-lg border border-[#E8E2D5]/70">
                  <span className="text-stone-500 uppercase tracking-widest text-[9px] font-bold block">Suggested Pot Range</span>
                  <span className="font-serif text-[#142B1E] font-bold text-lg block mt-0.5">{potRec.diameter} Inches</span>
                  <span className="text-[11px] text-stone-500">Step up modestly (1–2") to match root mass expansion.</span>
                </div>
                <div className="bg-[#FAF7F2] p-3 rounded-lg border border-[#E8E2D5]/70">
                  <span className="text-stone-500 uppercase tracking-widest text-[9px] font-bold block">Suggested Pot Depth</span>
                  <span className="font-serif text-[#142B1E] font-bold text-lg block mt-0.5">{potRec.depth} Inches</span>
                  <span className="text-[11px] text-stone-500">Moderate shallow depth matches horizontal rhizomes.</span>
                </div>
              </div>
              <div className="border-t border-stone-100 pt-2 text-stone-600 leading-relaxed text-xs">
                <strong className="text-[#142B1E]">Sizing Advice:</strong> {potRec.repotVerdict}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Practical Container Drainage Rules */}
        <section id="drainage-rules" className="scroll-mt-24 space-y-4">
          <h2 className="font-serif font-bold text-[#142B1E] text-2xl tracking-tight mb-2">
            Practical Container Drainage Rules
          </h2>
          <div className="space-y-3 font-sans text-xs sm:text-sm text-stone-700">
            <div className="bg-white border border-[#E8E2D5] p-4 rounded-xl shadow-2xs">
              <strong className="text-[#142B1E] block mb-1">1. Ensure Functional Bottom Drainage</strong>
              <p className="m-0 leading-relaxed text-stone-600">
                Containers used for direct planting should allow excess irrigation water to escape through open drainage holes. Avoid planting directly into sealed vessels without drainage.
              </p>
            </div>
            <div className="bg-white border border-[#E8E2D5] p-4 rounded-xl shadow-2xs">
              <strong className="text-[#142B1E] block mb-1">2. The Gravel Layer Myth</strong>
              <p className="m-0 leading-relaxed text-stone-600">
                Adding gravel or pebbles beneath potting mix in a container without a drainage hole does not substitute for real drainage. Instead, it creates a perched water table that holds saturated soil higher in the container, closer to early roots.
              </p>
            </div>
            <div className="bg-white border border-[#E8E2D5] p-4 rounded-xl shadow-2xs">
              <strong className="text-[#142B1E] block mb-1">3. Saucer &amp; Cachepot Care</strong>
              <p className="m-0 leading-relaxed text-stone-600">
                After watering and allowing excess water to drain, do not leave the planted container standing in collected water in a saucer or decorative cachepot. If using a decorative outer pot without drainage, keep the plant in a draining nursery liner and empty any accumulated water from the cachepot after watering.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Recommended Terracotta Option */}
        <section id="recommended-option" className="scroll-mt-24">
          <div className="bg-[#FAF7F2] border border-[#E8E2D5] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-5 text-xs">
            <div className="flex-grow space-y-1.5 font-sans">
              <span className="text-[10px] font-bold text-[#235837] bg-[#E2EFE5] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Recommended Container Option
              </span>
              <h3 className="font-serif font-bold text-[#142B1E] text-base sm:text-lg mt-1 mb-0 flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-[#235837]" /> Classic Italian Terracotta Clay Pot (8-Inch)
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed mb-0">
                Natural unglazed clay allows moisture to transpire cleanly through side-walls while heavy weight stabilizes tall upright leaves. Ideal for growers looking for breathable containers with bottom drainage.
              </p>
              <div className="text-[10px] text-stone-400 mt-2">
                Affiliate disclosure: Purchases made through Amazon links may earn us an advertising commission at zero cost to you.
              </div>
            </div>
            <a 
              href="https://www.amazon.com/s?k=8+Inch+Terracotta+Clay+Pot+with+drainage+hole&tag=snakeplantsoi-20" 
              target="_blank" 
              rel="noopener noreferrer"
              className="shrink-0 bg-[#142B1E] hover:bg-[#235837] text-white font-bold py-2.5 px-5 rounded-full font-sans text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <span>Search Terracotta Pots on Amazon</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#9EC4A9]" />
            </a>
          </div>
        </section>

        {/* Authoritative Extension Citation Box */}
        <div className="bg-[#E5ECE4] rounded-xl p-4 border border-[#D6E2D5] flex gap-3 font-sans text-xs">
          <Info className="w-4 h-4 text-[#235837] shrink-0 mt-0.5" />
          <div className="text-stone-800 leading-relaxed">
            <strong>Horticultural Extension Guidance:</strong> For container selection and sanitation,{' '}
            <a
              href="https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-minnesota/how-clean-and-disinfect-gardening-tools-and-containers"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-bold text-[#142B1E] hover:text-[#235837]"
            >
              University of Minnesota Extension
            </a>{' '}
            recommends selecting containers with functional drainage holes and thoroughly cleaning reusable pots before repotting. For commercial <em>Sansevieria</em> production guidelines,{' '}
            <a
              href="https://edis.ifas.ufl.edu/publication/EP042"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-bold text-[#142B1E] hover:text-[#235837]"
            >
              University of Florida IFAS Extension
            </a>{' '}
            emphasizes well-drained media and well-aerated container environments to prevent root rot pathogens.
          </div>
        </div>

        <TopicalClusterNav currentTab="best-pots" onNavigate={onNavigate} />

      </div>
    </BotanicalSubpageLayout>
  );
}


// ----------------------------------------------------
// SUBMODULE 5: SNAKE PLANT COMPLETE CARE & WATERING GUIDE
// ----------------------------------------------------
export function CareGuideArticle({ onNavigate }: ArticleProps) {
  const [season, setSeason] = useState<'spring' | 'summer' | 'fall' | 'winter'>('spring');

  const seasonalRoutine = {
    spring: {
      guidance: "Growth and water use may begin increasing as light strengthens. Check the potting mix and water when it has dried appropriately.",
      light: "Bright, indirect light is ideal as days lengthen.",
      tip: "If fertilizing, apply an appropriate indoor plant fertilizer conservatively during active growth."
    },
    summer: {
      guidance: "Warmer temperatures and stronger light can increase drying speed, but actual watering frequency still depends on soil, pot, light, airflow, and humidity.",
      light: "Protect from intense afternoon sun which can scorch unacclimated leaves.",
      tip: "Always check soil dryness deep in the root zone before re-watering."
    },
    fall: {
      guidance: "As light levels and growth decrease, the potting mix may take longer to dry. Check moisture before watering rather than maintaining summer routines.",
      light: "Position plants to capture available indirect daylight.",
      tip: "Cease fertilizing as growth slows entering cooler months."
    },
    winter: {
      guidance: "Lower light and cooler conditions often slow water use substantially. Allow adequate drying and be especially cautious about persistently wet soil.",
      light: "Wipe dust off leaves to help maximize daylight capture.",
      tip: "Keep plants away from cold window drafts and heating vents."
    }
  };

  const breadcrumbs = [
    { label: 'Home', tabId: 'home' },
    { label: 'Care Guides', tabId: 'care-guide' },
    { label: 'Complete Care Guide' }
  ];

  const tocItems = [
    { id: 'care-at-a-glance', label: 'Care at a glance' },
    { id: 'soak-and-dry', label: 'Soak and dry method' },
    { id: 'seasonal-planner', label: 'Seasonal care planner' },
    { id: 'light-guidance', label: 'Light requirements' },
    { id: 'environment-guidance', label: 'Temperature & fertilizer' }
  ];

  const relatedGuides = [
    {
      title: 'Root rot signs & recovery',
      description: 'Learn how to recognize yellowing leaves, inspect roots, and rescue a rotting snake plant.',
      tabId: 'root-rot',
      image: '/article-root-rot.jpg'
    },
    {
      title: 'Make your own mix',
      description: 'A simple, balanced DIY 3-2-1 soil mix that keeps roots healthy and prevents excess moisture.',
      tabId: 'diy-mix',
      image: '/mix-bowl.jpg'
    }
  ];

  return (
    <BotanicalSubpageLayout
      categoryBadge="COMPREHENSIVE CULTIVATION GUIDE"
      title="Snake Plant Care Guide: Watering, Light, Soil & Indoor Care"
      introSummary="Learn how to care for a snake plant indoors, including watering, light, soil, pots, seasonal care, fertilizer, and common signs of plant stress."
      heroImage="/hero-botanical-room.jpg"
      heroImageAlt="Thriving snake plant in a bright, modern interior"
      breadcrumbs={breadcrumbs}
      calloutBanner={{
        title: "Water by soil dryness, not a calendar",
        description: "Snake plants are adaptable, but they still need fast-draining soil and careful watering. Allow the potting mix to dry out substantially between waterings, and match water frequency to light and temperature.",
        icon: <Compass className="w-4 h-4 text-[#235837]" />
      }}
      tocItems={tocItems}
      relatedGuides={relatedGuides}
      onNavigate={onNavigate}
    >
      <div className="space-y-8 text-stone-700 leading-relaxed font-sans text-sm sm:text-base">

        {/* Section 1: Care at a Glance Matrix */}
        <section id="care-at-a-glance" className="scroll-mt-24 space-y-4">
          <h2 className="font-serif font-bold text-[#142B1E] text-2xl tracking-tight mb-2">
            Care at a Glance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-sans">
            <div className="bg-white p-4 rounded-xl border border-[#E8E2D5] shadow-2xs">
              <span className="font-bold text-[#142B1E] block mb-1 text-sm">💧 Water</span>
              <p className="text-stone-600 m-0 leading-relaxed">
                Check the potting mix instead of relying on a calendar. Avoid keeping the root zone persistently wet.
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#E8E2D5] shadow-2xs">
              <span className="font-bold text-[#142B1E] block mb-1 text-sm">☀️ Light</span>
              <p className="text-stone-600 m-0 leading-relaxed">
                Tolerates lower light, but performs better with bright indirect light. Avoid treating as a no-light plant.
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#E8E2D5] shadow-2xs">
              <span className="font-bold text-[#142B1E] block mb-1 text-sm">🪴 Soil &amp; Pot</span>
              <p className="text-stone-600 m-0 leading-relaxed">
                Use fast-draining potting media and containers with functional bottom drainage holes.
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#E8E2D5] shadow-2xs">
              <span className="font-bold text-[#142B1E] block mb-1 text-sm">🌡️ Environment</span>
              <p className="text-stone-600 m-0 leading-relaxed">
                Protect from cold drafts. Normal indoor humidity is fine. Fertilize conservatively during active growth.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Soak and Dry Method */}
        <section id="soak-and-dry" className="scroll-mt-24 space-y-4">
          <h2 className="font-serif font-bold text-[#142B1E] text-2xl tracking-tight mb-2">
            The "Soak and Dry" Watering Method
          </h2>
          <p className="font-sans text-stone-600 text-sm leading-relaxed">
            Watering frequency for indoor snake plants should be dictated by soil dryness rather than a fixed calendar schedule. Environmental conditions such as light, temperature, humidity, and pot material determine how quickly soil dries out:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4 font-sans text-xs sm:text-sm">
            <div className="bg-white border border-[#E8E2D5] p-4 rounded-xl shadow-2xs">
              <span className="font-serif font-bold text-[#142B1E] text-base block mb-1">
                1. Drench Thoroughly When Watering
              </span>
              <p className="text-stone-600 leading-relaxed m-0 text-xs sm:text-sm">
                Pour water evenly around the base of the plant until liquid drains freely out of the bottom drainage hole. This ensures that the entire root zone receives moisture.
              </p>
            </div>
            <div className="bg-white border border-[#E8E2D5] p-4 rounded-xl shadow-2xs">
              <span className="font-serif font-bold text-[#142B1E] text-base block mb-1">
                2. Allow Complete Soil Drying
              </span>
              <p className="text-stone-600 leading-relaxed m-0 text-xs sm:text-sm">
                Allow the potting medium to dry out substantially before watering again. Check moisture levels deep in the container (using a wooden chopstick or finger test) rather than relying solely on the dry surface.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Seasonal Care Guidance Planner */}
        <section id="seasonal-planner" className="scroll-mt-24 space-y-4">
          <h2 className="font-serif font-bold text-[#142B1E] text-2xl tracking-tight mb-2">
            Seasonal Care Guidance Planner
          </h2>
          <p className="font-sans text-stone-600 text-sm leading-relaxed">
            Select a season to learn how changing daylight hours and indoor temperatures alter water consumption:
          </p>

          <div className="bg-[#F4F1EA] rounded-2xl border border-[#E8E2D5] p-5 sm:p-6 shadow-xs my-4" id="seasonal-planner-box">
            <div className="flex flex-wrap gap-2 mb-5">
              {(['spring', 'summer', 'fall', 'winter'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSeason(s)}
                  className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all cursor-pointer font-sans ${
                    season === s 
                      ? 'bg-[#142B1E] text-white shadow-xs' 
                      : 'bg-white hover:bg-stone-100 text-stone-700 border border-[#E8E2D5]'
                  }`}
                  id={`season-btn-${s}`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Output Card */}
            <div className="bg-white p-5 rounded-xl border border-[#E8E2D5] space-y-4 text-xs font-sans">
              <div>
                <span className="font-bold text-[#142B1E] block mb-1 text-sm font-serif">Seasonal Watering Principle:</span>
                <p className="text-stone-700 leading-relaxed m-0">{seasonalRoutine[season].guidance}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-100">
                <div className="bg-[#FAF7F2] p-3 rounded-lg border border-[#E8E2D5]/70">
                  <span className="font-bold text-amber-900 text-[10px] uppercase block tracking-wider font-sans">Light Adjustments</span>
                  <p className="text-xs text-stone-600 mt-1 m-0">{seasonalRoutine[season].light}</p>
                </div>
                <div className="bg-[#FAF7F2] p-3 rounded-lg border border-[#E8E2D5]/70">
                  <span className="font-bold text-[#235837] text-[10px] uppercase block tracking-wider font-sans">Seasonal Tip</span>
                  <p className="text-xs text-stone-600 mt-1 m-0">{seasonalRoutine[season].tip}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Light Guidance */}
        <section id="light-guidance" className="scroll-mt-24 space-y-4">
          <h2 className="font-serif font-bold text-[#142B1E] text-2xl tracking-tight mb-2">
            Light Requirements: How Sunlight Drives Water Use
          </h2>
          <p className="font-sans text-stone-600 text-sm leading-relaxed">
            Sunlight fuels photosynthesis and plant transpiration. Although snake plants are widely known for surviving lower-light conditions, brighter indirect light supports healthier foliage growth and faster water consumption. In low-light rooms, metabolic activity slows, meaning soil moisture evaporates more slowly and root rot risks increase if watering is not reduced accordingly. Direct sunlight can be tolerated if plants are gradually acclimated, though intense afternoon sun can scorch leaves.
          </p>
        </section>

        {/* Section 5: Environment Guidance */}
        <section id="environment-guidance" className="scroll-mt-24 space-y-4">
          <h2 className="font-serif font-bold text-[#142B1E] text-2xl tracking-tight mb-2">
            Temperature, Humidity &amp; Fertilizer
          </h2>
          <div className="space-y-3 font-sans text-xs sm:text-sm text-stone-700">
            <div className="bg-white border border-[#E8E2D5] p-4 rounded-xl shadow-2xs">
              <strong className="text-[#142B1E] block mb-1">Temperature</strong>
              <p className="m-0 leading-relaxed text-stone-600">
                Snake plants prefer warm indoor conditions and should be protected from damaging cold and abrupt cold drafts.
              </p>
            </div>
            <div className="bg-white border border-[#E8E2D5] p-4 rounded-xl shadow-2xs">
              <strong className="text-[#142B1E] block mb-1">Humidity</strong>
              <p className="m-0 leading-relaxed text-stone-600">
                Snake plants tolerate typical dry indoor air and generally do not require routine misting.
              </p>
            </div>
            <div className="bg-white border border-[#E8E2D5] p-4 rounded-xl shadow-2xs">
              <strong className="text-[#142B1E] block mb-1">Fertilizer</strong>
              <p className="m-0 leading-relaxed text-stone-600">
                Snake plants are light feeders. If fertilizing, use an appropriate indoor houseplant fertilizer conservatively during periods of active growth in spring and summer, and follow label instructions. Avoid fertilizing when growth slows during cooler months.
              </p>
            </div>
            <div className="bg-white border border-[#E8E2D5] p-4 rounded-xl shadow-2xs">
              <strong className="text-[#142B1E] block mb-1">Winter Care</strong>
              <p className="m-0 leading-relaxed text-stone-600">
                Growth and water use can slow substantially during periods of shorter days, lower light, or cooler indoor conditions. For detailed winter watering strategies, read our dedicated{' '}
                <button
                  onClick={() => onNavigate?.('winter-guide')}
                  className="text-[#235837] font-bold underline hover:text-[#142B1E] cursor-pointer"
                >
                  Winter Snake Plant Watering Guide
                </button>.
              </p>
            </div>
          </div>
        </section>

        <TopicalClusterNav currentTab="care-guide" onNavigate={onNavigate} />

      </div>
    </BotanicalSubpageLayout>
  );
}
