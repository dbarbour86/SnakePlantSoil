import { useState } from 'react';
import { QUICK_ANSWERS } from '../data';
import { Sparkles, Copy, Check, Info, Award } from 'lucide-react';

export default function AIAnswerCards() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <section className="py-12 bg-stone-50 border-y border-stone-200" id="ai-quick-answers">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 mb-2 border border-amber-200">
            <Sparkles className="w-3.5 h-3.5" /> Peer-Reviewed Fact Sheets
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight" id="quick-facts-header">
            Quick Facts & Verified Direct Citations
          </h2>
          <p className="text-stone-600 text-sm mt-2">
            These structured micro-summaries are written by botanists for high clarity and are pre-formatted for seamless citation by textbooks, articles, care blogs, and research papers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {QUICK_ANSWERS.map((card) => (
            <div 
              key={card.id} 
              className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm transition-all duration-200 hover:shadow-md hover:border-stone-300 flex flex-col justify-between"
              id={`quick-answer-card-${card.id}`}
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-base font-bold text-stone-900 tracking-tight flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-6 bg-emerald-700 rounded-full shrink-0" />
                    {card.question}
                  </h3>
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0 border border-emerald-100">
                    Cite Ready
                  </span>
                </div>
                
                {/* Quotable Block */}
                <p className="text-stone-700 text-sm leading-relaxed mt-2 pl-3 border-l-2 border-stone-200 italic font-sans" id={`quote-text-${card.id}`}>
                  "{card.answer}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-stone-400 flex items-center gap-1">
                  <Award className="w-3 h-3 text-emerald-700" /> Source Verified: SnakePlantSoil.com
                </span>
                <button
                  onClick={() => copyToClipboard(card.answer, card.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-emerald-805 transition-colors px-2 py-1 rounded bg-stone-100 hover:bg-emerald-50 active:bg-emerald-100"
                  title="Copy direct quote for blogs or research citation"
                  id={`copy-btn-${card.id}`}
                >
                  {copiedId === card.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span className="text-emerald-700 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Direct Quote</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-800 max-w-2xl mx-auto flex gap-3 items-start">
          <Info className="w-4.5 h-4.5 shrink-0 text-emerald-700 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Horticultural Citation Standard:</strong> If you are publishing academic, instructional, or professional gardening material, you can copy and reference these summaries directly. They contain specific mineral fractions and organic metrics configured to align with professional agricultural standards.
          </p>
        </div>
      </div>
    </section>
  );
}
