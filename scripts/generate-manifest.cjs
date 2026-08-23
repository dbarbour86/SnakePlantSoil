const fs = require('fs');
const path = require('path');

const dataTsPath = path.join(__dirname, '..', 'src', 'data.ts');
const dataContent = fs.readFileSync(dataTsPath, 'utf-8');

// 1. Extract static slugs
const slugRegex = /slug:\s*["']([^"']+)["']/g;
const staticSlugs = [];
let match;
while ((match = slugRegex.exec(dataContent)) !== null) {
  staticSlugs.push(match[1]);
}
const uniqueStaticSlugs = [...new Set(staticSlugs)];

// 2. Scan content/posts/ directory
const postsDir = path.join(__dirname, '..', 'content', 'posts');
const dynamicSlugs = [];
const metadata = {};

if (fs.existsSync(postsDir)) {
  const files = fs.readdirSync(postsDir);
  files.forEach(file => {
    if (file === '.gitkeep') return;
    if (file.endsWith('.md')) {
      const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
      const trimmed = content.trim();
      if (trimmed.startsWith('---')) {
        const parts = trimmed.split('---');
        if (parts.length >= 3) {
          const yamlBlock = parts[1];
          const meta = {};
          yamlBlock.split(/\r?\n/).forEach(line => {
            const idx = line.indexOf(':');
            if (idx > -1) {
              const key = line.substring(0, idx).trim();
              const val = line.substring(idx + 1).trim().replace(/^["']|["']$/g, '');
              meta[key] = val;
            }
          });
          const slug = meta.slug || file.replace(/\.md$/, '');
          const title = meta.title || '';
          const description = meta.excerpt || meta.description || '';
          
          dynamicSlugs.push(slug);
          metadata[slug] = { title, description };
        }
      }
    } else if (file.endsWith('.json')) {
      try {
        const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
        const data = JSON.parse(content);
        const slug = data.slug || file.replace(/\.json$/, '');
        const title = data.title || '';
        const description = data.excerpt || data.description || '';
        
        dynamicSlugs.push(slug);
        metadata[slug] = { title, description };
      } catch (e) {
        console.error(`Failed to parse JSON file ${file}:`, e);
      }
    }
  });
}

// 3. Write manifest
const manifest = {
  static: uniqueStaticSlugs,
  dynamic: dynamicSlugs,
  metadata: metadata
};

const manifestPath = path.join(__dirname, '..', 'src', 'generated-manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
console.log(`Generated manifest at ${manifestPath}`);

// 4. Generate sitemap.xml
const lastmod = new Date().toISOString().split('T')[0];
let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>https://snakeplantsoil.com/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Static Pages -->
  <url>
    <loc>https://snakeplantsoil.com/soil-diagnosis</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://snakeplantsoil.com/about</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://snakeplantsoil.com/faq</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://snakeplantsoil.com/care-card</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;

uniqueStaticSlugs.forEach(slug => {
  sitemapXml += `  <url>
    <loc>https://snakeplantsoil.com/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>\n`;
});

dynamicSlugs.forEach(slug => {
  sitemapXml += `  <url>
    <loc>https://snakeplantsoil.com/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
});

sitemapXml += `</urlset>\n`;

const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(sitemapPath, sitemapXml, 'utf-8');
console.log(`Generated sitemap at ${sitemapPath}`);

// 5. Generate vercel.json
const allSlugs = [
  "soil-diagnosis",
  "about",
  "faq",
  "care-card",
  ...uniqueStaticSlugs,
  ...dynamicSlugs
];

const vercelConfig = {
  "cleanUrls": true,
  "trailingSlash": false,
  "redirects": [
    { "source": "/home", "destination": "/", "permanent": true },
    { "source": "/home/", "destination": "/", "permanent": true },
    { "source": "/index.html", "destination": "/", "permanent": true },
    { "source": "/setup-kits", "destination": "/soil-diagnosis", "permanent": true },
    { "source": "/setup-kits/", "destination": "/soil-diagnosis", "permanent": true },
    { "source": "/dynamic-:slug", "destination": "/:slug", "permanent": true }
  ],
  "rewrites": [
    {
      "source": `/:slug(${allSlugs.join('|')})`,
      "destination": "/"
    }
  ]
};

const vercelPath = path.join(__dirname, '..', 'vercel.json');
fs.writeFileSync(vercelPath, JSON.stringify(vercelConfig, null, 2), 'utf-8');
console.log(`Generated vercel.json at ${vercelPath}`);
