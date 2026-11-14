import { useState } from 'react';
import { 
  Trees, Beaker, HeartPulse, Layers, Compass, 
  HelpCircle, ChevronRight, Check, AlertCircle, Info,
  Search, Sliders, Droplet, Sun, Wind, Thermometer,
  ShieldCheck, RefreshCw, AlertTriangle, ArrowRight,
  ShoppingBag, ExternalLink, CheckCircle2, Radio, Scissors
} from 'lucide-react';
import InteractiveCalculator from './InteractiveCalculator';
import BestSoilGuide from './BestSoilGuide';
import BotanicalSubpageLayout, { TAB_TO_PATH_MAP } from './BotanicalSubpageLayout';
import { trackEvent } from '../utils/analytics';

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
          const targetUrl = TAB_TO_PATH_MAP[step.id] || `/${step.id}`;
          return (
            <a
              key={step.id}
              href={targetUrl}
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate(step.id);
                }
              }}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer no-underline ${
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
            </a>
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
    { id: 'batch-measurements', label: 'Batch measurement guide' },
    { id: 'live-simulator', label: 'Interactive mix calculator' },
    { id: 'substitutions', label: 'Substitutions & adjustments' },
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
      title="DIY Snake Plant Soil Mix: The 3-2-1 Recipe & Ratio Guide"
      introSummary="Make DIY snake plant soil with a simple 3-2-1 mix: 3 parts potting soil, 2 parts perlite, and 1 part coarse sand. Includes measurements and mixing tips."
      heroImage="/mix-bowl.jpg"
      heroImageAlt="Botanical bowl of mixed DIY snake plant soil components"
      breadcrumbs={breadcrumbs}
      calloutBanner={{
        title: "The 3-2-1 Ratio: 3 Parts Soil, 2 Parts Perlite, 1 Part Sand",
        description: "This simple volumetric ratio creates permanent aeration channels that resist compaction, providing 50% drainage aggregate while anchoring tall snake plant foliage.",
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
        {/* Visible Affiliate Disclosure Banner */}
        <div 
          className="bg-[#EAE4D8]/60 border border-[#DCD5C5] rounded-xl px-4 py-2.5 text-xs text-[#2B3B30] flex items-center gap-2"
          id="affiliate-disclosure-banner"
        >
          <span className="font-sans leading-relaxed">
            <strong>Affiliate disclosure:</strong> Purchases made through links on this page may earn us an advertising commission at no extra cost to you.
          </span>
        </div>

        {/* Intro Body */}
        <div className="space-y-3 font-sans text-stone-700 leading-relaxed text-sm">
          <p className="m-0">
            Mixing your own substrate gives you complete control over aeration, drainage, and ballast weight for tall, top-heavy leaves. While blending bulk ingredients is cost-effective if you maintain several houseplants, repotting just one or two plants is often simpler and more economical with an established commercial blend. If you prefer a pre-mixed bag, explore our ranked review of the{' '}
            <a
              href="/best-snake-plant-soil"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('best-soil');
                }
              }}
              className="text-[#235837] font-bold underline hover:text-[#142B1E]"
            >
              best ready-made snake plant soils
            </a>.
          </p>
        </div>

        {/* Section 1: 3-2-1 Ingredient Breakdown */}
        <section id="ratio-breakdown" className="scroll-mt-24 space-y-4">
          <h2 className="font-serif font-bold text-[#142B1E] text-2xl tracking-tight mb-2">
            The 3-2-1 Ingredient Breakdown
          </h2>
          <p className="font-sans text-stone-600 text-sm leading-relaxed">
            Measure by volume (not by weight), using any consistent scoop, measuring cup, or nursery pot:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 3 Parts Soil */}
            <div className="bg-white border border-[#E8E2D5] rounded-2xl p-4 shadow-xs flex flex-col items-center text-center">
              <span className="bg-[#E5ECE4] text-[#235837] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-3 font-sans">
                3 Parts (50%)
              </span>
              <div className="w-full aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-stone-100 border border-stone-200/60">
                <img src="/pile-soil.jpg" alt="Dark standard potting soil base for snake plant mix" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-serif font-bold text-[#142B1E] text-sm mb-1">Standard Potting Soil</h3>
              <p className="font-sans text-xs text-stone-600 leading-snug m-0">
                Clean organic base providing mild nutrient holding and moisture anchoring.
              </p>
            </div>

            {/* 2 Parts Perlite */}
            <div className="bg-white border border-[#E8E2D5] rounded-2xl p-4 shadow-xs flex flex-col items-center text-center">
              <span className="bg-[#E5ECE4] text-[#235837] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-3 font-sans">
                2 Parts (33⅓%)
              </span>
              <div className="w-full aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-stone-100 border border-stone-200/60">
                <img src="/pile-perlite.jpg" alt="White expanded horticultural perlite for soil aeration and drainage" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-serif font-bold text-[#142B1E] text-sm mb-1">Horticultural Perlite</h3>
              <p className="font-sans text-xs text-stone-600 leading-snug m-0">
                Expanded volcanic glass that prevents compaction and creates oxygen pockets.
              </p>
            </div>

            {/* 1 Part Sand */}
            <div className="bg-white border border-[#E8E2D5] rounded-2xl p-4 shadow-xs flex flex-col items-center text-center">
              <span className="bg-[#E5ECE4] text-[#235837] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-3 font-sans">
                1 Part (16⅔%)
              </span>
              <div className="w-full aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-stone-100 border border-stone-200/60">
                <img src="/pile-sand.jpg" alt="Coarse washed horticultural sand for drainage and ballast" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-serif font-bold text-[#142B1E] text-sm mb-1">Coarse Horticultural Sand</h3>
              <p className="font-sans text-xs text-stone-600 leading-snug m-0">
                Heavy, coarse washed sand that speeds gravity drainage and anchors tall plants.
              </p>
            </div>
          </div>
        </section>

        {/* Section: Batch Measurement Guide */}
        <section id="batch-measurements" className="scroll-mt-24 space-y-4">
          <h2 className="font-serif font-bold text-[#142B1E] text-2xl tracking-tight mb-2">
            Batch Measurement Guide
          </h2>
          <p className="font-sans text-stone-600 text-sm leading-relaxed">
            To mix without guesswork, use these exact volumetric measurements for common batch sizes. (Note: actual soil needed varies by root ball size and container shape rather than pot diameter alone.)
          </p>

          <div className="bg-white border border-[#E8E2D5] rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="bg-[#142B1E] text-white text-[11px] font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Batch Size</th>
                    <th className="py-3 px-4">Potting Soil (50%)</th>
                    <th className="py-3 px-4">Horticultural Perlite (33⅓%)</th>
                    <th className="py-3 px-4">Coarse Sand (16⅔%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2D5] text-stone-700">
                  <tr className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#142B1E]">
                      Small Batch (6 Cups / ~1.4 L)
                    </td>
                    <td className="py-3 px-4">3 cups (710 ml)</td>
                    <td className="py-3 px-4">2 cups (473 ml)</td>
                    <td className="py-3 px-4">1 cup (237 ml)</td>
                  </tr>
                  <tr className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#142B1E]">
                      Medium Batch (12 Cups / ~2.8 L)
                    </td>
                    <td className="py-3 px-4">6 cups (1.42 L)</td>
                    <td className="py-3 px-4">4 cups (946 ml)</td>
                    <td className="py-3 px-4">2 cups (473 ml)</td>
                  </tr>
                  <tr className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#142B1E]">
                      Large Batch (24 Cups / ~5.7 L)
                    </td>
                    <td className="py-3 px-4">12 cups (2.84 L)</td>
                    <td className="py-3 px-4">8 cups (1.89 L)</td>
                    <td className="py-3 px-4">4 cups (946 ml)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <p className="font-sans text-xs text-stone-500 italic mt-1">
            Always measure ingredients dry. If you run out of an ingredient mid-blend, maintain the 3-2-1 volume proportion to keep aeration balanced.
          </p>
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

        {/* Section: Ingredient Substitutions & Environmental Adjustments */}
        <section id="substitutions" className="scroll-mt-24 space-y-4">
          <h2 className="font-serif font-bold text-[#142B1E] text-2xl tracking-tight mb-2">
            Ingredient Substitutions & Environmental Adjustments
          </h2>
          <p className="font-sans text-stone-600 text-sm leading-relaxed">
            The 3-2-1 recipe is a reliable baseline, but you can adjust components based on ingredient availability and your growing conditions:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
            <div className="bg-white border border-[#E8E2D5] rounded-2xl p-5 shadow-xs space-y-3">
              <h3 className="font-serif font-bold text-[#142B1E] text-sm mt-0">
                Practical Ingredient Substitutions
              </h3>
              <ul className="space-y-2 text-stone-600 pl-4 list-disc m-0 leading-relaxed">
                <li>
                  <strong>Perlite alternatives:</strong> Horticultural pumice (does not float to the surface over time) or calcined clay (Turface).
                </li>
                <li>
                  <strong>Sand alternatives:</strong> Coarse poultry grit (crushed insoluble granite) or fine aquarium lava gravel. Never substitute fine play sand or beach sand.
                </li>
                <li>
                  <strong>Potting soil alternatives:</strong> Buffered coconut coir mixed with 10% screened worm castings for clean, peat-free organic body.
                </li>
              </ul>
            </div>

            <div className="bg-white border border-[#E8E2D5] rounded-2xl p-5 shadow-xs space-y-3">
              <h3 className="font-serif font-bold text-[#142B1E] text-sm mt-0">
                Container & Light Adjustments
              </h3>
              <ul className="space-y-2 text-stone-600 pl-4 list-disc m-0 leading-relaxed">
                <li>
                  <strong>Pot material:</strong> Unglazed terracotta breathes and evaporates water through its walls (see our guide to the{' '}
                  <a
                    href="/best-pots-for-snake-plants"
                    onClick={(e) => {
                      if (onNavigate) {
                        e.preventDefault();
                        onNavigate('best-pots');
                      }
                    }}
                    className="text-[#235837] font-bold underline hover:text-[#142B1E]"
                  >
                    best pots for snake plants
                  </a>
                  ). In non-porous plastic or glazed ceramic, increase perlite or pumice to 40% aggregate.
                </li>
                <li>
                  <strong>Lighting conditions:</strong> In low-light rooms with slower dry-down, increase gritty drainage material. If unsure, check your setup with our{' '}
                  <a
                    href="/soil-diagnosis"
                    onClick={(e) => {
                      if (onNavigate) {
                        e.preventDefault();
                        onNavigate('setup-kits');
                      }
                    }}
                    className="text-[#235837] font-bold underline hover:text-[#142B1E]"
                  >
                    interactive soil diagnosis tool
                  </a>.
                </li>
              </ul>
            </div>
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
              <h3 className="font-serif font-bold text-[#142B1E] text-sm mb-1">Measure dry parts</h3>
              <p className="font-sans text-xs text-stone-600 leading-relaxed m-0">
                Scoop 3 parts potting soil, 2 parts perlite, and 1 part sand into a bucket or shallow potting bin.
              </p>
            </div>

            <div className="bg-white border border-[#E8E2D5] rounded-2xl p-4 shadow-xs">
              <div className="w-6 h-6 rounded-full bg-[#142B1E] text-white text-xs font-bold flex items-center justify-center mb-3">
                2
              </div>
              <h3 className="font-serif font-bold text-[#142B1E] text-sm mb-1">Blend thoroughly</h3>
              <p className="font-sans text-xs text-stone-600 leading-relaxed m-0">
                Turn the mix with a trowel or gloved hands until the white perlite and sand are uniformly distributed with no clumps.
              </p>
            </div>

            <div className="bg-white border border-[#E8E2D5] rounded-2xl p-4 shadow-xs">
              <div className="w-6 h-6 rounded-full bg-[#142B1E] text-white text-xs font-bold flex items-center justify-center mb-3">
                3
              </div>
              <h3 className="font-serif font-bold text-[#142B1E] text-sm mb-1">The squeeze test</h3>
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
              rel="sponsored noopener noreferrer"
              onClick={() => {
                trackEvent('affiliate_link_clicked', {
                  productId: 'coarse-sand',
                  productName: 'Perfect Plants Coarse Horticultural Sand',
                  placement: 'diy_mix_article'
                });
              }}
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
          <p className="font-sans text-stone-600 text-xs leading-relaxed mt-2">
            Soil that packs tightly or stays waterlogged deprives root cells of vital oxygen, which is the leading trigger for fungal root decay. If your plant is already showing drooping leaves or dark root discoloration, see our{' '}
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
            for early diagnosis and sequential recovery steps.
          </p>
          <p className="font-sans text-stone-600 text-xs leading-relaxed mt-2">
            Once repotted, establish a thorough soak-and-dry watering routine. Learn exact seasonal watering intervals and signs of dehydration in our complete{' '}
            <a
              href="/snake-plant-care-guide"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('care-guide');
                }
              }}
              className="text-[#235837] font-bold underline hover:text-[#142B1E]"
            >
              snake plant care and watering guide
            </a>.
          </p>
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
    { id: 'can-it-be-saved', label: 'Can it be saved?' },
    { id: 'visual-comparison', label: 'Healthy vs. rotting roots' },
    { id: 'recovery-protocol', label: '5-step recovery guide' },
    { id: 'aftercare', label: 'Aftercare & prevention' }
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
      introSummary="Identify snake plant root rot early. Learn the key symptoms—mushy roots, foul odor, and yellow leaves—plus a 5-step recovery guide to save your plant."
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

        {/* Section 2: Can My Snake Plant Be Saved? */}
        <section id="can-it-be-saved" className="scroll-mt-24 space-y-4">
          <h2 className="font-serif font-bold text-[#142B1E] text-2xl tracking-tight mb-2">
            Can your snake plant be saved?
          </h2>
          <p className="font-sans text-stone-600 text-sm leading-relaxed">
            Before beginning treatment, evaluate how much healthy plant tissue remains. Snake plants are resilient succulents capable of regenerating roots from healthy tissue, but your recovery strategy depends on the condition of the underground rhizome and leaf bases.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4 font-sans text-xs">
            <div className="bg-emerald-50/70 border border-emerald-200/80 p-4 rounded-xl space-y-2">
              <h3 className="text-xs font-bold text-emerald-950 mt-0 flex items-center gap-1.5 uppercase tracking-wide">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Highly Salvageable
              </h3>
              <p className="text-stone-700 leading-relaxed mb-0">
                <strong>Firm rhizome with some healthy roots:</strong> If the thick rhizome is firm and at least a few pale, firm roots remain, the plant will readily bounce back once damaged tissue is removed and soil moisture is corrected.
              </p>
            </div>

            <div className="bg-amber-50/70 border border-amber-200/80 p-4 rounded-xl space-y-2">
              <h3 className="text-xs font-bold text-amber-950 mt-0 flex items-center gap-1.5 uppercase tracking-wide">
                <AlertCircle className="w-4 h-4 text-amber-700" /> Partial Recovery Possible
              </h3>
              <p className="text-stone-700 leading-relaxed mb-0">
                <strong>Firm rhizome without feeder roots:</strong> Even if all fine secondary roots have rotted away, a firm, undamaged rhizome can generate completely new root systems if allowed to dry and potted in dry, gritty substrate.
              </p>
            </div>

            <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl space-y-2">
              <h3 className="text-xs font-bold text-stone-900 mt-0 flex items-center gap-1.5 uppercase tracking-wide">
                <Scissors className="w-4 h-4 text-stone-700" /> Leaf Propagation Fallback
              </h3>
              <p className="text-stone-700 leading-relaxed mb-0">
                <strong>Rhizome and base are rotted:</strong> If the rhizome is black, mushy, or completely disintegrated, the root system cannot be saved. Cut firm, healthy green leaf blades 2–3 inches above any rot and propagate new plants.
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#E8E2D5] rounded-xl p-4 space-y-2 font-sans text-xs text-stone-700 shadow-2xs">
            <h3 className="font-serif font-bold text-[#142B1E] text-sm mt-0">
              How to Inspect the Rhizome
            </h3>
            <p className="leading-relaxed text-stone-600 m-0">
              The <strong>rhizome</strong> is the thick, potato-like horizontal stem growing just below the soil surface that connects leaf clusters. Healthy rhizome tissue feels solid and firm to the touch, and appears pale white, light yellow, or orange when gently nicked. Rotting rhizome tissue feels spongy or collapses under light finger pressure, looks dark brown or black, and often leaks foul-smelling liquid. Any soft or blackened rhizome tissue must be cleanly excised back to clean, firm material before repotting.
            </p>
          </div>
        </section>

        {/* Section 3: Visual Comparison Box */}
        <section id="visual-comparison" className="scroll-mt-24">
          <div className="bg-[#142B1E] text-white rounded-2xl p-5 sm:p-7 shadow-sm">
            <h2 className="font-serif font-bold text-white text-lg sm:text-xl mb-4 leading-snug">
              Healthy roots vs. rotting roots
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Healthy Roots */}
              <div className="bg-white/10 border border-white/15 rounded-xl p-3 sm:p-4 flex flex-col items-center">
                <div className="w-full aspect-[4/3] rounded-lg overflow-hidden mb-3 bg-black/20">
                  <img
                    src="/healthy-roots.jpg"
                    alt="Healthy snake plant roots showing firm, pale tan and white fibers with intact rhizome"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="bg-white text-[#142B1E] text-xs font-bold px-3 py-1 rounded-full font-sans shadow-xs">
                  Healthy: firm and pale
                </span>
              </div>

              {/* Rotting Roots */}
              <div className="bg-white/10 border border-white/15 rounded-xl p-3 sm:p-4 flex flex-col items-center">
                <div className="w-full aspect-[4/3] rounded-lg overflow-hidden mb-3 bg-black/20">
                  <img
                    src="/rotting-roots.jpg"
                    alt="Rotting snake plant roots showing dark brown, mushy, collapsed root fibers"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="bg-white text-[#142B1E] text-xs font-bold px-3 py-1 rounded-full font-sans shadow-xs">
                  Rotting: dark and mushy
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: 5-Step Recovery Action Guide */}
        <section id="recovery-protocol" className="scroll-mt-24 space-y-4">
          <h2 className="font-serif font-bold text-[#142B1E] text-2xl tracking-tight mb-2">
            A step-by-step recovery guide
          </h2>
          <p className="font-sans text-stone-600 text-sm leading-relaxed">
            If you've found root rot, act quickly. Follow this sequential 5-step process to halt tissue decay, give cut surfaces time to seal, and establish safe aftercare.
          </p>

          <div className="space-y-4 font-sans text-xs">
            {/* Step 1 */}
            <div className="bg-white border border-[#E8E2D5] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row gap-4 items-start">
              <div className="relative w-full md:w-56 shrink-0 aspect-[16/11] rounded-xl overflow-hidden bg-stone-100 border border-stone-200/60">
                <img
                  src="/step-inspect-roots.jpg"
                  alt="Inspecting snake plant roots and rhizome for signs of decay"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-[#235837] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                  1
                </div>
              </div>
              <div className="flex-1 space-y-1.5">
                <h3 className="font-serif font-bold text-[#142B1E] text-base mb-1">
                  Step 1: Unpot and inspect roots &amp; rhizomes
                </h3>
                <p className="text-stone-600 leading-relaxed m-0 text-xs sm:text-sm">
                  Gently ease the snake plant from its pot by tilting the container sideways and supporting the base of the foliage. Brush or rinse away wet clinging soil under lukewarm tap water so the entire underground root network and rhizome are clearly visible. Differentiate between firm, pale healthy tissue and dark, stringy, or water-soaked rotting sections.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-[#E8E2D5] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row gap-4 items-start">
              <div className="relative w-full md:w-56 shrink-0 aspect-[16/11] rounded-xl overflow-hidden bg-stone-100 border border-stone-200/60">
                <img
                  src="/step-trim-roots.jpg"
                  alt="Trimming mushy dark root rot tissue with clean pruning shears"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-[#235837] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                  2
                </div>
              </div>
              <div className="flex-1 space-y-1.5">
                <h3 className="font-serif font-bold text-[#142B1E] text-base mb-1">
                  Step 2: Prune damaged tissue with sanitized shears
                </h3>
                <p className="text-stone-600 leading-relaxed m-0 text-xs sm:text-sm">
                  Sanitize your pruning shears or scissors with 70% isopropyl alcohol before making any cuts. Snip away all mushy, dark brown, or foul-smelling roots back to healthy tissue. If rot has reached the rhizome, carefully excise all soft, discolored areas until only firm, crisp, clean flesh remains. Wipe cutting blades with alcohol between cuts to prevent transferring pathogens to healthy tissue.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-[#E8E2D5] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row gap-4 items-start">
              <div className="relative w-full md:w-56 shrink-0 aspect-[16/11] rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#E8E2D5] flex items-center justify-center text-center p-3">
                <div className="space-y-1">
                  <div className="w-10 h-10 rounded-full bg-[#E5ECE4] text-[#235837] flex items-center justify-center mx-auto">
                    <Wind className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-[#142B1E] block">Air-Dry &amp; Callus</span>
                  <span className="text-[10px] text-stone-500 block">Hours to 24–48h</span>
                </div>
                <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-[#235837] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                  3
                </div>
              </div>
              <div className="flex-1 space-y-1.5">
                <h3 className="font-serif font-bold text-[#142B1E] text-base mb-1">
                  Step 3: Disinfect container and allow cut surfaces to dry
                </h3>
                <p className="text-stone-600 leading-relaxed m-0 text-xs sm:text-sm">
                  If you plan to reuse the existing pot, scrub off all old soil residue and soak the container in a 10% household bleach solution for 10 minutes, then rinse and dry completely. Lay the trimmed plant in a warm, dry, shaded room with good air circulation. Minor root cuts typically dry within a few hours, while thicker rhizome cuts benefit from drying 12 to 24–48 hours until a firm, dry callus seals the wound against fungal reinfection. Drying speed varies depending on indoor humidity and airflow—ensure cut surfaces feel completely dry and firm to the touch before potting.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white border border-[#E8E2D5] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row gap-4 items-start">
              <div className="relative w-full md:w-56 shrink-0 aspect-[16/11] rounded-xl overflow-hidden bg-stone-100 border border-stone-200/60">
                <img
                  src="/step-repot-plant.jpg"
                  alt="Repotting salvaged snake plant into dry gritty soil with bottom drainage"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-[#235837] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                  4
                </div>
              </div>
              <div className="flex-1 space-y-1.5">
                <h3 className="font-serif font-bold text-[#142B1E] text-base mb-1">
                  Step 4: Repot into fresh, dry, fast-draining mix
                </h3>
                <p className="text-stone-600 leading-relaxed m-0 text-xs sm:text-sm">
                  Never reuse contaminated old potting soil. Select a container with unobstructed bottom drainage holes, sized to fit the reduced root system snugly without excess empty soil volume. Plant into completely dry, airy substrate—such as our mineral-rich 3-2-1 mix or a dedicated gritty cactus soil. Do not add water at the time of repotting.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-white border border-[#E8E2D5] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row gap-4 items-start">
              <div className="relative w-full md:w-56 shrink-0 aspect-[16/11] rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#E8E2D5] flex items-center justify-center text-center p-3">
                <div className="space-y-1">
                  <div className="w-10 h-10 rounded-full bg-[#E5ECE4] text-[#235837] flex items-center justify-center mx-auto">
                    <Droplet className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-[#142B1E] block">Delayed Watering</span>
                  <span className="text-[10px] text-stone-500 block">Wait 5–7 days</span>
                </div>
                <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-[#235837] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                  5
                </div>
              </div>
              <div className="flex-1 space-y-1.5">
                <h3 className="font-serif font-bold text-[#142B1E] text-base mb-1">
                  Step 5: Safe aftercare &amp; delayed watering resumption
                </h3>
                <p className="text-stone-600 leading-relaxed m-0 text-xs sm:text-sm">
                  Keep the repotted plant in bright, indirect light and warm room temperatures (65°F–80°F). Avoid direct hot sun, which causes water loss from leaves before roots can absorb moisture. Wait 5 to 7 days before introducing a light watering around the root perimeter. If you pruned away extensive root mass, or if your room is cool and humid, extend this dry rest period to 10 to 14 days so the rhizome can establish new root buds without fungal pressure. Gradually transition back to a full soak-and-dry watering cycle only after new root growth begins to anchor the plant firmly.
                </p>
              </div>
            </div>
          </div>

          {/* Extension Sanitation Box */}
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
              recommends scrubbing off soil debris and soaking hard containers in a 10% household bleach solution. Rinse thoroughly and allow to dry before repotting.
            </div>
          </div>
        </section>

        {/* Section 5: Aftercare & Prevention */}
        <section id="aftercare" className="scroll-mt-24 space-y-4">
          <h2 className="font-serif font-bold text-[#142B1E] text-2xl tracking-tight mb-2">
            Aftercare &amp; Long-Term Rot Prevention
          </h2>
          <p className="font-sans text-stone-700 text-sm leading-relaxed">
            Once your plant is stabilized, preventing future moisture saturation is straightforward. Focus on substrate aeration, appropriate container materials, and seasonal watering adjustments:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
            <div className="bg-white border border-[#E8E2D5] rounded-xl p-4 shadow-2xs space-y-2">
              <strong className="text-[#142B1E] block font-serif text-sm">Choose Fast-Draining Substrate</strong>
              <p className="text-stone-600 m-0 leading-relaxed">
                Standard peat-heavy potting soils retain too much water indoors. Formulate your own mix with our{' '}
                <a
                  href="/diy-snake-plant-soil-mix"
                  onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('diy-mix'); } }}
                  className="text-[#235837] font-bold underline hover:text-[#142B1E]"
                >
                  3-2-1 DIY Soil Recipe
                </a>{' '}
                or compare top-rated commercial options in our{' '}
                <a
                  href="/best-snake-plant-soil"
                  onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('best-soil'); } }}
                  className="text-[#235837] font-bold underline hover:text-[#142B1E]"
                >
                  Best Soils Guide
                </a>.
              </p>
            </div>

            <div className="bg-white border border-[#E8E2D5] rounded-xl p-4 shadow-2xs space-y-2">
              <strong className="text-[#142B1E] block font-serif text-sm">Use Porous Containers with Drainage</strong>
              <p className="text-stone-600 m-0 leading-relaxed">
                Ensure your pot has unsealed drainage holes. Unglazed terracotta allows moisture to evaporate through container walls. Learn more in our{' '}
                <a
                  href="/best-pots-for-snake-plants"
                  onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('best-pots'); } }}
                  className="text-[#235837] font-bold underline hover:text-[#142B1E]"
                >
                  Best Pots Guide
                </a>.
              </p>
            </div>

            <div className="bg-white border border-[#E8E2D5] rounded-xl p-4 shadow-2xs space-y-2">
              <strong className="text-[#142B1E] block font-serif text-sm">Follow the Soak-and-Dry Method</strong>
              <p className="text-stone-600 m-0 leading-relaxed">
                Always allow the potting soil to dry thoroughly between waterings. Learn seasonal watering adjustments in our comprehensive{' '}
                <a
                  href="/snake-plant-care-guide"
                  onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('care-guide'); } }}
                  className="text-[#235837] font-bold underline hover:text-[#142B1E]"
                >
                  Snake Plant Care Guide
                </a>.
              </p>
            </div>

            <div className="bg-white border border-[#E8E2D5] rounded-xl p-4 shadow-2xs space-y-2">
              <strong className="text-[#142B1E] block font-serif text-sm">Diagnose Root &amp; Soil Needs</strong>
              <p className="text-stone-600 m-0 leading-relaxed">
                Unsure if your home environment needs gritty or organic soil? Run our interactive{' '}
                <a
                  href="/soil-diagnosis"
                  onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('setup-kits'); } }}
                  className="text-[#235837] font-bold underline hover:text-[#142B1E]"
                >
                  Soil Diagnosis Tool
                </a>{' '}
                to get a personalized substrate recommendation.
              </p>
            </div>
          </div>
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
    { id: 'when-to-repot', label: 'When to repot: 5 key signs' },
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

        {/* Visible Affiliate Disclosure Banner */}
        <div 
          className="bg-[#EAE4D8]/60 border border-[#DCD5C5] rounded-xl px-4 py-2.5 text-xs text-[#2B3B30] flex items-center gap-2"
          id="affiliate-disclosure-banner"
        >
          <span className="font-sans leading-relaxed">
            <strong>Affiliate disclosure:</strong> Purchases made through links on this page may earn us an advertising commission at no extra cost to you.
          </span>
        </div>

        {/* Section 1: Material Comparison */}
        <section id="material-comparison" className="scroll-mt-24 space-y-4">
          <h2 className="font-serif font-bold text-[#142B1E] text-2xl tracking-tight mb-2">
            Comparing Pot Materials: Terracotta, Ceramic &amp; Plastic
          </h2>
          <p className="font-sans text-stone-600 text-sm leading-relaxed">
            Container materials interact directly with your potting soil, indoor humidity, ambient temperatures, and watering frequency. Choosing the right container material helps maintain balanced moisture levels for snake plant roots. For an in-depth audio breakdown, listen to Snake Plant Radio Episode 4:{' '}
            <a
              href="/radio/terracotta-vs-ceramic-vs-plastic"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('radio/terracotta-vs-ceramic-vs-plastic');
                }
              }}
              className="text-[#235837] font-bold underline hover:text-[#142B1E]"
            >
              Terracotta vs Ceramic vs Plastic: The Pot Episode
            </a>.
          </p>
          <p className="font-sans text-stone-600 text-sm leading-relaxed">
            Container wall porosity directly affects evaporation rates and how quickly the root zone dries out between deep waterings. Learn more about establishing a healthy drying rhythm in our{' '}
            <a
              href="/snake-plant-care-guide"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('care-guide');
                }
              }}
              className="text-[#235837] font-bold underline hover:text-[#142B1E]"
            >
              snake plant watering and care guide
            </a>. When using nonporous containers like glazed ceramic or plastic, compensate for reduced evaporation by pairing them with a fast-draining potting substrate containing at least 40% inorganic aerators—such as our recommended commercial mixes in our{' '}
            <a
              href="/best-snake-plant-soil"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('best-soil');
                }
              }}
              className="text-[#235837] font-bold underline hover:text-[#142B1E]"
            >
              best snake plant soil guide
            </a>{' '}
            or our homemade{' '}
            <a
              href="/diy-snake-plant-soil-mix"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('diy-mix');
                }
              }}
              className="text-[#235837] font-bold underline hover:text-[#142B1E]"
            >
              DIY 3-2-1 soil recipe
            </a>.
          </p>

          {/* Responsive Material Comparison Table */}
          <div className="overflow-x-auto my-6 rounded-xl border border-[#E8E2D5] bg-white shadow-2xs">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-[#E8E2D5] text-[#142B1E]">
                  <th className="py-3 px-3.5 font-bold uppercase tracking-wider text-[11px]">Material</th>
                  <th className="py-3 px-3.5 font-bold uppercase tracking-wider text-[11px]">Porosity &amp; Evaporation</th>
                  <th className="py-3 px-3.5 font-bold uppercase tracking-wider text-[11px]">Weight &amp; Stability</th>
                  <th className="py-3 px-3.5 font-bold uppercase tracking-wider text-[11px]">Key Advantages</th>
                  <th className="py-3 px-3.5 font-bold uppercase tracking-wider text-[11px]">Disadvantages</th>
                  <th className="py-3 px-3.5 font-bold uppercase tracking-wider text-[11px]">Best Use Case</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D5]/70 text-stone-600">
                <tr className="hover:bg-[#FAF7F2]/50 transition-colors">
                  <td className="py-3 px-3.5 font-bold text-[#235837] whitespace-nowrap">
                    Unglazed Terracotta
                  </td>
                  <td className="py-3 px-3.5">
                    High porosity. Transpires moisture through container walls and top surface.
                  </td>
                  <td className="py-3 px-3.5 font-medium text-stone-800">
                    Heavy ballast. Superior stability against tall upright leaf tipping.
                  </td>
                  <td className="py-3 px-3.5">
                    Fast, uniform soil drying; reduces prolonged saturation risk; classic natural look.
                  </td>
                  <td className="py-3 px-3.5">
                    Dries rapidly in dry air; fragile if dropped; white mineral salt patina develops over time.
                  </td>
                  <td className="py-3 px-3.5">
                    Indoor growers prone to overwatering; tall cultivars; humid climates.
                  </td>
                </tr>
                <tr className="hover:bg-[#FAF7F2]/50 transition-colors">
                  <td className="py-3 px-3.5 font-bold text-amber-900 whitespace-nowrap">
                    Glazed Ceramic
                  </td>
                  <td className="py-3 px-3.5">
                    Nonporous. Seals moisture inside; evaporation occurs only from soil surface.
                  </td>
                  <td className="py-3 px-3.5 font-medium text-stone-800">
                    Heavy ballast. Strong tipping resistance for mature plants.
                  </td>
                  <td className="py-3 px-3.5">
                    Attractive colors and finishes; retains moisture longer in arid, heated winter rooms.
                  </td>
                  <td className="py-3 px-3.5">
                    Longer drying intervals; often sold without drainage holes (must verify or drill).
                  </td>
                  <td className="py-3 px-3.5">
                    Infrequent waterers; decorative living spaces; pair with 40%+ mineral soil.
                  </td>
                </tr>
                <tr className="hover:bg-[#FAF7F2]/50 transition-colors">
                  <td className="py-3 px-3.5 font-bold text-stone-700 whitespace-nowrap">
                    Plastic &amp; Nursery Liners
                  </td>
                  <td className="py-3 px-3.5">
                    Nonporous. Zero sidewall evaporation; holds root moisture longest.
                  </td>
                  <td className="py-3 px-3.5 font-medium text-stone-800">
                    Lightweight. High tip-over risk with tall foliage unless placed in cachepot.
                  </td>
                  <td className="py-3 px-3.5">
                    Inexpensive, shatterproof; flexible walls simplify unpotting and root inspection.
                  </td>
                  <td className="py-3 px-3.5">
                    Soil stays wet longer; prone to tipping; plastic degrades under intense sunlight.
                  </td>
                  <td className="py-3 px-3.5">
                    Drop-in liner inside heavy decorative outer cachepot; propagation setups.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl p-3.5 text-xs text-stone-600 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#235837] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#142B1E]">Important Drainage Context:</strong> Regardless of whether you select unglazed terracotta, glazed ceramic, or plastic, functional bottom drainage holes and disciplined soak-and-dry watering are essential. While porous terracotta increases sidewall transpiration, it cannot prevent root rot if a plant sits in waterlogged, dense soil or standing saucer water.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            <div className="p-4 rounded-xl border border-[#E8E2D5] bg-white shadow-2xs space-y-2">
              <h3 className="text-xs font-bold text-[#235837] uppercase tracking-wider block font-sans m-0">
                1. Unglazed Terracotta (Porous Clay)
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed m-0 font-sans">
                Porous unglazed clay allows moisture to transpire through container walls as well as from the surface, helping soil dry more evenly. The heavy weight of clay provides excellent stability for tall, upright foliage. However, soil may dry faster in arid environments, and natural mineral deposits (efflorescence) can form on outer walls over time.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#E8E2D5] bg-white shadow-2xs space-y-2">
              <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider block font-sans m-0">
                2. Glazed Ceramic
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed m-0 font-sans">
                Glazed ceramic surfaces seal moisture inside, preventing wall evaporation so soil dries primarily from the top surface down. Glazed pots are heavy and stable, working very well when equipped with functional bottom drainage holes and paired with a fast-draining, well-aerated potting mix.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#E8E2D5] bg-white shadow-2xs space-y-2">
              <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider block font-sans m-0">
                3. Plastic Containers &amp; Liners
              </h3>
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
            Container selection must always be guided by the <strong>actual size of the root ball and rhizome mass</strong>, rather than leaf height. Snake plants thrive when their root systems fit snugly. Sizing up prematurely adds excessive unoccupied soil volume, which acts like a waterlogged sponge holding stagnant moisture around sensitive root tips for weeks.
          </p>
          <p className="font-sans text-stone-600 text-sm leading-relaxed">
            When repotting is necessary, experienced growers look for a container with an <strong>interior rim diameter approximately 1 to 2 inches larger</strong> than the current root system. Always measure interior dimensions—thick terracotta or glazed ceramic rims can reduce usable planting width by up to an inch. If you want to check your soil density and moisture retention before repotting, try our interactive{' '}
            <a
              href="/soil-diagnosis"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('setup-kits');
                }
              }}
              className="text-[#235837] font-bold underline hover:text-[#142B1E]"
            >
              soil diagnosis assessment
            </a>.
          </p>

          {/* Simple Practical Pot Sizing Reference */}
          <div className="bg-white border border-[#E8E2D5] rounded-xl p-5 shadow-2xs space-y-4 my-4 font-sans text-xs sm:text-sm">
            <h3 className="font-serif font-bold text-[#142B1E] text-base m-0 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#235837]" /> Practical Pot Sizing Principles
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="p-3.5 rounded-lg bg-[#FAF7F2] border border-[#E8E2D5]/70 space-y-1">
                <span className="font-bold text-[#142B1E] block">1. Measure the Root Mass Directly</span>
                <p className="text-stone-600 text-xs m-0 leading-relaxed">
                  Inspect the underground root ball and rhizome cluster directly. Base container sizing on root volume, not the height or spread of top foliage.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#FAF7F2] border border-[#E8E2D5]/70 space-y-1">
                <span className="font-bold text-[#142B1E] block">2. Step Up 1–2 Inches Interior</span>
                <p className="text-stone-600 text-xs m-0 leading-relaxed">
                  When repotting is warranted, choose a vessel with an interior diameter roughly 1 to 2 inches larger than the root ball, leaving a modest 0.5 to 1 inch soil margin.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#FAF7F2] border border-[#E8E2D5]/70 space-y-1">
                <span className="font-bold text-[#142B1E] block">3. Adjust to Plant Condition</span>
                <p className="text-stone-600 text-xs m-0 leading-relaxed">
                  The appropriate increase depends on plant condition and growth rate. Vigorous clumps in bright light can handle a 2-inch increase, while slower growers, compact cultivars, or lower-light plants do best with a conservative 1-inch step-up.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#FAF7F2] border border-[#E8E2D5]/70 space-y-1">
                <span className="font-bold text-[#142B1E] block">4. Accommodate Depth Without Excess Soil</span>
                <p className="text-stone-600 text-xs m-0 leading-relaxed">
                  Snake plants have horizontal, shallow rhizomes. Pot depth should comfortably house the root system without unnecessarily excessive soil volume sitting waterlogged beneath the roots.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#FAF7F2] border border-[#E8E2D5]/70 space-y-1 md:col-span-2">
                <span className="font-bold text-[#142B1E] block">5. Provide Ballast for Tall Foliage</span>
                <p className="text-stone-600 text-xs m-0 leading-relaxed">
                  Tall leaves create physical tipping leverage. Stabilize top-heavy plants with appropriately weighted, stable containers (like heavy unglazed terracotta), not by automatically increasing pot width.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#F4F1EA] p-5 sm:p-6 rounded-2xl border border-[#E8E2D5] shadow-xs my-4" id="sizing-calculator-box">
            <h3 className="font-serif font-bold text-[#142B1E] text-lg flex items-center gap-2 mb-2">
              <Sliders className="w-4 h-4 text-[#235837]" /> Interactive Pot Sizing Estimator
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

        {/* Section: When to Repot */}
        <section id="when-to-repot" className="scroll-mt-24 space-y-4">
          <h2 className="font-serif font-bold text-[#142B1E] text-2xl tracking-tight mb-2">
            When to Repot a Snake Plant: 5 Key Signs
          </h2>
          <p className="font-sans text-stone-600 text-sm leading-relaxed">
            Snake plants grow slowly and tolerate being root-bound far better than most tropical houseplants. Repotting is typically only necessary every 2 to 3 years. Rather than repotting on a strict schedule, evaluate your plant for these five physical indicators:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 my-4">
            <div className="p-4 rounded-xl border border-[#E8E2D5] bg-white shadow-2xs space-y-1.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#235837] shrink-0" />
                <h3 className="font-serif font-bold text-stone-900 text-sm m-0">
                  1. Roots Emerging from Drainage Holes
                </h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed m-0 font-sans">
                Thick roots pushing through bottom drainage apertures indicate the root ball has completely colonized the container depth and has nowhere else to expand.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#E8E2D5] bg-white shadow-2xs space-y-1.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#235837] shrink-0" />
                <h3 className="font-serif font-bold text-stone-900 text-sm m-0">
                  2. Rhizomes Pressing Container Walls
                </h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed m-0 font-sans">
                Fleshy rhizomes pushing firmly against the interior pot wall or attempting to climb over the pot rim indicate the underground root system is ready for division or a modest pot step-up.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#E8E2D5] bg-white shadow-2xs space-y-1.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#235837] shrink-0" />
                <h3 className="font-serif font-bold text-stone-900 text-sm m-0">
                  3. Bulging or Distorted Pot Walls
                </h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed m-0 font-sans">
                Circular plastic pots deformed into ovals or bulging visibly outward are under extreme internal pressure from powerful rhizomes. Terracotta pots may occasionally crack from outward expansion.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#E8E2D5] bg-white shadow-2xs space-y-1.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#235837] shrink-0" />
                <h3 className="font-serif font-bold text-stone-900 text-sm m-0">
                  4. Severely Crowded Root Mass
                </h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed m-0 font-sans">
                When inspecting the root ball, dense encircling roots have displaced most of the soil substrate, leaving little potting medium to hold hydration and nutrients.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#E8E2D5] bg-white shadow-2xs space-y-1.5 md:col-span-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#235837] shrink-0" />
                <h3 className="font-serif font-bold text-stone-900 text-sm m-0">
                  5. Rapid Drying or Water Channeling
                </h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed m-0 font-sans">
                When roots completely displace soil, water either channels straight through along the pot wall without absorbing, or the potting mix dries out completely in under 48 hours following a thorough soak.
              </p>
            </div>
          </div>

          <div className="bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl p-3.5 text-xs text-stone-600 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#235837] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#142B1E]">Repotting Evaluation Rule:</strong> Always assess these indicators together rather than reacting to a single sign. A lone root escaping through a drainage hole is not an immediate emergency. If your snake plant remains healthy, stable, and produces new growth, wait until spring or early summer active growing months before repotting.
            </div>
          </div>
        </section>

        {/* Section 3: Practical Container Drainage Rules */}
        <section id="drainage-rules" className="scroll-mt-24 space-y-4">
          <h2 className="font-serif font-bold text-[#142B1E] text-2xl tracking-tight mb-2">
            Practical Container Drainage Rules
          </h2>
          <p className="font-sans text-stone-600 text-sm leading-relaxed">
            Even the best container material cannot compensate for improper drainage mechanics. Snake plant root cells require oxygen exchange; stagnant water around roots causes rapid cellular collapse and fungal infections. Follow these three cardinal drainage practices:
          </p>
          <div className="space-y-3 font-sans text-xs sm:text-sm text-stone-700">
            <div className="bg-white border border-[#E8E2D5] p-4 rounded-xl shadow-2xs">
              <h3 className="text-sm font-bold text-[#142B1E] block mb-1 font-serif">
                1. Ensure Functional Bottom Drainage
              </h3>
              <p className="m-0 leading-relaxed text-stone-600">
                Containers used for direct planting must feature open bottom drainage holes (at least 0.5 to 0.75 inches wide). Never plant a snake plant directly into a sealed vessel or cachepot without drainage. If you love a decorative un-drilled ceramic pot, keep the plant in a plastic nursery liner inside it.
              </p>
            </div>
            <div className="bg-white border border-[#E8E2D5] p-4 rounded-xl shadow-2xs">
              <h3 className="text-sm font-bold text-[#142B1E] block mb-1 font-serif">
                2. The Gravel Layer Myth
              </h3>
              <p className="m-0 leading-relaxed text-stone-600">
                Adding gravel, broken pottery shards, or pebbles to the bottom of a pot without drainage holes does not create drainage. In soil physics, this creates a <em>perched water table</em>: water saturates the finer soil above the coarse stones until hydrostatic pressure forces it down, keeping saturated mud right against root tips. Real drainage requires an open exit path.
              </p>
            </div>
            <div className="bg-white border border-[#E8E2D5] p-4 rounded-xl shadow-2xs">
              <h3 className="text-sm font-bold text-[#142B1E] block mb-1 font-serif">
                3. Saucer &amp; Cachepot Care
              </h3>
              <p className="m-0 leading-relaxed text-stone-600">
                After watering your snake plant thoroughly, allow all excess drainage water to exit completely into the saucer or cachepot, and empty it within 15 to 30 minutes. Allowing the pot bottom to sit submerged in pooled runoff water wicks moisture back up into the root zone, suffocating root tissue. If you suspect your plant has already suffered from prolonged saturation, follow our{' '}
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
                  root rot diagnostic and rescue guide
                </a>{' '}
                to inspect and prune damaged roots.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Recommended Containers */}
        <section id="recommended-option" className="scroll-mt-24 space-y-4">
          <h2 className="font-serif font-bold text-[#142B1E] text-2xl tracking-tight mb-2">
            Recommended containers for snake plants
          </h2>
          <p className="font-sans text-stone-600 text-sm leading-relaxed">
            While any container with functional drainage can support a snake plant, our top recommendation for small to medium plants is an unglazed terracotta cylinder pot with a matching saucer. Its porous clay sidewalls promote uniform transpiration and root aeration:
          </p>
          <div className="bg-[#FAF7F2] border border-[#E8E2D5] rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-center gap-6 text-xs">
            <img 
              src="/terracotta-cylinder-planter.png" 
              alt="D'vine Dev Terracotta Cylinder Planter Pot with Drainage and Saucer" 
              className="w-28 h-28 object-contain rounded-xl bg-white p-2 border border-[#E8E2D5] shrink-0"
              loading="lazy"
            />
            <div className="flex-grow space-y-2 font-sans text-left">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold text-[#235837] bg-[#E2EFE5] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Top Recommended Container
                </span>
                <span className="text-[10px] font-semibold text-stone-500">
                  D'vine Dev
                </span>
              </div>
              <h3 className="font-serif font-bold text-[#142B1E] text-base sm:text-lg m-0 flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-[#235837]" /> D'vine Dev Terracotta Cylinder Pot with Saucer (6-Inch)
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed m-0">
                Porous unglazed terracotta allows excess soil moisture to transpire evenly across container sidewalls, significantly shortening drying cycles compared to plastic or glazed ceramic. Features a 6″ exterior diameter (approx. 5.5″ interior diameter), pre-drilled bottom drainage hole, stainless steel drainage mesh net, and a matching detachable saucer.
              </p>
              <div className="text-[10px] text-stone-400 pt-1">
                Affiliate disclosure: Purchases made through Amazon links may earn us an advertising commission at no extra cost to you.
              </div>
            </div>
            <a 
              href="https://www.amazon.com/Terracotta-Drainage-Cylinder-Planter-587-42-0/dp/B08QYLP91Q?th=1&tag=snakeplantsoi-20" 
              target="_blank" 
              rel="sponsored noopener noreferrer"
              onClick={() => {
                trackEvent('affiliate_link_clicked', {
                  productId: 'clay-terracotta',
                  productName: "D'vine Dev Terracotta Cylinder Pot",
                  placement: 'best_pots_article'
                });
              }}
              className="shrink-0 bg-[#142B1E] hover:bg-[#235837] text-white font-bold py-2.5 px-5 rounded-full font-sans text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <span>Check Price on Amazon</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#9EC4A9]" />
            </a>
          </div>

          <div className="bg-white border border-[#E8E2D5] rounded-xl p-4 text-xs font-sans text-stone-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div>
              <strong className="text-[#142B1E] block mb-0.5">Need a larger container for mature plants?</strong>
              <span>If your snake plant has outgrown a 6-inch vessel and has a 7–8″ or larger root ball, step up to an 8-inch or 10-inch terracotta container.</span>
            </div>
            <a
              href="https://www.amazon.com/s?k=8+Inch+Terracotta+Clay+Pot+with+drainage+hole&tag=snakeplantsoi-20"
              target="_blank"
              rel="sponsored noopener noreferrer"
              onClick={() => {
                trackEvent('affiliate_link_clicked', {
                  productId: 'clay-terracotta-8inch-search',
                  productName: '8-Inch Terracotta Search',
                  placement: 'best_pots_article_secondary'
                });
              }}
              className="shrink-0 bg-stone-100 hover:bg-stone-200 text-[#142B1E] font-bold py-2 px-4 rounded-lg text-xs flex items-center gap-1.5 transition-colors border border-stone-200"
            >
              <span>Search 8-Inch Pots</span>
              <ExternalLink className="w-3 h-3 text-stone-500" />
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
          <p className="font-sans text-stone-600 text-xs leading-relaxed mt-2">
            Persistent moisture without drying periods is the most common cause of fungal root damage. If you notice lower leaves turning yellow, mushy bases, or a damp foul odor, consult our{' '}
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
            immediately to inspect and salvage the root system.
          </p>
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
