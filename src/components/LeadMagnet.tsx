import { useState, useRef, FormEvent } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, Mail, Printer, Check, Copy, AlertCircle, 
  ArrowRight, Heart, Calendar, HelpCircle, FileText, Download, RefreshCw
} from 'lucide-react';

interface LeadMagnetProps {
  onNavigate?: (tab: string) => void;
}

export default function LeadMagnet({ onNavigate }: LeadMagnetProps = {}) {
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
    <div className="bg-[#FAF7F2] min-h-screen py-10 md:py-16 font-sans" id="lead-magnet-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-[#5C6E60]">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('home');
            }}
            className="hover:text-[#142B1E] transition-colors cursor-pointer"
          >
            Home
          </a>
          <span>/</span>
          <span className="text-[#142B1E] font-medium">Care Card Generator</span>
        </nav>

        {/* Title & Concept Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#E2EFE5] text-[#235837] border border-[#C2DEC9]">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#235837]" /> Free Printable Care Tool
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#142B1E] tracking-tight" id="magnet-title">
            Custom Botanical Care Card & Cheat Sheet Creator
          </h1>
          <p className="text-[#4D5D53] text-sm sm:text-base leading-relaxed">
            Tell us about your home’s lighting levels, vessel material, and seasonal placement. Our diagnostic builder will design a highly-polished, printable custom care card with calculated watering schedules suited specifically for your plant.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Builder input settings FORM */}
          <div className={`lg:col-span-6 bg-white p-6 sm:p-7 rounded-2xl border ${isGenerated ? 'border-[#E8E2D5]' : 'border-[#235837]/40 ring-2 ring-[#235837]/10'} shadow-xs space-y-5 transition-all`}>
            <div className="border-b border-[#F0EBE1] pb-3 flex items-center justify-between">
              <h2 className="font-serif font-bold text-sm text-[#142B1E] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#235837]" /> Card Details
              </h2>
              <span className="text-[10px] uppercase font-mono font-bold bg-[#F3EFE6] px-2 py-0.5 rounded text-[#4A5D4E] border border-[#E8E2D5]">
                Interactive
              </span>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4 text-xs font-sans">
              
              {/* Step 1: Nickname */}
              <div>
                <label className="block font-bold text-[#142B1E] mb-1" htmlFor="plant-nickname">
                  1. Plant Nickname / ID
                </label>
                <input 
                  id="plant-nickname"
                  type="text"
                  placeholder="e.g. Spike, Corner Sansevieria, Living Room Gem"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full text-xs p-3 border border-[#E8E2D5] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#235837] bg-[#FAF7F2] text-[#142B1E]"
                  maxLength={32}
                />
              </div>

              {/* Step 2: Light Selection */}
              <div>
                <label className="block font-bold text-[#142B1E] mb-1">
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
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        light === item.id 
                          ? 'border-[#235837] bg-[#E2EFE5]/50 font-bold text-[#142B1E]' 
                          : 'border-[#E8E2D5] bg-white hover:bg-[#FAF7F2] text-[#4D5D53]'
                      }`}
                      id={`light-choice-${item.id}`}
                    >
                      <span className="block font-semibold mb-0.5 text-xs">{item.label}</span>
                      <span className="block text-[10px] text-[#6B7C70] font-normal">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Container types */}
              <div>
                <label className="block font-bold text-[#142B1E] mb-1">
                  3. Container Pot Material Style
                </label>
                <select
                  value={container}
                  onChange={(e) => setContainer(e.target.value)}
                  className="w-full text-xs p-3 border border-[#E8E2D5] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#235837] bg-[#FAF7F2] cursor-pointer font-medium text-[#142B1E]"
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
                <label className="block font-bold text-[#142B1E] mb-1">
                  4. Primary Active Season
                </label>
                <div className="flex bg-[#F3EFE6] p-1 rounded-xl border border-[#E8E2D5]">
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
                      className={`flex-1 text-center py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        season === item.id 
                          ? 'bg-[#235837] text-white font-bold shadow-xs' 
                          : 'text-[#4D5D53] hover:text-[#142B1E] hover:bg-white/60'
                      }`}
                      id={`season-choice-${item.id}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 5: Email Opt in */}
              <div className="pt-4 border-t border-[#F0EBE1] space-y-3">
                <div>
                  <label className="block font-bold text-[#142B1E] mb-1" htmlFor="lead-email">
                    5. Email Delivery Vector
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7C70]">
                      <Mail className="w-3.5 h-3.5" />
                    </span>
                    <input 
                      id="lead-email"
                      type="email"
                      required
                      placeholder="Enter email to activate & print..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-3 border border-[#E8E2D5] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#235837] bg-[#FAF7F2] font-mono text-[#142B1E]"
                    />
                  </div>
                </div>

                <div className="bg-[#E2EFE5]/40 p-3 rounded-xl text-[11px] text-[#235837] leading-relaxed border border-[#C2DEC9]">
                  <strong>🔒 Our Botanical Anti-Spam Pledge:</strong> We respect your email. Your details are registered to construct the downloadable worksheet. We'll send you our <strong>3-2-1 Printable Soil Cheat Sheet</strong> today and bi-weekly care audits. Opt-out anytime.
                </div>
              </div>

              {/* Submission Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#235837] hover:bg-[#1A4329] text-white py-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-70"
                id="generate-care-card-btn"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Calibrating Evaporation Cycles...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#9EC4A9]" />
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
              <div className="border-2 border-dashed border-[#D5CDBD] rounded-2xl p-12 text-center bg-white text-[#6B7C70] flex flex-col items-center justify-center min-h-[460px]">
                <FileText className="w-12 h-12 text-[#9EC4A9] mb-4 stroke-[1.2]" />
                <h3 className="font-serif font-bold text-[#142B1E] text-base">Interactive Care Card Preview</h3>
                <p className="text-xs text-[#5C6E60] mt-1 max-w-xs leading-relaxed">
                  Complete the care parameters and enter your email address to render a downloadable index card template for your plant stand.
                </p>
                <div className="mt-8 flex gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D5CDBD] animate-bounce delay-100" />
                  <span className="w-2 h-2 rounded-full bg-[#D5CDBD] animate-bounce delay-200" />
                  <span className="w-2 h-2 rounded-full bg-[#D5CDBD] animate-bounce delay-300" />
                </div>
              </div>
            ) : (
              /* Active, beautiful printable care card */
              <div className="space-y-4">
                
                {/* Achievement Badge notifications */}
                <div className="bg-[#E2EFE5] border border-[#C2DEC9] text-[#142B1E] px-4 py-3 rounded-xl text-xs flex gap-2.5 items-start">
                  <Check className="w-4.5 h-4.5 bg-[#235837] text-white rounded-full p-0.5 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Card Customization Complete!</span>
                    <p className="text-[11px] text-[#235837] leading-normal mt-0.5">
                      Your unique card has been successfully registered. We have sent the 3-2-1 Soil formula sheet to <strong>{email}</strong>. Use the print and copy controls below.
                    </p>
                  </div>
                </div>

                {/* Physical style Card container */}
                <div 
                  ref={printableRef}
                  className="bg-[#FCFBF8] border-2 border-[#142B1E] rounded-2xl p-6 shadow-md relative overflow-hidden print:border-black print:shadow-none"
                  style={{ contentVisibility: 'auto' }}
                  id="physical-carecard-container"
                >
                  
                  {/* Botanical Label banner */}
                  <div className="flex justify-between items-start border-b-2 border-[#142B1E] pb-4">
                    <div>
                      <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#235837] block">SNAKEPLANTSOIL.COM CARE RECORD</span>
                      <h4 className="text-lg font-serif font-bold text-[#142B1E] tracking-tight mt-0.5">
                        {nickname || "Unidentified Sansevieria"}
                      </h4>
                    </div>
                    <div className="w-8 h-8 rounded bg-[#235837] text-white flex items-center justify-center font-serif font-bold text-sm">
                      S
                    </div>
                  </div>

                  {/* Grid Ratios of metrics */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-b border-[#E8E2D5] text-xs">
                    <div>
                      <span className="font-semibold text-[#6B7C70] uppercase tracking-widest text-[9px] block">Calculated Watering Period</span>
                      <span className="text-[#142B1E] font-bold text-base block mt-0.5 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#235837]" />
                        Every {daysInterval} Days
                      </span>
                      <span className="text-[10px] text-[#6B7C70] italic block mt-0.5">"Soak and Dry" interval</span>
                    </div>

                    <div>
                      <span className="font-semibold text-[#6B7C70] uppercase tracking-widest text-[9px] block">Rhizome Disease risk</span>
                      <span className={`inline-block px-2 py-0.5 rounded font-mono font-bold text-[11px] mt-1.5 ${prescription.riskColor}`}>
                        {prescription.risk}
                      </span>
                    </div>

                    <div>
                      <span className="font-semibold text-[#6B7C70] uppercase tracking-widest text-[9px] block">Placement light</span>
                      <span className="text-[#142B1E] font-medium block mt-1 capitalize">
                        {light === 'direct' ? '☀️ Bright Direct Sun' :
                         light === 'indirect' ? '🌤️ Bright Indirect' :
                         light === 'moderate' ? 'Closer Filtered Light' : 'Low Light Corner'}
                      </span>
                    </div>

                    <div>
                      <span className="font-semibold text-[#6B7C70] uppercase tracking-widest text-[9px] block">Pot media style</span>
                      <span className="text-[#142B1E] font-medium block mt-1 capitalize">
                        {container === 'terracotta' ? 'Terracotta Clay' :
                         container === 'ceramic' ? 'Glazed Ceramic' :
                         container === 'plastic' ? 'Plastic Liner' : 'No Drainage Hole'}
                      </span>
                    </div>
                  </div>

                  {/* Detailed Advisory */}
                  <div className="py-4 space-y-1 text-xs border-b border-[#E8E2D5]">
                    <span className="font-semibold text-[#6B7C70] uppercase tracking-widest text-[9px] block">Custom Botanical Formulation Note</span>
                    <p className="text-[#2B3B30] leading-relaxed font-serif italic text-xs pl-3 border-l-2 border-[#235837]">
                      "{prescription.advice}"
                    </p>
                  </div>

                  {/* Footer specs */}
                  <div className="pt-4 flex items-center justify-between text-[10px] text-[#6B7C70] font-mono">
                    <span>Authorized Care Record #SPS-{Math.floor(Math.random() * 900000 + 100000)}</span>
                    <span className="text-[#235837] font-bold">SnakePlantSoil.com</span>
                  </div>

                </div>

                {/* Auxiliary actions block */}
                <div className="flex gap-2 justify-center pt-2">
                  <button
                    onClick={handlePrint}
                    className="bg-white border border-[#E8E2D5] text-[#2B3B30] hover:bg-[#FAF7F2] px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    id="print-card-badge"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#235837]" />
                    <span>Print & Save Card</span>
                  </button>
                  <button
                    onClick={copyCardText}
                    className="bg-white border border-[#E8E2D5] text-[#2B3B30] hover:bg-[#FAF7F2] px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    id="copy-card-text"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#235837]" />
                        <span className="text-[#235837] font-bold">Information Copied!</span>
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
                    className="bg-[#F3EFE6] text-[#4A5D4E] hover:bg-[#E8E2D5] px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
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

      </div>
    </div>
  );
}
