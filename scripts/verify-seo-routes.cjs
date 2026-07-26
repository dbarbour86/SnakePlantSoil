const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const postsDir = path.join(__dirname, '..', 'content', 'posts');
const manifestPath = path.join(__dirname, '..', 'src', 'generated-manifest.json');
const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
const vercelPath = path.join(__dirname, '..', 'vercel.json');

// Helper to fail the script with a clear message
function fail(msg) {
  console.error(`\x1b[31mSEO ROUTE VERIFICATION FAILED:\x1b[0m ${msg}`);
  process.exit(1);
}

console.log("Starting SEO routes verification checks...");

// 1. Read files inside content/posts/ and verify each article
const slugsFound = new Set();
const articleSlugs = [];

if (!fs.existsSync(postsDir)) {
  fail(`Posts directory '${postsDir}' does not exist.`);
}

const files = fs.readdirSync(postsDir);
files.forEach(file => {
  if (file === '.gitkeep') return;
  if (!file.endsWith('.md') && !file.endsWith('.json')) {
    fail(`File '${file}' has an unsupported extension. Only .md and .json are allowed.`);
  }

  let title = '';
  let description = '';
  let slug = '';

  const filePath = path.join(postsDir, file);
  if (file.endsWith('.md')) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const trimmed = content.trim();
    if (!trimmed.startsWith('---')) {
      fail(`Markdown file '${file}' is missing frontmatter headers.`);
    }
    const parts = trimmed.split('---');
    if (parts.length < 3) {
      fail(`Markdown file '${file}' has malformed frontmatter headers.`);
    }
    const yamlBlock = parts[1];
    yamlBlock.split(/\r?\n/).forEach(line => {
      const idx = line.indexOf(':');
      if (idx > -1) {
        const key = line.substring(0, idx).trim();
        const val = line.substring(idx + 1).trim().replace(/^["']|["']$/g, '');
        if (key === 'title') title = val;
        if (key === 'excerpt' || key === 'description') description = val;
        if (key === 'slug') slug = val;
      }
    });
  } else if (file.endsWith('.json')) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      title = data.title || '';
      description = data.excerpt || data.description || '';
      slug = data.slug || '';
    } catch (e) {
      fail(`JSON file '${file}' is malformed: ${e.message}`);
    }
  }

  // Assertion: Missing title, description, or slug fails the build
  if (!title) fail(`Article file '${file}' is missing a title.`);
  if (!description) fail(`Article file '${file}' is missing a description/excerpt.`);
  if (!slug) fail(`Article file '${file}' is missing a slug.`);

  // Assertion: Every article file produces exactly one canonical slug. Duplicate slugs fail the build.
  if (slugsFound.has(slug)) {
    fail(`Duplicate slug found: '${slug}' in file '${file}'.`);
  }
  slugsFound.add(slug);
  articleSlugs.push(slug);
});

// 2. Read and parse manifest
if (!fs.existsSync(manifestPath)) {
  fail("Route manifest src/generated-manifest.json is missing.");
}
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
const manifestStatic = manifest.static || [];
const manifestDynamic = manifest.dynamic || [];

// Check for duplicate slugs between static and dynamic manifest slugs
const allManifestSlugs = [...manifestStatic, ...manifestDynamic];
const manifestSlugsSet = new Set();
allManifestSlugs.forEach(slug => {
  if (manifestSlugsSet.has(slug)) {
    fail(`Duplicate slug found in manifest: '${slug}'.`);
  }
  manifestSlugsSet.add(slug);
});

// Verify all content articles are in manifest.dynamic
articleSlugs.forEach(slug => {
  if (!manifestDynamic.includes(slug)) {
    fail(`Article /${slug} is missing from dynamic routes in src/generated-manifest.json.`);
  }
});

// Verify no deleted/nonexistent articles remain in manifest.dynamic
manifestDynamic.forEach(slug => {
  if (!articleSlugs.includes(slug)) {
    fail(`Manifest contains stale route /${slug} that does not exist in content/posts/.`);
  }
});

// 3. Read and parse sitemap.xml
if (!fs.existsSync(sitemapPath)) {
  fail("Sitemap public/sitemap.xml is missing.");
}
const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');

// Extract all <loc> URLs from sitemap
const sitemapUrls = [];
const locRegex = /<loc>([^<]+)<\/loc>/g;
let locMatch;
while ((locMatch = locRegex.exec(sitemapContent)) !== null) {
  sitemapUrls.push(locMatch[1]);
}

// Assertions on Sitemap URLs
sitemapUrls.forEach(url => {
  // Assertion: No sitemap URL contains www, http (must be https), file extensions, query params
  if (url.includes('www.')) fail(`Sitemap URL '${url}' contains prohibited 'www.'.`);
  if (url.startsWith('http://')) fail(`Sitemap URL '${url}' uses insecure 'http://'.`);
  if (url.includes('.html') || url.includes('.xml')) fail(`Sitemap URL '${url}' contains a file extension.`);
  if (url.includes('?')) fail(`Sitemap URL '${url}' contains query parameters.`);
  
  // Assertion: No sitemap URL contains trailing slash (except root)
  if (url !== 'https://snakeplantsoil.com/' && url.endsWith('/')) {
    fail(`Sitemap URL '${url}' contains an invalid trailing slash.`);
  }

  // Parse path from sitemap URL
  const parsedPath = url.replace('https://snakeplantsoil.com', '');
  const cleanPath = parsedPath.replace(/^\//, '').replace(/\/$/, '');

  // Assertion: Every sitemap URL appears in the route manifest (except root, setup-kits, faq, care-card)
  if (cleanPath && !['setup-kits', 'faq', 'care-card'].includes(cleanPath)) {
    if (!allManifestSlugs.includes(cleanPath)) {
      fail(`Sitemap URL '${url}' does not correspond to any valid slug in the manifest.`);
    }
  }
});

// Assertion: Every manifest URL appears in the sitemap. Every article canonical matches its final clean URL.
allManifestSlugs.forEach(slug => {
  const expectedUrl = `https://snakeplantsoil.com/${slug}`;
  if (!sitemapUrls.includes(expectedUrl)) {
    fail(`Manifest slug '${slug}' is missing from sitemap.xml URL: '${expectedUrl}'.`);
  }
});

// 4. Verify vercel.json
if (!fs.existsSync(vercelPath)) {
  fail("vercel.json is missing.");
}
const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf-8'));
const rewrites = vercelConfig.rewrites || [];
const routeRewrite = rewrites.find(r => r.destination === '/');
if (!routeRewrite) {
  fail("vercel.json is missing the SPA fallback rewrite rule to '/'.");
}
const sourcePattern = routeRewrite.source || '';
allManifestSlugs.forEach(slug => {
  if (!sourcePattern.includes(slug)) {
    fail(`Slug '${slug}' is missing from the vercel.json rewrites rule pattern.`);
  }
});

// 5. CI check: Verify that committed files match the newly generated files (fail if there are uncommitted changes to manifest, sitemap, or vercel.json in CI/Vercel)
const isCI = process.env.CI === 'true' || process.env.VERCEL === '1' || process.env.GITHUB_ACTIONS === 'true';
if (isCI) {
  try {
    const uncommitted = execSync('git status --porcelain vercel.json public/sitemap.xml src/generated-manifest.json', { encoding: 'utf-8' }).trim();
    if (uncommitted) {
      fail(`The committed routing configurations (vercel.json, sitemap.xml, or generated-manifest.json) are stale. Please run 'npm run publish-check' locally and commit the updated configurations.`);
    }
  } catch (e) {
    console.warn("Warning: Git command failed or is not available. Skipping uncommitted files diff check.");
  }
} else {
  console.log("Local environment detected: skipping stale CI configuration check.");
}

console.log("\x1b[32mSEO Route and Configuration Verification Passed Successfully!\x1b[0m");
