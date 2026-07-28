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
  const popFilterSelect = document.getElementById("population-filter");
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
  let popThreshold = 0; // 0 = "all counties"; set from the population-filter select

  function countyPopulation(fips) {
    return (typeof COUNTY_POPULATION !== "undefined" && COUNTY_POPULATION[fips]) || 0;
  }

  function meetsPopFilter(fips) {
    return countyPopulation(fips) >= popThreshold;
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

    popFilterSelect.addEventListener("change", () => {
      popThreshold = Number(popFilterSelect.value) || 0;
      // Re-render whatever's currently on screen with the new filter.
      if (currentStateFips) selectState(currentStateFips);
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

    const counties = (countiesByStateFips.get(fips) || []).slice().sort((a, b) => a.properties.name.localeCompare(b.properties.name));
    const csel = countiesLayer.selectAll("path.county-shape").data(counties, (d) => d.id);
    csel.join("path")
      .attr("class", "county-shape")
      .attr("d", path)
      .attr("fill", (d) => meetsPopFilter(d.id) ? (TYPE_COLORS[info.type] || "#999") : null)
      .classed("county-excluded", (d) => !meetsPopFilter(d.id))
      .on("click", (event, d) => meetsPopFilter(d.id) && selectCounty(d.id))
      .append("title")
      .text((d) => `${d.properties.name} County, ${feature.properties.name}`
        + (meetsPopFilter(d.id) ? "" : ` — below ${popThreshold.toLocaleString()} population, hidden by filter`));
    countiesLayer.selectAll("path.county-shape").classed("selected", false);

    outlineLayer.selectAll("*").remove();
    outlineLayer.append("path").datum(feature).attr("class", "state-outline").attr("d", path);

    const filteredCounties = counties.filter((c) => meetsPopFilter(c.id));
    populateCountySelect(fips, filteredCounties, counties.length);
    zoomTo(feature);
    showStateDetail(feature, code, info);
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

  function typePill(type) {
    return `<span class="type-pill" style="background:${TYPE_COLORS[type]}"><span class="type-pill-dot"></span>${type}</span>`;
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
    `;
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
          <strong>Showing state-level defaults.</strong> ${record.name} County hasn't been individually researched yet — these fields are inherited from ${record.stateName}'s statewide rules. County auction calendars, local surplus/overage procedures, and any county-specific ordinances can differ and should be confirmed with the ${record.name} County treasurer or tax collector.
        </div>
        <div class="type-desc">${TYPE_DESCRIPTIONS[info.type]}</div>
        <div class="field-grid">
          ${field("Redemption period", info.redemption)}
          ${field("Investor return / penalty", info.returns)}
          ${field("Governing statute", info.statute)}
          ${field("State-level auction notes", info.notes)}
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
