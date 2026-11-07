import React, { useState } from 'react';
import { 
  ArrowLeft, Calendar, Clock, Radio, Headphones, ExternalLink, 
  Share2, Check, Copy, BookOpen, Volume2, Beaker, HeartPulse, Trees,
  Sparkles, FileText, ChevronDown, ChevronUp
} from 'lucide-react';
import { Episode, getEpisodes, hasValidSpotify } from '../episodes';

interface EpisodeDetailProps {
  episode: Episode;
  onNavigate: (tab: string) => void;
}

// Helper to parse inline markdown styles like links ([text](url)), bold (**text**), italics (*text*), and code (`code`)
function parseInlineStyles(text: string, onNavigate?: (tab: string) => void): React.ReactNode {
  const regex = /(\[.*?\]\(.*?\)|\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  const parts = text.split(regex);
  
  return parts.map((part, idx) => {
    if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
      const match = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (match) {
        const linkText = match[1];
        const linkUrl = match[2];
        const isExternal = /^https?:\/\//i.test(linkUrl);
        
        if (isExternal) {
          return (
            <a 
              key={idx} 
              href={linkUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#235837] font-bold underline hover:text-[#142B1E] transition-colors"
            >
              {parseInlineStyles(linkText, onNavigate)}
            </a>
          );
        } else {
          const cleanSlug = linkUrl.replace(/^\//, '');
          return (
            <a
              key={idx}
              href={linkUrl}
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate(cleanSlug);
                }
              }}
              className="text-[#235837] font-bold underline hover:text-[#142B1E] transition-colors cursor-pointer"
            >
              {parseInlineStyles(linkText, onNavigate)}
            </a>
          );
        }
      }
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return <strong key={idx} className="font-bold text-[#142B1E]">{parseInlineStyles(part.slice(2, -2), onNavigate)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return <em key={idx} className="italic text-[#2B3B30]">{parseInlineStyles(part.slice(1, -1), onNavigate)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return <code key={idx} className="font-mono bg-[#F3EFE6] px-1.5 py-0.5 rounded text-[#142B1E] text-[11px] font-semibold border border-[#E8E2D5]">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

// Markdown formatter helper
function renderEpisodeMarkdown(content: string, onNavigate: (tab: string) => void) {
  const lines = content.split(/\r?\n/);
  const elements: React.ReactNode[] = [];
  let inList = false;
  let listItems: React.ReactNode[] = [];

  const flushList = (key: string) => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={key} className="space-y-2.5 my-4 list-disc list-inside text-[#4D5D53] text-sm sm:text-base leading-relaxed">
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Horizontal rule
    if (trimmed === '---') {
      flushList(`list-${index}`);
      elements.push(<hr key={index} className="my-8 border-[#E8E2D5]" />);
      return;
    }

    // Skip the first H1 if present since we render it prominently in the header
    if (trimmed.startsWith('# ') && index < 5) {
      return;
    }

    // H1 Headings later in body
    if (trimmed.startsWith('# ')) {
      flushList(`list-${index}`);
      elements.push(
        <h1 key={index} className="text-2xl sm:text-3xl font-serif font-bold text-[#142B1E] mt-8 mb-4 tracking-tight">
          {parseInlineStyles(trimmed.replace(/^#\s*/, ''), onNavigate)}
        </h1>
      );
      return;
    }

    // H2 Headings
    if (trimmed.startsWith('## ')) {
      flushList(`list-${index}`);
      elements.push(
        <h2 key={index} className="text-xl sm:text-2xl font-serif font-bold text-[#142B1E] mt-8 mb-4 tracking-tight">
          {parseInlineStyles(trimmed.replace(/^##\s*/, ''), onNavigate)}
        </h2>
      );
      return;
    }

    // H3 Headings
    if (trimmed.startsWith('### ')) {
      flushList(`list-${index}`);
      elements.push(
        <h3 key={index} className="text-lg font-serif font-bold text-[#142B1E] mt-6 mb-3">
          {parseInlineStyles(trimmed.replace(/^###\s*/, ''), onNavigate)}
        </h3>
      );
      return;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      flushList(`list-${index}`);
      const quoteText = trimmed.replace(/^>\s*/, '').replace(/^"|"$/g, '');
      elements.push(
        <blockquote key={index} className="my-6 p-4 border-l-4 border-[#235837] bg-[#E2EFE5]/40 rounded-r-xl italic text-[#2B3B30] text-sm sm:text-base leading-relaxed">
          {parseInlineStyles(quoteText, onNavigate)}
        </blockquote>
      );
      return;
    }

    // List item (unordered)
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      inList = true;
      const rawText = trimmed.replace(/^[-*]\s*/, '');
      listItems.push(
        <li key={index} className="text-[#4D5D53] text-sm sm:text-base leading-relaxed">
          {parseInlineStyles(rawText, onNavigate)}
        </li>
      );
      return;
    }

    // Empty lines
    if (!trimmed) {
      flushList(`list-${index}`);
      return;
    }

    // Regular paragraph
    flushList(`list-${index}`);
    elements.push(
      <p key={index} className="my-3 text-[#4D5D53] text-sm sm:text-base leading-relaxed font-sans">
        {parseInlineStyles(trimmed, onNavigate)}
      </p>
    );
  });

  flushList('list-end');
  return elements;
}

export default function EpisodeDetail({ episode, onNavigate }: EpisodeDetailProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [transcriptOpen, setTranscriptOpen] = useState(true);

  const allEpisodes = getEpisodes();
  const currentIndex = allEpisodes.findIndex(e => e.slug === episode.slug);
  const nextEpisode = currentIndex > 0 ? allEpisodes[currentIndex - 1] : null;
  const prevEpisode = currentIndex < allEpisodes.length - 1 ? allEpisodes[currentIndex + 1] : null;

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const hasTranscript = /##\s+.*transcript/i.test(episode.content || '');

  return (
    <article className="bg-[#FAF7F2] min-h-screen py-10 md:py-16 font-sans" id={`episode-page-${episode.slug}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Back Link & Breadcrumb Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8E2D5] pb-4">
          <button 
            onClick={() => onNavigate('radio')}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#235837] hover:text-[#142B1E] transition-colors cursor-pointer"
            id="back-to-radio"
          >
            <ArrowLeft className="w-4 h-4 text-[#235837]" />
            <span>Back to All Episodes</span>
          </button>

          <nav aria-label="Breadcrumb" className="text-xs text-[#5C6E60] font-sans flex items-center gap-2">
            <a href="/" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} className="hover:text-[#142B1E] transition-colors">Home</a>
            <span>/</span>
            <a href="/radio" onClick={(e) => { e.preventDefault(); onNavigate('radio'); }} className="hover:text-[#142B1E] transition-colors">Radio</a>
            <span>/</span>
            <span className="text-[#142B1E] font-medium">Ep. {episode.episodeNumber}</span>
          </nav>
        </div>

        {/* Episode Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-[#235837] text-white">
              Episode #{episode.episodeNumber}
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#F3EFE6] text-[#4A5D4E] border border-[#E8E2D5]">
              {episode.category}
            </span>
            <span className="text-xs text-[#6B7C70] font-mono flex items-center gap-1.5 ml-1">
              <Clock className="w-3.5 h-3.5" /> {episode.duration}
            </span>
            <span className="text-xs text-[#6B7C70] font-mono flex items-center gap-1.5 ml-1">
              <Calendar className="w-3.5 h-3.5" /> Published {episode.date}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#142B1E] tracking-tight leading-[1.15]" id="episode-h1">
            {episode.title}
          </h1>

          <p className="text-[#4D5D53] text-base sm:text-lg leading-relaxed font-sans pt-1">
            {episode.description}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E8E2D5] bg-white text-[#2B3B30] text-xs font-semibold hover:bg-[#F7F4EE] transition-all cursor-pointer shadow-2xs"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-[#235837]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Share Episode'}</span>
            </button>

            {hasValidSpotify(episode) ? (
              <a
                href={episode.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1DB954] text-stone-950 text-xs font-bold hover:bg-[#1ed760] transition-all shadow-2xs"
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>Listen on Spotify</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F3EFE6] text-[#4A5D4E] text-xs font-mono font-medium border border-[#E8E2D5]">
                <Headphones className="w-3.5 h-3.5 text-[#6B7C70]" />
                <span>Audio Feed Connecting</span>
              </span>
            )}
          </div>
        </header>

        {/* Embedded Spotify Audio Player */}
        <section className="bg-white rounded-2xl border border-[#E8E2D5] p-6 sm:p-8 shadow-xs space-y-4" id="spotify-player-section">
          <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
            <span className="text-xs font-mono font-bold text-[#142B1E] uppercase tracking-wider flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#235837]" />
              Stream Episode Audio
            </span>
            <span className="text-[11px] font-mono text-[#235837] bg-[#E2EFE5] px-2 py-0.5 rounded border border-[#C2DEC9]">
              {hasValidSpotify(episode) ? 'Spotify Player Active' : episode.audioUrl ? 'Audio Feed Active' : 'Recording Feed Pending'}
            </span>
          </div>

          {hasValidSpotify(episode) ? (
            <div className="w-full rounded-xl overflow-hidden shadow-xs border border-[#E8E2D5] bg-stone-900">
              <iframe 
                style={{ borderRadius: '12px' }}
                src={episode.spotifyEmbedUrl} 
                width="100%" 
                height="152" 
                frameBorder="0" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
                title={episode.title}
                id="spotify-episode-iframe"
              />
            </div>
          ) : episode.audioUrl ? (
            <div className="bg-[#FAF7F2] rounded-xl border border-[#E8E2D5] p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#5C6E60]">
                <span className="font-bold flex items-center gap-1.5 text-[#235837]">
                  <Headphones className="w-4 h-4" /> Direct Podcast Audio Feed
                </span>
                <span>MP3 Audio Stream</span>
              </div>
              <audio controls className="w-full" src={episode.audioUrl} preload="none">
                Your browser does not support the audio element.
              </audio>
            </div>
          ) : (
            <div className="bg-[#FAF7F2] rounded-xl border border-dashed border-[#D5CDBD] p-6 sm:p-8 text-center space-y-2">
              <Radio className="w-7 h-7 text-[#235837] mx-auto" />
              <div className="text-sm font-bold text-[#142B1E]">Live Recording Connecting Soon</div>
              <p className="text-xs text-[#5C6E60] max-w-md mx-auto leading-relaxed">
                The official Spotify audio embed for this episode will activate once the audio recording is finalized. Follow the show notes, botanical formulas, and companion reading guides below.
              </p>
            </div>
          )}
        </section>

        {/* Companion Written Guides Card */}
        {episode.relatedGuides && episode.relatedGuides.length > 0 && (
          <section className="bg-[#E2EFE5]/40 border border-[#C2DEC9] rounded-2xl p-6 sm:p-8 space-y-4" id="episode-related-guides">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#235837] uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-[#235837]" />
              <span>Recommended Companion Reading</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#142B1E]">
              Master Guides Referencing This Topic
            </h3>
            <p className="text-[#4D5D53] text-xs sm:text-sm">
              Explore step-by-step written tutorials, material ratios, and surgical instructions corresponding to this episode's discussion:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button
                onClick={() => onNavigate('root-rot')}
                className="p-4 bg-white rounded-xl border border-[#E8E2D5] text-left hover:border-[#235837] transition-all cursor-pointer shadow-2xs"
              >
                <HeartPulse className="w-4 h-4 text-[#235837] mb-2" />
                <div className="text-xs font-bold text-[#142B1E]">Root Rot Triage</div>
                <div className="text-[11px] text-[#5C6E60] mt-0.5">Surgical recovery protocol</div>
              </button>

              <button
                onClick={() => onNavigate('diy-mix')}
                className="p-4 bg-white rounded-xl border border-[#E8E2D5] text-left hover:border-[#235837] transition-all cursor-pointer shadow-2xs"
              >
                <Beaker className="w-4 h-4 text-[#235837] mb-2" />
                <div className="text-xs font-bold text-[#142B1E]">The 3-2-1 Mix Recipe</div>
                <div className="text-[11px] text-[#5C6E60] mt-0.5">Formula & batch calculator</div>
              </button>

              <button
                onClick={() => onNavigate('best-soil')}
                className="p-4 bg-white rounded-xl border border-[#E8E2D5] text-left hover:border-[#235837] transition-all cursor-pointer shadow-2xs"
              >
                <Trees className="w-4 h-4 text-[#235837] mb-2" />
                <div className="text-xs font-bold text-[#142B1E]">Compare Ready-Made Soils</div>
                <div className="text-[11px] text-[#5C6E60] mt-0.5">Retail mixes ranked with pros/cons</div>
              </button>
            </div>
          </section>
        )}

        {/* Show Notes & Transcript Body */}
        <section className="bg-white rounded-2xl border border-[#E8E2D5] p-6 sm:p-10 shadow-xs space-y-6" id="show-notes-content">
          <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-4">
            <h2 className="text-xl font-serif font-bold text-[#142B1E] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#235837]" />
              <span>{hasTranscript ? 'Show Notes & Full Transcript' : 'Episode Notes & Key Takeaways'}</span>
            </h2>
            <button
              onClick={() => setTranscriptOpen(!transcriptOpen)}
              className="text-xs font-mono font-bold text-[#5C6E60] hover:text-[#142B1E] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>{transcriptOpen ? 'Collapse' : 'Expand'}</span>
              {transcriptOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {transcriptOpen && (
            <div className="prose prose-stone max-w-none text-[#4D5D53]">
              {episode.content && episode.content.trim() ? (
                renderEpisodeMarkdown(episode.content, onNavigate)
              ) : (
                <div className="bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl p-6 text-[#5C6E60] text-sm italic">
                  Show notes, botanical formulas, and companion reading for this broadcast are being finalized and will appear here shortly.
                </div>
              )}
            </div>
          )}
        </section>

        {/* Episode Pagination */}
        <nav className="flex items-center justify-between pt-6 border-t border-[#E8E2D5]" aria-label="Episode Navigation">
          {prevEpisode ? (
            <button
              onClick={() => onNavigate(`radio/${prevEpisode.slug}`)}
              className="p-3 bg-white rounded-xl border border-[#E8E2D5] text-left hover:border-[#235837] transition-all cursor-pointer shadow-2xs"
            >
              <div className="text-[10px] font-mono text-[#6B7C70] uppercase">Previous Episode</div>
              <div className="text-xs font-bold text-[#142B1E]">Ep. {prevEpisode.episodeNumber}: {prevEpisode.title}</div>
            </button>
          ) : <div />}

          {nextEpisode ? (
            <button
              onClick={() => onNavigate(`radio/${nextEpisode.slug}`)}
              className="p-3 bg-white rounded-xl border border-[#E8E2D5] text-right hover:border-[#235837] transition-all cursor-pointer shadow-2xs"
            >
              <div className="text-[10px] font-mono text-[#6B7C70] uppercase">Next Episode</div>
              <div className="text-xs font-bold text-[#142B1E]">Ep. {nextEpisode.episodeNumber}: {nextEpisode.title}</div>
            </button>
          ) : <div />}
        </nav>

      </div>
    </article>
  );
}
