import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { STATIC_GUIDES } from "./src/data";
import routeManifest from "./src/generated-manifest.json";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  const getValidRoutes = () => {
    const routes = new Set([
      '/',
      '/soil-diagnosis',
      '/about',
      '/faq',
      '/care-card'
    ]);
    
    STATIC_GUIDES.forEach(guide => {
      routes.add(`/${guide.slug}`);
      routes.add(`/${guide.id}`);
    });

    if (routeManifest && routeManifest.dynamic) {
      routeManifest.dynamic.forEach(slug => {
        routes.add(`/${slug}`);
        routes.add(`/dynamic-${slug}`);
      });
    }

    return routes;
  };

  const getDynamicArticleMeta = (slug: string): { title: string; description: string } | null => {
    if (routeManifest && routeManifest.metadata) {
      const meta = (routeManifest.metadata as Record<string, { title: string; description: string }>)[slug];
      if (meta) {
        return meta;
      }
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

    // Intercept redirects early to prevent double hops
    if (cleanPath === '/setup-kits') {
      return res.redirect(301, '/soil-diagnosis');
    }

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
      } else if (lookupPath === '/soil-diagnosis') {
        title = "Snake Plant Soil Diagnosis & Custom Recommendations | SnakePlantSoil.com";
        description = "Troubleshoot your snake plant's leaves, pot, and watering conditions. Get a recommended commercial soil profile and fit check.";
        canonicalUrl = 'https://snakeplantsoil.com/soil-diagnosis';
      } else if (lookupPath === '/about') {
        title = "About Our Practical Soil Research | SnakePlantSoil.com";
        description = "Learn about Snake Plant Soil Lab's mission to simplify plant care, pot, light and watering mechanics, and future soil mix trials.";
        canonicalUrl = 'https://snakeplantsoil.com/about';
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
    app.use(express.static(distPath, { index: false, redirect: false }));

    app.get('*', (req, res, next) => {
      const cleanPath = req.path.replace(/\/$/, '');
      const lookupPath = cleanPath === '' ? '/' : cleanPath;

      if (cleanPath.includes('.') || req.path.startsWith('/assets/')) {
        return next();
      }

      // Check for Redirects first
      if (lookupPath === '/setup-kits') {
        return res.redirect(301, '/soil-diagnosis');
      }

      const validRoutes = getValidRoutes();
      if (validRoutes.has(lookupPath)) {
        // Look for prerendered file
        const prerenderedPath = lookupPath === '/' 
          ? path.join(distPath, 'index.html')
          : path.join(distPath, lookupPath.replace(/^\//, ''), 'index.html');

        if (fs.existsSync(prerenderedPath)) {
          return res.status(200).sendFile(prerenderedPath);
        }
        
        renderHtmlResponse(path.join(distPath, 'index.html'), lookupPath, 200, res);
      } else {
        const prerendered404 = path.join(distPath, '404.html');
        if (fs.existsSync(prerendered404)) {
          return res.status(404).sendFile(prerendered404);
        }
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

      // Check for Redirects first
      if (lookupPath === '/setup-kits') {
        return res.redirect(301, '/soil-diagnosis');
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
        } else if (lookupPath === '/soil-diagnosis') {
          title = "Snake Plant Soil Diagnosis & Custom Recommendations | SnakePlantSoil.com";
          description = "Troubleshoot your snake plant's leaves, pot, and watering conditions. Get a recommended commercial soil profile and fit check.";
          canonicalUrl = 'https://snakeplantsoil.com/soil-diagnosis';
        } else if (lookupPath === '/about') {
          title = "About Our Practical Soil Research | SnakePlantSoil.com";
          description = "Learn about Snake Plant Soil Lab's mission to simplify plant care, pot, light and watering mechanics, and future soil mix trials.";
          canonicalUrl = 'https://snakeplantsoil.com/about';
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
