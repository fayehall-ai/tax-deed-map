#!/usr/bin/env node
/**
 * LA-standard completeness / staleness report for map counties ≥50k.
 *
 * Usage:
 *   node scripts/la-completeness.js
 *   node scripts/la-completeness.js --stale-before 2026-12
 *   node scripts/la-completeness.js --json /tmp/la-bump-queue.json
 *
 * See docs/la-standard-bump.md for the full research + merge playbook.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const args = process.argv.slice(2);
function flag(name, def) {
  const i = args.indexOf(name);
  if (i === -1) return def;
  return args[i + 1] ?? true;
}

const STALE_BEFORE = flag("--stale-before", null);
const OUT_JSON = flag("--json", null);
const MIN_POP = Number(flag("--min-pop", "50000"));

function load(rel, name) {
  let s = fs.readFileSync(path.join(root, rel), "utf8");
  s = s.replace(new RegExp(`const ${name}\\s*=`), `var ${name} =`);
  s = s.replace(/if \(typeof module[\s\S]*$/, "");
  return new Function(s + `; return ${name};`)();
}

const CD = load("data/county-data.js", "COUNTY_DATA");
const CP = load("data/county-population.js", "COUNTY_POPULATION");
const topo = JSON.parse(
  fs.readFileSync(path.join(root, "data/counties-albers-10m.json"), "utf8")
);
const names = {};
for (const g of topo.objects.counties.geometries) {
  names[g.id] = g.properties.name;
}
const mapIds = new Set(Object.keys(names));

const LA_FIELDS = [
  "notes",
  "auctionFormat",
  "auctionPlatform",
  "auctionFrequency",
  "depositRules",
  "taxCollector",
  "clerkOfCourt",
  "propertyAppraiser",
  "survivingLiens",
  "quietTitle",
  "gisMap",
  "growthNeighborhoods",
  "asOf",
  "sources",
];

function missingFields(e) {
  if (!e) return LA_FIELDS.slice();
  return LA_FIELDS.filter((f) => {
    const v = e[f];
    if (v === undefined || v === null || v === "") return true;
    if (Array.isArray(v) && !v.length) return true;
    return false;
  });
}

const need = [];
let complete = 0;
let popComplete = 0;
let popTotal = 0;

for (const [k, p] of Object.entries(CP)) {
  if (p < MIN_POP) continue;
  if (!mapIds.has(k)) continue; // CT planning regions 091xx, etc.
  popTotal += p;
  const e = CD[k];
  const missing = missingFields(e);
  const reasons = [];
  if (missing.length) reasons.push("incomplete:" + missing.join("+"));
  if (STALE_BEFORE && e?.asOf && e.asOf < STALE_BEFORE) {
    reasons.push("stale:" + e.asOf);
  }
  if (!reasons.length) {
    complete++;
    popComplete += p;
  } else {
    need.push({
      fips: k,
      name: names[k] || "?",
      pop: p,
      asOf: e?.asOf || null,
      missing,
      reasons,
    });
  }
}

need.sort((a, b) => b.pop - a.pop);

const total = complete + need.length;
console.log("LA-standard check (map counties, pop ≥ " + MIN_POP.toLocaleString() + ")");
console.log(
  "  complete:",
  complete + "/" + total,
  "(" + ((complete / total) * 100).toFixed(1) + "%)"
);
console.log(
  "  population:",
  ((popComplete / popTotal) * 100).toFixed(1) + "% of " + Math.round(popTotal / 1e6) + "M"
);
if (STALE_BEFORE) console.log("  stale-before:", STALE_BEFORE);
console.log("  need research:", need.length);
if (need.length) {
  console.log("\nTop 30:");
  need.slice(0, 30).forEach((x) => {
    console.log(
      " ",
      x.fips,
      x.name.padEnd(18).slice(0, 18),
      String(x.pop).padStart(8),
      x.reasons.join("; ")
    );
  });
}

if (OUT_JSON && OUT_JSON !== true) {
  fs.writeFileSync(OUT_JSON, JSON.stringify(need, null, 2));
  console.log("\nWrote", OUT_JSON);
}

process.exit(need.length ? 1 : 0);
