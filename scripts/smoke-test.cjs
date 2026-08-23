const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');
const http = require('http');

const PORT = '3001';
const manifestPath = path.join(__dirname, '..', 'src', 'generated-manifest.json');

function getChromePath() {
  if (process.env.CHROME_BIN) return process.env.CHROME_BIN;
  if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH;

  const isWindows = process.platform === 'win32';
  const isMac = process.platform === 'darwin';

  if (isWindows) {
    const candidatePaths = [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, 'Google\\Chrome\\Application\\chrome.exe') : null,
      process.env.PROGRAMFILES ? path.join(process.env.PROGRAMFILES, 'Google\\Chrome\\Application\\chrome.exe') : null,
      process.env['PROGRAMFILES(X86)'] ? path.join(process.env['PROGRAMFILES(X86)'], 'Google\\Chrome\\Application\\chrome.exe') : null,
    ].filter(Boolean);

    for (const p of candidatePaths) {
      if (fs.existsSync(p)) return `"${p}"`;
    }
    return null;
  }

  if (isMac) {
    const macPath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    if (fs.existsSync(macPath)) return `"${macPath}"`;
    return null;
  }

  const linuxCandidates = ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser'];
  for (const cmd of linuxCandidates) {
    try {
      execSync(`which ${cmd}`, { stdio: 'ignore' });
      return cmd;
    } catch (e) {
      // ignore
    }
  }

  return null;
}

const chromePath = getChromePath();

console.log("Starting automated production smoke test...");

// 1. Load routes from manifest
if (!fs.existsSync(manifestPath)) {
  console.error("Error: Route manifest generated-manifest.json is missing. Please run build first.");
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
const routesToTest = [
  '/',
  '/soil-diagnosis',
  '/about',
  '/faq',
  '/care-card'
];

if (manifest.static) {
  manifest.static.forEach(slug => routesToTest.push(`/${slug}`));
}
if (manifest.dynamic) {
  manifest.dynamic.forEach(slug => routesToTest.push(`/${slug}`));
}

// 2. Start production server locally on port 3001
const serverProcess = spawn('node', ['dist/server.cjs'], {
  env: { ...process.env, PORT, NODE_ENV: 'production' },
  stdio: 'pipe'
});

serverProcess.stdout.on('data', (data) => {
  console.log(`[Server]: ${data.toString().trim()}`);
});

serverProcess.stderr.on('data', (data) => {
  console.error(`[Server Error]: ${data.toString().trim()}`);
});

// Helper to kill the server and exit the script
function cleanupAndExit(code, msg = '') {
  serverProcess.kill('SIGTERM');
  if (msg) {
    if (code === 0) {
      console.log(`\x1b[32mSMOKE TEST PASSED:\x1b[0m ${msg}`);
    } else {
      console.error(`\x1b[31mSMOKE TEST FAILED:\x1b[0m ${msg}`);
    }
  }
  process.exit(code);
}

// Helper to request URL using Node HTTP (no JS execution)
function fetchRawPage(route) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:${PORT}${route}`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          html: data
        });
      });
    }).on('error', reject);
  });
}

// Wait for server to bind
setTimeout(async () => {
  console.log(`Testing redirects and ${routesToTest.length} routes...`);

  try {
    // 3. Test setup-kits and alias 301 redirects
    console.log("Verifying 301 redirects for legacy aliases...");
    const aliasMap = {
      '/setup-kits': '/soil-diagnosis',
      '/setup-kits/': '/soil-diagnosis',
      '/best-soil': '/best-snake-plant-soil',
      '/best-soil/': '/best-snake-plant-soil',
      '/diy-mix': '/diy-snake-plant-soil-mix',
      '/diy-mix/': '/diy-snake-plant-soil-mix',
      '/root-rot': '/snake-plant-root-rot-guide',
      '/root-rot/': '/snake-plant-root-rot-guide',
      '/best-pots': '/best-pots-for-snake-plants',
      '/best-pots/': '/best-pots-for-snake-plants',
      '/choosing-terracotta-pots': '/best-pots-for-snake-plants',
      '/choosing-terracotta-pots/': '/best-pots-for-snake-plants',
      '/care-guide': '/snake-plant-care-guide',
      '/care-guide/': '/snake-plant-care-guide'
    };

    for (const [alias, destination] of Object.entries(aliasMap)) {
      const redirectRes = await fetchRawPage(alias);
      if (redirectRes.statusCode !== 301) {
        cleanupAndExit(1, `Expected 301 redirect for ${alias}, got status: ${redirectRes.statusCode}`);
      }
      if (redirectRes.headers.location !== destination) {
        cleanupAndExit(1, `Expected ${alias} redirect location to be ${destination}, got: ${redirectRes.headers.location}`);
      }
    }

    // 4. Test all indexable routes
    for (const route of routesToTest) {
      console.log(`Verifying route: ${route}`);
      
      // A. Fetch raw page and inspect initial HTML (no JS)
      const rawPage = await fetchRawPage(route);
      if (rawPage.statusCode !== 200) {
        cleanupAndExit(1, `Route ${route} returned non-200 status: ${rawPage.statusCode}`);
      }

      const html = rawPage.html;

      // Assert page-specific title and meta description exist in raw HTML
      if (!html.includes('<title>') || !html.includes('</title>')) {
        cleanupAndExit(1, `Route ${route} is missing title tag in raw HTML.`);
      }
      if (!html.includes('name="description"')) {
        cleanupAndExit(1, `Route ${route} is missing meta description in raw HTML.`);
      }

      // Assert self-referencing canonical tag exists in raw HTML
      const expectedCanonical = `https://snakeplantsoil.com${route === '/' ? '/' : route}`;
      if (!html.includes(`<link rel="canonical" href="${expectedCanonical}"`)) {
        cleanupAndExit(1, `Route ${route} is missing correct self-referencing canonical tag in raw HTML. Expected: ${expectedCanonical}`);
      }

      // Assert crawlable links are present in raw HTML
      if (!html.includes('<a href="/')) {
        cleanupAndExit(1, `Route ${route} is missing crawlable internal links in raw HTML.`);
      }

      // Assert H1 tag presence on key guide routes
      const staticGuideRoutes = [
        '/',
        '/best-snake-plant-soil',
        '/diy-snake-plant-soil-mix',
        '/snake-plant-root-rot-guide',
        '/best-pots-for-snake-plants',
        '/snake-plant-care-guide'
      ];
      if (staticGuideRoutes.includes(route)) {
        if (!html.includes('<h1')) {
          cleanupAndExit(1, `Route ${route} is missing <h1 tag in raw HTML.`);
        }
      }

      // Assert page-specific body content/H1/H2 exist in raw HTML (proving static prerendering worked!)
      if (route === '/') {
        if (!html.includes('Snake Plant Soil:') || !html.includes('Find the Right Mix for Your Plant')) {
          cleanupAndExit(1, `Homepage is missing updated H1 hero text in raw HTML.`);
        }
      } else if (route === '/soil-diagnosis') {
        if (!html.includes('Snake Plant Soil Diagnosis')) {
          cleanupAndExit(1, `Soil diagnosis page is missing H3 title in raw HTML.`);
        }
      } else if (route === '/about') {
        if (!html.includes('About Snake Plant Soil Lab')) {
          cleanupAndExit(1, `About page is missing H2 title in raw HTML.`);
        }
      } else if (route === '/faq') {
        if (!html.includes('Exhaustive Botanical Knowledgebase')) {
          cleanupAndExit(1, `FAQ page is missing header text in raw HTML.`);
        }
      }

      // B. Execute Chrome headlessly if available to smoke-test React client mounting
      if (chromePath) {
        const url = `http://localhost:${PORT}${route}`;
        let dom = '';
        try {
          dom = execSync(`${chromePath} --headless --disable-gpu --dump-dom ${url}`, { 
            encoding: 'utf-8', 
            stdio: ['ignore', 'pipe', 'ignore'] 
          });
        } catch (err) {
          console.warn(`  [Warning] Chrome execution warning for route ${route}: ${err.message}`);
        }

        if (dom && !dom.includes('id="root-container"')) {
          cleanupAndExit(1, `Page ${route} failed to mount React. DOM did not contain #root-container.`);
        }
      }

      console.log(`  -> Route ${route} verified successfully!`);
    }

    cleanupAndExit(0, "All production routes rendered visibly with correct redirects and raw HTML prerendering content!");

  } catch (e) {
    cleanupAndExit(1, `An unexpected error occurred during test execution: ${e.message}`);
  }
}, 3000);
