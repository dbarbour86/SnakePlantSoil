import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Info, Check, Eye } from 'lucide-react';

interface LayerInfo {
  id: string;
  name: string;
  pct: string;
  color: string;
  bgClass: string;
  borderClass: string;
  role: string;
  aeration: string;
  bioBonus: string;
}

export default function SoilMixDiagram() {
  const [activeLayer, setActiveLayer] = useState<string>('perlite');

  const layers: LayerInfo[] = [
    {
      id: "humus",
      name: "Organic Humus/Compost",
      pct: "35% - 40%",
      color: "bg-amber-900",
      bgClass: "bg-amber-50/50",
      borderClass: "border-amber-200",
      role: "Provides natural botanical feeding and critical structural anchor weight.",
      aeration: "Low - easily compacts without grit additions.",
      bioBonus: "Contains beneficial microbes that slowly extract organic natural Nitrogen."
    },
    {
      id: "perlite",
      name: "Horticultural White Perlite",
      pct: "30%",
      color: "bg-stone-200 border-stone-300",
      bgClass: "bg-stone-50",
      borderClass: "border-stone-350",
      role: "Instantly fractures heavy dirt, preserving high oxygen zones and weight distribution.",
      aeration: "Maximum - holds permanent air micro-bubbles.",
      bioBonus: "Sourced from sterile puffed volcanic glass. 100% pest resistant."
    },
    {
      id: "sand",
      name: "Washed Coarse Sand",
      pct: "20%",
      color: "bg-yellow-200/80 border-amber-300",
      bgClass: "bg-yellow-50/30",
      borderClass: "border-yellow-250",
      role: "Forces heavy gravity drainage and provides critical counterweight balance.",
      aeration: "Micro-channels - allows quick water movement.",
      bioBonus: "Ground quartz substrate that will never degrade or attract gnats."
    },
    {
      id: "pumice",
      name: "Volcanic Mineral Pumice",
      pct: "10% - 15%",
      color: "bg-stone-400/80",
      bgClass: "bg-stone-100/50",
      borderClass: "border-stone-300",
      role: "Boutique structural porous stone that balances root gas exchanges safely.",
      aeration: "Ultra High - dual mineral micropores.",
      bioBonus: "The absolute premium choice for desert succulents globally."
    }
  ];

  const currentInfo = layers.find(l => l.id === activeLayer) || layers[1];

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs max-w-4xl mx-auto" id="soil-breakdown-diagram">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Hand: Explainer Text */}
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800">
            <Sparkles className="w-3 h-3" /> Interactive Composition Diagram
          </div>
          <h3 className="text-xl font-bold text-stone-900 tracking-tight">
            The Perfect Snake Plant Soil Anatomy
          </h3>
          <p className="text-stone-500 text-sm leading-relaxed">
            Indoor snake plant health is won or lost by the ratio of <strong>Organic Compost</strong> to <strong>Inorganic Grits</strong>. To avoid root rot completely, aim for at least <strong>50% to 60% gritty mineral content</strong>.
          </p>
          <p className="text-xs text-stone-400">
            👉 Tap on the different visual soil layers in the column chart to highlight their agricultural function.
          </p>
          
          {/* Dynamic Specs details block */}
          <div className={`p-4 rounded-xl border ${currentInfo.bgClass} ${currentInfo.borderClass} transition-all duration-300`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-stone-900">{currentInfo.name}</span>
              <span className="font-mono text-xs font-bold bg-white px-2.5 py-1 rounded border border-stone-200 text-stone-750">
                Volume Ratio: {currentInfo.pct}
              </span>
            </div>
            <p className="text-stone-600 text-xs leading-relaxed mb-3">
              {currentInfo.role}
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-dashed border-stone-200 text-[11px]">
              <div>
                <span className="text-stone-400 font-semibold uppercase tracking-wider text-[9px] block">Aeration Level</span>
                <span className="text-stone-850 font-medium">{currentInfo.aeration}</span>
              </div>
              <div>
                <span className="text-stone-400 font-semibold uppercase tracking-wider text-[9px] block">Botanical Advantage</span>
                <span className="text-stone-850 font-medium">{currentInfo.bioBonus}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Hand: Visual layered representation */}
        <div className="w-full max-w-[280px] shrink-0">
          <div className="relative border-4 border-stone-300 rounded-3xl bg-stone-100 p-2 shadow-inner overflow-hidden h-[340px] flex flex-col justify-end space-y-1">
            <div className="absolute top-4 left-0 right-0 text-center select-none pointer-events-none z-10">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400 drop-shadow-sm">Ideal Soil Column</span>
            </div>

            {layers.map((layer) => (
              <motion.button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id)}
                whileHover={{ scale: 1.02 }}
                className={`relative w-full rounded-xl transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden p-2 group ${
                  activeLayer === layer.id 
                    ? 'ring-2 ring-emerald-800 ring-offset-2 scale-[1.01] shadow-md' 
                    : 'opacity-75 hover:opacity-100'
                } ${layer.color}`}
                style={{ 
                  height: layer.id === 'humus' ? '110px' :
                          layer.id === 'perlite' ? '90px' :
                          layer.id === 'sand' ? '70px' : '50px' 
                }}
                id={`soil-layer-btn-${layer.id}`}
              >
                {/* Speckled soil texture overlays */}
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#111_1px,transparent_1px)] [background-size:8px_8px]" />
                
                <span className="text-stone-900 font-bold text-xs drop-shadow-md tracking-tight group-hover:underline text-center">
                  {layer.name.split(' ')[1] || layer.name.split('/')[0]}
                </span>
                <span className="text-[10px] font-mono opacity-80 mt-0.5">
                  ({layer.pct.split(' ')[0]})
                </span>
              </motion.button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
