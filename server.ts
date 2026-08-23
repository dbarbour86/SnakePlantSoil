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
    });

    if (routeManifest && routeManifest.dynamic) {
      routeManifest.dynamic.forEach(slug => {
        routes.add(`/${slug}`);
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

  // Redirect www.snakeplantsoil.com to snakeplantsoil.com, trailing slashes, and legacy aliases
  app.use((req, res, next) => {
    const host = req.headers.host || "";
    
    // 301 www to non-www redirect
    if (host.startsWith("www.")) {
      const bareHost = host.slice(4);
      return res.redirect(301, `https://${bareHost}${req.originalUrl}`);
    }

    const cleanPath = req.path.replace(/\/$/, '');

    // 301 Permanent Redirects for Alias Routes
    const ALIAS_REDIRECTS: Record<string, string> = {
      '/best-soil': '/best-snake-plant-soil',
      '/diy-mix': '/diy-snake-plant-soil-mix',
      '/root-rot': '/snake-plant-root-rot-guide',
      '/best-pots': '/best-pots-for-snake-plants',
      '/care-guide': '/snake-plant-care-guide',
      '/setup-kits': '/soil-diagnosis'
    };

    if (ALIAS_REDIRECTS[cleanPath]) {
      return res.redirect(301, ALIAS_REDIRECTS[cleanPath]);
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

  const getRouteSchema = (lookupPath: string, title: string, description: string, canonicalUrl: string, isDynamic: any): string => {
    const cleanTitle = title.replace(/"/g, '\\"');
    const cleanDesc = description.replace(/"/g, '\\"');

    if (lookupPath === '/diy-snake-plant-soil-mix') {
      return `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "${canonicalUrl}#article",
      "headline": "${cleanTitle}",
      "description": "${cleanDesc}",
      "url": "${canonicalUrl}",
      "mainEntityOfPage": "${canonicalUrl}"
    },
    {
      "@type": "HowTo",
      "@id": "${canonicalUrl}#howto",
      "name": "How to Make the Perfect Quick-Draining Snake Plant Soil Mix",
      "description": "Combine organic compost with coarse horticultural sand, perlite, and pumice to create the perfect soil environment that keeps snake plant roots aerated.",
      "estimatedCost": {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": "15"
      },
      "supply": [
        { "@type": "HowToSupply", "name": "Organic Compost Base" },
        { "@type": "HowToSupply", "name": "Horticultural Perlite" },
        { "@type": "HowToSupply", "name": "Coarse Washed Silica Sand" },
        { "@type": "HowToSupply", "name": "Premium Volcanic Pumice Rock" }
      ],
      "tool": [
        { "@type": "HowToTool", "name": "Mixing tub or large planting bucket" },
        { "@type": "HowToTool", "name": "Measuring scoop" }
      ],
      "step": [
        {
          "@type": "HowToStep",
          "name": "Define Loam Base",
          "text": "Add premium organic compost/standard soil base (40%) to create a nourishing foundational loam and Nitrogen grip."
        },
        {
          "@type": "HowToStep",
          "name": "Ensure Air Passage Spaces",
          "text": "Incorporate horticultural perlite pebbles (30%) uniformly to secure wide air chamber pockets and prevent compression."
        },
        {
          "@type": "HowToStep",
          "name": "Create Water Channels",
          "text": "Blend coarse-grained washed silica sand (20%) into the mixture to form physical moisture drain tunnels."
        },
        {
          "@type": "HowToStep",
          "name": "Anchor Durable Structure",
          "text": "Mix premium lightweight porous pumice rock (10%) to secure perfect, durable mineral structures."
        }
      ]
    }
  ]
}
</script>`;
    } else if (['/best-snake-plant-soil', '/snake-plant-root-rot-guide', '/best-pots-for-snake-plants', '/snake-plant-care-guide'].includes(lookupPath) || isDynamic) {
      return `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": "${canonicalUrl}#article",
  "headline": "${cleanTitle}",
  "description": "${cleanDesc}",
  "url": "${canonicalUrl}",
  "mainEntityOfPage": "${canonicalUrl}"
}
</script>`;
    } else if (['/about', '/soil-diagnosis', '/care-card'].includes(lookupPath)) {
      return `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "${canonicalUrl}#webpage",
  "name": "${cleanTitle}",
  "description": "${cleanDesc}",
  "url": "${canonicalUrl}"
}
</script>`;
    }
    return '';
  };

  const renderHtmlResponse = (filePath: string, lookupPath: string, statusCode: number, res: express.Response) => {
    try {
      let html = fs.readFileSync(filePath, "utf-8");

      // Default values
      let title = "Snake Plant Soil Guide, Diagnosis & Care | SnakePlantSoil.com";
      let description = "Find the right soil for your snake plant, diagnose drainage problems, make a DIY mix, recover from root rot, and choose the right pot with practical guides and tools.";
      let canonicalUrl = 'https://snakeplantsoil.com/';
      let is404 = statusCode === 404;

      const staticMatch = STATIC_GUIDES.find(s => `/${s.slug}` === lookupPath || `/${s.id}` === lookupPath);
      
      let dynamicMatch = null;
      if (lookupPath.startsWith('/') && lookupPath.length > 1) {
        dynamicMatch = getDynamicArticleMeta(lookupPath.substring(1));
      }

      if (lookupPath === '/' || lookupPath === '/home') {
        title = "Snake Plant Soil Guide, Diagnosis & Care | SnakePlantSoil.com";
        description = "Find the right soil for your snake plant, diagnose drainage problems, make a DIY mix, recover from root rot, and choose the right pot with practical guides and tools.";
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
            title: "Best Soil for Snake Plants: Commercial Mixes & Buyer Guide",
            desc: "Discover the best soil for snake plants. Compare commercial succulent mixes, learn what improves drainage, and choose a mix that helps reduce root rot risk."
          },
          'diy-mix': {
            title: "DIY Snake Plant Soil Mix Recipe (3-2-1 Ratio) | SnakePlantSoil.com",
            desc: "Our signature 3-2-1 gritty recipe. Learn how to mix potting soil, perlite, and coarse sand for the absolute ultimate home mix."
          },
          'root-rot': {
            title: "Snake Plant Root Rot: Symptoms, Treatment & Recovery Guide",
            desc: "Learn how to recognize snake plant root rot, remove badly damaged tissue, repot viable roots or rhizomes, and correct the moisture conditions that caused the problem."
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

        // Inject route-specific JSON-LD schema
        const routeSchema = getRouteSchema(lookupPath, title, description, canonicalUrl, dynamicMatch);
        if (routeSchema) {
          html = html.replace('</head>', `${routeSchema}\n</head>`);
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
        
        let title = "Snake Plant Soil Guide, Diagnosis & Care | SnakePlantSoil.com";
        let description = "Find the right soil for your snake plant, diagnose drainage problems, make a DIY mix, recover from root rot, and choose the right pot with practical guides and tools.";
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
