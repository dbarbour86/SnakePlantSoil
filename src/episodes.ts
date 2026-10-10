export interface Episode {
  id: string;
  slug: string;
  episodeNumber: number;
  seasonNumber?: number;
  title: string;
  description: string;
  date: string;
  duration: string;
  spotifyUrl: string;
  spotifyEmbedUrl: string;
  category: string;
  status: string;
  relatedGuides: string[];
  content: string;
}

// Convert any Spotify URL to an official responsive embed URL
export function formatSpotifyEmbedUrl(url: string): string {
  if (!url) return '';
  if (url.includes('EXAMPLE') || url.includes('YOUR_SPOTIFY')) return '';
  if (url.includes('open.spotify.com/embed/')) return url;
  
  const episodeMatch = url.match(/open\.spotify\.com\/episode\/([a-zA-Z0-9]+)/);
  if (episodeMatch && episodeMatch[1]) {
    return `https://open.spotify.com/embed/episode/${episodeMatch[1]}?utm_source=generator&theme=0`;
  }
  
  const showMatch = url.match(/open\.spotify\.com\/show\/([a-zA-Z0-9]+)/);
  if (showMatch && showMatch[1]) {
    return `https://open.spotify.com/embed/show/${showMatch[1]}?utm_source=generator&theme=0`;
  }

  return url;
}

export function hasValidSpotify(episode: { spotifyUrl?: string; spotifyEmbedUrl?: string }): boolean {
  const url = episode.spotifyEmbedUrl || episode.spotifyUrl || '';
  if (!url || url.includes('EXAMPLE') || url.includes('YOUR_SPOTIFY')) return false;
  return url.includes('open.spotify.com/embed/') || url.includes('open.spotify.com/episode/');
}

// Helper to parse frontmatter from Markdown files
export function parseEpisodeMarkdown(raw: string): { metadata: Record<string, any>; body: string } {
  const trimmed = raw.trim();
  if (trimmed.startsWith('---')) {
    const parts = trimmed.split('---');
    if (parts.length >= 3) {
      const yamlBlock = parts[1];
      const body = parts.slice(2).join('---').trim();

      const metadata: Record<string, any> = {};
      const lines = yamlBlock.split(/\r?\n/);
      let currentArrayKey: string | null = null;
      let currentArray: string[] = [];
      let currentObjectKey: string | null = null;
      let currentSubObject: Record<string, string> = {};

      lines.forEach(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith('#')) return;

        const isIndented = line.startsWith(' ') || line.startsWith('\t');

        // Check if inside YAML array
        if (isIndented && currentArrayKey && trimmedLine.startsWith('- ')) {
          currentObjectKey = null;
          const itemVal = trimmedLine.replace(/^-\s*/, '').trim().replace(/^["']|["']$/g, '');
          currentArray.push(itemVal);
          return;
        }

        // Check if inside nested object
        if (isIndented && currentObjectKey) {
          currentArrayKey = null;
          const subIdx = trimmedLine.indexOf(':');
          if (subIdx > -1) {
            const subK = trimmedLine.substring(0, subIdx).trim();
            const subV = trimmedLine.substring(subIdx + 1).trim().replace(/^["']|["']$/g, '');
            currentSubObject[subK] = subV;
          }
          return;
        }

        // Flushing previous complex structures when hitting unindented line
        if (currentArrayKey && currentArray.length > 0) {
          metadata[currentArrayKey] = currentArray;
        }
        currentArrayKey = null;
        currentArray = [];

        if (currentObjectKey && Object.keys(currentSubObject).length > 0) {
          metadata[currentObjectKey] = currentSubObject;
        }
        currentObjectKey = null;
        currentSubObject = {};

        if (isIndented) return; // Ignore orphan indentation

        const idx = line.indexOf(':');
        if (idx > -1) {
          const key = line.substring(0, idx).trim();
          const val = line.substring(idx + 1).trim();
          if (val === '') {
            // Potential array or sub-object start
            currentArrayKey = key;
            currentArray = [];
            currentObjectKey = key;
            currentSubObject = {};
          } else {
            metadata[key] = val.replace(/^["']|["']$/g, '');
          }
        }
      });

      if (currentArrayKey && currentArray.length > 0) {
        metadata[currentArrayKey] = currentArray;
      }
      if (currentObjectKey && Object.keys(currentSubObject).length > 0) {
        metadata[currentObjectKey] = currentSubObject;
      }

      return { metadata, body };
    }
  }
  return { metadata: {}, body: trimmed };
}

// Eagerly glob all episode markdown files in /content/episodes/
let episodeFiles: Record<string, { default: string }> = {};
try {
  episodeFiles = import.meta.glob(['/content/episodes/*.md', '../content/episodes/*.md'], { query: '?raw', eager: true }) as any;
} catch (e) {}

export function getEpisodes(): Episode[] {
  const episodes: Episode[] = [];
  const seenSlugs = new Set<string>();

  for (const path in episodeFiles) {
    try {
      const rawEntry = episodeFiles[path];
      const rawContent = typeof rawEntry === 'string'
        ? rawEntry
        : (rawEntry && typeof rawEntry === 'object' && 'default' in rawEntry ? (rawEntry as any).default : String(rawEntry || ''));

      if (!rawContent) continue;

      const { metadata, body } = parseEpisodeMarkdown(rawContent);
      const fileSlug = path.split('/').pop()?.replace('.md', '') || '';
      const slug = metadata.slug || fileSlug;

      if (seenSlugs.has(slug)) continue;
      seenSlugs.add(slug);

      const title = metadata.title || slug.replace(/-/g, ' ');
      const epNum = parseInt(metadata.episodeNumber, 10) || 1;
      const seasonNum = parseInt(metadata.seasonNumber, 10) || 1;
      const spotifyUrl = metadata.spotifyUrl || '';
      const spotifyEmbedUrl = metadata.spotifyEmbedUrl || formatSpotifyEmbedUrl(spotifyUrl);
      const relatedGuides = Array.isArray(metadata.relatedGuides) ? metadata.relatedGuides : [];

      episodes.push({
        id: `episode-${slug}`,
        slug,
        episodeNumber: epNum,
        seasonNumber: seasonNum,
        title,
        description: metadata.excerpt || metadata.description || 'A deep-dive audio episode from Snake Plant Radio.',
        date: metadata.date || '2026-08-01',
        duration: metadata.duration || '20 min',
        spotifyUrl,
        spotifyEmbedUrl,
        category: metadata.category || 'Soil Science',
        status: metadata.status || 'published',
        relatedGuides,
        content: body
      });
    } catch (e) {
      console.error(`Failed to parse episode at ${path}:`, e);
    }
  }

  // Sort episodes by episodeNumber ascending or date descending
  return episodes.sort((a, b) => b.episodeNumber - a.episodeNumber);
}

export function getEpisodeBySlug(slug: string): Episode | undefined {
  const episodes = getEpisodes();
  const clean = slug.replace(/^radio\//, '').replace(/^\//, '');
  return episodes.find(e => e.slug === clean || e.id === `episode-${clean}`);
}
