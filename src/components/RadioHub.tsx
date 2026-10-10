import React from 'react';
import { 
  Radio, Play, Clock, Calendar, Sparkles, ExternalLink, 
  ArrowRight, Compass, ShieldCheck, HeartPulse, Beaker, Trees,
  Headphones, Volume2
} from 'lucide-react';
import { Episode, getEpisodes, hasValidSpotify } from '../episodes';

interface RadioHubProps {
  onNavigate: (tab: string) => void;
}

export default function RadioHub({ onNavigate }: RadioHubProps) {
  const episodes = getEpisodes();
  const featuredEpisode = episodes[0]; // Latest/Featured episode

  return (
    <div className="bg-stone-50 min-h-screen py-10 md:py-16" id="radio-hub-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Hub Header */}
        <header className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-200 max-w-full">
            <Radio className="w-3.5 h-3.5 text-emerald-700 animate-pulse shrink-0" />
            <span className="text-[11px] sm:text-xs">The Official Snake Plant Soil Lab Podcast</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-stone-900 tracking-tight leading-[1.15]" id="radio-hub-h1">
            Snake Plant Radio
          </h1>
          
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-sans">
            Zero plant-care fluff. Weekly botanical deep dives into soil physics, root oxygenation, 
            container transpiration, and genuine Sansevieria survival science.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
            <a 
              href="https://open.spotify.com/show/6XOicuhWNSvmswXniqX4Yu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1DB954] text-stone-950 font-bold text-xs hover:bg-[#1ed760] transition-all shadow-xs"
              id="spotify-follow-button"
            >
              <Headphones className="w-4 h-4" />
              <span>Follow on Spotify</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
            <span className="text-xs text-stone-450 font-mono flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> New episodes every Thursday
            </span>
          </div>
        </header>

        {/* Featured Episode Hero Card */}
        {featuredEpisode && (
          <section className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden" id="featured-episode-banner">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Left Column: Episode Info & Meta */}
              <div className="p-6 sm:p-8 lg:col-span-7 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-800 text-white">
                      Episode #{featuredEpisode.episodeNumber}
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-stone-100 text-stone-750 border border-stone-200">
                      {featuredEpisode.category}
                    </span>
                    <span className="text-xs text-stone-450 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" /> {featuredEpisode.duration}
                    </span>
                    <span className="text-xs text-stone-450 flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" /> {featuredEpisode.date}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 tracking-tight leading-snug">
                    <a 
                      href={`/radio/${featuredEpisode.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(`radio/${featuredEpisode.slug}`);
                      }}
                      className="hover:text-emerald-850 transition-colors cursor-pointer"
                    >
                      {featuredEpisode.title}
                    </a>
                  </h2>

                  <p className="text-stone-600 text-sm leading-relaxed">
                    {featuredEpisode.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4">
                  <button 
                    onClick={() => onNavigate(`radio/${featuredEpisode.slug}`)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-800 text-white hover:bg-emerald-950 font-bold text-xs transition-all shadow-xs cursor-pointer"
                    id={`view-notes-${featuredEpisode.slug}`}
                  >
                    <span>View Show Notes & Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="text-[11px] text-stone-400 font-mono">
                    Includes key formulas & companion guide links
                  </div>
                </div>
              </div>

              {/* Right Column: Embedded Spotify Audio Player */}
              <div className="bg-stone-50 p-6 sm:p-8 lg:col-span-5 border-t lg:border-t-0 lg:border-l border-stone-200 flex flex-col justify-center space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-emerald-700" /> Embedded Audio Player
                  </span>
                  <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {hasValidSpotify(featuredEpisode) ? 'Spotify Official' : 'Audio Feed Pending'}
                  </span>
                </div>

                {hasValidSpotify(featuredEpisode) ? (
                  <div className="w-full rounded-xl overflow-hidden shadow-xs border border-stone-250 bg-stone-900">
                    <iframe 
                      style={{ borderRadius: '12px' }}
                      src={featuredEpisode.spotifyEmbedUrl} 
                      width="100%" 
                      height="152" 
                      frameBorder="0" 
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                      loading="lazy"
                      title={featuredEpisode.title}
                    />
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-stone-200 p-6 text-center space-y-2">
                    <Radio className="w-8 h-8 text-emerald-700 mx-auto" />
                    <p className="text-xs font-bold text-stone-800">Broadcast Audio Connecting Soon</p>
                    <p className="text-[11px] text-stone-500">Read the complete episode notes and companion guides below.</p>
                  </div>
                )}

                <p className="text-[11px] text-stone-500 text-center font-sans">
                  Listen right here or open in your favorite podcast client.
                </p>
              </div>

            </div>
          </section>
        )}

        {/* All Episodes Directory */}
        <section className="space-y-6" id="episodes-directory">
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <div>
              <h3 className="text-xl font-display font-bold text-stone-900">
                All Episodes
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Archived broadcasts, transcripts, and companion botanical formulas.
              </p>
            </div>
            <span className="text-xs font-mono text-stone-450 font-bold">
              {episodes.length} {episodes.length === 1 ? 'Episode' : 'Episodes'} Published
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {episodes.map((ep) => (
              <article 
                key={ep.id}
                className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs hover:shadow-sm hover:border-stone-300 transition-all flex flex-col justify-between space-y-4"
                id={`episode-card-${ep.slug}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-100">
                        Ep. {ep.episodeNumber}
                      </span>
                      <span className="text-[11px] font-mono text-stone-400">
                        {ep.date}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-stone-550 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {ep.duration}
                    </span>
                  </div>

                  <h4 className="text-lg font-display font-bold text-stone-900 leading-snug">
                    <a 
                      href={`/radio/${ep.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(`radio/${ep.slug}`);
                      }}
                      className="hover:text-emerald-800 transition-colors cursor-pointer"
                    >
                      {ep.title}
                    </a>
                  </h4>

                  <p className="text-stone-600 text-xs leading-relaxed line-clamp-3">
                    {ep.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider">
                    {ep.category}
                  </span>
                  <a 
                    href={`/radio/${ep.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(`radio/${ep.slug}`);
                    }}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Listen & Transcript</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Cross-Link: Companion Botanical Guides */}
        <section className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-6 sm:p-8 space-y-4" id="radio-guides-crosslink">
          <div className="max-w-2xl">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-800 bg-white px-2.5 py-1 rounded border border-emerald-150">
              Laboratory Reading Companion
            </span>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-stone-900 mt-2">
              Follow Along With Our Master Written Guides
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm mt-1">
              Every Snake Plant Radio episode references specific ratios, diagnostic steps, and materials tests. 
              Review the complete written manuals:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button
              onClick={() => onNavigate('diy-mix')}
              className="p-4 bg-white rounded-xl border border-emerald-200/60 text-left hover:border-emerald-600 transition-all cursor-pointer shadow-2xs"
            >
              <Beaker className="w-4 h-4 text-emerald-700 mb-2" />
              <div className="text-xs font-bold text-stone-900">The 3-2-1 DIY Mix</div>
              <div className="text-[11px] text-stone-500 mt-0.5">Signature recipe & batch calculator</div>
            </button>

            <button
              onClick={() => onNavigate('root-rot')}
              className="p-4 bg-white rounded-xl border border-emerald-200/60 text-left hover:border-emerald-600 transition-all cursor-pointer shadow-2xs"
            >
              <HeartPulse className="w-4 h-4 text-emerald-700 mb-2" />
              <div className="text-xs font-bold text-stone-900">Root Rot Triage</div>
              <div className="text-[11px] text-stone-500 mt-0.5">Surgical sterilization protocol</div>
            </button>

            <button
              onClick={() => onNavigate('best-soil')}
              className="p-4 bg-white rounded-xl border border-emerald-200/60 text-left hover:border-emerald-600 transition-all cursor-pointer shadow-2xs"
            >
              <Trees className="w-4 h-4 text-emerald-700 mb-2" />
              <div className="text-xs font-bold text-stone-900">Commercial Soils Test</div>
              <div className="text-[11px] text-stone-500 mt-0.5">Tested retail mixes ranked</div>
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
