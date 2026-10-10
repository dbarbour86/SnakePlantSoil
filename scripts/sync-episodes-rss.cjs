const fs = require('fs');
const path = require('path');
const https = require('https');

const RSS_FEED_URL = process.env.PODCAST_RSS_URL || 'https://anchor.fm/s/118565be4/podcast/rss';
const EPISODES_DIR = path.join(__dirname, '..', 'content', 'episodes');
const SYNC_RESULT_FILE = path.join(__dirname, '..', '.rss-sync-result.json');

// Conservative keyword rules for connecting relevant existing guides
const GUIDE_KEYWORD_RULES = [
  {
    slug: 'snake-plant-root-rot-guide',
    keywords: ['root rot', 'mushy', 'yellowing', 'rotting', 'soggy soil', 'overwatering', 'overwater', 'anaerobic decay', 'smelly soil']
  },
  {
    slug: 'soil-diagnosis',
    keywords: ['diagnostic quiz', 'diagnos', 'soil test', 'drainage risk', 'soil profile', 'troubleshoot']
  },
  {
    slug: 'diy-snake-plant-soil-mix',
    keywords: ['diy soil', 'soil recipe', '3-2-1', 'pumice', 'perlite', 'mineral grit', 'make your own soil', 'mix recipe']
  },
  {
    slug: 'best-snake-plant-soil',
    keywords: ['commercial soil', 'store-bought', 'miracle-gro', 'cactus mix', 'succulent soil', 'best soil to buy', 'pre-mixed']
  },
  {
    slug: 'best-pots-for-snake-plants',
    keywords: ['terracotta', 'drainage hole', 'plastic pot', 'pot size', 'glazed pot', 'repotting container']
  },
  {
    slug: 'snake-plant-care-guide',
    keywords: ['care guide', 'light requirement', 'temperature', 'beginner guide', 'general care', 'snake plant care']
  },
  {
    slug: 'best-fertilizer-for-snake-plant-soil',
    keywords: ['fertilizer', 'fertilizing', 'plant food', 'npk', 'feed your snake plant', 'nutrients']
  },
  {
    slug: 'winter-watering-guide',
    keywords: ['winter watering', 'cold month', 'dormancy', 'seasonal care', 'winter care']
  }
];

function matchRelatedGuides(title, description) {
  const combinedText = `${title} ${description}`.toLowerCase();
  const matchedSlugs = [];

  for (const rule of GUIDE_KEYWORD_RULES) {
    const hasMatch = rule.keywords.some(kw => combinedText.includes(kw));
    if (hasMatch) {
      matchedSlugs.push(rule.slug);
      if (matchedSlugs.length >= 3) break; // Capped at 3 conservative matches
    }
  }

  return matchedSlugs;
}

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

// Helper to slugify string
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// Generate clean, descriptive URL slug from title
function generateCleanSlug(title) {
  // Strip parentheticals e.g. "(It's Probably Water)"
  let clean = title
    .replace(/\(.*?\)/g, '')
    .replace(/\[.*?\]/g, '')
    .trim();

  // If title had colon or dash separator, take primary part if sufficiently descriptive
  if (clean.includes(':')) {
    const firstPart = clean.split(':')[0].trim();
    if (firstPart.split(' ').length >= 3) {
      clean = firstPart;
    }
  }

  const baseSlug = slugify(clean);
  return baseSlug.length >= 5 ? baseSlug : slugify(title);
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
  const isSimulation = process.argv.includes('--simulate') || process.env.SIMULATE_EPISODE === 'true';

  console.log(`[RSS Sync] Starting Snake Plant Radio synchronization...`);
  let xmlData = '';

  if (isSimulation) {
    console.log(`[RSS Sync] Running in SIMULATION mode with mock episode.`);
    xmlData = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
      <channel>
        <title>Snake Plant Radio</title>
        <item>
          <title><![CDATA[Why Your Snake Plant Is Dying (It's Probably Water)]]></title>
          <description><![CDATA[Overwatering kills more snake plants than anything else. Maya and Jordan explain how to spot root rot early.]]></description>
          <pubDate>Sat, 10 Oct 2026 06:07:16 GMT</pubDate>
          <enclosure url="https://anchor.fm/s/118565be4/podcast/play/127239261/test.mp3" length="2567845" type="audio/mpeg"/>
          <itunes:duration>00:05:20</itunes:duration>
          <itunes:episode>1</itunes:episode>
          <itunes:season>1</itunes:season>
          <guid isPermaLink="false">3e551c94-f14a-4cb4-a823-d6f64607e396</guid>
        </item>
        <item>
          <title><![CDATA[The Secret to Terracotta Pots: Drainage, Aeration, and Pot Sizing]]></title>
          <description><![CDATA[In Episode 2, Maya and Jordan explore why terracotta pots are the best pots for snake plants and how drainage holes prevent root rot.]]></description>
          <pubDate>Thu, 15 Oct 2026 18:00:00 GMT</pubDate>
          <enclosure url="https://anchor.fm/s/118565be4/podcast/play/simulated2/episode2.mp3" length="3100000" type="audio/mpeg"/>
          <itunes:duration>00:06:45</itunes:duration>
          <itunes:episode>2</itunes:episode>
          <itunes:season>1</itunes:season>
          <guid isPermaLink="false">simulated-guid-episode-2-terracotta</guid>
        </item>
      </channel>
    </rss>`;
  } else {
    try {
      console.log(`[RSS Sync] Fetching feed from: ${RSS_FEED_URL}...`);
      xmlData = await fetchRss(RSS_FEED_URL);
    } catch (err) {
      console.warn(`[RSS Sync] Warning: Unable to fetch live RSS feed (${err.message}).`);
      console.warn(`[RSS Sync] Outage recovery active: Preserving existing local Markdown episodes in ${EPISODES_DIR}.`);
      writeSyncResult(false, 0, 0, []);
      return;
    }
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
  const newEpisodes = [];

  for (const feedEp of feedEpisodes) {
    // Detect existing episode using its RSS GUID first, then fallback to episodeNumber or slug match
    const matched = localEpisodes.find(local => {
      if (feedEp.guid && local.frontmatter.guid === feedEp.guid) return true;
      if (local.frontmatter.episodeNumber && parseInt(local.frontmatter.episodeNumber, 10) === feedEp.episodeNumber) return true;
      return false;
    });

    if (matched) {
      // Existing episode: Strictly preserve all curated markdown, show notes, transcripts, and internal links!
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
        console.log(`[RSS Sync] Synchronized technical metadata for Episode #${feedEp.episodeNumber} in ${matched.file}`);
        updatedCount++;
      } else {
        console.log(`[RSS Sync] Episode #${feedEp.episodeNumber} (${matched.file}) is up to date.`);
      }
    } else {
      // New episode discovered: Generate clean slug and new Markdown file
      const cleanSlug = generateCleanSlug(feedEp.title);
      const newFilePath = path.join(EPISODES_DIR, `${cleanSlug}.md`);
      
      const cleanExcerpt = feedEp.description 
        ? stripHtml(feedEp.description).split('\n')[0].substring(0, 240) 
        : `Snake Plant Radio Episode #${feedEp.episodeNumber}`;

      // Conservative related guides matching
      const relatedGuides = matchRelatedGuides(feedEp.title, feedEp.description);

      const relatedGuidesYaml = relatedGuides.length > 0
        ? `relatedGuides:\n${relatedGuides.map(g => `  - "${g}"`).join('\n')}`
        : `relatedGuides: []`;

      const scaffoldContent = `---
title: "${feedEp.title.replace(/"/g, '\\"')}"
slug: "${cleanSlug}"
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
${relatedGuidesYaml}
---

# ${feedEp.title}

${stripHtml(feedEp.description)}

---

## Episode Notes & Key Takeaways

- Broadcast audio streamed directly via native audio player.
- Published on Snake Plant Radio.

<!-- Add curated companion guides, botanical formulas, or full transcripts here -->
`;
      fs.writeFileSync(newFilePath, scaffoldContent, 'utf-8');
      console.log(`[RSS Sync] Created new episode page for Episode #${feedEp.episodeNumber} at ${newFilePath} (slug: /radio/${cleanSlug})`);
      if (relatedGuides.length > 0) {
        console.log(`[RSS Sync] Matched ${relatedGuides.length} related guide(s): ${relatedGuides.join(', ')}`);
      }
      createdCount++;
      newEpisodes.push({
        title: feedEp.title,
        slug: cleanSlug,
        episodeNumber: feedEp.episodeNumber
      });
    }
  }

  const hasChanges = createdCount > 0 || updatedCount > 0;
  console.log(`[RSS Sync] Complete: ${updatedCount} episode(s) refreshed, ${createdCount} new episode(s) discovered.`);
  console.log(`[RSS Sync] Note: Consumer Spotify URLs (open.spotify.com/episode/...) are not distributed in Anchor RSS XML. The native audio player is active.`);
  
  writeSyncResult(hasChanges, createdCount, updatedCount, newEpisodes);
}

function writeSyncResult(hasChanges, createdCount, updatedCount, newEpisodes) {
  const result = {
    hasChanges,
    createdCount,
    updatedCount,
    newEpisodes,
    timestamp: new Date().toISOString()
  };
  fs.writeFileSync(SYNC_RESULT_FILE, JSON.stringify(result, null, 2), 'utf-8');

  // Support GitHub Actions environment output
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `has_changes=${hasChanges}\ncreated_count=${createdCount}\nupdated_count=${updatedCount}\n`);
  }
}

syncPodcastRss();
