// Local website check: finds businesses in a town that list a website on
// OpenStreetMap, then tests each site with Google PageSpeed Insights (mobile).
//
// Usage (from the realedlopez folder):
//   node scripts/site-audit.mjs "Peekskill" --key YOUR_PAGESPEED_API_KEY
//   node scripts/site-audit.mjs "Peekskill" "Cortlandt" "Yorktown" --name northern-westchester --key YOUR_KEY
// A free PageSpeed API key is needed; without one Google rate-limits the tests.
//
// Output, in research/ (kept out of git, because it names businesses):
//   <town>-raw.csv       one row per site, for your own reference
//   <town>-summary.json  totals only; this is what the website article uses
//
// You can add extra sites, one URL per line, in research/<town>-extra.txt

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const flagVal = (f) => { const i = args.indexOf(f); return i > -1 ? args[i + 1] : undefined; };
const towns = [];
const VALUE_FLAGS = new Set(['--key', '--name']);
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--')) { if (VALUE_FLAGS.has(args[i])) i++; continue; }
  towns.push(args[i]);
}
if (!towns.length && !args.includes('--retest')) {
  console.error('Give at least one town, for example:  node scripts/site-audit.mjs "Peekskill" --key YOUR_KEY');
  process.exit(1);
}
const town = towns.join(', ');
const API_KEY = flagVal('--key') || process.env.PSI_KEY || '';
const slug = (flagVal('--name') || towns.join('-')).toLowerCase().replace(/[^a-z0-9]+/g, '-');
const OUT = path.join(process.cwd(), 'research');
fs.mkdirSync(OUT, { recursive: true });

const UA = 'Mozilla/5.0 (compatible; realedlopez-site-audit/1.0; +https://realedlopez.com)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const THIS_YEAR = new Date().getFullYear();

// Not small businesses, so they are left out.
const SKIP_AMENITY = new Set([
  'school', 'kindergarten', 'college', 'university', 'place_of_worship', 'townhall', 'library', 'police',
  'fire_station', 'post_office', 'parking', 'courthouse', 'prison', 'social_facility', 'community_centre',
  'bus_station', 'ferry_terminal', 'grave_yard', 'public_building',
]);
const SKIP_OFFICE = new Set(['government', 'political_party', 'diplomatic', 'research']);
const SKIP_LEISURE = new Set(['park', 'nature_reserve', 'golf_course', 'garden', 'playground', 'pitch', 'common', 'dog_park', 'beach_resort', 'slipway']);
const SKIP_TOURISM = new Set(['attraction', 'viewpoint', 'picnic_site', 'camp_site', 'information', 'artwork']);
const SKIP_AMENITY_EXTRA = new Set(['hospital', 'cinema', 'fuel']);
// Places across the Hudson that fall inside the map boxes
const OUTSIDE = /haverstraw|stony point|tomkins cove|garrison|cold spring|nyack/i;

function category(t) {
  if (['restaurant', 'cafe', 'bar', 'pub', 'fast_food', 'ice_cream', 'biergarten'].includes(t.amenity)) return 'Food and drink';
  if (t.shop) return 'Shops';
  if (t.healthcare || ['dentist', 'doctors', 'clinic', 'pharmacy', 'veterinary'].includes(t.amenity)) return 'Health';
  if (t.tourism || t.leisure || ['theatre', 'arts_centre', 'cinema', 'nightclub'].includes(t.amenity)) return 'Arts, leisure, and lodging';
  return 'Services';
}

function normalize(u) {
  try {
    const url = new URL(/^https?:\/\//i.test(u) ? u : `http://${u}`);
    return url.origin + (url.pathname === '/' ? '/' : url.pathname);
  } catch {
    return null;
  }
}

// Finds the town's map boundaries (a box) using OpenStreetMap's place search.
async function townBox(name) {
  const q = /,/.test(name) ? name : `${name}, Westchester County, NY`;
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=us&q=${encodeURIComponent(q)}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
  if (!res.ok) throw new Error(`Could not look up ${name} (place search answered ${res.status}).`);
  const [hit] = await res.json();
  if (!hit) throw new Error(`Could not find "${name}". Try adding the state, like "${name}, NY".`);
  const [south, north, west, east] = hit.boundingbox.map(Number);
  console.log(`     Using the map area for: ${hit.display_name}`);
  return { south, west, north, east };
}

async function overpass() {
  const parts = [];
  for (const name of towns) {
    const { south, west, north, east } = await townBox(name);
    const bbox = `${south},${west},${north},${east}`;
    parts.push(`nwr["website"](${bbox}); nwr["contact:website"](${bbox});`);
    await sleep(1100); // place search allows about one request per second
  }
  const q = `[out:json][timeout:120];
(${parts.join(' ')});
out tags center;`;
  const hosts = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.private.coffee/api/interpreter',
    'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
  ];
  const headers = { 'User-Agent': UA, Accept: 'application/json, */*' };
  for (let round = 1; round <= 2; round++) {
    for (const host of hosts) {
      for (const method of ['GET', 'POST']) {
        const name = new URL(host).hostname;
        try {
          const res =
            method === 'GET'
              ? await fetch(`${host}?data=${encodeURIComponent(q)}`, { headers })
              : await fetch(host, { method: 'POST', body: new URLSearchParams({ data: q }), headers });
          if (res.ok) {
            const json = await res.json();
            if (Array.isArray(json.elements) && json.elements.length) {
              console.log(`     ${name} returned ${json.elements.length} places with websites.`);
              return json.elements;
            }
            console.warn(`  ${name} (${method}) returned no places, trying another...`);
          } else {
            console.warn(`  ${name} (${method}) answered ${res.status}, trying another...`);
          }
        } catch (e) {
          console.warn(`  Could not reach ${name}: ${e.message}`);
        }
      }
    }
    if (round === 1) {
      console.warn('  No server returned results. Waiting 30 seconds, then trying once more...');
      await sleep(30000);
    }
  }
  throw new Error('OpenStreetMap servers are busy right now. Wait a few minutes and run the script again.');
}

async function homepage(url) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 20000);
  try {
    const res = await fetch(url, { redirect: 'follow', signal: ctl.signal, headers: { 'User-Agent': UA } });
    const html = (await res.text()).slice(0, 2_000_000);
    const years = [...html.matchAll(/(?:©|&copy;|&#169;|copyright)\s*(?:\d{4}\s*(?:-|–|&ndash;)\s*)?(\d{4})/gi)].map((m) => +m[1]).filter((y) => y > 1995 && y <= THIS_YEAR);
    return {
      ok: res.ok,
      status: res.status,
      finalUrl: res.url,
      https: res.url.startsWith('https://'),
      viewport: /<meta[^>]+name=["']?viewport/i.test(html),
      copyrightYear: years.length ? Math.max(...years) : null,
      builder: /wix\.com|wixstatic/i.test(html) ? 'Wix' : /squarespace/i.test(html) ? 'Squarespace' : /wp-content|wordpress/i.test(html) ? 'WordPress' : /godaddy|wsimg\.com/i.test(html) ? 'GoDaddy' : /shopify/i.test(html) ? 'Shopify' : /weebly/i.test(html) ? 'Weebly' : 'Other or custom',
    };
  } catch (e) {
    return { ok: false, status: 0, error: e.name === 'AbortError' ? 'timeout' : e.message };
  } finally {
    clearTimeout(timer);
  }
}

async function pagespeed(url) {
  const api = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
  api.searchParams.set('url', url);
  api.searchParams.set('strategy', 'mobile');
  api.searchParams.set('category', 'performance');
  if (API_KEY) api.searchParams.set('key', API_KEY);
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(api, { headers: { 'User-Agent': UA } });
      if (res.status === 429) {
        await sleep(15000 * (attempt + 1));
        continue;
      }
      const j = await res.json();
      if (!res.ok) return { error: j?.error?.message?.slice(0, 300) || `HTTP ${res.status}` };
      const a = j.lighthouseResult.audits;
      return {
        score: Math.round(j.lighthouseResult.categories.performance.score * 100),
        lcp: a['largest-contentful-paint'].numericValue / 1000,
        cls: a['cumulative-layout-shift'].numericValue,
        tbt: a['total-blocking-time'].numericValue,
      };
    } catch (e) {
      if (attempt === 3) return { error: e.message };
      await sleep(5000);
    }
  }
  return { error: 'rate limited (add a free API key with --key)' };
}

const median = (xs) => {
  const s = xs.filter((x) => x != null && !Number.isNaN(x)).sort((a, b) => a - b);
  if (!s.length) return null;
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const pct = (n, d) => (d ? Math.round((n / d) * 100) : null);

function readCsv(file) {
  const [head, ...lines] = fs.readFileSync(file, 'utf8').split('\n');
  const cols = head.split(',');
  return lines.filter(Boolean).map((line) => {
    const vals = JSON.parse('[' + line + ']');
    const row = Object.fromEntries(cols.map((c, i) => [c, vals[i]]));
    for (const k of ['score', 'lcp', 'cls', 'tbt', 'status', 'copyrightYear']) row[k] = row[k] === '' ? null : Number(row[k]);
    for (const k of ['https', 'viewport']) row[k] = row[k] === true || row[k] === 'true';
    row.ok = row.status >= 200 && row.status < 400;
    return row;
  });
}

async function retest() {
  const file = path.join(OUT, `${slug}-raw.csv`);
  if (!fs.existsSync(file)) throw new Error(`No earlier results found at ${file}. Run without --retest first.`);
  const rows = readCsv(file);
  const todo = rows.filter((r) => r.score == null && r.status !== 0 && r.status !== 404 && r.status !== 410);
  console.log(`\nRetesting ${todo.length} sites that were skipped last time...`);
  let n = 0;
  for (const r of todo) {
    const psi = await pagespeed(r.finalUrl || r.url);
    Object.assign(r, { score: null, lcp: null, cls: null, tbt: null, error: '' }, psi);
    console.log(`     [${++n}/${todo.length}] ${r.name}: ${psi.score != null ? 'score ' + psi.score : psi.error}`);
  }
  writeOutputs(rows);
}

async function main() {
  if (args.includes('--retest')) {
    if (!API_KEY) { console.log('Add your key:  --key YOUR_KEY'); process.exit(1); }
    return retest();
  }
  console.log(`\n1/3  Finding businesses with websites on OpenStreetMap in: ${town}...`);
  const elements = await overpass();
  const seen = new Map();
  for (const el of elements) {
    const t = el.tags || {};
    if (t['brand:wikidata'] || t.brand) continue; // national chains
    if (SKIP_AMENITY.has(t.amenity) || SKIP_AMENITY_EXTRA.has(t.amenity) || SKIP_OFFICE.has(t.office)) continue;
    if (SKIP_LEISURE.has(t.leisure) || SKIP_TOURISM.has(t.tourism) || t.boundary || t.historic) continue;
    if (OUTSIDE.test(`${t['addr:city'] || ''} ${t.name || ''}`)) continue;
    if (t.operator && /state|county|town of|city of|village of|national park|department/i.test(t.operator)) continue;
    if (!(t.shop || t.amenity || t.office || t.craft || t.healthcare || t.tourism || t.leisure)) continue;
    const url = normalize(t.website || t['contact:website']);
    if (!url || /facebook\.com|instagram\.com|yelp\.com|google\.com/i.test(url)) continue;
    const host = new URL(url).hostname.replace(/^www\./, '');
    if (!seen.has(host)) seen.set(host, { name: t.name || host, url, category: category(t) });
  }
  const extraFile = path.join(OUT, `${slug}-extra.txt`);
  if (fs.existsSync(extraFile)) {
    for (const line of fs.readFileSync(extraFile, 'utf8').split(/\r?\n/)) {
      const [rawUrl, cat] = line.split(',').map((x) => x && x.trim());
      if (!rawUrl || rawUrl.startsWith('#')) continue;
      const url = normalize(rawUrl);
      if (!url) continue;
      const host = new URL(url).hostname.replace(/^www\./, '');
      if (!seen.has(host)) seen.set(host, { name: host, url, category: cat || 'Services' });
    }
  }
  const sites = [...seen.values()];
  console.log(`     Found ${sites.length} independent business websites.`);
  if (!sites.length) return console.log('Nothing to test. Try another town name, or add URLs to ' + extraFile);
  if (!API_KEY) {
    console.log('\n  A free PageSpeed API key is needed (Google blocks tests without one).');
    console.log('  Run again with:  --key YOUR_KEY   (see the instructions Claude gave you)');
    process.exit(1);
  }

  process.stdout.write('\n     Checking your PageSpeed API key... ');
  const probe = await pagespeed('https://example.com/');
  if (probe.score == null) {
    console.log('failed.\n');
    console.log('  Google said: ' + probe.error);
    console.log('\n  Fix: in Google Cloud, open APIs & Services > Credentials, click your key, and under');
    console.log('  "API restrictions" choose "Don\'t restrict key" (or allow PageSpeed Insights API).');
    console.log('  Also make sure PageSpeed Insights API is enabled in the same project. Then wait a few minutes.');
    process.exit(1);
  }
  console.log('works.');

  console.log(`\n2/3  Testing each site on a simulated phone (about 20 seconds per site)...`);
  const results = [];
  let i = 0;
  async function worker() {
    while (i < sites.length) {
      const s = sites[i++];
      const home = await homepage(s.url);
      const reachable = home.ok || (home.status >= 400 && home.status !== 404 && home.status !== 410);
      const psi = reachable ? await pagespeed(home.finalUrl || s.url) : { error: home.status ? `page not found (${home.status})` : 'no response' };
      results.push({ ...s, ...home, ...psi });
      const label = psi.score != null ? `score ${psi.score}` : psi.error;
      console.log(`     [${results.length}/${sites.length}] ${s.name}: ${label}`);
    }
  }
  await Promise.all([worker(), worker(), worker()]);

  writeOutputs(results);
}

function writeOutputs(results) {
  console.log(`\n3/3  Writing results...`);
  // Optional: research/<name>-exclude.txt lists website hosts to leave out of the totals (chains, government)
  const exFile = path.join(OUT, `${slug}-exclude.txt`);
  const excluded = fs.existsSync(exFile)
    ? new Set(fs.readFileSync(exFile, 'utf8').split(/\r?\n/).map((l) => l.split('#')[0].trim().replace(/^www\./, '')).filter(Boolean))
    : new Set();
  const hostOf = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return ''; } };
  const all = results;
  results = results.filter((r) => !excluded.has(hostOf(r.url)));
  if (excluded.size) console.log(`     Leaving out ${all.length - results.length} listed sites (from ${slug}-exclude.txt).`);

  const cols = ['name', 'category', 'url', 'finalUrl', 'status', 'https', 'viewport', 'copyrightYear', 'builder', 'score', 'lcp', 'cls', 'tbt', 'error'];
  const csv = [cols.join(','), ...results.map((r) => cols.map((c) => JSON.stringify(r[c] ?? '')).join(','))].join('\n');
  fs.writeFileSync(path.join(OUT, `${slug}-raw.csv`), csv);

  const loaded = results.filter((r) => r.ok || r.score != null);
  const scored = results.filter((r) => r.score != null);
  const summarize = (rows) => {
    const sc = rows.filter((r) => r.score != null);
    return {
      tested: rows.length,
      scored: sc.length,
      medianMobileScore: median(sc.map((r) => r.score)),
      poorScore: pct(sc.filter((r) => r.score < 50).length, sc.length), // Google: 0-49 = poor
      goodScore: pct(sc.filter((r) => r.score >= 90).length, sc.length), // Google: 90-100 = good
      medianLcpSeconds: median(sc.map((r) => r.lcp)) && +median(sc.map((r) => r.lcp)).toFixed(1),
      slowLcp: pct(sc.filter((r) => r.lcp > 2.5).length, sc.length), // Google's "good" limit is 2.5s
      veryslowLcp: pct(sc.filter((r) => r.lcp > 4).length, sc.length), // Google's "poor" line is 4s
      layoutShift: pct(sc.filter((r) => r.cls > 0.1).length, sc.length),
    };
  };
  const byCategory = {};
  for (const c of [...new Set(results.map((r) => r.category))]) byCategory[c] = summarize(results.filter((r) => r.category === c));
  const builders = {};
  for (const r of loaded) builders[r.builder] = (builders[r.builder] || 0) + 1;

  const summary = {
    town: town || slug,
    testedOn: new Date().toISOString().slice(0, 10),
    method: 'Independent business websites listed on OpenStreetMap within the town boundary (national chains and government excluded). Each homepage tested once with Google PageSpeed Insights, mobile setting.',
    sitesFound: results.length,
    sitesLoaded: loaded.length,
    noResponse: results.filter((r) => r.status === 0 || r.status === '0').length,
    pageNotFound: results.filter((r) => r.status == 404 || r.status == 410).length,
    couldNotTest: results.filter((r) => r.score == null).length,
    noHttps: pct(loaded.filter((r) => !r.https).length, loaded.length),
    noMobileViewport: pct(loaded.filter((r) => !r.viewport).length, loaded.length),
    copyrightTwoPlusYearsOld: pct(loaded.filter((r) => r.copyrightYear && r.copyrightYear <= THIS_YEAR - 2).length, loaded.filter((r) => r.copyrightYear).length),
    ...summarize(results),
    byCategory,
    builders,
  };
  fs.writeFileSync(path.join(OUT, `${slug}-summary.json`), JSON.stringify(summary, null, 2));
  console.log(`\nDone. ${scored.length} sites scored. Median mobile score: ${summary.medianMobileScore}.`);
  console.log(`Summary: research/${slug}-summary.json   (send this one to Claude)`);
  console.log(`Details: research/${slug}-raw.csv   (private, names each business)\n`);

}

main().catch((e) => {
  console.error('\nSomething went wrong:', e.message);
  process.exit(1);
});
