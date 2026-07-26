import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { STATIC_GUIDES } from "./src/data";

async function startServer() {
  const app = express();
  const PORT = 3000;

  const getValidRoutes = () => {
    const routes = new Set([
      '/',
      '/setup-kits',
      '/faq',
      '/care-card'
    ]);
    
    STATIC_GUIDES.forEach(guide => {
      routes.add(`/${guide.slug}`);
      routes.add(`/${guide.id}`);
    });

    try {
      const postsDir = path.join(process.cwd(), 'content', 'posts');
      if (fs.existsSync(postsDir)) {
        const files = fs.readdirSync(postsDir);
        files.forEach(file => {
          if (file.endsWith('.md') || file.endsWith('.json')) {
            const slug = file.replace(/\.(md|json)$/, '');
            routes.add(`/${slug}`);
            routes.add(`/dynamic-${slug}`);
          }
        });
      }
    } catch (err) {
      console.error("Failed to load dynamic articles in server:", err);
    }

    return routes;
  };

  const getDynamicArticleMeta = (slug: string): { title: string; description: string } | null => {
    try {
      const postsDir = path.join(process.cwd(), 'content', 'posts');
      const mdPath = path.join(postsDir, `${slug}.md`);
      const jsonPath = path.join(postsDir, `${slug}.json`);

      if (fs.existsSync(mdPath)) {
        const content = fs.readFileSync(mdPath, 'utf-8');
        const trimmed = content.trim();
        if (trimmed.startsWith('---')) {
          const parts = trimmed.split('---');
          if (parts.length >= 3) {
            const yamlBlock = parts[1];
            const meta: Record<string, string> = {};
            yamlBlock.split(/\r?\n/).forEach(line => {
              const idx = line.indexOf(':');
              if (idx > -1) {
                const key = line.substring(0, idx).trim();
                const val = line.substring(idx + 1).trim().replace(/^["']|["']$/g, '');
                meta[key] = val;
              }
            });
            return {
              title: meta.title || slug.replace(/-/g, ' '),
              description: meta.excerpt || meta.description || 'A specialist snake plant guide written by our content engine.'
            };
          }
        }
      } else if (fs.existsSync(jsonPath)) {
        const content = fs.readFileSync(jsonPath, 'utf-8');
        const data = JSON.parse(content);
        return {
          title: data.title || slug.replace(/-/g, ' '),
          description: data.excerpt || data.description || 'A specialist snake plant guide written by our content engine.'
        };
      }
    } catch (e) {
      console.error(`Failed to read dynamic post meta for ${slug}:`, e);
    }
    return null;
  };

  // Redirect www.snakeplantsoil.com to snakeplantsoil.com, and trailing slashes
  app.use((req, res, next) => {
    const host = req.headers.host || "";
    
    // 301 www to non-www redirect
    if (host.startsWith("www.")) {
      const bareHost = host.slice(4);
      return res.redirect(301, `https://${bareHost}${req.originalUrl}`);
    }

    const cleanPath = req.path.replace(/\/$/, '');

    // Intercept home variations early to prevent 2 hops
    if (cleanPath === '/home' || req.path === '/index.html') {
      return res.redirect(301, '/');
    }

    // Trailing slash normalization (only for pages, not static files)
    if (req.path !== '/' && req.path.endsWith('/') && !cleanPath.includes('.')) {
      return res.redirect(301, `${cleanPath}${req.originalUrl.substring(req.path.length)}`);
    }

    next();
  });

  // Homepage variants redirects
  app.get(['/home', '/home/', '/index.html'], (req, res) => {
    return res.redirect(301, '/');
  });

  // Old dynamic URL redirects with 'dynamic-' prefix
  app.get('/dynamic-:slug', (req, res) => {
    const slug = req.params.slug;
    return res.redirect(301, `/${slug}`);
  });

  const renderHtmlResponse = (filePath: string, lookupPath: string, statusCode: number, res: express.Response) => {
    try {
      let html = fs.readFileSync(filePath, "utf-8");

      // Default values
      let title = "The Best Soil for Snake Plants — Optimal DIY Recipe & Care Guide";
      let description = "Ultimate master botanical guide to selecting, mixing, and buying the absolute best soil for snake plants (Sansevieria). Get our golden ratio DIY recipe.";
      let canonicalUrl = 'https://snakeplantsoil.com/';
      let is404 = statusCode === 404;

      const staticMatch = STATIC_GUIDES.find(s => `/${s.slug}` === lookupPath || `/${s.id}` === lookupPath);
      
      let dynamicMatch = null;
      if (lookupPath.startsWith('/') && lookupPath.length > 1) {
        dynamicMatch = getDynamicArticleMeta(lookupPath.substring(1));
      }

      if (lookupPath === '/' || lookupPath === '/home') {
        title = "The Best Soil for Snake Plants — Optimal DIY Recipe & Care Guide";
        description = "Ultimate master botanical guide to selecting, mixing, and buying the absolute best soil for snake plants (Sansevieria). Get our golden ratio DIY recipe.";
        canonicalUrl = 'https://snakeplantsoil.com/';
      } else if (lookupPath === '/setup-kits') {
        title = "Snake Plant Soil Mix Setup Kit Builder | SnakePlantSoil.com";
        description = "Custom potting component calculator. Choose your pot size and design the perfect quick-draining soil mix with our custom kit builder.";
        canonicalUrl = 'https://snakeplantsoil.com/setup-kits';
      } else if (lookupPath === '/faq') {
        title = "Snake Plant Potting & Care FAQs | SnakePlantSoil.com";
        description = "Botanist-verified answers to common questions about watering frequency, soil amendments, pot sizes, and rot prevention.";
        canonicalUrl = 'https://snakeplantsoil.com/faq';
      } else if (lookupPath === '/care-card') {
        title = "Free Printable Snake Plant Care Card Generator | SnakePlantSoil.com";
        description = "Generate a custom PDF care card with your snake plant's name, optimal watering frequency, and sunlight requirements.";
        canonicalUrl = 'https://snakeplantsoil.com/care-card';
      } else if (staticMatch) {
        const staticMetaMap: Record<string, { title: string; desc: string }> = {
          'best-soil': {
            title: "Best Commercial Soils for Snake Plants | SnakePlantSoil.com",
            desc: "Honest, editorial review of the top 4 commercial succulent and cactus mixes tested specifically for Sansevieria drainage."
          },
          'diy-mix': {
            title: "DIY Snake Plant Soil Mix Recipe (3-2-1 Ratio) | SnakePlantSoil.com",
            desc: "Our signature 3-2-1 gritty recipe. Learn how to mix potting soil, perlite, and coarse sand for the absolute ultimate home mix."
          },
          'root-rot': {
            title: "How to Identify & Save Snake Plant Root Rot | SnakePlantSoil.com",
            desc: "How to identify, treat, and surgically recover a snake plant suffering from mushy leaves, soggy stems, or black rhizomes."
          },
          'best-pots': {
            title: "Best Pots for Snake Plants (Breathable Terracotta) | SnakePlantSoil.com",
            desc: "Why breathable porous clay terracotta is king. A deep dive of container sizes, drainage holes, and aesthetic pot recommendations."
          },
          'care-guide': {
            title: "Seasonal Snake Plant Care & Watering Masterclass | SnakePlantSoil.com",
            desc: "Mastering the 'Soak and Dry' watering cycle, seasonal routines, winter dryness tactics, and light level placements."
          }
        };
        const meta = staticMetaMap[staticMatch.id] || { title: staticMatch.title, desc: staticMatch.shortDescription };
        title = meta.title;
        description = meta.desc;
        canonicalUrl = `https://snakeplantsoil.com/${staticMatch.slug}`;
      } else if (dynamicMatch) {
        title = `${dynamicMatch.title} | SnakePlantSoil.com`;
        description = dynamicMatch.description;
        canonicalUrl = `https://snakeplantsoil.com/${lookupPath.substring(1)}`;
      } else {
        is404 = true;
        title = "404 - Guide Not Found | SnakePlantSoil.com";
        description = "The requested snake plant care page could not be located.";
      }

      // String replacements
      html = html.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`);
      if (html.includes('name="description"')) {
        html = html.replace(/<meta name="description" content="[^"]*"/i, `<meta name="description" content="${description}"`);
      } else {
        html = html.replace('</head>', `<meta name="description" content="${description}" />\n</head>`);
      }

      if (is404) {
        html = html.replace(/<link rel="canonical" href="[^"]*" \/>/i, '');
        html = html.replace('<meta name="robots" content="index, follow" />', '<meta name="robots" content="noindex, follow" />');
      } else {
        const canonicalTag = `<link rel="canonical" href="${canonicalUrl}" />`;
        if (html.includes('link rel="canonical"')) {
          html = html.replace(/<link rel="canonical" href="[^"]*" \/>/i, canonicalTag);
        } else {
          html = html.replace('</head>', `${canonicalTag}\n</head>`);
        }
      }

      res.status(statusCode).send(html);
    } catch (err) {
      console.error("Failed to render HTML template:", err);
      res.status(500).send("Internal Server Error");
    }
  };

  // Serve static files in production before routing wildcards
  if (process.env.NODE_ENV === "production") {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false }));

    app.get('*', (req, res, next) => {
      const cleanPath = req.path.replace(/\/$/, '');
      const lookupPath = cleanPath === '' ? '/' : cleanPath;

      if (cleanPath.includes('.') || req.path.startsWith('/assets/')) {
        return next();
      }

      const validRoutes = getValidRoutes();
      if (validRoutes.has(lookupPath)) {
        renderHtmlResponse(path.join(distPath, 'index.html'), lookupPath, 200, res);
      } else {
        renderHtmlResponse(path.join(distPath, '404.html'), lookupPath, 404, res);
      }
    });
  }

  // Development setup with the dev server middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });

    app.use(async (req, res, next) => {
      const cleanPath = req.path.replace(/\/$/, '');
      const lookupPath = cleanPath === '' ? '/' : cleanPath;

      if (
        cleanPath.includes('.') || 
        req.path.startsWith('/assets/') || 
        req.path.startsWith('/@') || 
        req.path.startsWith('/node_modules/')
      ) {
        return next();
      }

      const validRoutes = getValidRoutes();
      if (!validRoutes.has(lookupPath)) {
        try {
          let html = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf-8");
          html = await vite.transformIndexHtml(req.originalUrl, html);
          
          html = html.replace(/<title>[^<]*<\/title>/i, `<title>404 - Guide Not Found | SnakePlantSoil.com</title>`);
          html = html.replace(/<link rel="canonical" href="[^"]*" \/>/i, '');
          html = html.replace('<meta name="robots" content="index, follow" />', '<meta name="robots" content="noindex, follow" />');
          
          return res.status(404).send(html);
        } catch (e) {
          vite.ssrFixStacktrace(e as Error);
          return next(e);
        }
      }
      next();
    });

    app.use(vite.middlewares);

    // Fallback for valid routes in dev mode
    app.get('*', async (req, res, next) => {
      try {
        let html = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf-8");
        html = await vite.transformIndexHtml(req.originalUrl, html);
        
        const cleanPath = req.path.replace(/\/$/, '');
        const lookupPath = cleanPath === '' ? '/' : cleanPath;
        
        let title = "The Best Soil for Snake Plants — Optimal DIY Recipe & Care Guide";
        let description = "Ultimate master botanical guide to selecting, mixing, and buying the absolute best soil for snake plants (Sansevieria). Get our golden ratio DIY recipe.";
        let canonicalUrl = 'https://snakeplantsoil.com/';
        
        const staticMatch = STATIC_GUIDES.find(s => `/${s.slug}` === lookupPath || `/${s.id}` === lookupPath);
        
        let dynamicMatch = null;
        if (lookupPath.startsWith('/') && lookupPath.length > 1) {
          dynamicMatch = getDynamicArticleMeta(lookupPath.substring(1));
        }
        
        if (lookupPath === '/' || lookupPath === '/home') {
          // Keep defaults
        } else if (lookupPath === '/setup-kits') {
          title = "Snake Plant Soil Mix Setup Kit Builder | SnakePlantSoil.com";
          description = "Custom potting component calculator. Choose your pot size and design the perfect quick-draining soil mix with our custom kit builder.";
          canonicalUrl = 'https://snakeplantsoil.com/setup-kits';
        } else if (lookupPath === '/faq') {
          title = "Snake Plant Potting & Care FAQs | SnakePlantSoil.com";
          description = "Botanist-verified answers to common questions about watering frequency, soil amendments, pot sizes, and rot prevention.";
          canonicalUrl = 'https://snakeplantsoil.com/faq';
        } else if (lookupPath === '/care-card') {
          title = "Free Printable Snake Plant Care Card Generator | SnakePlantSoil.com";
          description = "Generate a custom PDF care card with your snake plant's name, optimal watering frequency, and sunlight requirements.";
          canonicalUrl = 'https://snakeplantsoil.com/care-card';
        } else if (staticMatch) {
          const staticMetaMap: Record<string, { title: string; desc: string }> = {
            'best-soil': {
              title: "Best Commercial Soils for Snake Plants | SnakePlantSoil.com",
              desc: "Honest, editorial review of the top 4 commercial succulent and cactus mixes tested specifically for Sansevieria drainage."
            },
            'diy-mix': {
              title: "DIY Snake Plant Soil Mix Recipe (3-2-1 Ratio) | SnakePlantSoil.com",
              desc: "Our signature 3-2-1 gritty recipe. Learn how to mix potting soil, perlite, and coarse sand for the absolute ultimate home mix."
            },
            'root-rot': {
              title: "How to Identify & Save Snake Plant Root Rot | SnakePlantSoil.com",
              desc: "How to identify, treat, and surgically recover a snake plant suffering from mushy leaves, soggy stems, or black rhizomes."
            },
            'best-pots': {
              title: "Best Pots for Snake Plants (Breathable Terracotta) | SnakePlantSoil.com",
              desc: "Why breathable porous clay terracotta is king. A deep dive of container sizes, drainage holes, and aesthetic pot recommendations."
            },
            'care-guide': {
              title: "Seasonal Snake Plant Care & Watering Masterclass | SnakePlantSoil.com",
              desc: "Mastering the 'Soak and Dry' watering cycle, seasonal routines, winter dryness tactics, and light level placements."
            }
          };
          const meta = staticMetaMap[staticMatch.id] || { title: staticMatch.title, desc: staticMatch.shortDescription };
          title = meta.title;
          description = meta.desc;
          canonicalUrl = `https://snakeplantsoil.com/${staticMatch.slug}`;
        } else if (dynamicMatch) {
          title = `${dynamicMatch.title} | SnakePlantSoil.com`;
          description = dynamicMatch.description;
          canonicalUrl = `https://snakeplantsoil.com/${lookupPath.substring(1)}`;
        }
        
        html = html.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`);
        if (html.includes('name="description"')) {
          html = html.replace(/<meta name="description" content="[^"]*"/i, `<meta name="description" content="${description}"`);
        } else {
          html = html.replace('</head>', `<meta name="description" content="${description}" />\n</head>`);
        }
        
        const canonicalTag = `<link rel="canonical" href="${canonicalUrl}" />`;
        if (html.includes('link rel="canonical"')) {
          html = html.replace(/<link rel="canonical" href="[^"]*" \/>/i, canonicalTag);
        } else {
          html = html.replace('</head>', `${canonicalTag}\n</head>`);
        }
        
        res.status(200).send(html);
      } catch (e) {
        next(e);
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
