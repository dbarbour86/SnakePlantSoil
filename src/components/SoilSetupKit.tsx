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
import { isBackendConnected, submitToWaitlist } from '../utils/waitlistAdapter';

export default function SoilSetupKit() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Future Product Waitlist Interest Form States
  const [preferredBagSize, setPreferredBagSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [productStyle, setProductStyle] = useState<'premixed' | 'booster'>('premixed');
  const [pricePreference, setPricePreference] = useState<string>('$10 - $15');
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
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm p-6 sm:p-8" id="soil-setup-kit-container">
      
      {/* Questionnaire Phase */}
      {!isCompleted && (
        <div>
          {/* Header Info */}
          <div className="border-b border-stone-100 pb-5 mb-6">
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-100">
              <Sparkles className="w-3 h-3 animate-pulse" /> Plant &amp; Soil Assessment
            </span>
            <h3 className="text-xl sm:text-2xl font-mono font-bold text-stone-900 mt-2 tracking-tight">
              Snake Plant Soil Diagnosis
            </h3>
            <p className="text-xs text-stone-500 mt-1.5 max-w-2xl leading-relaxed">
              Answer a few questions about your plant, container type, and home environment. We will recommend a practical commercial soil profile based on the conditions you select.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center text-[10px] font-mono font-bold text-stone-400 mb-2 uppercase tracking-wider">
              <span>Question {currentStep + 1} of {totalSteps}</span>
              <span>{Math.round(((currentStep) / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden border border-stone-200/50">
              <div 
                className="h-full bg-emerald-800 transition-all duration-300 ease-out"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Body */}
          <div className="space-y-6">
            <h4 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight" id="active-question-title">
              {currentQuestion.text}
            </h4>

            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleSelectChoice(choice.id)}
                  className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between group ${
                    choice.isWarning
                      ? 'border-amber-250 hover:border-amber-400 bg-amber-50/10 text-stone-850'
                      : 'border-stone-200 hover:border-emerald-800 bg-stone-50/40 hover:bg-white text-stone-750'
                  }`}
                  id={`choice-btn-${choice.id}`}
                >
                  <span className="font-semibold group-hover:text-stone-950 pr-4">{choice.text}</span>
                  <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-emerald-800 transition-colors shrink-0" />
                </button>
              ))}
            </div>

            {/* Back Button */}
            {currentStep > 0 && (
              <div className="pt-4 border-t border-stone-100 flex">
                <button
                  onClick={handlePrevStep}
                  className="px-4 py-2 border border-stone-200 hover:bg-stone-50 rounded-lg text-xs font-semibold text-stone-600 transition-colors"
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
        <div className="space-y-8">
          {/* Result Header */}
          <div className="border-b border-stone-200 pb-5">
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-100">
              <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Assessment Complete
            </span>
            <h3 className="text-xl sm:text-2xl font-mono font-bold text-stone-900 mt-2 tracking-tight">
              Your Recommended Profile: <span className="text-emerald-850">{activeProfile.name}</span>
            </h3>
            <p className="text-xs text-stone-550 mt-1 max-w-2xl leading-relaxed">
              Based on the conditions you selected, this soil profile highlights the drainage and moisture-retention characteristics appropriate for your snake plant.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Result Columns */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Profile Details Block */}
              <div className="bg-stone-50 border border-stone-200 p-5 rounded-2xl space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase text-stone-400 tracking-wider">
                  Profile Characteristics:
                </h4>
                <div className="text-xs sm:text-sm text-stone-850 font-medium leading-relaxed">
                  {activeProfile.description}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-stone-200/60 text-xs">
                  <div>
                    <span className="text-stone-400 font-semibold uppercase tracking-wider text-[9px] block">Target Conditions</span>
                    <span className="text-stone-750 font-medium block mt-0.5">{activeProfile.designedFor}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 font-semibold uppercase tracking-wider text-[9px] block">Physical Properties</span>
                    <span className="text-stone-750 font-medium block mt-0.5">{activeProfile.characteristics}</span>
                  </div>
                </div>
              </div>

              {/* Warning logic for dangerous symptoms (Must acknowledge before showing products) */}
              {hasDangerousSymptom && (
                <div className="border border-amber-300 bg-amber-50/20 p-5 rounded-2xl space-y-3.5">
                  <div className="flex gap-2.5 items-start text-amber-800">
                    <AlertTriangle className="w-5.5 h-5.5 shrink-0 mt-0.5 text-amber-600" />
                    <div>
                      <h5 className="font-bold text-stone-900 text-sm">Dangerous Symptoms Identified</h5>
                      <p className="text-stone-700 text-xs leading-relaxed mt-1">
                        {activeProfile.warningText || "Your plant shows signs of excessive moisture accumulation or possible root decay. Changing soil alone will not save a plant with rotted root tissue."}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-amber-200/80 text-xs text-stone-650 space-y-2">
                    <span className="font-bold text-stone-800 block">Recommended Inspection Protocol:</span>
                    <ol className="list-decimal pl-4 space-y-1 leading-relaxed text-[11px]">
                      <li>Slide the plant out of its container and gently brush soil off the roots.</li>
                      <li>Inspect the rhizome (the thick bulbous root base) and secondary roots. Healthy roots are yellow-orange and firm; rotted roots are black, mushy, and stringy.</li>
                      <li>Use a sterilized blade to trim away all rotted black tissue.</li>
                      <li>Dust the cuts with cinnamon powder (a natural anti-fungal) and let the roots sit in a dry, shaded spot for 24-48 hours to callous over before potting again.</li>
                    </ol>
                  </div>

                  {!showWarningAcknowledge ? (
                    <button
                      onClick={() => setShowWarningAcknowledge(true)}
                      className="w-full bg-stone-900 hover:bg-stone-850 text-white py-2.5 rounded-lg text-xs font-bold transition-all text-center"
                      id="acknowledge-warning-btn"
                    >
                      Acknowledge Inspection Protocol to View Suggested Soils
                    </button>
                  ) : (
                    <div className="text-center text-[10px] text-stone-400 italic">
                      ✓ Acknowledged. Recommended recovery mixes are detailed below.
                    </div>
                  )}
                </div>
              )}

              {/* Product Matches (Conditional if dangerous symptoms are resolved/acknowledged) */}
              {(!hasDangerousSymptom || showWarningAcknowledge) && (
                <div className="space-y-5">
                  <h4 className="text-xs font-mono font-bold uppercase text-stone-400 tracking-wider">
                    Suggested Commercially Available Blends:
                  </h4>
                  
                  {matchingProducts.length === 0 ? (
                    <div className="p-6 rounded-2xl border-2 border-dashed border-stone-200 text-center bg-stone-50/50">
                      <HelpCircle className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                      <span className="font-bold text-stone-600 text-xs block">Evaluating Options</span>
                      <p className="text-[11px] text-stone-500 mt-1">Our team is currently evaluating commercial mixes for this profile. No products have been added to the provisional catalog yet.</p>
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
                            className="border border-stone-200 bg-stone-50/30 rounded-xl p-4 sm:p-5 space-y-4 transition-all"
                            id={`catalog-product-${prod.id}`}
                          >
                            <div className="flex flex-col sm:flex-row gap-4 items-start">
                              {/* Product Thumbnail */}
                              <div className="w-16 h-16 rounded-lg bg-stone-100 overflow-hidden border border-stone-200 shrink-0 relative">
                                <img 
                                  src={prod.imageUrl} 
                                  alt={prod.name} 
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="text-[8px] font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 uppercase">
                                    {prod.brand}
                                  </span>
                                  <span className="text-[8px] font-mono font-bold text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200 capitalize">
                                    Status: {prod.evidenceStatus.replace('_', ' ')}
                                  </span>
                                </div>
                                <h5 className="font-bold text-stone-900 text-sm mt-1 leading-snug">
                                  {prod.name}
                                </h5>
                                <p className="text-stone-500 text-[11px] leading-relaxed mt-1">
                                  {prod.bestUse}
                                </p>
                              </div>
                            </div>

                            {/* Specifications Grid */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 bg-white border border-stone-150 p-3 rounded-lg text-xs leading-relaxed">
                              <div>
                                <span className="text-stone-400 font-semibold text-[9px] uppercase tracking-wider block">Ingredients</span>
                                <span className="text-stone-700 font-medium">{prod.verifiedIngredients || "Unlisted or proprietary"}</span>
                              </div>
                              <div>
                                <span className="text-stone-400 font-semibold text-[9px] uppercase tracking-wider block">Package Volume</span>
                                <span className="text-stone-700 font-medium">{prod.packageVolume}</span>
                              </div>
                              <div>
                                <span className="text-stone-400 font-semibold text-[9px] uppercase tracking-wider block">Drainage Rate</span>
                                <span className="text-stone-750 font-medium">{prod.drainageType}</span>
                              </div>
                              <div>
                                <span className="text-stone-400 font-semibold text-[9px] uppercase tracking-wider block">Verified Status</span>
                                <span className="text-stone-750 font-medium">Checked: {prod.lastVerifiedDate}</span>
                              </div>
                            </div>

                            {/* Gritty advisory warnings */}
                            {prod.grittyAdvisory && (
                              <div className="bg-amber-50/40 border border-amber-200/80 p-3 rounded-lg text-[10px] text-stone-650 flex gap-2">
                                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                  <strong>Gritty Soil Care:</strong> {prod.grittyAdvisory}
                                </div>
                              </div>
                            )}

                            {/* Strengths & Limitations */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-normal">
                              <div>
                                <span className="font-semibold text-emerald-800 text-[10px] uppercase tracking-wider block mb-1">Strengths:</span>
                                <ul className="list-disc pl-4 space-y-0.5 text-stone-600 text-[11px]">
                                  {prod.strengths.map((str, idx) => <li key={idx}>{str}</li>)}
                                </ul>
                              </div>
                              <div>
                                <span className="font-semibold text-stone-500 text-[10px] uppercase tracking-wider block mb-1">Cautions:</span>
                                <ul className="list-disc pl-4 space-y-0.5 text-stone-600 text-[11px]">
                                  {prod.limitations.map((lim, idx) => <li key={idx}>{lim}</li>)}
                                </ul>
                              </div>
                            </div>

                            {/* Buy Affiliate CTA */}
                            <div className="pt-3 border-t border-stone-150 flex items-center justify-between text-xs">
                              <span className="font-mono text-stone-450">Price Tier: <strong className="text-stone-700">{prod.priceTier}</strong></span>
                              <a
                                href={prod.affiliateUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackEvent('affiliate_link_clicked', { productId: prod.id, productName: prod.name })}
                                className="bg-emerald-800 hover:bg-emerald-950 text-white font-bold px-4 py-2 rounded-lg text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs"
                                id={`diagnostic-shop-btn-${prod.id}`}
                              >
                                <span>Check Price on Amazon</span>
                                <ExternalLink className="w-3 h-3" />
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
                <div className="space-y-4 pt-4 border-t border-stone-100">
                  <h4 className="text-xs font-mono font-bold uppercase text-stone-400 tracking-wider">
                    Potting &amp; Watering Guidelines:
                  </h4>
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs leading-relaxed text-stone-750 space-y-2">
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
                      className="bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 font-bold px-4 py-2 rounded-lg text-xs transition-colors flex items-center gap-1"
                      id="view-comparison-page"
                    >
                      <Award className="w-3.5 h-3.5 text-stone-400" />
                      <span>Compare Pre-made Soils</span>
                    </a>
                    <a
                      href="/diy-snake-plant-soil-mix"
                      onClick={() => trackEvent('diy_mix_guide_clicked')}
                      className="bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 font-bold px-4 py-2 rounded-lg text-xs transition-colors flex items-center gap-1"
                      id="view-diy-guide"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-stone-400" />
                      <span>Prefer Mixing Your Own? DIY Guide</span>
                    </a>
                  </div>
                </div>
              )}

            </div>

            {/* Right Result Columns (Waitlist Form) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* User Condition Summary */}
              <div className="border border-stone-200 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase text-stone-400 tracking-wider">
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

                <div className="pt-3 border-t border-stone-150 text-[11px] leading-relaxed text-stone-500">
                  <span className="font-bold text-stone-850 block mb-0.5">Most likely soil concern:</span>
                  {activeProfile.id === 'recovery' && "Immediate risk of fungal infection and tissue breakdown due to oxygen starvation."}
                  {activeProfile.id === 'fast-drain' && "Slow evaporation rate causing water pooling; needs higher mineral grit."}
                  {activeProfile.id === 'dry-home' && "Rapid soil dry-down; needs baseline organic content to absorb trace moisture."}
                  {activeProfile.id === 'everyday-balance' && "Standard soil dry-down rate. Requires routine repotting checks."}
                  {activeProfile.id === 'propagation' && "Fragile cutting root network requiring light, loose substrate."}
                </div>

                <div className="pt-2 text-[10px] leading-normal text-stone-400">
                  <span className="font-bold text-stone-600 block mb-0.5">Other possibilities:</span>
                  Seasonal light changes or minor insect pests may also affect leaf appearance. We recommend inspecting leaf tips for dryness and checking base thickness.
                </div>

                <div className="pt-2 text-[10px] leading-normal text-stone-450 border-t border-dashed border-stone-150">
                  <span className="font-bold text-stone-600 block">Undetermined factors:</span>
                  We cannot definitively evaluate internal root damage or soil pathogens without physically unpotting and rinsing the roots.
                </div>
              </div>

              {/* Waitlist Form Block */}
              <div className="bg-emerald-950/5 border border-emerald-900/10 rounded-2xl p-5 space-y-4">
                <div className="border-b border-emerald-900/10 pb-2">
                  <h4 className="text-xs font-mono font-bold uppercase text-emerald-800 tracking-wider">
                    Future Product Waitlist:
                  </h4>
                  <h5 className="font-bold text-stone-900 text-sm mt-1">
                    Custom Soil Blends Development
                  </h5>
                  <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                    Snake Plant Soil Lab is researching a future soil line designed specifically around different watering habits and house settings. Tell us what you would prefer!
                  </p>
                </div>

                <div className="space-y-3.5 text-xs">
                  {/* Option 1: Bag Size */}
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">Preferred Bag Size:</label>
                    <div className="grid grid-cols-3 gap-1.5 font-sans">
                      {[
                        { id: 'small', label: 'Small (2 Qts)' },
                        { id: 'medium', label: 'Medium (4 Qts)' },
                        { id: 'large', label: 'Large (8 Qts)' }
                      ].map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            trackEvent('future_product_interest_started');
                            setPreferredBagSize(item.id as any);
                          }}
                          className={`py-1.5 px-2 rounded-lg border text-[10px] text-center font-semibold transition-all ${
                            preferredBagSize === item.id 
                              ? 'border-emerald-850 bg-emerald-50/30 text-stone-900 font-bold'
                              : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-600'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Option 2: Style */}
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">Product Format Preference:</label>
                    <div className="grid grid-cols-2 gap-1.5 font-sans">
                      {[
                        { id: 'premixed', label: 'Ready-to-use Premixed Soil' },
                        { id: 'booster', label: 'Soil-Amendment Booster' }
                      ].map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            trackEvent('future_product_interest_started');
                            setProductStyle(item.id as any);
                          }}
                          className={`py-1.5 px-2 rounded-lg border text-[10px] text-center font-semibold transition-all ${
                            productStyle === item.id 
                              ? 'border-emerald-850 bg-emerald-50/30 text-stone-900 font-bold'
                              : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-600'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Option 3: Price */}
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">Expected Price Preference:</label>
                    <select
                      value={pricePreference}
                      onChange={(e) => {
                        trackEvent('future_product_interest_started');
                        setPricePreference(e.target.value);
                      }}
                      className="w-full p-2 border border-stone-200 rounded-lg bg-white cursor-pointer text-stone-750 font-semibold"
                    >
                      <option value="Under $10">Under $10</option>
                      <option value="$10 - $15">$10 - $15</option>
                      <option value="$15 - $20">$15 - $20</option>
                      <option value="Over $20">Over $20</option>
                    </select>
                  </div>

                  {/* Honest Email Availability notice */}
                  <div className="pt-3 border-t border-emerald-900/10 space-y-2">
                    <span className="font-semibold text-stone-500 uppercase tracking-widest text-[9px] block">Early Access Signup</span>
                    <div className="bg-amber-50/40 border border-amber-200/80 p-3 rounded-lg text-[10px] text-stone-600 leading-normal">
                      <strong>Early-access signup is coming soon.</strong> Waitlist email registry is currently disabled as no backend database or newsletter API is connected.
                    </div>
                  </div>

                  {/* Submit Button (Disabled) */}
                  <button
                    disabled={true}
                    className="w-full bg-stone-250 border border-stone-300 text-stone-400 py-3 rounded-lg text-xs font-bold font-sans cursor-not-allowed text-center uppercase tracking-wider"
                  >
                    Early Access Coming Soon
                  </button>
                </div>
              </div>

              {/* Secure affiliate disclosure banner */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-[10px] leading-relaxed text-stone-500">
                <strong>Affiliate Transparency:</strong> SnakePlantSoil.com is reader-supported. Some recommended product check buttons contain Amazon affiliate links that earn commissions at exactly zero additional cost to you.
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={handleStart}
                  className="text-xs font-bold text-stone-550 hover:text-stone-900 flex items-center gap-1.5 mx-auto focus:outline-none"
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
  );
}
