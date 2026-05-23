import { RECOMMENDED_PRODUCTS } from '../data';
import { Star, ShieldCheck, ThumbsUp, Tag, ExternalLink } from 'lucide-react';

export default function ProductSection() {
  return (
    <section className="py-16 bg-white" id="affiliate-recommendations">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Tried & Tested Materials
          </span>
          <h2 className="text-2xl md:text-3xl font-sans font-bold text-stone-900 tracking-tight mt-3">
            Editorial Soil Ingredients & Supplies
          </h2>
          <p className="text-stone-500 text-sm mt-2">
            These are the physical soils, drainage minerals, and breathable containers we physically utilize in our own greenhouse trials. Standard retail stores sell many soggy soils; choose these to reduce root death.
          </p>
        </div>

        <div className="space-y-8">
          {RECOMMENDED_PRODUCTS.map((prod) => (
            <div 
              key={prod.id} 
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow grid grid-cols-1 md:grid-cols-12"
              id={`product-item-${prod.id}`}
            >
              {/* Product Image Panel */}
              <div className="md:col-span-4 relative bg-stone-100 min-h-[220px] md:min-h-full">
                <img 
                  src={prod.imageUrl} 
                  alt={prod.name} 
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="shadow-sm inline-flex items-center gap-1 bg-emerald-800 text-white font-bold text-xs uppercase tracking-wide px-3 py-1.5 rounded-full">
                    <Tag className="w-3 h-3" /> {prod.bestFor}
                  </span>
                </div>
              </div>

              {/* Product Info Panel */}
              <div className="p-6 md:p-8 md:col-span-8 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div>
                      <span className="text-xs font-mono font-bold text-stone-400 tracking-wider uppercase">
                        {prod.brand}
                      </span>
                      <h3 className="text-lg md:text-xl font-bold text-stone-905 mt-0.5" id={`product-name-${prod.id}`}>
                        {prod.name}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-1 bg-yellow-50 px-2.5 py-1 rounded border border-yellow-200">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-bold text-stone-800">{prod.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <p className="text-stone-600 text-sm leading-relaxed mb-6">
                    {prod.description}
                  </p>

                  {/* Specs & Ingredients */}
                  <div className="mb-6 grid grid-cols-2 gap-4 border-t border-b border-stone-100 py-3.5">
                    {Object.entries(prod.specs).map(([key, val]) => (
                      <div key={key} className="text-xs">
                        <span className="text-stone-450 uppercase tracking-widest text-[10px] block font-semibold mb-0.5 bg-stone-50 px-1 py-0.5 rounded w-max">{key}</span>
                        <span className="text-stone-700 font-medium pl-1">{val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pros & Cons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                        <ThumbsUp className="w-3.5 h-3.5" /> What We Appreciate:
                      </h4>
                      <ul className="space-y-1">
                        {prod.pros.map((pro, index) => (
                          <li key={index} className="text-xs text-stone-600 flex items-start gap-1.5 leading-relaxed">
                            <span className="text-emerald-700 font-bold shrink-0">✓</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                        <span>💡 Greenhouse Advisory:</span>
                      </h4>
                      <ul className="space-y-1">
                        {prod.cons.map((con, index) => (
                          <li key={index} className="text-xs text-stone-600 flex items-start gap-1.5 leading-relaxed">
                            <span className="text-stone-400 shrink-0">•</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                  <div className="text-xs font-mono text-stone-400">
                    Price Indicator: <span className="text-stone-700 font-bold">{prod.priceEstimate}</span>
                  </div>
                  <a 
                    href="#affiliate-disclaimer"
                    className="inline-flex items-center gap-2 bg-stone-900 text-stone-50 hover:bg-emerald-900 active:bg-emerald-950 px-5 py-2.5 rounded-lg text-xs font-bold font-sans transition-all shadow-sm"
                    id={`check-price-${prod.id}`}
                  >
                    <span>{prod.linkText}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center" id="affiliate-disclaimer">
          <p className="text-[11px] text-stone-400 italic leading-relaxed max-w-xl mx-auto">
            Disclosure: SnakePlantSoil.com is an independent specialist botanical resource. We are supported by reader referrals. Some recommendation blocks contain affiliate links which earn us small commissions at zero cost to you. We physically purchase and test all items before listing.
          </p>
        </div>

      </div>
    </section>
  );
}
