const fs = require('fs');
const path = require('path');
const https = require('https');

const RSS_FEED_URL = 'https://anchor.fm/s/118565be4/podcast/rss';
const EPISODES_DIR = path.join(__dirname, '..', 'content', 'episodes');

// Helper to format ISO or RFC date to YYYY-MM-DD
function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
  } catch (e) {}
  return dateStr;
}

// Helper to format itunes:duration (e.g., "00:05:20", "5:20", or seconds)
function formatDuration(raw) {
  if (!raw) return '15 min';
  const clean = raw.trim();
  if (clean.includes(':')) {
    const parts = clean.split(':').map(p => parseInt(p, 10) || 0);
    if (parts.length === 3) {
      const [h, m, s] = parts;
      if (h > 0) return `${h} hr ${m} min`;
      return `${m} min ${s} sec`;
    }
    if (parts.length === 2) {
      const [m, s] = parts;
      return `${m} min ${s} sec`;
    }
  }
  const secs = parseInt(clean, 10);
  if (!isNaN(secs)) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return s > 0 ? `${m} min ${s} sec` : `${m} min`;
  }
  return clean;
}

// Helper to slugify title
function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// Clean HTML tags from RSS description for initial body scaffold
function stripHtml(html) {
  return html
    .replace(/<a\b[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    .replace(/<li>(.*?)<\/li>/gi, '- $1\n')
    .replace(/<p>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .trim();
}

// Extract tag content from XML snippet
function getTagContent(xml, tagName) {
  const cdataRegex = new RegExp(`<${tagName}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tagName}>`, 'i');
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();

  const normalRegex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const normalMatch = xml.match(normalRegex);
  if (normalMatch) return normalMatch[1].trim();

  return '';
}

// Helper to parse frontmatter from markdown
function parseFrontmatter(content) {
  const trimmed = content.trim();
  if (!trimmed.startsWith('---')) {
    return { frontmatter: {}, body: trimmed, rawYaml: '' };
  }
  const parts = trimmed.split('---');
  if (parts.length < 3) {
    return { frontmatter: {}, body: trimmed, rawYaml: '' };
  }
  const rawYaml = parts[1];
  const body = parts.slice(2).join('---').trim();
  const frontmatter = {};

  rawYaml.split(/\r?\n/).forEach(line => {
    const idx = line.indexOf(':');
    if (idx > -1 && !line.startsWith(' ') && !line.startsWith('\t')) {
      const key = line.substring(0, idx).trim();
      const val = line.substring(idx + 1).trim().replace(/^["']|["']$/g, '');
      frontmatter[key] = val;
    }
  });

  return { frontmatter, body, rawYaml };
}

// Fetch RSS XML with timeout
function fetchRss(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: 8000 }, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error(`HTTP status ${res.statusCode}`));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Network request timed out'));
    });
    req.on('error', reject);
  });
}

async function syncPodcastRss() {
  console.log(`[RSS Sync] Fetching official Snake Plant Radio RSS feed: ${RSS_FEED_URL}...`);
  let xmlData = '';
  try {
    xmlData = await fetchRss(RSS_FEED_URL);
  } catch (err) {
    console.warn(`[RSS Sync] Warning: Unable to fetch live RSS feed (${err.message}).`);
    console.warn(`[RSS Sync] Preserving existing local Markdown episodes in ${EPISODES_DIR}.`);
    return;
  }

  if (!fs.existsSync(EPISODES_DIR)) {
    fs.mkdirSync(EPISODES_DIR, { recursive: true });
  }

  // Parse items
  const itemMatches = xmlData.match(/<item>([\s\S]*?)<\/item>/g) || [];
  console.log(`[RSS Sync] Found ${itemMatches.length} published episode(s) in feed.`);

  const feedEpisodes = [];
  itemMatches.forEach(itemXml => {
    const title = getTagContent(itemXml, 'title');
    const description = getTagContent(itemXml, 'description');
    const pubDate = getTagContent(itemXml, 'pubDate');
    const duration = getTagContent(itemXml, 'itunes:duration');
    const episodeNum = parseInt(getTagContent(itemXml, 'itunes:episode'), 10) || 1;
    const seasonNum = parseInt(getTagContent(itemXml, 'itunes:season'), 10) || 1;
    const guid = getTagContent(itemXml, 'guid');
    const link = getTagContent(itemXml, 'link');

    const encMatch = itemXml.match(/<enclosure[^>]*url="([^"]*)"/i);
    const audioUrl = encMatch ? encMatch[1] : '';

    feedEpisodes.push({
      title,
      description,
      pubDate: formatDate(pubDate),
      duration: formatDuration(duration),
      episodeNumber: episodeNum,
      seasonNumber: seasonNum,
      guid,
      audioUrl,
      podcasterLink: link
    });
  });

  // Scan existing local markdown files
  const localFiles = fs.readdirSync(EPISODES_DIR).filter(f => f.endsWith('.md'));
  const localEpisodes = [];

  localFiles.forEach(file => {
    const fullPath = path.join(EPISODES_DIR, file);
    const rawContent = fs.readFileSync(fullPath, 'utf-8');
    const { frontmatter, body, rawYaml } = parseFrontmatter(rawContent);
    localEpisodes.push({
      file,
      fullPath,
      frontmatter,
      body,
      rawYaml,
      rawContent
    });
  });

  let updatedCount = 0;
  let createdCount = 0;

  for (const feedEp of feedEpisodes) {
    // Attempt match by guid, or episodeNumber, or slug
    const matched = localEpisodes.find(local => {
      if (feedEp.guid && local.frontmatter.guid === feedEp.guid) return true;
      if (local.frontmatter.episodeNumber && parseInt(local.frontmatter.episodeNumber, 10) === feedEp.episodeNumber) return true;
      const fileSlug = local.file.replace(/\.md$/, '');
      if (local.frontmatter.slug === fileSlug && slugify(feedEp.title).includes(fileSlug)) return true;
      return false;
    });

    if (matched) {
      // Existing local episode: preserve ALL curated markdown and show notes.
      // Enrich only missing or technical feed properties.
      let modified = false;
      let newYaml = matched.rawYaml;

      if (!matched.frontmatter.guid && feedEp.guid) {
        newYaml = newYaml.trimEnd() + `\nguid: "${feedEp.guid}"\n`;
        modified = true;
      }

      if (!matched.frontmatter.audioUrl && feedEp.audioUrl) {
        newYaml = newYaml.trimEnd() + `\naudioUrl: "${feedEp.audioUrl}"\n`;
        modified = true;
      }

      // Check duration accuracy
      if (feedEp.duration && matched.frontmatter.duration !== feedEp.duration) {
        const durRegex = /duration:\s*["'][^"']*["']/;
        if (durRegex.test(newYaml)) {
          newYaml = newYaml.replace(durRegex, `duration: "${feedEp.duration}"`);
          modified = true;
        }
      }

      if (modified) {
        const updatedContent = `---\n${newYaml.trim()}\n---\n\n${matched.body}\n`;
        fs.writeFileSync(matched.fullPath, updatedContent, 'utf-8');
        console.log(`[RSS Sync] Synchronized feed metadata for Episode #${feedEp.episodeNumber} in ${matched.file}`);
        updatedCount++;
      } else {
        console.log(`[RSS Sync] Episode #${feedEp.episodeNumber} (${matched.file}) is up to date.`);
      }
    } else {
      // New episode discovered in RSS feed! Create initial scaffold preserving editorial integrity.
      const epSlug = `episode-${feedEp.episodeNumber}-${slugify(feedEp.title).substring(0, 30)}`;
      const newFilePath = path.join(EPISODES_DIR, `${epSlug}.md`);
      
      const cleanExcerpt = feedEp.description ? stripHtml(feedEp.description).split('\n')[0].substring(0, 200) : 'Snake Plant Radio podcast episode.';

      const scaffoldContent = `---
title: "${feedEp.title.replace(/"/g, '\\"')}"
slug: "${epSlug}"
episodeNumber: ${feedEp.episodeNumber}
seasonNumber: ${feedEp.seasonNumber}
date: "${feedEp.pubDate}"
duration: "${feedEp.duration}"
audioUrl: "${feedEp.audioUrl}"
guid: "${feedEp.guid}"
excerpt: "${cleanExcerpt.replace(/"/g, '\\"')}"
spotifyUrl: ""
spotifyEmbedUrl: ""
category: "General Care"
status: "published"
relatedGuides: []
---

# ${feedEp.title}

${stripHtml(feedEp.description)}

---

<!-- Add curated companion guides, interactive calculators, and full transcripts here -->
`;
      fs.writeFileSync(newFilePath, scaffoldContent, 'utf-8');
      console.log(`[RSS Sync] Created new episode scaffold for Episode #${feedEp.episodeNumber} at ${newFilePath}`);
      createdCount++;
    }
  }

  console.log(`[RSS Sync] Complete: ${updatedCount} episode(s) synced, ${createdCount} new episode scaffold(s) created.`);
  console.log(`[RSS Sync] Note: Spotify episode web player links (open.spotify.com/episode/...) are platform-generated and not exposed in Anchor RSS XML. Maintain consumer Spotify URLs in frontmatter manually.`);
}

syncPodcastRss();
