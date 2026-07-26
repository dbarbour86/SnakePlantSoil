const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

const PORT = '3001';
const manifestPath = path.join(__dirname, '..', 'src', 'generated-manifest.json');
const chromePath = '"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"';

console.log("Starting automated production smoke test...");

// 1. Load routes from manifest
if (!fs.existsSync(manifestPath)) {
  console.error("Error: Route manifest generated-manifest.json is missing. Please run build first.");
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
const routesToTest = [
  '/',
  '/setup-kits',
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

// Wait for server to bind
setTimeout(() => {
  console.log(`Testing ${routesToTest.length} routes...`);

  try {
    for (const route of routesToTest) {
      console.log(`Verifying route: ${route}`);
      
      // Execute Chrome headlessly to fetch and execute JS
      const url = `http://localhost:${PORT}${route}`;
      let dom = '';
      try {
        dom = execSync(`${chromePath} --headless --disable-gpu --dump-dom ${url}`, { 
          encoding: 'utf-8', 
          stdio: ['ignore', 'pipe', 'ignore'] 
        });
      } catch (err) {
        cleanupAndExit(1, `Failed to load page ${route} using headless Chrome. Chrome path or execution failed.`);
      }

      // Assertions:
      // 1. Document should mount React successfully (#root-container)
      if (!dom.includes('id="root-container"')) {
        cleanupAndExit(1, `Page ${route} failed to mount React. DOM was blank or did not contain #root-container.`);
      }

      // 2. Document must contain key branding components
      if (!dom.includes('SnakePlantSoil')) {
        cleanupAndExit(1, `Page ${route} is missing website branding text "SnakePlantSoil".`);
      }

      // 3. Document must render header navigation links
      if (!dom.includes('id="nav-link-setup-kits"')) {
        cleanupAndExit(1, `Page ${route} is missing key navigation element #nav-link-setup-kits.`);
      }

      console.log(`  -> Route ${route} verified successfully!`);
    }

    cleanupAndExit(0, "All production routes rendered visibly with no uncaught JS errors!");

  } catch (e) {
    cleanupAndExit(1, `An unexpected error occurred during test execution: ${e.message}`);
  }
}, 3000);
