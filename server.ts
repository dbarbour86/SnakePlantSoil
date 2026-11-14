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
      '/care-card',
      '/radio'
    ]);
    
    STATIC_GUIDES.forEach(guide => {
      routes.add(`/${guide.slug}`);
    });

    if (routeManifest && routeManifest.dynamic) {
      routeManifest.dynamic.forEach(slug => {
        routes.add(`/${slug}`);
      });
    }

    if (routeManifest && routeManifest.episodes) {
      routeManifest.episodes.forEach(slug => {
        routes.add(`/radio/${slug}`);
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
      '/choosing-terracotta-pots': '/best-pots-for-snake-plants',
      '/care-guide': '/snake-plant-care-guide',
      '/setup-kits': '/soil-diagnosis',
      '/radio/the-root-rot-lie': '/radio/why-your-snake-plant-is-dying',
      '/podcast': '/radio',
      '/podcast/': '/radio'
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
      "name": "How to Make the 3-2-1 Snake Plant Soil Mix",
      "description": "Combine 3 parts standard potting soil, 2 parts horticultural perlite, and 1 part coarse sand by volume to create a well-draining potting substrate for indoor snake plants.",
      "estimatedCost": {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": "15"
      },
      "supply": [
        { "@type": "HowToSupply", "name": "Standard Indoor Potting Soil (3 parts / 50%)" },
        { "@type": "HowToSupply", "name": "Horticultural Perlite (2 parts / 33%)" },
        { "@type": "HowToSupply", "name": "Coarse Horticultural Sand (1 part / 17%)" }
      ],
      "tool": [
        { "@type": "HowToTool", "name": "Mixing tub or large bucket" },
        { "@type": "HowToTool", "name": "Measuring scoop, cup, or nursery pot" },
        { "@type": "HowToTool", "name": "Gardening trowel" }
      ],
      "step": [
        {
          "@type": "HowToStep",
          "name": "Measure Dry Components by Volume",
          "text": "Measure 3 parts standard potting soil, 2 parts horticultural perlite, and 1 part coarse sand using any uniform scoop or container."
        },
        {
          "@type": "HowToStep",
          "name": "Blend Thoroughly",
          "text": "Combine all three ingredients in a bucket or shallow tub and blend with a trowel or gloved hands until perlite and sand are uniformly distributed with no clumps."
        },
        {
          "@type": "HowToStep",
          "name": "Perform the Moisture Squeeze Test",
          "text": "Lightly mist a handful of dry mix with water and squeeze into a ball. When you open your hand, the ball should crumble immediately rather than packing into mud."
        }
      ]
    }
  ]
}
</script>`;
    } else if (lookupPath === '/best-snake-plant-soil') {
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
      "@type": "ItemList",
      "@id": "${canonicalUrl}#itemlist",
      "name": "The 3 Best Soils for Snake Plants",
      "description": "Editorial rankings of the top 3 commercial soil mixes for snake plants.",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Bonsai Jack Gritty Mix #111",
          "description": "Best Overall / Best for Fast Drainage"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Hoffman Organic Cactus and Succulent Soil Mix",
          "description": "Best for Beginners"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Espoma Organic Cactus & Succulent Mix",
          "description": "Best Organic Option"
        }
      ]
    }
  ]
}
</script>`;
    } else if (['/snake-plant-root-rot-guide', '/best-pots-for-snake-plants', '/snake-plant-care-guide'].includes(lookupPath) || isDynamic) {
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
    } else if (lookupPath === '/radio') {
      return `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "PodcastSeries",
  "@id": "https://snakeplantsoil.com/radio#series",
  "name": "Snake Plant Radio",
  "url": "https://snakeplantsoil.com/radio",
  "description": "${cleanDesc}",
  "webFeed": "https://anchor.fm/s/118565be4/podcast/rss",
  "inLanguage": "en-US",
  "publisher": {
    "@type": "Organization",
    "name": "SnakePlantSoil.com",
    "url": "https://snakeplantsoil.com/"
  }
}
</script>`;
    } else if (lookupPath.startsWith('/radio/')) {
      return `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "PodcastEpisode",
      "@id": "${canonicalUrl}#episode",
      "name": "${cleanTitle}",
      "description": "${cleanDesc}",
      "url": "${canonicalUrl}",
      "partOfSeries": {
        "@type": "PodcastSeries",
        "name": "Snake Plant Radio",
        "url": "https://snakeplantsoil.com/radio",
        "webFeed": "https://anchor.fm/s/118565be4/podcast/rss"
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "${canonicalUrl}#breadcrumbs",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://snakeplantsoil.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Radio",
          "item": "https://snakeplantsoil.com/radio"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "${cleanTitle}",
          "item": "${canonicalUrl}"
        }
      ]
    }
  ]
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
      if (lookupPath.startsWith('/') && lookupPath.length > 1 && !lookupPath.startsWith('/radio/')) {
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
      } else if (lookupPath === '/radio') {
        title = "Snake Plant Radio | Soil Science, Drainage & Care Podcast";
        description = "Listen to Snake Plant Radio for discussions on soil drainage, potting mixes, root rot recovery, and practical plant care.";
        canonicalUrl = 'https://snakeplantsoil.com/radio';
      } else if (lookupPath.startsWith('/radio/')) {
        const epSlug = lookupPath.replace('/radio/', '');
        const epMeta = (routeManifest?.metadata as any)?.[`radio/${epSlug}`] || null;
        title = epMeta?.title || "Episode | Snake Plant Radio";
        description = epMeta?.description || "Snake Plant Radio audio guide.";
        canonicalUrl = `https://snakeplantsoil.com/radio/${epSlug}`;
      } else if (lookupPath === '/about') {
        title = "About SnakePlantSoil.com | Practical Plant Care & Disclosures";
        description = "Learn why SnakePlantSoil.com was created, our practical approach to snake plant care, and our affiliate transparency disclosures.";
        canonicalUrl = 'https://snakeplantsoil.com/about';
      } else if (lookupPath === '/faq') {
        title = "Snake Plant Potting & Care FAQs | SnakePlantSoil.com";
        description = "Practical answers to common snake plant questions about watering frequency, soil amendments, pot sizes, and rot prevention.";
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
            title: "DIY Snake Plant Soil Mix: The 3-2-1 Recipe & Ratio Guide",
            desc: "Make DIY snake plant soil with a simple 3-2-1 mix: 3 parts potting soil, 2 parts perlite, and 1 part coarse sand. Includes measurements and mixing tips."
          },
          'root-rot': {
            title: "Snake Plant Root Rot: Symptoms, Recovery Steps & Treatment",
            desc: "Identify snake plant root rot early. Learn the key symptoms—mushy roots, foul odor, and yellow leaves—plus a 5-step recovery guide to save your plant."
          },
          'best-pots': {
            title: "Best Pots for Snake Plants: Size, Material & Drainage Guide",
            desc: "Discover the best pots for snake plants. Compare terracotta, ceramic, and plastic containers, choose an appropriate pot size, and learn practical drainage rules."
          },
          'care-guide': {
            title: "Snake Plant Care Guide: Watering, Light, Soil & Indoor Care",
            desc: "Learn how to care for a snake plant indoors, including watering, light, soil, pots, seasonal care, fertilizer, and common signs of plant stress."
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
  if (process.env.NODE_ENV?.trim() === "production") {
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
      if (lookupPath === '/choosing-terracotta-pots') {
        return res.redirect(301, '/best-pots-for-snake-plants');
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
  if (process.env.NODE_ENV?.trim() !== "production") {
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
      if (lookupPath === '/choosing-terracotta-pots') {
        return res.redirect(301, '/best-pots-for-snake-plants');
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
          title = "About SnakePlantSoil.com | Practical Plant Care & Disclosures";
          description = "Learn why SnakePlantSoil.com was created, our practical approach to snake plant care, and our affiliate transparency disclosures.";
          canonicalUrl = 'https://snakeplantsoil.com/about';
        } else if (lookupPath === '/faq') {
          title = "Snake Plant Potting & Care FAQs | SnakePlantSoil.com";
          description = "Practical answers to common snake plant questions about watering frequency, soil amendments, pot sizes, and rot prevention.";
          canonicalUrl = 'https://snakeplantsoil.com/faq';
        } else if (lookupPath === '/care-card') {
          title = "Free Printable Snake Plant Care Card Generator | SnakePlantSoil.com";
          description = "Generate a custom PDF care card with your snake plant's name, optimal watering frequency, and sunlight requirements.";
          canonicalUrl = 'https://snakeplantsoil.com/care-card';
        } else if (lookupPath === '/radio') {
          title = "Snake Plant Radio | Soil Science, Drainage & Care Podcast";
          description = "Listen to Snake Plant Radio for discussions on soil drainage, potting mixes, root rot recovery, and practical plant care.";
          canonicalUrl = 'https://snakeplantsoil.com/radio';
        } else if (lookupPath.startsWith('/radio/')) {
          const epSlug = lookupPath.replace('/radio/', '');
          const epMeta = (routeManifest?.metadata as any)?.[`radio/${epSlug}`] || null;
          title = epMeta?.title || "Episode | Snake Plant Radio";
          description = epMeta?.description || "Snake Plant Radio audio guide.";
          canonicalUrl = `https://snakeplantsoil.com/radio/${epSlug}`;
        } else if (staticMatch) {
          const staticMetaMap: Record<string, { title: string; desc: string }> = {
            'best-soil': {
              title: "The 3 Best Soils for Snake Plants | SnakePlantSoil.com",
              desc: "Editorial guide comparing the 3 best commercial soil mixes for snake plants, ranked by drainage speed, aeration, and root rot prevention."
            },
            'diy-mix': {
              title: "DIY Snake Plant Soil Mix: The 3-2-1 Recipe & Ratio Guide",
              desc: "Make DIY snake plant soil with a simple 3-2-1 mix: 3 parts potting soil, 2 parts perlite, and 1 part coarse sand. Includes measurements and mixing tips."
            },
            'root-rot': {
              title: "Snake Plant Root Rot: Symptoms, Recovery Steps & Treatment",
              desc: "Identify snake plant root rot early. Learn the key symptoms—mushy roots, foul odor, and yellow leaves—plus a 5-step recovery guide to save your plant."
            },
            'best-pots': {
              title: "Best Pots for Snake Plants: Size, Material & Drainage Guide",
              desc: "Discover the best pots for snake plants. Compare terracotta, ceramic, and plastic containers, choose an appropriate pot size, and learn practical drainage rules."
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
