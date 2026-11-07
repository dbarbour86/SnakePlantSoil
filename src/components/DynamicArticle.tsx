import React from 'react';
import { 
  Compass, Calendar, Clock, ChevronRight, HelpCircle, 
  Trees, Beaker, HeartPulse, Layers, ArrowLeft
} from 'lucide-react';
import { DynamicArticle } from '../content';
import { TopicalClusterNav } from './GuideArticles';
import BotanicalSubpageLayout from './BotanicalSubpageLayout';

interface DynamicArticleViewProps {
  article: DynamicArticle;
  onNavigate: (tab: string) => void;
}

// Simple helper to parse inline styles like links ([text](url)), bold (**text**), italics (*text* or _text_), and inline code (`code`)
function parseInlineStyles(text: string, onNavigate?: (tab: string) => void): React.ReactNode {
  // Matches [label](url), **bold**, *italics*, `code`
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
              className="text-[#235837] font-bold underline hover:text-[#142B1E]"
            >
              {parseInlineStyles(linkText, onNavigate)}
            </a>
          );
        } else {
          const slug = linkUrl.replace(/^\//, '');
          const tabMap: Record<string, string> = {
            'snake-plant-care-guide': 'care-guide',
            'best-snake-plant-soil': 'best-soil',
            'diy-snake-plant-soil-mix': 'diy-mix',
            'snake-plant-root-rot-guide': 'root-rot',
            'best-pots-for-snake-plants': 'best-pots',
            'soil-diagnosis': 'setup-kits',
            'winter-watering-guide': 'winter-guide',
            'best-fertilizer-for-snake-plant-soil': 'best-fertilizer'
          };
          const targetTab = tabMap[slug] || slug;

          return (
            <a
              key={idx}
              href={linkUrl}
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate(targetTab);
                }
              }}
              className="text-[#235837] font-bold underline hover:text-[#142B1E] cursor-pointer"
            >
              {parseInlineStyles(linkText, onNavigate)}
            </a>
          );
        }
      }
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx} className="font-bold text-stone-900">{parseInlineStyles(part.slice(2, -2), onNavigate)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={idx} className="italic text-stone-800">{parseInlineStyles(part.slice(1, -1), onNavigate)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={idx} className="font-mono bg-stone-100 px-1.5 py-0.5 rounded text-stone-800 text-[11px] font-semibold">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

// Zero-dependency block parser for Markdown
function MarkdownRenderer({ content, onNavigate }: { content: string; onNavigate?: (tab: string) => void }) {
  // Split by double newlines for block separation
  const blocks = content.split(/\r?\n\r?\n/);
  
  return (
    <div className="space-y-6">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;
        
        // Horizontal Rules
        if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
          return <hr key={idx} className="border-t border-[#E8E2D5] my-6" />;
        }

        // Headers
        if (trimmed.startsWith('# ')) {
          // Skip H1 if it repeats the article title rendered by BotanicalSubpageLayout
          return null;
        }
        if (trimmed.startsWith('## ')) {
          const headingText = trimmed.slice(3).trim();
          const headingId = headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          return (
            <h2 
              key={idx} 
              id={headingId} 
              className="font-serif font-bold text-[#142B1E] text-2xl tracking-tight mt-8 mb-3 scroll-mt-24"
            >
              {parseInlineStyles(headingText, onNavigate)}
            </h2>
          );
        }
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="font-serif font-bold text-[#142B1E] text-lg mt-5 mb-2">
              {parseInlineStyles(trimmed.slice(4), onNavigate)}
            </h3>
          );
        }
        
        // Blockquotes
        if (trimmed.startsWith('> ')) {
          const quoteLines = trimmed.split(/\r?\n/).map(line => line.replace(/^>\s?/, ''));
          return (
            <blockquote key={idx} className="border-l-4 border-[#235837] pl-4 py-2 italic text-stone-700 bg-[#E2EFE5]/40 rounded-r-xl my-4">
              {quoteLines.map((line, lIdx) => (
                <p key={lIdx} className="m-0 text-sm leading-relaxed">{parseInlineStyles(line, onNavigate)}</p>
              ))}
            </blockquote>
          );
        }
        
        // Lists (unordered)
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const items = trimmed.split(/\r?\n/).map(item => item.replace(/^[-*]\s+/, ''));
          return (
            <ul key={idx} className="list-disc pl-5 space-y-2 text-stone-700 my-4 font-sans text-sm sm:text-base">
              {items.map((item, itemIdx) => (
                <li key={itemIdx} className="leading-relaxed">{parseInlineStyles(item, onNavigate)}</li>
              ))}
            </ul>
          );
        }
        
        // Lists (ordered)
        if (/^\d+\.\s+/.test(trimmed)) {
          const items = trimmed.split(/\r?\n/).map(item => item.replace(/^\d+\.\s+/, ''));
          return (
            <ol key={idx} className="list-decimal pl-5 space-y-2 text-stone-700 my-4 font-sans text-sm sm:text-base">
              {items.map((item, itemIdx) => (
                <li key={itemIdx} className="leading-relaxed">{parseInlineStyles(item, onNavigate)}</li>
              ))}
            </ol>
          );
        }
        
        // Paragraph with linebreaks mapping
        const lines = trimmed.split(/\r?\n/);
        return (
          <p key={idx} className="text-stone-700 leading-relaxed text-sm sm:text-base mb-4 font-sans">
            {lines.map((line, lineIdx) => (
              <React.Fragment key={lineIdx}>
                {lineIdx > 0 && <br />}
                {parseInlineStyles(line, onNavigate)}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

export default function DynamicArticleView({ article, onNavigate }: DynamicArticleViewProps) {
  const breadcrumbs = [
    { label: 'Home', tabId: 'home' },
    { label: 'Care Guides', tabId: 'care-guide' },
    { label: article.title }
  ];

  // Extract H2 headings for Table of Contents
  const tocItems = article.content
    .split(/\r?\n/)
    .filter(line => line.startsWith('## '))
    .map(line => {
      const text = line.replace(/^##\s+/, '').trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return { id, label: text };
    });

  const relatedGuides = [
    {
      title: 'Choose the right soil',
      description: 'See what makes a great commercial succulent soil and compare top-ranked mixes.',
      tabId: 'best-soil',
      image: '/gritty-mix.jpg'
    },
    {
      title: 'Make your own mix',
      description: 'A simple, balanced DIY 3-2-1 soil mix that keeps roots healthy and aerated.',
      tabId: 'diy-mix',
      image: '/mix-bowl.jpg'
    }
  ];

  return (
    <BotanicalSubpageLayout
      categoryBadge={article.category.toUpperCase().replace('-', ' ')}
      title={article.title}
      introSummary={article.shortDescription}
      heroImage="/hero-botanical-room.jpg"
      heroImageAlt={article.title}
      breadcrumbs={breadcrumbs}
      calloutBanner={{
        title: "Science-backed indoor plant cultivation",
        description: article.shortDescription,
        icon: <Compass className="w-4 h-4 text-[#235837]" />
      }}
      tocItems={tocItems.length > 0 ? tocItems : [{ id: 'article-body', label: 'Article Overview' }]}
      relatedGuides={relatedGuides}
      onNavigate={onNavigate}
    >
      <div id="article-body" className="space-y-6">
        {/* Published Date & Reading Time */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 font-sans pb-3 border-b border-[#E8E2D5]">
          {article.date && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#235837]" />
              Published {article.date}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#235837]" />
            {article.readTime}
          </span>
        </div>

        {/* Main Parsed Markdown Content */}
        <div className="bg-white border border-[#E8E2D5] rounded-2xl p-6 sm:p-8 shadow-xs">
          <MarkdownRenderer content={article.content} onNavigate={onNavigate} />
        </div>

        {/* Reusable Topical Cluster Navigation */}
        <TopicalClusterNav currentTab={article.slug} onNavigate={onNavigate} />
      </div>
    </BotanicalSubpageLayout>
  );
}
