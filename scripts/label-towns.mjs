// Splits an earlier site-audit study into per-town totals, using each business's map location.
// Does not retest anything; it only looks up where each business is.
//
// Usage (towns in priority order: small places first, the surrounding town last):
//   node scripts/label-towns.mjs northern-westchester "Peekskill" "Croton-on-Hudson" "Ossining" "Yorktown" "Cortlandt"
//
// Writes research/<name>-towns.json (totals only, safe to share).

import fs from 'node:fs';
import path from 'node:path';

const [name, ...towns] = process.argv.slice(2);
if (!name || !towns.length) {
  console.error('Usage: node scripts/label-towns.mjs northern-westchester "Peekskill" "Croton-on-Hudson" "Ossining" "Yorktown" "Cortlandt"');
  process.exit(1);
}
const OUT = path.join(process.cwd(), 'research');
const UA = 'Mozilla/5.0 (compatible; realedlopez-site-audit/1.0; +https://realedlopez.com)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const hostOf = (u) => { try { return new URL(/^https?:/i.test(u) ? u : `http://${u}`).hostname.replace(/^www\./, ''); } catch { return ''; } };

function readCsv(file) {
  const [head, ...lines] = fs.readFileSync(file, 'utf8').split('\n');
  const cols = head.split(',');
  return lines.filter(Boolean).map((line) => {
    const vals = JSON.parse('[' + line + ']');
    const row = Object.fromEntries(cols.map((c, i) => [c, vals[i]]));
    for (const k of ['score', 'lcp', 'cls', 'status']) row[k] = row[k] === '' || row[k] == null ? null : Number(row[k]);
    return row;
  });
}

async function box(town) {
  const q = /,/.test(town) ? town : `${town}, Westchester County, NY`;
  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=us&q=${encodeURIComponent(q)}`, { headers: { 'User-Agent': UA } });
  const [hit] = await res.json();
  if (!hit) throw new Error(`Could not find ${town}`);
  const [s, n, w, e] = hit.boundingbox.map(Number);
  return { town, s, n, w, e };
}

async function overpass(q) {
  const hosts = ['https://overpass.private.coffee/api/interpreter', 'https://maps.mail.ru/osm/tools/overpass/api/interpreter', 'https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];
  for (let round = 0; round < 3; round++) {
    for (const h of hosts) {
      try {
        const res = await fetch(`${h}?data=${encodeURIComponent(q)}`, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
        if (res.ok) { const j = await res.json(); if (j.elements?.length) return j.elements; }
        console.warn(`  ${new URL(h).hostname} answered ${res.status}, trying another...`);
      } catch (e) { console.warn(`  ${new URL(h).hostname}: ${e.message}`); }
    }
    console.warn('  Map servers busy, waiting 20 seconds...'); await sleep(20000);
  }
  throw new Error('Map servers are busy. Try again in a few minutes.');
}

const median = (xs) => { const s = xs.filter((x) => x != null).sort((a, b) => a - b); if (!s.length) return null; const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

const rows = readCsv(path.join(OUT, `${name}-raw.csv`));
const exFile = path.join(OUT, `${name}-exclude.txt`);
const excluded = fs.existsSync(exFile) ? new Set(fs.readFileSync(exFile, 'utf8').split(/\r?\n/).map((l) => l.split('#')[0].trim().replace(/^www\./, '')).filter(Boolean)) : new Set();
const kept = rows.filter((r) => !excluded.has(hostOf(r.url)));

console.log('Looking up town areas...');
const boxes = [];
for (const t of towns) { boxes.push(await box(t)); await sleep(1100); }
const s = Math.min(...boxes.map((b) => b.s)), n = Math.max(...boxes.map((b) => b.n)), w = Math.min(...boxes.map((b) => b.w)), e = Math.max(...boxes.map((b) => b.e));
console.log('Looking up business locations...');
const els = await overpass(`[out:json][timeout:120];(nwr["website"](${s},${w},${n},${e});nwr["contact:website"](${s},${w},${n},${e}););out tags center;`);
const where = new Map();
for (const el of els) {
  const t = el.tags || {};
  const h = hostOf(t.website || t['contact:website'] || '');
  const lat = el.lat ?? el.center?.lat, lon = el.lon ?? el.center?.lon;
  if (!h || lat == null || where.has(h)) continue;
  const town = boxes.find((b) => lat >= b.s && lat <= b.n && lon >= b.w && lon <= b.e)?.town;
  if (town) where.set(h, town);
}

const byTown = {};
for (const t of towns) {
  const rs = kept.filter((r) => where.get(hostOf(r.url)) === t);
  const sc = rs.filter((r) => r.score != null);
  byTown[t] = {
    sitesFound: rs.length,
    sitesScored: sc.length,
    medianScore: median(sc.map((r) => r.score)),
    poorScoreCount: sc.filter((r) => r.score < 50).length,
    goodScoreCount: sc.filter((r) => r.score >= 90).length,
    medianLcpSeconds: median(sc.map((r) => r.lcp)) != null ? +median(sc.map((r) => r.lcp)).toFixed(1) : null,
    metLcpTarget: sc.filter((r) => r.lcp <= 2.5).length,
    lcpOver10s: sc.filter((r) => r.lcp > 10).length,
    brokenLinks: rs.filter((r) => r.score == null).length,
    categories: Object.fromEntries([...new Set(rs.map((r) => r.category))].map((c) => [c, rs.filter((r) => r.category === c).length])),
  };
}
const unplaced = kept.filter((r) => !where.has(hostOf(r.url))).length;
fs.writeFileSync(path.join(OUT, `${name}-towns.json`), JSON.stringify({ study: name, towns: byTown, unplaced }, null, 2));
console.log('\nPer town:');
for (const [t, v] of Object.entries(byTown)) console.log(`  ${t.padEnd(18)} ${String(v.sitesFound).padStart(3)} sites, ${v.sitesScored} scored, typical score ${v.medianScore ?? '-'}`);
console.log(`  (not matched to a town: ${unplaced})`);
console.log(`\nSaved research/${name}-towns.json. Tell Claude it's done.`);
