import React from 'react';
import { 
  Compass, Calendar, Clock, ChevronRight, HelpCircle, 
  Trees, Beaker, HeartPulse, Layers, ArrowLeft
} from 'lucide-react';
import { DynamicArticle } from '../content';
import { TopicalClusterNav } from './GuideArticles';

interface DynamicArticleViewProps {
  article: DynamicArticle;
  onNavigate: (tab: string) => void;
}

// Simple helper to parse inline styles like bold (**text**), italics (*text* or _text_), and inline code (`code`)
function parseInlineStyles(text: string): React.ReactNode {
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  const parts = text.split(regex);
  
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx} className="font-bold text-stone-900">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={idx} className="italic text-stone-850">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={idx} className="font-mono bg-stone-100 px-1.5 py-0.5 rounded text-stone-800 text-[11px] font-semibold">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

// Zero-dependency block parser for Markdown
function MarkdownRenderer({ content }: { content: string }) {
  // Split by double newlines for block separation
  const blocks = content.split(/\r?\n\r?\n/);
  
  return (
    <div className="space-y-5">
      {blocks.map((block, idx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;
        
        // Headers
        if (trimmed.startsWith('# ')) {
          return <h1 key={idx} className="text-2xl sm:text-3xl font-sans font-bold text-stone-900 tracking-tight mt-6 mb-3">{trimmed.slice(2)}</h1>;
        }
        if (trimmed.startsWith('## ')) {
          return <h2 key={idx} className="text-xl sm:text-2xl font-sans font-bold text-stone-900 tracking-tight mt-5 mb-3">{trimmed.slice(3)}</h2>;
        }
        if (trimmed.startsWith('### ')) {
          return <h3 key={idx} className="text-lg font-sans font-bold text-stone-900 mt-4 mb-2">{trimmed.slice(4)}</h3>;
        }
        
        // Blockquotes
        if (trimmed.startsWith('> ')) {
          const quoteLines = trimmed.split(/\r?\n/).map(line => line.replace(/^>\s?/, ''));
          return (
            <blockquote key={idx} className="border-l-4 border-emerald-800 pl-4 py-1.5 italic text-stone-600 bg-stone-50 rounded-r-xl my-4">
              {quoteLines.map((line, lIdx) => (
                <p key={lIdx} className="m-0 text-sm leading-relaxed">{parseInlineStyles(line)}</p>
              ))}
            </blockquote>
          );
        }
        
        // Lists (unordered)
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const items = trimmed.split(/\r?\n/).map(item => item.replace(/^[-*]\s+/, ''));
          return (
            <ul key={idx} className="list-disc pl-5 space-y-2 text-stone-700 my-4">
              {items.map((item, itemIdx) => (
                <li key={itemIdx} className="text-sm sm:text-base leading-relaxed">{parseInlineStyles(item)}</li>
              ))}
            </ul>
          );
        }
        
        // Lists (ordered)
        if (/^\d+\.\s+/.test(trimmed)) {
          const items = trimmed.split(/\r?\n/).map(item => item.replace(/^\d+\.\s+/, ''));
          return (
            <ol key={idx} className="list-decimal pl-5 space-y-2 text-stone-700 my-4">
              {items.map((item, itemIdx) => (
                <li key={itemIdx} className="text-sm sm:text-base leading-relaxed">{parseInlineStyles(item)}</li>
              ))}
            </ol>
          );
        }
        
        // Paragraph with linebreaks mapping
        const lines = trimmed.split(/\r?\n/);
        return (
          <p key={idx} className="text-stone-700 leading-relaxed text-sm sm:text-base mb-4">
            {lines.map((line, lineIdx) => (
              <React.Fragment key={lineIdx}>
                {lineIdx > 0 && <br />}
                {parseInlineStyles(line)}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

export default function DynamicArticleView({ article, onNavigate }: DynamicArticleViewProps) {
  // Dynamically resolve matching Lucide icons
  const getIcon = (name: string) => {
    switch (name) {
      case 'Trees': return <Trees className="w-6 h-6 text-emerald-800" />;
      case 'Beaker': return <Beaker className="w-6 h-6 text-emerald-800" />;
      case 'HeartPulse': return <HeartPulse className="w-6 h-6 text-emerald-800" />;
      case 'Layers': return <Layers className="w-6 h-6 text-emerald-800" />;
      default: return <Compass className="w-6 h-6 text-emerald-800" />;
    }
  };

  return (
    <article className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-6">
      
      {/* Intro Header */}
      <div className="bg-gradient-to-br from-emerald-50 to-stone-100 p-6 rounded-2xl border border-stone-200 mb-8">
        
        {/* Category Badge & Date */}
        <div className="flex flex-wrap gap-3 items-center text-xs font-mono text-stone-500 mb-3">
          <span className="inline-flex items-center gap-1 text-[9px] uppercase font-bold text-white bg-stone-900 px-2 py-0.5 rounded tracking-widest">
            {article.category.replace('-', ' ')}
          </span>
          {article.date && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {article.date}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {article.readTime}
          </span>
        </div>

        <h1 className="text-xl md:text-3xl font-sans font-bold text-stone-900 tracking-tight mt-0 flex items-start gap-2.5">
          <span className="shrink-0 mt-1">{getIcon(article.iconName)}</span>
          <span>{article.title}</span>
        </h1>
        
        <p className="text-stone-600 text-sm md:text-base mt-3 mb-0 font-medium pl-1 leading-relaxed">
          {article.shortDescription}
        </p>
      </div>

      {/* Main Rich Content */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 shadow-xs">
        <MarkdownRenderer content={article.content} />
      </div>

      {/* Authority footer note */}
      <div className="text-[11px] text-stone-400 font-mono italic text-right pr-2">
        Source: Content Engine Draft ({article.format?.toUpperCase() || 'MD'})
      </div>

      {/* Reusable Cluster Navigation */}
      <TopicalClusterNav currentTab={article.slug} onNavigate={onNavigate} />

    </article>
  );
}
