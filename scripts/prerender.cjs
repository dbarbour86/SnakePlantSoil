const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

const PORT = '3002';
const chromePath = '"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"';
const manifestPath = path.join(__dirname, '..', 'src', 'generated-manifest.json');
const distPath = path.join(__dirname, '..', 'dist');
const chromeProfileDir = '"C:\\Users\\derek\\.gemini\\antigravity\\chrome-profile"';

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
  '/care-card'
];

if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  if (manifest.dynamic) {
    manifest.dynamic.forEach(slug => {
      routesToPrerender.push(`/${slug}`);
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

serverProcess.stdout.on('data', (data) => {
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

// 3. Wait for the server to spin up, then pre-render pages
setTimeout(() => {
  console.log("Warming up Chrome cache...");
  try {
    execSync(`${chromePath} --headless --disable-gpu --user-data-dir=${chromeProfileDir} --dump-dom http://localhost:${PORT}/`, {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore']
    });
  } catch (e) {
    // Ignore warm-up errors
  }

  console.log(`Prerendering ${routesToPrerender.length} routes with retry validation...`);

  try {
    for (const route of routesToPrerender) {
      console.log(`Prerendering: ${route}`);
      
      const url = `http://localhost:${PORT}${route}`;
      let html = '';
      const maxRetries = 4;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          html = execSync(`${chromePath} --headless --disable-gpu --user-data-dir=${chromeProfileDir} --dump-dom ${url}`, { 
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
        }
        // Sleep 1.5 seconds before retrying
        execSync('powershell -Command "Start-Sleep -Milliseconds 1500"');
      }

      if (!html.includes('id="root-container"') && route !== '/404-page-trigger') {
        cleanupAndExit(1, `Failed to render route ${route} with hydrated React DOM after ${maxRetries} attempts.`);
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
}, 2500);
