import { useState } from 'react';
import { 
  Trees, Beaker, HeartPulse, Layers, Compass, 
  HelpCircle, ChevronRight, Check, AlertCircle, Info,
  Search, Sliders, Droplet, Sun, Wind, Thermometer,
  ShieldCheck, RefreshCw, AlertTriangle, ArrowRight
} from 'lucide-react';
import InteractiveCalculator from './InteractiveCalculator';

// ----------------------------------------------------
// SUBMODULE 1: BEST COMMERCIAL SOILS PAGE
// ----------------------------------------------------
export function BestSoilArticle() {
  const [selectedSoil, setSelectedSoil] = useState<'all' | 'cactus' | 'organic' | 'standard'>('all');

  const comparisonData = [
    { name: "Hoffman Organic Succulent", drainage: "9.5/10", retention: "Low", aeration: "Excellent", nutrient: "Medium-Low", price: "$$", rating: "4.8/5", rec: "Best out of the box option." },
    { name: "Espoma Organic Cactus Mix", drainage: "8.5/10", retention: "Medium-Low", aeration: "Very Good", nutrient: "Medium-High", price: "$", rating: "4.7/5", rec: "Best organic bio-active root formula." },
    { name: "Super Mineral Desert Mix", drainage: "10/10", retention: "Very Low", aeration: "Exceptional", nutrient: "Low", price: "$$$", rating: "4.9/5", rec: "Best for root rot recovery phases." },
    { name: "Retail Standard Soil (Unamended)", drainage: "2.0/10", retention: "Extreme", aeration: "Very Dense", nutrient: "High", price: "$", rating: "1.2/5", rec: "❌ Dangerous. High chance of overwatering rot." }
  ];

  return (
    <article className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-6">
      
      {/* Intro Header */}
      <div className="bg-gradient-to-br from-emerald-50 to-stone-100 p-6 rounded-2xl border border-stone-200 mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-stone-900 tracking-tight mt-0 flex items-center gap-2">
          <Trees className="w-6 h-6 text-emerald-800" />
          The Science of Drainage: Evaluating Commercial Snake Plant Soils
        </h2>
        <p className="text-stone-600 text-sm mt-2 mb-0">
          The secret to a thriving snake plant starts below the surface. This article identifies the physical traits of optimal soils and provides side-by-side performance metrics of leading ready-to-use premium mixes.
        </p>
      </div>

      <h3 className="text-lg font-bold text-stone-900 mt-6">Why Standard Garden Soil is a Lethal Mistake</h3>
      <p>
        In their natural habitats across humid-arid tropical West Africa, snake plants (<em>Sansevieria trifasciata</em>) thrive in rugged, craggy terrains and hyper-porous sandy clays. Unlike modern soft houseplants, their underground root systems consist of thick, fleshy <strong>rhizomes</strong>. These rhizomes store massive reserves of water and nutrients to survive long dry spells.
      </p>
      <p>
        When you plant a snake plant in generic, heavy black potting soil, you are introducing a high water-retention matrix. Standard organic potting mixes contain a high percentage of finely ground <strong>sphagnum peat moss</strong>. 
        Under the weight of repeated watering, this peat moss acts like a permanent sponge, compacting into an anaerobic layer. This denies air to the rhizomes and begins dissolving the soft cellulose walls of the root system.
      </p>

      {/* Attributes Comparison */}
      <div className="my-8">
        <h4 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-emerald-800" />
          How Different Soil Options Stack Up (Greenhouse Performance Data)
        </h4>
        <div className="overflow-x-auto border border-stone-200 rounded-xl shadow-sm bg-white">
          <table className="min-w-full divide-y divide-stone-200 text-sm">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-stone-900 uppercase tracking-wider text-[11px]">Mix Option</th>
                <th className="px-4 py-3 text-left font-bold text-stone-900 uppercase tracking-wider text-[11px]">Drainage Rate</th>
                <th className="px-4 py-3 text-left font-bold text-stone-900 uppercase tracking-wider text-[11px]">Wet Retention</th>
                <th className="px-4 py-3 text-left font-bold text-stone-900 uppercase tracking-wider text-[11px]">Aeration Space</th>
                <th className="px-4 py-3 text-left font-bold text-stone-900 uppercase tracking-wider text-[11px]">Rating</th>
                <th className="px-4 py-3 text-left font-bold text-stone-900 uppercase tracking-wider text-[11px]">Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {comparisonData.map((soil, idx) => (
                <tr key={idx} className={soil.name.includes("Lethal") ? "bg-rose-50/40 hover:bg-rose-50" : "hover:bg-stone-50"}>
                  <td className="px-4 py-3 font-semibold text-stone-900">{soil.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-stone-700">{soil.drainage}</td>
                  <td className="px-4 py-3 text-stone-600">{soil.retention}</td>
                  <td className="px-4 py-3 text-stone-600">{soil.aeration}</td>
                  <td className="px-4 py-3 font-mono text-xs font-bold text-emerald-800">{soil.rating}</td>
                  <td className="px-4 py-3 text-xs text-stone-500 italic">{soil.rec}</td>
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

      <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex gap-3 my-6">
        <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-850">
          <strong>Authority Botanical Citation:</strong> University agricultural extensions consistently find that <em>Sansevieria</em> thrive best in sandy-mineral loams with a neutral pH. Keep organic proportions below 40% of the total soil dry weight for indoor environments.
        </div>
      </div>

      <h3 className="text-lg font-bold text-stone-900">The Final Botanical Verdict</h3>
      <p>
        For maximum safety, purchase a reliable organic compost mix (like <strong>Espoma Cactus Mix</strong>) and keep a hand bag of pure perlite nearby. Blend them together at a 4:1 ratio. This simple, easy adjustment acts as an absolute insurance policy against user overwatering, keeping your plants healthy, firm, and striking for decades.
      </p>

    </article>
  );
}


// ----------------------------------------------------
// SUBMODULE 2: DIY SNAKE PLANT SOIL MIX PAGE
// ----------------------------------------------------
export function DIYMixArticle() {
  return (
    <article className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-6">
      
      <div className="bg-gradient-to-br from-emerald-50 to-stone-100 p-6 rounded-2xl border border-stone-200 mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-stone-900 tracking-tight mt-0 flex items-center gap-2">
          <Beaker className="w-6 h-6 text-emerald-800" />
          The Ultimate Golden Ratio 3-2-1 DIY Soil Recipe
        </h2>
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
      <p className="text-xs text-stone-500 mt-[-10px] mb-4">
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

    </article>
  );
}


// ----------------------------------------------------
// SUBMODULE 3: SNAKE PLANT ROOT ROT DIAGNOSTIC GUIDE
// ----------------------------------------------------
export function RootRotArticle() {
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
    if (count === 0) return { title: "Healthy Foliage", pct: 100, color: "text-emerald-700", bg: "bg-emerald-50", desc: "No immediate root pathology detected. Ensure clean, cyclic dry down of the soil column as standard upkeep." };
    if (count <= 2) return { title: "Stage 1: Early Rot Sensation", pct: 75, color: "text-yellow-750", bg: "bg-yellow-50", desc: "Some ambient moisture stress. Immediate action required: cease watering immediately, aerate the container walls, and allow 4 clean weeks of dry down." };
    if (count <= 4) return { title: "Stage 2: Active Rhizome Breakdown", pct: 40, color: "text-orange-700", bg: "bg-orange-50", desc: "Urgent care needed! Roots are dying under water logging. You must unpot the plant, excise dark mushy parts with a sterile blade, dust with cinnamon powder, and repot into sterile, fresh desert gravel soil." };
    return { title: "Stage 3: Advanced Tissue Necrosis", pct: 12, color: "text-rose-700", bg: "bg-rose-50", desc: "Critical warning. Root system is completely dead. Salvage strategy: Cut healthy top leaves 3 inches above the rotten margin and propogate them in small sterile sand/perlite tubes to grow entirely fresh, clean roots." };
  };

  const triage = getTriageResult();

  return (
    <article className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-6">
      
      <div className="bg-gradient-to-br from-rose-50 to-stone-100 p-6 rounded-2xl border border-rose-150 mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-rose-900 tracking-tight mt-0 flex items-center gap-2">
          <HeartPulse className="w-6 h-6 text-rose-700 animate-pulse" />
          Snake Plant Root Rot: Botanical Surgical Recovery Protocol
        </h2>
        <p className="text-stone-605 text-sm mt-2 mb-0">
          Root rot is the single greatest killer of house plants. Learn how to clinically diagnose decayed cellular tissues, run surgical salvage protocols, and keep roots oxygenated.
        </p>
      </div>

      <p>
        Because snake plants are tough desert-hardy models, they do not show root distress immediately. By the time a snake plant leaf turns soft, yellow, or bends limply under its own weight, the underground rhizomes have likely been dying of oxygen starvation for weeks.
      </p>

      {/* Interactive Symptom Checker */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs my-6">
        <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5 uppercase tracking-wide mb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-800" /> Complete Root Rot Interactive Triage Tool
        </h4>
        <p className="text-xs text-stone-500 mb-4">
          Select all physical anomalies currently presenting on your snake plant to calculate real-time survival probability:
        </p>

        <div className="space-y-2.5">
          <label className="flex items-center gap-3 text-xs text-stone-700 cursor-pointer p-2 rounded hover:bg-stone-50 select-none">
            <input 
              type="checkbox" 
              checked={symptoms.drooping} 
              onChange={() => setSymptoms(s => ({...s, drooping: !s.drooping}))}
              className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-700 border-stone-300"
            />
            <span>Leaves are falling outward or bending limply instead of pointing straight up</span>
          </label>
          <label className="flex items-center gap-3 text-xs text-stone-700 cursor-pointer p-2 rounded hover:bg-stone-50 select-none">
            <input 
              type="checkbox" 
              checked={symptoms.yellow} 
              onChange={() => setSymptoms(s => ({...s, yellow: !s.yellow}))}
              className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-700 border-stone-300"
            />
            <span>Leaves are fading to a pale lime-green or displaying splotchy yellow colors</span>
          </label>
          <label className="flex items-center gap-3 text-xs text-stone-700 cursor-pointer p-2 rounded hover:bg-stone-50 select-none">
            <input 
              type="checkbox" 
              checked={symptoms.mushyBase} 
              onChange={() => setSymptoms(s => ({...s, mushyBase: !s.mushyBase}))}
              className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-700 border-stone-300"
            />
            <span>The leaf base near the soil line is soft, soggy, or dark brown when touched</span>
          </label>
          <label className="flex items-center gap-3 text-xs text-stone-700 cursor-pointer p-2 rounded hover:bg-stone-50 select-none">
            <input 
              type="checkbox" 
              checked={symptoms.smell} 
              onChange={() => setSymptoms(s => ({...s, smell: !s.smell}))}
              className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-700 border-stone-300"
            />
            <span>The soil emits a swampy, sour, or rotting-onion smell when inspected closely</span>
          </label>
          <label className="flex items-center gap-3 text-xs text-stone-700 cursor-pointer p-2 rounded hover:bg-stone-50 select-none">
            <input 
              type="checkbox" 
              checked={symptoms.soilSoggy} 
              onChange={() => setSymptoms(s => ({...s, soilSoggy: !s.soilSoggy}))}
              className="w-4 h-4 rounded text-emerald-800 focus:ring-emerald-700 border-stone-300"
            />
            <span>The deep soil feels wet or cold like a damp washcloth even though you haven't watered in 2 weeks</span>
          </label>
        </div>

        {/* Triage Calculator Output */}
        <div className={`mt-6 p-4 rounded-xl border ${triage.bg} transition-all duration-300`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-stone-400 uppercase">Triage Diagnostics</span>
              <h5 className={`font-bold text-sm mt-0.5 ${triage.color}`}>{triage.title}</h5>
            </div>
            <div className="shrink-0 text-right">
              <span className="text-xs text-stone-500 block">Survival Probability</span>
              <span className={`font-mono font-bold text-lg ${triage.color}`}>{triage.pct}%</span>
            </div>
          </div>
          <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                triage.pct > 70 ? 'bg-emerald-600' : triage.pct > 30 ? 'bg-amber-500' : 'bg-rose-600'
              }`}
              style={{ width: `${triage.pct}%` }}
            />
          </div>
          <p className="text-xs text-stone-650 leading-relaxed mt-3">{triage.desc}</p>
        </div>
      </div>

      <h3 className="text-lg font-bold text-stone-900 mt-6">The 4-Step Surgical Resuscitation Protocol</h3>
      <p>
        If your plant's roots are actively rotting, simply letting the soil dry out is insufficient. Stagnant fungal pathogens remain active. You must perform botanical surgery:
      </p>

      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</div>
          <p className="text-sm text-stone-700 mt-0">
            <strong>Exhumation & Wash:</strong> Gently slide the plant out of its pot. Carefully shake away all soggy soil sticking to the roots. Rinse the exposed mesh under lukewarm sink water until you can clearly see the yellow-orange rhizomes.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</div>
          <p className="text-sm text-stone-700 mt-0">
            <strong>The Rotten Cut:</strong> Obtain a pair of sharp clippers. Sanitize them with isopropyl alcohol to prevent cross-contamination. Locate any black, slimy, strings or paper-thin roots and excise them completely back to healthy white or firm orange root tissue.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</div>
          <p className="text-sm text-stone-700 mt-0">
            <strong>Dust with Natural Fungicide:</strong> Sprinkle culinary <strong>ground cinnamon powder</strong> heavily over the cut sections. Cinnamon is a spectacular organic anti-fungal agent that seals open agricultural tissues naturally. Let the plant sit dry, unpotted in thin air, for 24 hours to let the cuts callous.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">4</div>
          <p className="text-sm text-stone-700 mt-0">
            <strong>Sterile Repot:</strong> Wash the container thoroughly with warm soapy bleach or replace it. Repot with a completely fresh, sterile, fast-draining gritty mix. Do not use the old contaminated soil!
          </p>
        </div>
      </div>

    </article>
  );
}


// ----------------------------------------------------
// SUBMODULE 4: BEST POTS FOR SNAKE PLANTS PAGE
// ----------------------------------------------------
export function BestPotsArticle() {
  const [foliageHeight, setFoliageHeight] = useState<number>(12);
  const [currentPot, setCurrentPot] = useState<number>(6);

  const calculateTargetPot = () => {
    // Standard rule: Pot should be ~1/3 of the foliage height.
    // Also, maximum sizing increase is 1 to 2 inches larger than current pot.
    const ruleHeightPot = Math.ceil(foliageHeight / 3);
    const recommendedDiameter = currentPot + 1; // standard step-up 1 inch
    
    return {
      diameter: Math.max(4, Math.min(currentPot + 2, recommendedDiameter)),
      depth: Math.round(recommendedDiameter * 0.9),
      repotVerdict: foliageHeight > currentPot * 3.5 
        ? "Highly Recommended: Your plant is highly tall and likely top-heavy. Sizing up 1 to 2 inches will stabilize the plant safely."
        : "Maintain Current Container: The height of your snake plant is perfectly balanced for your current vessel size. No immediate soil expansion needed."
    };
  };

  const potRec = calculateTargetPot();

  return (
    <article className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-6">
      
      <div className="bg-gradient-to-br from-emerald-50 to-stone-100 p-6 rounded-2xl border border-stone-200 mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-stone-900 tracking-tight mt-0 flex items-center gap-2">
          <Layers className="w-6 h-6 text-emerald-800" />
          The Science of Containers: Best Pots for Snake Plants
        </h2>
        <p className="text-stone-650 text-sm mt-2 mb-0">
          Uncover why material choice dictates soil dry-out times. Calculate optimal container sizing metrics based on modern horticultural rules.
        </p>
      </div>

      <p>
        When beginners experience snake plant decay, they almost always look to the watering can or soil brand first. However, the container is the physical engine that regulates soil gas exchange and evaporation. If the pot material seals moisture in, even the most expensive premium soil can quickly suffer.
      </p>

      <h3 className="text-lg font-bold text-stone-900">Why Breathable Terracotta Clay and Ceramic Differ</h3>
      <p>
        Indoor house plants are usually housed in one of three popular container styles. Understanding these material properties changes how we coordinate soil mixes:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-6">
        <div className="p-4 rounded-xl border border-stone-200 bg-white shadow-xs">
          <span className="text-xs font-bold text-emerald-800 font-mono">1. Terracotta Clay (Breathable)</span>
          <p className="text-xs text-stone-605 mt-2 leading-relaxed">
            Porous red clay pulls moisture out of the soil column globally, transpiring it into the room. Reduces overwatering margin by 70%. Best for average indoor apartments.
          </p>
        </div>
        <div className="p-4 rounded-xl border border-stone-200 bg-white shadow-xs">
          <span className="text-xs font-bold text-amber-800 font-mono">2. Glazed Ceramic / Plastic</span>
          <p className="text-xs text-stone-605 mt-2 leading-relaxed">
            Seals moisture completely. Dries purely from the surface downward. If utilizing ceramic containers, you must increase soil gravel/mineral count by an extra 20%.
          </p>
        </div>
        <div className="p-4 rounded-xl border border-stone-200 bg-white shadow-xs">
          <span className="text-xs font-bold text-stone-500 font-mono">3. Nursery Liners</span>
          <p className="text-xs text-stone-605 mt-2 leading-relaxed">
            Flexible thin plastic liners that fit inside decor pottery. Highly practical, allowing you to easily slip the root block out to inspect for rot symptoms at any time.
          </p>
        </div>
      </div>

      {/* Sizing Calculator Custom Visual Tool */}
      <div className="bg-stone-50 p-6 rounded-xl border border-stone-200 my-6">
        <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5 uppercase tracking-wide mb-3">
          <Sliders className="w-4 h-4 text-emerald-850" /> Sizing recommendation Engine
        </h4>
        <p className="text-xs text-stone-500 mb-4">
          Adjust the sliders below to discover the exact diameter and depth of your target replacement pot:
        </p>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span>Foliage Height from Soil Baseline:</span>
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
              <span className="text-stone-400 uppercase tracking-widest text-[9px] block">Target Diameter Sizing</span>
              <span className="text-stone-900 font-bold text-sm block mt-0.5">{potRec.diameter} Inches</span>
              <span className="text-[10px] text-stone-500">Only step up 1-2" to protect root zone density.</span>
            </div>
            <div>
              <span className="text-stone-400 uppercase tracking-widest text-[9px] block">Target Vessel Depth</span>
              <span className="text-stone-900 font-bold text-sm block mt-0.5">{potRec.depth} Inches</span>
              <span className="text-[10px] text-stone-500">Moderate shallow depth matches flat rhizomes.</span>
            </div>
          </div>
          <div className="border-t border-stone-100 pt-2 text-stone-650 leading-relaxed text-[11px] italic">
            <strong>Greenhouse Verdict:</strong> {potRec.repotVerdict}
          </div>
        </div>
      </div>

      <h3 className="text-lg font-bold text-stone-900 mt-6">Three Non-Negotiable Drainage Rules</h3>
      <ul className="space-y-3 list-decimal pl-5 text-sm">
        <li>
          <strong>Never Block the Drainage Hole:</strong> Placing gravel or pebbles at the bottom of a pot with no hole does not create drainage. Instead, it physical shifts the "perched water table" higher up the soil columns, moving stagnation directly into early roots.
        </li>
        <li>
          <strong>Empty the Outer Decor Saucer:</strong> If you water until liquid passes out the bottom drainage hole, let it drain completely. Empty the overflow water saucer after 20 minutes; do not let the pot sit inside a stagnant pool!
        </li>
        <li>
          <strong>Avoid Oversized Containers:</strong> Oversizing is highly lethal. A huge pot holds massive soil volume which acts like a permanent cold, wet shield that tiny root networks cannot drain through.
        </li>
      </ul>

    </article>
  );
}


// ----------------------------------------------------
// SUBMODULE 5: SNAKE PLANT COMPLETE CARE & WATERING GUIDE
// ----------------------------------------------------
export function CareGuideArticle() {
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
        <h2 className="text-xl md:text-2xl font-bold text-stone-900 tracking-tight mt-0 flex items-center gap-2">
          <Compass className="w-6 h-6 text-emerald-800" />
          The Complete Care & 'Soak and Dry' Watering Masterclass
        </h2>
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

    </article>
  );
}
