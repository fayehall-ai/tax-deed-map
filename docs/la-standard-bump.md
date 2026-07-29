# LA-standard tax-sale due diligence bump

Playbook for refreshing or expanding county entries in this repo to the **Los Angeles County golden standard**. Use this for future date bumps (`asOf`), platform changes, or new counties.

**Golden-standard entry:** `data/county-data.js` → FIPS `"06037"` (Los Angeles County, CA).

---

## 1. Role + research prompt (copy into agent)

Use this prompt for each research batch (25–30 counties per agent works well):

```text
Role: You are a Senior Real Estate Investment Analyst specializing in residential
acquisitions and title due diligence, acting as Tax Sale Lead Researcher.

Task: Using the Universal Investor Inquiry Template below, research, quote from,
and advise on tax-sale due diligence for the listed counties. Prefer official
.gov / county / state auction portals. Do NOT invent URLs — omit a field only if
unverifiable. Named individual officeholders are deliberately NOT included
(they change with elections); link offices by title/URL/phone only.

Workspace: /Users/fayehall/tax-deed-map
Write valid JSON ONLY to:
  data/enrichments/batch-next-<label>.json
(key = 5-digit FIPS string)

=== Universal Investor Inquiry Template ===

Location: [County, ST] / FIPS [#####]

I. Statutory Framework
  • Governing Statute: (e.g., FL Chapter 197, GA Title 48) — usually from STATE_DATA;
    county notes only if county elects a different sale type
  • Sale Type: Tax Deed | Tax Lien | Hybrid | Redeemable Deed
  • Redemption Period: (how long can the owner buy back?)
  • Interest Rate / Penalty: (ROI if owner redeems)

II. Auction Logistics
  • Format: Online | In-Person | Mail-in | Sealed bid | Suspended | Municipal-only
  • Platform Link: (Real Auction, GovEase, Civic Source, Bid4Assets, county portal…)
  • Frequency: Monthly | Annually | As needed | Specific next date if posted
  • Deposit Rules: Amount required + cleared-funds deadline

III. Authority Contacts
  • Tax Collector / Treasurer: (delinquency lists, lien info)
  • Clerk of Court / Recorder: (auction rules, title recording)
  • Property Appraiser / Assessor: (parcel specs + mapping)

IV. Advanced Due Diligence
  • Surviving Liens: (municipal liens, HOA, IRS, etc. after the sale)
  • Quiet Title Requirement: (lawsuit required for clear/insurable title?)
  • Property Appraiser GIS Map: (overhead parcel map URL)

Furthermore: Identify Top 3 High-Growth Neighborhoods for the current/next year
in that county based on job growth and inventory trends (directional only —
not investment guarantees). Frame as “why” bullets with jobs/inventory language.

=== Required JSON schema per FIPS ===

{
  "FIPS": {
    "notes": "...county-specific process, suspensions, municipal-vs-county flags...",
    "auctionFormat": "...",
    "auctionPlatform": { "label": "...", "url": "https://..." },
    "auctionFrequency": "...",
    "depositRules": "...",
    "taxCollector": { "label": "...", "url": "https://...", "phone": "optional" },
    "clerkOfCourt": { "label": "...", "url": "https://..." },
    "propertyAppraiser": { "label": "...", "url": "https://...", "phone": "optional" },
    "survivingLiens": "...state-accurate, county nuance if needed...",
    "quietTitle": "...",
    "gisMap": { "label": "...", "url": "https://..." },
    "growthNeighborhoods": [
      { "name": "...", "why": "...job growth / inventory trend..." },
      { "name": "...", "why": "..." },
      { "name": "...", "why": "..." }
    ],
    "asOf": "YYYY-MM",
    "sources": ["https://...", "https://..."]
  }
}

Rules:
- asOf = month you checked (YYYY-MM).
- Prefer official sources; put URLs in sources[].
- If municipal-not-county (CT, ME, MA, NH, NJ, RI, VT, etc.), say so in notes
  and do NOT present one town as if it is the whole county.
- Flag time-sensitive status (suspended, bulk-only institutional, program
  phase-out) prominently in notes.
- growthNeighborhoods: 3 items, directional, dated by asOf — not guarantees.
- Read existing sparse entries in data/county-data.js first; enhance, don't
  contradict without evidence.
```

---

## 2. LA golden-standard field checklist

An entry is **LA-complete** when all of these are non-empty:

| Field | Type | Notes |
|-------|------|--------|
| `notes` | string | Process quirks, platform caveats |
| `auctionFormat` | string | Online / In-person / … |
| `auctionPlatform` | `{label, url?}` | Prefer live URL |
| `auctionFrequency` | string | |
| `depositRules` | string | Amount + cleared-funds timing |
| `taxCollector` | `{label, url?, phone?}` | |
| `clerkOfCourt` | `{label, url?, phone?}` | Recorder / clerk |
| `propertyAppraiser` | `{label, url?, phone?}` | Assessor |
| `survivingLiens` | string | |
| `quietTitle` | string | |
| `gisMap` | `{label, url}` | Parcel/map viewer |
| `growthNeighborhoods` | `[{name, why}]` | Exactly 3 preferred |
| `asOf` | `YYYY-MM` | Check date |
| `sources` | `string[]` | Source trail |

**Reference entry:** FIPS `06037` in `data/county-data.js`.

**Inheritance:** `app.js` does `Object.assign({}, stateInfo, countyInfo)`.  
`data/state-data.js` supplies statewide defaults for `depositRules`, `survivingLiens`, `quietTitle` (and statute/redemption/returns/type). County fields override state.

---

## 3. Find what needs a bump

### Completeness / staleness check (run from repo root)

```bash
node <<'EOF'
const fs = require("fs");
function load(p, name) {
  let s = fs.readFileSync(p, "utf8")
    .replace(new RegExp(`const ${name}\\s*=`), `var ${name} =`)
    .replace(/if \(typeof module[\s\S]*$/, "");
  return new Function(s + `; return ${name};`)();
}
const CD = load("data/county-data.js", "COUNTY_DATA");
const CP = load("data/county-population.js", "COUNTY_POPULATION");
const topo = JSON.parse(fs.readFileSync("data/counties-albers-10m.json", "utf8"));
const names = {};
for (const g of topo.objects.counties.geometries) names[g.id] = g.properties.name;
const mapIds = new Set(Object.keys(names));
const la = [
  "notes","auctionFormat","auctionPlatform","auctionFrequency","depositRules",
  "taxCollector","clerkOfCourt","propertyAppraiser","survivingLiens","quietTitle",
  "gisMap","growthNeighborhoods","asOf","sources",
];
const STALE_BEFORE = "2026-07"; // bump this when refreshing
function complete(e) {
  return e && la.every((f) => {
    const v = e[f];
    if (v === undefined || v === null || v === "") return false;
    if (Array.isArray(v) && !v.length) return false;
    return true;
  });
}
const need = [];
for (const [k, p] of Object.entries(CP)) {
  if (p < 50000) continue;
  if (!mapIds.has(k)) continue; // skip CT planning-region FIPS 091xx
  const e = CD[k];
  const reasons = [];
  if (!complete(e)) reasons.push("incomplete");
  if (e?.asOf && e.asOf < STALE_BEFORE) reasons.push("stale:" + e.asOf);
  if (reasons.length) need.push({ fips: k, name: names[k], pop: p, reasons });
}
need.sort((a, b) => b.pop - a.pop);
console.log("Need research:", need.length);
need.slice(0, 40).forEach((x) =>
  console.log(x.fips, x.name, x.pop, x.reasons.join(",")));
fs.writeFileSync("/tmp/la-bump-queue.json", JSON.stringify(need, null, 2));
EOF
```

### Population / map notes

- Default map filter is **50,000+** (`app.js` `POP_STOPS`).
- `COUNTY_POPULATION` is Census Vintage (see file header).
- **CT mismatch:** population file may include planning-region FIPS `091xx`; map uses legacy counties `09001`–`09015`. Always filter completeness by **map feature ids**.

---

## 4. Research workflow (batch)

1. **Queue** largest incomplete/stale counties (script above → `/tmp/la-bump-queue.json`).
2. **Spawn parallel research agents** (4× ~25 FIPS each) with the prompt in §1.
3. Agents write JSON to `data/enrichments/batch-next-<label>.json`.
4. **Merge** into `data/county-data.js` (script below).
5. Re-run completeness check; loop until map 50k+ is clean.
6. Bump `asOf` to the check month (e.g. `2026-12`).
7. Optionally update `STATE_DATA` legal defaults if statutes changed.

### Parallel batch sizing

| Approach | Counties / agent | Notes |
|----------|------------------|--------|
| Full LA-depth web research | 20–30 | Best quality |
| State-clustered (all TX remaining) | 25–40 | Shares statute language |
| Stale-only refresh | 25 | Re-check platforms + dates only |

---

## 5. Merge enrichments → `county-data.js`

```bash
node <<'EOF'
const fs = require("fs");
const path = "data/county-data.js";
let src = fs.readFileSync(path, "utf8");
// list enrichment files to merge this run:
const files = [
  "data/enrichments/batch-next-XX.json",
  // ...
];
const enrich = {};
for (const f of files) Object.assign(enrich, JSON.parse(fs.readFileSync(f, "utf8")));

function formatEntry(fips, obj) {
  const lines = [`  "${fips}": { // LA-level due diligence (Batch 4)`];
  function emit(key, val, indent) {
    const sp = " ".repeat(indent);
    if (typeof val === "string") lines.push(`${sp}${key}: ${JSON.stringify(val)},`);
    else if (Array.isArray(val)) {
      if (!val.length) lines.push(`${sp}${key}: [],`);
      else if (typeof val[0] === "string") {
        lines.push(`${sp}${key}: [`);
        val.forEach((s) => lines.push(`${sp}  ${JSON.stringify(s)},`));
        lines.push(`${sp}],`);
      } else {
        lines.push(`${sp}${key}: [`);
        val.forEach((item) =>
          lines.push(`${sp}  { name: ${JSON.stringify(item.name)}, why: ${JSON.stringify(item.why)} },`));
        lines.push(`${sp}],`);
      }
    } else if (val && typeof val === "object") {
      lines.push(`${sp}${key}: { ${Object.entries(val).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(", ")} },`);
    }
  }
  const order = [
    "type","notes","auctionFormat","auctionPlatform","auctionFrequency","depositRules",
    "taxCollector","clerkOfCourt","propertyAppraiser","survivingLiens","quietTitle",
    "gisMap","growthNeighborhoods","asOf","sources",
  ];
  for (const k of order) if (obj[k] !== undefined) emit(k, obj[k], 4);
  for (const k of Object.keys(obj)) if (!order.includes(k)) emit(k, obj[k], 4);
  lines.push(`  },`);
  return lines.join("\n") + "\n";
}

let n = 0;
for (const [fips, obj] of Object.entries(enrich)) {
  if (!obj.growthNeighborhoods?.length) continue;
  const re = new RegExp(`  "${fips}": \\{[\\s\\S]*?\\n  \\},\\n`);
  const block = formatEntry(fips, obj);
  if (re.test(src)) { src = src.replace(re, block); n++; }
  else {
    src = src.replace(/\n\};\n\nif \(typeof module/, "\n" + block + "\n};\n\nif (typeof module");
    n++;
  }
}
fs.writeFileSync(path, src);
console.log("merged", n);
EOF
```

Then syntax-check:

```bash
node -e '
const fs=require("fs");
let s=fs.readFileSync("data/county-data.js","utf8")
  .replace(/const COUNTY_DATA\s*=/,"var COUNTY_DATA =")
  .replace(/if \(typeof module[\s\S]*$/,"");
new Function(s)();
console.log("OK");
'
```

---

## 6. State-level defaults (`data/state-data.js`)

Keep these current on every major legislative cycle:

- `type`, `redemption`, `returns`, `statute`, `notes`
- `depositRules` (typical pattern)
- `survivingLiens`
- `quietTitle`

County research overrides when more specific. Do **not** invent county URLs at the state layer.

---

## 7. Special cases (do not “fix” as normal auctions)

Call these out in `notes`:

| Situation | Examples |
|-----------|----------|
| Municipal-only (no county sale) | CT, ME, MA, NH, NJ, RI, VT |
| Program suspended / phased out | NYC tax lien sale (2026+), Cook IL phase-out risk |
| Institutional bulk only | Some OH large counties’ certificate sales |
| State-run (not county) | AR COSL, NM PTD, WV State Auditor, many ND tax deeds |
| Hybrid two-stage | FL certificates then tax deeds |
| Redeemable deed high penalty | TX, GA, SC |

---

## 8. Agent one-liner (future bump kickoff)

Paste this to start a full or partial bump:

```text
Continue LA-standard tax-sale due diligence for this repo following
docs/la-standard-bump.md. Golden standard = Los Angeles County FIPS 06037.

1) Run the completeness/staleness check (STALE_BEFORE = <YYYY-MM>).
2) Research incomplete/stale map counties ≥50k in parallel batches of ~25
   using the Universal Investor Inquiry prompt in that doc.
3) Write JSON to data/enrichments/batch-next-*.json
4) Merge into data/county-data.js; syntax-check; re-measure until clean.
5) Update asOf; flag suspensions/municipal systems honestly.
Do not invent URLs. Prefer official .gov sources.
```

---

## 9. File map

| Path | Role |
|------|------|
| `data/county-data.js` | Per-county researched fields (source of truth in UI) |
| `data/state-data.js` | Statewide statute + legal DD defaults |
| `data/county-population.js` | Census pop for 50k+ filter |
| `data/enrichments/*.json` | Research batch artifacts before/after merge |
| `app.js` | Merges state + county; renders Sections I–IV + growth |
| `docs/la-standard-bump.md` | **This playbook** |

---

## 10. Quality bar (do not lower)

- Every claim that can rot (platform, deposit, schedule) needs `asOf` + `sources`.
- No fabricated assessor/GIS URLs.
- Growth neighborhoods are **directional**, not guarantees.
- Better to leave a field empty (state inherit or UI hide) than invent.
- Prefer enhancing existing sparse Batch 2/3 auction logistics over rewriting from scratch when still accurate.
