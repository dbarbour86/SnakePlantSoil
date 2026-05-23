import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Droplet, Wind, AlertTriangle, CheckCircle2, RefreshCw, Sliders, Sparkles, Award } from 'lucide-react';
import { DEFAULT_INGREDIENTS } from '../data';
import { SoilIngredient } from '../types';

export default function InteractiveCalculator() {
  const [ingredients, setIngredients] = useState<SoilIngredient[]>(DEFAULT_INGREDIENTS);
  const [preset, setPreset] = useState<string>('recommended');

  const adjustPercent = (id: string, delta: number) => {
    setPreset('custom');
    setIngredients(prev => {
      const idx = prev.findIndex(item => item.id === id);
      if (idx === -1) return prev;
      
      const updated = [...prev];
      const target = updated[idx];
      let newPct = target.percentage + delta;
      if (newPct < 0) newPct = 0;
      if (newPct > 100) newPct = 100;

      // Adjust other ingredients dynamically to maintain a sum of 100%
      const diff = newPct - target.percentage;
      target.percentage = newPct;

      const otherIngredients = updated.filter((_, i) => i !== idx);
      const otherSum = otherIngredients.reduce((sum, item) => sum + item.percentage, 0);

      if (otherSum === 0) {
        // distribute equally
        const share = diff / otherIngredients.length;
        otherIngredients.forEach(item => {
          item.percentage = Math.max(0, parseFloat((100 / otherIngredients.length).toFixed(1)));
        });
      } else {
        otherIngredients.forEach(item => {
          const ratio = item.percentage / otherSum;
          item.percentage = Math.max(0, parseFloat((item.percentage - diff * ratio).toFixed(1)));
        });
      }

      // Normalize so it sums exactly to 100
      const currentSum = updated.reduce((sum, item) => sum + item.percentage, 0);
      if (currentSum !== 100) {
        const error = 100 - currentSum;
        updated[0].percentage = parseFloat((updated[0].percentage + error).toFixed(1));
      }

      return updated;
    });
  };

  const applyPreset = (presetName: string) => {
    setPreset(presetName);
    if (presetName === 'recommended') {
      setIngredients([
        { ...DEFAULT_INGREDIENTS[0], percentage: 35 }, // compost
        { ...DEFAULT_INGREDIENTS[1], percentage: 30 }, // perlite
        { ...DEFAULT_INGREDIENTS[2], percentage: 20 }, // coarse sand
        { ...DEFAULT_INGREDIENTS[3], percentage: 15 }  // pumice
      ]);
    } else if (presetName === 'generic') {
      setIngredients([
        { ...DEFAULT_INGREDIENTS[0], percentage: 80 }, // compost
        { ...DEFAULT_INGREDIENTS[1], percentage: 10 }, // perlite
        { ...DEFAULT_INGREDIENTS[2], percentage: 10 }, // sand
        { ...DEFAULT_INGREDIENTS[3], percentage: 0 }   // pumice
      ]);
    } else if (presetName === 'desert') {
      setIngredients([
        { ...DEFAULT_INGREDIENTS[0], percentage: 20 }, // compost
        { ...DEFAULT_INGREDIENTS[1], percentage: 30 }, // perlite
        { ...DEFAULT_INGREDIENTS[2], percentage: 30 }, // sand
        { ...DEFAULT_INGREDIENTS[3], percentage: 20 }  // pumice
      ]);
    } else if (presetName === 'lethal') {
      setIngredients([
        { ...DEFAULT_INGREDIENTS[0], percentage: 100 }, // compost only
        { ...DEFAULT_INGREDIENTS[1], percentage: 0 },
        { ...DEFAULT_INGREDIENTS[2], percentage: 0 },
        { ...DEFAULT_INGREDIENTS[3], percentage: 0 }
      ]);
    }
  };

  // Run initial setting
  useEffect(() => {
    applyPreset('recommended');
  }, []);

  // Compute stats
  const totalWeight = ingredients.reduce((sum, item) => sum + item.percentage, 0);
  
  const rawDrainage = ingredients.reduce((sum, item) => sum + (item.baseDrainage * item.percentage), 0) / 100;
  const rawRetention = ingredients.reduce((sum, item) => sum + (item.baseRetention * item.percentage), 0) / 100;
  const rawAeration = ingredients.reduce((sum, item) => sum + (item.baseAeration * item.percentage), 0) / 100;

  // Scale to percentages for visualization
  const drainageScore = Math.min(100, Math.max(0, Math.round(rawDrainage * 10)));
  const retentionScore = Math.min(100, Math.max(0, Math.round(rawRetention * 10)));
  const aerationScore = Math.min(100, Math.max(0, Math.round(rawAeration * 10)));

  // Calculate Root Rot Risk
  // Ideal range drainage: 60 - 85. Ideal range retention: 20 - 45. Aeration: 60 - 90
  let rotRisk = "Moderate";
  let rotColor = "text-amber-600 bg-amber-50 border-amber-200";
  let rotLevel = 50;

  if (drainageScore < 40) {
    rotRisk = "CRITICAL / SEVERE RISK";
    rotColor = "text-rose-700 bg-rose-50 border-rose-200";
    rotLevel = 95;
  } else if (drainageScore < 55) {
    rotRisk = "Elevated Risk";
    rotColor = "text-orange-600 bg-orange-50 border-orange-200";
    rotLevel = 70;
  } else if (drainageScore > 85) {
    rotRisk = "Drought Zone (Too dry for growth)";
    rotColor = "text-teal-700 bg-teal-50 border-teal-200";
    rotLevel = 15;
  } else {
    rotRisk = "Perfect Dry-Down (Optimal)";
    rotColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
    rotLevel = 10;
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden" id="interactive-soil-calculator">
      <div className="bg-gradient-to-r from-stone-50 to-stone-100 p-6 border-b border-stone-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Interactive Tool
            </span>
            <h3 className="text-xl font-bold text-stone-900 tracking-tight">
              Interactive Soil Mix & Drainage Diagnostic Simulator
            </h3>
            <p className="text-stone-500 text-sm mt-0.5">
              Simulate soil ingredient percentages to evaluate structural drainage scores & root rot risks instantly.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => applyPreset('recommended')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                preset === 'recommended' 
                  ? 'bg-emerald-800 text-white shadow-sm' 
                  : 'bg-stone-200 hover:bg-stone-300 text-stone-700'
              }`}
              id="preset-recommended-btn"
            >
              Our Recommended Mix
            </button>
            <button
              onClick={() => applyPreset('generic')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                preset === 'generic' 
                  ? 'bg-emerald-800 text-white' 
                  : 'bg-stone-200 hover:bg-stone-300 text-stone-700'
              }`}
              id="preset-generic-btn"
            >
              Typical Bagged Soil
            </button>
            <button
              onClick={() => applyPreset('desert')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                preset === 'desert' 
                  ? 'bg-emerald-800 text-white' 
                  : 'bg-stone-200 hover:bg-stone-300 text-stone-700'
              }`}
              id="preset-ultra-sandy-btn"
            >
              Super Desert Mix
            </button>
            <button
              onClick={() => applyPreset('lethal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                preset === 'lethal' 
                  ? 'bg-rose-700 text-white' 
                  : 'bg-stone-200 hover:bg-stone-300 text-stone-700'
              }`}
              id="preset-lethal-btn"
            >
              Standard Potting Soil
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-stone-200">
        
        {/* Left Side: Sliders */}
        <div className="p-6 lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-850" />
              Adjust Composition (Total: 100%)
            </h4>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-650">
              {preset === 'custom' ? 'Custom Formula' : `${preset.charAt(0).toUpperCase() + preset.slice(1)} Preset`}
            </span>
          </div>

          <div className="space-y-4">
            {ingredients.map((item) => (
              <div key={item.id} className="p-4 rounded-xl bg-stone-50 border border-stone-200 transition-all hover:bg-stone-100/50">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h5 className="font-bold text-stone-800 text-sm">{item.name}</h5>
                    <p className="text-stone-500 text-xs mt-0.5 line-clamp-1">{item.description}</p>
                  </div>
                  <span className="font-mono font-bold text-emerald-800 text-sm">
                    {Math.round(item.percentage)}%
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => adjustPercent(item.id, -5)}
                    disabled={item.percentage <= 0}
                    className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 active:bg-stone-100 disabled:opacity-40 transition-all"
                    title="Decrease by 5%"
                    id={`minus-${item.id}`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                    </svg>
                  </button>

                  <div className="relative flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                    <div 
                      className={`absolute top-0 left-0 h-full transition-all duration-300 ${
                        item.id === 'compost' ? 'bg-amber-800' :
                        item.id === 'perlite' ? 'bg-slate-300' :
                        item.id === 'coarse-sand' ? 'bg-yellow-100 border border-amber-200' :
                        'bg-emerald-600'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>

                  <button
                    onClick={() => adjustPercent(item.id, 5)}
                    disabled={item.percentage >= 100}
                    className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 active:bg-stone-100 disabled:opacity-40 transition-all"
                    title="Increase by 5%"
                    id={`plus-${item.id}`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                <div className="mt-1.5 text-[11px] text-stone-400 italic">
                  Role: {item.purpose}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between text-xs text-stone-500 bg-stone-100/50 rounded-lg p-3">
              <span>💡 Try selecting the <strong>"Standard Potting Soil"</strong> preset to discover why standard bags trap moisture and invite harmful fungal rot.</span>
              <button 
                onClick={() => applyPreset('recommended')}
                className="text-emerald-800 font-bold hover:underline ml-2 shrink-0 flex items-center gap-1"
                id="reset-calculator"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Diagnostics & Output */}
        <div className="p-6 lg:col-span-5 bg-stone-50/50 flex flex-col justify-between space-y-6">
          <div>
            <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4">
              Soil Diagnostic Analysis
            </h4>

            {/* Diagnostic Metrics */}
            <div className="space-y-4">
              {/* Drainage Score */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-stone-700 flex items-center gap-1">
                    <Droplet className="w-3.5 h-3.5 text-blue-500" /> Soil Drainage Score
                  </span>
                  <span className="font-mono font-bold text-stone-900">{drainageScore} / 100</span>
                </div>
                <div className="h-2.5 bg-stone-250 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      drainageScore < 45 ? 'bg-rose-500' :
                      drainageScore < 60 ? 'bg-amber-500' :
                      drainageScore > 85 ? 'bg-teal-500' : 'bg-emerald-600'
                    }`}
                    style={{ width: `${drainageScore}%` }}
                  />
                </div>
              </div>

              {/* Root Aeration */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-stone-700 flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-amber-500" /> Root Aeration Level
                  </span>
                  <span className="font-mono font-bold text-stone-900">{aerationScore} / 100</span>
                </div>
                <div className="h-2.5 bg-stone-250 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      aerationScore < 40 ? 'bg-rose-400' :
                      aerationScore < 60 ? 'bg-amber-400' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${aerationScore}%` }}
                  />
                </div>
              </div>

              {/* Water Retention */}
              <div>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-stone-700">Moisture Retention Max</span>
                  <span className="font-mono font-bold text-stone-900">{retentionScore} / 100</span>
                </div>
                <div className="h-2 bg-stone-250 rounded-full overflow-hidden mt-1">
                  <div 
                    className="h-full bg-blue-400 transition-all duration-500"
                    style={{ width: `${retentionScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Rot Risk Box */}
            <div className={`mt-6 p-4 rounded-xl border text-sm transition-all ${rotColor}`}>
              <div className="flex gap-2.5 items-start">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-stone-900 mb-0.5">Root Rot Risk Index: {rotRisk}</h5>
                  <p className="text-stone-700 text-xs leading-relaxed">
                    {drainageScore < 40 ? (
                      "Critical danger! This mix holds anaerobic water endlessly. Without modification, stagnant gravity-water will cause the delicate storage roots of your snake plant to fail within 2 to 3 weeks."
                    ) : drainageScore < 55 ? (
                      "Sub-optimal. While survival is possible with strict drying intervals, this soil easily compacts, reducing the safety margin for accidental overwatering during cold winters."
                    ) : drainageScore > 85 ? (
                      "Hyper-sandy. Though rot is virtually impossible, this soil may drain too rapidly to hold any basic nutrients. You'll need to water slightly more frequently during fast spring growth."
                    ) : (
                      "Absolute perfection! Excess water escapes instantly but organic pores retain just enough trace ambient moisture. Highly cited as the ultimate ratio to assure root respiration and heavy foliage growth."
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-stone-200 pt-4 mt-6">
            <h5 className="text-xs font-bold text-stone-700 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-500" /> Botanical Citation Specs
            </h5>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-stone-650 bg-stone-100 p-2.5 rounded-lg border border-stone-200">
              <div>• Sand-Mineral: <span className="font-bold text-stone-800">{Math.round(ingredients[2].percentage + ingredients[3].percentage)}%</span></div>
              <div>• Organic Peat: <span className="font-bold text-stone-800">{Math.round(ingredients[0].percentage)}%</span></div>
              <div>• Recommended Gaps: <span className="font-bold text-stone-800">2-3 yrs</span></div>
              <div>• Optimal pH Base: <span className="font-bold text-stone-800">6.0-6.8</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
