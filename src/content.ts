export interface DynamicArticle {
  id: string;
  title: string;
  shortDescription: string;
  category: string;
  readTime: string;
  iconName: string;
  slug: string;
  date?: string;
  content: string;
  status: string;
}

// 1. Helper to estimate reading time based on word count
function estimateReadTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

// 2. Helper to parse Frontmatter from Markdown files
export function parseMarkdownWithFrontmatter(raw: string): { metadata: Record<string, string>; body: string } {
  const trimmed = raw.trim();
  if (trimmed.startsWith('---')) {
    const parts = trimmed.split('---');
    if (parts.length >= 3) {
      const yamlBlock = parts[1];
      const body = parts.slice(2).join('---').trim();
      
      const metadata: Record<string, string> = {};
      yamlBlock.split(/\r?\n/).forEach(line => {
        const idx = line.indexOf(':');
        if (idx > -1) {
          const key = line.substring(0, idx).trim();
          const val = line.substring(idx + 1).trim().replace(/^["']|["']$/g, '');
          metadata[key] = val;
        }
      });
      return { metadata, body };
    }
  }
  return { metadata: {}, body: trimmed };
}

// 3. Eagerly load all posts in /content/posts/ directory using Vite's glob import
const mdFiles = import.meta.glob(['/content/posts/*.md', '../content/posts/*.md'], { query: '?raw', eager: true }) as Record<string, { default: string }>;
const jsonFiles = import.meta.glob(['/content/posts/*.json', '../content/posts/*.json'], { query: '?raw', eager: true }) as Record<string, { default: string }>;

export function getDynamicArticles(): DynamicArticle[] {
  const articles: DynamicArticle[] = [];
  const seenSlugs = new Set<string>();

  // Parse Markdown posts
  for (const path in mdFiles) {
    try {
      const rawEntry = mdFiles[path];
      const rawContent = typeof rawEntry === 'string' 
        ? rawEntry 
        : (rawEntry && typeof rawEntry === 'object' && 'default' in rawEntry ? (rawEntry as any).default : String(rawEntry || ''));
      
      if (!rawContent) continue;
      
      const { metadata, body } = parseMarkdownWithFrontmatter(rawContent);
      
      const fileSlug = path.split('/').pop()?.replace('.md', '') || '';
      const slug = metadata.slug || fileSlug;
      
      if (seenSlugs.has(slug)) continue;
      seenSlugs.add(slug);
      
      const title = metadata.title || slug.replace(/-/g, ' ');
      
      articles.push({
        id: `dynamic-${slug}`,
        title,
        shortDescription: metadata.excerpt || metadata.description || 'A specialist snake plant guide written by our content engine.',
        category: metadata.category || 'care',
        readTime: metadata.readTime || estimateReadTime(body),
        iconName: metadata.iconName || 'Compass',
        slug,
        date: metadata.date,
        content: body,
        status: metadata.status || 'published'
      });
    } catch (e) {
      console.error(`Failed to parse Markdown post at ${path}:`, e);
    }
  }

  // Parse JSON posts
  for (const path in jsonFiles) {
    try {
      const rawEntry = jsonFiles[path];
      const rawContent = typeof rawEntry === 'string'
        ? rawEntry
        : (rawEntry && typeof rawEntry === 'object' && 'default' in rawEntry ? (rawEntry as any).default : rawEntry);
        
      const data = typeof rawContent === 'string' ? JSON.parse(rawContent) : rawContent;
      if (!data) continue;
      
      const fileSlug = path.split('/').pop()?.replace('.json', '') || '';
      const slug = data.slug || fileSlug;
      
      if (seenSlugs.has(slug)) continue;
      seenSlugs.add(slug);
      
      articles.push({
        id: `dynamic-${slug}`,
        title: data.title || slug.replace(/-/g, ' '),
        shortDescription: data.excerpt || data.description || 'A specialist snake plant guide written by our content engine.',
        category: data.category || 'care',
        readTime: data.readTime || estimateReadTime(data.content || ''),
        iconName: data.iconName || 'Compass',
        slug,
        date: data.date,
        content: data.content || '',
        status: data.status || 'published'
      });
    } catch (e) {
      console.error(`Failed to parse JSON post at ${path}:`, e);
    }
  }

  // Filter out Draft statuses (show published ones by default)
  const isDev = import.meta.env.DEV;
  return articles.filter(art => {
    const statusLower = (art.status || 'published').toLowerCase();
    if (isDev) return true;
    return statusLower === 'published';
  });
}
