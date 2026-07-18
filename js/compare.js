// =====================================================
// COMPARE PAGE
// Self-contained, same pattern as company.js/script.js —
// re-declares slugify/category helpers rather than sharing
// them, since each page only loads its own script file.
// =====================================================

const CATEGORY_FIELDS = [
  { key: "salary_rating", label: "catSalary" },
  { key: "management_rating", label: "catManagement" },
  { key: "training_rating", label: "catTraining" },
  { key: "career_rating", label: "catCareer" },
  { key: "culture_rating", label: "catCulture" },
  { key: "work_life_rating", label: "catWorkLife" }
];

function slugify(name) {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}

function categoryAverages(reviews) {
  return CATEGORY_FIELDS.map(cat => {
    const values = reviews.map(r => Number(r[cat.key])).filter(v => !isNaN(v) && v > 0);
    const avg = values.length ? values.reduce((s, v) => s + v, 0) / values.length : 0;
    return { ...cat, avg };
  });
}

// Absolute quality tier for a single 1-5 rating, independent of comparison.
// Thresholds: <1.5 red, 1.5-2.8 orange, 2.8-3.8 green, >3.8 blue.
function ratingQualityClass(avg) {
  if (avg <= 0) return "rate-none"; // no data yet ("—")
  if (avg < 1.5) return "rate-red";
  if (avg < 2.8) return "rate-orange";
  if (avg < 3.8) return "rate-green";
  return "rate-blue";
}

let companyGroups = {};     // { companyName: [reviews...] }
let companyNames = [];      // sorted list, for the picker
let selected = { a: null, b: null };
let activeSlot = null;      // "a" or "b" — which slot the picker is currently filling

// =====================================================
// LOAD DATA
// =====================================================
fetch("data.json")
  .then(response => response.json())
  .then(data => {
    data.forEach(r => {
      if (!companyGroups[r.company_name]) companyGroups[r.company_name] = [];
      companyGroups[r.company_name].push(r);
    });
    companyNames = Object.keys(companyGroups).sort((a, b) => a.localeCompare(b));
    renderSlots();
  })
  .catch(error => console.error(error));

// =====================================================
// SLOTS (the two boxes above the comparison)
// =====================================================
// A neutral placeholder shown for any side that hasn't been picked yet —
// value 3 (out of 5) draws a flat, regular hexagon, same idea as the
// reference showing "40" on every stat before you've added anyone.
const DEFAULT_CATS = CATEGORY_FIELDS.map(c => ({ ...c, avg: 2.5 }));

function renderSlots() {
  const t = translations[getLang()];
  ["a", "b"].forEach(id => {
    const el = document.getElementById(`slot-${id}`);
    const name = selected[id];

    if (!name) {
      el.className = "compare-slot empty";
      el.style.borderColor = "";
      el.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
        <span>${t.compareAddCompany}</span>
      `;
      return;
    }

    const slug = slugify(name);
    const slotColor = id === "a" ? "var(--compare-a)" : "var(--compare-b)";
    el.className = "compare-slot filled";
    el.style.borderColor = slotColor;
    el.innerHTML = `
      <button class="slot-remove" onclick="event.stopPropagation(); removeCompany('${id}')" aria-label="Remove">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
      <div class="card-logo">
        <img src="assets/logos/${slug}.png" alt="${name}"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="logo-fallback">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <path d="M4 21V6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v15M16 21v-9a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v9M4 21h16M7 8h1M7 11h1M7 14h1M10 8h1M10 11h1M10 14h1"/>
          </svg>
        </div>
      </div>
      <p class="company-name">${name}</p>
    `;
  });
}

function removeCompany(slotId) {
  selected[slotId] = null;
  renderSlots();
  renderCompare();
}

// =====================================================
// PICKER OVERLAY (search + grid)
// =====================================================
function openPicker(slotId) {
  activeSlot = slotId;
  document.getElementById("picker-overlay").classList.add("open");
  document.getElementById("picker-search").value = "";
  renderPickerGrid("");
  document.getElementById("picker-search").focus();
}

function closePicker() {
  document.getElementById("picker-overlay").classList.remove("open");
  activeSlot = null;
}

function renderPickerGrid(query) {
  const otherSlot = activeSlot === "a" ? "b" : "a";
  const excluded = selected[otherSlot];
  const q = query.trim().toLowerCase();

  const matches = companyNames.filter(name => name.toLowerCase().includes(q));

  document.getElementById("picker-grid").innerHTML = matches.map(name => {
    const slug = slugify(name);
    const isExcluded = name === excluded;
    return `
      <div class="picker-item ${isExcluded ? "disabled" : ""}" onclick="pickCompany('${name.replace(/'/g, "\\'")}')">
        <div class="card-logo">
          <img src="assets/logos/${slug}.png" alt="${name}"
               onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div class="logo-fallback">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
              <path d="M4 21V6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v15M16 21v-9a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v9M4 21h16M7 8h1M7 11h1M7 14h1M10 8h1M10 11h1M10 14h1"/>
            </svg>
          </div>
        </div>
        <span>${name}</span>
      </div>
    `;
  }).join("");
}

function pickCompany(name) {
  if (name === selected[activeSlot === "a" ? "b" : "a"]) return; // guard against the disabled item still being clicked
  selected[activeSlot] = name;
  closePicker();
  renderSlots();
  renderCompare();
}

// =====================================================
// COMPARISON RESULT
// =====================================================
function renderCompare() {
  const t = translations[getLang()];

  const catsA = selected.a ? categoryAverages(companyGroups[selected.a]) : DEFAULT_CATS;
  const catsB = selected.b ? categoryAverages(companyGroups[selected.b]) : DEFAULT_CATS;
  const bothReal = selected.a && selected.b; // only highlight winners once there's something real to compare

  document.getElementById("compare-radar").innerHTML = radarOverlaySvg(catsA, catsB, t, !selected.a && !selected.b);

  document.getElementById("compare-rows").innerHTML = catsA.map((catA, i) => {
    const catB = catsB[i];
    const diff = catA.avg - catB.avg;
    const hasRealDiff = bothReal && catA.avg > 0 && catB.avg > 0 && diff !== 0;

    let deltaClassA = "", deltaClassB = "", deltaA = "", deltaB = "";
    if (hasRealDiff) {
      deltaClassA = diff > 0 ? "win" : "lose";
      deltaClassB = diff < 0 ? "win" : "lose";
      deltaA = `<span class="delta ${deltaClassA}">${diff > 0 ? "+" : ""}${diff.toFixed(1)}</span>`;
      deltaB = `<span class="delta ${deltaClassB}">${diff < 0 ? "+" : "-"}${Math.abs(diff).toFixed(1)}</span>`;
    }

    const textA = catA.avg > 0 ? catA.avg.toFixed(1) : "—";
    const textB = catB.avg > 0 ? catB.avg.toFixed(1) : "—";
    const badgeA = `<span class="rating-badge ${ratingQualityClass(catA.avg)}">${textA}</span>`;
    const badgeB = `<span class="rating-badge ${ratingQualityClass(catB.avg)}">${textB}</span>`;

return `
      <div class="compare-row">
        <div class="val a">${deltaA}${badgeA}</div>
        <div class="label">${t[catA.label]}</div>
        <div class="val b">${badgeB}${deltaB}</div>
      </div>
    `;
  }).join("");
}

// Two overlapping radar shapes on the same axes — new dedicated compare
// colors (violet / sky-blue), not the site's teal/orange brand colors.
// When neither company is picked yet, the placeholder shape renders
// smaller (180 instead of 280) so it doesn't look like a real result.
function radarOverlaySvg(catsA, catsB, t, isPlaceholder) {
  const size = isPlaceholder ? 180 : 280;
  const center = size / 2, maxR = size * 0.286; // keeps the same proportions at either size
  const n = catsA.length;
  const angleFor = i => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pointAt = (i, value) => {
    const r = (value / 5) * maxR;
    const a = angleFor(i);
    return [center + r * Math.cos(a), center + r * Math.sin(a)];
  };

  const rings = [0.2, 0.4, 0.6, 0.8, 1].map(pct => {
    const pts = catsA.map((c, i) => pointAt(i, 5 * pct).join(",")).join(" ");
    return `<polygon class="radar-ring" points="${pts}"/>`;
  }).join("");

  const spokes = catsA.map((c, i) => {
    const [x, y] = pointAt(i, 5);
    return `<line class="radar-spoke" x1="${center}" y1="${center}" x2="${x}" y2="${y}"/>`;
  }).join("");

  const shapeA = catsA.map((c, i) => pointAt(i, c.avg).join(",")).join(" ");
  const shapeB = catsB.map((c, i) => pointAt(i, c.avg).join(",")).join(" ");

  // Two labels are long enough to look cramped on one line around the
  // radar — break just these into two lines using SVG <tspan>, since a
  // plain \n does nothing inside SVG <text>. Everything else stays as
  // one line. This only affects the radar chart, not the base
  // translation strings used elsewhere (e.g. the compare-rows list).
  function wrapRadarLabel(key, text) {
    const lang = getLang();
    if (key === "catCulture" && lang === "en") return ["Company", "Culture"];
    if (key === "catWorkLife" && lang === "en") return ["Work-Life", "Balance"];
    if (key === "catWorkLife" && lang === "ar") return ["التوازن بين", "الشغل والحياة"];
    return [text];
  }

  const labels = catsA.map((c, i) => {
    const [x, y] = pointAt(i, 6.2);
    const lines = wrapRadarLabel(c.label, t[c.label]);

    if (lines.length === 1) {
      return `<text class="radar-label" x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle">${lines[0]}</text>`;
    }

    const lineHeight = 11; // px between stacked lines
    const startDy = -((lines.length - 1) * lineHeight) / 2;
    const tspans = lines.map((line, li) =>
      `<tspan x="${x}" dy="${li === 0 ? startDy : lineHeight}">${line}</tspan>`
    ).join("");
    return `<text class="radar-label" x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle">${tspans}</text>`;
  }).join("");

  return `<svg class="radar-chart" viewBox="0 0 ${size} ${size}">
    ${rings}${spokes}
    <polygon points="${shapeA}" fill="var(--compare-a)" fill-opacity="0.18" stroke="var(--compare-a)" stroke-width="2"/>
    <polygon points="${shapeB}" fill="var(--compare-b)" fill-opacity="0.18" stroke="var(--compare-b)" stroke-width="2"/>
    ${labels}
  </svg>`;
}

// =====================================================
// EVENTS
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("picker-search").addEventListener("input", (e) => {
    renderPickerGrid(e.target.value);
  });

const langBtn = document.getElementById("lang-toggle");
  if (langBtn) langBtn.addEventListener("click", () => {
    renderSlots();
    renderCompare();
  });

  renderCompare(); // show the default/neutral chart immediately on page load

  // Escape closes the picker too, same as the nav menu
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePicker();
  });
});