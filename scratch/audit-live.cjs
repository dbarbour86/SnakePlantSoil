const https = require('https');

const urls = [
  'https://snakeplantsoil.com/',
  'https://snakeplantsoil.com/soil-diagnosis',
  'https://snakeplantsoil.com/about',
  'https://snakeplantsoil.com/faq',
  'https://snakeplantsoil.com/care-card',
  'https://snakeplantsoil.com/best-snake-plant-soil',
  'https://snakeplantsoil.com/diy-snake-plant-soil-mix',
  'https://snakeplantsoil.com/snake-plant-root-rot-guide',
  'https://snakeplantsoil.com/best-pots-for-snake-plants',
  'https://snakeplantsoil.com/snake-plant-care-guide',
  'https://snakeplantsoil.com/best-fertilizer-for-snake-plant-soil',
  'https://snakeplantsoil.com/winter-watering-guide',
  'https://snakeplantsoil.com/best-soil',
  'https://snakeplantsoil.com/diy-mix',
  'https://snakeplantsoil.com/root-rot',
  'https://snakeplantsoil.com/best-pots',
  'https://snakeplantsoil.com/care-guide',
  'https://snakeplantsoil.com/setup-kits',
  'https://snakeplantsoil.com/choosing-terracotta-pots',
  'https://snakeplantsoil.com/robots.txt',
  'https://snakeplantsoil.com/sitemap.xml'
];

const checkUrl = (url) => new Promise((resolve) => {
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      resolve({ url, status: res.statusCode, location: res.headers.location || null, html: data });
    });
  }).on('error', (e) => resolve({ url, status: 'ERROR', error: e.message }));
});

async function run() {
  const results = await Promise.all(urls.map(checkUrl));
  for (const r of results) {
    console.log(`\n=== [${r.status}] ${r.url} ${r.location ? '-> ' + r.location : ''} ===`);
    if (r.status === 200 && r.html && !r.url.endsWith('.txt') && !r.url.endsWith('.xml')) {
      const titleMatch = r.html.match(/<title>(.*?)<\/title>/);
      const h1Match = r.html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
      const canonicalMatch = r.html.match(/<link rel="canonical" href="([^"]*)"/);
      const descMatch = r.html.match(/<meta name="description" content="([^"]*)"/);
      const schemaMatch = r.html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);

      console.log('  Title:', titleMatch ? titleMatch[1] : 'MISSING');
      console.log('  H1:', h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : 'NONE');
      console.log('  Description:', descMatch ? descMatch[1] : 'MISSING');
      console.log('  Canonical:', canonicalMatch ? canonicalMatch[1] : 'MISSING');
      if (schemaMatch) {
        try {
          const json = JSON.parse(schemaMatch[1]);
          console.log('  Schema @type:', json['@type'] || (json['@graph'] ? json['@graph'].map(g => g['@type']) : 'Unknown'));
        } catch (e) {
          console.log('  Schema raw present');
        }
      } else {
        console.log('  Schema: NONE');
      }
    }
  }
}

run();
