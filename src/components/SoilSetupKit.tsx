import { useState } from 'react';
import { 
  Sparkles, AlertTriangle, CheckCircle2, ArrowRight, ExternalLink, 
  ShoppingBag, Copy, Check, Info, Award, HelpCircle, RefreshCw, Bookmark
} from 'lucide-react';
import { 
  DIAGNOSTIC_QUESTIONS, SOIL_PROFILES, COMMERCIAL_PRODUCTS, 
  SoilProfile, CatalogProduct, DiagnosticChoice 
} from '../diagnosticConfig';
import { trackEvent } from '../utils/analytics';

export default function SoilSetupKit({ onNavigate }: { onNavigate?: (tab: string) => void } = {}) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showWarningAcknowledge, setShowWarningAcknowledge] = useState<boolean>(false);

  const totalSteps = DIAGNOSTIC_QUESTIONS.length;
  const currentQuestion = DIAGNOSTIC_QUESTIONS[currentStep];

  const handleStart = () => {
    trackEvent('soil_check_started');
    setCurrentStep(0);
    setAnswers({});
    setIsCompleted(false);
    setShowWarningAcknowledge(false);
  };

  const handleSelectChoice = (choiceId: string) => {
    const nextAnswers = { ...answers, [currentQuestion.id]: choiceId };
    setAnswers(nextAnswers);

    trackEvent('soil_check_step_completed', {
      stepIndex: currentStep + 1,
      questionId: currentQuestion.id,
      answerId: choiceId
    });

    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsCompleted(true);
      trackEvent('soil_check_completed', {
        selectionSummary: JSON.stringify(nextAnswers)
      });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Scoring engine to route users to the correct profile
  const getRecommendedProfile = (): SoilProfile => {
    const scores: Record<string, number> = {
      'fast-drain': 0,
      'everyday-balance': 0,
      'dry-home': 0,
      'recovery': 0,
      'propagation': 0
    };

    // Calculate score totals based on selected answers
    DIAGNOSTIC_QUESTIONS.forEach(q => {
      const selectedChoiceId = answers[q.id];
      const selectedChoice = q.choices.find(c => c.id === selectedChoiceId);
      if (selectedChoice && selectedChoice.scores) {
        Object.entries(selectedChoice.scores).forEach(([profileId, val]) => {
          if (scores[profileId] !== undefined) {
            scores[profileId] += val;
          }
        });
      }
    });

    // Check if the user selected any warning signs (e.g. mushy or yellow leaves)
    const leavesAnswer = answers['leaves'];
    const selectedLeafChoice = DIAGNOSTIC_QUESTIONS[0].choices.find(c => c.id === leavesAnswer);
    const hasDangerousSymptom = selectedLeafChoice?.isWarning || answers['pot'] === 'no-drainage';

    if (hasDangerousSymptom) {
      // Force routing to the Recovery profile
      const recoveryProfile = SOIL_PROFILES.find(p => p.id === 'recovery');
      if (recoveryProfile) return recoveryProfile;
    }

    // Identify profile with the highest score
    let bestProfileId = 'everyday-balance';
    let maxScore = -1;

    Object.entries(scores).forEach(([profileId, score]) => {
      if (score > maxScore) {
        maxScore = score;
        bestProfileId = profileId;
      }
    });

    return SOIL_PROFILES.find(p => p.id === bestProfileId) || SOIL_PROFILES[1];
  };

  const activeProfile = isCompleted ? getRecommendedProfile() : SOIL_PROFILES[1];

  // Track event when a profile is recommended
  if (isCompleted) {
    trackEvent('soil_profile_recommended', {
      recommendedProfile: activeProfile.name
    });
  }

  // Get matching products from provisional catalog
  const getProfileProducts = (): CatalogProduct[] => {
    return COMMERCIAL_PRODUCTS.filter(p => p.qualifyingProfiles.includes(activeProfile.id));
  };

  const matchingProducts = getProfileProducts();

  // Find specific product designations
  const primaryMatch = matchingProducts.find(p => p.designation === 'primary');
  const alternativeMatch = matchingProducts.find(p => p.designation === 'widely-available' || p.designation === 'budget');

  const hasDangerousSymptom = isCompleted && (
    answers['leaves'] === 'soft-mushy' || 
    answers['leaves'] === 'yellow-base' ||
    answers['pot'] === 'no-drainage'
  );

  const getSymptomLabel = (questionId: string, choiceId: string) => {
    const q = DIAGNOSTIC_QUESTIONS.find(x => x.id === questionId);
    const c = q?.choices.find(x => x.id === choiceId);
    return c ? c.text : choiceId;
  };

  return (
    <div className="bg-[#FAF7F2] text-[#292524] w-full py-6 sm:py-8 font-sans" id="soil-setup-kit-container">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Trail */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1.5 text-xs text-stone-500 font-sans">
            <li>
              <a href="/" className="hover:text-[#142B1E] hover:underline focus:outline-none transition-colors">
                Home
              </a>
            </li>
            <li className="text-stone-400">/</li>
            <li className="text-stone-800 font-semibold">
              Soil Diagnosis
            </li>
          </ol>
        </nav>

        {/* Questionnaire Phase */}
        {!isCompleted && (
          <div className="bg-white rounded-2xl border border-[#E8E2D5] p-6 sm:p-10 shadow-xs">
            {/* Header Info */}
            <div className="border-b border-[#E8E2D5] pb-6 mb-8">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#235837] bg-[#E2EFE5] px-3 py-1 rounded-full font-sans">
                <Sparkles className="w-3 h-3 text-[#235837]" /> Plant &amp; Soil Assessment
              </span>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-[#142B1E] mt-3 tracking-tight">
                Snake Plant Soil Diagnosis
              </h1>
              <p className="font-sans text-stone-600 text-sm mt-2 max-w-2xl leading-relaxed">
                Answer a few questions about your plant, container type, and home environment. We will recommend a practical commercial soil profile based on the conditions you select.
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex justify-between items-center text-xs font-bold text-stone-500 mb-2 font-sans">
                <span>Question {currentStep + 1} of {totalSteps}</span>
                <span className="text-[#235837]">{Math.round(((currentStep) / totalSteps) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-[#E2EFE5] h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#235837] transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Body */}
            <div className="space-y-6">
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#142B1E] tracking-tight" id="active-question-title">
                {currentQuestion.text}
              </h2>

              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => handleSelectChoice(choice.id)}
                    className={`w-full text-left p-4 sm:p-5 rounded-xl border text-sm transition-all flex items-center justify-between group cursor-pointer ${
                      choice.isWarning
                        ? 'border-amber-300 hover:border-amber-500 bg-amber-50/40 text-amber-950 shadow-2xs'
                        : 'border-[#E8E2D5] hover:border-[#235837] hover:bg-[#FAF7F2] bg-white text-stone-800 shadow-2xs'
                    }`}
                    id={`choice-btn-${choice.id}`}
                  >
                    <span className="font-semibold group-hover:text-[#142B1E] pr-4 font-sans">{choice.text}</span>
                    <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-[#235837] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                ))}
              </div>

              {/* Back Button */}
              {currentStep > 0 && (
                <div className="pt-4 border-t border-[#E8E2D5] flex">
                  <button
                    onClick={handlePrevStep}
                    className="px-4 py-2 border border-[#E8E2D5] hover:bg-stone-50 rounded-lg text-xs font-bold text-stone-600 transition-colors cursor-pointer font-sans"
                    id="prev-step-btn"
                  >
                    ← Previous Question
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Result Phase */}
        {isCompleted && (
          <div className="bg-white rounded-2xl border border-[#E8E2D5] p-6 sm:p-10 shadow-xs space-y-8">
            {/* Result Header */}
            <div className="border-b border-[#E8E2D5] pb-6">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#235837] bg-[#E2EFE5] px-3 py-1 rounded-full font-sans">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#235837]" /> Assessment Complete
              </span>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl text-[#142B1E] mt-3 tracking-tight">
                Your Recommended Profile: <span className="text-[#235837]">{activeProfile.name}</span>
              </h1>
              <p className="font-sans text-stone-600 text-sm mt-2 max-w-2xl leading-relaxed">
                Based on the conditions you selected, this soil profile highlights the drainage and moisture-retention characteristics appropriate for your snake plant.
              </p>
            </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Result Columns */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Profile Details Block */}
              <div className="bg-[#FAF7F2] border border-[#E8E2D5] p-5 sm:p-6 rounded-2xl space-y-3 font-sans">
                <h4 className="text-[10px] font-bold uppercase text-[#235837] tracking-wider">
                  Profile Characteristics:
                </h4>
                <div className="text-sm text-stone-800 leading-relaxed font-sans">
                  {activeProfile.description}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#E8E2D5] text-xs">
                  <div>
                    <span className="text-stone-500 font-bold uppercase tracking-wider text-[9px] block">Target Conditions</span>
                    <span className="text-stone-800 font-medium block mt-0.5">{activeProfile.designedFor}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 font-bold uppercase tracking-wider text-[9px] block">Physical Properties</span>
                    <span className="text-stone-800 font-medium block mt-0.5">{activeProfile.characteristics}</span>
                  </div>
                </div>
              </div>

              {/* Warning logic for dangerous symptoms (Must acknowledge before showing products) */}
              {hasDangerousSymptom && (
                <div className="border border-amber-300 bg-amber-50/40 p-5 rounded-2xl space-y-3.5 font-sans">
                  <div className="flex gap-2.5 items-start text-amber-900">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
                    <div>
                      <h4 className="font-serif font-bold text-stone-900 text-base">Dangerous Symptoms Identified</h4>
                      <p className="text-stone-700 text-xs leading-relaxed mt-1">
                        {activeProfile.warningText || "Your plant shows signs of excessive moisture accumulation or possible root decay. Changing soil alone will not save a plant with rotted root tissue."}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-amber-200/80 text-xs text-stone-700 space-y-2">
                    <strong className="text-stone-900 block font-serif">Recommended Inspection Protocol:</strong>
                    <ol className="list-decimal pl-4 space-y-1 leading-relaxed text-xs">
                      <li>Slide the plant out of its container and gently brush soil off the roots.</li>
                      <li>Inspect the rhizome (the thick bulbous root base) and secondary roots. Healthy roots are firm and pale; rotted roots are dark, mushy, and stringy.</li>
                      <li>Use clean, sharp scissors to trim away all rotted black tissue.</li>
                      <li>Dust the cuts lightly with cinnamon or let the roots sit in a dry, shaded spot for 12–24 hours to callous over before potting again.</li>
                    </ol>
                  </div>

                  {!showWarningAcknowledge ? (
                    <button
                      onClick={() => setShowWarningAcknowledge(true)}
                      className="w-full bg-[#142B1E] hover:bg-[#235837] text-white py-2.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer font-sans"
                      id="acknowledge-warning-btn"
                    >
                      Acknowledge Inspection Protocol to View Suggested Soils
                    </button>
                  ) : (
                    <div className="text-center text-xs text-[#235837] font-bold">
                      ✓ Acknowledged. Recommended recovery mixes are detailed below.
                    </div>
                  )}
                </div>
              )}

              {/* Product Matches (Conditional if dangerous symptoms are resolved/acknowledged) */}
              {(!hasDangerousSymptom || showWarningAcknowledge) && (
                <div className="space-y-4 font-sans">
                  <h4 className="font-serif font-bold text-lg text-[#142B1E]">
                    Suggested Commercially Available Blends:
                  </h4>
                  
                  {matchingProducts.length === 0 ? (
                    <div className="p-6 rounded-2xl border-2 border-dashed border-[#E8E2D5] text-center bg-[#FAF7F2]">
                      <HelpCircle className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                      <span className="font-bold text-stone-700 text-xs block">No Commercial Mixes Listed</span>
                      <p className="text-xs text-stone-500 mt-1">No commercial mixes are currently listed for this specific combination. Consider mixing a custom blend using our DIY calculator.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {matchingProducts.map((prod) => {
                        // Track commercial product viewed
                        trackEvent('commercial_product_viewed', {
                          productId: prod.id,
                          productName: prod.name
                        });

                        return (
                          <div 
                            key={prod.id}
                            className="border border-[#E8E2D5] bg-white rounded-xl p-4 sm:p-5 space-y-4 shadow-2xs hover:border-[#235837] transition-all"
                            id={`catalog-product-${prod.id}`}
                          >
                            <div className="flex flex-col sm:flex-row gap-4 items-start">
                              {/* Product Thumbnail */}
                              <div className="w-16 h-16 rounded-xl bg-stone-100 overflow-hidden border border-[#E8E2D5] shrink-0 relative">
                                <img 
                                  src={prod.imageUrl} 
                                  alt={prod.name} 
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="text-[10px] font-bold text-[#235837] bg-[#E2EFE5] px-2 py-0.5 rounded-full uppercase">
                                    {prod.brand}
                                  </span>
                                  <span className="text-[10px] font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full">
                                    Volume: {prod.packageVolume}
                                  </span>
                                </div>
                                <h5 className="font-serif font-bold text-[#142B1E] text-base mt-1.5 leading-snug">
                                  {prod.name}
                                </h5>
                                <p className="text-stone-600 text-xs leading-relaxed mt-1">
                                  {prod.bestUse}
                                </p>
                              </div>
                            </div>

                            {/* Specifications Grid */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 bg-[#FAF7F2] border border-[#E8E2D5] p-3 rounded-lg text-xs leading-relaxed">
                              <div>
                                <span className="text-stone-500 font-bold text-[9px] uppercase tracking-wider block">Ingredients</span>
                                <span className="text-stone-800 font-medium">{prod.verifiedIngredients || "Unlisted or proprietary"}</span>
                              </div>
                              <div>
                                <span className="text-stone-500 font-bold text-[9px] uppercase tracking-wider block">Package Volume</span>
                                <span className="text-stone-800 font-medium">{prod.packageVolume}</span>
                              </div>
                              <div>
                                <span className="text-stone-500 font-bold text-[9px] uppercase tracking-wider block">Drainage Rate</span>
                                <span className="text-stone-800 font-medium">{prod.drainageType}</span>
                              </div>
                              <div>
                                <span className="text-stone-500 font-bold text-[9px] uppercase tracking-wider block">Price Category</span>
                                <span className="text-stone-800 font-medium">{prod.priceTier}</span>
                              </div>
                            </div>

                            {/* Gritty advisory warnings */}
                            {prod.grittyAdvisory && (
                              <div className="bg-amber-50/40 border border-amber-200/80 p-3 rounded-lg text-xs text-stone-700 flex gap-2">
                                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                  <strong>Gritty Soil Care:</strong> {prod.grittyAdvisory}
                                </div>
                              </div>
                            )}

                            {/* Strengths & Limitations */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-normal">
                              <div>
                                <span className="font-bold text-[#235837] text-[10px] uppercase tracking-wider block mb-1">Strengths:</span>
                                <ul className="list-disc pl-4 space-y-0.5 text-stone-600 text-xs">
                                  {prod.strengths.map((str, idx) => <li key={idx}>{str}</li>)}
                                </ul>
                              </div>
                              <div>
                                <span className="font-bold text-stone-500 text-[10px] uppercase tracking-wider block mb-1">Cautions:</span>
                                <ul className="list-disc pl-4 space-y-0.5 text-stone-600 text-xs">
                                  {prod.limitations.map((lim, idx) => <li key={idx}>{lim}</li>)}
                                </ul>
                              </div>
                            </div>

                            {/* Buy Affiliate CTA */}
                            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                              <span className="text-stone-500">Price Tier: <strong className="text-[#142B1E]">{prod.priceTier}</strong></span>
                              <a
                                href={prod.affiliateUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackEvent('affiliate_link_clicked', { productId: prod.id, productName: prod.name })}
                                className="bg-[#142B1E] hover:bg-[#235837] text-white font-bold px-4 py-2 rounded-full text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                                id={`diagnostic-shop-btn-${prod.id}`}
                              >
                                <span>Check Price on Amazon</span>
                                <ExternalLink className="w-3.5 h-3.5 text-[#9EC4A9]" />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Instructions and Guides link list */}
              {(!hasDangerousSymptom || showWarningAcknowledge) && (
                <div className="space-y-4 pt-4 border-t border-stone-100 font-sans">
                  <h4 className="font-serif font-bold text-base text-[#142B1E]">
                    Potting &amp; Watering Guidelines:
                  </h4>
                  <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E8E2D5] text-xs leading-relaxed text-stone-700 space-y-2">
                    <div>
                      <strong>Pot Sizing:</strong> We recommend a container with substantial bottom drainage holes that is only 1-2 inches wider in diameter than the current root ball. If your selected pot has drainage and is terracotta, it is an ideal fit.
                    </div>
                    <div>
                      <strong>Watering Routine:</strong> {activeProfile.wateringCareNotes}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2.5 pt-2">
                    <a
                      href="/best-snake-plant-soil"
                      className="bg-white border border-[#E8E2D5] hover:bg-[#FAF7F2] text-stone-700 font-bold px-4 py-2 rounded-full text-xs transition-colors flex items-center gap-1.5"
                      id="view-comparison-page"
                    >
                      <Award className="w-3.5 h-3.5 text-[#235837]" />
                      <span>Compare Pre-made Soils</span>
                    </a>
                    <a
                      href="/diy-snake-plant-soil-mix"
                      onClick={() => trackEvent('diy_mix_guide_clicked')}
                      className="bg-white border border-[#E8E2D5] hover:bg-[#FAF7F2] text-stone-700 font-bold px-4 py-2 rounded-full text-xs transition-colors flex items-center gap-1.5"
                      id="view-diy-guide"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-[#235837]" />
                      <span>Prefer Mixing Your Own? DIY Guide</span>
                    </a>
                  </div>
                </div>
              )}

            </div>

            {/* Right Result Columns (Waitlist Form) */}
            <div className="lg:col-span-5 space-y-6 font-sans">
              
              {/* User Condition Summary */}
              <div className="border border-[#E8E2D5] rounded-2xl p-5 space-y-3 bg-[#FAF7F2]">
                <h4 className="text-[10px] font-bold uppercase text-[#235837] tracking-wider font-sans">
                  Summary of Selected Conditions:
                </h4>
                <ul className="text-xs space-y-2 text-stone-700 leading-normal font-sans">
                  <li>• Leaf status: <strong className="text-stone-900">{getSymptomLabel('leaves', answers['leaves'])}</strong></li>
                  <li>• Soil dampness: <strong className="text-stone-900">{getSymptomLabel('dampness', answers['dampness'])}</strong></li>
                  <li>• Light exposure: <strong className="text-stone-900">{getSymptomLabel('light', answers['light'])}</strong></li>
                  <li>• Pot material: <strong className="text-stone-900">{getSymptomLabel('pot', answers['pot'])}</strong></li>
                  <li>• Air humidity: <strong className="text-stone-900">{getSymptomLabel('humidity', answers['humidity'])}</strong></li>
                  <li>• Watering habits: <strong className="text-stone-900">{getSymptomLabel('watering', answers['watering'])}</strong></li>
                </ul>

                <div className="pt-3 border-t border-[#E8E2D5] text-xs leading-relaxed text-stone-600">
                  <span className="font-bold text-[#142B1E] block mb-0.5">Most likely soil concern:</span>
                  {activeProfile.id === 'recovery' && "Immediate risk of fungal infection and tissue breakdown due to oxygen starvation."}
                  {activeProfile.id === 'fast-drain' && "Slow evaporation rate causing water pooling; needs higher mineral grit."}
                  {activeProfile.id === 'dry-home' && "Rapid soil dry-down; needs baseline organic content to absorb trace moisture."}
                  {activeProfile.id === 'everyday-balance' && "Standard soil dry-down rate. Requires routine repotting checks."}
                  {activeProfile.id === 'propagation' && "Fragile cutting root network requiring light, loose substrate."}
                </div>

                <div className="pt-2 text-xs leading-normal text-stone-500">
                  <span className="font-bold text-stone-700 block mb-0.5">Other possibilities:</span>
                  Seasonal light changes or minor insect pests may also affect leaf appearance. We recommend inspecting leaf tips for dryness and checking base thickness.
                </div>

                <div className="pt-2 text-xs leading-normal text-stone-500 border-t border-dashed border-[#E8E2D5]">
                  <span className="font-bold text-stone-700 block">Undetermined factors:</span>
                  We cannot definitively evaluate internal root damage or soil pathogens without physically unpotting and rinsing the roots.
                </div>
              </div>

              {/* Recommended Next Steps & Companion Guides */}
              <div className="bg-white border border-[#E8E2D5] rounded-2xl p-5 space-y-3">
                <div className="border-b border-[#E8E2D5] pb-2">
                  <h4 className="text-[10px] font-bold uppercase text-[#235837] tracking-wider font-sans">
                    Recommended Next Steps:
                  </h4>
                  <h5 className="font-serif font-bold text-[#142B1E] text-base mt-1">
                    Companion Care Guides & Calculators
                  </h5>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed font-sans">
                    Explore these practical tools to dial in your snake plant's potting, watering, and container setup:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs font-sans">
                  <a
                    href="/soil-calculator"
                    onClick={(e) => { 
                      if (onNavigate) {
                        e.preventDefault(); 
                        onNavigate('calculator');
                      }
                    }}
                    className="p-3 rounded-xl border border-[#E8E2D5] bg-[#FAF7F2] hover:border-[#235837] transition-all flex flex-col justify-between cursor-pointer"
                  >
                    <span className="font-bold text-[#142B1E] block">DIY Mix Calculator</span>
                    <span className="text-stone-500 text-[11px] mt-1">Calculate exact batch parts &rarr;</span>
                  </a>
                  <a
                    href="/best-pots"
                    onClick={(e) => { 
                      if (onNavigate) {
                        e.preventDefault(); 
                        onNavigate('pots');
                      }
                    }}
                    className="p-3 rounded-xl border border-[#E8E2D5] bg-[#FAF7F2] hover:border-[#235837] transition-all flex flex-col justify-between cursor-pointer"
                  >
                    <span className="font-bold text-[#142B1E] block">Pot Sizing Guide</span>
                    <span className="text-stone-500 text-[11px] mt-1">Terracotta vs ceramic &rarr;</span>
                  </a>
                  <a
                    href="/winter-watering-guide"
                    onClick={(e) => { 
                      if (onNavigate) {
                        e.preventDefault(); 
                        onNavigate('winter-watering-guide');
                      }
                    }}
                    className="p-3 rounded-xl border border-[#E8E2D5] bg-[#FAF7F2] hover:border-[#235837] transition-all flex flex-col justify-between cursor-pointer"
                  >
                    <span className="font-bold text-[#142B1E] block">Watering Method</span>
                    <span className="text-stone-500 text-[11px] mt-1">Soak-and-dry rules &rarr;</span>
                  </a>
                </div>
              </div>

              {/* Secure affiliate disclosure banner */}
              <div className="bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl p-4 text-xs leading-relaxed text-stone-500">
                <strong>Affiliate Transparency:</strong> SnakePlantSoil.com is reader-supported. Some recommended product buttons contain Amazon affiliate links that earn commissions at no additional cost to you.
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={handleStart}
                  className="text-xs font-bold text-[#235837] hover:text-[#142B1E] flex items-center gap-1.5 mx-auto focus:outline-none cursor-pointer"
                  id="reset-diagnosis"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Start New Assessment</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
