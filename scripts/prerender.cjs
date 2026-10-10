const fs = require('fs');
const path = require('path');
const os = require('os');
const http = require('http');
const { spawn, execSync } = require('child_process');

const PORT = '3002';
const manifestPath = path.join(__dirname, '..', 'src', 'generated-manifest.json');
const distPath = path.join(__dirname, '..', 'dist');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

function fetchRawHtml(route) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:${PORT}${route}`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => { resolve(data); });
    }).on('error', reject);
  });
}

async function main() {
  console.log("Starting static page prerendering script...");

  // 1. Gather all routes to pre-render
  const routesToPrerender = [
    '/',
    '/soil-diagnosis',
    '/best-snake-plant-soil',
    '/diy-snake-plant-soil-mix',
    '/snake-plant-root-rot-guide',
    '/best-pots-for-snake-plants',
    '/snake-plant-care-guide',
    '/faq',
    '/about',
    '/care-card',
    '/radio'
  ];

  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    if (manifest.dynamic) {
      manifest.dynamic.forEach(slug => {
        routesToPrerender.push(`/${slug}`);
      });
    }
    if (manifest.episodes) {
      manifest.episodes.forEach(slug => {
        routesToPrerender.push(`/radio/${slug}`);
      });
    }
  }

  // Add an invalid path to generate the static 404 page
  routesToPrerender.push('/404-page-trigger');

  // 2. Start the compiled production server on port 3002
  const serverProcess = spawn('node', ['dist/server.cjs'], {
    env: { ...process.env, PORT, NODE_ENV: 'production' },
    stdio: 'pipe'
  });

  serverProcess.stdout.on('data', () => {
    // Silent logs during pre-render to keep output clean
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`[Server Error]: ${data.toString().trim()}`);
  });

  function cleanupAndExit(code, msg = '') {
    serverProcess.kill('SIGTERM');
    if (msg) {
      if (code === 0) {
        console.log(`\x1b[32mPRERENDER SUCCESS:\x1b[0m ${msg}`);
      } else {
        console.error(`\x1b[31mPRERENDER FAILED:\x1b[0m ${msg}`);
      }
    }
    process.exit(code);
  }

  // 3. Wait for the server to spin up (using Node delay)
  await delay(2500);

  const chromePath = getChromePath();
  const tmpProfileDir = path.join(os.tmpdir(), 'chrome-prerender-profile');

  if (chromePath) {
    console.log(`Chrome binary detected for prerendering: ${chromePath}`);
    try {
      execSync(`${chromePath} --headless --disable-gpu --user-data-dir="${tmpProfileDir}" --dump-dom http://localhost:${PORT}/`, {
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'ignore']
      });
    } catch (e) {
      // Ignore warm-up errors
    }
  } else {
    console.log("No local Chrome binary detected; using Express server HTML prerendering fallback.");
  }

  console.log(`Prerendering ${routesToPrerender.length} routes with retry validation...`);

  try {
    for (const route of routesToPrerender) {
      console.log(`Prerendering: ${route}`);
      
      const url = `http://localhost:${PORT}${route}`;
      let html = '';
      const maxRetries = 4;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        if (chromePath) {
          try {
            html = execSync(`${chromePath} --headless --disable-gpu --user-data-dir="${tmpProfileDir}" --dump-dom ${url}`, { 
              encoding: 'utf-8', 
              stdio: ['ignore', 'pipe', 'ignore'] 
            });
            
            // Verify if React has mounted successfully
            if (html.includes('id="root-container"') || route === '/404-page-trigger') {
              break; 
            }
            console.log(`  [Attempt ${attempt}/${maxRetries}] React not mounted yet, waiting and retrying...`);
          } catch (err) {
            console.warn(`  [Attempt ${attempt}/${maxRetries}] Chrome execution warning: ${err.message}`);
            html = await fetchRawHtml(route);
            if (html.includes('id="root-container"') || route === '/404-page-trigger') {
              break;
            }
          }
        } else {
          // Direct Express SSR fallback (works on any Linux environment without Chrome)
          html = await fetchRawHtml(route);
          if (html.length > 0) {
            break;
          }
        }

        // Native Node Promise delay replacement for PowerShell Start-Sleep
        await delay(1500);
      }

      if (!html || (!html.includes('<html') && route !== '/404-page-trigger')) {
        cleanupAndExit(1, `Failed to render route ${route} after ${maxRetries} attempts.`);
      }

      // Determine correct output file path
      let outputFilePath = '';
      if (route === '/') {
        outputFilePath = path.join(distPath, 'index.html');
      } else if (route === '/404-page-trigger') {
        outputFilePath = path.join(distPath, '404.html');
      } else {
        const cleanRoute = route.replace(/^\//, '');
        const targetDir = path.join(distPath, cleanRoute);
        
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        outputFilePath = path.join(targetDir, 'index.html');
      }

      // Write static pre-rendered HTML to target file
      fs.writeFileSync(outputFilePath, html, 'utf-8');
    }

    cleanupAndExit(0, "All pages pre-rendered successfully!");
  } catch (err) {
    cleanupAndExit(1, `Exception caught during prerender: ${err.message}`);
  }
}

main();
