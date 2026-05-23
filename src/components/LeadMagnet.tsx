import { useState, useRef, FormEvent } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, Mail, Printer, Check, Copy, AlertCircle, 
  ArrowRight, Heart, Calendar, HelpCircle, FileText, Download, RefreshCw
} from 'lucide-react';

export default function LeadMagnet() {
  const [nickname, setNickname] = useState('');
  const [light, setLight] = useState('indirect');
  const [container, setContainer] = useState('terracotta');
  const [season, setSeason] = useState('spring');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const printableRef = useRef<HTMLDivElement>(null);

  const calculateWatering = () => {
    let baseDays = 14;

    // Light impact
    if (light === 'direct') baseDays = 10;
    if (light === 'indirect') baseDays = 16;
    if (light === 'moderate') baseDays = 24;
    if (light === 'low') baseDays = 40;

    // Container impact
    if (container === 'ceramic') baseDays = Math.round(baseDays * 1.3);
    if (container === 'plastic') baseDays = Math.round(baseDays * 1.4);
    if (container === 'nodrainage') baseDays = Math.round(baseDays * 1.8);

    // Season impact
    if (season === 'summer') baseDays = Math.round(baseDays * 0.85);
    if (season === 'fall') baseDays = Math.round(baseDays * 1.4);
    if (season === 'winter') baseDays = Math.round(baseDays * 2.1);

    return Math.max(7, baseDays);
  };

  const daysInterval = calculateWatering();

  const getCustomPrescription = () => {
    let advice = "";
    let risk = "Low";
    let riskColor = "text-emerald-700 bg-emerald-50";

    if (container === 'nodrainage') {
      advice += "⚠️ CRITICAL WARNING: No drainage holes detected. Water with extreme caution (tablespoons only) or drill/exchange pots immediately. ";
      risk = "HIGH / SEVERE RISK";
      riskColor = "text-rose-700 bg-rose-50 border-rose-200";
    }

    if (light === 'low') {
      advice += "Due to low-light placement, your plant's metabolic evaporation is extremely slow. Ensure absolute complete soil dry-out. ";
      if (risk !== "HIGH / SEVERE RISK") {
        risk = "Moderate Risk";
        riskColor = "text-amber-700 bg-amber-50 border-amber-200";
      }
    } else if (light === 'direct') {
      advice += "Bright direct sun speeds dry-down but can scorch tips. Monitor edge tissue for brown crisping. ";
    } else {
      advice += "Perfect indirect light balance! Promotes healthy, steady rhizome growth and solid chlorophyll expression. ";
    }

    if (container === 'terracotta') {
      advice += "Classic terracotta naturally pulls side wall moisture out, acting as a highly breathable shield. ";
    } else if (container === 'ceramic') {
      advice += "Glazed ceramic walls trap moisture completely. Ensure the top 3 inches feel bone dry. ";
    }

    return { advice, risk, riskColor };
  };

  const prescription = getCustomPrescription();

  const handleGenerate = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      alert("Please provide a valid email format to generate the care card.");
      return;
    }
    setIsSubmitting(true);
    
    // Simulate API registration & custom configuration build
    setTimeout(() => {
      setIsSubmitting(false);
      setIsGenerated(true);
      window.scrollTo({ top: document.getElementById('generated-card-focus')?.offsetTop || 100, behavior: 'smooth' });
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  const copyCardText = () => {
    const text = `
------------------------------------------------
   SNAKEPLANTSOIL.COM - BREADCRUMB CARE CARD
------------------------------------------------
[Plant Identifier]: ${nickname || 'My Snake Plant'}
[Light Exposure]: ${light.toUpperCase()} (Computed Interval)
[Pot Media type]: ${container.toUpperCase()}
[Watering Rule]: Every ${daysInterval} Days (Soak & Dry Cycle)
[Greenhouse Risk]: ${prescription.risk}
[Botanist Advisory]: ${prescription.advice}
------------------------------------------------
   Generate your own at SnakePlantSoil.com
------------------------------------------------`;
    navigator.clipboard.writeText(text.trim());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2050);
  };

  const resetForm = () => {
    setIsGenerated(false);
    setNickname('');
    setEmail('');
  };

  return (
    <section className="py-8 md:py-12 max-w-4xl mx-auto px-4" id="lead-magnet-section">
      
      {/* Title & Concept Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Free Printable Care Tool
        </span>
        <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-stone-900 tracking-tight" id="magnet-title">
          Custom Botanical Care Card & Cheat Sheet Creator
        </h2>
        <p className="text-stone-550 text-sm mt-2">
          Tell us about your home’s lighting levels, vessel material, and seasonal placement. Our diagnostic builder will design a highly-polished, printable custom care card with calculated watering schedules suited specifically for your plant.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Builder input settings FORM */}
        <div className={`lg:col-span-6 bg-white p-6 rounded-2xl border ${isGenerated ? 'border-stone-200' : 'border-emerald-600/30 ring-2 ring-emerald-500/5'} shadow-sm space-y-5 transition-all`}>
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-sm text-stone-900 uppercase tracking-widest flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-850" /> Card Details
            </h3>
            <span className="text-[10px] uppercase font-mono font-bold bg-stone-100 px-2 py-0.5 rounded text-stone-500">
              Interactive
            </span>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4 text-xs font-sans">
            
            {/* Step 1: Nickname */}
            <div>
              <label className="block font-bold text-stone-800 mb-1" htmlFor="plant-nickname">
                1. Plant Nickname / ID
              </label>
              <input 
                id="plant-nickname"
                type="text"
                placeholder="e.g. Spike, Corner Sansevieria, Living Room Gem"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full text-xs p-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-stone-50/50"
                maxLength={32}
              />
            </div>

            {/* Step 2: Light Selection */}
            <div>
              <label className="block font-bold text-stone-800 mb-1">
                2. Room Placement & Sunlight
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'direct', label: '☀️ Bright Direct', desc: 'Sills/Windows' },
                  { id: 'indirect', label: '🌤️ Bright Indirect', desc: 'No scorching heat' },
                  { id: 'moderate', label: '🌥️ Moderate Filtered', desc: 'A few feet back' },
                  { id: 'low', label: '🌑 Low Light Corner', desc: 'Minimal exposure' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLight(item.id)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      light === item.id 
                        ? 'border-emerald-800 bg-emerald-50/40 font-bold' 
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-605'
                    }`}
                    id={`light-choice-${item.id}`}
                  >
                    <span className="block font-semibold mb-0.5">{item.label}</span>
                    <span className="block text-[9px] text-stone-400 font-medium">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Container types */}
            <div>
              <label className="block font-bold text-stone-800 mb-1">
                3. Container Pot Material Style
              </label>
              <select
                value={container}
                onChange={(e) => setContainer(e.target.value)}
                className="w-full text-xs p-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-stone-50/50 cursor-pointer font-medium text-stone-800"
                id="container-dropdown"
              >
                <option value="terracotta">Classic Italian Terracotta (Breathable Clay)</option>
                <option value="ceramic">Glazed Ceramic Pot (Water Retentive)</option>
                <option value="plastic">Plastic Nursery Liners (Medium Drainage)</option>
                <option value="nodrainage">Ornamental Pot WITHOUT drainage holes (High Risk)</option>
              </select>
            </div>

            {/* Step 4: Season settings */}
            <div>
              <label className="block font-bold text-stone-800 mb-1">
                4. Primary Active Season
              </label>
              <div className="flex bg-stone-150/60 p-1 rounded-lg border border-stone-200">
                {[
                  { id: 'spring', label: 'Spring' },
                  { id: 'summer', label: 'Summer' },
                  { id: 'fall', label: 'Fall' },
                  { id: 'winter', label: 'Winter' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSeason(item.id)}
                    className={`flex-1 text-center py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                      season === item.id 
                        ? 'bg-stone-900 text-white font-bold shadow-xs' 
                        : 'text-stone-605 hover:text-stone-950 hover:bg-stone-100/50'
                    }`}
                    id={`season-choice-${item.id}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 5: Email Opt in */}
            <div className="pt-4 border-t border-stone-100 space-y-3">
              <div>
                <label className="block font-bold text-stone-800 mb-1" htmlFor="lead-email">
                  5. Email Delivery Vector
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                    <Mail className="w-3.5 h-3.5" />
                  </span>
                  <input 
                    id="lead-email"
                    type="email"
                    required
                    placeholder="Enter email to activate & print..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700 bg-stone-50/50 font-mono"
                  />
                </div>
              </div>

              <div className="bg-emerald-50/40 p-3 rounded-lg text-[10px] text-emerald-800 leading-relaxed border border-emerald-100">
                <strong>🔒 Our Botanical Anti-Spam Pledge:</strong> We respect your email. Your details are registered to construct the downloadable worksheet. We'll send you our <strong>3-2-1 Printable Soil Cheat Sheet</strong> today and bi-weekly care audits. Opt-out anytime.
              </div>
            </div>

            {/* Submission Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-stone-900 hover:bg-emerald-900 text-white py-3.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
              id="generate-care-card-btn"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Calibrating Evaporation Cycles...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>Generate Custom Printable Care Card</span>
                </>
              )}
            </button>

          </form>
        </div>

        {/* Right Side: The Lead Magnet Printable Card Preview */}
        <div className="lg:col-span-6 space-y-4" id="generated-card-focus">
          
          {!isGenerated ? (
            /* Mock placeholder empty state */
            <div className="border-2 border-dashed border-stone-300 rounded-2xl p-12 text-center bg-stone-50 text-stone-400 flex flex-col items-center justify-center min-h-[460px]">
              <FileText className="w-12 h-12 text-stone-300 mb-4 stroke-[1.2]" />
              <h4 className="font-bold text-stone-700 text-sm">Interactive Care Card Preview</h4>
              <p className="text-xs text-stone-500 mt-1 max-w-xs leading-relaxed">
                Complete the care parameters and enter your email address to render a downloadable index card template for your plant stand.
              </p>
              <div className="mt-8 flex gap-2">
                <span className="w-2 h-2 rounded-full bg-stone-250 animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-stone-250 animate-bounce delay-200" />
                <span className="w-2 h-2 rounded-full bg-stone-250 animate-bounce delay-300" />
              </div>
            </div>
          ) : (
            /* Active, beautiful printable care card */
            <div className="space-y-4">
              
              {/* Achievement Badge notifications */}
              <div className="bg-emerald-100/80 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl text-xs flex gap-2.5 items-start">
                <Check className="w-4.5 h-4.5 bg-emerald-800 text-white rounded-full p-0.5 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Card Customization Complete!</span>
                  <p className="text-[11px] text-emerald-800 leading-normal mt-0.5">
                    Your unique card has been successfully registered. We have sent the 3-2-1 Soil formula sheet to <strong>{email}</strong>. Use the print and copy controls below.
                  </p>
                </div>
              </div>

              {/* Physical style Card container */}
              <div 
                ref={printableRef}
                className="bg-white border-2 border-stone-900 rounded-2xl p-6 shadow-md relative overflow-hidden print:border-stone-900 print:shadow-none bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] [background-size:16px_16px]"
                style={{ contentVisibility: 'auto' }}
                id="physical-carecard-container"
              >
                
                {/* Botanical Label banner */}
                <div className="flex justify-between items-start border-b-2 border-stone-900 pb-4">
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-emerald-800 block">SNAKEPLANTSOIL.COM CARE RECORD</span>
                    <h4 className="text-lg font-display font-extrabold text-stone-900 tracking-tight mt-0.5">
                      {nickname || "Unidentified Sansevieria"}
                    </h4>
                  </div>
                  <div className="w-8 h-8 rounded bg-stone-900 text-stone-50 flex items-center justify-center font-bold text-xs">
                    S
                  </div>
                </div>

                {/* Grid Ratios of metrics */}
                <div className="grid grid-cols-2 gap-4 py-4 border-b border-stone-250 text-xs">
                  <div>
                    <span className="font-semibold text-stone-400 uppercase tracking-widest text-[9px] block">Calculated Watering Period</span>
                    <span className="text-stone-900 font-extrabold text-base block mt-0.5 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-emerald-800" />
                      Every {daysInterval} Days
                    </span>
                    <span className="text-[10px] text-stone-500 italic block mt-0.5">"Soak and Dry" interval</span>
                  </div>

                  <div>
                    <span className="font-semibold text-stone-400 uppercase tracking-widest text-[9px] block">Rhizome Disease risk</span>
                    <span className={`inline-block px-2 py-0.5 rounded font-mono font-bold text-[11px] mt-1.5 ${prescription.riskColor}`}>
                      {prescription.risk}
                    </span>
                  </div>

                  <div>
                    <span className="font-semibold text-stone-400 uppercase tracking-widest text-[9px] block">Placement light</span>
                    <span className="text-stone-850 font-bold block mt-1 capitalize">
                      {light === 'direct' ? '☀️ Bright Direct Sun' :
                       light === 'indirect' ? '🌤️ Bright Indirect' :
                       light === 'moderate' ? 'Closer Filtered Light' : 'Low Light Corner'}
                    </span>
                  </div>

                  <div>
                    <span className="font-semibold text-stone-400 uppercase tracking-widest text-[9px] block">Pot media style</span>
                    <span className="text-stone-850 font-bold block mt-1 capitalize">
                      {container === 'terracotta' ? 'Terracotta Clay' :
                       container === 'ceramic' ? 'Glazed Ceramic' :
                       container === 'plastic' ? 'Plastic Liner' : 'No Drainage Hole'}
                    </span>
                  </div>
                </div>

                {/* Detailed Advisory */}
                <div className="py-4 space-y-1 text-xs border-b border-stone-250">
                  <span className="font-semibold text-stone-400 uppercase tracking-widest text-[9px] block">Custom Botanical Formulation Note</span>
                  <p className="text-stone-750 leading-relaxed font-serif italic text-xs pl-3 border-l-2 border-stone-300">
                    "{prescription.advice}"
                  </p>
                </div>

                {/* Footer specs */}
                <div className="pt-4 flex items-center justify-between text-[10px] text-stone-450 font-mono">
                  <span>Authorized Care Record #SPS-{Math.floor(Math.random() * 900000 + 100000)}</span>
                  <span className="text-emerald-800 font-bold">SnakePlantSoil.com</span>
                </div>

              </div>

              {/* Auxiliary actions block */}
              <div className="flex gap-2 justify-center pt-2">
                <button
                  onClick={handlePrint}
                  className="bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  id="print-card-badge"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print & Save Card</span>
                </button>
                <button
                  onClick={copyCardText}
                  className="bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  id="copy-card-text"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-800" />
                      <span className="text-emerald-800 font-bold">Information Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Card Specs</span>
                    </>
                  )}
                </button>
                <button
                  onClick={resetForm}
                  className="bg-stone-100 text-stone-605 hover:bg-stone-200 px-3 py-2 rounded-lg text-xs font-semibold"
                  id="reset-card-builder"
                  title="Make another card"
                >
                  <span>Build Another</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </section>
  );
}
