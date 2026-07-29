(function () {
  const WIDTH = 960, HEIGHT = 600;
  const svg = d3.select("#map");
  const path = d3.geoPath(); // states/counties are pre-projected (Albers), no projection needed
  const zoomGroup = svg.append("g").attr("class", "zoom-group");
  const statesLayer = zoomGroup.append("g").attr("class", "states-layer");
  const countiesLayer = zoomGroup.append("g").attr("class", "counties-layer");
  const outlineLayer = zoomGroup.append("g").attr("class", "outline-layer");

  const stateSelect = document.getElementById("state-select");
  const countySelect = document.getElementById("county-select");
  const popFilterInput = document.getElementById("population-filter");
  const popReadout = document.getElementById("population-readout");
  const resetBtn = document.getElementById("reset-btn");
  const breadcrumb = document.getElementById("breadcrumb");
  const mapHint = document.getElementById("map-hint");
  const detailEmpty = document.getElementById("detail-empty");
  const detailContent = document.getElementById("detail-content");
  const legendEl = document.getElementById("legend");

  let statesFC, countiesFC;
  let statesByFips = new Map();     // fips -> feature
  let countiesByStateFips = new Map(); // stateFips -> [feature,...]
  let countyRecordById = new Map(); // countyFips -> {feature, code:{...state fields}, name, stateCode, stateName}
  let currentStateFips = null;

  // County population is heavily skewed — median ~26k, but the largest county
  // is 9.7M — so a linear slider would spend most of its travel on a handful
  // of counties and none where the data actually lives. These stops are
  // roughly logarithmic, with the finest granularity below 100k where ~80% of
  // counties sit. Index 0 means "no minimum" (show every county).
  const POP_STOPS = [
    0, 500, 1000, 2000, 3000, 5000, 7500, 10000, 15000, 20000, 25000,
    35000, 50000, 75000, 100000, 150000, 250000, 500000, 750000,
    1000000, 2000000, 5000000,
  ];
  const DEFAULT_STOP = POP_STOPS.indexOf(50000);
  let popThreshold = POP_STOPS[DEFAULT_STOP]; // 0 = "all counties"

  // The slider's range is derived from POP_STOPS rather than hard-coded in
  // index.html, so adding or removing a stop can't desync the two.
  popFilterInput.max = String(POP_STOPS.length - 1);
  popFilterInput.value = String(DEFAULT_STOP);
  updatePopReadout();

  function formatThreshold(n) {
    if (!n) return "All counties";
    if (n >= 1000000) return (n / 1000000) + "M+";
    if (n >= 1000) return (n / 1000) + "k+";
    return n + "+";
  }

  function updatePopReadout() {
    popReadout.textContent = formatThreshold(popThreshold);
    popFilterInput.setAttribute("aria-valuetext",
      popThreshold ? formatThreshold(popThreshold) + " population" : "No minimum");
  }

  // Returns null when we genuinely have no figure for this county, so callers
  // can tell "small" apart from "unknown".
  function countyPopulation(fips) {
    if (typeof COUNTY_POPULATION === "undefined") return null;
    const pop = COUNTY_POPULATION[fips];
    return typeof pop === "number" ? pop : null;
  }

  // Fail open on unknown population. A handful of map polygons have no figure
  // in the Census file — all 8 Connecticut counties (the file is keyed to CT's
  // new planning-region FIPS, while the map uses CT's legacy county FIPS) and
  // one retired Alaska census area. Those are real, mostly large jurisdictions;
  // hiding them because we lack a number would be worse than showing them.
  function meetsPopFilter(fips) {
    const pop = countyPopulation(fips);
    if (pop === null) return true;
    return pop >= popThreshold;
  }

  buildLegend();

  Promise.all([
    d3.json("data/states-albers-10m.json"),
    d3.json("data/counties-albers-10m.json"),
  ]).then(([statesTopo, countiesTopo]) => {
    statesFC = topojson.feature(statesTopo, statesTopo.objects.states);
    countiesFC = topojson.feature(countiesTopo, countiesTopo.objects.counties);

    statesFC.features.forEach((f) => statesByFips.set(f.id, f));
    countiesFC.features.forEach((f) => {
      const stateFips = f.id.slice(0, 2);
      if (!countiesByStateFips.has(stateFips)) countiesByStateFips.set(stateFips, []);
      countiesByStateFips.get(stateFips).push(f);

      const stateCode = FIPS_TO_STATE[stateFips];
      const stateInfo = STATE_DATA[stateCode];
      const stateFeature = statesByFips.get(stateFips);
      const countyInfo = (typeof COUNTY_DATA !== "undefined") ? COUNTY_DATA[f.id] : undefined;
      countyRecordById.set(f.id, {
        feature: f,
        id: f.id,
        name: f.properties.name,
        stateCode,
        stateName: stateFeature ? stateFeature.properties.name : stateCode,
        // County-specific fields win; anything it doesn't override still
        // falls back to the state default (e.g. `statute` rarely changes
        // per county, so most entries won't repeat it).
        info: countyInfo ? Object.assign({}, stateInfo, countyInfo) : stateInfo,
        hasCountyData: Boolean(countyInfo),
      });
    });

    populateStateSelect();
    drawNationalView();
  }).catch((err) => {
    console.error(err);
    mapHint.textContent = "Map data failed to load. Check your connection and reload.";
  });

  function buildLegend() {
    legendEl.innerHTML = "";
    Object.entries(TYPE_COLORS).forEach(([type, color]) => {
      const item = document.createElement("span");
      item.className = "legend-item";
      item.innerHTML = `<span class="legend-swatch" style="background:${color}"></span>${type}`;
      legendEl.appendChild(item);
    });
  }

  function populateStateSelect() {
    const entries = Object.keys(STATE_DATA)
      .map((code) => {
        const fips = Object.keys(FIPS_TO_STATE).find((k) => FIPS_TO_STATE[k] === code);
        const feature = statesByFips.get(fips);
        return { code, fips, name: feature ? feature.properties.name : code };
      })
      .filter((e) => e.fips)
      .sort((a, b) => a.name.localeCompare(b.name));

    entries.forEach((e) => {
      const opt = document.createElement("option");
      opt.value = e.fips;
      opt.textContent = e.name;
      stateSelect.appendChild(opt);
    });

    stateSelect.addEventListener("change", () => {
      if (stateSelect.value) selectState(stateSelect.value);
      else drawNationalView();
    });

    countySelect.addEventListener("change", () => {
      if (countySelect.value) selectCounty(countySelect.value);
    });

    resetBtn.addEventListener("click", () => drawNationalView());

    // "input" (not "change") so the map tracks the handle as it's dragged.
    // This deliberately does NOT call selectState: that re-runs the 600ms
    // zoom transition and rebuilds the detail pane, which makes dragging
    // stutter and throws away the reader's scroll position. applyPopFilter
    // only repaints what the filter actually affects.
    popFilterInput.addEventListener("input", () => {
      popThreshold = POP_STOPS[Number(popFilterInput.value)] ?? 0;
      updatePopReadout();
      applyPopFilter();
    });
  }

  function drawNationalView() {
    currentStateFips = null;
    stateSelect.value = "";
    countySelect.innerHTML = '<option value="">Select a state first…</option>';
    countySelect.disabled = true;
    resetBtn.disabled = true;
    breadcrumb.innerHTML = "United States";
    mapHint.textContent = "Click a state to see its counties. Click a county for details.";
    countiesLayer.selectAll("*").remove();
    outlineLayer.selectAll("*").remove();

    const sel = statesLayer.selectAll("path.state-shape").data(statesFC.features, (d) => d.id);
    sel.join("path")
      .attr("class", "state-shape")
      .attr("d", path)
      .attr("fill", (d) => colorForState(d.id))
      .on("click", (event, d) => selectState(d.id))
      .append("title")
      .text((d) => d.properties.name);

    statesLayer.selectAll("path.state-shape").classed("dimmed", false).classed("selected", false);
    zoomTo(null);
    showEmptyDetail();
  }

  function colorForState(fips) {
    const code = FIPS_TO_STATE[fips];
    const info = STATE_DATA[code];
    return info ? TYPE_COLORS[info.type] : "#999";
  }

  function selectState(fips) {
    const feature = statesByFips.get(fips);
    if (!feature) return;
    currentStateFips = fips;
    const code = FIPS_TO_STATE[fips];
    const info = STATE_DATA[code];

    stateSelect.value = fips;
    resetBtn.disabled = false;
    breadcrumb.innerHTML = `<span class="crumb-link">United States</span> &rsaquo; <strong>${feature.properties.name}</strong>`;
    breadcrumb.querySelector(".crumb-link").addEventListener("click", drawNationalView);
    mapHint.textContent = "Click a county for details, or use the county dropdown above.";

    statesLayer.selectAll("path.state-shape")
      .classed("dimmed", (d) => d.id !== fips)
      .classed("selected", (d) => d.id === fips);

    const counties = countiesForState(fips);
    const csel = countiesLayer.selectAll("path.county-shape").data(counties, (d) => d.id);
    csel.join("path")
      .attr("class", "county-shape")
      .attr("d", path)
      .on("click", (event, d) => meetsPopFilter(d.id) && selectCounty(d.id))
      .append("title");
    paintCounties(feature, info);
    countiesLayer.selectAll("path.county-shape").classed("selected", false);

    outlineLayer.selectAll("*").remove();
    outlineLayer.append("path").datum(feature).attr("class", "state-outline").attr("d", path);

    populateCountySelect(fips, counties.filter((c) => meetsPopFilter(c.id)), counties.length);
    zoomTo(feature);
    showStateDetail(feature, code, info);
  }

  function countiesForState(fips) {
    return (countiesByStateFips.get(fips) || [])
      .slice()
      .sort((a, b) => a.properties.name.localeCompare(b.properties.name));
  }

  // Everything the population filter affects, and nothing else — so it can be
  // re-run cheaply on every slider tick.
  function paintCounties(feature, info) {
    countiesLayer.selectAll("path.county-shape")
      .attr("fill", (d) => meetsPopFilter(d.id) ? (TYPE_COLORS[info.type] || "#999") : null)
      .classed("county-excluded", (d) => !meetsPopFilter(d.id))
      .select("title")
      .text((d) => `${d.properties.name} County, ${feature.properties.name}`
        + (meetsPopFilter(d.id) ? "" : ` — below ${popThreshold.toLocaleString()} population, hidden by filter`));
  }

  function applyPopFilter() {
    if (!currentStateFips) return; // national view shows no counties
    const feature = statesByFips.get(currentStateFips);
    const info = STATE_DATA[FIPS_TO_STATE[currentStateFips]];
    if (!feature || !info) return;

    paintCounties(feature, info);

    // Repopulating the dropdown clears its value, so carry the current
    // selection across — but drop it if the county no longer passes the
    // filter, otherwise the dropdown would show a county the map has greyed
    // out and made unclickable.
    const selected = countySelect.value;
    const counties = countiesForState(currentStateFips);
    populateCountySelect(currentStateFips, counties.filter((c) => meetsPopFilter(c.id)), counties.length);
    if (selected && meetsPopFilter(selected)) {
      countySelect.value = selected;
      countiesLayer.selectAll("path.county-shape").classed("selected", (d) => d.id === selected);
    } else {
      countiesLayer.selectAll("path.county-shape").classed("selected", false);
    }
  }

  function populateCountySelect(fips, counties, totalCount) {
    const hint = totalCount != null && totalCount !== counties.length
      ? ` (${counties.length} of ${totalCount})`
      : "";
    countySelect.innerHTML = `<option value="">Select a county…${hint}</option>`;
    counties.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.properties.name;
      countySelect.appendChild(opt);
    });
    countySelect.disabled = false;
    countySelect.value = "";
  }

  function selectCounty(countyFips) {
    const record = countyRecordById.get(countyFips);
    if (!record) return;
    if (record.stateName && currentStateFips !== countyFips.slice(0, 2)) {
      selectState(countyFips.slice(0, 2));
    }
    countySelect.value = countyFips;
    countiesLayer.selectAll("path.county-shape").classed("selected", (d) => d.id === countyFips);

    const stateFeature = statesByFips.get(countyFips.slice(0, 2));
    breadcrumb.innerHTML = `<span class="crumb-link crumb-us">United States</span> &rsaquo; <span class="crumb-link crumb-state">${record.stateName}</span> &rsaquo; <strong>${record.name} County</strong>`;
    breadcrumb.querySelector(".crumb-us").addEventListener("click", drawNationalView);
    breadcrumb.querySelector(".crumb-state").addEventListener("click", () => selectState(countyFips.slice(0, 2)));

    showCountyDetail(record);
  }

  function zoomTo(feature) {
    let transform;
    if (!feature) {
      transform = "translate(0,0) scale(1)";
    } else {
      const [[x0, y0], [x1, y1]] = path.bounds(feature);
      const dx = x1 - x0, dy = y1 - y0;
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
      const scale = Math.max(1, Math.min(8, 0.85 / Math.max(dx / WIDTH, dy / HEIGHT)));
      const tx = WIDTH / 2 - scale * cx;
      const ty = HEIGHT / 2 - scale * cy;
      transform = `translate(${tx},${ty}) scale(${scale})`;
    }
    zoomGroup.transition().duration(600).attr("transform", transform);
  }

  function showEmptyDetail() {
    detailEmpty.hidden = false;
    detailContent.hidden = true;
  }

  // White text is unreadable on the lighter type fills (2.25:1 on the gold,
  // 3.42:1 on the green), so pick whichever of white/brand-navy actually
  // contrasts with the fill instead of assuming white.
  const INK = "#021137";

  function relativeLuminance(hex) {
    const ch = [1, 3, 5]
      .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  }

  function contrastRatio(a, b) {
    const x = relativeLuminance(a), y = relativeLuminance(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  }

  function readableOn(bg) {
    return contrastRatio("#ffffff", bg) >= contrastRatio(INK, bg) ? "#ffffff" : INK;
  }

  function typePill(type) {
    const bg = TYPE_COLORS[type] || "#999999";
    return `<span class="type-pill" style="background:${bg};color:${readableOn(bg)}"><span class="type-pill-dot"></span>${type}</span>`;
  }

  function showStateDetail(feature, code, info) {
    detailEmpty.hidden = true;
    detailContent.hidden = false;
    if (!info) {
      detailContent.innerHTML = `<p class="detail-kicker">State</p><h2 class="detail-title">${feature.properties.name}</h2><p>No reference data compiled for this state yet.</p>`;
      return;
    }
    const countyCount = (countiesByStateFips.get(feature.id) || []).length;
    detailContent.innerHTML = `
      <p class="detail-kicker">State overview</p>
      <h2 class="detail-title">${feature.properties.name}</h2>
      <p class="detail-sub">${countyCount} counties &middot; click one on the map or use the dropdown above</p>
      ${typePill(info.type)}
      <div class="type-desc">${TYPE_DESCRIPTIONS[info.type]}</div>
      <div class="field-grid">
        ${field("Redemption period", info.redemption)}
        ${field("Investor return / penalty", info.returns)}
        ${field("Governing statute", info.statute)}
        ${field("Auction notes", info.notes)}
      </div>
      ${docReportBlock(code, feature.properties.name)}
    `;
  }

  // Everything below comes from the user's source report, kept visually and
  // textually separate from the atlas's own STATE_DATA above it. The report
  // is transcribed, not independently verified, so it is labelled with its
  // title/author rather than blended into the fields above as if it were the
  // same class of information.
  function docReportBlock(code, stateName) {
    if (typeof STATE_DOC_SUMMARY === "undefined") return "";
    const sum = STATE_DOC_SUMMARY[code];
    const det = typeof STATE_DOC_DETAIL !== "undefined" ? STATE_DOC_DETAIL[code] : null;
    if (!sum && !det) return "";

    const src = STATE_DOC_SOURCE;
    let html = `<p class="detail-section-title">From the 50-state report</p>
      <p class="doc-attrib">${src.title}. Transcribed from ${src.file}; the report's own citations were accessed ${src.citationsAccessed}. Not independently verified.</p>`;

    if (sum) {
      html += `<div class="field-grid">
        ${field("System type", sum.type)}
        ${field("Statutory interest / penalty", sum.rate)}
        ${field("Statutory redemption period", sum.redemption)}
      </div>`;
    }

    // The current source covers all 50 states, so this branch should not
    // fire. It stays as a guard: if a future revision of the report drops a
    // state, say so plainly rather than leaving the panel looking finished.
    if (!det) {
      html += `<div class="county-flag doc-flag">
        <strong>Summary only.</strong> The report has no detailed section for ${stateName} &mdash; only the summary-table row above, with no system overview, statutory detail, or resource links.
      </div>`;
      return html;
    }

    if (det.truncated) {
      html += `<div class="county-flag doc-flag">
        <strong>Incomplete in the source.</strong> The document cuts off mid-sentence partway through this state's overview and goes straight to its bibliography. What follows is everything it actually contains.
      </div>`;
    }

    html += `<div class="field-grid">
      ${field("Classification", det.classification)}
      ${field("Governing statutes", det.governingStatutes)}
    </div>`;

    if (det.overview && det.overview.length) {
      html += `<p class="detail-subsection-title">System overview</p>
        <div class="doc-prose">${det.overview.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}</div>`;
    }
    if (det.redemptionPeriod || det.interestRate) {
      html += `<p class="detail-subsection-title">Statutory framework</p>
        <div class="field-grid">
          ${field("Redemption period", det.redemptionPeriod)}
          ${field("Interest / penalty rate", det.interestRate)}
        </div>`;
    }
    if (det.resources && det.resources.length) {
      html += `<p class="detail-subsection-title">State-level resources</p>
        <ul class="doc-links">${det.resources
          .map((r) => `<li><a href="${r.url}" target="_blank" rel="noopener">${escapeHtml(r.label)}</a></li>`)
          .join("")}</ul>`;
    }
    return html;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function showCountyDetail(record) {
    detailEmpty.hidden = true;
    detailContent.hidden = false;
    const info = record.info;
    if (!info) {
      detailContent.innerHTML = `<p class="detail-kicker">County</p><h2 class="detail-title">${record.name} County</h2><p class="detail-sub">${record.stateName}</p><p>No reference data compiled for this state yet.</p>`;
      return;
    }
    if (!record.hasCountyData) {
      detailContent.innerHTML = `
        <p class="detail-kicker">County detail</p>
        <h2 class="detail-title">${record.name} County</h2>
        <p class="detail-sub">${record.stateName}</p>
        ${typePill(info.type)}
        <div class="county-flag">
          <strong>Using state defaults.</strong> This county has not been individually researched. The information below comes from ${record.stateName} statewide rules.
        </div>
        <div class="type-desc">${TYPE_DESCRIPTIONS[info.type]}</div>
        <p class="detail-section-title">State-level rules (inherited)</p>
        <div class="field-grid">
          ${field("Redemption period", info.redemption)}
          ${field("Investor return / penalty", info.returns)}
          ${field("Governing statute", info.statute)}
          ${field("Auction notes", info.notes)}
        </div>
      `;
      return;
    }

    // County has been individually researched — full due-diligence template.
    // Each section is skipped entirely (header included) when none of its
    // fields have data, rather than showing an empty heading over a blank
    // grid — the doc-sourced batch, for example, often has no clerk/
    // appraiser/GIS/quiet-title info, only auction logistics + statute.
    const sections = [
      ["I. Statutory framework", [
        field("Redemption period", info.redemption),
        field("Investor return / penalty", info.returns),
        field("Governing statute", info.statute),
        field("Auction notes", info.notes),
      ]],
      ["II. Auction logistics", [
        field("Format", info.auctionFormat),
        linkField("Platform", info.auctionPlatform),
        field("Frequency", info.auctionFrequency),
        field("Deposit rules", info.depositRules),
      ]],
      ["III. Authority contacts", [
        linkField("Tax Collector / Treasurer", info.taxCollector),
        linkField("Clerk of Court / Recorder", info.clerkOfCourt),
        linkField("Property Appraiser / Assessor", info.propertyAppraiser),
      ]],
      ["IV. Advanced due diligence", [
        field("Surviving liens", info.survivingLiens),
        field("Quiet title requirement", info.quietTitle),
        linkField("Property Appraiser GIS map", info.gisMap),
      ]],
    ];
    const sectionsHtml = sections
      .filter(([, fields]) => fields.some(Boolean))
      .map(([title, fields]) => `
        <p class="detail-section-title">${title}</p>
        <div class="field-grid">${fields.join("")}</div>
      `)
      .join("");

    detailContent.innerHTML = `
      <p class="detail-kicker">County detail — individually researched</p>
      <h2 class="detail-title">${record.name} County</h2>
      <p class="detail-sub">${record.stateName}</p>
      ${typePill(info.type)}
      <div class="type-desc">${TYPE_DESCRIPTIONS[info.type]}</div>
      ${sectionsHtml}
      ${neighborhoodsBlock(info.growthNeighborhoods)}
      ${sourceNote(info.asOf, info.sources)}
    `;
  }

  function field(label, value) {
    if (!value) return "";
    return `<div class="field"><label>${label}</label><p>${value}</p></div>`;
  }

  function linkField(label, entry) {
    if (!entry) return "";
    const body = entry.url
      ? `<a href="${entry.url}" target="_blank" rel="noopener">${entry.label || entry.url}</a>${entry.phone ? ` &middot; ${entry.phone}` : ""}`
      : `${entry.label || ""}${entry.phone ? ` &middot; ${entry.phone}` : ""}`;
    return `<div class="field"><label>${label}</label><p>${body}</p></div>`;
  }

  function neighborhoodsBlock(neighborhoods) {
    if (!neighborhoods || !neighborhoods.length) return "";
    const items = neighborhoods
      .map((n) => `<li><strong>${n.name}</strong> — ${n.why}</li>`)
      .join("");
    return `
      <p class="detail-section-title">Growth watch — top neighborhoods</p>
      <ul class="neighborhood-list">${items}</ul>
    `;
  }

  function sourceNote(asOf, sources) {
    if (!asOf && (!sources || !sources.length)) return "";
    const links = (sources || [])
      .map((s, i) => `<a href="${s}" target="_blank" rel="noopener">[${i + 1}]</a>`)
      .join(" ");
    return `<p class="source-note">${asOf ? `Checked ${asOf}.` : ""} ${sources && sources.length ? `Sources: ${links}` : ""} Confirm current details with the county office before acting.</p>`;
  }
})();
