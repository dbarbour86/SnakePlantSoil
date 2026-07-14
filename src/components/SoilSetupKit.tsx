import { useState } from 'react';
import { 
  ShoppingBag, Sparkles, CheckCircle2, ShieldCheck, 
  HelpCircle, ExternalLink, ArrowRight, ClipboardCheck, 
  Dribbble, AlertCircle, Copy, Check 
} from 'lucide-react';
import { RECOMMENDED_PRODUCTS } from '../data';

interface KitProduct {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
  bestFor: string;
  description: string;
  affiliateUrl: string;
  specs: { [key: string]: string };
  trustReason: string;
  priceEstimate: string;
  searchTerm: string;
}

export default function SoilSetupKit() {
  const [goal, setGoal] = useState<'premix' | 'diy' | 'rot'>('premix');
  const [potSize, setPotSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Map products to highly specific setups
  const getKitProducts = (): KitProduct[] => {
    const products: KitProduct[] = [];

    // Soil Bases based on goal
    if (goal === 'premix') {
      const p = RECOMMENDED_PRODUCTS.find(x => x.id === 'hoffman-succulent');
      if (p) {
        products.push({
          ...p,
          imageUrl: p.imageUrl,
          affiliateUrl: p.affiliateUrl || "https://www.amazon.com/s?k=Hoffman+Organic+Cactus+and+Succulent+Soil+Mix&tag=snakeplantsoi-20",
          trustReason: "Best out-of-the-box porous mix. Requires no manual sifting or measurement; simply dump, plant, and let gravity handle water channels.",
          searchTerm: "Hoffman Cactus and Succulent Soil Mix 4 Quarts"
        } as KitProduct);
      }
    } else if (goal === 'diy') {
      const base = RECOMMENDED_PRODUCTS.find(x => x.id === 'espoma-cactus');
      const sand = RECOMMENDED_PRODUCTS.find(x => x.id === 'horticultural-sand');
      if (base) {
        products.push({
          ...base,
          imageUrl: base.imageUrl,
          affiliateUrl: base.affiliateUrl || "https://www.amazon.com/s?k=Espoma+Organic+Cactus+and+Succulent+Soil+Mix&tag=snakeplantsoi-20",
          trustReason: "Act as the organic, micro-nutrient base (3 parts) for your custom recipe. Formulated with mycorrhizae to boost cellular root networks.",
          searchTerm: "Espoma Organic Cactus and Succulent Soil"
        } as KitProduct);
      }
      if (sand) {
        products.push({
          ...sand,
          imageUrl: sand.imageUrl,
          affiliateUrl: sand.affiliateUrl || "https://www.amazon.com/s?k=Coarse+Horticultural+Silica+Sand+Perfect+Plants&tag=snakeplantsoi-20",
          trustReason: "Pure washed quartz grains (1 part) to create wide water tunnels. Standard play sand will cement the pot; this coarse grade guarantees heavy gravity draining.",
          searchTerm: "Perfect Plants Coarse Horticultural Sand"
        } as KitProduct);
      }
    } else if (goal === 'rot') {
      const base = RECOMMENDED_PRODUCTS.find(x => x.id === 'espoma-cactus');
      const sand = RECOMMENDED_PRODUCTS.find(x => x.id === 'horticultural-sand');
      
      if (base) {
        products.push({
          ...base,
          imageUrl: base.imageUrl,
          affiliateUrl: base.affiliateUrl || "https://www.amazon.com/s?k=Espoma+Organic+Cactus+and+Succulent+Soil+Mix&tag=snakeplantsoi-20",
          trustReason: "Sterile organic foundation to safely support calloused roots without risk of chemical fertilizer shock.",
          searchTerm: "Espoma Organic Cactus Soil"
        } as KitProduct);
      }
      if (sand) {
        products.push({
          ...sand,
          imageUrl: sand.imageUrl,
          affiliateUrl: sand.affiliateUrl || "https://www.amazon.com/s?k=Coarse+Horticultural+Silica+Sand+Perfect+Plants&tag=snakeplantsoi-20",
          trustReason: "Crucial for packing water channels in rot-damaged plants. Provides vital structural counterweight so top-heavy salvaged stems don't flip.",
          searchTerm: "Perfect Plants Horticultural Coarse Sand"
        } as KitProduct);
      }
    }

    // Add breathable terracotta pot
    const pot = RECOMMENDED_PRODUCTS.find(x => x.id === 'clay-terracotta');
    if (pot) {
      let sizeText = "8-Inch";
      let search = "Deroma 8 Inch Terracotta Pot";
      let affiliate = "https://www.amazon.com/s?k=8+Inch+Terracotta+Clay+Pot+Deroma&tag=snakeplantsoi-20";

      if (potSize === 'small') {
        sizeText = "6-Inch";
        search = "Deroma 6 Inch Terracotta Pot with drainage";
        affiliate = "https://www.amazon.com/s?k=6+Inch+Terracotta+Clay+Pot+Deroma&tag=snakeplantsoi-20";
      } else if (potSize === 'large') {
        sizeText = "10-Inch";
        search = "Deroma 10 Inch Terracotta Pot with drainage";
        affiliate = "https://www.amazon.com/s?k=10+Inch+Terracotta+Clay+Pot+Deroma&tag=snakeplantsoi-20";
      }

      products.push({
        ...pot,
        imageUrl: pot.imageUrl,
        name: `Classic Italian ${sizeText} Terracotta Clay Pot`,
        affiliateUrl: affiliate,
        trustReason: `Terracotta clay is highly porous, evaporating side-wall dampness directly through the baked clay structure. Absolutely mandatory for risk-free watering. Includes correct ${potSize === 'small' ? '0.5' : potSize === 'medium' ? '0.75' : '1.0'} in drainage hole.`,
        searchTerm: search,
        specs: {
          ...pot.specs,
          "Diameter": `${potSize === 'small' ? '6' : potSize === 'medium' ? '8' : '10'} Inches`,
          "Height": `${potSize === 'small' ? '5.5' : potSize === 'medium' ? '7.5' : '9.5'} Inches`
        }
      } as KitProduct);
    }

    return products;
  };

  const kitProducts = getKitProducts();

  // Score generator
  const getSafetyScore = () => {
    let base = 9.0;
    if (goal === 'rot') base += 0.9; // Rot protocol uses high minerals
    if (goal === 'diy') base += 0.7; // Customized DIY
    if (goal === 'premix') base += 0.5; // Out of box is solid

    if (potSize === 'medium') base += 0.1; // Balanced size

    return Math.min(10, base).toFixed(1);
  };

  const getScoreColor = (score: number) => {
    if (score >= 9.5) return 'text-emerald-800 bg-emerald-50 border-emerald-100';
    if (score >= 9.0) return 'text-yellow-800 bg-yellow-50 border-yellow-100';
    return 'text-rose-800 bg-rose-50 border-rose-100';
  };

  const scoreNum = parseFloat(getSafetyScore());

  const handleCopySearch = (term: string, id: string) => {
    navigator.clipboard.writeText(term);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm p-6 sm:p-8" id="soil-setup-kit-container">
      
      {/* Header Info */}
      <div className="border-b border-stone-100 pb-6 mb-6">
        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-100">
          <Sparkles className="w-3 h-3 animate-pulse" /> Affiliate Helper Tool
        </span>
        <h3 className="text-xl sm:text-2xl font-mono font-bold text-stone-900 mt-2 tracking-tight">
          Snake Plant Custom Setup & Cart Builder
        </h3>
        <p className="text-xs text-stone-500 mt-1.5 max-w-2xl leading-relaxed">
          Select your botanical repotting style and pot size below. We will dynamically compile the precise, high-drainage materials verified by our team to guarantee perfect root oxygenation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Options Form */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Step 1: Select Goal */}
          <div className="space-y-2.5">
            <label className="text-xs font-mono font-bold uppercase text-stone-400 tracking-wider block">
              1. Your Potting Objective:
            </label>
            <div className="space-y-2">
              <button
                onClick={() => setGoal('premix')}
                className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex items-start gap-3 ${
                  goal === 'premix' 
                    ? 'border-emerald-800 bg-emerald-50/20 text-stone-900 shadow-xs' 
                    : 'border-stone-200 hover:border-stone-300 text-stone-600 bg-stone-50/50'
                }`}
                id="goal-btn-premix"
              >
                <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                  goal === 'premix' ? 'border-emerald-800 bg-emerald-800 text-white' : 'border-stone-300'
                }`}>
                  {goal === 'premix' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <strong className="block text-stone-900 font-bold mb-0.5">Pre-Mixed Simplicity</strong>
                  <span className="text-[11px] text-stone-500 block leading-relaxed">
                    Easiest route. One bag of pre-formulated premium succulent soil with correct aggregate ratios.
                  </span>
                </div>
              </button>

              <button
                onClick={() => setGoal('diy')}
                className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex items-start gap-3 ${
                  goal === 'diy' 
                    ? 'border-emerald-800 bg-emerald-50/20 text-stone-900 shadow-xs' 
                    : 'border-stone-200 hover:border-stone-300 text-stone-600 bg-stone-50/50'
                }`}
                id="goal-btn-diy"
              >
                <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                  goal === 'diy' ? 'border-emerald-800 bg-emerald-800 text-white' : 'border-stone-300'
                }`}>
                  {goal === 'diy' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <strong className="block text-stone-900 font-bold mb-0.5">Golden DIY Mix (3-2-1)</strong>
                  <span className="text-[11px] text-stone-500 block leading-relaxed">
                    Best value and health. Purchase raw components to blend the ultimate sterile, chunky soil mix.
                  </span>
                </div>
              </button>

              <button
                onClick={() => setGoal('rot')}
                className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex items-start gap-3 ${
                  goal === 'rot' 
                    ? 'border-rose-700 bg-rose-50/10 text-stone-900 shadow-xs' 
                    : 'border-stone-200 hover:border-stone-300 text-stone-600 bg-stone-50/50'
                }`}
                id="goal-btn-rot"
              >
                <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                  goal === 'rot' ? 'border-rose-700 bg-rose-700 text-white' : 'border-stone-300'
                }`}>
                  {goal === 'rot' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <strong className="block text-stone-900 font-bold mb-0.5">Root Rot Surgical Rescue</strong>
                  <span className="text-[11px] text-stone-500 block leading-relaxed">
                    My plant is mushy or yellow. Compile sterile surgical grit to drain root cells instantly.
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Step 2: Select Pot Size */}
          <div className="space-y-2.5 pt-2">
            <label className="text-xs font-mono font-bold uppercase text-stone-400 tracking-wider block">
              2. Approximate Plant Size / Height:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['small', 'medium', 'large'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setPotSize(size)}
                  className={`py-2 px-3 text-xs rounded-lg font-bold border transition-all capitalize text-center ${
                    potSize === size 
                      ? 'bg-stone-900 border-stone-900 text-white shadow-xs' 
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100 hover:border-stone-300'
                  }`}
                  id={`pot-size-btn-${size}`}
                >
                  <span className="block text-xs">{size}</span>
                  <span className="text-[10px] font-mono font-medium block text-stone-400 group-hover:text-stone-300">
                    {size === 'small' ? '<12 in' : size === 'medium' ? '12-24 in' : '>24 in'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Soil System score metrics */}
          <div className={`border rounded-xl p-4 space-y-2 text-xs ${getScoreColor(scoreNum)}`}>
            <div className="flex justify-between items-center">
              <span className="font-bold uppercase font-mono tracking-wider text-[10px]">Rot Prevention Rating</span>
              <span className="font-mono font-black text-sm">{scoreNum}/10</span>
            </div>
            <div className="w-full bg-stone-200 h-1 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  scoreNum >= 9.5 ? 'bg-emerald-700' : 'bg-yellow-600'
                }`}
                style={{ width: `${scoreNum * 10}%` }}
              />
            </div>
            <p className="text-[11px] leading-relaxed italic opacity-90 pt-1">
              {goal === 'rot' && "Gritty inorganic matrix seals out excess water, ensuring damaged roots heal in dry micro-chambers."}
              {goal === 'diy' && "Golden ratio recipe provides supreme mineral distribution. Aeration rates are highly optimal."}
              {goal === 'premix' && "Strong out-of-the-box drainage capability. Terracotta container ensures outer evaporation is fast."}
            </p>
          </div>

        </div>

        {/* Right Recommended Shopping Checklist / Cart */}
        <div className="lg:col-span-8 space-y-5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono font-bold uppercase text-stone-400 tracking-wider">
              3. Compiled Shopping Checklist ({kitProducts.length} Items):
            </span>
            <span className="text-[11px] text-stone-400 italic">
              *Direct referral links
            </span>
          </div>

          <div className="space-y-4">
            {kitProducts.map((prod) => (
              <div 
                key={prod.id}
                className="border border-stone-200 hover:border-stone-350 bg-stone-50/30 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row gap-5 transition-all"
                id={`kit-item-${prod.id}`}
              >
                {/* Visual Thumbnail */}
                <div className="w-20 h-20 rounded-lg bg-stone-100 overflow-hidden border border-stone-200/60 shrink-0 relative">
                  <img 
                    src={prod.imageUrl} 
                    alt={prod.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info Text */}
                <div className="flex-grow flex flex-col justify-between space-y-3 sm:space-y-0">
                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-1">
                      <div>
                        <span className="text-[9px] font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded uppercase border border-emerald-100">
                          {prod.brand}
                        </span>
                        <h4 className="font-bold text-stone-900 text-sm mt-1" id={`kit-product-name-${prod.id}`}>
                          {prod.name}
                        </h4>
                      </div>
                      <span className="text-xs font-mono text-stone-400 font-bold bg-white px-2 py-0.5 rounded border border-stone-100 shrink-0">
                        Price: {prod.priceEstimate}
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-500 mt-1.5 leading-relaxed">
                      {prod.description}
                    </p>

                    <div className="mt-2.5 bg-white p-2.5 rounded-lg border border-stone-200/60 text-xs">
                      <span className="text-stone-400 uppercase tracking-widest text-[9px] block font-bold">Why it's essential:</span>
                      <p className="text-stone-650 mt-0.5 leading-relaxed text-[11px]">{prod.trustReason}</p>
                    </div>
                  </div>

                  {/* Buy Buttons Panel */}
                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-stone-100/60 mt-3 justify-end">
                    
                    {/* Copy search term backup */}
                    <button
                      onClick={() => handleCopySearch(prod.searchTerm, prod.id)}
                      className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-800 bg-white hover:bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-md text-[10px] font-mono font-semibold transition-all"
                      title="Copy standard search text in case your ad blocker interferes with referral tracking links"
                      id={`copy-search-${prod.id}`}
                    >
                      {copiedId === prod.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-700" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Search Term</span>
                        </>
                      )}
                    </button>

                    {/* Primary Referral Link */}
                    <a
                      href={prod.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-stone-50 px-4 py-1.5 rounded-md text-[10px] font-bold font-sans transition-all shadow-xs"
                      id={`shop-btn-${prod.id}`}
                    >
                      <span>Check on Amazon</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Secure affiliate disclosure banner */}
          <div className="bg-stone-50 border border-stone-250 rounded-xl p-4 flex gap-3 text-[10px] leading-relaxed text-stone-500">
            <AlertCircle className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
            <div>
              <strong>Affiliate Transparency:</strong> SnakePlantSoil.com is funded entirely through referral marketing commission programs (such as the Amazon Services LLC Associates Program). If you click these links and purchase items, we earn a small margin at exactly <strong>zero additional cost to you</strong>. This keeps our detailed soil calculations and diagnostic guides 100% free from heavy, intrusive banner ads.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
